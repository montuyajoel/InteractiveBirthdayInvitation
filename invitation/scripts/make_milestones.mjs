// Illustrated stand-ins for the christening's "first months" photos (the real
// event used the baby's photos). → cards/christening-month-<n>.jpg, 760x1013
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require("playwright"))
} catch {
  ;({ chromium } = await import("/opt/node-tools/node_modules/playwright/index.mjs"))
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const bokeh = (seed) =>
  Array.from({ length: 16 }, (_, i) => {
    const r = ((seed * 31 + i * 57) % 40) + 14
    return `<circle cx="${(seed * 97 + i * 131) % 760}" cy="${(seed * 53 + i * 89) % 1013}" r="${r}" fill="#fff" opacity="${0.18 + ((i * 7) % 5) / 20}"/>`
  }).join("")

// Month 1: a swaddled baby asleep on a cloud pillow, with a "1" milestone card.
const swaddle = `
  <ellipse cx="380" cy="700" rx="300" ry="120" fill="#fffaf6"/>
  <ellipse cx="380" cy="690" rx="270" ry="96" fill="#fff"/>
  <g transform="translate(380 540)">
    <path d="M-150 60 C-170 -60 -90 -150 0 -150 C90 -150 170 -60 150 60 C130 170 60 200 0 200 C-60 200 -130 170 -150 60z" fill="#f6d6d8"/>
    <path d="M-150 60 C-60 20 60 20 150 60 C130 170 60 200 0 200 C-60 200 -130 170 -150 60z" fill="#efc4c8"/>
    <path d="M-120 10 C-40 60 40 60 120 10" stroke="#e5b3b8" stroke-width="6" fill="none"/>
    <circle cx="0" cy="-70" r="88" fill="#f8dcc8"/>
    <path d="M-88 -80 C-80 -170 80 -170 88 -80 C60 -120 -60 -120 -88 -80z" fill="#f6d6d8"/>
    <path d="M-38 -60 q12 10 24 0" stroke="#8a5a4a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M14 -60 q12 10 24 0" stroke="#8a5a4a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="-50" cy="-36" rx="16" ry="10" fill="#f3b3b0" opacity=".7"/>
    <ellipse cx="50" cy="-36" rx="16" ry="10" fill="#f3b3b0" opacity=".7"/>
    <path d="M-8 -22 q8 6 16 0" stroke="#c98278" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M0 70 c-14 -18 -40 -6 -26 14 l26 22 26 -22 c14 -20 -12 -32 -26 -14z" fill="#fff" opacity=".85"/>
  </g>
  <g transform="translate(560 250) rotate(8)">
    <rect x="-80" y="-100" width="160" height="200" rx="14" fill="#fff" stroke="#d9b779" stroke-width="5"/>
    <text x="0" y="30" text-anchor="middle" font-family="Allura" font-size="130" fill="#b07f86">1</text>
    <text x="0" y="78" text-anchor="middle" font-family="Cormorant Garamond" font-size="26" letter-spacing="6" fill="#8c6a45">MONTH</text>
  </g>`

// Month 2: a teddy bear with a pink balloon, and a "2" milestone card.
const teddy = `
  <path d="M520 160 C470 200 470 290 520 320" stroke="#c9a45c" stroke-width="3" fill="none"/>
  <ellipse cx="520" cy="120" rx="70" ry="84" fill="#e9b8bf"/><ellipse cx="496" cy="92" rx="16" ry="24" fill="#fff" opacity=".5"/>
  <path d="M512 204 l8 12 8 -12z" fill="#d79ea7"/>
  <g transform="translate(380 640)">
    <circle cx="-120" cy="-220" r="52" fill="#d6aa82"/><circle cx="-120" cy="-220" r="28" fill="#efcfae"/>
    <circle cx="120" cy="-220" r="52" fill="#d6aa82"/><circle cx="120" cy="-220" r="28" fill="#efcfae"/>
    <ellipse cx="0" cy="110" rx="190" ry="200" fill="#d6aa82"/>
    <ellipse cx="0" cy="140" rx="120" ry="130" fill="#efcfae"/>
    <circle cx="0" cy="-130" r="150" fill="#dcb18a"/>
    <ellipse cx="0" cy="-80" rx="70" ry="54" fill="#efcfae"/>
    <circle cx="-56" cy="-150" r="12" fill="#4b3226"/><circle cx="56" cy="-150" r="12" fill="#4b3226"/>
    <ellipse cx="0" cy="-102" rx="22" ry="16" fill="#4b3226"/>
    <path d="M0 -86 v18 M-18 -60 q18 14 36 0" stroke="#4b3226" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="-160" cy="60" rx="54" ry="84" fill="#d6aa82" transform="rotate(25 -160 60)"/>
    <ellipse cx="160" cy="40" rx="54" ry="84" fill="#d6aa82" transform="rotate(-35 160 40)"/>
    <path d="M-60 0 l60 30 60 -30 -10 50 -50 -20 -50 20z" fill="#f2c6cc"/><circle cx="0" cy="30" r="14" fill="#e9b0b8"/>
    <ellipse cx="-110" cy="290" rx="80" ry="54" fill="#d6aa82"/><ellipse cx="110" cy="290" rx="80" ry="54" fill="#d6aa82"/>
    <ellipse cx="-110" cy="296" rx="44" ry="30" fill="#efcfae"/><ellipse cx="110" cy="296" rx="44" ry="30" fill="#efcfae"/>
  </g>
  <g transform="translate(190 230) rotate(-8)">
    <rect x="-80" y="-100" width="160" height="200" rx="14" fill="#fff" stroke="#d9b779" stroke-width="5"/>
    <text x="0" y="30" text-anchor="middle" font-family="Allura" font-size="130" fill="#b07f86">2</text>
    <text x="0" y="78" text-anchor="middle" font-family="Cormorant Garamond" font-size="26" letter-spacing="6" fill="#8c6a45">MONTHS</text>
  </g>`

const scene = (n, art, a, b) => `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:wght@500&display=swap">
<style>*{margin:0}body{width:760px;height:1013px}</style></head><body>
<svg width="760" height="1013" viewBox="0 0 760 1013" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="760" height="1013" fill="url(#bg)"/>${bokeh(n)}${art}
</svg></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 760, height: 1013 } })
for (const [n, art, a, b] of [[1, swaddle, "#fbeeee", "#f3dcd6"], [2, teddy, "#f7f0e6", "#f1dcd9"]]) {
  await page.setContent(scene(n, art, a, b), { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(root, "cards", `christening-month-${n}.jpg`), type: "jpeg", quality: 85 })
  console.log("month", n)
}
await browser.close()
