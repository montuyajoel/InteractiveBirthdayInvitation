-- Change (or reset) the hosts' password for Chase's guest list.
-- Touches nothing else: guests, photos and sent-invite marks stay as they are.
--
-- Supabase → SQL Editor → New query → paste this, replace  NEW_PASSWORD  in
-- BOTH places below (keep the single quotes; passwords are case-sensitive),
-- then Run. Needs supabase/chase-setup.sql to have been run once.

insert into private.chase_guest_list_password (id, hash)
values (1, extensions.crypt('NEW_PASSWORD', extensions.gen_salt('bf', 10)))
on conflict (id) do update set hash = excluded.hash;

-- Check: this should list your registered guests (an empty list is fine
-- before anyone registers). "invalid passcode" means the two passwords differ.
select first_name, last_name, email, created_at
from public.chase_guest_list('NEW_PASSWORD');
