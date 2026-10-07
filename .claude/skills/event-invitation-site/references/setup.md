# Backend setup (Supabase, Vercel, Gmail)

Everything works without a backend in **preview mode**. To go live, the
hosts need: a Supabase project (registrations), optionally a second one or a
bucket for photos, a Vercel project, and a Gmail account for sending.
Walk them through it in this order; they run the SQL and set the secrets.

## 1. Registrations project (Supabase)

1. SQL Editor → New query → paste **`supabase/setup.sql`** → Run.
   Creates `registrations` (unique email, wish ≤ 500 chars), insert-only for `anon`.
2. Paste **`supabase/guest-list.sql`**, replace `YOUR_PASSWORD` with the
   hosts' password (once, on the `crypt('YOUR_PASSWORD', …)` line) → Run.
   Re-run with a new password to change it. Don't save the real password
   back into the file.
3. Paste **`supabase/send-invitations.sql`** → Run (tracks who was emailed;
   doesn't touch the password).
4. Project Settings → API Keys → copy the **publishable** key
   (`sb_publishable_…`) or the legacy **anon** key (`eyJ…`). Never the secret
   / service_role key.

Check: `select to_regclass('public.registrations') is not null, (select count(*) from pg_proc where proname = 'guest_list');` → `true, 1`.

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

One Vercel project per event, all importing the same repo:

- Add New → Project → import the repo; **Root Directory** = `invitation`
  (every event branch keeps its site there);
  Framework = Vite (build `npm run build`, output `dist`).
- Settings → Environments → Production → branch = the event's branch. Vercel
  only offers a branch it has built: if it says "No deployments found", go to
  Deployments → ⋯ → Create Deployment → the branch name, then retry.
- The folder's `vercel.json` (`ignoreCommand`) builds only that branch, so
  pushes to other events' branches show as *Canceled*. Leave the dashboard's
  "Ignored Build Step" empty: it overrides `vercel.json`. Branches without an
  `invitation/` folder (e.g. `invitation-skill`) fail with "Root Directory
  does not exist"; those are preview builds and don't touch the live site.
- Environment Variables:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | registrations project URL (or set it in config.ts) |
| `VITE_SUPABASE_ANON_KEY` | registrations publishable/anon key |
| `VITE_GALLERY_SUPABASE_URL` | gallery project URL |
| `VITE_GALLERY_SUPABASE_KEY` | gallery publishable key |
| `GMAIL_USER` | the Gmail address that sends invitations |
| `GMAIL_APP_PASSWORD` | 16-character Google app password |
| `EMAIL_FROM_NAME` | optional; defaults to `COPY.emailFromName` |
| `SITE_URL` | optional; defaults to the request's own origin |

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
