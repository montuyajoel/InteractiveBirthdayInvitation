-- Chase's 8th birthday: Supabase setup.
-- Everything here is named for Chase (chase_registrations, chase_guest_list,
-- chase_photos, ...), so it can live in its own new project OR share a
-- project with other events without touching their data.
-- Creates the registrations table, the password-protected guest list, invite
-- tracking for the email button, and the photo bucket "chase_photos" (guest
-- uploads go in "guests/").
--
-- 1. Open your Supabase project (or create one at https://supabase.com/dashboard).
-- 2. SQL Editor → New query → paste this whole file.
-- 3. Replace  YOUR_PASSWORD  below with the hosts' password, then Run.
-- Safe to re-run; re-running with a new password changes it.
--
-- The names must match REGISTRATIONS and GALLERY in src/config.ts.

-- 1. Guest registrations ----------------------------------------------------
create table if not exists public.chase_registrations (
  id              bigint generated always as identity primary key,
  first_name      text not null check (char_length(first_name) between 1 and 60),
  last_name       text not null check (char_length(last_name) between 1 and 60),
  email           text not null unique,
  wishes          text not null check (char_length(wishes) between 1 and 500),
  created_at      timestamptz not null default now(),
  invite_sent_at  timestamptz
);
alter table public.chase_registrations add column if not exists invite_sent_at timestamptz;

alter table public.chase_registrations enable row level security;

-- The public key may only add a registration: it can't read, change or
-- delete anyone's. Hosts see everyone through the password-protected list.
grant usage on schema public to anon;
grant insert on public.chase_registrations to anon;

drop policy if exists "chase: guests can register" on public.chase_registrations;
create policy "chase: guests can register"
  on public.chase_registrations for insert to anon
  with check (true);

-- 2. Hosts' password (stored only as a bcrypt hash, in a private schema) ----
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.chase_guest_list_password (
  id   int primary key default 1 check (id = 1),
  hash text not null
);

insert into private.chase_guest_list_password (id, hash)
values (1, extensions.crypt('YOUR_PASSWORD', extensions.gen_salt('bf', 10)))
on conflict (id) do update set hash = excluded.hash;

-- 3. "See who's coming": the guest list, behind the password ---------------
drop function if exists public.chase_guest_list(text);
create function public.chase_guest_list(passcode text)
returns table (
  first_name text, last_name text, email text, wishes text,
  created_at timestamptz, invite_sent_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from private.chase_guest_list_password p
    where p.hash = extensions.crypt(passcode, p.hash)
  ) then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;

  return query
    select r.first_name, r.last_name, r.email, r.wishes, r.created_at, r.invite_sent_at
    from public.chase_registrations r
    order by r.created_at;
end;
$$;
revoke all on function public.chase_guest_list(text) from public;
grant execute on function public.chase_guest_list(text) to anon;

-- 4. Marks guests as emailed (called by the "Send invitation" button) -------
create or replace function public.chase_mark_invites_sent(passcode text, emails text[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated integer;
begin
  if not exists (
    select 1 from private.chase_guest_list_password p
    where p.hash = extensions.crypt(passcode, p.hash)
  ) then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;

  update public.chase_registrations
  set invite_sent_at = now()
  where lower(email) = any (select lower(e) from unnest(emails) as e);
  get diagnostics updated = row_count;
  return updated;
end;
$$;
revoke all on function public.chase_mark_invites_sent(text, text[]) from public;
grant execute on function public.chase_mark_invites_sent(text, text[]) to anon;

-- 5. Photo bucket "chase_photos" ------------------------------------------
-- Public so photos can be shown; 1 MB per file (the site shrinks photos
-- below that before uploading). The limit also applies to dashboard uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chase_photos', 'chase_photos', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Let the site list the photos (even public buckets need this for listing).
drop policy if exists "chase: anyone can list gallery" on storage.objects;
create policy "chase: anyone can list gallery"
  on storage.objects for select to public
  using (bucket_id = 'chase_photos');

-- Let guests add photos: JPEGs only, only inside guests/. No update or
-- delete rules, so guests can't overwrite or remove anything; delete
-- unwanted photos from the dashboard.
drop policy if exists "chase: guests can share photos" on storage.objects;
create policy "chase: guests can share photos"
  on storage.objects for insert to public
  with check (
    bucket_id = 'chase_photos'
    and name like 'guests/%.jpg'
  );

notify pgrst, 'reload schema';
