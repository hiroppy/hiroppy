import type { Common } from "./type.ts";

type Talk = Pick<
  Common,
  "publishedAt" | "url" | "siteName" | "title" | "appendixes"
>;

export const talks = [
  {
    publishedAt: "2025-05-19",
    url: "https://docs.google.com/presentation/d/128j6TkIx9RvAvsukcqcKHf7mp6eU2MPTN94NZ__zYFI/edit",
    siteName: "https://stract.connpass.com/event/354163/",
  },
  {
    publishedAt: "2025-04-02",
    url: "https://docs.google.com/presentation/d/1z6aZSNjSyhdF52fNS3bPrA8eUcoUtG2mjlDh6wj1OzY/edit",
  },
  {
    publishedAt: "2025-02-27",
    url: "https://docs.google.com/presentation/d/1ae0ISg8sXLGWdIXNnEVnP14PSFRi9ouohWjCbpsPoEw/edit",
    siteName: "https://meguroes.connpass.com/event/342717/",
  },
  {
    publishedAt: "2024-09-19",
    url: "https://docs.google.com/presentation/d/1PSV8xq1GEYjLaQdT_vjlOUNlsYKsYDpPQ8SSBXahd0E/edit?usp=sharing",
    siteName: "https://layerx.connpass.com/event/328945/",
  },
  {
    publishedAt: "2022-07-26",
    url: "https://www.youtube.com/watch?v=QbWjVloaAuY",
    siteName: "https://cybozu.github.io/frontend-monthly/posts/2022-07/",
  },
  {
    publishedAt: "2021-09-15",
    url: "https://www.youtube.com/watch?v=1uCWzfaIedE",
    siteName: "https://mercari.connpass.com/event/221980/",
    appendixes: {
      blog: "https://engineering.mercari.com/blog/entry/20210817-mercari-shops-ci-cd-pr-env/",
    },
  },
  {
    publishedAt: "2021-09-01",
    url: "https://www.youtube.com/watch?v=YNLvIkqRC-g",
    siteName: "https://mercari.connpass.com/event/221978/",
    appendixes: {
      blog: "https://engineering.mercari.com/blog/entry/20210823-a57631d32e/",
    },
  },
  {
    publishedAt: "2021-08-30",
    url: "https://slides.hiroppy.me/cache-strategy-on-mercari-shops/",
    siteName: "https://nodejs.connpass.com/event/221358/",
  },
  {
    publishedAt: "2021-07-15",
    url: "https://www.youtube.com/watch?v=XyoeJ1TRaMk",
    siteName: "https://uit.connpass.com/event/216043/",
    appendixes: {
      blog: "https://engineering.linecorp.com/ja/blog/uit-meetup-vol-13/",
    },
  },
  {
    publishedAt: "2021-07-07",
    url: "https://slides.hiroppy.me/tools-history-and-future/",
    siteName: "https://uit.connpass.com/event/216043/",
    title: "ツールの成長の歴史とこれから求められるもの",
  },
  {
    publishedAt: "2021-05-26",
    url: "https://slides.hiroppy.me/sourcemap-v3/",
    siteName: "https://techfeed.connpass.com/event/213218/",
    title: "Source Maps v3",
  },
  {
    publishedAt: "2021-05-07",
    url: "https://connpass.com/event/211877/",
    siteName: "https://togetter.com/li/1708701",
    title: "Web24 (Frontend Tooling)",
  },
  {
    publishedAt: "2021-01-25",
    url: "https://slides.hiroppy.me/a-deep-dive-into-module-graph/",
    siteName: "a certain university (secret)",
    title: "a deep dive into module graph",
  },
  {
    publishedAt: "2020-04-17",
    url: "https://slides.hiroppy.me/introducing-webpack-asset-modules/",
    siteName: "remo_study",
    title: "Introducing webpack asset modules",
  },
  {
    publishedAt: "2019-10-09",
    url: "https://slides.hiroppy.me/top-level-await/",
    siteName: "tc39_study",
    title: "top level await",
  },
  {
    publishedAt: "2019-04-25",
    url: "https://slides.hiroppy.me/node-esm/",
    siteName: "Dublin Node.js Meetup",
    title: "introduce ecmascript modules of node.js",
  },
  {
    publishedAt: "2019-01-31",
    url: "https://slides.hiroppy.me/introduce-apollo/",
    siteName: "https://reactjs-meetup.connpass.com/event/115274/",
    title: "apollo と react を使ったアプリケーション設計",
  },
  {
    publishedAt: "2018-11-25",
    url: "https://slides.hiroppy.me/webpack-history/",
    siteName: "https://events.html5j.org/conference/2018/11/",
  },
  {
    publishedAt: "2018-10-24",
    url: "https://slides.hiroppy.me/the-event-loop-of-node/",
    siteName: "https://wajs.connpass.com/event/103761/",
    title: "the event loop of node",
  },
  {
    publishedAt: "2018-07-25",
    url: "https://slides.hiroppy.me/future-of-node/",
    siteName: "https://bpstudy.connpass.com/event/90777/",
    title: "future of node",
  },
  {
    publishedAt: "2018-06-26",
    url: "https://slides.hiroppy.me/worker_threads/",
    siteName: "https://roppongi-js.connpass.com/event/86684/",
    title: "Worker Threads",
  },
  {
    publishedAt: "2018-04-24",
    url: "http://slides.hiroppy.me/util.types/",
    siteName: "https://roppongi-js.connpass.com/event/82998/",
    title: "util.types",
  },
  {
    publishedAt: "2018-03-24",
    url: "http://slides.hiroppy.me/performance-timing-api-with-node.js/",
    siteName: "https://kyotojs.connpass.com/event/80019/",
    title: "performance timing api with node.js",
  },
  {
    publishedAt: "2018-03-06",
    url: "https://slides.hiroppy.me/node-core-utils/",
    siteName: "https://mercari.connpass.com/event/79046/",
  },
  {
    publishedAt: "2017-11-11",
    url: "https://slides.hiroppy.me/how-to-manage-the-document-of-Node.js/",
    siteName: "https://kbkz.connpass.com/event/5150/",
  },
  {
    publishedAt: "2017-10-08",
    url: "https://slides.hiroppy.me/the-present-and-future-of-JavaScript/",
    siteName: "https://wakate.org/2017/10/10/50threport/",
  },
  {
    publishedAt: "2017-05-29",
    url: "https://slides.hiroppy.me/nicohaco/",
    siteName: "Dwangoの社内勉強会",
  },
  {
    publishedAt: "2017-04-24",
    url: "https://slides.hiroppy.me/node8/",
    siteName: "https://nodejs.connpass.com/event/54749/",
  },
  {
    publishedAt: "2017-03-31",
    url: "https://slides.hiroppy.me/node-whatwg-url/",
    siteName: "https://nodejs.connpass.com/event/53534/",
  },
  {
    publishedAt: "2017-08-04",
    url: "https://speakerdeck.com/abouthiroppy/node8-dot-3-0nituite",
    siteName: "builderscon",
  },
  {
    publishedAt: "2016-11-20",
    url: "https://speakerdeck.com/abouthiroppy/ecmascript",
    siteName: "ALT#07 (Aizu LT)",
  },
  {
    publishedAt: "2016-11-10",
    url: "https://speakerdeck.com/abouthiroppy/repaint",
    siteName: "frontier-dev-js2 勉強会(Dwangoの社内勉強会)",
  },
  {
    publishedAt: "2016-08-10",
    url: "https://speakerdeck.com/abouthiroppy/my-tools",
    siteName: "frontier-dev-js1 勉強会(Dwangoの社内勉強会)",
  },
  {
    publishedAt: "2016-04-18",
    url: "https://speakerdeck.com/abouthiroppy/osswole-simuhua",
    siteName: "Dwangoの社内勉強会",
  },
  {
    publishedAt: "2015-10-10",
    url: "https://speakerdeck.com/abouthiroppy/react-nativewohong-tutemitahua",
    siteName: "ALT#05 (Aizu LT)",
  },
  {
    publishedAt: "2014-09-15",
    url: "https://www.slideshare.net/slideshow/mvc-39079770/39079770",
    siteName: "https://wakate.org/2014/09/16/47threport/",
  },
  {
    publishedAt: "2014-06-24",
    url: "https://www.slideshare.net/slideshow/alt01/39462934",
    siteName: "ALT#01 (Aizu LT)",
  },
] satisfies Talk[];
