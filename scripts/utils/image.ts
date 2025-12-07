import { createWriteStream } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import sharpio from "sharp-ico";
import { baseImageOutputPath } from "./paths.ts";

async function convertIcoToPng(buffer: Buffer): Promise<Buffer> {
  try {
    const sharps = sharpio.sharpsFromIco(buffer) as sharp.Sharp[];
    if (sharps.length === 0) {
      throw new Error("No images found in ICO file");
    }
    return sharps[sharps.length - 1].png().toBuffer();
  } catch (error) {
    try {
      const decoded = sharpio.decode(buffer);
      console.warn(
        `sharp-ico conversion failed, found ${decoded.length} images:`,
        decoded.map((img) => `${img.type} (${img.width}x${img.height})`),
      );

      const pngImages = decoded.filter((img) => img.type === "png");
      if (pngImages.length > 0) {
        const largest = pngImages.reduce((max, img) =>
          img.width * img.height > max.width * max.height ? img : max,
        );
        console.warn(
          `Extracting PNG image: ${largest.width}x${largest.height}`,
        );
        return Buffer.from(largest.data);
      }

      const largest = decoded.reduce((max, img) =>
        img.width * img.height > max.width * max.height ? img : max,
      );
      if (largest.image) {
        console.warn(
          `Converting BMP image via sharp: ${largest.width}x${largest.height}`,
        );
        return await largest.image.png().toBuffer();
      }
    } catch (decodeError) {
      console.warn("Failed to decode ICO:", decodeError);
    }
    throw error;
  }
}

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
      try {
        buffer =
          ext === "webp"
            ? await sharp(source).webp().toBuffer()
            : await sharp(source).jpeg().toBuffer();
      } catch (error) {
        if (source.toLowerCase().endsWith(".ico")) {
          const icoBuffer = await readFile(source);
          const pngBuffer = await convertIcoToPng(icoBuffer);
          buffer =
            ext === "webp"
              ? await sharp(pngBuffer).webp().toBuffer()
              : await sharp(pngBuffer).jpeg().toBuffer();
        } else {
          throw error;
        }
      }
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
      } catch (_error) {
        const urlExt = source.match(/\.([a-z0-9]+)(?:[?#]|$)/i)?.[1];

        if (urlExt?.toLowerCase() === "ico") {
          try {
            const pngBuffer = await convertIcoToPng(rawBuffer);
            buffer =
              ext === "webp"
                ? await sharp(pngBuffer).webp().toBuffer()
                : await sharp(pngBuffer).jpeg().toBuffer();
          } catch (icoError) {
            console.warn(
              `ICO conversion failed for ${source}:`,
              icoError instanceof Error ? icoError.message : icoError,
            );
            finalFilename = `${Buffer.from(sourceForEncoding)
              .toString("base64")
              .replace("/", "_")
              .slice(0, 90)}.ico`;
            finalPath = `/images/${finalFilename}`;

            const assetsRefresh = await readdir(baseImageOutputPath);
            if (assetsRefresh.includes(finalFilename)) {
              return finalPath;
            }

            buffer = rawBuffer;
          }
        } else {
          console.warn(
            `Sharp conversion failed for ${source}, saving original format`,
          );

          finalFilename = `${Buffer.from(sourceForEncoding)
            .toString("base64")
            .replace("/", "_")
            .slice(0, 90)}.${urlExt || "bin"}`;
          finalPath = `/images/${finalFilename}`;

          const assetsRefresh = await readdir(baseImageOutputPath);
          if (assetsRefresh.includes(finalFilename)) {
            return finalPath;
          }

          buffer = rawBuffer;
        }
      }
    }

    createWriteStream(join(baseImageOutputPath, finalFilename)).write(buffer);

    return finalPath;
  } catch {
    return "";
  }
}
