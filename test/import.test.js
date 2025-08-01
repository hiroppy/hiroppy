import assert from "node:assert";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

test("JSON files can be imported", async (t) => {
  const jsonFiles = [
    "articles.json",
    "jobs.json",
    "media.json",
    "meta.json",
    "podcasts.json",
    "repos.json",
    "sponsors.json",
    "talks.json",
  ];

  for (const file of jsonFiles) {
    await t.test(`can import ${file}`, async () => {
      const module = await import(`../generated/${file}`, {
        with: { type: "json" },
      });
      assert.ok(module.default, `${file} should have default export`);
      assert.ok(
        Array.isArray(module.default) || typeof module.default === "object",
        `${file} should export an array or object`,
      );
    });
  }
});

test("Images can be imported", async (t) => {
  const imagesDir = join(process.cwd(), "generated", "images");
  let imageFiles = [];

  try {
    imageFiles = await readdir(imagesDir);
  } catch {
    console.warn("No images directory found, skipping image tests");
    return;
  }

  const sampleImages = imageFiles.slice(0, 5);

  for (const image of sampleImages) {
    await t.test(`can access image ${image}`, async () => {
      const imagePath = join(imagesDir, image);
      const { default: fs } = await import("node:fs");
      const stats = await fs.promises.stat(imagePath);
      assert.ok(stats.isFile(), `${image} should be a file`);
      assert.ok(stats.size > 0, `${image} should not be empty`);
    });
  }
});

test("Export paths resolve correctly", async (t) => {
  await t.test("data exports resolve to generated JSON files", async () => {
    const packageJson = await import("../package.json", {
      with: { type: "json" },
    });

    assert.ok(
      packageJson.default.exports["./data/*"],
      "Package exports should include ./data/*",
    );
    assert.equal(
      packageJson.default.exports["./data/*"].import,
      "./generated/*.json",
    );
  });

  await t.test("image exports resolve to generated images", async () => {
    const packageJson = await import("../package.json", {
      with: { type: "json" },
    });

    assert.ok(
      packageJson.default.exports["./images/*"],
      "Package exports should include ./images/*",
    );
    assert.equal(
      packageJson.default.exports["./images/*"].import,
      "./generated/images/*",
    );
  });
});
