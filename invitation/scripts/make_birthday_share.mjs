// The birthday site predates the template's #/share-card page, so its
// link-preview picture is drawn here instead: → sites/birthday/public/share.jpg
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
const card = `data:image/jpeg;base64,${readFileSync(path.join(root, "cards/birthday.jpg")).toString("base64")}`

const html = `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;position:relative;color:#5c3a63;font-family:"Cormorant Garamond",serif;
    background:radial-gradient(700px 420px at 20% 30%,#fbeef6,transparent 70%),linear-gradient(135deg,#fbf6fb,#efe2f3)}
  .text{position:absolute;left:70px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
  .script{font-family:Allura,cursive;color:#9a6aa0;line-height:1}
  .big{font-size:120px}
  .caps{letter-spacing:.32em;text-transform:uppercase;font-weight:600;font-size:22px;color:#9a6aa0;margin-top:14px}
  .name{font-family:Allura,cursive;font-size:96px;color:#5c3a63;line-height:1.05;margin-top:6px}
  .rule{margin:16px 0;width:220px;height:1px;background:linear-gradient(90deg,transparent,#9a6aa0,transparent)}
  .when{font-size:30px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
  .where{font-size:24px;letter-spacing:.24em;text-transform:uppercase;color:#9a6aa0;margin-top:8px}
  .shh{font-style:italic;font-size:26px;margin-top:14px;color:#7d5285}
  img{position:absolute;right:70px;top:50%;width:330px;transform:translateY(-50%) rotate(4deg);border:10px solid #fff;border-radius:6px;box-shadow:0 30px 60px -20px rgba(92,58,99,.45)}
</style></head><body>
  <div class="text">
    <p class="script big">You're invited!</p>
    <p class="caps">Surprise 16th birthday of</p>
    <p class="name">Isabel Sofia</p>
    <div class="rule"></div>
    <p class="when">Saturday, November 21 · 5:00 PM</p>
    <p class="where">Casa Lumiere Garden</p>
    <p class="shh">Shhh… it's a surprise!</p>
  </div>
  <img src="${card}">
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(root, "sites/birthday/public/share.jpg"), type: "jpeg", quality: 86 })
await browser.close()
console.log("Wrote sites/birthday/public/share.jpg")
