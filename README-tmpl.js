'use strict';

const README = ({ sponsors }) =>
  `
<a href="https://www.google.com/search?source=hp&ei=SaQZX-3sMsbYhwPZwLzAAg&q=hiroppy&oq=hiroppy&gs_lcp=CgZwc3ktYWIQAzICCAAyAggAMgQIABAeOgcIABCxAxAEOgoIABCxAxCDARAEOgQIABAEOgYIABAEEAM6CAgAELEDEIMBUOonWJ8uYJMwaABwAHgAgAFSiAGdBJIBATeYAQCgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwittd6Y0OPqAhVG7GEKHVkgDygQ4dUDCAk&uact=5">
  <img src="https://raw.githubusercontent.com/hiroppy/hiroppy/master/output/result.jpg" />
</a>

## Sponsors

${sponsors
  .map(({ avatarUrl, url }) => {
    return `[![](${avatarUrl})](${url})`;
  })
  .join('')}

[![Twitter Badge](https://img.shields.io/badge/-@hiroppy-181717?style=flat-square&logo=twitter&logoColor=white&link=https://twitter.com/about_hiroppy)](https://twitter.com/about_hiroppy)
[![Blog Badge](https://img.shields.io/badge/-blog-181717?style=flat-square&logo=hatena-bookmark&logoColor=white&link=https://blog.hiroppy.me/)](https://blog.hiroppy.me)

last auto-updated time: ${new Date(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }))}
`.trim();

module.exports = README;
