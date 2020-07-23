'use strict';

const { tmpdir } = require('os');
const { join } = require('path');
const puppeteer = require('puppeteer');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async () => {
  const url =
    'https://www.google.com/search?source=hp&ei=SaQZX-3sMsbYhwPZwLzAAg&q=hiroppy&oq=hiroppy&gs_lcp=CgZwc3ktYWIQAzICCAAyAggAMgQIABAeOgcIABCxAxAEOgoIABCxAxCDARAEOgQIABAEOgYIABAEEAM6CAgAELEDEIMBUOonWJ8uYJMwaABwAHgAgAFSiAGdBJIBATeYAQCgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwittd6Y0OPqAhVG7GEKHVkgDygQ4dUDCAk&uact=5';
  const browser = await puppeteer.launch({
    args: ['--disable-infobars', '--lang=ja'],
  });
  const page = await browser.newPage();
  const originalImagePath = join(tmpdir(), 'result.jpg');

  // await page.setExtraHTTPHeaders({
  //   'Accept-Language': 'ja-JP',
  // });
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
})();
