import type { Common, LinkMeta } from "../../data/type.ts";
import {
  collectAlreadyHavingLinks,
  getBlockedUrlMeta,
  isUrlBlocked,
  loadBlockedUrls,
} from "./cache.ts";
import { downloadImage } from "./image.ts";
import { normalizeUrl } from "./url.ts";
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
  blockedUrls: Map<string, LinkMeta>,
): Promise<LinkMeta[]> {
  if (!links || links.length === 0) return [];

  const linkPromises = links.map(async (linkUrl: string): Promise<LinkMeta> => {
    const normalizedUrl = normalizeUrl(linkUrl);
    // Check if link is already cached
    const cachedLink = linkCache.get(normalizedUrl);
    if (cachedLink) {
      console.log("using cached link", normalizedUrl);

      // Process favicon if it's still an HTTP URL
      if (cachedLink.favicon && /^https?:/.test(cachedLink.favicon)) {
        cachedLink.favicon = await processImageUrl(cachedLink.favicon, linkUrl);
        linkCache.set(normalizedUrl, cachedLink);
      }

      return cachedLink;
    }

    // Check if URL is blocked from updates
    if (isUrlBlocked(linkUrl, blockedUrls)) {
      console.log("URL is blocked from updates, using saved meta", linkUrl);
      const blockedMeta = getBlockedUrlMeta(linkUrl, blockedUrls);
      if (blockedMeta) {
        linkCache.set(normalizedUrl, blockedMeta);
        return blockedMeta;
      }
    }

    try {
      console.log("crawling link", linkUrl);
      const linkMeta = await getMeta(linkUrl);

      if (linkMeta.image) {
        linkMeta.image = await processImageUrl(linkMeta.image, linkUrl);
      }

      if (linkMeta.favicon) {
        linkMeta.favicon = await processImageUrl(linkMeta.favicon, linkUrl);
      }

      const result = linkMeta as LinkMeta;
      // Add to cache
      linkCache.set(normalizedUrl, result);

      return result;
    } catch (error) {
      console.error(`Failed to crawl link ${linkUrl}:`, error);
      const errorResult = {
        url: linkUrl,
        error: (error as Error).message,
      } as LinkMeta;

      // Add error result to cache to avoid retrying
      linkCache.set(normalizedUrl, errorResult);

      return errorResult;
    }
  });

  return Promise.all(linkPromises);
}

export async function crawlSites(filename: string, items: Common[]) {
  const linkCache = await collectAlreadyHavingLinks(filename);
  const blockedUrls = await loadBlockedUrls();

  const promises = items.map(
    async ({ url, comment, publishedAt, links, hot, title }) => {
      const normalizedUrl = normalizeUrl(url);
      const cachedSite = linkCache.get(normalizedUrl);

      // Check if the main URL is blocked from updates
      if (isUrlBlocked(url, blockedUrls)) {
        console.log("Main URL is blocked from updates, using saved meta", url);
        const blockedMeta = getBlockedUrlMeta(url, blockedUrls);

        if (blockedMeta) {
          // Process favicon if it's still an HTTP URL
          let favicon = blockedMeta.favicon || "";
          if (favicon && /^https?:/.test(favicon)) {
            favicon = await processImageUrl(favicon, url);
            blockedMeta.favicon = favicon;
            blockedUrls.set(normalizedUrl, blockedMeta);
          }

          // Process links URLs even for blocked sites
          const processedLinks = await processLinks(
            links as string[],
            linkCache,
            blockedUrls,
          );

          return {
            title: blockedMeta.title,
            description: blockedMeta.description,
            favicon,
            image: blockedMeta.image,
            name: blockedMeta.name,
            url: blockedMeta.url || url,
            hot,
            comment,
            publishedAt,
            links: processedLinks,
          };
        }
      }

      if (cachedSite?.title && !cachedSite.error && !cachedSite.skipUpdate) {
        console.log("using cached site", normalizedUrl);

        // Process favicon if it's still an HTTP URL
        let favicon = cachedSite.favicon || "";
        if (favicon && /^https?:/.test(favicon)) {
          favicon = await processImageUrl(favicon, url);
          cachedSite.favicon = favicon;
          linkCache.set(normalizedUrl, cachedSite);
        }

        // Process links URLs even for cached sites
        const processedLinks = await processLinks(
          links as string[],
          linkCache,
          blockedUrls,
        );

        return {
          title: cachedSite.title,
          description: cachedSite.description,
          image: cachedSite.image,
          name: cachedSite.name,
          url: cachedSite.url || url,
          favicon,
          hot,
          comment,
          publishedAt,
          links: processedLinks,
        };
      }

      console.log("new url", url);

      const meta = await getMeta(url, title);

      // Remove siteName processing as it's no longer used

      if (meta.image) {
        meta.image = await processImageUrl(meta.image, url);
      }

      // Process links URLs
      const processedLinks = await processLinks(
        links as string[],
        linkCache,
        blockedUrls,
      );

      const result = {
        title: meta.title,
        description: meta.description,
        image: meta.image,
        name: meta.name,
        favicon: meta.favicon || "",
        url,
        hot,
        comment,
        publishedAt,
        links: processedLinks,
      };

      // Cache the main site data (without hot, comment, publishedAt for reusability)
      linkCache.set(normalizedUrl, {
        title: meta.title,
        description: meta.description,
        image: meta.image,
        name: meta.name,
        favicon: meta.favicon || "",
        url: meta.url,
      } as LinkMeta);

      return result;
    },
  );

  const result = await Promise.all(promises);

  return result;
}
