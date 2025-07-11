import type { Common } from "./type.ts";

type Media = Pick<
  Common,
  "publishedAt" | "url" | "links" | "title" | "company" | "hot"
>;

export const pressReleases = [
  {
    publishedAt: "2025-04-30",
    url: "https://prtimes.jp/main/html/rd/p/000000037.000035920.html",
    company: "stract",
  },
  {
    publishedAt: "2025-04-02",
    url: "https://prtimes.jp/main/html/rd/p/000000035.000035920.html",
    company: "stract",
  },
  {
    publishedAt: "2025-03-07",
    url: "https://prtimes.jp/main/html/rd/p/000000086.000043056.html",
  },
  {
    publishedAt: "2024-03-28",
    url: "https://route06.co.jp/news/38",
    company: "route06",
  },
  {
    publishedAt: "2023-12-15",
    url: "https://prtimes.jp/main/html/rd/p/000000097.000021828.html",
    company: "rebase",
  },
] satisfies Media[];

export const articles = [
  {
    publishedAt: "2024-08-05",
    url: "https://www.estie.jp/blog/entry/2024/08/05/183235",
    company: "estie",
  },
  {
    publishedAt: "2024-03-28",
    url: "https://tech.route06.co.jp/entry/2024/03/28/091000",
    company: "route06",
  },
  {
    publishedAt: "2024-02-15",
    url: "https://www.wantedly.com/companies/rebase/post_articles/887970",
    company: "rebase",
  },
  {
    publishedAt: "2024-02-14",
    url: "https://tskaigi.hatenablog.com/entry/2024/02/14/170000",
  },
  {
    publishedAt: "2024-01-24",
    url: "https://thisweekinreact.com/newsletter/171",
  },
  {
    publishedAt: "2023-11-15",
    url: "https://findy-code.io/engineer-lab/influential-books-3",
  },
  {
    publishedAt: "2023-09-07",
    url: "https://tech.route06.co.jp/entry/2023/09/07/091000",
    company: "route06",
  },
  {
    publishedAt: "2023-04-18",
    url: "https://findy-code.io/engineer-lab/hiroppy",
  },
  {
    publishedAt: "2022-11-10",
    url: "https://yuimedi.notion.site/52914d8c12994bdfbdf8321cd2e96d5b",
    company: "yuimedi",
  },
  {
    publishedAt: "2022-11-10",
    url: "https://yuimedi.notion.site/d8e4e0131d2e47f797ae6a161b61fb64",
    company: "yuimedi",
  },
  {
    publishedAt: "2021-08-23",
    url: "https://engineering.mercari.com/blog/entry/20210823-a57631d32e/",
    company: "mercari",
  },
  {
    publishedAt: "2021-06-04",
    url: "https://note.com/tabelog_frontend/n/n35664347180a",
    company: "kakakucom",
  },
  {
    publishedAt: "2021-04-28",
    url: "https://careers.mercari.com/mercan/articles/28113/",
    company: "mercari",
  },
  {
    publishedAt: "2020-08-31",
    url: "https://note.com/tabelog_frontend/n/n21b819c09121",
    company: "kakakucom",
  },
  {
    publishedAt: "2020-06-19",
    url: "https://nextpublishing.jp/book/11906.html",
  },
  {
    publishedAt: "2020-02-03",
    url: "https://note.com/osstokyo/n/n01a333562fad",
  },
] satisfies Media[];
