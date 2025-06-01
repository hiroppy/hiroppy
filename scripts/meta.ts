import { meta } from "../data/meta.ts";
import { crawlSites, generateData } from "./utils/index.ts";

// Transform community data to include links metadata
const transformedMeta = { ...meta };

// Process community links
if (meta.community) {
  const communityEntries = Object.entries(meta.community);
  const communityItems = [];

  for (const [key, value] of communityEntries) {
    if (value.links && value.links.length > 0) {
      communityItems.push({
        url: value.links[0], // Use first link as main URL for metadata
        title: value.title,
        links: value.links,
        publishedAt: new Date().toISOString(), // Add dummy date for crawlSites
      });
    }
  }

  if (communityItems.length > 0) {
    const crawledItems = await crawlSites("meta", communityItems);

    // Update community data with metadata
    for (const [key, value] of communityEntries) {
      if (value.links && value.links.length > 0) {
        const crawledItem = crawledItems.find(
          (item) => item.url === value.links[0],
        );
        if (crawledItem) {
          transformedMeta.community[key] = {
            title: value.title,
            start: value.start,
            end: value.end,
            links: crawledItem.links,
          };
        }
      }
    }
  }
}

await generateData("meta", transformedMeta);
