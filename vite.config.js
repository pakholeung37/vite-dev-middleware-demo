const { defineConfig } = require("vite")
const vue = require("@vitejs/plugin-vue")
const legacy = require("@vitejs/plugin-legacy")

const isProduction = process.env.NODE_ENV == "production"
console.log(process.env.NODE_ENV)
// https://vitejs.dev/config/
const plugins = [vue()]
if (isProduction) {
  plugins.push(
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  )
}
module.exports = defineConfig({
  plugins,
  base: isProduction ? "/dist/" : "/",
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: "./src/main.ts",
    },
  },
})
