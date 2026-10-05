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

// Fill these in once the Supabase project is ready. While `url` is empty the
// site runs in preview mode: RSVPs are kept in this browser only and the
// gallery shows sample tiles.
export const SUPABASE = {
  url: "https://rgicukixlxexgzcxgvqg.supabase.co",
  anonKey: "", // Project Settings → API Keys: the anon / publishable key (never the service_role key or DB password)
  registrationsTable: "registrations",
  galleryBucket: "gallery", // must be a public bucket
  galleryFolder: "", // optional sub-folder inside the bucket, e.g. "party"
}
