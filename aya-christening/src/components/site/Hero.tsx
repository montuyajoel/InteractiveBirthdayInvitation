import { CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENT } from "@/config"
import { COPY, Title, fill, plainTitle } from "@/lib/copy"
import { cn } from "@/lib/utils"
import { Balloons, Bow, Butterfly, Cross, FloatingBalloons, FloralSpray, HeartRule, Sparkle, garland } from "./Decor"
import { Envelope } from "./Envelope"

import { eventDateLabel, eventTimeLabel } from "@/lib/event"

export { eventDateLabel, eventTimeLabel }

// Garlands wrapping the arch: up its left side and over the top, and a
// cluster at its right foot (coordinates in the arch's 400 x 560 box).
const ARCH_GARLAND = garland(
  [
    [16, 540], [6, 500], [18, 462], [4, 424], [16, 386], [6, 348], [20, 310], [12, 272], [28, 236], [40, 200],
    [58, 166], [80, 136], [106, 110], [136, 90], [168, 76], [202, 70],
  ],
  11,
  1.3,
)
const FOOT_CLUSTER = garland([[392, 540], [362, 554], [404, 500], [334, 562], [386, 462], [410, 430]], 4, 1.35)
const CORNER_CLUSTER = garland([[30, 60], [60, 40], [20, 100], [70, 84], [96, 56], [44, 130]], 23, 0.9)

export function Hero() {
  const [first, ...rest] = EVENT.honoree.split(" ")

  return (
    <section id="invitation" className="relative overflow-hidden pt-24 sm:pt-28">
      <FloatingBalloons />
      <Balloons
        balloons={CORNER_CLUSTER}
        viewBox="0 0 120 150"
        className="pointer-events-none absolute -left-16 top-[62%] w-24 opacity-90 sm:w-32 md:-left-14"
      />
      <Sparkle className="absolute left-[30%] top-28 h-6 w-6 animate-twinkle" />
      <Sparkle className="absolute left-[8%] top-[58%] h-5 w-5 animate-twinkle" style={{ animationDelay: "-1s" }} />
      <Sparkle className="absolute right-[44%] top-[34%] hidden h-5 w-5 animate-twinkle md:block" style={{ animationDelay: "-2s" }} />

      <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:pb-24">
        <div className="relative">
          <Cross className="mb-4 h-8 w-6" />
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

        {/* the envelope, set in a dusty-rose arch dressed with balloons and flowers */}
        <div className="relative mx-auto flex min-h-[560px] w-full max-w-[400px] flex-col justify-end md:min-h-[640px]">
          <div className="pointer-events-none absolute inset-x-4 bottom-12 top-6 sm:inset-x-6" aria-hidden>
            <div className="absolute inset-0 rounded-t-full bg-[linear-gradient(180deg,#e2bfc0,#cfa1a5)] shadow-[0_24px_50px_-28px_rgb(var(--c-ink)/0.6)]" />
            <div className="absolute inset-x-[7%] bottom-0 top-[5%] rounded-t-full border-2 border-white/35" />
            <div className="absolute inset-x-[14%] bottom-0 top-[10%] rounded-t-full bg-[linear-gradient(180deg,#f8eee6,#f1e1d6)] ring-1 ring-gold/60" />
            <div className="absolute -bottom-3 -inset-x-3 h-5 rounded-[50%] bg-[#d7aeb0]/70" />
          </div>
          <Balloons
            balloons={ARCH_GARLAND}
            viewBox="0 0 400 560"
            className="pointer-events-none absolute inset-x-0 bottom-12 top-6"
          />
          <Balloons
            balloons={FOOT_CLUSTER}
            viewBox="0 0 400 560"
            className="pointer-events-none absolute inset-x-0 bottom-12 top-6"
          />
          <FloralSpray className="pointer-events-none absolute -right-6 top-[18%] w-32 -scale-x-100 sm:w-40" />
          <Bow className="pointer-events-none absolute -right-2 top-[42%] w-12 sm:w-14" />
          <Butterfly className="absolute -left-2 -top-2 h-16 w-20 animate-drift sm:-left-12 sm:h-24 sm:w-28" />
          <Butterfly
            className="absolute -right-2 top-[8%] h-12 w-14 animate-drift sm:-right-10 sm:h-16 sm:w-20"
            style={{ animationDelay: "-3s" }}
          />
          <div className="relative z-10">
            <Envelope />
          </div>
        </div>
      </div>
    </section>
  )
}
