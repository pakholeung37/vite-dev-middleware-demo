/* eslint-disable @typescript-eslint/no-var-requires */
const vite = require("vite")
const express = require("express")

;(async () => {
  const app = express()
  // create vite dev server in middleware mode
  // so vite creates the hmr websocket server on its own.
  // the ws server will be listening at port 24678 by default, and can be
  // configured via server.hmr.port
  const viteServer = await vite.createServer({
    server: {
      middlewareMode: true,
      cors: true,
      hmr: { port: 24678 },
    },
  })

  // use vite's connect instance as middleware
  app.use(viteServer.middlewares)

  app.use("*", (req, res) => {
    // serve custom index.html
    res.json("you're visiting vite dev middleware.")
  })

  const port = 3000
  app.listen(port, () => {
    console.log(viteServer)
    console.log(
      `localhost:${port}. vite dev middleware running on localhost:${24678}`,
    )
  })
})()
