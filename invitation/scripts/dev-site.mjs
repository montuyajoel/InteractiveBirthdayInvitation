// One sample site's Vite dev server, started by scripts/dev.mjs from inside
// the site's folder (so its Tailwind/PostCSS settings are found):
//
//   node scripts/dev-site.mjs <slug> <port>
//
// It stops by itself as soon as dev.mjs goes away, however that happens
// (Ctrl+C, closing the terminal, a crash), so no server is left holding a port.
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"

const [slug, port] = process.argv.slice(2)
if (!process.send) {
  console.error("Start this with `npm run dev` (scripts/dev.mjs), not on its own.")
  process.exit(1)
}
process.on("disconnect", () => process.exit(0))

const vite = createRequire(path.join(process.cwd(), "package.json")).resolve("vite")
const { createServer } = await import(pathToFileURL(vite).href)
const server = await createServer({
  base: `/${slug}/`,
  logLevel: "warn",
  server: { port: Number(port), strictPort: true, open: false },
})
await server.listen()
process.send({ ready: true })
