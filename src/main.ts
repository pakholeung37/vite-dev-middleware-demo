import "vite/dynamic-import-polyfill"
import "./index.css"

const dom = window.document.getElementById("app")
if (dom) {
  dom.innerText = "vite middleware had been attatched"
}

const b: number = 4
console.log(b)
