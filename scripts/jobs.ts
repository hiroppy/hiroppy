import { type JobContent, jobs, meta } from "../data/jobs.ts";
import type { LinkMeta } from "../data/type.ts";
import {
  collectAlreadyHavingLinks,
  downloadImage,
  generateData,
  getMeta,
} from "./utils.ts";

async function processJobWithLinks(job: JobContent, linkCache: Map<string, LinkMeta>): Promise<JobContent> {
  if (!job.links || job.links.length === 0) {
    return job;
  }

  console.log("processing links for", job.name);
  const linkPromises = job.links.map(async (linkUrl: string): Promise<LinkMeta> => {
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
        error: (error as Error).message,
      } as LinkMeta;
    }
  });

  const processedLinks = await Promise.all(linkPromises);

  return {
    ...job,
    links: processedLinks,
  };
}

const linkCache = await collectAlreadyHavingLinks("jobs");
const [mainJobs, sideJobs] = await Promise.all([
  Promise.all(jobs.main.map(job => processJobWithLinks(job, linkCache))),
  Promise.all(jobs.side.map(job => processJobWithLinks(job, linkCache)))
]);

await generateData("jobs", {
  meta,
  main: mainJobs,
  side: sideJobs,
});
