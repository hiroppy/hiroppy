const placeholderColor =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcfPRvPQAHHgLWeG8FbgAAAABJRU5ErkJggg==";

export function generateREADME(sponsors) {
  return `
<p align="center">
  <samp>
    <a href="https://hiroppy.me/">me</a> |
    <a href="https://hiroppy.me/blog">blog</a> |
    <a href="https://twitter.com/about_hiroppy">tweets</a>
  </samp>
</p>

Hi, I'm hiroppy 😵‍💫

I am a JS engineer living in Japan, and I love creating OSS and web services.

## Active Repositories

- [web-app-template](https://github.com/hiroppy/web-app-template)
  - a powerful template to create web service
- [nextjs-app-router-training
](https://github.com/hiroppy/nextjs-app-router-training)
  - introducing Next.js App Router features

## maintaining OSS

- [Node.js](https://github.com/nodejs/node)
- [webpack](https://github.com/webpack/webpack)
- [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)
- [babel-loader](https://github.com/babel/babel-loader)
- [babel-upgrade](https://github.com/babel/babel-upgrade)
- [Stylelint](https://github.com/stylelint/stylelint)
- [jekyll](https://github.com/jekyll/jekyll)
- [danger-js](https://github.com/danger/danger-js)
- [crowi](https://github.com/crowi/crowi)

## Sponsors

<p align="center">
  <h3> Current Sponsors </h3>
  ${sponsors.current
    .map((sponsor) => {
      return `
    <a href="${sponsor.href}">
      <img src="${sponsor.avatar ?? placeholderColor}" alt="${
        sponsor.name ?? "private user"
      }" width="60" />
    </a>
    `.trim();
    })
    .join("")}
</p>
<p align="center">
  <h3> Past Sponsors </h3>
  ${sponsors.past
    .map((sponsor) => {
      return `
    <a href="${sponsor.href}">
      <img src="${sponsor.avatar ?? placeholderColor}" alt="${
        sponsor.name ?? "private user"
      }" width="60" />
    </a>
    `.trim();
    })
    .join("")}
</p>

<br />
<br />

last auto-updated time: ${new Date(
    new Date().toLocaleString({ timeZone: "Asia/Tokyo" })
  )}
  `.trim();
}
