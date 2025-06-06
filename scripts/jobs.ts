import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { type JobContent, jobs, meta } from "../data/jobs.ts";
import type { LinkMeta } from "../data/type.ts";
import {
  collectAlreadyHavingLinks,
  downloadImage,
  generateData,
  getMeta,
} from "./utils/index.ts";

async function processJobWithLinks(
  job: JobContent,
  linkCache: Map<string, LinkMeta>,
): Promise<JobContent> {
  if (!job.links || job.links.length === 0) {
    return job;
  }

  const isStringArray =
    job.links.length > 0 && typeof job.links[0] === "string";

  if (isStringArray) {
    const linkPromises = (job.links as string[]).map(
      async (linkUrl: string): Promise<LinkMeta> => {
        const cachedLink = linkCache.get(linkUrl);
        if (cachedLink) {
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

  return job;
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
