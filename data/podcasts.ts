import type { Common } from "./type.ts";

export type Podcast = Pick<
  Common,
  "publishedAt" | "url" | "hot" | "links" | "title"
>;

export const podcasts = [
  {
    publishedAt: "2025-05-17",
    url: "https://mozaic.fm/episodes/177/monthly-ecosystem-202505.html",
  },
  {
    publishedAt: "2025-04-17",
    url: "https://mozaic.fm/episodes/175/monthly-ecosystem-202504.html",
  },
  {
    publishedAt: "2025-02-20",
    url: "https://mozaic.fm/episodes/171/monthly-ecosystem-202502.html",
  },
  {
    publishedAt: "2025-01-16",
    url: "https://mozaic.fm/episodes/169/monthly-ecosystem-202501.html",
  },
  {
    publishedAt: "2024-12-10",
    url: "https://mozaic.fm/episodes/167/yearly-ecosystem-2024.html",
  },
  {
    publishedAt: "2024-11-16",
    url: "https://mozaic.fm/episodes/165/monthly-ecosystem-202411.html",
  },
  {
    publishedAt: "2024-09-20",
    url: "https://mozaic.fm/episodes/160/monthly-ecosystem-202409.html",
  },
  {
    publishedAt: "2024-08-15",
    url: "https://mozaic.fm/episodes/158/monthly-ecosystem-202408.html",
  },
  {
    publishedAt: "2024-07-18",
    url: "https://mozaic.fm/episodes/156/monthly-ecosystem-202407.html",
  },
  {
    publishedAt: "2024-06-11",
    url: "https://mozaic.fm/episodes/153/mozaic-ecosystem-202406.html",
  },
  {
    publishedAt: "2024-05-16",
    url: "https://mozaic.fm/episodes/150/monthly-ecosystem-202405.html",
  },
  {
    publishedAt: "2024-04-22",
    url: "https://mozaic.fm/episodes/148/mozaic-renewal-202404.html",
  },
  {
    publishedAt: "2024-03-26",
    url: "https://mozaic.fm/episodes/145/mozaic-renewal-202303.html",
  },
  {
    publishedAt: "2024-03-17",
    url: "https://mozaic.fm/episodes/144/monthly-ecosystem-202403.html",
  },
  {
    publishedAt: "2024-03-13",
    url: "https://mozaic.fm/episodes/143/mozaicfm-10-years-anniv.html",
  },
  {
    publishedAt: "2024-02-19",
    url: "https://mozaic.fm/episodes/141/monthly-ecosystem-202402.html",
  },
  {
    publishedAt: "2024-01-18",
    url: "https://mozaic.fm/episodes/139/monthly-ecosystem-202401.html",
  },
  {
    publishedAt: "2023-12-23",
    url: "https://mozaic.fm/episodes/137/yearly-ecosystem-2023.html",
  },
  {
    publishedAt: "2023-11-19",
    url: "https://mozaic.fm/episodes/135/monthly-ecosystem-202311.html",
  },
  {
    publishedAt: "2023-10-22",
    url: "https://mozaic.fm/episodes/133/monthly-ecosystem-202310.html",
  },
  {
    publishedAt: "2023-09-17",
    url: "https://mozaic.fm/episodes/130/monthly-ecosystem-202309.html",
  },
  {
    publishedAt: "2023-07-16",
    url: "https://mozaic.fm/episodes/126/monthly-ecosystem-202307.html",
  },
  {
    publishedAt: "2023-06-18",
    url: "https://mozaic.fm/episodes/124/monthly-ecosystem-202306.html",
  },
  {
    publishedAt: "2023-05-16",
    url: "https://mozaic.fm/episodes/121/monthly-ecosystem-202305.html",
  },
  {
    publishedAt: "2023-04-15",
    url: "https://mozaic.fm/episodes/118/monthly-ecosystem-202304.html",
  },
  {
    publishedAt: "2023-03-18",
    url: "https://mozaic.fm/episodes/116/monthly-ecosystem-202303.html",
  },
  {
    publishedAt: "2023-02-11",
    url: "https://mozaic.fm/episodes/114/monthly-ecosystem-202302.html",
  },
  {
    publishedAt: "2023-01-15",
    url: "https://mozaic.fm/episodes/112/monthly-ecosystem-202301.html",
  },
  {
    publishedAt: "2022-12-04",
    url: "https://mozaic.fm/episodes/110/yearly-ecosystem-2022.html",
  },
  {
    publishedAt: "2022-11-12",
    url: "https://mozaic.fm/episodes/108/monthly-ecosystem-202211.html",
  },
  {
    publishedAt: "2022-10-19",
    url: "https://mozaic.fm/episodes/106/monthly-ecosystem-202210.html",
  },
  {
    publishedAt: "2022-09-21",
    url: "https://mozaic.fm/episodes/104/monthly-ecosystem-202209.html",
  },
  {
    publishedAt: "2022-08-20",
    url: "https://mozaic.fm/episodes/102/monthly-ecosystem-202208.html",
  },
  {
    publishedAt: "2021-10-08",
    url: "https://uit-inside.linecorp.com/episode/100",
  },
  {
    publishedAt: "2021-09-15",
    url: "https://open.spotify.com/episode/1RfjVZhO9qNxhoTA0E6rW9",
  },
  {
    publishedAt: "2021-09-10",
    url: "https://open.spotify.com/episode/4lExWWHOz4AGxrikd8w99A",
    links: ["https://www.youtube.com/watch?v=YNLvIkqRC-g"],
  },
  {
    publishedAt: "2021-07-30",
    url: "https://uit-inside.linecorp.com/episode/93",
    links: ["https://engineering.linecorp.com/ja/blog/uit-meetup-vol-13"],
  },
] satisfies Podcast[];
