import { AsyncLocalStorage } from "node:async_hooks";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { LinkMeta } from "../../data/type.ts";
import { baseDataPath } from "./paths.ts";

export const cacheStorage = new AsyncLocalStorage<Map<string, LinkMeta>>();

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
    const { readData } = await import("./file.ts");
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
