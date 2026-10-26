-- Registrations project: password-protected guest list.
-- Paste into Supabase → SQL Editor → New query, REPLACE  YOUR_PASSWORD  below
-- with the hosts' password, then Run. Re-run any time to change the password.
--
-- The password is checked here in the database, never in the website, and
-- only a bcrypt hash of it is stored. The registrations table itself stays
-- unreadable with the public key.

create extension if not exists pgcrypto with schema extensions;

-- Not exposed through the API.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.guest_list_password (
  id   int primary key default 1 check (id = 1),
  hash text not null
);

insert into private.guest_list_password (id, hash)
values (1, extensions.crypt('YOUR_PASSWORD', extensions.gen_salt('bf', 10)))
on conflict (id) do update set hash = excluded.hash;

create or replace function public.guest_list(passcode text)
returns table (first_name text, last_name text, email text, wishes text, created_at timestamptz)
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

  return query
    select r.first_name, r.last_name, r.email, r.wishes, r.created_at
    from public.registrations r
    order by r.created_at;
end;
$$;

revoke all on function public.guest_list(text) from public;
grant execute on function public.guest_list(text) to anon;
