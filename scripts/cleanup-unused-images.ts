import { readFile, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { baseImageOutputPath, generatedDataPath } from "./utils.ts";

try {
  const result = await cleanupUnusedImages();
  printSummary(result);

  if (result.errors.length > 0) {
    console.error("\n⚠️  Process completed with errors");
    process.exit(1);
  } else {
    console.log("\n✨ Cleanup completed successfully!");
    process.exit(0);
  }
} catch (error) {
  console.error("\n💥 Fatal error during cleanup:", error);
  process.exit(1);
}

type ImageCleanupResult = {
  totalImages: number;
  referencedImages: Set<string>;
  unusedImages: string[];
  deletedImages: string[];
  errors: string[];
};

async function cleanupUnusedImages(): Promise<ImageCleanupResult> {
  const result: ImageCleanupResult = {
    totalImages: 0,
    referencedImages: new Set(),
    unusedImages: [],
    deletedImages: [],
    errors: [],
  };

  try {
    console.log("🔍 Starting image cleanup process...");

    // Step 1: Get all JSON files in the generated directory
    const jsonFiles = await getJsonFiles();
    console.log(`📄 Found ${jsonFiles.length} JSON files to scan`);

    // Step 2: Extract all image references from JSON files
    result.referencedImages = await extractImageReferences(jsonFiles);
    console.log(`🖼️  Found ${result.referencedImages.size} referenced images`);

    // Step 3: Get all actual images in the images directory
    const actualImages = await getActualImages();
    result.totalImages = actualImages.length;
    console.log(`📁 Found ${result.totalImages} actual images in directory`);

    // Step 4: Identify unused images
    result.unusedImages = actualImages.filter(
      (image) => !result.referencedImages.has(`/images/${image}`),
    );
    console.log(`🗑️  Identified ${result.unusedImages.length} unused images`);

    // Step 5: Delete unused images (with safety check)
    if (result.unusedImages.length > 0) {
      console.log("🚮 Deleting unused images...");
      for (const image of result.unusedImages) {
        try {
          await unlink(join(baseImageOutputPath, image));
          result.deletedImages.push(image);
          console.log(`   ✅ Deleted: ${image}`);
        } catch (error) {
          const errorMsg = `Failed to delete ${image}: ${error}`;
          result.errors.push(errorMsg);
          console.error(`   ❌ ${errorMsg}`);
        }
      }
    } else {
      console.log("✨ No unused images found - directory is clean!");
    }

    return result;
  } catch (error) {
    result.errors.push(`Cleanup process failed: ${error}`);
    throw error;
  }
}

async function getJsonFiles(): Promise<string[]> {
  try {
    const files = await readdir(generatedDataPath);
    return files.filter((file) => file.endsWith(".json"));
  } catch (error) {
    throw new Error(`Failed to read generated directory: ${error}`);
  }
}

async function extractImageReferences(
  jsonFiles: string[],
): Promise<Set<string>> {
  const imageReferences = new Set<string>();

  for (const file of jsonFiles) {
    try {
      const filePath = join(generatedDataPath, file);
      const content = await readFile(filePath, "utf-8");
      const data = JSON.parse(content);

      // Extract image references from the JSON data
      extractImagesFromObject(data, imageReferences);
    } catch (error) {
      console.warn(`⚠️  Warning: Failed to process ${file}: ${error}`);
    }
  }

  return imageReferences;
}

function extractImagesFromObject(
  obj: string | Record<string, string>,
  imageReferences: Set<string>,
): void {
  if (typeof obj === "string" && obj.startsWith("/images/")) {
    imageReferences.add(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      extractImagesFromObject(item, imageReferences);
    }
  } else if (obj && typeof obj === "object") {
    for (const value of Object.values(obj)) {
      extractImagesFromObject(value, imageReferences);
    }
  }
}

async function getActualImages(): Promise<string[]> {
  try {
    const files = await readdir(baseImageOutputPath);
    return files.filter((file) => {
      // Filter for common image extensions
      const ext = file.toLowerCase();
      return (
        ext.endsWith(".webp") ||
        ext.endsWith(".jpg") ||
        ext.endsWith(".jpeg") ||
        ext.endsWith(".png")
      );
    });
  } catch (error) {
    throw new Error(`Failed to read images directory: ${error}`);
  }
}

function printSummary(result: ImageCleanupResult): void {
  console.log(`\n${"=".repeat(50)}`);
  console.log("📊 CLEANUP SUMMARY");
  console.log("=".repeat(50));
  console.log(`📁 Total images checked: ${result.totalImages}`);
  console.log(`🔗 Referenced images: ${result.referencedImages.size}`);
  console.log(`🗑️  Unused images found: ${result.unusedImages.length}`);
  console.log(`✅ Successfully deleted: ${result.deletedImages.length}`);
  console.log(`❌ Deletion errors: ${result.errors.length}`);

  if (result.deletedImages.length > 0) {
    console.log("\n🗑️  Deleted files:");
    for (const image of result.deletedImages) {
      console.log(`   - ${image}`);
    }
  }

  if (result.errors.length > 0) {
    console.log("\n❌ Errors encountered:");
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
  }

  const savedSpace = result.deletedImages.length;
  if (savedSpace > 0) {
    console.log(
      `\n💾 Freed up space by removing ${savedSpace} unused image${savedSpace === 1 ? "" : "s"}`,
    );
  }

  console.log("=".repeat(50));
}
