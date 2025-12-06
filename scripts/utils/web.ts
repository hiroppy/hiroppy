import { spawn } from "node:child_process";
import { load } from "cheerio";
import type { LinkMeta } from "../../data/type.ts";
import { convertName } from "./mapping-name.ts";
import { normalizeUrl } from "./url.ts";

async function runWithSpawn(cmd: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(cmd, args, {
      shell: true,
    });
    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    }

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
  });
}

export async function getMeta(url: string, title?: string): Promise<LinkMeta> {
  try {
    if (url.startsWith("https://www.youtube.com/")) {
      console.log("----------", `curl ${url}`);
    }

    // twitterはbotをつけないとogをつけない
    // nodeライブラリは基本、user-agentを変えれない
    const command = `curl -m 10 '${url}' -H 'User-Agent: bot'`;
    const [cmd, ...args] = command.split(" ");
    const html = await runWithSpawn(cmd, args);

    if (url.startsWith("https://www.youtube.com/")) {
      console.log(html);
    }

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
