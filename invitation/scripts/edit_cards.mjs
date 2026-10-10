// Makes the sample events' printed cards from the real events' card designs:
// each real name, date and place is painted over with the card's own
// background and the made-up details are written in matching fonts.
//
//   node scripts/edit_cards.mjs [slug…]     → cards/<file>.jpg
//
// The originals are read straight from the events' git branches (they are
// never copied into this folder). Needs Playwright (Chromium).
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { CARDS } from "./cards.config.mjs"

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require("playwright"))
} catch {
  ;({ chromium } = await import("/opt/node-tools/node_modules/playwright/index.mjs"))
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const only = process.argv.slice(2)
const todo = CARDS.filter((c) => only.length === 0 || only.includes(c.slug) || only.includes(c.out))
mkdirSync(path.join(root, "cards"), { recursive: true })

const original = (c) =>
  execFileSync("git", ["show", `${c.branch}:${c.path}`], { cwd: root, maxBuffer: 64 << 20 }).toString("base64")

// One request per family, asking only for the styles used (Google Fonts
// rejects the whole request if a family lacks a requested weight).
const styles = new Map()
for (const t of todo.flatMap((c) => c.texts ?? [])) {
  const set = styles.get(t.font) ?? new Set()
  set.add(`${t.italic ? 1 : 0},${t.weight ?? 400}`)
  styles.set(t.font, set)
}
const fontLinks = [...styles].map(([f, set]) => {
  const axes = [...set].sort()
  const q = axes.some((a) => a.startsWith("1")) ? `ital,wght@${axes.join(";")}` : `wght@${axes.map((a) => a.slice(2)).join(";")}`
  return `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${f.replace(/ /g, "+")}:${q}&display=swap">`
})
const fontProbe = todo
  .flatMap((c) => c.texts ?? [])
  .map((t) => `<span style="font-family:'${t.font}';font-weight:${t.weight ?? 400};font-style:${t.italic ? "italic" : "normal"}">a</span>`)

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(`<!doctype html>${fontLinks.join("")}<body>${fontProbe.join("")}</body>`, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
const missing = await page.evaluate((list) => list.filter(([f, w, i]) => !document.fonts.check(`${i ? "italic " : ""}${w} 20px "${f}"`)), todo.flatMap((c) => c.texts ?? []).map((t) => [t.font, t.weight ?? 400, !!t.italic]))
if (missing.length) throw new Error(`fonts didn't load: ${JSON.stringify(missing)}`)

for (const c of todo) {
  if (c.html) {
    // Card drawn from HTML on the event's branch: swap the text and re-render.
    let html = execFileSync("git", ["show", `${c.branch}:${c.html}`], { cwd: root }).toString()
    for (const [from, to] of c.replace) {
      if (!html.includes(from)) throw new Error(`${c.out}: "${from}" not found in ${c.html}`)
      html = html.replaceAll(from, to)
    }
    const p = await browser.newPage({ viewport: c.size })
    await p.setContent(html, { waitUntil: "networkidle" })
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(300)
    await p.screenshot({ path: path.join(root, "cards", c.out), type: "jpeg", quality: 90 })
    await p.close()
    console.log("card", c.out)
    continue
  }
  const jpg = await page.evaluate(
    async ({ src, patches, texts, quality }) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const W = img.naturalWidth
      const H = img.naturalHeight
      const cv = document.createElement("canvas")
      cv.width = W
      cv.height = H
      const ctx = cv.getContext("2d")
      ctx.drawImage(img, 0, 0)

      // Fill each box column by column, blending the pixels just above and
      // just below it (or left/right with dir "h"), with a little grain and a
      // feathered edge so the card's paper texture and gradients carry on.
      for (const p of patches) {
        const pad = p.feather ?? 10
        const x0 = Math.max(0, p.x - pad), y0 = Math.max(0, p.y - pad)
        const x1 = Math.min(W, p.x + p.w + pad), y1 = Math.min(H, p.y + p.h + pad)
        const w = x1 - x0, h = y1 - y0
        const src = ctx.getImageData(0, 0, W, H).data
        const at = (x, y) => {
          const i = (Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))) * 4
          return [src[i], src[i + 1], src[i + 2]]
        }
        // average a few pixels outside the box so a stray line doesn't streak
        const edge = (x, y, dx, dy) => {
          const acc = [0, 0, 0]
          for (let k = 2; k < 8; k++) {
            const v = at(x + dx * k, y + dy * k)
            acc[0] += v[0]; acc[1] += v[1]; acc[2] += v[2]
          }
          return acc.map((v) => v / 6)
        }
        const out = ctx.getImageData(x0, y0, w, h)
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const gx = x0 + x, gy = y0 + y
            let a, b, t
            if (p.dir === "h") {
              a = edge(x0, gy, -1, 0); b = edge(x1 - 1, gy, 1, 0); t = x / (w - 1)
            } else {
              a = edge(gx, y0, 0, -1); b = edge(gx, y1 - 1, 0, 1); t = y / (h - 1)
            }
            if (p.color) a = b = p.color
            const n = (Math.random() - 0.5) * (p.grain ?? 4)
            // feather: 0 at the outer padding edge → 1 inside the box
            const fx = Math.min(1, Math.min(gx - x0, x1 - 1 - gx) / pad)
            const fy = Math.min(1, Math.min(gy - y0, y1 - 1 - gy) / pad)
            const m = Math.min(fx, fy)
            const i = (y * w + x) * 4
            for (let k = 0; k < 3; k++) {
              const fill = a[k] * (1 - t) + b[k] * t + n
              out.data[i + k] = out.data[i + k] * (1 - m) + fill * m
            }
          }
        }
        ctx.putImageData(out, x0, y0)
      }

      for (const t of texts) {
        ctx.save()
        ctx.font = `${t.italic ? "italic " : ""}${t.weight ?? 400} ${t.size}px "${t.font}"`
        ctx.textAlign = t.align ?? "center"
        ctx.textBaseline = "alphabetic"
        if (t.spacing) ctx.letterSpacing = `${t.spacing}px`
        if (t.rotate) {
          ctx.translate(t.x, t.y)
          ctx.rotate((t.rotate * Math.PI) / 180)
          ctx.translate(-t.x, -t.y)
        }
        const m = ctx.measureText(t.text)
        if (t.gradient) {
          const g = ctx.createLinearGradient(t.x - m.width / 2, t.y - t.size, t.x + m.width / 2, t.y)
          t.gradient.forEach((col, i) => g.addColorStop(i / (t.gradient.length - 1), col))
          ctx.fillStyle = g
        } else ctx.fillStyle = t.color
        if (t.glow) {
          ctx.shadowColor = t.glow
          ctx.shadowBlur = t.size / 10
        }
        // letterSpacing adds trailing space after the last letter; centre on the glyphs
        const dx = t.spacing && (t.align ?? "center") === "center" ? t.spacing / 2 : 0
        ctx.fillText(t.text, t.x + dx, t.y)
        ctx.restore()
      }
      return cv.toDataURL("image/jpeg", quality).split(",")[1]
    },
    { src: `data:image/jpeg;base64,${original(c)}`, patches: c.patches, texts: c.texts, quality: c.quality ?? 0.88 },
  )
  writeFileSync(path.join(root, "cards", c.out), Buffer.from(jpg, "base64"))
  console.log("card", c.out)
}
await browser.close()
