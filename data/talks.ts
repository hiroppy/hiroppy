import type { Common } from "./type.ts";

type Talk = Pick<Common, "publishedAt" | "url" | "title" | "links">;

export const talks = [
  {
    publishedAt: "2025-05-19",
    url: "https://docs.google.com/presentation/d/128j6TkIx9RvAvsukcqcKHf7mp6eU2MPTN94NZ__zYFI/edit",
    links: ["https://stract.connpass.com/event/354163/"],
  },
  {
    publishedAt: "2025-04-02",
    url: "https://docs.google.com/presentation/d/1z6aZSNjSyhdF52fNS3bPrA8eUcoUtG2mjlDh6wj1OzY/edit",
  },
  {
    publishedAt: "2025-03-28",
    url: "https://docs.google.com/presentation/d/1WxxeCzsjgZS_vjInk_NO-NLYCJEj-DblswDEHeBXhjE/edit",
  },
  {
    publishedAt: "2025-02-27",
    url: "https://docs.google.com/presentation/d/1ae0ISg8sXLGWdIXNnEVnP14PSFRi9ouohWjCbpsPoEw/edit",
    links: ["https://meguroes.connpass.com/event/342717/"],
  },
  {
    publishedAt: "2024-09-19",
    url: "https://docs.google.com/presentation/d/1PSV8xq1GEYjLaQdT_vjlOUNlsYKsYDpPQ8SSBXahd0E/edit?usp=sharing",
    links: ["https://layerx.connpass.com/event/328945/"],
  },
  {
    publishedAt: "2022-07-26",
    url: "https://www.youtube.com/watch?v=QbWjVloaAuY",
    links: ["https://cybozu.github.io/frontend-monthly/posts/2022-07/"],
  },
  {
    publishedAt: "2021-09-15",
    url: "https://www.youtube.com/watch?v=1uCWzfaIedE",
    links: [
      "https://mercari.connpass.com/event/221980/",
      "https://engineering.mercari.com/blog/entry/20210817-mercari-shops-ci-cd-pr-env/",
    ],
  },
  {
    publishedAt: "2021-09-01",
    url: "https://www.youtube.com/watch?v=YNLvIkqRC-g",
    links: [
      "https://mercari.connpass.com/event/221978/",
      "https://engineering.mercari.com/blog/entry/20210823-a57631d32e/",
    ],
  },
  {
    publishedAt: "2021-08-30",
    url: "https://slides.hiroppy.me/cache-strategy-on-mercari-shops/",
    links: ["https://nodejs.connpass.com/event/221358/"],
  },
  {
    publishedAt: "2021-07-15",
    url: "https://www.youtube.com/watch?v=XyoeJ1TRaMk",
    links: [
      "https://uit.connpass.com/event/216043/",
      "https://engineering.linecorp.com/ja/blog/uit-meetup-vol-13/",
    ],
  },
  {
    publishedAt: "2021-07-07",
    url: "https://slides.hiroppy.me/tools-history-and-future/",
    links: ["https://uit.connpass.com/event/216043/"],
  },
  {
    publishedAt: "2021-05-26",
    url: "https://slides.hiroppy.me/sourcemap-v3/",
    links: ["https://techfeed.connpass.com/event/213218/"],
  },
  {
    publishedAt: "2021-05-07",
    url: "https://connpass.com/event/211877/",
    links: ["https://togetter.com/li/1708701"],
    title: "Web24 (Frontend Tooling)",
  },
  {
    publishedAt: "2021-01-25",
    url: "https://slides.hiroppy.me/a-deep-dive-into-module-graph/",
  },
  {
    publishedAt: "2020-04-17",
    url: "https://slides.hiroppy.me/introducing-webpack-asset-modules/",
    links: ["https://live.remo.co/e/remo_study/register"],
  },
  {
    publishedAt: "2019-10-09",
    url: "https://slides.hiroppy.me/top-level-await/",
    links: ["https://web-study.connpass.com/event/147538/"],
  },
  {
    publishedAt: "2019-04-25",
    url: "https://slides.hiroppy.me/node-esm/",
    links: [
      "https://www.meetup.com/ja-JP/Dublin-Node-js-Meetup/events/260666447/",
    ],
  },
  {
    publishedAt: "2019-01-31",
    url: "https://slides.hiroppy.me/introduce-apollo/",
    links: ["https://reactjs-meetup.connpass.com/event/115274/"],
  },
  {
    publishedAt: "2018-11-25",
    url: "https://slides.hiroppy.me/webpack-history/",
    links: ["https://events.html5j.org/conference/2018/11/"],
  },
  {
    publishedAt: "2018-10-24",
    url: "https://slides.hiroppy.me/the-event-loop-of-node/",
    links: ["https://wajs.connpass.com/event/103761/"],
  },
  {
    publishedAt: "2018-07-25",
    url: "https://slides.hiroppy.me/future-of-node/",
    links: ["https://bpstudy.connpass.com/event/90777/"],
  },
  {
    publishedAt: "2018-06-26",
    url: "https://slides.hiroppy.me/worker_threads/",
    links: ["https://roppongi-js.connpass.com/event/86684/"],
  },
  {
    publishedAt: "2018-04-24",
    url: "http://slides.hiroppy.me/util.types/",
    links: ["https://roppongi-js.connpass.com/event/82998/"],
  },
  {
    publishedAt: "2018-03-24",
    url: "http://slides.hiroppy.me/performance-timing-api-with-node.js/",
    links: ["https://kyotojs.connpass.com/event/80019/"],
  },
  {
    publishedAt: "2018-03-06",
    url: "https://slides.hiroppy.me/node-core-utils/",
    links: ["https://mercari.connpass.com/event/79046/"],
  },
  {
    publishedAt: "2017-11-11",
    url: "https://slides.hiroppy.me/how-to-manage-the-document-of-Node.js/",
    links: ["https://kbkz.connpass.com/event/5150/"],
  },
  {
    publishedAt: "2017-10-08",
    url: "https://slides.hiroppy.me/the-present-and-future-of-JavaScript/",
    links: ["https://wakate.org/2017/10/10/50threport/"],
  },
  {
    publishedAt: "2017-05-29",
    url: "https://slides.hiroppy.me/nicohaco/",
    title: "nicohacoを作った",
  },
  {
    publishedAt: "2017-04-24",
    url: "https://slides.hiroppy.me/node8/",
    links: ["https://nodejs.connpass.com/event/54749/"],
  },
  {
    publishedAt: "2017-03-31",
    url: "https://slides.hiroppy.me/node-whatwg-url/",
    links: ["https://nodejs.connpass.com/event/53534/"],
  },
  {
    publishedAt: "2017-08-04",
    url: "https://speakerdeck.com/abouthiroppy/node8-dot-3-0nituite",
  },
  {
    publishedAt: "2016-11-20",
    url: "https://speakerdeck.com/abouthiroppy/ecmascript",
  },
  {
    publishedAt: "2016-11-10",
    url: "https://speakerdeck.com/abouthiroppy/repaint",
  },
  {
    publishedAt: "2016-08-10",
    url: "https://speakerdeck.com/abouthiroppy/my-tools",
    title: "最近の自分のツール事情",
  },
  {
    publishedAt: "2016-04-18",
    url: "https://speakerdeck.com/abouthiroppy/osswole-simuhua",
  },
  {
    publishedAt: "2015-10-10",
    url: "https://speakerdeck.com/abouthiroppy/react-nativewohong-tutemitahua",
  },
  {
    publishedAt: "2014-09-15",
    url: "https://www.slideshare.net/slideshow/mvc-39079770/39079770",
    links: ["https://wakate.org/2014/09/16/47threport/"],
  },
  {
    publishedAt: "2014-06-24",
    url: "https://www.slideshare.net/slideshow/alt01/39462934",
  },
] satisfies Talk[];
