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
  - a powerful template to create web services
- [nextjs-app-router-training
](https://github.com/hiroppy/nextjs-app-router-training)
  - introducing Next.js App Router features

## maintaining OSS

I've been focusing on my business so I'm not active now 😔

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

Thank you for supporting me 😍

<p align="center">
  <h3> Current Sponsors </h3>
  ${sponsorList(sponsors.current)}
</p>
<p align="center">
  <h3> Past Sponsors </h3>
  ${sponsorList(sponsors.past)}
</p>

<br />
<br />

last auto-updated time: ${new Date(
    new Date().toLocaleString({ timeZone: "Asia/Tokyo" })
  )}
  `.trim();
}

function sponsorList(sponsors) {
  return sponsors
    .map((sponsor) => {
      return `
    <a href="${
      sponsor.href.includes("https://docs.github.com/sponsors")
        ? "https://github.com"
        : sponsor.href
    }">
      <img src="${sponsor.avatar ?? "public/blue.png"}" alt="${
        sponsor.name ?? "private user"
      }" width="60" />
    </a>
    `.trim();
    })
    .join("");
}
