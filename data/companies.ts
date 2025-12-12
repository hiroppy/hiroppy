export type CompanyMeta = Record<
  string,
  {
    image: string;
    url: string;
  }
>;

export const companies = {
  coderPenguin: {
    image: "coderPenguin.png",
    url: "https://coder-penguin.com",
  },
  layerX: {
    image: "layerx.png",
    url: "https://layerx.co.jp",
  },
  ship: {
    image: "ship.png",
    url: "https://www.shipinc.jp",
  },
  stract: {
    image: "stract.png",
    url: "https://stract.co.jp",
  },
  commune: {
    image: "commune.jpg",
    url: "https://communeinc.com",
  },
  hokuto: {
    image: "hokuto.webp",
    url: "https://corp.hokuto.app",
  },
  aidemy: {
    image: "aidemy.png",
    url: "https://aidemy.net",
  },
  mercari: {
    image: "mercari.png",
    url: "https://about.mercari.com",
  },
  yuimedi: {
    image: "yuimedi.jpeg",
    url: "https://yuimedi.com",
  },
  dwango: {
    image: "dwango.jpeg",
    url: "https://dwango.co.jp",
  },
  estie: {
    image: "estie.png",
    url: "https://www.estie.jp",
  },
  runpeace: {
    image: "runpeace.jpg",
    url: "https://www.runpeace.biz",
  },
  rebase: {
    image: "rebase.png",
    url: "https://rebase.co.jp",
  },
  route06: {
    image: "route06.jpg",
    url: "https://route06.co.jp",
  },
  anotherworks: {
    image: "anotherworks.webp",
    url: "https://anotherworks.co.jp",
  },
  alpaca: {
    image: "alpaca.jpg",
    url: "https://alpc.tokyo",
  },
  black: {
    image: "black.jpg",
    url: "https://by.black",
  },
  kakakucom: {
    image: "tabelog.jpg",
    url: "https://corporate.kakaku.com",
  },
  bizreach: {
    image: "bizreach.jpeg",
    url: "https://www.bizreach.co.jp",
  },
  eyesjapan: {
    image: "eyesjapan.jpg",
    url: "https://www.nowhere.co.jp",
  },
  cyberagent: {
    image: "cyberagent.png",
    url: "https://www.cyberagent.co.jp",
  },
} as const satisfies CompanyMeta;

export type CompanyKey = keyof typeof companies;
