import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readData } from "./utils/index.ts";

type Sponsor = {
  href: string;
  avatar: string;
  name?: string;
};

type SponsorsData = {
  current: Sponsor[];
  past: Sponsor[];
};

type Repo = {
  org: string;
  repo: string;
  name: string;
  url: string;
  description: string;
  language: string;
  image: string;
};

type ReposData = {
  hot: Repo[];
  active: Repo[];
  maintaining: Repo[];
};

function generateREADME(sponsors: SponsorsData, repos: ReposData): string {
  return `
<p align="center">
  <samp>
    <a href="https://hiroppy.me/">me</a> |
    <a href="https://hiroppy.me/blog">blog</a> |
    <a href="https://twitter.com/about_hiroppy">tweets</a>
  </samp>
</p>

![NPM Version](https://img.shields.io/npm/v/hiroppy)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/hiroppy/hiroppy)

Hi, I'm hiroppy 😵‍💫

I am a JS engineer living in Japan, and I love creating OSS and web services.

## Active Repositories

${generateRepoList(repos.active)}

## maintaining OSS

I've been focusing on my business so I'm not active now 😔

${generateRepoList(repos.maintaining, true)}

## Sponsors

Thank you for supporting me 😍

<p align="center">
  <h3> Current Sponsors </h3>
  ${sponsorList(sponsors.current)}
</p>
<p align="center">
  <h3> Past Sponsors </h3>
  ${sponsorList(sponsors.past)}
</p>

## usage

\`\`\`shell
$ npm i hiroppy
\`\`\`

\`\`\`ts
import jobs  from "hiroppy/jobs" with { type: "json" };
import media from "hiroppy/media" with { type: "json" };
\`\`\`

<br />
<br />

last auto-updated time: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
  `.trim();
}

function generateRepoList(repos: Repo[], ignoreDescription = false): string {
  return repos
    .map((repo) => {
      const displayName = repo.repo.includes(repo.org)
        ? repo.repo
        : repo.name.split("/")[1];
      return `- [${displayName}](${repo.url})${!ignoreDescription && repo.description ? `\n  - ${repo.description}` : ""}`;
    })
    .join("\n");
}

function sponsorList(sponsors: Sponsor[]): string {
  return sponsors
    .map((sponsor) => {
      return `
    <a href="${
      sponsor.href.includes("https://docs.github.com/sponsors")
        ? "https://github.com"
        : sponsor.href
    }">
      <img src="${sponsor.avatar ? `generated${sponsor.avatar}` : "public/blue.png"}" alt="${
        sponsor.name ?? "private user"
      }" width="60" />
    </a>
    `.trim();
    })
    .join("");
}

const sponsors: SponsorsData = await readData("sponsors", false);
const repos: ReposData = await readData("repos", false);
const readmeContent = generateREADME(sponsors, repos);

await writeFile(
  join(import.meta.dirname, "../README.md"),
  readmeContent,
  "utf-8",
);

console.log("README.md has been generated successfully!");
