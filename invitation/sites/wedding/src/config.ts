// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "showcase-wedding",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Marco & Elena",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Marco & Elena",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2027-02-13T15:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 7,
  venue: "Villa Solana Gardens",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Km 52 Sample Road, Tagaytay City",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "2:30 PM",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.google.com/?q=Tagaytay+City",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "Tagaytay City, Cavite",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "{honoree} · Wedding",
  metaDescription: "Join us as {honoree} say I do.",
  logo: "M & E",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "Together with their families",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "We're getting married",
  celebrationFor: "The wedding of",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "We would be honoured to have you with us as we begin our forever: a garden ceremony followed by dinner and dancing.",
  eventTitle: "The Wedding of {honoree}", // calendar entries, email subject
  footerSignature: "{honoree}",
  footerLine: "With love and gratitude",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Save the date", // countdown headline when surprise is false

  rsvpEyebrow: "Kindly reply",
  rsvpTitle: "RSVP",
  rsvpIntro: "Please let us know you're coming, and leave the two of us a few words of advice or a wish.",
  wishLabel: "Wishes for the couple",
  wishPlaceholder: "Dear Marco and Elena…",
  wishRequired: "Leave a few words for the couple",
  thankYou: "We've saved you a seat. See you on {date}!",

  arriveTip: "The ceremony starts at {time} sharp; please be seated a little early.",
  arriveByNote: "The ceremony starts promptly", // under "Arrive by" in the email

  emailFromName: "Marco & Elena",
  emailIntro: "Thank you for your RSVP: your seat is confirmed! We can't wait to celebrate with you.",
  emailWishLabel: "Your wish for us",
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
  table: "showcase_wedding_guests",
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
