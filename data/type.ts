import type { CompanyKey } from "./companies.ts";

export type LinkMeta = {
  title?: string;
  description?: string;
  favicon?: string;
  image?: string;
  name?: string;
  url?: string;
  error?: string;
  skipUpdate?: boolean;
};

export type Common = {
  publishedAt: `${number}-${number}-${number}`;
  url: string;
  hot?: boolean;
  title?: string;
  links?: string[] | LinkMeta[];
  comment?: string;
  company?: CompanyKey;
};
