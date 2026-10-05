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

### Registrations table

Run in the Supabase SQL editor:

```sql
create table public.registrations (
  id          bigint generated always as identity primary key,
  first_name  text not null,
  last_name   text not null,
  email       text not null unique,
  wishes      text not null check (char_length(wishes) <= 500),
  created_at  timestamptz not null default now()
);

alter table public.registrations enable row level security;

-- Guests may add themselves; nobody can read the list with the public key.
create policy "guests can register"
  on public.registrations for insert to anon
  with check (true);
```

A repeated email returns a friendly "already registered" message.

### Gallery bucket

1. Create a **public** storage bucket named `gallery` (or change `galleryBucket`).
2. Allow the site to list it:

```sql
create policy "anyone can list gallery"
  on storage.objects for select to anon
  using (bucket_id = 'gallery');
```

3. Upload photos (jpg, png, webp, gif or avif). The newest appear first, and captions come from file names (`cake-cutting.jpg` → "cake cutting"). Set `galleryFolder` to show just one folder.
