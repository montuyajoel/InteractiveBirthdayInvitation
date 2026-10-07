-- Registrations project: adds the "I'd love to be a Ninong/Ninang" checkbox
-- to a database that was set up before it existed. Run it once in
-- Supabase → SQL Editor → New query → Run. Safe to re-run, and it doesn't
-- touch the hosts' password or any registrations.
-- (New setups don't need this: setup.sql and guest-list.sql include it.)

alter table public.registrations add column if not exists invite_sent_at timestamptz;
alter table public.registrations add column if not exists ninong_ninang boolean not null default false;

-- The hosts' guest list now also says who offered to be a Ninong/Ninang.
drop function if exists public.guest_list(text);
create function public.guest_list(passcode text)
returns table (
  first_name text, last_name text, email text, wishes text,
  created_at timestamptz, invite_sent_at timestamptz, ninong_ninang boolean
)
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
    select r.first_name, r.last_name, r.email, r.wishes, r.created_at, r.invite_sent_at, r.ninong_ninang
    from public.registrations r
    order by r.created_at;
end;
$$;
revoke all on function public.guest_list(text) from public;
grant execute on function public.guest_list(text) to anon;

notify pgrst, 'reload schema';
