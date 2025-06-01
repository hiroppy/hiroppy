import type { Common, LinkMeta } from "../../data/type.ts";
import { collectAlreadyHavingLinks } from "./cache.ts";
import { downloadImage } from "./image.ts";
import { getMeta } from "./web.ts";

async function processImageUrl(
  imageUrl: string,
  baseUrl: string,
): Promise<string> {
  if (!imageUrl) return "";

  try {
    const imageURL = /^http/.test(imageUrl)
      ? imageUrl
      : `${new URL(baseUrl).origin}${imageUrl}`;

    return await downloadImage(imageURL);
  } catch (error) {
    console.error(`Failed to download image for ${baseUrl}:`, error);
    return "";
  }
}

async function processLinks(
  links: string[] | undefined,
  linkCache: Map<string, LinkMeta>,
): Promise<LinkMeta[]> {
  if (!links || links.length === 0) return [];

  const linkPromises = links.map(async (linkUrl: string): Promise<LinkMeta> => {
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
        linkMeta.image = await processImageUrl(linkMeta.image, linkUrl);
      }

      const result = linkMeta as LinkMeta;
      // Add to cache
      linkCache.set(linkUrl, result);

      return result;
    } catch (error) {
      console.error(`Failed to crawl link ${linkUrl}:`, error);
      const errorResult = {
        siteUrl: linkUrl,
        url: linkUrl,
        error: (error as Error).message,
      } as LinkMeta;

      // Add error result to cache to avoid retrying
      linkCache.set(linkUrl, errorResult);

      return errorResult;
    }
  });

  return Promise.all(linkPromises);
}

export async function crawlSites(filename: string, items: Common[]) {
  const linkCache = await collectAlreadyHavingLinks(filename);

  const promises = items.map(
    async ({ url, comment, publishedAt, links, hot, title, siteName }) => {
      const cachedSite = linkCache.get(url);

      if (cachedSite?.title && !cachedSite.error) {
        console.log("using cached site", url);

        // Process links URLs even for cached sites
        const processedLinks = await processLinks(links as string[], linkCache);

        return {
          title: cachedSite.title,
          description: cachedSite.description,
          image: cachedSite.image,
          siteName: cachedSite.siteName,
          siteUrl: cachedSite.siteUrl,
          url,
          hot,
          comment,
          publishedAt,
          links: processedLinks,
        };
      }

      console.log("new", url);

      const meta = await getMeta(url, title);

      if (siteName?.startsWith("http")) {
        const site = await getMeta(siteName);

        meta.siteName = site.title;
        meta.siteUrl = siteName;
      } else if (siteName) {
        meta.siteName = siteName;
      }

      if (meta.image) {
        meta.image = await processImageUrl(meta.image, url);
      }

      // Process links URLs
      const processedLinks = await processLinks(links as string[], linkCache);

      const result = {
        ...meta,
        url,
        hot,
        comment,
        publishedAt,
        links: processedLinks,
      };

      // Cache the main site data (without hot, comment, publishedAt for reusability)
      linkCache.set(url, {
        title: meta.title,
        description: meta.description,
        image: meta.image,
        siteName: meta.siteName,
        siteUrl: meta.siteUrl,
      } as LinkMeta);

      return result;
    },
  );

  const result = await Promise.all(promises);

  return result;
}
