import { podcasts } from "../data/podcasts.ts";
import { crawlSites, generateData } from "./utils.ts";

const data = await crawlSites("podcasts", podcasts);

await generateData("podcasts", data);
