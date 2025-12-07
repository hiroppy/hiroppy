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
      ? source
          .replace(process.cwd(), "")
          .replace(/^\//, "") // Make relative to project root
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
    let finalFilename = filename;
    let finalPath = fullPath;

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
      const rawBuffer = Buffer.from(arrayBuffer);

      try {
        buffer =
          ext === "webp"
            ? await sharp(rawBuffer).webp().toBuffer()
            : await sharp(rawBuffer).jpeg().toBuffer();
      } catch {
        console.warn(
          `Sharp conversion failed for ${source}, saving original format`,
        );

        const urlExt = source.match(/\.([a-z0-9]+)(?:[?#]|$)/i)?.[1] || "bin";

        finalFilename = `${Buffer.from(sourceForEncoding)
          .toString("base64")
          .replace("/", "_")
          .slice(0, 90)}.${urlExt}`;
        finalPath = `/images/${finalFilename}`;

        const assetsRefresh = await readdir(baseImageOutputPath);
        if (assetsRefresh.includes(finalFilename)) {
          return finalPath;
        }

        buffer = rawBuffer;
      }
    }

    createWriteStream(join(baseImageOutputPath, finalFilename)).write(buffer);

    return finalPath;
  } catch (error) {
    console.error(`Failed to process image ${source}:`, error);
    return "";
  }
}
