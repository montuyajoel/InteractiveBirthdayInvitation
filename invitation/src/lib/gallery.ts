import { GALLERY } from "@/config"
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

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i

type StorageObject = {
  name: string
  id: string | null
  metadata?: { mimetype?: string } | null
}

export async function loadPhotos(): Promise<GalleryResult> {
  if (!isConfigured(GALLERY)) return { photos: samplePhotos(), source: "sample" }

  const folder = GALLERY.folder.replace(/^\/|\/$/g, "")
  const res = await fetch(supabaseUrl(GALLERY, `/storage/v1/object/list/${GALLERY.bucket}`), {
    method: "POST",
    headers: supabaseHeaders(GALLERY),
    body: JSON.stringify({
      prefix: folder,
      limit: 500,
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

function prettify(filename: string) {
  return filename
    .replace(IMAGE_EXT, "")
    .replace(/[-_]+/g, " ")
    .replace(/^\d+\s*/, "")
    .trim()
}

// ---------------------------------------------------------------------------
// Sample tiles shown until the storage bucket is connected.

const MOTIFS: Record<string, string> = {
  cake: `<rect x="70" y="120" width="160" height="90" rx="10" fill="#f9e3ee" stroke="#b07fb5" stroke-width="3"/>
    <path d="M70 150 q20 18 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#b07fb5" stroke-width="3"/>
    <rect x="135" y="80" width="10" height="40" fill="#e8c88f"/><rect x="155" y="80" width="10" height="40" fill="#e8c88f"/>
    <path d="M140 64 q6 8 0 14 q-6 -6 0 -14z M160 64 q6 8 0 14 q-6 -6 0 -14z" fill="#f2b45c"/>
    <path d="M150 170 l-26 -14 v28z M150 170 l26 -14 v28z" fill="#cfa6d6"/>`,
  balloons: `<ellipse cx="115" cy="110" rx="38" ry="46" fill="#e7cdef" stroke="#a978b0" stroke-width="3"/>
    <ellipse cx="185" cy="95" rx="38" ry="46" fill="#f6d5e3" stroke="#a978b0" stroke-width="3"/>
    <path d="M115 156 q10 40 -4 80 M185 141 q-12 50 6 95" fill="none" stroke="#a978b0" stroke-width="2"/>`,
  ribbon: `<path d="M150 120 C110 70 60 80 70 115 C78 145 120 135 150 120 Z M150 120 C190 70 240 80 230 115 C222 145 180 135 150 120 Z" fill="#e3c8ec" stroke="#9a6aa0" stroke-width="3"/>
    <path d="M150 120 L118 210 L134 204 L142 222 Z M150 120 L182 210 L166 204 L158 222 Z" fill="#d6b3df" stroke="#9a6aa0" stroke-width="3"/>
    <circle cx="150" cy="120" r="12" fill="#cfa6d6" stroke="#9a6aa0" stroke-width="3"/>`,
  heart: `<path d="M150 220 s-80 -46 -80 -102 c0 -30 22 -50 46 -50 c16 0 28 8 34 20 c6 -12 18 -20 34 -20 c24 0 46 20 46 50 c0 56 -80 102 -80 102z" fill="#f4d3e3" stroke="#a978b0" stroke-width="3"/>`,
  butterfly: `<path d="M150 140 C120 70 50 66 58 112 C64 146 110 148 150 140 Z M150 140 C180 70 250 66 242 112 C236 146 190 148 150 140 Z M150 140 C122 156 86 196 112 208 C130 214 144 180 150 140 Z M150 140 C178 156 214 196 188 208 C170 214 156 180 150 140 Z" fill="#ead8f1" stroke="#9a6aa0" stroke-width="3"/>
    <path d="M150 110 V190" stroke="#9a6aa0" stroke-width="4" stroke-linecap="round"/>`,
  flowers: `<g fill="#fff" stroke="#c99ac9" stroke-width="2">${[
    [100, 90], [140, 70], [190, 95], [120, 130], [170, 135], [215, 140], [90, 160], [150, 175],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/><circle cx="${x}" cy="${y}" r="4" fill="#f1c6db"/>`)
    .join("")}</g><path d="M150 250 C150 210 120 180 100 160 M150 250 C150 200 175 160 190 95 M150 250 C140 200 150 180 150 175 M150 250 C170 210 210 170 215 140" fill="none" stroke="#a7a06a" stroke-width="2"/>`,
}

const SAMPLES: { motif: keyof typeof MOTIFS; caption: string; w: number; h: number; tint: string }[] = [
  { motif: "cake", caption: "Sweet sixteen cake", w: 300, h: 380, tint: "#f6dde8" },
  { motif: "balloons", caption: "Balloons & bows", w: 300, h: 300, tint: "#ece0f3" },
  { motif: "butterfly", caption: "Garden butterflies", w: 300, h: 260, tint: "#f3e7f6" },
  { motif: "ribbon", caption: "Satin ribbons", w: 300, h: 360, tint: "#efe1f2" },
  { motif: "flowers", caption: "Baby's breath", w: 300, h: 300, tint: "#f8e8ef" },
  { motif: "heart", caption: "With love", w: 300, h: 280, tint: "#f6dde8" },
]

function sampleSvg(motif: string, w: number, h: number, tint: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}">
    <rect width="100%" height="100%" fill="#fbf6fb"/>
    <circle cx="${w * 0.2}" cy="${h * 0.25}" r="${w * 0.5}" fill="${tint}" opacity=".8"/>
    <circle cx="${w * 0.9}" cy="${h * 0.85}" r="${w * 0.45}" fill="#e9dcf0" opacity=".7"/>
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
