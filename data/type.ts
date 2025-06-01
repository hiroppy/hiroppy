export type LinkMeta = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  siteUrl: string;
  url?: string;
  error?: string;
};

export type Common = {
  publishedAt: `${number}-${number}-${number}`;
  url: string;
  hot?: boolean;
  title?: string;
  siteName?: string;
  links?: string[] | LinkMeta[];
  comment?: string;
};
