-- Registrations project (rgicukixlxexgzcxgvqg): tracks which guests have been
-- emailed their invitation. Run AFTER guest-list.sql. Safe to re-run, and it
-- doesn't touch the hosts' password.

alter table public.registrations add column if not exists invite_sent_at timestamptz;

-- guest_list now also returns invite_sent_at (the return type changed, so
-- the function is dropped and recreated).
drop function if exists public.guest_list(text);
create function public.guest_list(passcode text)
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
    select 1 from private.guest_list_password p
    where p.hash = extensions.crypt(passcode, p.hash)
  ) then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;

  return query
    select r.first_name, r.last_name, r.email, r.wishes, r.created_at, r.invite_sent_at
    from public.registrations r
    order by r.created_at;
end;
$$;
revoke all on function public.guest_list(text) from public;
grant execute on function public.guest_list(text) to anon;

-- Called by the email function after sending. Same password check.
create or replace function public.mark_invites_sent(passcode text, emails text[])
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated integer;
begin
  if not exists (
    select 1 from private.guest_list_password p
    where p.hash = extensions.crypt(passcode, p.hash)
  ) then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;

  update public.registrations
  set invite_sent_at = now()
  where lower(email) = any (select lower(e) from unnest(emails) as e);
  get diagnostics updated = row_count;
  return updated;
end;
$$;
revoke all on function public.mark_invites_sent(text, text[]) from public;
grant execute on function public.mark_invites_sent(text, text[]) to anon;

notify pgrst, 'reload schema';
