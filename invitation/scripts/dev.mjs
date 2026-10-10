// Local development: everything at one address, like the live site.
//
//   npm run dev        (or pnpm dev)   → http://localhost:5173
//
//   /              the landing page (home/)
//   /birthday/ …   each sample event, with live reload as you edit sites/<slug>
//                  (served by its own Vite on ports PORT+10…PORT+13)
//   /api/send-confirmation   the sample email function. It sends for real only
//                  when GMAIL_USER and GMAIL_APP_PASSWORD are set in your
//                  environment; otherwise the site says email isn't set up.
import http from "node:http"
import net from "node:net"
import { readFile, stat } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { spawn } from "node:child_process"
import { bin } from "./bin.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SLUGS = ["birthday", "wedding", "graduation", "christening"]
const PORT = Number(process.env.PORT) || 5173

// Each site runs its own Vite, started from inside its folder (its Tailwind
// and PostCSS settings are looked up from there), on an internal port. This
// server forwards /<slug>/… to it, and live reload talks to it directly.
const children = []
const sites = {}
for (const [i, slug] of SLUGS.entries()) {
  const cwd = path.join(root, "sites", slug)
  const port = PORT + 10 + i
  const child = spawn(process.execPath, [bin("vite", "vite", cwd), "--base", `/${slug}/`, "--port", String(port), "--strictPort", "--logLevel", "warn"], {
    cwd,
    stdio: ["ignore", "inherit", "inherit"],
    env: { ...process.env, VITE_CONFIG_NATIVE_IGNORE_WARNING: "true", BROWSER: "none" },
  })
  child.on("exit", (code) => {
    if (!stopping) {
      console.error(`The ${slug} site's dev server stopped (exit ${code}).`)
      stop(1)
    }
  })
  children.push(child)
  sites[slug] = { port }
}
let stopping = false
function stop(code = 0) {
  stopping = true
  for (const c of children) c.kill()
  process.exit(code)
}
process.on("SIGINT", () => stop())
process.on("SIGTERM", () => stop())

// The email function is TypeScript importing the sites' code: load it
// through a small Vite instance of its own.
const vitePath = createRequire(path.join(root, "sites", SLUGS[0], "package.json")).resolve("vite")
const { createServer } = await import(pathToFileURL(vitePath).href)
const apiLoader = await createServer({
  root,
  configFile: false,
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
})

async function ready(port) {
  for (let i = 0; i < 200; i++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/`)).status) return
    } catch {}
    await new Promise((r) => setTimeout(r, 150))
  }
  throw new Error(`dev server on port ${port} didn't start`)
}
await Promise.all(Object.values(sites).map((s) => ready(s.port)))

function forward(req, res, port) {
  const up = http.request(
    { host: "127.0.0.1", port, path: req.url, method: req.method, headers: { ...req.headers, host: `localhost:${port}` } },
    (r) => {
      res.writeHead(r.statusCode ?? 502, r.headers)
      r.pipe(res)
    },
  )
  up.on("error", () => {
    res.writeHead(502, { "content-type": "text/plain" })
    res.end("The site's dev server isn't answering.")
  })
  req.pipe(up)
}

const TYPES = { ".html": "text/html; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" }

async function landing(req, res) {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html"
  const file = path.join(root, "home", rel)
  if (!file.startsWith(path.join(root, "home"))) return notFound(res)
  try {
    if (!(await stat(file)).isFile()) return notFound(res)
    let body = await readFile(file)
    // The landing page's link-preview tags are filled in at build time.
    if (rel === "index.html") body = Buffer.from(body.toString().replaceAll("%SITE_URL%", ""))
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" })
    res.end(body)
  } catch {
    notFound(res)
  }
}

function notFound(res) {
  res.writeHead(404, { "content-type": "text/plain" })
  res.end("Not found")
}

async function api(req, res) {
  try {
    // Loaded through Vite so the TypeScript (and the sites' email code) just works.
    const mod = await apiLoader.ssrLoadModule(path.join(root, "api/send-confirmation.ts"))
    const chunks = []
    for await (const c of req) chunks.push(c)
    const request = new Request(`http://localhost:${PORT}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
    })
    const out = req.method === "POST" ? await mod.POST(request) : Response.json({ error: "method" }, { status: 405 })
    res.writeHead(out.status, Object.fromEntries(out.headers))
    res.end(Buffer.from(await out.arrayBuffer()))
  } catch (err) {
    console.error(err)
    res.writeHead(500, { "content-type": "application/json" })
    res.end(JSON.stringify({ error: "server" }))
  }
}

const main = http.createServer()
// Live reload: the page's WebSocket comes here; pass it through to the site's Vite.
main.on("upgrade", (req, socket, head) => {
  const pathname = new URL(req.url, "http://x").pathname
  const slug = SLUGS.find((s) => pathname.startsWith(`/${s}/`))
  if (!slug) return socket.destroy()
  const port = sites[slug].port
  const up = net.connect(port, "127.0.0.1", () => {
    const headers = Object.entries({ ...req.headers, host: `localhost:${port}` }).map(([k, v]) => `${k}: ${v}`)
    up.write(`${req.method} ${req.url} HTTP/1.1\r\n${headers.join("\r\n")}\r\n\r\n`)
    up.write(head)
    socket.pipe(up).pipe(socket)
  })
  up.on("error", () => socket.destroy())
  socket.on("error", () => up.destroy())
})
main
  .on("request", (req, res) => {
    const pathname = new URL(req.url, "http://x").pathname
    if (pathname.startsWith("/api/send-confirmation")) return api(req, res)
    const slug = SLUGS.find((s) => pathname === `/${s}` || pathname.startsWith(`/${s}/`))
    if (slug) {
      if (pathname === `/${slug}`) {
        res.writeHead(302, { location: `/${slug}/` })
        return res.end()
      }
      return forward(req, res, sites[slug].port)
    }
    landing(req, res)
  })
  .listen(PORT, () => {
    console.log(`\n  Celebrations sample sites: http://localhost:${PORT}/\n`)
    for (const s of SLUGS) console.log(`    http://localhost:${PORT}/${s}/`)
    if (!process.env.GMAIL_USER) console.log("\n  (Sample emails stay off until GMAIL_USER and GMAIL_APP_PASSWORD are set.)")
    console.log("")
  })
