// Draws the landing page's link-preview picture (home/share.jpg, 1200x630):
// what Facebook, Messenger, WhatsApp, iMessage, X… show when the showcase's
// main address is shared. Re-run after changing a card: node scripts/make_home_share.mjs
import { readFileSync } from "node:fs"
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
const card = (file) => `data:image/jpeg;base64,${readFileSync(path.join(root, "cards", file)).toString("base64")}`
// Fanned like a hand of cards: [slug, x, y, rotation]
const FAN = [
  ["birthday.jpg", 0, 34, -10],
  ["wedding-2-ceremony.jpg", 92, 8, -3.5],
  ["graduation.jpg", 184, 8, 3.5],
  ["christening.jpg", 276, 34, 10],
]

const html = `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, "Helvetica Neue", Arial, sans-serif;
    color: #1d1d1f; letter-spacing: -0.02em;
    background: radial-gradient(900px 500px at 85% 60%, #f3e9e6 0%, transparent 60%),
                radial-gradient(700px 420px at 70% 0%, #e6eef0 0%, transparent 60%), #fbfbfd; }
  .text { position: absolute; left: 64px; top: 0; bottom: 0; width: 600px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-size: 24px; font-weight: 600; color: #6e6e73; }
  h1 { margin-top: 14px; font-size: 64px; line-height: 1.02; font-weight: 800; letter-spacing: -0.045em; }
  .grad { background: linear-gradient(90deg, #8a5a90, #a0646e 35%, #8a6a2c 65%, #4a6a48); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { margin-top: 22px; font-size: 25px; line-height: 1.35; font-weight: 500; color: #6e6e73; }
  .pills { margin-top: 30px; display: flex; gap: 10px; flex-wrap: wrap; }
  .pill { padding: 8px 16px; border-radius: 999px; background: #fff; font-size: 19px; font-weight: 600;
    box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px rgba(0,0,0,.06); }
  .fan { position: absolute; left: 676px; top: 150px; width: 470px; height: 360px; }
  .fan img { position: absolute; width: 176px; height: 264px; object-fit: cover; border-radius: 14px; border: 6px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.08), 0 24px 48px rgba(0,0,0,.16); transform-origin: 50% 100%; }
</style></head><body>
  <div class="text">
    <p class="eyebrow">Sample invitation websites</p>
    <h1>Every celebration.<br><span class="grad">Beautifully invited.</span></h1>
    <p class="sub">Open the envelope, register, and get the confirmation email.</p>
    <div class="pills">
      <span class="pill" style="color:#8a5a90">Birthday</span><span class="pill" style="color:#4a6a48">Wedding</span>
      <span class="pill" style="color:#8a6a2c">Graduation</span><span class="pill" style="color:#a0646e">Christening</span>
    </div>
  </div>
  <div class="fan">${FAN.map(([s, x, y, r]) => `<img src="${card(s)}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)">`).join("")}</div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(root, "home", "share.jpg"), type: "jpeg", quality: 86 })
await browser.close()
console.log("Wrote home/share.jpg")
