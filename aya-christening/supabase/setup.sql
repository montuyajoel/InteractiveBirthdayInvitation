-- Registrations project: guest registrations table.
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.

-- 1. Guest registrations ----------------------------------------------------
create table if not exists public.registrations (
  id          bigint generated always as identity primary key,
  first_name  text not null check (char_length(first_name) between 1 and 60),
  last_name   text not null check (char_length(last_name) between 1 and 60),
  email       text not null unique,
  wishes      text not null check (char_length(wishes) between 1 and 500),
  -- ticked "I'd love to be a Ninong/Ninang" on the form
  ninong_ninang boolean not null default false,
  created_at  timestamptz not null default now()
);

-- For a table created before the Ninong/Ninang checkbox existed.
alter table public.registrations add column if not exists ninong_ninang boolean not null default false;

alter table public.registrations enable row level security;

-- Make sure the public (anon) role can reach the table at all. RLS below
-- still limits it to inserting.
grant usage on schema public to anon;
grant insert on public.registrations to anon;

-- Guests may add themselves; the public key cannot read, change or delete
-- anyone's registration. View them in Table Editor (or with the service key).
drop policy if exists "guests can register" on public.registrations;
create policy "guests can register"
  on public.registrations for insert to anon
  with check (true);
