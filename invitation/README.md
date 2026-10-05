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

The site uses two Supabase projects:

| Feature | Project | SQL to run once | Env vars (Vercel) |
| --- | --- | --- | --- |
| Registrations | `rgicukixlxexgzcxgvqg` | `supabase/setup.sql` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Photo gallery | `uuiftuibexylqbhhzmix` | `supabase/gallery-setup.sql` | `VITE_GALLERY_SUPABASE_URL`, `VITE_GALLERY_SUPABASE_KEY` |

For each project:

1. **Run its SQL.** In that project, open SQL Editor → New query, paste the file and click Run.
2. **Give the site its public key.** Copy the Publishable key (`sb_publishable_…`) or the anon key (`eyJ…`) from Project Settings → API Keys. Either set it as the env var above in Vercel (Settings → Environment Variables, then redeploy) or put it in `src/config.ts`. The URLs are already the defaults, so their env vars are optional.

Never use a secret / `service_role` key or the database password: everything here ends up in the public site. A feature whose key is empty runs in preview mode. Registrations are then kept in the visitor's browser only, and the gallery shows sample tiles.

On Vercel, set the project's Root Directory to `invitation`.

### Registrations

Guests can add themselves but can't read the list. View registrations in Table Editor → `registrations`. A repeated email gets a friendly "already registered" message.

### Photos

Upload photos (jpg, png, webp, gif or avif) to the `gallery` bucket in the gallery project's Storage. The newest appear first, and captions come from file names (`cake-cutting.jpg` → "cake cutting"). Set `GALLERY.folder` in `src/config.ts` to show just one folder.
