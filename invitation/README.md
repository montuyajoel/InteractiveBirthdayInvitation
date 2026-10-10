# Celebrations: sample invitation sites

Four sample events built with the `event-invitation-site` skill, served from
one address. Every name, address, guest and picture here is made up.

| Path | Event |
| --- | --- |
| `/` | Landing page (Apple-style), with Contact us at the bottom |
| `/birthday/` | Isabel "Bella" Navarro's surprise 16th birthday |
| `/wedding/` | Marco & Elena's wedding |
| `/graduation/` | Joaquin Ramos's graduation party |
| `/christening/` | Baby Gabriel Lim's christening |

Each event site is the skill's template with all its features (envelope,
countdown and calendar, registration, gallery, directions, hosts' guest list
and confirmation emails), plus a small showcase layer:

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
| `specs/<slug>.json` | each event's details, wording and colours (the skill's `event.json`) |
| `cards/<slug>.jpg` | the printed invitation cards, drawn by `scripts/make_cards.mjs` |
| `overlay/` | showcase files copied into every site |
| `sites/<slug>/` | the generated sites (don't edit by hand; see below) |
| `home/` | the landing page |
| `api/send-confirmation.ts` | the sample email function (Vercel) |

## Change something

Edit a spec, `overlay/` or `scripts/build_sites.py`, then regenerate:

```bash
node scripts/make_cards.mjs            # only if names/dates/venues changed (needs Playwright)
python3 scripts/build_sites.py         # regenerates sites/ from the specs + overlay
for s in birthday wedding graduation christening; do
  node ../.claude/skills/event-invitation-site/scripts/share_image.mjs sites/$s
done                                   # link-preview pictures
pnpm install && pnpm run typecheck && pnpm run build   # → dist/
```

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
