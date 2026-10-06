import { chromium } from "playwright";
import fs from "fs";
const [,, file, outDir, w, h, mode, ...rest] = process.argv;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto("file://" + file);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);
fs.mkdirSync(outDir, { recursive: true });
if (mode === "stills") {
  for (const t of rest) { await page.evaluate(t => seek(+t), t); await page.screenshot({ path: `${outDir}/still_${t}.png` }); }
} else if (mode === "shots") {
  for (const q of rest) { await page.goto("file://" + file + q); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800); await page.screenshot({ path: `${outDir}/post${q.replace(/\W/g, "")}.png` }); }
} else {
  const fps = 30, dur = await page.evaluate(() => DURATION);
  for (let i = 0; i < dur * fps; i++) {
    await page.evaluate(t => seek(t), i / fps);
    await page.screenshot({ path: `${outDir}/f${String(i).padStart(4, "0")}.jpg`, type: "jpeg", quality: 95 });
  }
}
await browser.close();
