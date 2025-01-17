import { load } from "cheerio";

export async function getSponsors() {
  // github apiでは過去に寄付してくれた方を取得できないのでhtmlから取る
  const html = await fetch("https://github.com/sponsors/hiroppy#sponsors").then(
    (res) => res.text()
  );
  const $ = load(html);
  const sponsors = {
    current: [],
    past: [],
  };

  const [currentSponsors, pastSponsors] = Array.from(
    $("#sponsors-section-list > div")
  );

  {
    const $$ = $.load(currentSponsors);

    sponsors.current = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$.load(el)("a").attr("href")}`,
        avatar: $$.load(el)("img").attr("src"),
        name: $$.load(el)("img").attr("alt"),
      }))
    );
  }
  {
    const $$ = $.load(pastSponsors);

    sponsors.past = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$.load(el)("a").attr("href")}`,
        avatar: $$.load(el)("img").attr("src"),
        name: $$.load(el)("img").attr("alt"),
      }))
    );

    {
      const page2 = await fetch(
        "https://github.com/sponsors/hiroppy/sponsors_partial?filter=inactive&page=2"
      );
      const $$ = $.load(await page2.text());
      const seconds = await Promise.all(
        Array.from($$("a")).map(async (el) => ({
          href: `https://github.com${$$.load(el)("a").attr("href")}`,
          avatar: $$.load(el)("img").attr("src"),
          name: $$.load(el)("img").attr("alt"),
        }))
      );

      sponsors.past.push(...seconds);
    }

    {
      const page3 = await fetch(
        "https://github.com/sponsors/hiroppy/sponsors_partial?filter=inactive&page=3"
      );
      const $$ = $.load(await page3.text());
      const seconds = await Promise.all(
        Array.from($$("a")).map(async (el) => ({
          href: `https://github.com${$$.load(el)("a").attr("href")}`,
          avatar: $$.load(el)("img").attr("src"),
          name: $$.load(el)("img").attr("alt"),
        }))
      );

      sponsors.past.push(...seconds);
    }
  }

  return sponsors;
}
