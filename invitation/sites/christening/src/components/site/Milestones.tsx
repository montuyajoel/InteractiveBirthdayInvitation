import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { EVENT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { cn } from "@/lib/utils"
import month1 from "@/assets/sample-month-1.jpg"
import month2 from "@/assets/sample-month-2.jpg"
import { Balloons, Butterfly, FloralSpray, HeartRule, SectionTitle, garland } from "./Decor"

// One entry per monthly photo. To add a month, put the photo in src/assets
// (about 760px wide), import it above and add a line here.
// `position` is where the face is, so the arch crop keeps it in view.
const MONTHS: { month: number; src: string; position: string }[] = [
  { month: 1, src: month1, position: "50% 55%" },
  { month: 2, src: month2, position: "50% 45%" },
]

const CLUSTER = garland([[30, 60], [60, 40], [20, 100], [70, 84], [96, 56], [44, 130]], 41, 0.9)

export function Milestones() {
  const [open, setOpen] = useState<number | null>(null)
  const current = MONTHS.find((m) => m.month === open)
  const label = (month: number) => `${month} ${month === 1 ? "month" : "months"}`

  return (
    <section id="milestones" className="relative overflow-hidden py-20 sm:py-24">
      <Balloons
        balloons={CLUSTER}
        viewBox="0 0 120 150"
        className="pointer-events-none absolute -right-10 top-10 w-24 sm:w-32"
      />
      <FloralSpray className="pointer-events-none absolute -left-8 bottom-6 hidden w-40 md:block" />
      <Butterfly className="absolute left-[12%] top-16 hidden h-12 w-14 animate-drift sm:block" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <SectionTitle eyebrow={fill(COPY.milestonesEyebrow)} title={fill(COPY.milestonesTitle)} />
          <HeartRule className="mt-5 justify-center" />
          <p className="mt-5 text-lg italic leading-relaxed text-ink/90">{fill(COPY.milestonesIntro)}</p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-3xl grid-cols-2 justify-center gap-5 sm:gap-10 md:grid-cols-[repeat(auto-fit,minmax(220px,280px))]">
          {MONTHS.map((m, i) => (
            <li key={m.month} className={cn("flex flex-col items-center", i % 2 === 1 && "sm:mt-10")}>
              <button
                type="button"
                onClick={() => setOpen(m.month)}
                className="group relative block w-full rounded-t-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                aria-label={`${EVENT.honoreeShort} at ${label(m.month)}: view larger`}
              >
                {/* dusty-rose arch frame with a fine gold line, like the backdrop */}
                <span className="block rounded-t-full bg-[linear-gradient(180deg,#e2bfc0,#cfa1a5)] p-2 shadow-[0_22px_40px_-24px_rgb(var(--c-ink)/0.6)] transition-transform duration-500 group-hover:-translate-y-1.5 sm:p-3">
                  <span className="block overflow-hidden rounded-t-full ring-1 ring-gold/70">
                    <img
                      src={m.src}
                      alt={`${EVENT.honoreeShort} at ${label(m.month)}`}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: m.position }}
                    />
                  </span>
                </span>
              </button>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="foil font-serif text-5xl font-medium leading-none sm:text-6xl">{m.month}</span>
                <span className="script text-3xl text-brand sm:text-4xl">{m.month === 1 ? "month" : "months"}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-[min(92vw,620px)] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{current ? `${EVENT.honoreeShort} at ${label(current.month)}` : ""}</DialogTitle>
          {current && (
            <figure>
              <img
                src={current.src}
                alt={`${EVENT.honoreeShort} at ${label(current.month)}`}
                className="max-h-[80vh] w-full rounded-t-[2rem] object-contain"
              />
              <figcaption className="mt-3 text-center">
                <span className="script text-4xl text-white drop-shadow">{label(current.month)}</span>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
