// Builds the showcase into dist/: the landing page at /, and each sample
// event site at /<slug>/ (one address for all four). Vercel runs this.
import { cpSync, mkdirSync, rmSync } from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const SLUGS = ["birthday", "wedding", "graduation", "christening"]
const env = process.env
const base = (env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "")).replace(/\/$/, "")

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })
cpSync(path.join(root, "home"), dist, { recursive: true })
for (const slug of SLUGS) {
  console.log(`\n▸ building /${slug}/`)
  execFileSync("pnpm", ["exec", "vite", "build", "--base", `/${slug}/`, "--outDir", path.join(dist, slug), "--emptyOutDir"], {
    cwd: path.join(root, "sites", slug),
    stdio: "inherit",
    env: { ...env, SITE_URL: base ? `${base}/${slug}` : "" },
  })
}
console.log("\nDone: dist/")
