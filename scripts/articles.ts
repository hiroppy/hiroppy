import { load } from "cheerio";
import { hatena } from "../data/hatena.ts";
import { generateData, sortItems } from "./utils.ts";

// hatena
const hatenaArticles = await parseRss(
  "https://abouthiroppy.hatenablog.jp/rss?size=100",
  undefined,
  false,
);

const allArticles = [...hatenaArticles];

await Promise.all(
  allArticles
    .filter(article => article.hot)
    .map(async (article) => {
      const { host, pathname } = new URL(article.url);
      const isHatena = host === "abouthiroppy.hatenablog.jp";
      const hostname = isHatena ? "blog.hiroppy.me" : host;

      article.bookmark = await getBookmark(`https://${hostname}${pathname}`);

      if (isHatena) {
        const newPathname = pathname.replace("/entry", "");
        article.url = `https://hiroppy.me/blog${newPathname}`;
      }
    })
);

await generateData("articles", allArticles.sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
));

async function getBookmark(entry: string): Promise<number> {
  try {
    const url = `https://b.hatena.ne.jp/entry/json/${entry}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error(`Failed to fetch bookmark for ${entry}:`, error);
    return 0;
  }
}

type Article = {
  hot: boolean;
  url: string;
  title: string;
  image: string;
  description: string;
  publishedAt: string;
  siteName: string;
  siteUrl: string;
  bookmark?: number;
};

async function parseRss(
  url: string,
  skippingConditionDate?: string,
  isShowDescription = true,
): Promise<Article[]> {
  const res = await fetch(url)
    .then((res) => res.text())
    .then((res) =>
      // cheerioはlinkのタグを抽出できない
      res
        .replace(/\<(link)\>/g, "<linkTag>")
        .replace(/\<\/(link)\>/g, "</linkTag>"),
    );
  const platform = {
    siteName: removeCData(load(res)("channel > title").text()),
    siteUrl: load(res)("channel > linkTag").text(),
  };
  const items = (
    await Promise.all(
      load(res)("item")
        .toArray()
        .map(async (item) => {
          const $ = load(item);
          const link = $("linkTag").text();
          const publishedAt = `${new Date(
            $("pubDate").text(),
          ).toISOString()}`.split("T")[0];

          if (
            skippingConditionDate &&
            new Date(publishedAt) < new Date(skippingConditionDate)
          ) {
            return false;
          }

          return {
            ...platform,
            hot: hatena.hot.includes(link),
            url: link,
            title: removeCData($("title").text()),
            // NOTE: ローカルに保存しない
            image: $("enclosure").attr("url"),
            description: isShowDescription
              ? removeCData($("description").text())
              : "",
            publishedAt,
          };
        }),
    )
  ).filter((item): item is Article => Boolean(item));

  return items;
}

function removeCData(str: string): string {
  const match = str.match(/<!\[CDATA\[(.+?)\]\]>/);
  return match?.[1] ?? str;
}
