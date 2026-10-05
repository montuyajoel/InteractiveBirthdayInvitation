-- Gallery project (uuiftuibexylqbhhzmix), bucket "mallows_birthday".
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.

-- 1. Let the site list the photos. Even public buckets need this for listing.
drop policy if exists "anyone can list gallery" on storage.objects;
create policy "anyone can list gallery"
  on storage.objects for select to anon
  using (bucket_id = 'mallows_birthday');

-- 2. Let guests add photos: JPEGs only, only inside the Mallows folder.
--    There are no update/delete rules, so guests can't overwrite or remove
--    anything. Delete unwanted photos from the dashboard.
drop policy if exists "guests can share photos" on storage.objects;
create policy "guests can share photos"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'mallows_birthday'
    and (storage.foldername(name))[1] = 'Mallows'
    and lower(storage.extension(name)) = 'jpg'
  );

-- 3. Hard limits on the bucket. The site already shrinks photos below 1 MB;
--    this stops anyone bypassing it. Note: it also applies to dashboard
--    uploads, so resize large photos before uploading them yourself.
update storage.buckets
set file_size_limit = 1048576,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'mallows_birthday';
