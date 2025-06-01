#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

const IMAGES_DIR = "generated/images";
const COMPRESSED_FILE = "generated/images.tar.gz";

function compressImages() {
  console.log("🗜️  Compressing images directory...");

  // Check if images directory exists
  if (!existsSync(IMAGES_DIR)) {
    console.log("❌ Images directory not found. Run build first.");
    process.exit(1);
  }

  // Remove existing compressed file if it exists
  if (existsSync(COMPRESSED_FILE)) {
    rmSync(COMPRESSED_FILE);
  }

  try {
    // Create tar.gz file
    execSync(`tar -czf ${COMPRESSED_FILE} -C generated images`, {
      stdio: "inherit",
    });

    // Remove original images directory
    rmSync(IMAGES_DIR, { recursive: true, force: true });

    console.log("✅ Images compressed successfully");
    console.log(`📦 Compressed file: ${COMPRESSED_FILE}`);

    // Show size comparison
    const compressedSize = execSync(`du -sh ${COMPRESSED_FILE}`)
      .toString()
      .split("\t")[0];
    console.log(`📊 Compressed size: ${compressedSize}`);
  } catch (error) {
    console.error("❌ Failed to compress images:", error);
    process.exit(1);
  }
}

compressImages();
