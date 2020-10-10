'use strict';

const { tmpdir } = require('os');
const { join } = require('path');
const { writeFile } = require('fs').promises;
const { config } = require('dotenv');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const { read } = require('fs');

config();

async function getSponsors() {
  const GET_SPONSORS = `
    {
      user(login: "hiroppy") {
        sponsorshipsAsMaintainer(first: 100) {
          nodes {
            sponsorEntity {
              ... on User {
                avatarUrl
                url
              }
            }
          }
        }
      }
    }
  `.trim();

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query: GET_SPONSORS }),
  }).then((res) => res.json());
  const sponsors = res.data.user.sponsorshipsAsMaintainer.nodes.map(
    ({ sponsorEntity: { avatarUrl, url } }) => {
      return {
        avatarUrl: `${avatarUrl}&s=40`,
        url,
      };
    }
  );

  return sponsors;
}

async function generateSearchResultImageFromGoogle() {
  const url =
    'https://www.google.com/search?source=hp&ei=SaQZX-3sMsbYhwPZwLzAAg&q=hiroppy&oq=hiroppy&gs_lcp=CgZwc3ktYWIQAzICCAAyAggAMgQIABAeOgcIABCxAxAEOgoIABCxAxCDARAEOgQIABAEOgYIABAEEAM6CAgAELEDEIMBUOonWJ8uYJMwaABwAHgAgAFSiAGdBJIBATeYAQCgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwittd6Y0OPqAhVG7GEKHVkgDygQ4dUDCAk&uact=5';
  const browser = await puppeteer.launch({
    args: ['--disable-infobars', '--lang=ja'],
  });
  const page = await browser.newPage();
  const originalImagePath = join(tmpdir(), 'result.jpg');

  await page.setViewport({
    width: 900,
    height: 570,
    deviceScaleFactor: 2,
  });
  await page.goto(url);
  await page.screenshot({
    path: originalImagePath,
    clip: {
      x: 0,
      y: 10,
      width: 900,
      height: 570,
    },
  });
  await browser.close();
  await imagemin([originalImagePath], {
    plugins: [imageminMozjpeg({ quality: 50 })],
    destination: 'output',
  });
}

async function createReadme({ sponsors }) {
  const tmpl = require('./README-tmpl');

  await writeFile(join(process.cwd(), 'README.md'), tmpl({ sponsors }));
}

(async () => {
  const [sponsors] = await Promise.all([getSponsors(), generateSearchResultImageFromGoogle()]);

  await createReadme({ sponsors });
})();
