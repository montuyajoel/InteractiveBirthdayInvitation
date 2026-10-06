// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "aya-christening-2026",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Avrielle Noelle",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Aya",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2026-12-20T10:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 4,
  venue: "Tea Plan",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Bacolod City, Negros Occidental",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.google.com/?q=Tea+Plan+Bacolod",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "Tea Plan, Bacolod City",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "{honoree}'s Christening",
  metaDescription: "You're invited to the christening of baby {honoree}.",
  logo: "Baby {name}",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "You're invited to the",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "Christening",
  celebrationFor: "of our little one",
  intro: "With hearts full of joy, we invite you to witness {name}'s christening as she is welcomed into God's family, followed by a little celebration with everyone who loves her.",
  eventTitle: "{honoree}'s Christening", // calendar entries, email subject
  footerSignature: "Baby {name}",
  footerLine: "Thank you for being part of {name}'s first blessing",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Save the date", // countdown headline when surprise is false

  milestonesEyebrow: "Watch me grow",
  milestonesTitle: "{name}'s first months",
  milestonesIntro: "A little peek at how {name} has grown, one month at a time, on the way to her christening.",

  // The "I'd love to be a Ninong/Ninang" checkbox (godparent at the christening)
  sponsorLabel: "I'd love to be {name}'s Ninong / Ninang",
  sponsorHint: "Tick this if you'd like to stand as a godparent at the christening. We'll get in touch with the details.",
  sponsorThanks: "Thank you for offering to be {name}'s Ninong / Ninang. We'll be in touch with the details.",
  emailSponsorNote: "Thank you for offering to be {name}'s Ninong / Ninang! We'll get in touch with the details before the christening.",

  rsvpEyebrow: "Kindly register",
  rsvpTitle: "Join us",
  rsvpIntro: "Let us know you're coming so we can save you a seat, and leave a blessing for {name} to read when she's older.",
  wishLabel: "A blessing for {name}",
  wishPlaceholder: "Dear little {name}…",
  wishRequired: "Leave a little blessing for {name}",
  thankYou: "You're on the list. We can't wait to see you on {date}.",

  arriveTip: "The ceremony begins at {time}; please come a little early so you're settled in.",
  arriveByNote: "So you're settled in before the ceremony begins", // under "Arrive by" in the email

  emailFromName: "Baby {name}'s Christening",
  emailIntro: "Your seat is confirmed! Thank you for registering. We can't wait to celebrate {name}'s christening with you.",
  emailWishLabel: "Your blessing for {name}",
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
  bucket: "christening_photos", // must be a public bucket
  folder: "guests", // sub-folder inside the bucket; "" for the bucket root
}
