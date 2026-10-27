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
- `src/config.ts` → `CONTACT`: who guests can message (Contact section + email)
- `public/og-image.jpg`: the picture shown when the link is shared (1200x630);
  `index.html` holds the preview title and description
- Invitation card: re-run the skill's `new_event.py --card`, or replace
  `src/assets/invitationCard.ts` + `public/email/invitation-card.jpg`

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5173 (preview mode until Supabase keys are set)
pnpm build      # static site in dist/ (Vercel builds this + api/ automatically)
```

## Go live

**Supabase (one project holds registrations and photos):**

Everything is named for Chase (`chase_registrations`, `chase_guest_list`,
`chase_mark_invites_sent`, bucket `chase_photos`), so it can go in its own new
project or share a project with other events without mixing guests.

1. Open your Supabase project, or create one at <https://supabase.com/dashboard>.
2. SQL Editor → New query → paste `supabase/chase-setup.sql`, replace
   `YOUR_PASSWORD` with the hosts' password, Run. This creates the
   `chase_registrations` table, the password-protected guest list, invite
   tracking and the `chase_photos` photo bucket (guest uploads go in `guests/`).
3. Project Settings → API Keys: copy the **Project URL** and the
   **publishable (anon) key**. In Vercel → Settings → Environment Variables
   set both pairs to the same project:
   `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, and
   `VITE_GALLERY_SUPABASE_URL` + `VITE_GALLERY_SUPABASE_KEY`.
   Never use the secret / service_role key.
4. Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` for the invitation emails,
   then redeploy.

To change the hosts' password later (or if the guest list says "That
password isn't right"), run `supabase/chase-set-password.sql`; it changes
only the password and checks it straight away.

Then smoke-test with your own email (register, upload a photo, open the
guest list, send yourself the invitation); the skill's `references/setup.md`
has the full checklist.

## Credits

The supercar images (`src/assets/cars/`, and the car on the invitation card)
are studio renders made with three.js from the "Ferrari 458 Italia" 3D model by
vicent091036 on Sketchfab (https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6),
as bundled in the three.js examples, lit with the CC0 "Venice Sunset" HDRI from
Poly Haven. Check the model's licence on its Sketchfab page before reusing it
elsewhere.
