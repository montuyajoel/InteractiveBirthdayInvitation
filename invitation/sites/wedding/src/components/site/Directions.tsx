import { useState } from "react"
import { Check, Copy, MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Stop } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { hasSchedule, stops } from "@/lib/event"
import { Butterfly, SectionTitle } from "./Decor"

export function Directions() {
  return (
    <section id="directions" className="relative scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle eyebrow="Finding your way" title="How to get there" />
        <div className="grid gap-16 md:gap-20">
          {stops.map((s, i) => (
            <Venue key={s.venue} stop={s} first={i === 0} last={i === stops.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Map, directions and links for one place. */
function Venue({ stop, first, last }: { stop: Stop; first: boolean; last: boolean }) {
  const [copied, setCopied] = useState(false)
  const q = encodeURIComponent(stop.mapsQuery)
  const embedUrl = `https://www.google.com/maps?q=${q}&output=embed`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`

  async function copyVenue() {
    try {
      await navigator.clipboard.writeText(`${stop.venue} — ${stop.mapsShareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked; nothing else to do
    }
  }

  return (
    <div className={`${first ? "mt-12" : ""} grid gap-10 md:grid-cols-[1.45fr_1fr] md:gap-14`}>
      <div className="relative bg-white p-2 shadow-[0_30px_60px_-40px_rgb(var(--c-ink)/0.7)] ring-1 ring-brand/20">
        <iframe
          title={`Map showing ${stop.venue}`}
          src={embedUrl}
          className="block aspect-[4/3] w-full border-0 grayscale-[35%] sepia-[15%] md:aspect-auto md:h-[440px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {first && <Butterfly className="absolute -top-6 right-2 h-10 w-12 animate-drift sm:-right-5" />}
      </div>

      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-6 w-6 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="eyebrow">{hasSchedule ? `${stop.label} · ${stop.time}` : "The venue"}</p>
            <p className="mt-1 text-3xl text-ink">{stop.venue}</p>
            {hasSchedule && stop.address && <p className="mt-1 italic text-ink/70">{stop.address}</p>}
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <Button asChild size="lg" className="justify-start gap-3 rounded-none uppercase tracking-[0.18em]">
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              <Navigation /> Get directions
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="justify-start gap-3 rounded-none border-brand/50 bg-transparent uppercase tracking-[0.18em] text-ink hover:bg-white/60"
          >
            <a href={stop.mapsShareUrl} target="_blank" rel="noreferrer">
              <ExternalLink /> Open pinned location
            </a>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={copyVenue}
            className="justify-start gap-3 rounded-none uppercase tracking-[0.18em] text-brand hover:bg-highlight/60 hover:text-ink"
          >
            {copied ? <Check /> : <Copy />} {copied ? "Copied!" : "Copy location link"}
          </Button>
        </div>

        {last && (
          <div className="mt-auto pt-10">
            <p className="border-l-2 border-brand/50 pl-4 text-lg italic text-ink/90">{fill(COPY.arriveTip)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
