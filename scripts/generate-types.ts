import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  extractCommonTypes,
  generateTypeDefinition,
} from "./utils/type-generator.ts";

const generatedDataPath = join(import.meta.dirname, "../generated");
const generatedTypesPath = join(generatedDataPath, "types");

interface TypeConfig {
  file: string;
  typeName: string;
  isArray: boolean;
}

const TYPE_CONFIGS: TypeConfig[] = [
  { file: "articles.json", typeName: "Article", isArray: true },
  { file: "jobs.json", typeName: "Jobs", isArray: false },
  { file: "media.json", typeName: "Media", isArray: true },
  { file: "meta.json", typeName: "Meta", isArray: false },
  { file: "podcasts.json", typeName: "Podcast", isArray: true },
  { file: "repos.json", typeName: "Repos", isArray: false },
  { file: "sponsors.json", typeName: "Sponsors", isArray: false },
  { file: "talks.json", typeName: "Talk", isArray: true },
];

async function generateIndexFile(): Promise<void> {
  const exports = ["export * from './common.js';"];

  for (const config of TYPE_CONFIGS) {
    const baseName = config.file.replace(".json", "");
    exports.push(`export * from './${baseName}.js';`);
  }

  const indexContent = `
${exports.join("\n")}
`;

  const indexPath = join(generatedTypesPath, "index.d.ts");
  await writeFile(indexPath, indexContent, "utf-8");
  console.log(`✅ Generated ${indexPath}`);
}

async function main(): Promise<void> {
  console.log("\n🔧 Generating TypeScript type definitions...\n");

  await rm(generatedTypesPath, { recursive: true, force: true });
  console.log("🗑️  Cleaned up old type definitions\n");

  for (const config of TYPE_CONFIGS) {
    const inputPath = join(generatedDataPath, config.file);
    const outputFileName = config.file.replace(".json", ".d.ts");
    const outputPath = join(generatedTypesPath, outputFileName);

    await generateTypeDefinition({
      inputPath,
      outputPath,
      typeName: config.typeName,
      isArray: config.isArray,
    });
  }

  await extractCommonTypes(generatedTypesPath);

  await generateIndexFile();

  console.log("\n✨ Type generation complete!\n");
}

main().catch((error) => {
  console.error("❌ Error generating types:", error);
  process.exit(1);
});
