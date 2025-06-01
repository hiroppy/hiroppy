import { exec } from "node:child_process";
import { promisify } from "node:util";
import { load } from "cheerio";

const promisifyExec = promisify(exec);

export async function getMeta(url: string, title?: string) {
  try {
    // twitterはbotをつけないとogをつけない
    // nodeライブラリは基本、user-agentを変えれない
    const { stdout: html } = await promisifyExec(
      `curl -m 10 '${url}' -H 'User-Agent: bot'`,
    );

    const $ = load(html);

    return {
      title: title ?? $("meta[property='og:title']").attr("content"),
      description: $("meta[property='og:description']").attr("content"),
      image: $("meta[property='og:image']").attr("content"),
      siteName: $("meta[property='og:site_name']").attr("content"),
      siteUrl: url,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error);
    return {
      title: title,
      description: "",
      image: "",
      siteName: "",
      siteUrl: url,
    };
  }
}