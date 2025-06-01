#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const IMAGES_DIR = "generated/images";
const COMPRESSED_FILE = "generated/images.tar.gz";

function decompressImages() {
  console.log("📦 Decompressing images...");

  // Check if compressed file exists
  if (!existsSync(COMPRESSED_FILE)) {
    console.log("ℹ️  No compressed images file found. Skipping decompression.");
    return;
  }

  // Check if images directory already exists
  if (existsSync(IMAGES_DIR)) {
    console.log("ℹ️  Images directory already exists. Skipping decompression.");
    return;
  }

  try {
    // Ensure generated directory exists
    if (!existsSync("generated")) {
      mkdirSync("generated", { recursive: true });
    }

    // Extract tar.gz file
    execSync(`tar -xzf ${COMPRESSED_FILE} -C generated`, { stdio: "inherit" });

    console.log("✅ Images decompressed successfully");
    console.log(`📁 Images available at: ${IMAGES_DIR}`);
  } catch (error) {
    console.error("❌ Failed to decompress images:", error);
    console.error(
      "⚠️  You may need to manually extract the images from:",
      COMPRESSED_FILE,
    );
  }
}

decompressImages();
