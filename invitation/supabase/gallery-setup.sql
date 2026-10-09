-- Gallery project: public photo bucket "christening_photos", guest uploads in "guests/".
-- (The setup script fills these in from src/config.ts.)
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.
-- Several events can share one project: each event's rules are named after
-- its bucket and folder, so running this never touches another event's.

-- 1. The bucket, PUBLIC so the site's photo links work (a private bucket
--    lists the photos but every picture fails to load), with hard limits:
--    the site already shrinks photos below 1 MB; this stops anyone
--    bypassing it. The limit also applies to dashboard uploads, so resize
--    large photos before uploading them yourself.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('christening_photos', 'christening_photos', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- 2. Let the site list the photos. Even public buckets need this for listing.
drop policy if exists "gallery list christening_photos" on storage.objects;
create policy "gallery list christening_photos"
  on storage.objects for select to public
  using (bucket_id = 'christening_photos');

-- 3. Let guests add photos: JPEGs only, only inside the guests folder.
--    There are no update/delete rules, so guests can't overwrite or remove
--    anything. Delete unwanted photos from the dashboard.
drop policy if exists "gallery upload christening_photos/guests" on storage.objects;
create policy "gallery upload christening_photos/guests"
  on storage.objects for insert to public
  with check (
    bucket_id = 'christening_photos'
    and name like 'guests/%.jpg'
  );

-- Older sites used the shared names "anyone can list gallery" and "guests can
-- share photos"; whichever event ran its file last owns those. If an older
-- event's photos stopped listing, re-run that event's file from this version.
