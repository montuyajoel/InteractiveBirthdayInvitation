import { GALLERY } from "@/config"
import { THEME } from "@/theme"
import { isConfigured, supabaseHeaders, supabaseUrl } from "@/lib/supabase"
import invitationCard from "@/assets/invitationCard"
import { carSvg } from "@/lib/cars"

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
const DARK = "#111216"

const MOTIFS: Record<string, string> = {
  cake: `<rect x="70" y="120" width="160" height="90" rx="10" fill="${C.highlight}" stroke="${C.brand}" stroke-width="3"/>
    <path d="M70 150 q20 18 40 0 t40 0 t40 0 t40 0" fill="none" stroke="${C.brand}" stroke-width="3"/>
    <rect x="135" y="80" width="10" height="40" fill="#e8c88f"/><rect x="155" y="80" width="10" height="40" fill="#e8c88f"/>
    <path d="M140 64 q6 8 0 14 q-6 -6 0 -14z M160 64 q6 8 0 14 q-6 -6 0 -14z" fill="#f2b45c"/>
    <path d="M150 170 l-26 -14 v28z M150 170 l26 -14 v28z" fill="${C.soft}"/>`,
  balloons: `<ellipse cx="115" cy="110" rx="38" ry="46" fill="${C.soft}" stroke="${C.brand}" stroke-width="3"/>
    <ellipse cx="185" cy="95" rx="38" ry="46" fill="${C.highlight}" stroke="${C.brand}" stroke-width="3"/>
    <path d="M115 156 q10 40 -4 80 M185 141 q-12 50 6 95" fill="none" stroke="${C.brand}" stroke-width="2"/>`,
  blaze: `<g transform="translate(10 80) scale(1.4)">${carSvg("blaze", "tile-blaze")}</g>
    <path d="M10 200H290" stroke="#ff7a00" stroke-width="10"/>`,
  blue: `<g transform="translate(10 80) scale(1.4)">${carSvg("blue", "tile-blue")}</g>
    <path d="M10 200H290" stroke="#ff7a00" stroke-width="10"/>`,
  purple: `<g transform="translate(10 80) scale(1.4)">${carSvg("purple", "tile-purple")}</g>
    <path d="M10 200H290" stroke="#ff7a00" stroke-width="10"/>`,
  flag: `<path d="M70 40V250" stroke="${C.foliage}" stroke-width="6" stroke-linecap="round"/>
    <g>${Array.from({ length: 30 }, (_, i) => {
      const x = i % 6
      const y = Math.floor(i / 6)
      return `<rect x="${72 + x * 26}" y="${48 + y * 26 + Math.sin(x) * 8}" width="26" height="26" fill="${(x + y) % 2 ? "#fff" : DARK}"/>`
    }).join("")}</g>`,
  trophy: `<path d="M105 60h90v40c0 34-20 56-45 56s-45-22-45-56z" fill="${C.bloom}" stroke="${DARK}" stroke-width="4"/>
    <path d="M105 72H80c0 30 14 42 30 44M195 72h25c0 30-14 42-30 44" fill="none" stroke="${DARK}" stroke-width="4"/>
    <rect x="138" y="156" width="24" height="34" fill="${C.bloom}" stroke="${DARK}" stroke-width="4"/><rect x="110" y="190" width="80" height="22" rx="4" fill="${DARK}"/>
    <text x="150" y="118" text-anchor="middle" font-family="Impact, sans-serif" font-size="44" fill="${C.brand}">8</text>`,
  wheel: `<circle cx="150" cy="140" r="96" fill="${DARK}"/><circle cx="150" cy="140" r="60" fill="#d7dbe2" stroke="${C.brand}" stroke-width="6"/>
    <g stroke="${DARK}" stroke-width="12" stroke-linecap="round">${[0, 72, 144, 216, 288]
      .map((d) => {
        const r = ((d - 90) * Math.PI) / 180
        return `<path d="M${(150 + Math.cos(r) * 16).toFixed(0)} ${(140 + Math.sin(r) * 16).toFixed(0)}L${(150 + Math.cos(r) * 54).toFixed(0)} ${(140 + Math.sin(r) * 54).toFixed(0)}"/>`
      })
      .join("")}</g><circle cx="150" cy="140" r="14" fill="${C.brand}"/>`,
  burst: `<polygon points="${Array.from({ length: 16 }, (_, i) => {
    const t = (i * Math.PI) / 8
    const r = i % 2 ? 55 : 105
    return `${(150 + Math.cos(t) * r).toFixed(0)},${(140 + Math.sin(t) * r).toFixed(0)}`
  }).join(" ")}" fill="${C.bloom}" stroke="${C.brand}" stroke-width="4"/>
    <text x="150" y="156" text-anchor="middle" font-family="Impact, sans-serif" font-size="40" fill="${C.brand}" transform="rotate(-10 150 140)">VROOM!</text>`,
}

const SAMPLES: { motif: keyof typeof MOTIFS; caption: string; w: number; h: number; tint: string }[] = [
  { motif: "blaze", caption: "Flame Rod", w: 300, h: 300, tint: C.highlight },
  { motif: "cake", caption: "Birthday cake", w: 300, h: 380, tint: C.highlight },
  { motif: "blue", caption: "Blue Blaster", w: 300, h: 300, tint: C.soft },
  { motif: "flag", caption: "Checkered flag", w: 300, h: 360, tint: C.soft },
  { motif: "purple", caption: "Purple Thunder", w: 300, h: 300, tint: C.highlight },
  { motif: "trophy", caption: "Champion", w: 300, h: 280, tint: C.soft },
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
