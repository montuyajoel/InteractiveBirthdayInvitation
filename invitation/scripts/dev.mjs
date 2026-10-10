// Local development: everything at one address, like the live site.
//
//   npm run dev        (or pnpm dev)   → http://localhost:5173
//
//   /              the landing page (home/)
//   /birthday/ …   each sample event, with live reload as you edit sites/<slug>
//                  (each served by its own Vite on a free port behind this one)
//   If 5173 is taken, the next free port is used; the address is printed.
//   /api/send-confirmation   the sample email function. It sends for real only
//                  when GMAIL_USER and GMAIL_APP_PASSWORD are set in your
//                  environment; otherwise the site says email isn't set up.
import http from "node:http"
import net from "node:net"
import { readFile, stat } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { fork } from "node:child_process"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SLUGS = ["birthday", "wedding", "graduation", "christening"]
const WANTED_PORT = Number(process.env.PORT) || 5173

// Whether `port` can be listened on at `host` (a missing IPv6 counts as free).
const canListen = (port, host) =>
  new Promise((resolve) => {
    const probe = net.createServer()
    probe.once("error", (e) => resolve(e.code === "EADDRNOTAVAIL" || e.code === "EAFNOSUPPORT"))
    probe.listen(port, host, () => probe.close(() => resolve(true)))
  })

// A free port at or after `from` (another program, or an earlier run, may
// hold the usual ones). Checked on both localhost addresses: some systems
// let a port that's busy on one look free on the other.
async function freePort(from, avoid = []) {
  for (let p = from; p < from + 200; p++) {
    if (avoid.includes(p)) continue
    if ((await canListen(p, "127.0.0.1")) && (await canListen(p, "::1"))) return p
  }
  throw new Error(`No free port found from ${from}`)
}

const PORT = await freePort(WANTED_PORT)

// Each site runs its own Vite (scripts/dev-site.mjs), started from inside its
// folder so its Tailwind and PostCSS settings are found, on a free internal
// port. This server forwards /<slug>/… (pages and live reload) to it. They
// talk over an IPC channel, so each one stops by itself when this one does.
const sites = {}
const used = [PORT]
let stopping = false
for (const slug of SLUGS) {
  const port = await freePort(PORT + 10, used)
  used.push(port)
  const child = fork(path.join(root, "scripts/dev-site.mjs"), [slug, String(port)], {
    cwd: path.join(root, "sites", slug),
    env: { ...process.env, VITE_CONFIG_NATIVE_IGNORE_WARNING: "true" },
  })
  child.on("exit", (code) => {
    if (!stopping) {
      console.error(`The ${slug} site's dev server stopped (exit ${code}).`)
      process.exit(1)
    }
  })
  const site = { slug, port, address: "127.0.0.1", child }
  // The site reports the exact address and port it is listening on.
  site.ready = new Promise((r) => child.once("message", (m) => r(Object.assign(site, { address: m.address, port: m.port }))))
  sites[slug] = site
}
const stop = () => {
  stopping = true
  for (const s of Object.values(sites)) s.child.kill()
  process.exit(0)
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)

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

await Promise.all(Object.values(sites).map((s) => s.ready))

function forward(req, res, site) {
  const { port, address } = site
  const up = http.request(
    { host: address, port, path: req.url, method: req.method, headers: { ...req.headers, host: `localhost:${port}` } },
    (r) => {
      res.writeHead(r.statusCode ?? 502, r.headers)
      r.pipe(res)
    },
  )
  up.on("error", (e) => {
    const why = `The ${site.slug} site's dev server (${address}:${port}) isn't answering: ${e.code ?? e.message}.`
    console.error(why)
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" })
    res.end(`${why}\n\nOpen the address that \`npm run dev\` printed (http://localhost:${PORT}/). If this keeps happening, stop npm run dev with Ctrl+C and start it again.`)
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
  const { port, address } = sites[slug]
  const up = net.connect(port, address, () => {
    const headers = Object.entries({ ...req.headers, host: `localhost:${port}` }).map(([k, v]) => `${k}: ${v}`)
    up.write(`${req.method} ${req.url} HTTP/1.1\r\n${headers.join("\r\n")}\r\n\r\n`)
    up.write(head)
    socket.pipe(up).pipe(socket)
  })
  up.on("error", () => socket.destroy())
  socket.on("error", () => up.destroy())
})
main.on("error", (e) => {
  console.error(`Couldn't start on port ${PORT}: ${e.message}`)
  stop()
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
      return forward(req, res, sites[slug])
    }
    landing(req, res)
  })
  .listen(PORT, () => {
    if (PORT !== WANTED_PORT) console.log(`\n  Port ${WANTED_PORT} is busy, so using ${PORT}.`)
    console.log(`\n  Celebrations sample sites: http://localhost:${PORT}/\n`)
    for (const s of SLUGS) console.log(`    http://localhost:${PORT}/${s}/`)
    if (!process.env.GMAIL_USER) console.log("\n  (Sample emails stay off until GMAIL_USER and GMAIL_APP_PASSWORD are set.)")
    console.log("")
  })
