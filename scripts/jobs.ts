import { jobs, meta } from "../data/jobs.ts";
import { generateData } from "./utils.ts";

await generateData("jobs", {
  meta,
  ...jobs,
});
