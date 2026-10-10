// Showcase-only: this site is one of four sample events served from one
// address (/birthday/, /wedding/, /graduation/, /christening/). Copied into
// each site by showcase/scripts/build_sites.py; edit it in showcase/overlay/.
import { EVENT } from "@/config"

export const SLUG = EVENT.id.replace(/^showcase-/, "")

export const SHOWCASE_EVENTS = [
  { slug: "birthday", label: "Birthday" },
  { slug: "wedding", label: "Wedding" },
  { slug: "graduation", label: "Graduation" },
  { slug: "christening", label: "Christening" },
] as const

export const eventHref = (slug: string) => `/${slug}/`

/** Hosts' password for the sample guest list. Not a secret: it's a demo. */
export const DEMO_PASSWORD = "demo"

/** The site's own address, e.g. https://example.com/wedding */
export const siteUrl = () => `${location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, "")
