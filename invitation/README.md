# Chelsea Louise · 16: surprise birthday invitation

An interactive invitation site with four sections:

- **Invitation**: an envelope that opens to reveal the printed card, plus a live countdown and add-to-calendar buttons.
- **Register**: first name, last name, email and birthday wishes, with validation.
- **Gallery**: a photo grid with a full-screen lightbox. Browse with arrow keys, swipe or thumbnails, or press space for a slideshow.
- **How to get there**: an embedded map, a directions link and the pinned location.

Built with React, TypeScript, Tailwind and shadcn/ui, scaffolded with the `web-artifacts-builder` skill.

## Run it

```bash
pnpm install
pnpm dev                 # local preview at http://localhost:5173
pnpm build               # static site in dist/, ready for Netlify, Vercel, GitHub Pages…
bash ../.claude/skills/web-artifacts-builder/scripts/bundle-artifact.sh   # single-file bundle.html
```

## Edit the event

Everything event-specific lives in `src/config.ts`: name, date and time, venue, map link and Supabase settings.

## Connect Supabase

The site uses two Supabase projects:

| Feature | Project | SQL to run once | Env vars (Vercel) |
| --- | --- | --- | --- |
| Registrations | `rgicukixlxexgzcxgvqg` | `supabase/setup.sql` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Photo gallery | `uuiftuibexylqbhhzmix` | `supabase/gallery-setup.sql` | `VITE_GALLERY_SUPABASE_URL`, `VITE_GALLERY_SUPABASE_KEY` |

For each project:

1. **Run its SQL.** In that project, open SQL Editor → New query, paste the file and click Run.
2. **Give the site its public key.** Copy the Publishable key (`sb_publishable_…`) or the anon key (`eyJ…`) from Project Settings → API Keys. Either set it as the env var above in Vercel (Settings → Environment Variables, then redeploy) or put it in `src/config.ts`. The URLs are already the defaults, so their env vars are optional.

Never use a secret / `service_role` key or the database password: everything here ends up in the public site. A feature whose key is empty runs in preview mode. Registrations are then kept in the visitor's browser only, and the gallery shows sample tiles.

On Vercel, set the project's Root Directory to `invitation`.

### Registrations

Guests can add themselves but can't read the list. View registrations in Table Editor → `registrations`. A repeated email gets a friendly "already registered" message.

### Guest list (hosts only)

At the bottom of the page, "See who's coming" asks for a password and then lists everyone who registered (name, email, wish, date). The password is checked by a database function, never in the website, and only a bcrypt hash is stored. To set it up or change the password, open `supabase/guest-list.sql`, replace `YOUR_PASSWORD`, and run it in the registrations project. Don't commit the real password.

### Invitation emails

In the unlocked guest list, hosts can **Send invitation** to one guest or **Send to N not yet invited**. Each guest gets an email confirming their seat, with the date and time, venue and address, a directions button, an "Add to Google Calendar" link and an `invitation.ics` attachment for Apple Calendar or Outlook. The email is built in `api/_lib/invitationEmail.ts` and sent by the Vercel function `api/send-invitations.ts` through Gmail. The function checks the hosts' password with the database and only emails registered addresses.

Setup:

1. Run `supabase/send-invitations.sql` in the registrations project (after `guest-list.sql`). It adds the "sent" tracking.
2. Turn on 2-Step Verification for the Gmail account, then create an app password at <https://myaccount.google.com/apppasswords>.
3. In Vercel → Settings → Environment Variables, add `GMAIL_USER` (the Gmail address) and `GMAIL_APP_PASSWORD` (the 16-character app password). Optional: `EMAIL_FROM_NAME` (default "Chelsea's 16th Birthday") and `SITE_URL`. Then redeploy.
4. Fill in `address` and `arriveBy` in `src/config.ts` to show them in the email.

Sending only works on the deployed site, not in `pnpm dev` or the single-file bundle.

### Photos

Anyone can share photos from the "Share your photos" panel in the gallery (they're asked for their name; registered guests also get the panel on their thank-you card). The home page shows the 10 newest photos with a "See all photos" button to the full gallery at `#/photos`. Photos are resized in the browser to a JPEG under 1 MB and uploaded to the `Mallows` folder, captioned "From <name>". `supabase/gallery-setup.sql` grants guests insert-only access to that folder and caps the bucket at 1 MB per file.

Upload photos (jpg, png, webp, gif or avif) to the `Mallows` folder of the `mallows_birthday` bucket in the gallery project's Storage. The newest appear first, and captions come from descriptive file names (`cake-cutting.jpg` → "cake cutting"); auto-generated names show no caption. Set `GALLERY.folder` in `src/config.ts` to show just one folder.
