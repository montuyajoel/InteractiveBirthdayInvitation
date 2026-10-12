// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "andrea-joaquin-wedding",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Andrea & Joaquin",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Andrea & Joaquin",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2027-02-20T15:00:00+08:00"),
  timeZone: "Asia/Manila", // IANA name, used for labels and calendar invites
  timeZoneLabel: "Philippine time",
  durationHours: 7,
  venue: "Casa Alegría Gardens",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Barangay Maitim II East, Tagaytay City, Cavite",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "2:30 PM",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.google.com/?q=Tagaytay+City,+Cavite",
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
  metaDescription: "Andrea Dela Cruz and Joaquin Villanueva invite you to celebrate their marriage in Tagaytay.",
  logo: "A & J",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "Together with their families",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "Our Wedding",
  celebrationFor: "The wedding of",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "Andrea Dela Cruz and Joaquin Villanueva invite you to celebrate their marriage in the cool hills of Tagaytay.",
  eventTitle: "The Wedding of {honoree}", // calendar entries, email subject
  footerSignature: "Andrea & Joaquin",
  footerLine: "Kita-kits sa Tagaytay",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Countdown", // countdown headline when surprise is false

  rsvpEyebrow: "Kindly reply",
  rsvpTitle: "RSVP",
  rsvpIntro: "Kindly let us know you'll be with us, and leave the two of us a wish or a little advice.",
  wishLabel: "Wishes for the couple",
  wishPlaceholder: "Dear Andrea and Joaquin…",
  wishRequired: "Leave a few words for the couple",
  thankYou: "Salamat! Your seat is saved. See you on {date}.",

  arriveTip: "The ceremony begins at {time} at Capilla de Santa Rosa; please arrive by 2:30 PM.",
  arriveByNote: "Guests gather at the garden chapel", // under "Arrive by" in the email

  emailFromName: "Andrea & Joaquin",
  emailIntro: "Salamat for your RSVP: your seat is confirmed! We can't wait to celebrate with you in Tagaytay.",
  emailWishLabel: "Your wish for us",
}

// The wedding-day story sections (welcome, ceremony & reception, dress code,
// our story, timeline, the day after, gifts). Sample content: replace with
// the couple's own.
export const WEDDING = {
  monogram: "A&J",
  partnerOne: "Andrea Dela Cruz",
  partnerTwo: "Joaquin Villanueva",
  // Names as they appear behind the curtain.
  heroNames: ["Andrea", "&", "Joaquin"],
  heroDate: "February 20, 2027",
  welcome: {
    title: "Maligayang pagdating sa aming kasal",
    text: "Hindi na kami makapaghintay na ipagdiwang ang espesyal na araw na ito kasama kayo, napapaligiran ng mga taong mahal namin.",
    translation: "We can't wait to celebrate this special day with you, surrounded by the people we love.",
  },
  invitation: {
    before: "Together with their families",
    after: "invite you to celebrate their marriage",
    date: "Saturday, 20 February 2027",
  },
  celebrate: {
    eyebrow: "Where we celebrate",
    venue: "Casa Alegría Gardens",
    place: "Tagaytay City · Cavite",
    date: "Saturday, 20 February 2027",
    parts: [
      { label: "Ceremony", where: "Capilla de Santa Rosa", time: "3:00 PM" },
      { label: "Reception", where: "The Glass Pavilion", time: "6:00 PM" },
    ],
  },
  dressCode: {
    title: "Formal Filipiniana",
    text: "Barong Tagalog for the gentlemen; Filipiniana or long gowns for the ladies. Tagaytay evenings get chilly, so bring a shawl or light jacket.",
    // A few shades we'd love to see. Purely a suggestion.
    palette: [
      { name: "Mauve", hex: "#a8798a" },
      { name: "Blush", hex: "#e8c6cf" },
      { name: "Sage", hex: "#9aa58a" },
      { name: "Piña cream", hex: "#efe4cc" },
      { name: "Lilac", hex: "#b7a0c6" },
    ],
  },
  story: [
    "We met as volunteers at a book drive in Quezon City, and kept finding reasons to share another cup of kape.",
    "Eight years, a hundred road trips up to Tagaytay and one proposal by the lake later, we're saying \"I do\".",
  ],
  timeline: [
    { time: "2:30 PM", label: "Guests arrive at the garden chapel", icon: "chapel" },
    { time: "3:00 PM", label: "Wedding ceremony", icon: "rings" },
    { time: "5:00 PM", label: "Cocktails & photos by the ridge", icon: "coupe" },
    { time: "6:00 PM", label: "Reception, dinner and dancing", icon: "disco" },
    { time: "10:00 PM", label: "Despedida", icon: "flutes" },
  ],
  timelineNote:
    "Our ceremony will be held at Capilla de Santa Rosa in the gardens of Casa Alegría, followed by cocktails overlooking Taal Lake, then dinner and dancing in the Glass Pavilion.",
  dayAfter: {
    title: "Day-After Brunch",
    eyebrow: "Join us the morning after",
    venue: "Café Amihan",
    detail: "Garden veranda",
    dateLabel: "Sunday | 21 February 2027",
    timeLabel: "From 10 AM",
    address: "Aguinaldo Highway, Tagaytay City, Cavite",
    // Local start time with its UTC offset, for the calendar button.
    start: new Date("2027-02-21T10:00:00+08:00"),
    durationHours: 3,
    mapsQuery: "Aguinaldo Highway, Tagaytay City, Cavite",
    text: "Join us for bulalo, tapsilog and plenty of barako coffee on the veranda of Café Amihan. Come as you are; we'd love one more morning together.",
  },
  gifts: {
    title: "Gifts",
    text: "Your presence is the greatest gift of all. Should you wish to bless us further, a monetary gift toward our first home would be warmly appreciated.",
  },
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
  table: "andrea_joaquin_wedding_guests",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "wedding_photos", // must be a public bucket
  folder: "andrea-joaquin", // sub-folder inside the bucket; "" for the bucket root
}

// Studio credit shown at the bottom of every site and invitation email.
// Keep it on every event.
export const CREDIT = {
  text: "For customized invitations, email us at",
  email: "thedigitalinvitationsph@gmail.com",
}
