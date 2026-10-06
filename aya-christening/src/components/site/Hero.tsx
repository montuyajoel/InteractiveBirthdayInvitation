import { CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENT } from "@/config"
import { COPY, Title, fill, plainTitle } from "@/lib/copy"
import { cn } from "@/lib/utils"
import { BabyMobile, BabysBreath, Cloud, Dove, FloatingBubbles, HeartRule, Sparkle } from "./Decor"
import { Envelope } from "./Envelope"

import { eventDateLabel, eventTimeLabel } from "@/lib/event"

export { eventDateLabel, eventTimeLabel }

export function Hero() {
  const [first, ...rest] = EVENT.honoree.split(" ")

  return (
    <section id="invitation" className="relative overflow-hidden pt-24 sm:pt-28">
      <FloatingBubbles />
      <Cloud className="pointer-events-none absolute -left-12 top-[4.5rem] w-32 animate-cloud-drift opacity-80 sm:w-44" />
      <Cloud
        className="pointer-events-none absolute left-[38%] top-[46%] hidden w-28 animate-cloud-drift opacity-70 md:block"
        style={{ animationDelay: "-6s", animationDuration: "18s" }}
      />
      <Cloud
        className="pointer-events-none absolute -right-10 top-[70%] w-32 animate-cloud-drift opacity-80"
        style={{ animationDelay: "-3s" }}
      />
      <BabyMobile className="pointer-events-none absolute right-[6%] top-14 hidden w-64 md:block lg:right-[12%]" />
      <Dove className="absolute left-[44%] top-24 hidden h-12 w-16 animate-glide md:block" />
      <Dove className="absolute right-4 top-24 h-9 w-12 animate-glide md:hidden" />
      <Sparkle className="absolute left-[30%] top-28 h-6 w-6 animate-twinkle" />
      <Sparkle className="absolute left-[8%] top-[58%] h-7 w-7 animate-twinkle" style={{ animationDelay: "-1s" }} />
      <Sparkle className="absolute right-[34%] top-[38%] h-5 w-5 animate-twinkle text-brand" style={{ animationDelay: "-2s" }} />
      <Sparkle className="absolute right-[6%] bottom-24 h-6 w-6 animate-twinkle" style={{ animationDelay: "-1.5s" }} />
      <BabysBreath className="pointer-events-none absolute -right-4 bottom-0 w-24 -scale-x-100 opacity-90 sm:w-32" />

      <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:pb-24">
        <div className="relative">
          <p className="eyebrow">{fill(COPY.invitedLine)}</p>
          {COPY.kicker && (
            <p className="mt-3 font-serif text-3xl uppercase tracking-[0.28em] text-brand sm:text-4xl">
              {fill(COPY.kicker)}
            </p>
          )}
          <h1
            className={cn(
              "script foil mt-1",
              // big for short titles ("16th Birthday"), smaller for long ones
              plainTitle(COPY.title).length <= 16
                ? "text-[5.5rem] sm:text-[8rem]"
                : "text-[3.75rem] leading-[0.95] sm:text-[5.5rem]",
            )}
          >
            <Title text={COPY.title} />
          </h1>
          <p className="eyebrow mt-6">{fill(COPY.celebrationFor)}</p>
          <p className="script mt-2 text-7xl text-ink sm:text-8xl">
            {first} <span className="foil">{rest.join(" ")}</span>
          </p>
          <HeartRule className="mt-6" />

          <p className="mt-6 max-w-md text-xl italic leading-relaxed text-ink/90">
            {fill(COPY.intro)}
          </p>

          <dl className="mt-8 grid max-w-md gap-4 border-l border-brand/40 pl-5">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <dt className="sr-only">When</dt>
                <dd className="uppercase tracking-[0.2em] text-ink">{eventDateLabel}</dd>
                <dd className="text-sm uppercase tracking-[0.2em] text-brand">{eventTimeLabel}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <dt className="sr-only">Where</dt>
                <dd className="uppercase tracking-[0.2em] text-ink">{EVENT.venue}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-none px-8 uppercase tracking-[0.2em]">
              <a href="#rsvp">Register</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-brand/60 bg-transparent px-8 uppercase tracking-[0.2em] text-ink hover:bg-white/60"
            >
              <a href="#directions">How to get there</a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Envelope />
        </div>
      </div>
    </section>
  )
}
