import { load } from "cheerio";
import { downloadImage, generateData } from "./utils/index.ts";

async function fetchSponsorsFromPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  return Promise.all(
    Array.from($("a")).map(async (el) => {
      const $el = $.load(el);
      const href = $el("a").attr("href");
      const imgSrc = $el("img").attr("src");
      const name = $el("img").attr("alt");

      if (!href || !imgSrc || !name) return null;

      return {
        href: `https://github.com${href}`,
        avatar: await downloadImage(imgSrc, "jpg"),
        name,
      };
    }),
  ).then((sponsors) => sponsors.filter(Boolean));
}

async function fetchAllPastSponsors() {
  const allPastSponsors = [];
  let page = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const url = `https://github.com/sponsors/hiroppy/sponsors_partial?filter=inactive&page=${page}`;
      const pageSponsors = await fetchSponsorsFromPage(url);

      if (pageSponsors.length === 0) {
        hasMorePages = false;
      } else {
        allPastSponsors.push(...pageSponsors);
        page++;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMorePages = false;
    }
  }

  return allPastSponsors;
}

const html = await fetch("https://github.com/sponsors/hiroppy").then((res) =>
  res.text(),
);
const $ = load(html);
const sponsors = {
  current: [],
  past: [],
};

const [currentSponsors, pastSponsors] = Array.from(
  $("#sponsors-section-list > div"),
);

if (currentSponsors) {
  const $$ = $.load(currentSponsors);
  sponsors.current = await Promise.all(
    Array.from($$("a")).map(async (el) => {
      const $el = $$.load(el);
      const href = $el("a").attr("href");
      const imgSrc = $el("img").attr("src");
      const name = $el("img").attr("alt");

      if (!href || !imgSrc || !name) return null;

      return {
        href: `https://github.com${href}`,
        avatar: await downloadImage(imgSrc, "jpg"),
        name,
      };
    }),
  ).then((sponsors) => sponsors.filter(Boolean));
}

if (pastSponsors) {
  const $$ = $.load(pastSponsors);
  const initialPastSponsors = await Promise.all(
    Array.from($$("a")).map(async (el) => {
      const $el = $$.load(el);
      const href = $el("a").attr("href");
      const imgSrc = $el("img").attr("src");
      const name = $el("img").attr("alt");

      if (!href || !imgSrc || !name) return null;

      return {
        href: `https://github.com${href}`,
        avatar: await downloadImage(imgSrc, "jpg"),
        name,
      };
    }),
  ).then((sponsors) => sponsors.filter(Boolean));

  const additionalPastSponsors = await fetchAllPastSponsors();
  const allPastSponsors = [...initialPastSponsors, ...additionalPastSponsors];

  // Remove duplicates based on href
  const uniquePastSponsors = allPastSponsors.filter(
    (sponsor, index, array) =>
      array.findIndex((s) => s.href === sponsor.href) === index,
  );

  sponsors.past = uniquePastSponsors;
}

await generateData("sponsors", sponsors);
