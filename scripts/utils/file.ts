import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { baseDataPath, generatedDataPath } from "./paths.ts";
import { normalizeUrl } from "./url.ts";

export async function readData(filename: string, original = true) {
  const data = await readFile(
    join(original ? baseDataPath : generatedDataPath, `${filename}.json`),
    "utf-8",
  );

  return JSON.parse(data);
}

function processUrlsInObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj === "string") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(processUrlsInObject);
  }

  if (typeof obj === "object" && obj !== null) {
    const processed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Process URL fields
      if (key === "url" && typeof value === "string") {
        processed[key] = normalizeUrl(value);
      } else if (key === "links" && Array.isArray(value)) {
        // Process links array
        processed[key] = value.map((link) => {
          if (typeof link === "string") {
            return normalizeUrl(link);
          }
          if (link && typeof link === "object" && "url" in link) {
            return {
              ...link,
              url: link.url ? normalizeUrl(link.url as string) : link.url,
            };
          }
          return link;
        });
      } else {
        processed[key] = processUrlsInObject(value);
      }
    }
    return processed;
  }

  return obj;
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

export function sortItems(items: Array<{ publishedAt: string }>) {
  return items.sort(
    (a: { publishedAt: string }, b: { publishedAt: string }) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function convertDatesToISO(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString().split("T")[0]; // Return only the date part (YYYY-MM-DD)
  }

  if (Array.isArray(obj)) {
    return obj.map(convertDatesToISO);
  }

  if (typeof obj === "object" && obj !== null) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertDatesToISO(value);
    }
    return converted;
  }

  return obj;
}

export async function generateData(filename: string, data: unknown) {
  // Convert all Date objects to ISO strings first
  const datesConverted = convertDatesToISO(data);

  // Sort data by date if it's an array of objects with publishedAt field
  const sortedData =
    Array.isArray(datesConverted) &&
    datesConverted.length > 0 &&
    datesConverted[0]?.publishedAt
      ? sortItems(datesConverted)
      : datesConverted;

  // Trim all strings in the data
  const trimmedData = trimAllStrings(sortedData);

  // Process URLs to add trailing slashes
  const processedData = processUrlsInObject(trimmedData);

  await writeFile(
    join(generatedDataPath, `${filename}.json`),
    JSON.stringify(processedData, null, 2),
    "utf-8",
  );
}
