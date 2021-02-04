const path = require("path")
const fs = require("fs")
const manifest = require("../dist/manifest.json")
const viteConfig = require("../vite.config")
const isProduction = process.env.NODE_ENV === "production"

const esmInjectPlaceholder = /(<!--#esm#-->)[\s\S]*?(<!--##-->)/
const cssInjectPlaceholder = /(<!--#css#-->)[\s\S]*?(<!--##-->)/
const nomoduleInjectPlaceholder = /(<!--#nomodule#-->)[\s\S]*?(<!--##-->)/
const esmTemplate = src =>
  `<script type="module" crossorigin src="${viteConfig.base}${src}"></script>`
const cssTemplate = src =>
  `<link rel="stylesheet" href="${viteConfig.base}${src}"></link>`
const nomoduleTemplate = src =>
  `<script nomodule src="${viteConfig.base}${src}"></script>`

// template from https://github.com/vitejs/vite/blob/main/packages/plugin-legacy/index.js
const viteLegacyTemplate = src =>
  `<script nomodule id="vite-legacy-entry" data-src="${viteConfig.base}${src}">System.import(document.getElementById("vite-legacy-entry").getAttribute("data-src"),)</script>`
const safari10NoModuleFix = `<script nomodule>!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();</script>`

;(async () => {
  const indexHtmlPath = path.resolve(
    __dirname,
    "../examples/injection/index.html",
  )
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8")

  const esm = []
  const csses = []
  const nomodule = []

  // 开发模式， 注入脚本
  if (!isProduction) {
    console.log(viteConfig)
  } else {
    nomodule.push(safari10NoModuleFix)
    for (const ref in manifest) {
      if (!/legacy/.test(ref)) {
        if (/vite\/legacy-polyfills/.test(ref)) {
          esm.push(viteLegacyTemplate(manifest[ref].file))
        } else {
          esm.push(esmTemplate(manifest[ref].file))
        }
      } else {
        nomodule.push(nomoduleTemplate(manifest[ref].file))
      }
      if (manifest[ref].css) {
        manifest[ref].css.forEach(css => {
          csses.push(cssTemplate(css))
        })
      }
    }
  }

  const injectedHtml = indexHtml
    .replace(esmInjectPlaceholder, esm.join("\n"))
    .replace(cssInjectPlaceholder, csses.join("\n"))
    .replace(nomoduleInjectPlaceholder, nomodule.join("\n"))
  console.log(injectedHtml)
})()
