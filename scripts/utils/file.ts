import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { baseDataPath, generatedDataPath } from "./paths.ts";

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

export function sortItems(items: Array<{ publishedAt: string }>) {
  return items.sort(
    (a: { publishedAt: string }, b: { publishedAt: string }) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
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