import { type JobContent, jobs, meta } from "../data/jobs.ts";
import type { LinkMeta } from "../data/type.ts";
import {
  collectAlreadyHavingLinks,
  downloadImage,
  generateData,
  getMeta,
} from "./utils.ts";

async function crawlJobLinks(
  jobContents: JobContent[],
  filename: string,
): Promise<JobContent[]> {
  const linkCache = await collectAlreadyHavingLinks(filename);

  const promises = jobContents.map(async (job) => {
    if (!job.links || job.links.length === 0) {
      return job;
    }

    console.log("processing links for", job.name);
    const linkPromises = job.links.map(async (linkUrl): Promise<LinkMeta> => {
      // Check if link is already cached
      const cachedLink = linkCache.get(linkUrl);
      if (cachedLink) {
        console.log("using cached link", linkUrl);
        return cachedLink;
      }

      try {
        console.log("crawling link", linkUrl);
        const linkMeta = await getMeta(linkUrl);

        if (linkMeta.image) {
          const imageURL = /^http/.test(linkMeta.image)
            ? linkMeta.image
            : `${new URL(linkUrl).origin}${linkMeta.image}`;

          linkMeta.image = await downloadImage(imageURL);
        }

        return linkMeta as LinkMeta;
      } catch (error) {
        console.error(`Failed to crawl link ${linkUrl}:`, error);
        return {
          siteUrl: linkUrl,
          url: linkUrl,
          error: error.message,
        } as LinkMeta;
      }
    });

    const processedLinks = await Promise.all(linkPromises);

    return {
      ...job,
      links: processedLinks,
    };
  });

  return await Promise.all(promises);
}

// Crawl links for main jobs
const mainJobs = await crawlJobLinks(jobs.main, "jobs");

// Crawl links for side jobs
const sideJobs = await crawlJobLinks(jobs.side, "jobs");

await generateData("jobs", {
  meta,
  main: mainJobs,
  side: sideJobs,
});
