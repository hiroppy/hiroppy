import { AsyncLocalStorage } from "node:async_hooks";
import { exec } from "node:child_process";
import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { load } from "cheerio";
import sharp from "sharp";
import type { Common, LinkMeta } from "../data/type.ts";

const promisifyExec = promisify(exec);

export const cacheStorage = new AsyncLocalStorage<Map<string, LinkMeta>>();

export const baseDataPath = join(import.meta.dirname, "../data");
export const generatedDataPath = join(import.meta.dirname, "../generated");
export const baseImageOutputPath = join(
  import.meta.dirname,
  "../generated/images",
);

export async function readData(filename: string, original = true) {
  const data = await readFile(
    join(original ? baseDataPath : generatedDataPath, `${filename}.json`),
    "utf-8",
  );

  return JSON.parse(data);
}

function trimAllStrings(obj: unknown): unknown {
  if (obj === null) {
    return null;
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (typeof obj === "string") {
    return obj.trim();
  }
  if (Array.isArray(obj)) {
    return obj.map(trimAllStrings);
  }
  if (typeof obj === "object") {
    const trimmed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      trimmed[key] = trimAllStrings(value);
    }
    return trimmed;
  }
  return obj;
}

export async function generateData(filename: string, data: unknown) {
  // Sort data by date if it's an array of objects with publishedAt field
  const sortedData =
    Array.isArray(data) && data.length > 0 && data[0]?.publishedAt
      ? sortItems(data)
      : data;

  // Trim all strings in the data
  const trimmedData = trimAllStrings(sortedData);

  await writeFile(
    join(generatedDataPath, `${filename}.json`),
    JSON.stringify(
      trimmedData,
      (key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      },
      2,
    ),
    "utf-8",
  );
}

export async function loadCache(): Promise<Map<string, LinkMeta>> {
  try {
    const cacheData = await readFile(join(baseDataPath, "cache.json"), "utf-8");
    const cache = JSON.parse(cacheData);
    const linkCache = new Map<string, LinkMeta>();

    for (const [url, meta] of Object.entries(cache)) {
      linkCache.set(url, meta as LinkMeta);
    }

    return linkCache;
  } catch (e) {
    return new Map<string, LinkMeta>();
  }
}

export async function saveCache(cache: Map<string, LinkMeta>) {
  try {
    // Sort keys alphabetically for consistent ordering
    const sortedEntries = Array.from(cache.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    const cacheObject = Object.fromEntries(sortedEntries);
    await writeFile(
      join(baseDataPath, "cache.json"),
      JSON.stringify(cacheObject, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Failed to save cache:", error);
  }
}

export function getSharedCache(): Map<string, LinkMeta> {
  const cache = cacheStorage.getStore();
  if (!cache) {
    throw new Error(
      "Cache not initialized. Make sure to run within cache context.",
    );
  }
  return cache;
}

export async function collectAlreadyHavingLinks(filename: string) {
  const cache = getSharedCache();

  try {
    const data = await readData(filename, false);

    // Extract all links from the generated data and add to cache if not exists
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.links && Array.isArray(item.links)) {
          for (const link of item.links) {
            if (
              typeof link === "object" &&
              link.siteUrl &&
              !cache.has(link.siteUrl)
            ) {
              cache.set(link.siteUrl, link);
            }
          }
        }
      }
    }

    return cache;
  } catch (e) {
    return cache;
  }
}

export async function getMeta(url: string, title?: string) {
  try {
    // twitterはbotをつけないとogをつけない
    // nodeライブラリは基本、user-agentを変えれない
    const { stdout: html } = await promisifyExec(
      `curl -m 10 '${url}' -H 'User-Agent: bot'`,
    );

    const $ = load(html);

    return {
      title: title ?? $("meta[property='og:title']").attr("content"),
      description: $("meta[property='og:description']").attr("content"),
      image: $("meta[property='og:image']").attr("content"),
      siteName: $("meta[property='og:site_name']").attr("content"),
      siteUrl: url,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error);
    return {
      title: title,
      description: "",
      image: "",
      siteName: "",
      siteUrl: url,
    };
  }
}

export async function crawlSites(filename: string, items: Common[]) {
  const linkCache = await collectAlreadyHavingLinks(filename);

  const promises = items.map(
    async ({ url, comment, publishedAt, links, hot, title, siteName }) => {
      const cachedSite = linkCache.get(url);

      if (cachedSite?.title && !cachedSite.error) {
        console.log("using cached site", url);
        return {
          title: cachedSite.title,
          description: cachedSite.description,
          image: cachedSite.image,
          siteName: cachedSite.siteName,
          siteUrl: cachedSite.siteUrl,
          url,
          hot,
          comment,
          publishedAt,
          links: links || [],
        };
      }

      console.log("new", url);

      const meta = await getMeta(url, title);

      if (siteName?.startsWith("http")) {
        const site = await getMeta(siteName);

        meta.siteName = site.title;
        meta.siteUrl = siteName;
      } else if (siteName) {
        meta.siteName = siteName;
      }

      if (meta.image) {
        try {
          const imageURL = /^http/.test(meta.image)
            ? meta.image
            : `${new URL(url).origin}${meta.image}`;

          meta.image = await downloadImage(imageURL);
        } catch (error) {
          console.error(`Failed to download image for ${url}:`, error);
          meta.image = "";
        }
      }

      // Process links URLs
      let processedLinks: string[] | LinkMeta[] = links || [];
      if (links && links.length > 0) {
        const linkPromises = (links as string[]).map(
          async (linkUrl: string): Promise<LinkMeta> => {
            // Check if link is already cached
            const cachedLink = linkCache.get(linkUrl);
            if (cachedLink) {
              console.log("using cached link", linkUrl);
              return cachedLink;
            }

            try {
              console.log("crawling link", linkUrl);
              const linkMeta = await getMeta(linkUrl);

              if (linkMeta.image) {
                try {
                  const imageURL = /^http/.test(linkMeta.image)
                    ? linkMeta.image
                    : `${new URL(linkUrl).origin}${linkMeta.image}`;

                  linkMeta.image = await downloadImage(imageURL);
                } catch (error) {
                  console.error(
                    `Failed to download image for ${linkUrl}:`,
                    error,
                  );
                  linkMeta.image = "";
                }
              }

              const result = linkMeta as LinkMeta;
              // Add to cache
              linkCache.set(linkUrl, result);

              return result;
            } catch (error) {
              console.error(`Failed to crawl link ${linkUrl}:`, error);
              const errorResult = {
                siteUrl: linkUrl,
                url: linkUrl,
                error: (error as Error).message,
              };

              return errorResult;
            }
          },
        );

        processedLinks = await Promise.all(linkPromises);
      }

      const result = {
        ...meta,
        url,
        hot,
        comment,
        publishedAt,
        links: processedLinks,
      };

      // Cache the main site data (without hot, comment, publishedAt for reusability)
      linkCache.set(url, {
        title: meta.title,
        description: meta.description,
        image: meta.image,
        siteName: meta.siteName,
        siteUrl: meta.siteUrl,
      } as LinkMeta);

      return result;
    },
  );

  const result = await Promise.all(promises);

  return result;
}

export function sortItems(items: Array<{ publishedAt: string }>) {
  return items.sort(
    (a: { publishedAt: string }, b: { publishedAt: string }) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function downloadImage(
  source: string,
  ext: "jpg" | "webp" = "webp",
  isLocalFile = false,
) {
  if (!source) {
    return "";
  }

  try {
    const filename = `${Buffer.from(
      isLocalFile ? source : source.replace(/https?:\/\//, ""),
    )
      .toString("base64")
      .replace("/", "_")
      .slice(0, 90)}.${ext}`;
    const fullPath = `/images/${filename}`;
    const assets = await readdir(baseImageOutputPath);

    if (assets.includes(filename)) {
      return fullPath;
    }

    let buffer: Buffer;

    if (isLocalFile) {
      buffer =
        ext === "webp"
          ? await sharp(source).webp().toBuffer()
          : await sharp(source).jpeg().toBuffer();
    } else {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      buffer =
        ext === "webp"
          ? await sharp(Buffer.from(arrayBuffer)).webp().toBuffer()
          : await sharp(Buffer.from(arrayBuffer)).jpeg().toBuffer();
    }

    createWriteStream(join(baseImageOutputPath, filename)).write(buffer);

    return fullPath;
  } catch (error) {
    console.error(`Failed to process image ${source}:`, error);
    return "";
  }
}
