import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ATTIRE, EVENT, GIFTS, PAYMENTS, type GiftIcon as GiftIconKind } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { cn } from "@/lib/utils"
import attireGuests from "@/assets/attire-guests.jpg"
import attireGodparents from "@/assets/attire-godparents.jpg"
import giftClothes from "@/assets/gift-clothes.jpg"
import giftCetaphil from "@/assets/gift-cetaphil.jpg"
import giftEqDiapers from "@/assets/gift-eq-diapers.jpg"
import qrGotyme from "@/assets/qr-gotyme.jpg"
import qrBdo from "@/assets/qr-bdo.jpg"
import qrGcash from "@/assets/qr-gcash.jpg"
import giftS26 from "@/assets/gift-s26.jpg"
import { Butterfly, FloralSpray, HeartRule, SectionTitle } from "./Decor"

// "Details": what to wear (colour swatches + outfit ideas) and a gift guide.
// Wording lives in COPY, colours in ATTIRE and the gift list in GIFTS
// (src/config.ts).

type Look = { key: string; title: string; note: string; colors: string[]; image: string; alt: string }

const GIFT_PICTURES = {
  "eq-diapers": giftEqDiapers,
  cetaphil: giftCetaphil,
  clothes: giftClothes,
  s26: giftS26,
} as const
const QR_PICTURES = { gotyme: qrGotyme, bdo: qrBdo, gcash: qrGcash } as const

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
        <div className="paper mx-auto mt-10 max-w-4xl border border-brand/25 px-5 py-10 text-center shadow-[0_30px_60px_-40px_rgb(var(--c-ink)/0.6)] sm:px-10">
          <h3 className="script foil text-5xl sm:text-6xl">{fill(COPY.giftTitle)}</h3>
          <p className="mx-auto mt-4 max-w-xl text-lg italic leading-relaxed text-ink/90">{fill(COPY.giftIntro)}</p>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-5 text-left sm:grid-cols-2">
            {GIFTS.map((g, i) => {
              const picture = g.picture && GIFT_PICTURES[g.picture]
              // an odd one out at the end sits centred on its own row
              const lone = i === GIFTS.length - 1 && GIFTS.length % 2 === 1
              return (
                <li
                  key={g.name}
                  className={cn(
                    "flex flex-col overflow-hidden rounded-2xl bg-white/80 ring-1 ring-gold/40",
                    lone && "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)]",
                  )}
                >
                  {picture ? (
                    <button
                      type="button"
                      onClick={() => setZoom({ key: g.name, title: g.name, note: "", colors: [], image: picture, alt: g.name })}
                      className="group block overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      aria-label={`${g.name}: view larger`}
                    >
                      <img
                        src={picture}
                        alt={g.name}
                        loading="lazy"
                        className="aspect-[3/2] w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {g.hint && (
                        <span className="block bg-highlight/60 py-1.5 text-center text-sm italic text-brand">{g.hint}</span>
                      )}
                    </button>
                  ) : (
                    <a
                      href={g.icon === "money" ? "#gift-qr" : undefined}
                      className="grid aspect-[3/2] place-items-center gap-2 bg-highlight/40 content-center"
                    >
                      <GiftIcon kind={g.icon} className="h-24 w-24 [&>svg]:h-14 [&>svg]:w-14" />
                      {g.hint && <span className="text-sm italic text-brand">{g.hint} ↓</span>}
                    </a>
                  )}
                  <div className="flex items-center gap-3 border-t border-gold/25 px-4 py-3">
                    <GiftIcon kind={g.icon} className="h-11 w-11 [&>svg]:h-7 [&>svg]:w-7" />
                    <span>
                      <span className="block text-lg leading-tight text-ink">{g.name}</span>
                      {g.note && <span className="block text-sm italic text-brand">({fill(g.note)})</span>}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <div id="gift-qr" className="mx-auto mt-10 max-w-3xl scroll-mt-24 border-t border-gold/30 pt-8">
            <p className="eyebrow">Monetary gift</p>
            <p className="mt-2 italic text-ink/80">Scan with your banking app, or save a code and open it there.</p>
            <ul className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-3">
              {PAYMENTS.map((pay) => {
                const qr = QR_PICTURES[pay.qr]
                return (
                  <li key={pay.qr} className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gold/40">
                    <button
                      type="button"
                      onClick={() =>
                        setZoom({ key: pay.qr, title: pay.bank, note: "", colors: [], image: qr, alt: `${pay.bank} QR code` })
                      }
                      className="block bg-white p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      aria-label={`${pay.bank} QR code: view larger`}
                    >
                      <img src={qr} alt={`${pay.bank} QR code`} loading="lazy" className="mx-auto aspect-[4/5] w-full max-w-[240px] object-contain" />
                    </button>
                    <div className="border-t border-gold/25 px-3 py-3">
                      <span className="block text-lg leading-tight text-ink">{pay.bank}</span>
                      <span className="block text-sm text-brand">{pay.detail}</span>
                    </div>
                    <a
                      href={qr}
                      download={`${EVENT.id}-${pay.qr}-qr.jpg`}
                      className="mt-auto border-t border-gold/25 py-2.5 text-xs uppercase tracking-[0.18em] text-brand hover:bg-highlight/50 hover:text-ink"
                    >
                      Save QR code
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
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
function GiftIcon({ kind, className }: { kind: GiftIconKind; className?: string }) {
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
        {kind === "clothes" && (
          <g strokeWidth="1.4" style={{ stroke: "rgb(var(--c-brand))" }}>
            <path
              d="M14 7c1.5 2 3.6 3 6 3s4.5-1 6-3l7 5-3 5-3-2v16c0 1-1 2-2 2h-2.5l-2.5-3-2.5 3H15c-1 0-2-1-2-2V15l-3 2-3-5z"
              style={{ fill: "rgb(var(--c-soft))" }}
            />
            <path d="M17.5 17.5s-1.7-1-1.7-2.3c0-.7.5-1.1 1-1.1.3 0 .6.2.7.4.1-.2.4-.4.7-.4.5 0 1 .4 1 1.1 0 1.3-1.7 2.3-1.7 2.3z" style={{ fill: "rgb(var(--c-bloom))" }} />
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
