import { meta } from "../data/meta.ts";
import { crawlSites, generateData } from "./utils/index.ts";

// Transform community data to include links metadata
const transformedMeta = { ...meta };

// Process community links
if (meta.community) {
  const communityEntries = Object.entries(meta.community);
  const communityItems = [];

  for (const [, value] of communityEntries) {
    if (value.links && value.links.length > 0) {
      communityItems.push({
        url: value.links[0], // Use first link as main URL for metadata
        position: value.position,
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

        // Always create object format, even if crawl failed
        const links =
          crawledItem?.links?.length > 0
            ? crawledItem.links.map((link) => ({
                title: link.title || "",
                description: link.description || "",
                image: link.image || "",
                name: link.name || "",
                favicon: link.favicon || "",
                url: link.url || "",
              }))
            : value.links.map((url) => ({
                title: "",
                description: "",
                image: "",
                name: "",
                favicon: "",
                url: url,
              }));

        transformedMeta.community[key] = {
          position: value.position,
          start: value.start,
          end: value.end,
          links,
        };
      }
    }
  }
}

await generateData("meta", transformedMeta);
