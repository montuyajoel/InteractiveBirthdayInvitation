-- One-time setup for the invitation site.
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.

-- 1. Guest registrations ----------------------------------------------------
create table if not exists public.registrations (
  id          bigint generated always as identity primary key,
  first_name  text not null check (char_length(first_name) between 1 and 60),
  last_name   text not null check (char_length(last_name) between 1 and 60),
  email       text not null unique,
  wishes      text not null check (char_length(wishes) between 1 and 500),
  created_at  timestamptz not null default now()
);

alter table public.registrations enable row level security;

-- Guests may add themselves; the public key cannot read, change or delete
-- anyone's registration. View them in Table Editor (or with the service key).
drop policy if exists "guests can register" on public.registrations;
create policy "guests can register"
  on public.registrations for insert to anon
  with check (true);

-- 2. Photo gallery bucket ---------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

-- Lets the site list the bucket's files (uploads stay dashboard-only).
drop policy if exists "anyone can list gallery" on storage.objects;
create policy "anyone can list gallery"
  on storage.objects for select to anon
  using (bucket_id = 'gallery');
