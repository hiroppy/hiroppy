import { cacheStorage, loadCache, saveCache } from "./utils/index.ts";

const initialCache = await loadCache();

await cacheStorage.run(initialCache, async () => {
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

  const finalCache = cacheStorage.getStore();

  if (finalCache) {
    await saveCache(finalCache);
  }

  await import("./generate-types.ts");
});
