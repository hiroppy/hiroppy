import EmojiConvertor from "emoji-js";
import { Octokit } from "octokit";
import { repos } from "../data/repos.ts";
import { downloadImage, generateData } from "./utils/index.ts";

try {
  process.loadEnvFile();
} catch {
  console.warn(
    "No .env file found, using environment variables directly. Make sure to set GITHUB",
  );
}

const emoji = new EmojiConvertor();

emoji.replace_mode = "unified";
emoji.allow_native = true;

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const processRepos = async (repoList: string[], includeOrgRepo = false) => {
  return Promise.all(
    repoList.map(async (repo) => {
      const [owner, name] = repo.split("/");
      const { data } = await octokit.rest.repos.get({
        owner,
        repo: name,
      });

      const result: Record<string, string> = {
        name: data.full_name,
        url: data.html_url,
        description: emoji.replace_colons(data.description),
        language: data.language,
        image: await downloadImage(`${data.owner.avatar_url}?s=40`),
      };

      if (includeOrgRepo) {
        result.org = data.owner.login;
        result.repo = data.name;
      }

      return result;
    }),
  );
};

const hotRes = await processRepos(repos.hot);
const activeRes = await processRepos(repos.active, true);
const maintainingRes = await processRepos(repos.maintaining, true);

await generateData("repos", {
  hot: hotRes,
  active: activeRes,
  maintaining: maintainingRes,
});
