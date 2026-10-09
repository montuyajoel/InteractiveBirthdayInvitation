-- Registrations project: a log of every invitation email sent (or that
-- failed), so the hosts can see who was emailed, when, how many times, and
-- why a send didn't go through.
-- Run AFTER guest-list.sql and send-invitations.sql. Safe to re-run, and it
-- doesn't touch the hosts' password.

create table if not exists public.invite_log (
  id          bigint generated always as identity primary key,
  email       text not null,
  guest_name  text not null default '',
  status      text not null check (status in ('sent', 'failed')),
  error       text,
  message_id  text,          -- Gmail's Message-ID, for tracing a delivery
  sent_at     timestamptz not null default now()
);
create index if not exists invite_log_email_idx on public.invite_log (lower(email), sent_at desc);

-- Nobody reads or writes the log directly with the public key; only the
-- password-checked functions below can.
alter table public.invite_log enable row level security;
revoke all on public.invite_log from anon, authenticated;

-- Shared password check.
create or replace function private.check_guest_list_password(passcode text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from private.guest_list_password p
    where p.hash = extensions.crypt(passcode, p.hash)
  ) then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;
end;
$$;
revoke all on function private.check_guest_list_password(text) from public;

-- Called by the email function after each batch.
-- entries: [{ "email": "...", "name": "...", "status": "sent" | "failed",
--             "error": "...", "message_id": "..." }, ...]
create or replace function public.log_invites(passcode text, entries jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  logged integer;
begin
  perform private.check_guest_list_password(passcode);

  -- Only registered guests are logged, and at most 10 per call (the email
  -- function's batch size), so the public key can't flood the table.
  if jsonb_array_length(entries) > 10 then
    raise exception 'too many entries';
  end if;

  insert into public.invite_log (email, guest_name, status, error, message_id)
  select lower(e->>'email'),
         left(coalesce(e->>'name', ''), 200),
         e->>'status',
         left(e->>'error', 500),
         left(e->>'message_id', 300)
  from jsonb_array_elements(entries) as e
  where e->>'status' in ('sent', 'failed')
    and exists (select 1 from public.registrations r where lower(r.email) = lower(e->>'email'));
  get diagnostics logged = row_count;

  update public.registrations r
  set invite_sent_at = now()
  where lower(r.email) in (
    select lower(e->>'email') from jsonb_array_elements(entries) as e where e->>'status' = 'sent'
  );

  return logged;
end;
$$;
revoke all on function public.log_invites(text, jsonb) from public;
grant execute on function public.log_invites(text, jsonb) to anon;

-- The full log for the hosts, newest first.
create or replace function public.invite_history(passcode text)
returns table (email text, guest_name text, status text, error text, message_id text, sent_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.check_guest_list_password(passcode);
  return query
    select l.email, l.guest_name, l.status, l.error, l.message_id, l.sent_at
    from public.invite_log l
    order by l.sent_at desc
    limit 1000;
end;
$$;
revoke all on function public.invite_history(text) from public;
grant execute on function public.invite_history(text) to anon;

-- guest_list now also says how many invitations each guest was sent and how
-- the last attempt went (the return type changed, so drop and recreate).
drop function if exists public.guest_list(text);
create function public.guest_list(passcode text)
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
  perform private.check_guest_list_password(passcode);
  return query
    select r.first_name, r.last_name, r.email, r.wishes, r.created_at, r.invite_sent_at,
           coalesce(s.sent_count, 0)::integer, last.status, last.error, last.sent_at
    from public.registrations r
    left join lateral (
      select count(*) as sent_count from public.invite_log l
      where lower(l.email) = lower(r.email) and l.status = 'sent'
    ) s on true
    left join lateral (
      select l.status, l.error, l.sent_at from public.invite_log l
      where lower(l.email) = lower(r.email)
      order by l.sent_at desc limit 1
    ) last on true
    order by r.created_at;
end;
$$;
revoke all on function public.guest_list(text) from public;
grant execute on function public.guest_list(text) to anon;

notify pgrst, 'reload schema';
