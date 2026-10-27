#!/usr/bin/env node
// Renders the link-preview picture (the image WhatsApp, Messenger, iMessage,
// Facebook… show when the site's link is shared) into public/share.jpg.
//
//   node share_image.mjs [site-folder]        # default: ./invitation
//
// It builds the site, opens the hidden #/share-card page (ShareCard.tsx) at
// 1200×630 with Playwright, and saves a JPEG. Re-run whenever the names,
// date, venue, card image or design change, then commit public/share.jpg.
import { spawn, execSync } from "node:child_process"
import { createRequire } from "node:module"
import { existsSync, statSync } from "node:fs"
import path from "node:path"

const site = path.resolve(process.argv[2] ?? "invitation")
if (!existsSync(path.join(site, "src/components/site/ShareCard.tsx"))) {
  console.error(`${site} has no src/components/site/ShareCard.tsx`)
  process.exit(1)
}

// Playwright from the site, or from the global install.
async function loadPlaywright() {
  for (const base of [site, execSync("npm root -g").toString().trim()]) {
    try {
      const req = createRequire(path.join(base, "noop.js"))
      const mod = await import(req.resolve("playwright"))
      return mod.chromium ? mod : mod.default
    } catch {}
  }
  console.error("Playwright not found: npm i -g playwright (Chromium must be available)")
  process.exit(1)
}
const { chromium } = await loadPlaywright()

execSync("npx vite build --logLevel error", { cwd: site, stdio: "inherit" })

const port = 4300 + Math.floor(Math.random() * 500)
const server = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], {
  cwd: site,
  detached: true,
  stdio: "ignore",
})
const stop = () => {
  try {
    process.kill(-server.pid)
  } catch {}
}
process.on("exit", stop)

try {
  const url = `http://localhost:${port}/#/share-card`
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`http://localhost:${port}/`)).ok) break
    } catch {}
    if (i > 60) throw new Error("preview server didn't start")
    await new Promise((r) => setTimeout(r, 250))
  }

  const browser = await chromium.launch()
  // Reduced motion stills the swaying stems and falling petals (index.css).
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" })
  await page.goto(url, { waitUntil: "networkidle" })
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
  })
  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family))
  if (fonts.length === 0) console.warn("warning: web fonts didn't load; the picture uses fallback fonts")

  const out = path.join(site, "public/share.jpg")
  await page.screenshot({ path: out, type: "jpeg", quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } })
  await browser.close()
  console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`)
} finally {
  stop()
}
