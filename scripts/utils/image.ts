import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { baseImageOutputPath } from "./paths.ts";

export async function downloadImage(
  source: string,
  ext: "jpg" | "webp" = "webp",
  isLocalFile = false,
) {
  if (!source) {
    return "";
  }

  try {
    const sourceForEncoding = isLocalFile 
      ? source.replace(process.cwd(), "").replace(/^\//, "") // Make relative to project root
      : source.replace(/https?:\/\//, "");
    
    const filename = `${Buffer.from(sourceForEncoding)
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