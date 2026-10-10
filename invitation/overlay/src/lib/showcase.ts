// Showcase-only: this site is one of four sample events served from one
// address (/birthday/, /wedding/, /graduation/, /christening/). Copied into
// each site by showcase/scripts/import_sites.py; edit it in overlay/.

export const SLUG = "__SLUG__"

export const SHOWCASE_EVENTS = [
  { slug: "birthday", label: "Birthday" },
  { slug: "wedding", label: "Wedding" },
  { slug: "graduation", label: "Graduation" },
  { slug: "christening", label: "Christening" },
] as const

export const eventHref = (slug: string) => `/${slug}/`

/** The studio's address, for Contact us. */
export const CONTACT_EMAIL = "thedigitalinvitationsph@gmail.com"

/** Hosts' password for the sample guest list. Not a secret: it's a demo. */
export const DEMO_PASSWORD = "demo"

/** The site's own address, e.g. https://example.com/wedding */
export const siteUrl = () => `${location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, "")
