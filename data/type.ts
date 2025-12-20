import type { CompanyKey } from "./companies.ts";

export type LinkMeta = {
  title: string;
  description: string;
  image: string;
  name: string;
  url: string;
  favicon: string;
};

// Input type for data files (title and links are optional - fetched during crawling)
export type InputCommon = {
  publishedAt: `${number}-${number}-${number}`;
  url: string;
  hot?: boolean;
  title?: string;
  links?: string[] | LinkMeta[];
  comment?: string;
  company?: CompanyKey;
};

// Output type for generated JSON files (all fields populated after crawling)
export type Common = {
  publishedAt: `${number}-${number}-${number}`;
  url: string;
  hot?: boolean;
  title: string;
  links: string[] | LinkMeta[];
  comment?: string;
  company?: CompanyKey;
};
