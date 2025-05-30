import { load } from "cheerio";
import { downloadImage, generateData } from "./utils.ts";

// github apiでは過去に寄付してくれた方を取得できないのでhtmlから取る
// await octokit.graphql(`
//     {
//       user(login: "hiroppy") {
//         sponsorshipsAsMaintainer(first: 100) {
//           nodes {
//             sponsorEntity {
//               ... on User {
//                 avatarUrl
//                 url
//               }
//             }
//           }
//         }
//       }
//     }
// `);
const html = await fetch("https://github.com/sponsors/hiroppy#sponsors").then(
  (res) => res.text(),
);
const $ = load(html);
const sponsors = {
  current: [],
  past: [],
};

const [currentSponsors, pastSponsors] = Array.from(
  $("#sponsors-section-list > div"),
);

{
  const $$ = $.load(currentSponsors);

  sponsors.current = await Promise.all(
    Array.from($$("a")).map(async (el) => ({
      href: `https://github.com${$$.load(el)("a").attr("href")}`,
      avatar: await downloadImage($$.load(el)("img").attr("src"), "jpg"),
      name: $$.load(el)("img").attr("alt"),
    })),
  );
}
{
  const $$ = $.load(pastSponsors);

  sponsors.past = await Promise.all(
    Array.from($$("a")).map(async (el) => ({
      href: `https://github.com${$$.load(el)("a").attr("href")}`,
      avatar: await downloadImage($$.load(el)("img").attr("src"), "jpg"),
      name: $$.load(el)("img").attr("alt"),
    })),
  );

  {
    const page2 = await fetch(
      "https://github.com/sponsors/hiroppy/sponsors_partial?filter=inactive&page=2",
    );
    const $$ = $.load(await page2.text());
    const seconds = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$.load(el)("a").attr("href")}`,
        avatar: await downloadImage($$.load(el)("img").attr("src"), "jpg"),
        name: $$.load(el)("img").attr("alt"),
      })),
    );

    sponsors.past.push(...seconds);
  }
}

await generateData("sponsors", sponsors);
