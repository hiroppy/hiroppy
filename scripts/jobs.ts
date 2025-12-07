import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { type JobContent, jobs, meta } from "../data/jobs.ts";
import { articles, pressReleases } from "../data/media.ts";
import type { LinkMeta } from "../data/type.ts";
import {
  collectAlreadyHavingLinks,
  downloadImage,
  generateData,
  getMeta,
} from "./utils/index.ts";

function getMediaLinksByCompany(
  companyKey: string,
  jobStart: Date,
  jobEnd: Date | null,
): string[] {
  const allMedia = [...articles, ...pressReleases];
  return allMedia
    .filter((media) => {
      if (media.company !== companyKey) return false;

      // Parse the article's published date (format: YYYY-MM-DD)
      const articleDate = new Date(media.publishedAt);

      // Check if article date falls within job period
      const isAfterStart = articleDate >= jobStart;
      const isBeforeEnd = jobEnd === null || articleDate <= jobEnd;

      return isAfterStart && isBeforeEnd;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map((media) => media.url);
}

async function processJobWithLinks(
  job: JobContent,
  linkCache: Map<string, LinkMeta>,
): Promise<JobContent> {
  // Get media articles for this job's company within the job period
  const mediaLinks = getMediaLinksByCompany(job.company, job.start, job.end);

  // Combine existing links with media links
  const existingLinks = job.links || [];
  const existingLinkUrls = new Set(
    typeof existingLinks[0] === "string"
      ? (existingLinks as string[])
      : ((existingLinks as LinkMeta[])
          .map((link) => link.url)
          .filter(Boolean) as string[]),
  );

  // Add media links that aren't already in existing links
  const newMediaLinks = mediaLinks.filter((url) => !existingLinkUrls.has(url));
  const allLinks = [...(existingLinks as string[]), ...newMediaLinks];

  if (allLinks.length === 0) {
    return job;
  }

  // Always treat as string array since we've combined everything as URLs
  const linkPromises = allLinks.map(
    async (linkUrl: string): Promise<LinkMeta> => {
      const cachedLink = linkCache.get(linkUrl);
      if (cachedLink) {
        // Process favicon if it's still an HTTP URL
        if (cachedLink.favicon && /^https?:/.test(cachedLink.favicon)) {
          const faviconURL = /^http/.test(cachedLink.favicon)
            ? cachedLink.favicon
            : `${new URL(linkUrl).origin}${cachedLink.favicon}`;
          cachedLink.favicon = await downloadImage(faviconURL);
          linkCache.set(linkUrl, cachedLink);
        }

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

        if (linkMeta.favicon) {
          const faviconURL = /^http/.test(linkMeta.favicon)
            ? linkMeta.favicon
            : `${new URL(linkUrl).origin}${linkMeta.favicon}`;

          linkMeta.favicon = await downloadImage(faviconURL);
        }

        const result = linkMeta as LinkMeta;

        linkCache.set(linkUrl, result);

        return result;
      } catch (error) {
        console.error(`Failed to crawl link ${linkUrl}:`, error);
        const errorResult = {
          url: linkUrl,
          error: (error as Error).message,
        } as LinkMeta;

        return errorResult;
      }
    },
  );

  const processedLinks = await Promise.all(linkPromises);
  return {
    ...job,
    links: processedLinks,
  };
}

async function processCompanyImages(metaObj: typeof meta) {
  const COMPANIES_DIR = join(process.cwd(), "public/companies");

  try {
    const files = await readdir(COMPANIES_DIR);
    const updatedMeta = { ...metaObj };

    for (const companyKey of Object.keys(metaObj)) {
      const companyMeta = metaObj[companyKey as keyof typeof metaObj];
      const imageName = companyMeta.image;

      // 画像が定義されていない場合はスキップ
      if (!imageName) {
        console.log(`⚠️  No image defined for ${companyKey}`);
        continue;
      }

      // 画像ファイルが存在するか確認
      if (!files.includes(imageName)) {
        console.log(`⚠️  Image file ${imageName} not found for ${companyKey}`);
        continue;
      }

      // 画像のフルパスを作成
      const imagePath = join(COMPANIES_DIR, imageName);

      // downloadImage関数を使用して画像を処理
      try {
        // 第3引数にtrueを指定してローカルファイルとして処理
        const relativePath = await downloadImage(imagePath, "webp", true);

        if (relativePath) {
          // metaの画像パスを更新
          (updatedMeta[companyKey as keyof typeof metaObj] as {
            image: string;
            url: string;
          }) = {
            ...companyMeta,
            image: relativePath,
          };
        }
      } catch (error) {
        console.error(`❌  Failed to process ${imageName}:`, error);
      }
    }

    return updatedMeta;
  } catch (error) {
    console.error("❌  Failed to process company images:", error);
    return metaObj;
  }
}

const linkCache = await collectAlreadyHavingLinks("jobs");
const [mainJobs, sideJobs] = await Promise.all([
  Promise.all(jobs.main.map((job) => processJobWithLinks(job, linkCache))),
  Promise.all(jobs.side.map((job) => processJobWithLinks(job, linkCache))),
]);

const updatedMeta = await processCompanyImages(meta);

await generateData("jobs", {
  meta: updatedMeta,
  main: mainJobs,
  side: sideJobs,
});
