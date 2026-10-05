// Everything event-specific lives here so it can be edited in one place.

export const EVENT = {
  celebrant: "Chelsea Louise",
  age: 16,
  // Month is 0-based: 9 = October. Interpreted in each visitor's local time.
  start: new Date(2026, 9, 31, 17, 0),
  durationHours: 4,
  venue: "Tea Plan Villa Angela",
  // Pinned location shared from Google Maps.
  mapsShareUrl: "https://maps.app.goo.gl/fs82PvdeAvj4U2gF7",
  // Used for the embedded map and the "Get directions" link.
  mapsQuery: "Tea Plan Villa Angela",
}

// Build-time overrides (e.g. Vercel → Settings → Environment Variables).
// When a variable isn't set, the value written below is used.
const env: Record<string, string | undefined> =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}

// Only ever use a project's anon / publishable key here (Project Settings →
// API Keys). Never a secret / service_role key or a database password: these
// values end up in the public site.
// While a project's key is empty its feature runs in preview mode: RSVPs stay
// in the visitor's browser, and the gallery shows sample tiles.

// Supabase project holding the guest registrations table.
// Env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
export const REGISTRATIONS = {
  url: env.VITE_SUPABASE_URL || "https://rgicukixlxexgzcxgvqg.supabase.co",
  key: env.VITE_SUPABASE_ANON_KEY || "",
  table: "registrations",
}

// Supabase project holding the photo gallery bucket.
// Env: VITE_GALLERY_SUPABASE_URL, VITE_GALLERY_SUPABASE_KEY
export const GALLERY = {
  url: env.VITE_GALLERY_SUPABASE_URL || "https://uuiftuibexylqbhhzmix.supabase.co",
  key: env.VITE_GALLERY_SUPABASE_KEY || "",
  bucket: "gallery", // must be a public bucket
  folder: "", // optional sub-folder inside the bucket, e.g. "party"
}
