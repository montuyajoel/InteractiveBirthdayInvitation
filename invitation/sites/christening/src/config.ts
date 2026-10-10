// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "showcase-christening",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Gabriel Lim",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Gabriel",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2026-12-06T10:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 4,
  venue: "Sample Parish & Garden Hall",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "7 Sample Street, Quezon City",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "9:45 AM",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.google.com/?q=Quezon+City",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "Quezon City, Metro Manila",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "Baby {name}'s Christening",
  metaDescription: "Join us as {honoree} is welcomed into the faith.",
  logo: "{name}",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "You're invited to the",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "Christening",
  celebrationFor: "Of our little one",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "With grateful hearts we invite you to witness {name}'s baptism, followed by lunch with family and friends.",
  eventTitle: "Baby {honoree}'s Christening", // calendar entries, email subject
  footerSignature: "Baby {name}",
  footerLine: "Thank you for your love and prayers",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Save the date", // countdown headline when surprise is false

  rsvpEyebrow: "Kindly register",
  rsvpTitle: "Save your seat",
  rsvpIntro: "Let us know you're coming, and leave a prayer or a wish for baby {name}.",
  wishLabel: "Prayers & wishes",
  wishPlaceholder: "Dear baby {name}…",
  wishRequired: "Leave a little prayer or wish for {name}",
  thankYou: "You're on the list. See you on {date}!",

  arriveTip: "The baptism starts at {time}; please be seated a little early.",
  arriveByNote: "The baptism starts promptly", // under "Arrive by" in the email

  emailFromName: "Baby {name}'s Christening",
  emailIntro: "Your seat is confirmed! Thank you for registering. We can't wait to celebrate this blessing with you.",
  emailWishLabel: "Your prayer for Gabriel",
}

// Build-time overrides (e.g. Vercel → Settings → Environment Variables).
// When a variable isn't set, the value written below is used.
// (Also imported by the email function on the server, where import.meta.env
// doesn't exist, hence the defensive typing.)
const env: Record<string, string | undefined> =
  (import.meta as { env?: Record<string, string | undefined> }).env ?? {}

// Only ever use a project's anon / publishable key here (Project Settings →
// API Keys). Never a secret / service_role key or a database password: these
// values end up in the public site.
// While a project's key is empty its feature runs in preview mode: RSVPs stay
// in the visitor's browser, and the gallery shows sample tiles.

// Supabase project holding the guest registrations table.
// Env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
export const REGISTRATIONS = {
  url: env.VITE_SUPABASE_URL || "",
  key: env.VITE_SUPABASE_ANON_KEY || "",
  // This event's own table. Several events can share one Supabase project:
  // each gets its own table, send log and functions, all named after this
  // (supabase/setup.sql). Lowercase letters, digits and _ only.
  table: "showcase_christening_guests",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "event_photos", // must be a public bucket
  folder: "guests", // sub-folder inside the bucket; "" for the bucket root
}

// Studio credit shown at the bottom of every site and invitation email.
// Keep it on every event.
export const CREDIT = {
  text: "For customized invitations, email us at",
  email: "thedigitalinvitationsph@gmail.com",
}
