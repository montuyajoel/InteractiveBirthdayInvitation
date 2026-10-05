-- Gallery project (uuiftuibexylqbhhzmix): public photo bucket.
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.

-- Photo gallery bucket ---------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

-- Lets the site list the bucket's files (uploads stay dashboard-only).
drop policy if exists "anyone can list gallery" on storage.objects;
create policy "anyone can list gallery"
  on storage.objects for select to anon
  using (bucket_id = 'gallery');
