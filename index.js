import { writeFile } from "node:fs/promises";
import { getSponsors } from "./sponsors.js";
import { generateREADME } from "./readme.js";

const sponsors = await getSponsors();

await writeFile("./README.md", generateREADME(sponsors));
