// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "chase-8th-birthday",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Jhon Chandric Eoin Muñoz",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Chase",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2026-12-12T16:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 4,
  venue: "Jollibee Alijis Circumferential",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "3:45 PM",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.app.goo.gl/dqi73DdL54Gq1W6g9?g_st=ic",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "Jollibee Alijis Circumferential Road, Bacolod City",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "Chase turns 8 · Hot Rod Birthday Bash",
  metaDescription: "Start your engines! Race over to Chase's 8th birthday on December 12.",
  logo: "Chase",
  logoAccent: "8", // shown after the logo in the brand colour; "" for none
  invitedLine: "Start your engines!",
  kicker: "Chase is turning", // spaced capitals above the title; "" to hide
  title: "8^th^ Birthday",
  celebrationFor: "Race on over and celebrate with",
  intro: "Buckle up and race on over! Join us for games, cake, hot rods and full-throttle fun as our favourite little racer, {name}, turns 8.",
  eventTitle: "Chase's 8th Birthday", // calendar entries, email subject
  footerSignature: "Chase · 8",
  footerLine: "Thanks for joining {name}'s pit crew!",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Race starts in", // countdown headline when surprise is false

  rsvpEyebrow: "Join the pit crew",
  rsvpTitle: "Grab your spot",
  rsvpIntro: "Let us know you're coming so we can save you a spot on the grid, and leave a birthday message for our little racer {name}.",
  wishLabel: "Birthday message for Chase",
  wishPlaceholder: "Happy birthday, Chase! …",
  wishRequired: "Leave a little message for {name}",
  thankYou: "You're on the grid! See you on {date}.",

  arriveTip: "The race starts at {time}. Racing tees and car costumes are very welcome!",
  arriveByNote: "So you're on the grid before the lights go out", // under "Arrive by" in the email

  emailFromName: "Chase's 8th Birthday",
  emailIntro: "Your spot is confirmed! Thanks for joining the pit crew. We can't wait to celebrate Chase's 8th birthday with you.",
  emailWishLabel: "Your message for Chase",
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
  bucket: "chase_photos", // must be a public bucket
  folder: "guests", // sub-folder inside the bucket; "" for the bucket root
}
