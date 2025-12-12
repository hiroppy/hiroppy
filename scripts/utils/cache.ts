import { AsyncLocalStorage } from "node:async_hooks";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { LinkMeta } from "../../data/type.ts";
import { baseDataPath } from "./paths.ts";
import { normalizeUrl } from "./url.ts";

export const cacheStorage = new AsyncLocalStorage<Map<string, LinkMeta>>();

export async function loadCache(): Promise<Map<string, LinkMeta>> {
  try {
    const cacheData = await readFile(join(baseDataPath, "cache.json"), "utf-8");
    const cache = JSON.parse(cacheData);
    const linkCache = new Map<string, LinkMeta>();

    for (const [url, meta] of Object.entries(cache)) {
      const normalizedUrl = normalizeUrl(url);
      const metaWithNormalizedUrl = {
        ...meta,
        url: normalizeUrl(meta.url || url),
      } as LinkMeta;
      linkCache.set(normalizedUrl, metaWithNormalizedUrl);
    }

    return linkCache;
  } catch {
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

export async function loadBlockedUrls(): Promise<Map<string, LinkMeta>> {
  try {
    const blockedUrlsData = await readFile(
      join(baseDataPath, "blocked-urls.json"),
      "utf-8",
    );
    const blockedUrls = JSON.parse(blockedUrlsData) as Record<string, LinkMeta>;
    const blockedUrlsMap = new Map<string, LinkMeta>();

    for (const [url, meta] of Object.entries(blockedUrls)) {
      const normalizedUrl = normalizeUrl(url);
      const metaWithNormalizedUrl = {
        ...meta,
        url: normalizeUrl(meta.url || url),
      } as LinkMeta;
      blockedUrlsMap.set(normalizedUrl, metaWithNormalizedUrl);
    }

    return blockedUrlsMap;
  } catch {
    return new Map<string, LinkMeta>();
  }
}

export function isUrlBlocked(
  url: string,
  blockedUrls: Map<string, LinkMeta>,
): boolean {
  const normalizedUrl = normalizeUrl(url);
  return blockedUrls.has(normalizedUrl);
}

export function getBlockedUrlMeta(
  url: string,
  blockedUrls: Map<string, LinkMeta>,
): LinkMeta | undefined {
  const normalizedUrl = normalizeUrl(url);
  return blockedUrls.get(normalizedUrl);
}

export async function collectAlreadyHavingLinks(filename: string) {
  const cache = getSharedCache();

  try {
    const { readData } = await import("./file.ts");
    const data = await readData(filename, false);

    // Extract all links from the generated data and add to cache if not exists
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.links && Array.isArray(item.links)) {
          for (const link of item.links) {
            if (typeof link === "object" && link.url) {
              const normalizedUrl = normalizeUrl(link.url);
              if (!cache.has(normalizedUrl)) {
                cache.set(normalizedUrl, link);
              }
            }
          }
        }
      }
    }

    return cache;
  } catch {
    return cache;
  }
}
