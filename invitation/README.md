# Event invitation site

Generated from the `event-invitation-site` skill. Interactive invitation with:
envelope reveal, countdown and add-to-calendar, guest registration (Supabase),
photo gallery with guest uploads (resized under 1 MB) and an all-photos page,
map and directions, a password-protected guest list, and host-sent
confirmation emails (Gmail, Vercel function).

## Customise

- `src/config.ts`: event facts (`EVENT`) and all wording (`COPY`)
- `src/theme.ts`: colours, envelope shades, fonts (site **and** email)
- `src/components/site/Decor.tsx`: decorative motifs
- Invitation card: re-run the skill's `new_event.py --card`, or replace
  `src/assets/invitationCard.ts` + `public/email/invitation-card.jpg`

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5173 (preview mode until Supabase keys are set)
pnpm build      # static site in dist/ (Vercel builds this + api/ automatically)
```

## Go live

See the skill's `references/setup.md`: run the SQL files in `supabase/`,
set the Vercel environment variables (Supabase publishable keys, Gmail app
password), redeploy, and smoke-test with your own email.

## Ninong / Ninang checkbox

The registration form asks guests whether they'd like to be Aya's
Ninong/Ninang (godparent). It's saved in the `ninong_ninang` column of
`registrations` and shown as a tag, with a count, in the hosts' guest list.

- **New database:** nothing extra; `setup.sql`, `guest-list.sql` and
  `send-invitations.sql` already include it.
- **Database set up before this was added:** run
  `supabase/ninong-ninang.sql` once in Supabase → SQL Editor. Until then,
  guests who tick the box get an error (unticked registrations still work).

To see who offered in Supabase: Table Editor → `registrations`, filter
`ninong_ninang` = true.
