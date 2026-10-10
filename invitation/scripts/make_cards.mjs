// Draws each sample event's "printed invitation card" (960x1440 JPG) from
// its spec, with a motif per event. Run: node scripts/make_cards.mjs
// (needs Playwright; Chromium is found through PLAYWRIGHT_BROWSERS_PATH).
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require("playwright"))
} catch {
  ;({ chromium } = await import("/opt/node-tools/node_modules/playwright/index.mjs"))
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SLUGS = ["birthday", "wedding", "graduation", "christening"]

const MOTIF = {
  birthday: (c) => `
    <g transform="translate(480 520)">
      <ellipse cx="0" cy="150" rx="210" ry="22" fill="${c.soft}"/>
      <rect x="-170" y="10" width="340" height="140" rx="18" fill="${c.bloom}"/>
      <path d="M-170 50 q42 36 85 0 t85 0 t85 0 t85 0 v-22 a18 18 0 0 0 -18 -18 h-304 a18 18 0 0 0 -18 18z" fill="#fff"/>
      <rect x="-115" y="-100" width="230" height="110" rx="16" fill="${c.highlight}" stroke="${c.bloom}" stroke-width="3"/>
      <path d="M-115 -66 q29 28 57 0 t57 0 t57 0 t57 0 v-18 a16 16 0 0 0 -16 -16 h-198 a16 16 0 0 0 -16 16z" fill="#fff"/>
      <text x="0" y="-20" text-anchor="middle" font-family="Parisienne" font-size="64" fill="${c.brand}">16</text>
      ${[-70, -25, 25, 70].map((x) => `<rect x="${x - 5}" y="-160" width="10" height="60" rx="4" fill="${c.brand}" opacity=".8"/><path d="M${x} -190 q12 14 0 26 q-12 -12 0 -26z" fill="#f2b23d"/>`).join("")}
    </g>`,
  wedding: (c) => `
    <g transform="translate(480 520)" fill="none">
      <circle cx="-55" cy="0" r="110" stroke="${c.brand}" stroke-width="16"/>
      <circle cx="65" cy="20" r="110" stroke="${c.bloom}" stroke-width="16"/>
      <path d="M-55 -128 l-20 -26 l20 -20 l20 20z" fill="#fff" stroke="${c.brand}" stroke-width="3"/>
      <path d="M-260 170 C-170 120 -90 180 0 150 C90 120 170 180 260 140" stroke="${c.foliage}" stroke-width="3"/>
      ${[-220, -150, -80, 70, 140, 210].map((x, i) => `<ellipse cx="${x}" cy="${148 + (i % 2 ? -14 : 10)}" rx="22" ry="9" fill="${c.foliage}" opacity=".7" transform="rotate(${i % 2 ? -30 : 25} ${x} ${148})"/>`).join("")}
    </g>`,
  graduation: (c) => `
    <g transform="translate(480 500)">
      <path d="M-120 20 v70 q120 64 240 0 v-70z" fill="${c.ink}"/>
      <path d="M0 -110 L240 0 L0 100 L-240 0z" fill="${c.ink}"/>
      <path d="M0 -110 L240 0 L0 100 L-240 0z" fill="#fff" opacity=".08"/>
      <circle r="12" fill="${c.brand}"/>
      <path d="M0 0 Q160 28 176 64 L176 160" stroke="${c.brand}" stroke-width="7" fill="none"/>
      <path d="M164 156 h24 l10 64 h-44z" fill="${c.brand}"/>
      <g transform="translate(-200 170)"><rect width="190" height="50" rx="25" fill="#fff" stroke="${c.soft}" stroke-width="3"/><rect x="-6" y="5" width="22" height="40" rx="9" fill="${c.brand}"/><rect x="174" y="5" width="22" height="40" rx="9" fill="${c.brand}"/></g>
    </g>`,
  christening: (c) => `
    <g transform="translate(470 520)">
      <path d="M-170 40 C-120 -40 -20 -50 40 -10 C80 -60 150 -140 230 -150 C190 -80 170 -10 110 40 C70 80 -10 100 -60 80 L-150 120 L-120 70z" fill="#fff" stroke="${c.brand}" stroke-width="3"/>
      <path d="M40 -10 C10 -90 -60 -160 -150 -170 C-110 -100 -80 -40 -20 -5z" fill="${c.soft}" stroke="${c.brand}" stroke-width="3"/>
      <circle cx="150" cy="-118" r="8" fill="${c.ink}"/>
      <path d="M218 -148 l30 6 l-26 14z" fill="${c.brand}"/>
      <path d="M246 -140 q28 20 18 58" stroke="${c.foliage}" stroke-width="5" fill="none"/>
      <ellipse cx="260" cy="-104" rx="9" ry="16" fill="${c.foliage}" transform="rotate(-30 260 -104)"/>
      <ellipse cx="268" cy="-80" rx="9" ry="16" fill="${c.foliage}" transform="rotate(20 268 -80)"/>
    </g>`,
}

const fmt = (iso, tz, o) => new Date(iso).toLocaleString("en-US", { timeZone: tz, ...o })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 960, height: 1440 } })
for (const slug of SLUGS) {
  const spec = JSON.parse(readFileSync(path.join(root, "specs", `${slug}.json`), "utf8"))
  const { event: e, copy, theme } = spec
  const c = theme.colors
  const name = (s) => s.replaceAll("{name}", e.honoreeShort).replaceAll("{honoree}", e.honoree)
  const title = copy.title.replace(/\^(.*?)\^/g, "<sup>$1</sup>")
  const date = fmt(e.start, e.timeZone, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const time = fmt(e.start, e.timeZone, { hour: "numeric", minute: "2-digit" })
  const html = `<!doctype html><html><head><link rel="stylesheet" href="${theme.fonts.googleFontsUrl}">
  <style>
    *{margin:0;box-sizing:border-box}
    body{width:960px;height:1440px;background:linear-gradient(170deg,${c.paper},${c.highlight} 55%,${c.soft});font-family:"${theme.fonts.serif}",serif;color:${c.ink};position:relative;overflow:hidden}
    .frame{position:absolute;inset:40px;border:3px solid ${c.brand};}
    .frame2{position:absolute;inset:56px;border:1px solid ${c.brand};opacity:.6}
    .top{position:absolute;top:150px;width:100%;text-align:center;letter-spacing:.4em;text-transform:uppercase;font-size:26px;color:${c.brand}}
    svg{position:absolute;top:0;left:0}
    .t{position:absolute;top:790px;width:100%;text-align:center}
    .script{font-family:"${theme.fonts.script}",cursive;color:${c.brand};font-size:118px;line-height:1.05}
    .script sup{font-size:.5em}
    .for{margin-top:24px;letter-spacing:.35em;text-transform:uppercase;font-size:22px;color:${c.brand}}
    .who{margin-top:8px;font-size:64px;font-style:italic}
    .when{position:absolute;bottom:150px;width:100%;text-align:center;font-size:28px;line-height:1.5}
    .when b{display:block;letter-spacing:.25em;text-transform:uppercase;font-weight:500;font-size:24px;color:${c.brand}}
  </style></head><body>
  <div class="frame"></div><div class="frame2"></div>
  <p class="top">${name([copy.invitedLine, copy.kicker].filter(Boolean).join(" · "))}</p>
  <svg width="960" height="1440" viewBox="0 0 960 1440">${MOTIF[slug](c)}</svg>
  <div class="t"><p class="script">${name(title)}</p><p class="for">${name(copy.celebrationFor)}</p><p class="who">${e.honoree}</p></div>
  <div class="when"><b>${date}</b>${time} · ${e.venue}<br>${e.address}</div>
  </body></html>`
  await page.setContent(html, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(root, "cards", `${slug}.jpg`), type: "jpeg", quality: 85 })
  console.log("card", slug)
}
await browser.close()
