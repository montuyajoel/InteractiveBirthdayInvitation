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

const MAUVE = C.mauve
const GOLD = C.gold

const balloon = (x: number, y: number, r: number, fill: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><ellipse cx="${x - r * 0.35}" cy="${y - r * 0.4}" rx="${r * 0.22}" ry="${r * 0.13}" fill="#fff" opacity=".6" transform="rotate(-35 ${x - r * 0.35} ${y - r * 0.4})"/>`

const MOTIFS: Record<string, string> = {
  balloons: [
    [110, 110, 40, MAUVE], [180, 96, 44, "#f5ebe0"], [150, 160, 36, GOLD], [90, 170, 26, C.bloom], [215, 160, 30, "#e2c6ac"], [140, 70, 22, C.bloom],
  ]
    .map(([x, y, r, f]) => balloon(x as number, y as number, r as number, f as string))
    .join(""),
  bow: `<g fill="${MAUVE}" stroke="${C.brand}" stroke-width="2" stroke-linejoin="round">
    <path d="M146 110C126 130 110 190 96 240l20-8 10 18c6-50 14-100 24-136z"/><path d="M154 110c20 20 36 80 50 130l-20-8-10 18c-6-50-14-100-24-136z"/>
    <path d="M146 104C120 70 70 62 68 92c-2 26 44 34 78 18z"/><path d="M154 104c26-34 76-42 78-12 2 26-44 34-78 18z"/>
    <rect x="138" y="94" width="24" height="24" rx="8"/></g>`,
  butterfly: `<path d="M150 140 C120 70 50 66 58 112 C64 146 110 148 150 140 Z M150 140 C180 70 250 66 242 112 C236 146 190 148 150 140 Z M150 140 C122 156 86 196 112 208 C130 214 144 180 150 140 Z M150 140 C178 156 214 196 188 208 C170 214 156 180 150 140 Z" fill="#fff8ec" stroke="${GOLD}" stroke-width="3"/>
    <path d="M150 110 V190" stroke="${C.brand}" stroke-width="4" stroke-linecap="round"/>`,
  cross: `<path d="M150 60v170M110 110h80" stroke="${GOLD}" stroke-width="12" stroke-linecap="round"/>
    <path d="M150 60v170M110 110h80" stroke="#fff3cf" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,
  heart: `<path d="M150 220 s-80 -46 -80 -102 c0 -30 22 -50 46 -50 c16 0 28 8 34 20 c6 -12 18 -20 34 -20 c24 0 46 20 46 50 c0 56 -80 102 -80 102z" fill="${C.bloom}" stroke="${C.brand}" stroke-width="3"/>`,
  roses: `<g stroke="${C.brand}" stroke-width="2">${[
    [110, 120, 30, "#fffaf2"], [175, 110, 26, C.bloom], [145, 165, 28, "#fffaf2"], [205, 165, 20, "#fffaf2"], [90, 175, 18, C.bloom],
  ]
    .map(
      ([x, y, r, f]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/><path d="M${(x as number) - (r as number) * 0.6} ${y}c0 -${(r as number) * 0.7} ${(r as number) * 1.2} -${(r as number) * 0.7} ${(r as number) * 1.2} 0M${(x as number) - (r as number) * 0.3} ${y}c0 -${(r as number) * 0.35} ${(r as number) * 0.6} -${(r as number) * 0.35} ${(r as number) * 0.6} 0" fill="none"/>`,
    )
    .join("")}</g><path d="M150 250 C140 220 120 200 100 190 M150 250 C160 220 200 200 210 180" fill="none" stroke="${C.foliage}" stroke-width="3"/>`,
}

const SAMPLES: { motif: keyof typeof MOTIFS; caption: string; w: number; h: number; tint: string }[] = [
  { motif: "balloons", caption: "Balloon garland", w: 300, h: 300, tint: C.soft },
  { motif: "cross", caption: "Baptized in His love", w: 300, h: 360, tint: C.highlight },
  { motif: "butterfly", caption: "Butterflies", w: 300, h: 280, tint: C.highlight },
  { motif: "bow", caption: "Satin bow", w: 300, h: 360, tint: C.soft },
  { motif: "roses", caption: "Flowers for Aya", w: 300, h: 300, tint: C.highlight },
  { motif: "heart", caption: "With love", w: 300, h: 280, tint: C.soft },
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
