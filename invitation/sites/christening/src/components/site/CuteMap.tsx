import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { cn } from "@/lib/utils"

// A soft, blush-tinted map (Leaflet + OpenStreetMap's own tiles: free, no
// API key; their policy asks for light use and the credit line) with a
// balloon-shaped pin. Used when EVENT.mapsQuery is coordinates; the Google
// Maps buttons beside it still open full directions. If the tiles can't be
// loaded, onFail lets the page fall back to the Google embed.

/** "14.651600,121.049800" → [lat, lng], or null if it isn't coordinates. */
export function parseLatLng(q: string): [number, number] | null {
  const m = q.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (!m) return null
  const lat = Number(m[1])
  const lng = Number(m[2])
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null
}

// A dusty-rose balloon with a shine, a gold heart and a little ribbon tail;
// its tip sits exactly on the spot.
const PIN = `
<svg viewBox="0 0 48 64" width="48" height="64" aria-hidden="true">
  <defs>
    <radialGradient id="pin-balloon" cx="35%" cy="30%" r="75%">
      <stop offset="0" stop-color="#f3d6d4"/>
      <stop offset=".55" stop-color="#d3a3a6"/>
      <stop offset="1" stop-color="#b48085"/>
    </radialGradient>
  </defs>
  <ellipse cx="24" cy="60" rx="9" ry="3" fill="#4f3426" opacity=".18"/>
  <path d="M24 58 C24 58 6 38 6 22 A18 18 0 0 1 42 22 C42 38 24 58 24 58 Z" fill="url(#pin-balloon)" stroke="#fff" stroke-width="2.5"/>
  <ellipse cx="16.5" cy="13.5" rx="4" ry="2.4" transform="rotate(-35 16.5 13.5)" fill="#fff" opacity=".7"/>
  <path d="M24 30.5s-7-4.3-7-9.5c0-2.6 2-4.4 4.2-4.4 1.3 0 2.3.6 2.8 1.6.5-1 1.5-1.6 2.8-1.6 2.2 0 4.2 1.8 4.2 4.4 0 5.2-7 9.5-7 9.5z" fill="#d2ae64" stroke="#fff6dc" stroke-width=".8"/>
</svg>`

export function CuteMap({
  lat,
  lng,
  label,
  className,
  onFail,
}: {
  lat: number
  lng: number
  label: string
  className?: string
  onFail?: () => void
}) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!el.current) return
    const map = L.map(el.current, {
      center: [lat, lng],
      zoom: 16,
      scrollWheelZoom: false, // don't hijack page scrolling
      attributionControl: true,
    })
    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Nothing loads (blocked, offline): hand over to the Google embed.
    let loaded = 0
    let failed = 0
    tiles.on("tileload", () => loaded++)
    tiles.on("tileerror", () => {
      if (++failed >= 4 && loaded === 0) onFail?.()
    })

    // A blush wash multiplied over the grey map (whites turn blush, greys
    // dusty rose), in its own layer between the map and the pin. It moves
    // with the map, so it's made far larger than the map itself.
    const tint = map.createPane("tint")
    tint.style.zIndex = "250"
    tint.style.pointerEvents = "none"
    const wash = document.createElement("div")
    wash.className = "cute-map-wash"
    tint.appendChild(wash)

    const icon = L.divIcon({
      html: PIN,
      className: "cute-map-pin",
      iconSize: [48, 64],
      iconAnchor: [24, 58],
      tooltipAnchor: [0, -52],
    })
    L.marker([lat, lng], { icon, title: label, alt: label, keyboard: false })
      .addTo(map)
      .bindTooltip(label, { permanent: true, direction: "top", className: "cute-map-label", offset: [0, -4] })

    return () => {
      map.remove()
    }
    // onFail is read at error time; re-creating the map for it isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, label])

  return <div ref={el} className={cn("cute-map", className)} role="region" aria-label={`Map showing ${label}`} />
}
