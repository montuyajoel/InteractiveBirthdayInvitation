# Marketing assets

| File | Size | Use |
| --- | --- | --- |
| `ig-story-digital-invitation.mp4` | 1080×1920, 30 s, 30 fps, with music | Instagram Story / Reel |
| `ig-post-1.png` … `ig-post-3.png` | 1080×1350 | Instagram feed carousel |
| `ig-post-4-pricing.png` | 1080×1350 | Price list (last carousel slide, or post on its own) |
| `digital-invitation-order-form.docx` | US Letter | Client order form (built by `node src/order-form.js out.docx`) |
| `digital-invitation-costing-PH.xlsx` | | Costing & pricing workbook (built by `src/costing.py`) |
| `CAPTION.md` | | Caption, hashtags and story sticker tips |

## Re-render after edits

The sources are plain HTML in `src/`. The invitation shown is a made-up sample (`sample-card.html` → `assets/sample-card.jpg`), so no real event is revealed. `music.py` synthesises the original music-box track. `story.html` exposes `seek(t)`, so you can preview any moment with `story.html?t=12.5`.

```bash
cd marketing/src
node render.mjs "$PWD/story.html" /tmp/frames 1080 1920 video
python3 music.py /tmp/music.wav 30
ffmpeg -framerate 30 -i /tmp/frames/f%04d.jpg -i /tmp/music.wav -shortest -af loudnorm=I=-16:TP=-1.5 \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k ../ig-story-digital-invitation.mp4
node render.mjs "$PWD/post.html" /tmp/posts 1080 1350 shots "?s=1" "?s=2" "?s=3" "?s=4"
```

`render.mjs` needs Playwright and Chromium. Edit `executablePath` in it to point at your browser.
