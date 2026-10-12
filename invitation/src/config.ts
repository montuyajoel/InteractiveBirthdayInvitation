// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  // Short slug: used for browser storage keys and calendar file names.
  id: "camille-antoine-wedding",
  // Name of the person (or couple) being celebrated, shown in script.
  honoree: "Camille & Antoine",
  // Used inside sentences: "Leave a wish for {name}".
  honoreeShort: "Camille & Antoine",
  // Local start time at the venue WITH its UTC offset, so it is right
  // however the visitor's clock is set.
  start: new Date("2027-06-12T17:00:00+02:00"),
  timeZone: "Europe/Paris", // IANA name, used for labels and calendar invites
  timeZoneLabel: "French time",
  durationHours: 6,
  venue: "Château de Belvent",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "Route des Grands Crus, 21220 Gevrey-Chambertin, France",
  // e.g. "4:30 PM". Leave "" to leave it out of the email.
  arriveBy: "4:45 PM",
  // Pinned location shared from Google Maps (the "Share" link).
  mapsShareUrl: "https://maps.google.com/?q=Gevrey-Chambertin,+France",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "Gevrey-Chambertin, France",
}

// All the wording on the site and in the email. Placeholders:
//   {name}  → EVENT.honoreeShort      {honoree} → EVENT.honoree
//   {time}  → the start time          {date}    → the start date
// Wrap text in ^…^ for a superscript in titles: "16^th^ Birthday".
// Set `surprise: false` for events that aren't a secret; the "Shhh" bits hide.
export const COPY = {
  pageTitle: "{honoree} · Wedding",
  metaDescription: "Camille Lefèvre and Antoine Marchand invite you to celebrate their marriage in Burgundy.",
  logo: "C & A",
  logoAccent: "", // shown after the logo in the brand colour; "" for none
  invitedLine: "Together with their families",
  kicker: "", // spaced capitals above the title; "" to hide
  title: "Our Wedding",
  celebrationFor: "The wedding of",
  shareHeadline: "You're invited!", // big line on the link-preview picture (public/share.jpg)
  intro: "Camille Lefèvre and Antoine Marchand invite you to celebrate their marriage among the vines of Burgundy.",
  eventTitle: "The Wedding of {honoree}", // calendar entries, email subject
  footerSignature: "Camille & Antoine",
  footerLine: "À bientôt en Bourgogne",

  surprise: false,
  surpriseHeadline: "Shhh… it's a surprise!",
  surpriseNote: "Please don't mention the party to {name}, and hold off on posting until after the big reveal.",
  surpriseReminder: "Remember: not a word to {name}!",
  saveTheDate: "Countdown", // countdown headline when surprise is false

  rsvpEyebrow: "Répondez s'il vous plaît",
  rsvpTitle: "RSVP",
  rsvpIntro: "Kindly let us know you'll be with us, and leave the two of us a wish or a little advice.",
  wishLabel: "Wishes for the couple",
  wishPlaceholder: "Dear Camille and Antoine…",
  wishRequired: "Leave a few words for the couple",
  thankYou: "Merci! Your seat is saved. See you on {date}.",

  arriveTip: "The ceremony begins at {time} in the Orangery; please arrive by 4:45 PM.",
  arriveByNote: "Guests gather at the Orangery", // under "Arrive by" in the email

  emailFromName: "Camille & Antoine",
  emailIntro: "Merci for your RSVP: your seat is confirmed! We can't wait to celebrate with you in Burgundy.",
  emailWishLabel: "Your wish for us",
}

// The wedding-day story sections (welcome, ceremony & reception, dress code,
// our story, timeline, the day after, gifts). Sample content: replace with
// the couple's own.
export const WEDDING = {
  monogram: "C&A",
  partnerOne: "Camille Lefèvre",
  partnerTwo: "Antoine Marchand",
  // Names as they appear behind the curtain.
  heroNames: ["Camille", "&", "Antoine"],
  heroDate: "June 12, 2027",
  welcome: {
    title: "Bienvenue à notre mariage",
    text: "Nous avons tellement hâte de célébrer ce jour magique avec vous, entourés de ceux que nous aimons.",
    translation: "We can't wait to celebrate this magical day with you, surrounded by the people we love.",
  },
  invitation: {
    before: "Together with their families",
    after: "invite you to celebrate their marriage",
    date: "Saturday, 12 June 2027",
  },
  celebrate: {
    eyebrow: "Where we celebrate",
    venue: "Château de Belvent",
    place: "Gevrey-Chambertin · Bourgogne",
    date: "Saturday, 12 June 2027",
    parts: [
      { label: "Ceremony", where: "The Orangery", time: "5:00 PM" },
      { label: "Reception", where: "The Wine Cellar", time: "7:00 PM" },
    ],
  },
  dressCode: {
    title: "Black Tie",
    text: "The aperitif will be held on the gravel terrace and lawns; guests may wish to consider appropriate footwear.",
    // A few shades we'd love to see. Purely a suggestion.
    palette: [
      { name: "Mauve", hex: "#a8798a" },
      { name: "Blush", hex: "#e8c6cf" },
      { name: "Sage", hex: "#9aa58a" },
      { name: "Champagne", hex: "#e9dcc3" },
      { name: "Midnight", hex: "#2f2a3d" },
    ],
  },
  story: [
    "We met in Burgundy, fell in love over long dinners and even longer walks through the vines.",
    "Now we are returning to the place where it all began, to begin the rest of our lives together.",
  ],
  timeline: [
    { time: "4:45 PM", label: "Guests to arrive at the Orangery", icon: "chapel" },
    { time: "5:00 PM", label: "Ceremony commences", icon: "rings" },
    { time: "6:00 PM", label: "Cocktail hour", icon: "coupe" },
    { time: "7:00 PM", label: "Reception and dancing", icon: "disco" },
    { time: "11:00 PM", label: "Farewell", icon: "flutes" },
  ],
  timelineNote:
    "Our ceremony will take place in the Orangery of Château de Belvent. This will be followed by an apéritif in the rose garden, before dinner and dancing in the old wine cellar.",
  dayAfter: {
    title: "Recovery Day",
    eyebrow: "Join us the day after",
    venue: "Le Comptoir des Halles",
    detail: "Garden terrace",
    dateLabel: "Sunday | 13 June 2027",
    timeLabel: "From 12 PM",
    address: "4 Rue Monge, 21200 Beaune, France",
    // Local start time with its UTC offset, for the calendar button.
    start: new Date("2027-06-13T12:00:00+02:00"),
    durationHours: 4,
    mapsQuery: "4 Rue Monge, Beaune, France",
    text: "We will be recovering on the garden terrace of Le Comptoir des Halles from 12 PM. Come along for a relaxed afternoon of food, wine and good company; we'd love to see you there.",
  },
  gifts: {
    title: "Gifts",
    text: "Your presence on our day is the greatest gift of all. Should you wish to celebrate with a gift, a wishing well will be available at the reception.",
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
  table: "camille_antoine_wedding_guests",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "wedding_photos", // must be a public bucket
  folder: "camille-antoine", // sub-folder inside the bucket; "" for the bucket root
}

// Studio credit shown at the bottom of every site and invitation email.
// Keep it on every event.
export const CREDIT = {
  text: "For customized invitations, email us at",
  email: "thedigitalinvitationsph@gmail.com",
}
