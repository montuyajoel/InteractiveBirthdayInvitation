-- Gallery project (uuiftuibexylqbhhzmix): lets the site list the photos in
-- the public "mallows_birthday" bucket. Even public buckets need this rule
-- for listing; uploads stay dashboard-only.
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.

drop policy if exists "anyone can list gallery" on storage.objects;
create policy "anyone can list gallery"
  on storage.objects for select to anon
  using (bucket_id = 'mallows_birthday');
