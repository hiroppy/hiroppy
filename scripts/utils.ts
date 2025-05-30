import { exec } from "node:child_process";
import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { load } from "cheerio";
import sharp from "sharp";
import type { Common } from "../data/type.ts";

const promisifyExec = promisify(exec);

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

export async function generateData(
  filename: string,
  // biome-ignore lint:
  data: Record<string, any>,
) {
  await writeFile(
    join(generatedDataPath, `${filename}.json`),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

export async function collectAlreadyHavingSites(filename: string) {
  try {
    return await readData(filename, false);
  } catch (e) {
    return [];
  }
}

export async function getMeta(url: string, title?: string) {
  // twitterはbotをつけないとogをつけない
  // nodeライブラリは基本、user-agentを変えれない
  const { stdout: html } = await promisifyExec(
    `curl '${url}' -H 'User-Agent: bot'`,
  );

  const $ = load(html);

  return {
    title: title ?? $("meta[property='og:title']").attr("content"),
    description: $("meta[property='og:description']").attr("content"),
    image: $("meta[property='og:image']").attr("content"),
    siteName: $("meta[property='og:site_name']").attr("content"),
    siteUrl: url,
  };
}

export async function crawlSites(filename: string, items: Common[]) {
  const sites = await collectAlreadyHavingSites(filename);
  const promises = items.map(
    async ({ url, comment, publishedAt, appendixes, hot, title, siteName }) => {
      const memo = sites.find(({ url: memoedUrl }) => memoedUrl === url);

      if (memo) {
        console.log("memo", url);

        return memo;
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
        const imageURL = /^http/.test(meta.image)
          ? meta.image
          : `${new URL(url).origin}${meta.image}`;

        meta.image = await downloadImage(imageURL);
      }

      return {
        ...meta,
        url,
        hot,
        comment,
        publishedAt,
        appendixes,
      };
    },
  );

  return await Promise.all(promises);
}

export function sortItems(items) {
  return items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function downloadImage(url: string, ext: "jpg" | "webp" = "webp") {
  if (!url) {
    return "";
  }

  const filename = `${Buffer.from(url.replace(/https?:\/\//, ""))
    .toString("base64")
    .replace("/", "_")
    .slice(0, 90)}.${ext}`;
  const fullPath = `/images/${filename}`;
  const assets = await readdir(baseImageOutputPath);

  if (assets.includes(filename)) {
    return fullPath;
  }

  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer =
    ext === "webp"
      ? await sharp(Buffer.from(arrayBuffer)).webp().toBuffer()
      : await sharp(Buffer.from(arrayBuffer)).jpeg().toBuffer();

  createWriteStream(join(baseImageOutputPath, filename)).write(buffer);

  return fullPath;
}
