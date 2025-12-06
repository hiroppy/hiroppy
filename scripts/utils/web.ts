import { exec } from "node:child_process";
import { promisify } from "node:util";
import { load } from "cheerio";
import type { LinkMeta } from "../../data/type.ts";
import { convertName } from "./mapping-name.ts";
import { normalizeUrl } from "./url.ts";

const promisifyExec = promisify(exec);

export async function getMeta(url: string, title?: string): Promise<LinkMeta> {
  try {
    // twitterはbotをつけないとogをつけない
    // nodeライブラリは基本、user-agentを変えれない
    const { stdout: html } = await promisifyExec(
      `curl -m 10 '${url}' -H 'User-Agent: bot'`,
    );
    const $ = load(html);

    const faviconHref =
      $("link[rel='icon']").attr("href") ||
      $("link[rel='shortcut icon']").attr("href") ||
      $("meta[itemprop='faviconUrl']").attr("content");
    let favicon =
      faviconHref && !faviconHref.startsWith("http")
        ? new URL(faviconHref, url).href
        : faviconHref;

    if (!favicon) {
      const { favicon: f } = mappedSite(url);

      favicon = f;
    }

    return {
      title:
        title ??
        ($("meta[property='og:title']").attr("content") ||
          $("meta[name='og:title']").attr("content") ||
          $("title").text()),
      description:
        $("meta[property='og:description']").attr("content") ||
        $("meta[name='og:description']").attr("content"),
      image:
        $("meta[property='og:image']").attr("content") ||
        $("meta[name='og:image']").attr("content"),
      name: convertName(
        $("meta[property='og:site_name']").attr("content") ||
          $("meta[name='og:site_name']").attr("content"),
      ),
      favicon: favicon,
      url: normalizeUrl(url),
    };
  } catch {
    return {
      title,
      description: "",
      image: "",
      name: "",
      url: normalizeUrl(url),
      favicon: "",
    };
  }
}

// TODO: move
function mappedSite(url: string) {
  const sites = [
    {
      match: /careers\.mercari\.com\/mercan/,
      favicon: "https://careers.mercari.com/favicon.ico",
    },
    {
      match: /www\.youtube\.com/,
      favicon:
        "https://www.youtube.com/s/desktop/31c2c151/img/favicon_32x32.png",
    },
  ];

  for (const site of sites) {
    if (site.match.test(url)) {
      return site;
    }
  }

  return {
    favicon: "",
  };
}
