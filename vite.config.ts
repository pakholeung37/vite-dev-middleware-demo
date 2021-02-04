import { defineConfig, Plugin } from "vite"
import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"

const isProduction = process.env.NODE_ENV === "production"

const injectJspPlugin: () => Plugin = () => {
  let _server
  return {
    name: "vite:inject-jsp",
    configureServer(server) {
      _server = server
    },
    transform(code) {
      console.log(_server)
      return code
    },
  }
}
// https://vitejs.dev/config/
const plugins = [vue(), injectJspPlugin()]
if (isProduction) {
  plugins.push(
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  )
}
export default defineConfig({
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
