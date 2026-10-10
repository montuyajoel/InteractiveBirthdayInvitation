// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  celebrant: "Isabel Sofia",
  age: 16,
  // 5:00 PM Philippine time (UTC+8), however the visitor's clock is set.
  start: new Date("2026-11-21T17:00:00+08:00"),
  timeZone: "Asia/Manila",
  timeZoneLabel: "Philippine time",
  durationHours: 4,
  venue: "Casa Lumiere Garden",
  // Street and city, shown under the venue in emails and calendar invites.
  // Leave "" to show just the venue name.
  address: "",
  // e.g. "4:30 PM", so everyone's hidden before the birthday girl arrives.
  // Leave "" to leave it out of the email.
  arriveBy: "",
  // Pinned location shared from Google Maps.
  mapsShareUrl: "https://www.google.com/maps/search/?api=1&query=San+Juan+City,+Metro+Manila",
  // Used for the embedded map and the "Get directions" link. Coordinates
  // ("14.5995,120.9842") pin the exact spot; a name is searched instead.
  mapsQuery: "San Juan City, Metro Manila",
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
  bucket: "showcase_birthday", // must be a public bucket
  folder: "guests", // sub-folder inside the bucket; "" for the bucket root
}
