// Everything event-specific lives here so it can be edited in one place.

/** One place on the day, e.g. the ceremony or the reception. */
export type Stop = {
  label: string
  time: string // as printed, e.g. "12:00 noon"
  venue: string
  address: string
  mapsShareUrl: string
  mapsQuery: string
}

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "brendan-angelina-2026",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Brendan & Angelina",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Brendan & Angelina",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set. With a schedule, the first stop.
  start: new Date("2026-12-19T12:00:00+00:00"),
  timeZone: "Europe/Dublin", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Irish time",
  durationHours: 12, // ceremony at noon through the evening reception
  venue: "St. John the Baptist Church",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Blackrock, Co. Dublin",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=St.+John+the+Baptist+Church+Blackrock+Co.+Dublin",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "St. John the Baptist Church, Blackrock, Co. Dublin",
  // Events with more than one place (ceremony, then reception): one entry
  // each, in order. Every part of the site, the email and the calendar
  // invite lists them. Leave [] for a single venue (the fields above).
  schedule: [
    {
      label: "Ceremony",
      time: "12:00 noon",
      venue: "St. John the Baptist Church",
      address: "Blackrock, Co. Dublin",
      mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=St.+John+the+Baptist+Church+Blackrock+Co.+Dublin",
      mapsQuery: "St. John the Baptist Church, Blackrock, Co. Dublin",
    },
    {
      label: "Reception",
      time: "4:00 PM",
      venue: "Talbot Hotel Stillorgan",
      address: "Stillorgan Road, Stillorgan, Co. Dublin",
      mapsShareUrl: "https://share.google/D9PKGaKOURMS67XGL",
      mapsQuery: "Talbot Hotel Stillorgan, Stillorgan Road, Co. Dublin",
    },
  ] as Stop[],
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "{honoree} · Wedding",
  metaDescription: "Join {honoree} on Saturday, 19 December 2026: ceremony at noon at St. John the Baptist Church, Blackrock, reception at 4 pm at the Talbot Hotel Stillorgan.",
  logo: "B & A",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "Kindly join us at our",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "Wedding",
  celebrationFor: "Celebrating",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "We'd love you with us for the whole day: our ceremony at St. John the Baptist Church, Blackrock, then an evening of dinner and dancing at the Talbot Hotel Stillorgan.",
  eventTitle: "Wedding of {honoree}", // calendar entries, email subject
  footerSignature: "{honoree}",
  footerLine: "With love and gratitude",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Save the date", // countdown headline when surprise is false

  rsvpEyebrow: "Kindly reply",
  rsvpTitle: "RSVP",
  rsvpIntro: "Please let us know you're coming, and leave the two of us a few words or a wish.",
  wishLabel: "Wishes for the couple",
  wishPlaceholder: "Dear Brendan and Angelina…",
  wishRequired: "Leave a few words for the couple",
  thankYou: "We've saved you a seat. See you on {date}!",

  arriveTip: "The ceremony begins at 12:00 noon; please arrive a little early so you're seated in time. The reception follows at 4:00 PM.",
  arriveByNote: "The ceremony begins at 12:00 noon", // under "Arrive by" in the email

  emailFromName: "Brendan & Angelina",
  emailIntro: "Thank you for your RSVP: your place is confirmed! We can't wait to celebrate with you.",
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
  table: "angie_wedding_guest",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "wedding_photos", // must be a public bucket
  folder: "brendan-angelina", // sub-folder inside the bucket; "" for the bucket root
}

// Studio credit shown at the bottom of every site and invitation email.
// Keep it on every event.
export const CREDIT = {
  text: "For customized invitations, email us at",
  email: "thedigitalinvitationsph@gmail.com",
}
