# Backend setup (Supabase, Vercel, Gmail)

Everything works without a backend in **preview mode**. To go live, the
hosts need: a Supabase project for registrations (one project can hold every
event), optionally a second one or a bucket for photos, a Vercel project,
and a Gmail account for sending.
Walk them through it in this order; they run the SQL and set the secrets.

## 1. Registrations (Supabase): one table per event

Several events can share one Supabase project (the free plan only allows two
active projects). Each event gets its own table, named in
`REGISTRATIONS.table` in `src/config.ts` (the setup script derives it from
the event id, e.g. `santos_debut_2027_guests`, or takes
`registrations.table` from `event.json`). Its send log
(`<table>_invite_log`), its functions (`<table>_guest_list`,
`<table>_log_invites`, `<table>_invite_history`) and its hosts' password are
all separate, so one event's hosts never see another event's guests, and the
same guest can RSVP to several events.

1. SQL Editor → New query → paste **`supabase/setup.sql`** → Run.
   Creates this event's table (unique email per event, wish ≤ 500 chars),
   insert-only for `anon`, plus its send log and functions. Safe to re-run,
   and safe if the table was already created by hand: it then adds the
   security the bare table lacks (without it, Supabase lets the public key
   read every guest).
2. Paste **`supabase/guest-list.sql`**, replace `YOUR_PASSWORD` with this
   event's hosts' password → Run. Re-run with a new password to change it.
   Don't save the real password back into the file.
3. Project Settings → API Keys → copy the **publishable** key
   (`sb_publishable_…`) or the legacy **anon** key (`eyJ…`). Never the secret
   / service_role key. Every event in the project uses the same key.

Check (replace the table name):
`select to_regclass('public.my_event_guests') is not null, to_regclass('public.my_event_guests_invite_log') is not null, (select count(*) from pg_proc where proname like 'my_event_guests\_%'), exists (select 1 from private.event_passwords where event_table = 'my_event_guests');`
→ `true, true, 3, true`.

Sites made before per-event tables (one shared `registrations` table with
`guest_list`, `mark_invites_sent`) keep working; the new names never clash
with them.

## 2. Gallery bucket (same or another Supabase project)

1. Storage → New bucket → name = `GALLERY.bucket` in config, **Public**.
   Create the folder `GALLERY.folder` (or upload into it).
2. Paste **`supabase/gallery-setup.sql`** (bucket/folder already filled in by
   the setup script) → Run. It lets the site list photos, lets guests upload
   `.jpg` into that folder only (no update/delete), and caps files at 1 MB.
   The cap also applies to dashboard uploads; resize big photos first or drop
   that `update storage.buckets` statement.
3. Copy that project's publishable key.

## 3. Vercel

- Import the repo; **Root Directory** = `invitation` (every event lives there, one branch per client);
  Framework = Vite (build `npm run build`, output `dist`).
- Environment Variables:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | registrations project URL (the same for every event in that project) |
| `VITE_SUPABASE_ANON_KEY` | registrations publishable/anon key |
| `VITE_GALLERY_SUPABASE_URL` | gallery project URL |
| `VITE_GALLERY_SUPABASE_KEY` | gallery publishable key |
| `GMAIL_USER` | the Gmail address that sends invitations |
| `GMAIL_APP_PASSWORD` | 16-character Google app password |
| `EMAIL_FROM_NAME` | optional; defaults to `COPY.emailFromName` |
| `SITE_URL` | optional; the site's address, e.g. `https://brendan-angelina.vercel.app`. Used for links in emails and for the link-preview picture. Defaults to the request's own address (emails) and Vercel's production domain (preview picture); **set it when using a custom domain** |

`VITE_*` values are baked in at build time and are public: **redeploy after
changing them**. Keep the two Supabase URLs straight: a gallery URL in
`VITE_SUPABASE_URL` sends registrations to the wrong project.

## 4. Gmail app password

Turn on 2-Step Verification for the account, then create one at
<https://myaccount.google.com/apppasswords>. The normal password won't
work. Gmail allows roughly 500 messages a day, plenty for a guest list.

## 5. Smoke test on the live site

1. Register with your own email → row appears in Table Editor.
2. Upload a photo from the gallery → appears first, captioned "From <name>".
3. Unlock "See who's coming" with the password → you're listed.
4. Click **Send invitation** on your row → email arrives with the card,
   details, directions, Google Calendar link and `invitation.ics`.

## Link previews (the picture shown when the link is shared)

`public/share.jpg` plus the `og:` tags in `index.html` make WhatsApp,
Messenger, iMessage, Facebook, Viber, X and Slack show a large "You're
invited!" picture. After deploying:

- Check it at <https://developers.facebook.com/tools/debug/> (paste the
  site's address → **Scrape Again**). This also refreshes Messenger and
  Facebook's cached preview.
- Apps cache a link's preview for days. If an old preview (no picture) still
  shows in WhatsApp, share the link with something added, e.g.
  `https://site.vercel.app/?v=2`; it opens the same page.
- The picture must be reachable at `<site>/share.jpg` (open it in a browser).

