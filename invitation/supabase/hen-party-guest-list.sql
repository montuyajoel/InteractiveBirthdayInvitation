-- HEN PARTY page: the hosts' password for the hen party guest list (separate from the wedding's).

-- This event's hosts' password for the guest list and invitation sending.
-- Run setup.sql first. Paste into Supabase → SQL Editor → New query, REPLACE
-- YOUR_PASSWORD below with the hosts' password, then Run. Re-run any time to
-- change it. Don't save the real password back into this file.
--
-- The password is checked in the database, never in the website, and only a
-- bcrypt hash of it is stored. Each event has its own password.

insert into private.event_passwords (event_table, hash)
values ('angelina_hen_party_guests', extensions.crypt('YOUR_PASSWORD', extensions.gen_salt('bf', 10)))
on conflict (event_table) do update set hash = excluded.hash;
