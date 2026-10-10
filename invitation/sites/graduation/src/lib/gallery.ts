import { GALLERY } from "@/config"
import { THEME } from "@/theme"
import { isConfigured, supabaseHeaders, supabaseUrl } from "@/lib/supabase"
import invitationCard from "@/assets/invitationCard"

export type Photo = {
  id: string
  src: string
  caption: string
  // width / height, used to reserve space before the image loads
  ratio: number
}

export type GalleryResult = { photos: Photo[]; source: "supabase" | "sample" }

export const galleryConnected = isConfigured(GALLERY)

/** Fired on window after a guest uploads, so the gallery reloads. */
export const GALLERY_CHANGED = "gallery:changed"

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i

type StorageObject = {
  name: string
  id: string | null
  metadata?: { mimetype?: string } | null
}

export async function loadPhotos(): Promise<GalleryResult> {
  if (!galleryConnected) return { photos: samplePhotos(), source: "sample" }

  const folder = GALLERY.folder.replace(/^\/|\/$/g, "")
  const res = await fetch(supabaseUrl(GALLERY, `/storage/v1/object/list/${GALLERY.bucket}`), {
    method: "POST",
    headers: supabaseHeaders(GALLERY),
    body: JSON.stringify({
      prefix: folder,
      limit: 1000,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    }),
  })
  if (!res.ok) {
    console.error(`Supabase rejected the gallery listing (${res.status}):`, await res.text().catch(() => ""))
    throw new Error(`Could not load photos (${res.status})`)
  }

  const objects: StorageObject[] = await res.json()
  const photos = objects
    // folders come back with a null id
    .filter((o) => o.id && (IMAGE_EXT.test(o.name) || o.metadata?.mimetype?.startsWith("image/")))
    .map((o) => {
      const path = [folder, o.name].filter(Boolean).map(encodeURIComponent).join("/")
      return {
        id: o.id!,
        src: supabaseUrl(GALLERY, `/storage/v1/object/public/${GALLERY.bucket}/${path}`),
        caption: prettify(o.name),
        ratio: 0, // unknown until loaded
      }
    })
  return { photos, source: "supabase" }
}

/** Uploads an already-resized JPEG into the gallery folder. */
export async function uploadPhoto(photo: Blob, guestName: string): Promise<void> {
  const slug =
    guestName
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
      .replace(/-+$/, "") || "guest"
  // "from-maria-santos--<time>-<random>.jpg" → captioned "From Maria Santos"
  const name = `from-${slug}--${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const folder = GALLERY.folder.replace(/^\/|\/$/g, "")
  const path = [folder, name].filter(Boolean).map(encodeURIComponent).join("/")

  const res = await fetch(supabaseUrl(GALLERY, `/storage/v1/object/${GALLERY.bucket}/${path}`), {
    method: "POST",
    headers: {
      ...supabaseHeaders(GALLERY),
      "Content-Type": "image/jpeg",
      "x-upsert": "false",
      "cache-control": "3600",
    },
    body: photo,
  })
  if (!res.ok) {
    console.error(`Supabase rejected the photo upload (${res.status}):`, await res.text().catch(() => ""))
    throw new Error(`Upload failed (${res.status})`)
  }
}

function prettify(filename: string) {
  const base = filename.replace(IMAGE_EXT, "")
  const guest = /^from-([a-z0-9-]+?)--\d+/.exec(base)
  if (guest) {
    const who = guest[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    return who === "Guest" ? "From a guest" : `From ${who}`
  }
  // Auto-generated names (e.g. "att.7a_FbfjnvLxJg4WnCON…", "IMG_2041") make
  // poor captions, so leave those blank.
  if (/^(att\.|img[_-]?\d|dsc|pxl_|photo[_-]?\d)/i.test(base) || (!/[\s_-]/.test(base) && base.length > 12)) {
    return ""
  }
  return base.replace(/[-_]+/g, " ").replace(/^\d+\s*/, "").trim()
}

// ---------------------------------------------------------------------------
// Sample tiles shown until the storage bucket is connected.

const C = THEME.colors

const MOTIFS: Record<string, string> = {
  cap: `<path d="M90 136 V180 C90 198 118 210 150 210 C182 210 210 198 210 180 V136" fill="${C.paper}" stroke="${C.brand}" stroke-width="3"/>
    <path d="M150 70 L40 115 L150 160 L260 115 Z" fill="${C.paper}" stroke="${C.brand}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M150 115 L238 135 V190" fill="none" stroke="${C.bloom}" stroke-width="4" stroke-linecap="round"/>
    <path d="M230 190 h16 l4 26 h-24 z" fill="${C.bloom}"/><circle cx="150" cy="115" r="6" fill="${C.bloom}"/>`,
  diploma: `<rect x="60" y="110" width="180" height="56" rx="28" fill="${C.ink}" stroke="${C.brand}" stroke-width="3"/>
    <ellipse cx="236" cy="138" rx="12" ry="28" fill="${C.highlight}" stroke="${C.brand}" stroke-width="3"/>
    <rect x="136" y="106" width="22" height="64" fill="${C.brand}" opacity=".85"/>
    <path d="M147 170 l-16 46 l14 -8 l6 14 z M147 170 l16 46 l-14 -8 l-6 14 z" fill="${C.brand}" opacity=".85"/>`,
  chart: `<path d="M70 220 H240 M70 220 V70" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
    ${[[90, 160], [126, 130], [162, 100], [198, 80]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="26" height="${220 - y}" rx="3" fill="${i % 2 ? C.brand : C.soft}" stroke="${C.ink}" stroke-width="2"/>`).join("")}
    <path d="M90 140 L130 112 L170 84 L214 58" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 6"/>
    <path d="M214 58 l-14 0 m14 0 l-4 13" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`,
  laurel: `<g fill="${C.soft}" stroke="${C.foliage}" stroke-width="2">${[0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = 200 - i * 26
      const x = 150 + Math.cos((a * Math.PI) / 180) * 80
      const y = 150 - Math.sin((a * Math.PI) / 180) * 80
      const x2 = 300 - x
      return `<ellipse cx="${x}" cy="${y}" rx="18" ry="8" transform="rotate(${-a + 70} ${x} ${y})"/><ellipse cx="${x2}" cy="${y}" rx="18" ry="8" transform="rotate(${a - 70} ${x2} ${y})"/>`
    })
    .join("")}</g><text x="150" y="168" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="${C.brand}">BS</text>`,
  stars: [[110, 100, 34], [196, 90, 24], [160, 176, 42]]
    .map(([x, y, r]) => `<path transform="translate(${x} ${y}) scale(${r / 12})" d="M0 -9.8l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" fill="${C.bloom}" stroke="${C.brand}" stroke-width="${24 / r}"/>`)
    .join(""),
  books: `<rect x="80" y="180" width="150" height="26" rx="4" fill="${C.ink}"/><rect x="92" y="152" width="134" height="26" rx="4" fill="${C.brand}"/>
    <rect x="76" y="124" width="140" height="26" rx="4" fill="${C.soft}" stroke="${C.ink}" stroke-width="2"/>
    <path d="M150 112 q-30 -16 -54 -6 v-40 q24 -10 54 6 q30 -16 54 -6 v40 q-24 -10 -54 6z" fill="${C.ink}" stroke="${C.ink}" stroke-width="2.5"/>
    <path d="M150 72 v40" stroke="${C.ink}" stroke-width="2"/>`,
}

const SAMPLES: { motif: keyof typeof MOTIFS; caption: string; w: number; h: number; tint: string }[] = [
  { motif: "cap", caption: "Caps off", w: 300, h: 300, tint: C.highlight },
  { motif: "chart", caption: "By the numbers", w: 300, h: 340, tint: C.soft },
  { motif: "diploma", caption: "The diploma", w: 300, h: 260, tint: C.highlight },
  { motif: "books", caption: "All those late nights", w: 300, h: 340, tint: C.soft },
  { motif: "laurel", caption: "Cum Laude", w: 300, h: 300, tint: C.highlight },
  { motif: "stars", caption: "Gold stars", w: 300, h: 280, tint: C.soft },
]

function sampleSvg(motif: string, w: number, h: number, tint: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}">
    <rect width="100%" height="100%" fill="${C.paper}"/>
    <circle cx="${w * 0.2}" cy="${h * 0.25}" r="${w * 0.5}" fill="${tint}" opacity=".8"/>
    <circle cx="${w * 0.9}" cy="${h * 0.85}" r="${w * 0.45}" fill="${C.soft}" opacity=".7"/>
    <g transform="translate(0 ${(h - 280) / 2})">${MOTIFS[motif]}</g>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function samplePhotos(): Photo[] {
  return [
    { id: "invitation", src: invitationCard, caption: "The invitation", ratio: 2 / 3 },
    ...SAMPLES.map((s, i) => ({
      id: `sample-${i}`,
      src: sampleSvg(s.motif, s.w, s.h, s.tint),
      caption: s.caption,
      ratio: s.w / s.h,
    })),
  ]
}
