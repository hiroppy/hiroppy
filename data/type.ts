export type Common = {
  publishedAt: `${number}-${number}-${number}`;
  url: string;
  hot?: boolean;
  title?: string;
  siteName?: string;
  appendixes?: Record<string, string>;
  comment?: string;
};
