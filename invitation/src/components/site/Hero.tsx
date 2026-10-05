import { CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENT } from "@/config"
import { BabysBreath, Heart, HeartRule, Sparkle } from "./Decor"
import { Envelope } from "./Envelope"
import { Portrait } from "./Portrait"

export const eventDateLabel = EVENT.start.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
})
export const eventTimeLabel = EVENT.start.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
})

export function Hero() {
  const [first, ...rest] = EVENT.celebrant.split(" ")

  return (
    <section id="invitation" className="relative overflow-hidden pt-24 sm:pt-28">
      <BabysBreath className="pointer-events-none absolute -left-6 top-40 hidden w-32 opacity-90 md:block" />
      <Sparkle className="absolute left-[46%] top-28 h-5 w-5 opacity-70" />
      <Heart className="absolute left-[6%] top-[62%] h-4 w-4 opacity-60" filled />

      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-12 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:pb-16">
        <div className="relative">
          <p className="eyebrow">You're invited to a</p>
          <p className="mt-3 font-serif text-3xl uppercase tracking-[0.28em] text-mauve sm:text-4xl">Surprise</p>
          <h1 className="script mt-1 text-[5.5rem] text-mauve sm:text-[8rem]">
            {EVENT.age}
            <sup className="text-[0.4em]">th</sup> Birthday
          </h1>
          <p className="eyebrow mt-6">Celebration for</p>
          <p className="script mt-2 text-7xl text-plum sm:text-8xl">
            {first} <span className="text-mauve">{rest.join(" ")}</span>
          </p>
          <HeartRule className="mt-6" />

          <p className="mt-6 max-w-md text-xl italic leading-relaxed text-plum/90">
            Let's make her {EVENT.age}th extra special! Join us for a surprise celebration filled with love,
            good food and great company.
          </p>

          <dl className="mt-8 grid max-w-md gap-4 border-l border-mauve/40 pl-5">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-mauve" aria-hidden />
              <div>
                <dt className="sr-only">When</dt>
                <dd className="uppercase tracking-[0.2em] text-plum">{eventDateLabel}</dd>
                <dd className="text-sm uppercase tracking-[0.2em] text-mauve">{eventTimeLabel}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-mauve" aria-hidden />
              <div>
                <dt className="sr-only">Where</dt>
                <dd className="uppercase tracking-[0.2em] text-plum">{EVENT.venue}</dd>
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
              className="rounded-none border-mauve/60 bg-transparent px-8 uppercase tracking-[0.2em] text-plum hover:bg-white/60"
            >
              <a href="#directions">How to get there</a>
            </Button>
          </div>
        </div>

        <div className="relative order-first md:order-none">
          <Portrait />
        </div>
      </div>
    </section>
  )
}

/** The envelope with the printed card, just below the hero. */
export function InvitationCard() {
  return (
    <section aria-label="Your invitation" className="relative pb-16 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 sm:px-6 md:grid-cols-[1fr_1fr] md:gap-12">
        <div className="md:order-last md:pl-6">
          <p className="eyebrow">A little something for you</p>
          <p className="script mt-2 text-6xl">Your invitation</p>
          <p className="mt-4 max-w-sm text-lg italic text-plum/80">
            Open the envelope to see the card, then tap it to view it up close.
          </p>
        </div>
        <Envelope />
      </div>
    </section>
  )
}
