import { talks } from "../data/talks.ts";
import { crawlSites, generateData } from "./utils.ts";

const data = await crawlSites("talks", talks);
const errors = [];

// validate
for (const talk of data) {
  if (!talk.title) {
    console.log(talk);
    errors.push(talk.publishedAt);
  }
}

if (errors.length !== 0) {
  process.exit(1);
}

// connpassのog:titleに付いている日付を消す
for (const talk of data) {
  if (talk.siteName) {
    talk.siteName = talk.siteName.replace(/\(.+?\)$/, "").trim();
  }
}

await generateData("talks", data);
