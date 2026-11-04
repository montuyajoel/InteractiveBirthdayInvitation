import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ATTIRE, GIFTS } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { cn } from "@/lib/utils"
import attireGuests from "@/assets/attire-guests.jpg"
import attireGodparents from "@/assets/attire-godparents.jpg"
import { Butterfly, FloralSpray, HeartRule, SectionTitle } from "./Decor"

// "Details": what to wear (colour swatches + outfit ideas) and a gift guide.
// Wording lives in COPY, colours in ATTIRE and the gift list in GIFTS
// (src/config.ts).

type Look = { key: string; title: string; note: string; colors: string[]; image: string; alt: string }

const LOOKS: Look[] = [
  {
    key: "guests",
    title: COPY.attireGuests,
    note: COPY.attireGuestsNote,
    colors: ATTIRE.guests,
    image: attireGuests,
    alt: "Outfit ideas for guests: soft pastel tops, dresses and trousers",
  },
  {
    key: "godparents",
    title: COPY.attireGodparents,
    note: COPY.attireGodparentsNote,
    colors: ATTIRE.godparents,
    image: attireGodparents,
    alt: "Outfit ideas for godparents: white tops with light trousers or denim",
  },
]

export function Details() {
  const [zoom, setZoom] = useState<Look | null>(null)

  return (
    <section id="details" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <FloralSpray className="pointer-events-none absolute -right-6 top-10 hidden w-40 -scale-x-100 md:block" />
      <Butterfly className="absolute left-[8%] top-24 hidden h-10 w-12 animate-drift sm:block" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <SectionTitle eyebrow={fill(COPY.detailsEyebrow)} title={fill(COPY.detailsTitle)} />
          <HeartRule className="mt-5 justify-center" />
        </div>

        {/* Attire */}
        <div className="paper mt-12 border border-brand/25 px-5 py-10 shadow-[0_30px_60px_-40px_rgb(var(--c-ink)/0.6)] sm:px-10">
          <h3 className="script foil text-center text-5xl sm:text-6xl">{fill(COPY.attireTitle)}</h3>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg italic leading-relaxed text-ink/90">
            {fill(COPY.attireIntro)}
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {LOOKS.map((look) => (
              <figure key={look.key} className="flex flex-col items-center">
                <ul className="flex flex-wrap justify-center gap-1.5" aria-label={`${look.title} colours`}>
                  {look.colors.map((c) => (
                    <li
                      key={c}
                      className="h-7 w-7 rounded-full shadow-[inset_0_-2px_4px_rgb(0_0_0/0.06)] ring-1 ring-ink/20 sm:h-8 sm:w-8"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </ul>
                <figcaption className="mt-3 text-center">
                  <span className="block font-serif text-2xl text-ink">{look.title}</span>
                  <span className="block italic text-brand">({look.note})</span>
                </figcaption>
                <button
                  type="button"
                  onClick={() => setZoom(look)}
                  className="group mt-5 block w-full overflow-hidden rounded-2xl bg-white ring-1 ring-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${look.title} outfit ideas: view larger`}
                >
                  <img
                    src={look.image}
                    alt={look.alt}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>
              </figure>
            ))}
          </div>
        </div>

        {/* Gift guide */}
        <div className="paper mx-auto mt-10 max-w-3xl border border-brand/25 px-5 py-10 text-center shadow-[0_30px_60px_-40px_rgb(var(--c-ink)/0.6)] sm:px-10">
          <h3 className="script foil text-5xl sm:text-6xl">{fill(COPY.giftTitle)}</h3>
          <p className="mx-auto mt-4 max-w-xl text-lg italic leading-relaxed text-ink/90">{fill(COPY.giftIntro)}</p>
          <ul className="mx-auto mt-8 grid max-w-2xl gap-x-8 gap-y-5 text-left sm:grid-cols-2">
            {GIFTS.map((g) => (
              <li key={g.name} className="flex items-center gap-4">
                <GiftIcon kind={g.icon} />
                <span>
                  <span className="block text-lg text-ink">{g.name}</span>
                  {g.note && <span className="block text-sm italic text-brand">({fill(g.note)})</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-9 max-w-xl text-lg leading-relaxed text-ink/90">{fill(COPY.giftOutro)}</p>
        </div>
      </div>

      <Dialog open={zoom !== null} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent className="max-w-[min(94vw,980px)] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{zoom ? `${zoom.title} outfit ideas` : ""}</DialogTitle>
          {zoom && <img src={zoom.image} alt={zoom.alt} className="max-h-[86vh] w-full rounded-2xl bg-white object-contain" />}
        </DialogContent>
      </Dialog>
    </section>
  )
}

/** Little drawings for the gift guide, in the site's colours. */
function GiftIcon({ kind, className }: { kind: (typeof GIFTS)[number]["icon"]; className?: string }) {
  return (
    <span
      className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-full bg-highlight/70 ring-1 ring-gold/50", className)}
      aria-hidden
    >
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {kind === "lotion" && (
          <g strokeWidth="1.4" style={{ stroke: "rgb(var(--c-brand))" }}>
            <path d="M17 5h7M21 5v5M16 10h9v4H16z" />
            <rect x="12" y="14" width="17" height="22" rx="5" style={{ fill: "rgb(var(--c-soft))" }} />
            <path d="M16 23h9" />
            <circle cx="20.5" cy="28.5" r="2" style={{ fill: "rgb(var(--c-bloom))" }} />
          </g>
        )}
        {kind === "bottle" && (
          <g strokeWidth="1.4" style={{ stroke: "rgb(var(--c-brand))" }}>
            <path d="M17 9c0-3 1.5-5 3.5-5S24 6 24 9" style={{ fill: "rgb(var(--c-highlight))" }} />
            <rect x="14.5" y="9" width="12" height="4" rx="1.5" style={{ fill: "rgb(var(--c-gold) / 0.5)" }} />
            <rect x="15" y="13" width="11" height="23" rx="4" style={{ fill: "rgb(var(--c-soft))" }} />
            <path d="M15 21h4M15 25h4M15 29h4" />
          </g>
        )}
        {kind === "diaper" && (
          <g strokeWidth="1.4" style={{ stroke: "rgb(var(--c-brand))" }}>
            <path d="M5 12h30v5c0 9-6 15-15 15S5 26 5 17z" style={{ fill: "rgb(var(--c-soft))" }} />
            <path d="M5 12h30v4H5z" style={{ fill: "rgb(var(--c-bloom) / 0.6)" }} />
            <path d="M13 22c2 3 4 4 7 4s5-1 7-4" />
          </g>
        )}
        {kind === "money" && (
          <g strokeWidth="1.4" style={{ stroke: "rgb(var(--c-brand))" }}>
            <rect x="6" y="12" width="26" height="15" rx="2" transform="rotate(-8 19 19.5)" style={{ fill: "rgb(var(--c-highlight))" }} />
            <rect x="8" y="15" width="26" height="15" rx="2" style={{ fill: "rgb(var(--c-soft))" }} />
            <circle cx="21" cy="22.5" r="3.5" style={{ fill: "rgb(var(--c-gold) / 0.55)" }} />
            <path d="M11 22.5h2M29 22.5h2" />
          </g>
        )}
      </svg>
    </span>
  )
}
