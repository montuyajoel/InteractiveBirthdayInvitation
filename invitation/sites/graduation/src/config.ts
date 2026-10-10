// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "showcase-graduation",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Joaquin",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Joaquin",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2027-06-05T16:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 4,
  venue: "The Palms Hotel",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Rizal Street, Iloilo City",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=Rizal+Street,+Iloilo+City",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "The Palms Hotel, Rizal Street, Iloilo City",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "{honoree}'s Graduation Celebration",
  metaDescription: "Join us as we celebrate {name}'s BS in Computer Science, cum laude.",
  logo: "{name}",
  logoAccent: "BS", // shown after the logo in the brand colour; "" for none
  invitedLine: "You're invited to a",
  kicker: "Class of 2027", // spaced capitals above the title; "" to hide
  title: "Graduation Celebration",
  celebrationFor: "Celebrating",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "After years of late nights, lines of code and determination, {name} has earned a Bachelor of Science in Computer Science, cum laude. Join us for an afternoon of food, good company and celebration.",
  eventTitle: "{honoree}'s Graduation Celebration", // calendar entries, email subject
  footerSignature: "{honoree} · BS Computer Science",
  footerLine: "Thank you for being part of the journey",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Save the date", // countdown headline when surprise is false

  rsvpEyebrow: "Kindly register",
  rsvpTitle: "Save your seat",
  rsvpIntro: "Let us know you're coming so we can save you a seat, and leave a congratulatory note for {name} while you're here.",
  wishLabel: "Congratulations & wishes",
  wishPlaceholder: "Congratulations, {name}…",
  wishRequired: "Leave a few words for {name}",
  thankYou: "You're on the list. We can't wait to celebrate with you on {date}.",

  arriveTip: "The celebration starts at {time}. We can't wait to see you there.",
  arriveByNote: "So you're settled in before the celebration starts", // under "Arrive by" in the email

  emailFromName: "{name}'s Graduation",
  emailIntro: "Your seat is confirmed! Thank you for registering. We can't wait to celebrate {name}'s graduation with you.",
  emailWishLabel: "Your message",
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
  table: "showcase_graduation_guests",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "event_photos", // must be a public bucket
  folder: "joaquin-graduation", // sub-folder inside the bucket; "" for the bucket root
}

// Studio credit shown at the bottom of every site and invitation email.
// Keep it on every event.
export const CREDIT = {
  text: "For customized invitations, email us at",
  email: "thedigitalinvitationsph@gmail.com",
}
