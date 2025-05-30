import EmojiConvertor from "emoji-js";
import { Octokit } from "octokit";
import { repos } from "../data/repos.ts";
import { downloadImage, generateData } from "./utils.ts";

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
const res = await Promise.all(
  repos.hot.map(async (repo) => {
    const [owner, name] = repo.split("/");
    const { data } = await octokit.rest.repos.get({
      owner,
      repo: name,
    });

    return {
      name: data.full_name,
      url: data.html_url,
      description: emoji.replace_colons(data.description),
      language: data.language,
      stars: data.stargazers_count,
      image: await downloadImage(`${data.owner.avatar_url}?s=40`),
    };
  }),
);

await generateData("repos", {
  hot: res,
});
