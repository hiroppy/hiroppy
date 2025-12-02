import type { CompanyKey } from "./companies.ts";
import type { LinkMeta } from "./type.ts";

// Re-export for backward compatibility
export { companies as meta } from "./companies.ts";

export type Job = {
  main: JobContent[];
  side: JobContent[];
};

export type JobContent = {
  name: string;
  description: string;
  start: Date;
  end: Date | null;
  position:
    | "Founder"
    | "VPoE"
    | "Technical Advisor"
    | "Architect"
    | "Engineer"
    | "Intern"
    | "Enabling Team"
    | "Enabling Team (Frontend/LLM)";
  initialState: "0" | "1-100" | "100";
  links: string[] | LinkMeta[];
  company: CompanyKey;
};

const railsToNext = "Ruby on RailsからNext.jsへの移行方針の設計支援";
const nextJsAppRouterArchitecture = "Next.js App Routerアーキテクチャ設計支援";
const nodeArchitectureDDD =
  "Node.jsアーキテクチャ設計支援 (DDD, Clean Architecture)";
const frontEndInfraMonorepo =
  "フロントエンドインフラ改善支援 (Monorepo, CI/CD, Bundler, etc)";
const llmEfficiencyInfrastructure = "LLM効率化のための基盤作成支援";
const engineerRecruitSupport = "エンジニア採用支援";
const replaceMigrationSupport = "リプレイス移行設計支援";
const newProductDesignSupport = "新規プロダクト設計支援";
const engineerGrowthSupport = "エンジニア育成";
const highTrafficDesignSupport =
  "大規模トラフィックに耐えうる設計、パフォーマンスチューニング支援";

export const jobs: Job = {
  main: [
    {
      name: "Coder Penguin",
      start: new Date("2024-04-01"),
      end: null,
      position: "Founder",
      initialState: "0",
      description: `
合同会社Coder Penguinでは、多くの会社で技術顧問として様々な会社の支援を行う。

- Next.js, Node.jsなどのアーキテクチャ設計
- 大規模フロントエンドのパフォーマンスチューニング
- LLMを利用したアプリケーション開発支援
- エンジニア採用支援
- エンジニア組織計画と成長戦略相談

何をやったかは、My Companyセクションを参照。
      `,
      company: "coderPenguin",
      links: [],
    },
    {
      name: "Yuimedi",
      start: new Date("2022-08-01"),
      end: new Date("2025-03-31"),
      position: "VPoE",
      initialState: "0",
      description: `
VPoEとしてエンジニア組織の構築とフロントエンドの開発をリード。

- [Yuicleaner](https://yuimedi.com/yuicleaner)の開発をリード
- 製薬企業様向けに数千万データを高速に処理できるようにNode.jsを用いてアーキテクチャの設計と実装
- [YuiQuery Research](https://us.yuimedi.com/product-yuiquery-research/)でLLMを使った自然言語からSQL生成システムの実装
- エンジニア組織の構築とエンジニアラダーの作成し評価制度のベース作成
      `,
      links: [
        "https://yuimedi.notion.site/Yuimedi-3981950c3d324fb183bc8e99279e9375",
        "https://daiki-skm.hatenablog.com/entry/2023/03/31/164744",
        "https://www.youtube.com/watch?v=QbWjVloaAuY",
      ],
      company: "yuimedi",
    },
    {
      name: "Mercari/Souzoh",
      start: new Date("2019-11-01"),
      end: new Date("2022-07-31"),
      position: "Enabling Team",
      initialState: "0",
      description: `
技術顧問から正社員として復職し、再度入社。

- [Mercari Web](https://jp.mercari.com/)の0から作成するプロジェクトである[GroundUP App プロジェクト](https://engineering.mercari.com/blog/entry/20221213-ground-up-app/)に立ち上げ参加
- Souzohの立ち上げを行い、[Mercari Shops](https://mercari-shops.com/)リリースまでの8ヶ月間、フロントエンドの開発をほぼ一人で担当
- Shopsリリース後は[Enabling TeamとしてStream-aligned team](https://engineering.mercari.com/blog/entry/20210812-team-topologies-in-souzoh/)をサポート。
`,
      links: [
        "https://findy-code.io/pick-up/interviews/souzoh-engineer",
        "https://www.youtube.com/watch?v=YNLvIkqRC-g",
        "https://www.youtube.com/watch?v=1uCWzfaIedE",
      ],
      company: "mercari",
    },
    {
      name: "Dwango",
      start: new Date("2017-12-16"),
      end: new Date("2019-10-31"),
      position: "Engineer",
      initialState: "1-100",
      description: `
前のドワンゴ退職から半年しか経ってないため、以前と開発の状態は大きく変わらず[N予備校]("https://www.nnn.ed.nico/")に復職。

- 引き続き機能開発やwssを利用したリアルタイムイベントを管理するシステムをメンテナンス
- N校のJavaScriptに関するプログラミング教材のレビュー
- ニコニコ生放送の部署に移り、動画の低遅延、安定化の研究。WebRTCやこのときにはまだ仕様策定中であった[CMAF](https://www.liveinstantly.com/ja/resources/cross-posts/cmaf-format/)の導入検証を行う
      `,
      links: [],
      company: "dwango",
    },
    {
      name: "Mercari",
      start: new Date("2017-06-01"),
      end: new Date("2017-11-31"),
      position: "Engineer",
      initialState: "1-100",
      description: `
主にUSチームでWebの開発に従事。フロントエンドエンジニア3人目。

- [Mercari US](https://www.mercari.com/)の開発をリード
- Mercari JPではAMP, PWA, Reactの導入をリード
      `,
      links: [],
      company: "mercari",
    },
    {
      name: "Dwango",
      start: new Date("2015-04-01"),
      end: new Date("2017-05-31"),
      position: "Engineer",
      initialState: "0",
      description: `
新卒で入社し、新規開発を行うフロンティアチームに配属。

- 社内レジュメシステムの開発
- [ニコナレ](https://blog.nicovideo.jp/niconews/115830.html)の立ち上げを行いフロントエンド一人で開発。初React導入。
- [N予備校](https://www.nnn.ed.nico/)の立ち上げを行い、主にwssを利用したリアルタイムイベントを管理するシステムを開発
      `,
      links: [],
      company: "dwango",
    },
  ],
  side: [
    {
      name: "Tabelog",
      start: new Date("2018-12-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
- ${railsToNext}
- jQueryからReactへの移行サポート
- ${engineerRecruitSupport}
- ${engineerGrowthSupport}
      `,
      links: [
        "https://note.com/tabelog_frontend/n/na9a2ce24a4d5",
        "https://tech-blog.tabelog.com/entry/using-static-exports-in-production",
      ],
      company: "kakakucom",
    },
    {
      name: "Mercari/Souzoh",
      start: new Date("2022-08-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
- フロントエンド、Node.jsのセキュリティ強化支援
- ${highTrafficDesignSupport}
- ${engineerRecruitSupport}
      `,
      links: [],
      company: "mercari",
    },
    {
      name: "LayerX",
      start: new Date("2025-04-01"),
      end: null,
      position: "Enabling Team (Frontend/LLM)",
      initialState: "0",
      description: `
- CEO直下のチームで、新規プロダクトのBPO
- バクラクのフロントエンド開発
- 会社全体リポジトリのフロントエンドインフラ改善
      `,
      links: [
        "https://www.nikkei.com/article/DGXZQOUC02ASK0S5A400C2000000/",
        "https://bakuraku.jp/news/20250717/",
      ],
      company: "layerX",
    },
    {
      name: "Yuimedi",
      start: new Date("2025-05-01"),
      end: null,
      position: "Engineer",
      initialState: "100",
      description: `
- YuiQuery Researchの開発を引き続き行う
      `,
      links: ["https://us.yuimedi.com/product-yuiquery-research/"],
      company: "yuimedi",
    },
    {
      name: "Rebase",
      start: new Date("2023-07-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
- ${railsToNext}
- ${nextJsAppRouterArchitecture}
- ${newProductDesignSupport}
- ${frontEndInfraMonorepo}
- ${engineerRecruitSupport}
- ${engineerGrowthSupport}
      `,
      links: [
        "https://www.nikkei.com/compass/content/PRTKDB000000097_000021828/preview",
      ],
      company: "rebase",
    },
    {
      name: "Commune",
      start: new Date("2025-08-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
- ${nodeArchitectureDDD}
- ${highTrafficDesignSupport}
- ${frontEndInfraMonorepo}
- ${replaceMigrationSupport}
- ${llmEfficiencyInfrastructure}
- ${engineerRecruitSupport}
      `,
      links: [],
      company: "commune",
    },
    {
      name: "Stract",
      start: new Date("2025-03-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "0",
      description: `
- ${nextJsAppRouterArchitecture}
- ${nodeArchitectureDDD}
- ${llmEfficiencyInfrastructure}
- ${frontEndInfraMonorepo}
- ${engineerRecruitSupport}
      `,
      links: [],
      company: "stract",
    },
    {
      name: "Hokuto",
      start: new Date("2025-08-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "0",
      description: `
- ${replaceMigrationSupport}
- ${llmEfficiencyInfrastructure}
- ${frontEndInfraMonorepo}
      `,
      links: [],
      company: "hokuto",
    },
    {
      name: "ROUTE06",
      start: new Date("2023-07-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
- ADRの各意思決定の確認や議論、今後スケールする組織のためのアーキテクチャの提案
- ${frontEndInfraMonorepo}
- ${newProductDesignSupport}
      `,
      links: [
        "https://mh4gf.dev/articles/2023-summary#hiroppy-%E3%81%95%E3%82%93%E3%81%A8%E3%81%AE%E9%80%B1%E6%AC%A1%E3%81%A7%E3%81%AE%E4%BC%9A%E8%A9%B1",
      ],
      company: "route06",
    },
    {
      name: "Ship",
      start: new Date("2025-03-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "0",
      description: `
- ${frontEndInfraMonorepo}
- ${newProductDesignSupport}
      `,
      links: [],
      company: "ship",
    },
    {
      name: "Runpeace",
      start: new Date("2023-07-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "0",
      description: `
- App Routerを利用したtoBサービスの開発、サポート
      `,
      links: [],
      company: "runpeace",
    },
    {
      name: "Aidemy",
      start: new Date("2024-04-01"),
      end: new Date("2024-12-31"),
      position: "Architect",
      initialState: "0",
      description: `
- ${nextJsAppRouterArchitecture}
- ${nodeArchitectureDDD}
- ${frontEndInfraMonorepo}
- ${replaceMigrationSupport}
      `,
      links: [],
      company: "aidemy",
    },
    {
      name: "estie",
      start: new Date("2024-04-01"),
      end: new Date("2024-08-31"),
      position: "Technical Advisor",
      initialState: "100",
      description: `
- ${nextJsAppRouterArchitecture}
- ${nodeArchitectureDDD}
- ${frontEndInfraMonorepo}
- ${replaceMigrationSupport}
      `,
      links: [],
      company: "estie",
    },
    {
      name: "Anotherworks",
      start: new Date("2023-02-01"),
      end: new Date("2023-12-31"),
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
- ${nextJsAppRouterArchitecture}
- ${nodeArchitectureDDD}
- ${frontEndInfraMonorepo}
- ${replaceMigrationSupport}
      `,
      links: [],
      company: "anotherworks",
    },
    {
      name: "Yuimedi",
      start: new Date("2021-11-01"),
      end: new Date("2022-06-01"),
      position: "Engineer",
      initialState: "1-100",
      description: `
- [Yuicleaner](https://yuimedi.com/yuicleaner)の実装
      `,
      links: [],
      company: "yuimedi",
    },
    {
      name: "Alpaca",
      start: new Date("2022-02-01"),
      end: new Date("2022-05-31"),
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
- ${nodeArchitectureDDD}
- ${engineerGrowthSupport}

事業転換が発生したため、短い期間でのサポート
      `,
      links: [],
      company: "alpaca",
    },
    {
      name: "Black",
      start: new Date("2019-12-01"),
      end: new Date("2020-05-31"),
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
- create-react-appからNext.jsへの移行サポート
- ゲーム開発のコードレビューとパフォーマンス改善提案
      `,
      links: [],
      company: "black",
    },
    {
      name: "Mercari",
      start: new Date("2018-11-01"),
      end: new Date("2019-10-31"),
      position: "Technical Advisor",
      initialState: "0",
      description: `
- Mercari JPを1から作り直すプロジェクトに顧問として参加
- Next.jsを初期から選択し、セキュリティをはじめとしたアーキテクチャの設計と実装をサポート
- ${highTrafficDesignSupport}
- ${replaceMigrationSupport}
      `,
      links: [
        "https://speakerdeck.com/mercari/web-re-architecture-puroziekutoniokeruji-shu-de-tiyarenzi",
      ],
      company: "mercari",
    },
    {
      name: "Bizreach",
      start: new Date("2017-06-01"),
      end: new Date("2017-09-31"),
      position: "Engineer",
      initialState: "100",
      description: `
- スポットで開発に参加、Scalaを利用
      `,
      links: [],
      company: "bizreach",
    },
    {
      name: "Eyes, Japan",
      start: new Date("2014-05-01"),
      end: new Date("2015-02-31"),
      position: "Engineer",
      initialState: "100",
      description: `
- Backbone.jsやjQueryを利用し、学生アルバイトとして開発
      `,
      links: [],
      company: "eyesjapan",
    },
    {
      name: "CyberAgent",
      start: new Date("2013-07-01"),
      end: new Date("2013-09-31"),
      position: "Intern",
      initialState: "0",
      description: `
- Titaniumを利用した画像処理アプリ開発
      `,
      links: [],
      company: "cyberagent",
    },
  ],
};
