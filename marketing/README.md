# Marketing assets

| File | Size | Use |
| --- | --- | --- |
| `ig-story-digital-invitation.mp4` | 1080×1920, 25 s, 30 fps | Instagram Story / Reel |
| `ig-post-1.png` … `ig-post-3.png` | 1080×1350 | Instagram feed carousel |
| `CAPTION.md` | | Caption, hashtags and story sticker tips |

## Re-render after edits

The sources are plain HTML in `src/`. `story.html` exposes `seek(t)`, so you can preview any moment with `story.html?t=12.5`.

```bash
cd marketing/src
node render.mjs "$PWD/story.html" /tmp/frames 1080 1920 video
ffmpeg -framerate 30 -i /tmp/frames/f%04d.jpg -f lavfi -i anullsrc=r=44100:cl=stereo -shortest \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart -c:a aac ../ig-story-digital-invitation.mp4
node render.mjs "$PWD/post.html" /tmp/posts 1080 1350 shots "?s=1" "?s=2" "?s=3"
```

`render.mjs` needs Playwright and Chromium. Edit `executablePath` in it to point at your browser.
