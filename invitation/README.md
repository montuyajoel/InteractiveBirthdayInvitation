# Celebrations: sample invitation sites

Four sample events served from one address, each a copy of a real event's
site with every name, place, date and photo swapped for made-up ones.

| Path | Sample event | Design copied from |
| --- | --- | --- |
| `/` | Landing page (Apple-style), with Contact us at the bottom | |
| `/birthday/` | Isabel Sofia's surprise 16th birthday | `mallows-birthday` |
| `/wedding/` | Elena & Marco's wedding | `claude/brendan-angelina-wedding` |
| `/graduation/` | Joaquin's graduation celebration | `joel-graduation` |
| `/christening/` | Baby Sofia Gabrielle ("Gabby")'s christening | `aya-christening` |

Each site keeps its real event's look and features (envelope and printed
cards, decorations, countdown and calendar, registration, gallery, map,
hosts' guest list, confirmation email) and adds a small showcase layer:

- **Sample database.** No Supabase: registrations stay in the visitor's
  browser, and the hosts' guest list (password `demo`) shows five made-up
  guests plus anyone who registered in that browser.
- **Sample confirmation email.** After registering, a guest can press
  *Email it to me* to get the real confirmation email (marked `[Sample]`), or
  *Preview* to see it on screen. In the guest list, sends to the made-up
  `@example.com` guests are simulated; your own registration gets a real email.
- **Contact us** section above every footer, a bottom switcher between the
  four events, and the studio credit in every footer and email.

## Layout

| Folder | What |
| --- | --- |
| `scripts/import_sites.py` | copies each real site from its branch and swaps in the made-up details |
| `scripts/cards.config.mjs` | where each real card's details sit, and the made-up text that replaces them |
| `cards/` | the edited printed cards (and the christening's illustrated "first months") |
| `overlay/` | showcase files copied into every site |
| `sites/<slug>/` | the imported sites (don't edit by hand: re-run the import) |
| `home/` | the landing page, and `share.jpg`, its link-preview picture |
| `api/send-confirmation.ts` | the sample email function (Vercel) |

## Run it locally

```bash
npm install        # or pnpm install
npm run dev        # → http://localhost:5173
```

Everything is served at one address, like the live site: the landing page at
`/` and each event at `/birthday/`, `/wedding/`, `/graduation/` and
`/christening/`, with live reload as you edit `sites/<slug>/`. Each site's
own Vite runs on ports 5183 to 5186 behind it (set `PORT` to move them all).
*Email it to me* sends for real only if `GMAIL_USER` and `GMAIL_APP_PASSWORD`
are set in your shell; otherwise the site says email isn't switched on, and
*Preview* still works.

`npm run build` makes the deployable `dist/`; `npm run typecheck` checks
every site and the email function.

## Change something

The made-up details live in `scripts/import_sites.py` (text: names, places,
dates, map pins) and `scripts/cards.config.mjs` (the printed cards). The
import fails if any real name or place is left over, so a new event branch or
a change to one shows up straight away.

```bash
npm install                            # once (or pnpm install)
node scripts/edit_cards.mjs            # printed cards → cards/ (reads the originals from git)
node scripts/make_milestones.mjs       # christening "first months" pictures
python3 scripts/import_sites.py        # sites/ from the event branches (+ link previews)
node scripts/make_home_share.mjs       # landing page's link preview
npm run typecheck && npm run build     # → dist/
```

The real cards and photos are never copied into this folder: the scripts read
them from the event branches with `git show`/`git archive`, so those branches
must be fetched (`git fetch origin`).

## Link previews

Sharing any of the addresses on Facebook, Messenger, WhatsApp, iMessage or X
shows a 1200×630 picture: `home/share.jpg` for the main address (all four
cards) and `sites/<slug>/public/share.jpg` for each event (the birthday's is
drawn by `scripts/make_birthday_share.mjs`; it predates the template's
share-card page). The tags use full
addresses, filled in at build time from `SITE_URL` or Vercel's production
domain. After a deploy, paste the address into
[Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/)
and press *Scrape Again* so Facebook and Messenger drop any old picture.

## Deploy (Vercel)

1. New Vercel project from this repo: **Root Directory** `invitation`,
   **Production Branch** `sample-showcase`. `vercel.json` sets the install,
   build and output settings and skips builds for other branches.
2. To send real sample emails, add environment variables `GMAIL_USER` and
   `GMAIL_APP_PASSWORD` (a Google app password), optionally `SITE_URL`, then
   redeploy. Without them, *Preview* still works and *Email it to me* says
   sending isn't switched on yet.

The email function is public, so it only sends a fixed email: the guest's
name is checked (letters only, 40 characters), their wish is left out,
`@example.com` addresses are refused, and sends are limited per visitor
(5 an hour), per address (3 a day) and per server instance (200 a day).
These limits are best-effort; add a CAPTCHA if the site gets abused.
