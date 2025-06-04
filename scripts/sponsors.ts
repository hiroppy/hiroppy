import { load } from "cheerio";
import { downloadImage, generateData } from "./utils/index.ts";

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
const sponsors = {
  current: [],
  past: [],
};

// Fetch recurring sponsors
const recurringHtml = await fetch(
  "https://github.com/sponsors/hiroppy?frequency=recurring",
).then((res) => res.text());
const $recurring = load(recurringHtml);

{
  const [currentSponsors, pastSponsors] = Array.from(
    $recurring("#sponsors-section-list > div"),
  );

  {
    const $$ = load(currentSponsors);

    const recurringCurrent = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$(el).attr("href")}`,
        avatar: await downloadImage($$(el).find("img").attr("src"), "jpg"),
        name: $$(el).find("img").attr("alt"),
        oneTime: false,
      })),
    );
    sponsors.current.push(...recurringCurrent);
  }
  {
    const $$ = load(pastSponsors);

    const recurringPast = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$(el).attr("href")}`,
        avatar: await downloadImage($$(el).find("img").attr("src"), "jpg"),
        name: $$(el).find("img").attr("alt"),
        oneTime: false,
      })),
    );

    {
      const page2 = await fetch(
        "https://github.com/sponsors/hiroppy/sponsors_partial?filter=inactive&page=2",
      );
      const $$ = load(await page2.text());
      const seconds = await Promise.all(
        Array.from($$("a")).map(async (el) => ({
          href: `https://github.com${$$(el).attr("href")}`,
          avatar: await downloadImage($$(el).find("img").attr("src"), "jpg"),
          name: $$(el).find("img").attr("alt"),
          oneTime: false,
        })),
      );

      recurringPast.push(...seconds);
    }
    sponsors.past.push(...recurringPast);
  }
}

// Fetch one-time sponsors
const oneTimeHtml = await fetch(
  "https://github.com/sponsors/hiroppy?frequency=one-time",
).then((res) => res.text());
const $oneTime = load(oneTimeHtml);

{
  const [currentSponsors, pastSponsors] = Array.from(
    $oneTime("#sponsors-section-list > div"),
  );

  if (currentSponsors) {
    const $$ = load(currentSponsors);

    const oneTimeCurrent = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$(el).attr("href")}`,
        avatar: await downloadImage($$(el).find("img").attr("src"), "jpg"),
        name: $$(el).find("img").attr("alt"),
        oneTime: true,
      })),
    );
    sponsors.current.push(...oneTimeCurrent);
  }

  if (pastSponsors) {
    const $$ = load(pastSponsors);

    const oneTimePast = await Promise.all(
      Array.from($$("a")).map(async (el) => ({
        href: `https://github.com${$$(el).attr("href")}`,
        avatar: await downloadImage($$(el).find("img").attr("src"), "jpg"),
        name: $$(el).find("img").attr("alt"),
        oneTime: true,
      })),
    );
    sponsors.past.push(...oneTimePast);
  }
}

await generateData("sponsors", sponsors);
