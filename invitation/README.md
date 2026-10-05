# Chelsea Louise · 16: surprise birthday invitation

An interactive invitation site with four sections:

- **Invitation**: an envelope that opens to reveal the printed card, plus a live countdown and add-to-calendar buttons.
- **Register**: first name, last name, email and birthday wishes, with validation.
- **Gallery**: a photo grid with a full-screen lightbox. Browse with arrow keys, swipe or thumbnails, or press space for a slideshow.
- **How to get there**: an embedded map, a directions link and the pinned location.

Built with React, TypeScript, Tailwind and shadcn/ui, scaffolded with the `web-artifacts-builder` skill.

## Run it

```bash
pnpm install
pnpm dev                 # local preview at http://localhost:5173
pnpm build               # static site in dist/, ready for Netlify, Vercel, GitHub Pages…
bash ../.claude/skills/web-artifacts-builder/scripts/bundle-artifact.sh   # single-file bundle.html
```

## Edit the event

Everything event-specific lives in `src/config.ts`: name, date and time, venue, map link and Supabase settings.

## Connect Supabase

Until `SUPABASE.url` and `SUPABASE.anonKey` are set in `src/config.ts`, the site runs in **preview mode**: registrations stay in the visitor's browser and the gallery shows sample tiles.

The project URL is already set. Two steps remain:

1. **Create the table and bucket.** Open Supabase → SQL Editor, paste `supabase/setup.sql` and click Run. It creates the `registrations` table and the public `gallery` bucket, along with the access rules: guests can register but can't read the list, and the site can list the photos.
2. **Add the public key.** Copy the anon / publishable key from Project Settings → API Keys into `anonKey` in `src/config.ts`. Never put the `service_role` key or the database password in the site, because anyone can read the site's code.

On Vercel you can set the key as an environment variable instead of editing the file: add `VITE_SUPABASE_ANON_KEY` (and optionally `VITE_SUPABASE_URL`) under Settings → Environment Variables, then redeploy. Set the project's Root Directory to `invitation`.

Registrations then appear in Table Editor → `registrations`. A repeated email gets a friendly "already registered" message.

### Photos

Upload photos (jpg, png, webp, gif or avif) to the `gallery` bucket in Storage. The newest appear first, and captions come from file names (`cake-cutting.jpg` → "cake cutting"). Set `galleryFolder` in `src/config.ts` to show just one folder.
