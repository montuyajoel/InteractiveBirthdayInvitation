-- Guest registrations for ONE event: its own table, send log and functions,
-- so several events can share one Supabase project without seeing each
-- other's guests.
--
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to re-run.
-- Then run guest-list.sql to set this event's hosts' password.
--
-- This event's table: showcase_graduation_guests   (REGISTRATIONS.table in src/config.ts)

create extension if not exists pgcrypto with schema extensions;

-- 1. Guest registrations -----------------------------------------------------
create table if not exists public.showcase_graduation_guests (
  id          bigint generated always as identity primary key,
  first_name  text not null check (char_length(first_name) between 1 and 60),
  last_name   text not null check (char_length(last_name) between 1 and 60),
  email       text not null unique,
  wishes      text not null check (char_length(wishes) between 1 and 500),
  created_at  timestamptz not null default now()
);
alter table public.showcase_graduation_guests add column if not exists invite_sent_at timestamptz;

-- Guests may add themselves; the public key cannot read, change or delete
-- anyone's registration. (Supabase grants the public key everything on new
-- tables, so lock it down to insert only.)
alter table public.showcase_graduation_guests enable row level security;
grant usage on schema public to anon;
revoke all on public.showcase_graduation_guests from anon, authenticated;
grant insert (first_name, last_name, email, wishes) on public.showcase_graduation_guests to anon;

drop policy if exists "guests can register" on public.showcase_graduation_guests;
create policy "guests can register"
  on public.showcase_graduation_guests for insert to anon
  with check (invite_sent_at is null);

-- 2. Log of every invitation email sent (or that failed) ----------------------
create table if not exists public.showcase_graduation_guests_invite_log (
  id          bigint generated always as identity primary key,
  email       text not null,
  guest_name  text not null default '',
  status      text not null check (status in ('sent', 'failed')),
  error       text,
  message_id  text,          -- Gmail's Message-ID, for tracing a delivery
  sent_at     timestamptz not null default now()
);
create index if not exists showcase_graduation_guests_invite_log_email_idx
  on public.showcase_graduation_guests_invite_log (lower(email), sent_at desc);
alter table public.showcase_graduation_guests_invite_log enable row level security;
revoke all on public.showcase_graduation_guests_invite_log from anon, authenticated;

-- 3. Hosts' passwords, one per event (bcrypt hashes; not exposed by the API) --
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.event_passwords (
  event_table text primary key,
  hash        text not null
);

create or replace function private.check_event_password(event_table text, passcode text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from private.event_passwords p
    where p.event_table = check_event_password.event_table
      and p.hash = extensions.crypt(passcode, p.hash)
  ) then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;
end;
$$;
revoke all on function private.check_event_password(text, text) from public;

-- 4. Hosts' functions for this event (password-checked) ----------------------

-- Everyone who registered, with how their invitations went.
drop function if exists public.showcase_graduation_guests_guest_list(text);
create function public.showcase_graduation_guests_guest_list(passcode text)
returns table (
  first_name text, last_name text, email text, wishes text,
  created_at timestamptz, invite_sent_at timestamptz,
  invite_count integer, last_invite_status text, last_invite_error text, last_invite_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.check_event_password('showcase_graduation_guests', passcode);
  return query
    select r.first_name, r.last_name, r.email, r.wishes, r.created_at, r.invite_sent_at,
           coalesce(s.sent_count, 0)::integer, last.status, last.error, last.sent_at
    from public.showcase_graduation_guests r
    left join lateral (
      select count(*) as sent_count from public.showcase_graduation_guests_invite_log l
      where lower(l.email) = lower(r.email) and l.status = 'sent'
    ) s on true
    left join lateral (
      select l.status, l.error, l.sent_at from public.showcase_graduation_guests_invite_log l
      where lower(l.email) = lower(r.email)
      order by l.sent_at desc limit 1
    ) last on true
    order by r.created_at;
end;
$$;
revoke all on function public.showcase_graduation_guests_guest_list(text) from public;
grant execute on function public.showcase_graduation_guests_guest_list(text) to anon;

-- Called by the email function after each batch.
-- entries: [{ "email", "name", "status": "sent" | "failed", "error", "message_id" }]
create or replace function public.showcase_graduation_guests_log_invites(passcode text, entries jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  logged integer;
begin
  perform private.check_event_password('showcase_graduation_guests', passcode);

  -- Registered guests only, at most 10 per call (the email function's batch
  -- size), so the public key can't flood the log.
  if jsonb_array_length(entries) > 10 then
    raise exception 'too many entries';
  end if;

  insert into public.showcase_graduation_guests_invite_log (email, guest_name, status, error, message_id)
  select lower(e->>'email'),
         left(coalesce(e->>'name', ''), 200),
         e->>'status',
         left(e->>'error', 500),
         left(e->>'message_id', 300)
  from jsonb_array_elements(entries) as e
  where e->>'status' in ('sent', 'failed')
    and exists (select 1 from public.showcase_graduation_guests r where lower(r.email) = lower(e->>'email'));
  get diagnostics logged = row_count;

  update public.showcase_graduation_guests r
  set invite_sent_at = now()
  where lower(r.email) in (
    select lower(e->>'email') from jsonb_array_elements(entries) as e where e->>'status' = 'sent'
  );

  return logged;
end;
$$;
revoke all on function public.showcase_graduation_guests_log_invites(text, jsonb) from public;
grant execute on function public.showcase_graduation_guests_log_invites(text, jsonb) to anon;

-- Every send attempt, newest first.
create or replace function public.showcase_graduation_guests_invite_history(passcode text)
returns table (email text, guest_name text, status text, error text, message_id text, sent_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.check_event_password('showcase_graduation_guests', passcode);
  return query
    select l.email, l.guest_name, l.status, l.error, l.message_id, l.sent_at
    from public.showcase_graduation_guests_invite_log l
    order by l.sent_at desc
    limit 1000;
end;
$$;
revoke all on function public.showcase_graduation_guests_invite_history(text) from public;
grant execute on function public.showcase_graduation_guests_invite_history(text) to anon;

notify pgrst, 'reload schema';
