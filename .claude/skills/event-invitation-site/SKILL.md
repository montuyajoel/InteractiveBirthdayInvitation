---
name: event-invitation-site
description: Build a complete interactive invitation website for an event (birthday, debut, 18th, wedding, baptism, anniversary, reunion, party) from a proven template. Hero with an envelope that opens to the printed card, countdown and add-to-calendar, guest registration saved to Supabase, photo gallery where guests upload photos (resized under 1 MB) plus an all-photos page, embedded map and directions, a password-protected guest list for the hosts, and host-sent confirmation emails through Gmail on Vercel, with a database log of every invite sent (who, when, sent or failed). Features stay the same; colours, fonts, wording and decorations change per event. Use this whenever someone wants an invitation site, RSVP page, event website or "a page guests can register on", even if they only say something like "make an invite website for my daughter's 18th" or hand you a printed invitation design.
---

# Event invitation site

This skill turns `assets/template/` (React + Vite + Tailwind + shadcn/ui, with a
Vercel serverless function for email) into a new event's site. All event
specifics live in three places, so a new event never needs code surgery:

| What | Where |
| --- | --- |
| Event facts (names, date/time zone, venue, map) and **all wording** | `src/config.ts` → `EVENT`, `COPY` |
| Colours, envelope shades, fonts | `src/theme.ts` → `THEME` (used by the site *and* the email) |
| The printed invitation image | `src/assets/invitationCard.ts` + `public/email/invitation-card.jpg` |

`scripts/new_event.py` copies the template and fills all three from one
`event.json`.

**Studio credit (every site):** the footer of every site and the bottom of
every invitation email say "For customized invitations, email us at
thedigitalinvitationsph@gmail.com". It comes from `CREDIT` in
`src/config.ts`, is already in the template, and is not part of
`event.json`. Keep it on every event: don't remove, restyle away or reword
it unless the studio owner asks, and check it in the footer and email
screenshots before showing anyone.

**Where the site goes:** always the repo's `invitation/` folder, never a new
folder. That folder is the Vercel project's Root Directory, so a site
anywhere else doesn't deploy. Each client gets their own git branch from the
default branch (e.g. `claude/brendan-angelina-wedding`), and the new event
replaces the previous one inside `invitation/` on that branch; earlier
clients stay on their own branches. Keep `invitation/vercel.json` as it is. Decorations (flowers, butterflies, hearts) live in
`src/components/site/Decor.tsx` and are the main thing to redraw for a
different motif.

## Workflow

### 1. Gather the event details

Ask only for what's missing, in one round. You need:

- who it's for (full name + the short name used in sentences) and the occasion
- date, start time, **time zone** and rough duration
- venue name, street address, and a Google Maps link (or coordinates)
- whether it's a **surprise** (turns on the "Shhh…" wording everywhere)
- optional: arrive-by time, the printed invitation image, preferred colours

Never invent dates, addresses or times: they end up in calendar invites and
emails. Check that the weekday printed on their card matches the date (a
reused design once said "Friday, October 31" for a year where it was a
Saturday); point out a mismatch rather than silently picking one.

### 2. Choose the design

If they give a printed card, take the design from it: read the image, and
pull its palette with
`convert card.jpg -resize 64x64 -colors 8 -format "%c" histogram:info:`.
Map the colours to roles (ink = darkest readable text, brand = the card's
accent/lettering colour, soft/highlight = pale washes, paper = background).
Pick a script + serif font pair from Google Fonts that echoes the card's
lettering. Otherwise start from a preset in `references/design.md`.
Read `references/design.md` before changing decorations or layout: it covers
the token roles, contrast targets, motif swaps and what not to break.

### 3. Generate the site

```bash
python3 <skill>/scripts/new_event.py --example > event.json   # start from the example
# edit event.json (only include keys you want to change)
git checkout -b claude/<client-event> origin/main                  # one branch per client
python3 <skill>/scripts/new_event.py --spec event.json --card card.jpg --replace   # writes invitation/
```

`--dest` defaults to `invitation`; `--replace` clears the previous event out
of it first (keeping `vercel.json`, `node_modules`, `.vercel`), so no stale
files such as old decoration images survive. Keep `event.json`, screenshots
and other scratch files out of the repo.

The script rejects unknown keys (so typos fail loudly), validates the start
time format (`2027-04-24T15:30:00+08:00`, local time with its UTC offset) and
refuses secrets in the Supabase sections. Without `--card` it draws a
placeholder card in the event's colours.

Wording placeholders: `{name}` (short name), `{honoree}`, `{time}`, `{date}`;
`^th^` makes a superscript in titles ("18^th^ Birthday"). Set
`copy.surprise: false` for non-secret events: the countdown shows
`saveTheDate` instead and the surprise lines disappear from the site and email.

Then adapt what config can't express: redraw `Decor.tsx` motifs if the theme
calls for it (e.g. leaves for a garden wedding, stars for a debut), and adjust
the sample gallery captions in `src/lib/gallery.ts`.

### 4. Verify before showing anyone

```bash
cd invitation && pnpm install          # npm can't install into a pnpm tree
npx tsc -p tsconfig.app.json --noEmit      # site
npx tsc -p tsconfig.api.json               # email function
npx vite build
```

Then screenshot desktop (1280 px) and mobile (390 px) with Playwright, and
open the envelope, submit the form empty and filled, and open the gallery
lightbox. Headless Chromium behind a proxy may not load Google Fonts; pass
`ignoreHTTPSErrors: true` and don't judge typography from a fallback font.
Render the invitation email too (bundle `api/_lib/invitationEmail.ts` with
esbuild and write `invitationEmail(guest, siteUrl).html` to a file), with
`surprise` both on and off. `references/troubleshooting.md` lists the
problems this template has hit before and how they were fixed.

Make the **link-preview picture** (what WhatsApp, Messenger, iMessage,
Facebook… show when the site's link is shared):

```bash
node <skill>/scripts/share_image.mjs invitation   # → invitation/public/share.jpg
```

It screenshots the hidden `#/share-card` page (`ShareCard.tsx`: "You're
invited!" from `COPY.shareHeadline`, names, date, venue and the printed card)
at 1200×630. Give `ShareCard.tsx` the event's own motif, look at the
result, and commit `public/share.jpg`. Re-run it whenever names, date, venue,
card or design change. `index.html` already carries the `og:` / `twitter:`
tags.

Show the user screenshots (and a single-file preview if the
web-artifacts-builder skill is available: run its `bundle-artifact.sh` in
`invitation/`) **before** pushing, and wait for their go-ahead when they
ask to review first.

### 5. Connect the backend

Walk the user through `references/setup.md`: Supabase SQL (`setup.sql`
creates this event's own registrations table, send log and functions;
`guest-list.sql` sets this event's hosts' password; gallery bucket policies), Vercel project settings and environment variables, and the Gmail
app password. They run the SQL and set secrets themselves; you never need,
and should never store, their database password or secret keys.

## Security rules (why they matter)

- **Only public keys in the site.** Everything in `src/` ships to every
  visitor. Use the anon/publishable Supabase key; secret keys are rejected by
  Supabase from browsers anyway ("Forbidden use of secret API key").
- **One table per event, never shared.** Many events live in one Supabase
  project, each with its own table (`REGISTRATIONS.table`), send log,
  functions and password. Never point a new event at another event's table
  (or at an old site's shared `registrations`): its hosts would see the other
  event's guests and could email them. The setup script names the table from
  the event id; `registrations.table` in `event.json` overrides it.
- **The hosts' password is checked in the database**, never in the browser:
  `<table>_guest_list(passcode)` is a `SECURITY DEFINER` function comparing
  against this event's bcrypt hash in `private.event_passwords`. Keep the real password out of the repo:
  the SQL file says `YOUR_PASSWORD` and the user replaces it when running it.
- **The invite log is closed to the public key.** `<table>_invite_log` has
  RLS on and no grants; the email function writes to it through
  `<table>_log_invites` (password-checked, this event's guests only, 10 rows
  per call) and hosts read it through `<table>_invite_history`. Don't add a select policy for `anon`.
- **Guests can insert, never read.** Registrations are insert-only for
  `anon`; the email function re-checks the password and only emails
  registered addresses, so it can't be used to spam.
- If a user pastes a password or connection string into the chat, don't put
  it anywhere in the project, and suggest they rotate it.

## Feature map (for orientation when editing)

- `Hero.tsx` + `Envelope.tsx`: title block and opening envelope; `Countdown.tsx`: timer + calendar buttons
- `ShareCard.tsx` (`#/share-card`, not linked): the 1200×630 link-preview picture →
  `public/share.jpg` via `scripts/share_image.mjs`; `vite.config.ts` turns `%SITE_URL%` in the
  `og:` tags into the full address (`SITE_URL`, else Vercel's production domain)
- `Rsvp.tsx`: registration form (react-hook-form + zod) → `lib/registrations.ts`
- `Gallery.tsx`, `PhotosPage.tsx` (`#/photos`), `PhotoUpload.tsx` → `lib/gallery.ts`, `lib/resizeImage.ts`
- `Directions.tsx`: Google Maps embed + links; `GuestList.tsx`: hosts' list + send buttons
- `api/send-invitations.ts` + `api/_lib/invitationEmail.ts`: Gmail sending and the email itself;
  every attempt is logged to `<table>_invite_log` (`supabase/setup.sql`), shown in `GuestList.tsx`
  as per-guest send counts, failed badges and a **Send history** panel
- `lib/event.ts`: date labels, calendar links, `.ics`, `fill()`; shared by site and email
- Without Supabase keys every feature still works in **preview mode** (RSVPs in
  localStorage, sample gallery), which is handy for demos.
