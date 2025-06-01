await Promise.all([
  import("./meta.ts"),
  import("./podcasts.ts"),
  import("./sponsors.ts"),
  import("./jobs.ts"),
  import("./repos.ts"),
  import("./talks.ts"),
  import("./media.ts"),
  import("./articles.ts"),
]);
