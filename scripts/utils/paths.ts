import { join } from "node:path";

export const baseDataPath = join(import.meta.dirname, "../../data");
export const generatedDataPath = join(import.meta.dirname, "../../generated");
export const baseImageOutputPath = join(
  import.meta.dirname,
  "../../generated/images",
);