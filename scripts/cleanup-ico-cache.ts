import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CACHE_PATH = join(process.cwd(), "data/cache.json");
const IMAGES_DIR = join(process.cwd(), "generated/images");

async function cleanupIcoCache() {
  // Read cache
  const cacheContent = await readFile(CACHE_PATH, "utf-8");
  const cache = JSON.parse(cacheContent);

  let removedCount = 0;
  const icoFiles = new Set<string>();

  // Find and remove ICO favicon entries
  for (const [url, data] of Object.entries(cache)) {
    if (
      typeof data === "object" &&
      data !== null &&
      "favicon" in data &&
      typeof data.favicon === "string" &&
      data.favicon.endsWith(".ico")
    ) {
      // Extract filename from path
      const filename = data.favicon.replace("/images/", "");
      icoFiles.add(filename);

      // Clear the favicon field to force regeneration
      data.favicon = "";
      removedCount++;

      console.log(`Cleared favicon for: ${url}`);
    }
  }

  // Save updated cache
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
  console.log(`\nUpdated cache: cleared ${removedCount} ICO favicon entries`);

  // Delete ICO files from images directory
  const files = await readdir(IMAGES_DIR);
  let deletedCount = 0;

  for (const file of files) {
    if (file.endsWith(".ico") && icoFiles.has(file)) {
      await rm(join(IMAGES_DIR, file));
      deletedCount++;
      console.log(`Deleted: ${file}`);
    }
  }

  console.log(`\nDeleted ${deletedCount} ICO files from generated/images`);
  console.log(
    "\nRun 'pnpm run build:generated' to regenerate with WebP conversion",
  );
}

cleanupIcoCache().catch(console.error);
