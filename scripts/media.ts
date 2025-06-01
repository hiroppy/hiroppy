import { articles, pressReleases } from "../data/media.ts";
import { crawlSites, generateData } from "./utils/index.ts";

const data = await crawlSites("media", [...articles, ...pressReleases]);

await generateData("media", data);
