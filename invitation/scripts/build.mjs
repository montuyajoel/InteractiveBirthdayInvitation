// Builds the showcase into dist/: the landing page at /, and each sample
// event site at /<slug>/ (one address for all four). Vercel runs this.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { run } from "./bin.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const SLUGS = ["birthday", "wedding", "graduation", "christening"]
const env = process.env
const base = (env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "")).replace(/\/$/, "")

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })
cpSync(path.join(root, "home"), dist, { recursive: true })
// Link previews need full addresses; without a known domain (local builds)
// leave og:url out and keep the picture's path relative.
const home = path.join(dist, "index.html")
let html = readFileSync(home, "utf8")
html = base ? html.replaceAll("%SITE_URL%", base) : html.replace(/^.*property="og:url".*\n/m, "").replaceAll("%SITE_URL%", "")
writeFileSync(home, html)
for (const slug of SLUGS) {
  console.log(`\n▸ building /${slug}/`)
  run("vite", "vite", ["build", "--base", `/${slug}/`, "--outDir", path.join(dist, slug), "--emptyOutDir"], {
    cwd: path.join(root, "sites", slug),
    env: { ...env, SITE_URL: base ? `${base}/${slug}` : `/${slug}` },
  })
  // The birthday site has no site-url plugin of its own: fill its tags here.
  const page = path.join(dist, slug, "index.html")
  writeFileSync(page, readFileSync(page, "utf8").replaceAll("%SITE_URL%", base ? `${base}/${slug}` : `/${slug}`))
}
console.log("\nDone: dist/")
