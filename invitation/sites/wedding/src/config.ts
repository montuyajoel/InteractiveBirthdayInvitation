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

const WEDDING_EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "showcase-wedding",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Marco & Elena",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Marco & Elena",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set. With a schedule, the first stop.
  start: new Date("2027-02-13T12:00:00+00:00"),
  timeZone: "Europe/Dublin", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Irish time",
  durationHours: 12, // ceremony at noon through the evening reception
  venue: "St. Brigid's Church",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Killiney, Co. Dublin",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=St.+Brigid's+Church+Killiney+Co.+Dublin",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "St. Brigid's Church, Killiney, Co. Dublin",
  // Events with more than one place (ceremony, then reception): one entry
  // each, in order. Every part of the site, the email and the calendar
  // invite lists them. Leave [] for a single venue (the fields above).
  schedule: [
    {
      label: "Ceremony",
      time: "12:00 noon",
      venue: "St. Brigid's Church",
      address: "Killiney, Co. Dublin",
      mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=St.+Brigid's+Church+Killiney+Co.+Dublin",
      mapsQuery: "St. Brigid's Church, Killiney, Co. Dublin",
    },
    {
      label: "Reception",
      time: "4:00 PM",
      venue: "The Glasshouse Hotel",
      address: "Dalkey Road, Co. Dublin",
      mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=Dalkey,+Co.+Dublin",
      mapsQuery: "The Glasshouse Hotel, Dalkey Road, Co. Dublin",
    },
  ] as Stop[],
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
const WEDDING_COPY = {
  pageTitle: "{honoree} · Wedding",
  metaDescription: "Join {honoree} on Saturday, 13 February 2027: ceremony at noon at St. Brigid's Church, Killiney, reception at 4 pm at The Glasshouse Hotel.",
  logo: "M & E",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "Kindly join us at our",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "Wedding",
  celebrationFor: "Celebrating",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "We'd love you with us for the whole day: our ceremony at St. Brigid's Church, Killiney, then an evening of dinner and dancing at The Glasshouse Hotel.",
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
  wishPlaceholder: "Dear Marco and Elena…",
  wishRequired: "Leave a few words for the couple",
  thankYou: "We've saved you a seat. See you on {date}!",

  arriveTip: "The ceremony begins at 12:00 noon; please arrive a little early so you're seated in time. The reception follows at 4:00 PM.",
  arriveByNote: "The ceremony begins at 12:00 noon", // under "Arrive by" in the email

  emailFromName: "Marco & Elena",
  emailIntro: "Thank you for your RSVP: your place is confirmed! We can't wait to celebrate with you.",
  emailWishLabel: "Your wish for us",
}

// ---------------------------------------------------------------------------
// The hidden hen party page (/hen-party): its own event, wording, guest table,
// password and emails; no photo wall. Not linked from the wedding site.

const HEN_EVENT: typeof WEDDING_EVENT = {
  id: "showcase-wedding-hen",
  honoree: "Elena & Marco",
  honoreeShort: "Elena",
  // Irish Summer Time (UTC+1) still applies on 24 October 2026.
  start: new Date("2026-10-24T17:00:00+01:00"),
  timeZone: "Europe/Dublin",
  timeZoneLabel: "Irish time",
  durationHours: 6,
  venue: "The Copper Kettle",
  address: "City Centre, Dublin",
  arriveBy: "",
  mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=The+Copper+Kettle+Dublin",
  mapsQuery: "The Copper Kettle, Dublin",
  schedule: [],
}

const HEN_COPY: typeof WEDDING_COPY = {
  ...WEDDING_COPY,
  pageTitle: "Elena's Hen Party",
  metaDescription: "Please join Elena's hen party on Saturday, 24 October 2026 at 5 pm, The Copper Kettle, City Centre.",
  logo: "Hen Party",
  invitedLine: "Please join my",
  title: "Hen Party",
  celebrationFor: "Before the wedding of",
  shareHeadline: "Hen Party Invite",
  intro: "Before we say I do, let's have a night to remember: drinks, laughs and the best company at The Copper Kettle.",
  eventTitle: "Elena's Hen Party",
  footerSignature: "Elena",
  footerLine: "Can't wait to celebrate with you",
  rsvpEyebrow: "Are you in?",
  rsvpIntro: "Let me know you're coming, and leave a few words for the bride-to-be.",
  wishLabel: "A message for Elena",
  wishPlaceholder: "Dear Elena…",
  wishRequired: "Leave a few words for Elena",
  thankYou: "You're on the list! See you on {date}.",
  arriveTip: "We start at {time}; come a little early and grab a drink.",
  arriveByNote: "We start at {time}",
  emailFromName: "Elena",
  emailIntro: "Thank you for your RSVP: you're on the list for my hen party! I can't wait to celebrate with you.",
  emailWishLabel: "Your message",
}

// Which page is this: the wedding (/) or the hen party (/hen-party)? The
// hen party's email function (api/hen-party-send-invitations.ts) sets
// globalThis.__INVITE_PAGE before this file loads, since it has no address.
const pageFlag = (globalThis as { __INVITE_PAGE?: string }).__INVITE_PAGE
export const PAGE: "wedding" | "hen-party" =
  pageFlag === "hen-party" ||
  (!pageFlag && typeof location !== "undefined" && location.pathname.startsWith("/hen-party"))
    ? "hen-party"
    : "wedding"
export const IS_HEN = PAGE === "hen-party"

export const EVENT = IS_HEN ? HEN_EVENT : WEDDING_EVENT
export const COPY = IS_HEN ? HEN_COPY : WEDDING_COPY

/** What differs between the two pages beyond wording. */
export const PAGE_OPTIONS = {
  gallery: !IS_HEN, // photo wall
  sendEndpoint: IS_HEN ? "/api/hen-party-send-invitations" : "/api/send-invitations",
  emailCard: IS_HEN ? "/email/hen-party-card.jpg" : "/email/invitation-card.jpg",
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
  table: IS_HEN ? "showcase_hen_party_guests" : "showcase_wedding_guests",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "wedding_photos", // must be a public bucket
  folder: "guests", // sub-folder inside the bucket; "" for the bucket root
}

// Studio credit shown at the bottom of every site and invitation email.
// Keep it on every event.
export const CREDIT = {
  text: "For customized invitations, email us at",
  email: "thedigitalinvitationsph@gmail.com",
}
