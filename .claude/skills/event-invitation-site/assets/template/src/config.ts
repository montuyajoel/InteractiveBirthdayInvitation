// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "sample-event",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Alex Rivera",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Alex",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2027-01-15T18:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 4,
  venue: "The Garden Pavilion",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.google.com/?q=The+Garden+Pavilion",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "The Garden Pavilion",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "{honoree} turns 18",
  metaDescription: "You're invited to {honoree}'s 18th birthday celebration.",
  logo: "{name}",
  logoAccent: "18", // shown after the logo in the brand colour; "" for none
  invitedLine: "You're invited to a",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "18^th^ Birthday",
  celebrationFor: "Celebration for",
  intro: "Join us for an evening of food, music and good company as we celebrate {name}'s 18th birthday.",
  eventTitle: "{honoree}'s 18th Birthday", // calendar entries, email subject
  footerSignature: "{honoree} · 18",
  footerLine: "We can't wait to celebrate with you",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Save the date", // countdown headline when surprise is false

  rsvpEyebrow: "Kindly register",
  rsvpTitle: "Save your seat",
  rsvpIntro: "Let us know you're coming so we can save you a seat, and leave a birthday wish for {name} while you're here.",
  wishLabel: "Birthday wishes",
  wishPlaceholder: "Dear {name}, happy birthday…",
  wishRequired: "Leave a little wish for {name}",
  thankYou: "You're on the list. We can't wait to celebrate with you on {date}.",

  arriveTip: "Doors open a little before {time}. We can't wait to see you there.",
  arriveByNote: "So you're settled in before the celebration starts", // under "Arrive by" in the email

  emailFromName: "{name}'s 18th Birthday",
  emailIntro: "Your seat is confirmed! Thank you for registering. We can't wait to celebrate {name}'s birthday with you.",
  emailWishLabel: "Your birthday wish",
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
  table: "registrations",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "event_photos", // must be a public bucket
  folder: "guests", // sub-folder inside the bucket; "" for the bucket root
}
