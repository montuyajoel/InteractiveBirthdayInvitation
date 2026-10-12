// The wedding-day story, top to bottom as guests scroll: welcome, the formal
// invitation, ceremony & reception, dress code, our story, timeline, the day
// after and gifts. All wording comes from WEDDING in src/config.ts.
import { CalendarPlus, MapPin } from "lucide-react"
import { EVENT, WEDDING } from "@/config"
import { extraCalendarUrl, googleCalendarUrl } from "@/lib/calendar"
import { cn } from "@/lib/utils"
import {
  DressCodeArt,
  FloralArch,
  HangingWisteria,
  RibbonBow,
  RoseVine,
  Swans,
  TimelineIcon,
  Townhouse,
  WisteriaGarland,
} from "./Embroidery"
import { Envelope } from "./Envelope"
import { Butterflies, RisingHearts, Twinkles } from "./Motion"
import { Reveal } from "./Reveal"

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("font-serif text-[2.6rem] leading-tight text-ink sm:text-5xl", className)}>{children}</h2>
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] uppercase tracking-[0.34em] text-brand">{children}</p>
}

function LinkButtons({ maps, calendar }: { maps: string; calendar: string }) {
  const cls =
    "inline-flex items-center gap-2 border-b border-transparent pb-0.5 text-xs uppercase tracking-[0.28em] text-ink transition-colors hover:border-brand/60 hover:text-brand"
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <a className={cls} href={maps} target="_blank" rel="noreferrer">
        <MapPin className="h-3.5 w-3.5" /> Open in maps
      </a>
      <a className={cls} href={calendar} target="_blank" rel="noreferrer">
        <CalendarPlus className="h-3.5 w-3.5" /> Add to calendar
      </a>
    </div>
  )
}

export function Welcome() {
  const w = WEDDING.welcome
  return (
    <section id="welcome" className="relative overflow-hidden pb-6">
      <WisteriaGarland className="mx-auto block w-full max-w-3xl" />
      <div className="relative mx-auto max-w-xl px-14 text-center sm:px-20">
        <RoseVine className="absolute -top-6 left-1 h-[calc(100%+3rem)] w-8 sm:left-4" height={420} />
        <RoseVine className="absolute -top-6 right-1 h-[calc(100%+3rem)] w-8 -scale-x-100 sm:right-4" height={420} seed={9} />
        <Reveal>
          <Heading>{w.title}</Heading>
          <p className="mt-5 text-lg italic leading-relaxed text-ink/90">{w.text}</p>
        </Reveal>
      </div>
      <Butterflies count={2} seed={5} />
      <Reveal className="relative mx-auto mt-6 w-[min(82vw,340px)]">
        <RisingHearts className="left-1/2 top-[22%] h-0 w-0" />
        <Swans className="bob block w-full" />
      </Reveal>
    </section>
  )
}

export function Invitation() {
  const i = WEDDING.invitation
  return (
    <section aria-label="Invitation" className="relative px-4 pb-16 pt-8 text-center">
      <Reveal className="mx-auto max-w-xl">
        <p className="text-sm italic text-ink/80">{i.before}</p>
        <p className="mt-5 font-serif text-[2.4rem] leading-tight text-ink sm:text-5xl">{WEDDING.partnerOne}</p>
        <p className="my-1 font-serif text-xl italic text-brand">and</p>
        <p className="font-serif text-[2.4rem] leading-tight text-ink sm:text-5xl">{WEDDING.partnerTwo}</p>
        <p className="mt-6 italic text-ink/85">{i.after}</p>
        <p className="mt-4 text-sm uppercase tracking-[0.28em] text-ink">{i.date}</p>
      </Reveal>
      <Reveal className="mt-4">
        <Envelope />
      </Reveal>
    </section>
  )
}

export function Celebrate() {
  const c = WEDDING.celebrate
  return (
    <section id="details" className="px-4 py-10">
      <Reveal className="relative mx-auto max-w-md">
        {/* framed card with a wisteria crown */}
        <div className="relative border border-brand/30 bg-white/55 px-6 pb-10 pt-24 text-center shadow-[0_24px_50px_-30px_rgb(var(--c-ink)/0.5)] outline outline-1 outline-offset-[6px] outline-brand/25 backdrop-blur-sm">
          <WisteriaGarland className="pointer-events-none absolute -top-3 left-0 w-full" seed={14} />
          <Heading className="text-4xl sm:text-[2.6rem]">Ceremony &amp; Reception</Heading>
          <div className="mt-4">
            <Eyebrow>{c.eyebrow}</Eyebrow>
          </div>
          <p className="mt-4 font-serif text-3xl text-ink">{c.venue}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-ink/80">{c.place}</p>
          <p className="mt-4 italic text-ink/85">{c.date}</p>
          <dl className="mx-auto mt-5 grid max-w-[18rem] gap-2 text-left text-sm">
            {c.parts.map((p) => (
              <div key={p.label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-dotted border-brand/40 pb-1.5">
                <dt className="text-ink">
                  <span className="uppercase tracking-[0.18em]">{p.label}</span>
                  <span className="italic text-ink/75"> · {p.where}</span>
                </dt>
                <dd className="tabular-nums text-brand">{p.time}</dd>
              </div>
            ))}
          </dl>
          <LinkButtons maps={EVENT.mapsShareUrl} calendar={googleCalendarUrl()} />
        </div>
      </Reveal>
    </section>
  )
}

export function DressCode() {
  const d = WEDDING.dressCode
  return (
    <section aria-label="Dress code" className="relative overflow-hidden pb-14">
      <Butterflies count={2} seed={9} className="top-40" />
      <HangingWisteria className="h-40 w-full sm:h-48" />
      <Reveal className="mx-auto -mt-6 max-w-lg px-6 text-center">
        <Heading>Dress Code</Heading>
        <p className="mt-2 font-serif text-3xl italic text-brand">{d.title}</p>
        <p className="mx-auto mt-4 max-w-sm italic leading-relaxed text-ink/85">{d.text}</p>
        <DressCodeArt className="mx-auto mt-6 w-[min(80vw,300px)]" />
        <ul className="mt-6 flex flex-wrap justify-center gap-4" aria-label="Suggested colours">
          {d.palette.map((p) => (
            <li key={p.name} className="flex flex-col items-center gap-1.5">
              <span className="h-9 w-9 rounded-full shadow-[inset_0_-3px_6px_rgb(0_0_0/0.15),0_3px_8px_-3px_rgb(var(--c-ink)/0.5)] ring-2 ring-white" style={{ background: p.hex }} />
              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-ink/75">{p.name}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

export function OurStory() {
  return (
    <section aria-label="Our story" className="relative overflow-hidden px-4 py-8">
      <Butterflies count={2} seed={13} />
      <Reveal className="relative mx-auto w-[min(92vw,380px)]">
        <FloralArch className="w-full" />
        <Twinkles count={7} seed={11} className="inset-x-[15%] top-[15%]" color="#fbeef1" />
        <div className="absolute inset-x-[19%] top-[22%] bottom-[6%] flex flex-col items-center text-center">
          <Heading className="text-4xl">Our Story</Heading>
          {WEDDING.story.map((p) => (
            <p key={p} className="mt-3 text-[0.95rem] italic leading-relaxed text-ink/85">
              {p}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export function Timeline() {
  return (
    <section id="timeline" className="px-4 py-14">
      <Reveal className="mx-auto max-w-md text-center">
        <Heading>Timeline</Heading>
      </Reveal>
      <ol className="relative mx-auto mt-10 max-w-md">
        <span className="absolute bottom-4 left-[5.5rem] top-4 border-l-2 border-dotted border-ink/40 sm:left-[6.5rem]" aria-hidden />
        {WEDDING.timeline.map((t, i) => (
          <li key={t.time}>
            <Reveal className="relative grid grid-cols-[4.5rem_1fr] items-center gap-8 py-4 sm:grid-cols-[5.5rem_1fr]">
              <span className="bob justify-self-center" style={{ animationDelay: `${-i * 0.7}s` }}>
                <TimelineIcon name={t.icon} className="h-16 w-16 sm:h-20 sm:w-20" />
              </span>
              <span className="absolute left-[5.5rem] top-1/2 h-3 w-3 -translate-x-[5px] -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-brand/40 sm:left-[6.5rem]" aria-hidden />
              <div>
                <p className="font-serif text-xl text-ink">{t.time}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-brand">{t.label}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="mx-auto mt-8 max-w-md text-center">
        <p className="italic leading-relaxed text-ink/85">{WEDDING.timelineNote}</p>
      </Reveal>
    </section>
  )
}

export function DayAfter() {
  const d = WEDDING.dayAfter
  const calendar = extraCalendarUrl({
    id: "day-after",
    title: `${d.title} · ${EVENT.honoree}`,
    start: d.start,
    durationHours: d.durationHours,
    location: `${d.venue}, ${d.address}`,
  })
  return (
    <section aria-label={d.title} className="relative overflow-hidden px-4 py-12">
      <Butterflies count={1} seed={17} className="top-1/3" />
      <WisteriaGarland className="mx-auto block w-full max-w-3xl" seed={31} />
      <Reveal className="mx-auto max-w-md text-center">
        <Heading>{d.title}</Heading>
        <div className="mt-2">
          <Eyebrow>{d.eyebrow}</Eyebrow>
        </div>
        <Townhouse className="mx-auto mt-6 w-[min(70vw,260px)]" />
        <p className="mt-6 font-serif text-3xl text-ink">{d.venue}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-ink/80">{d.detail}</p>
        <p className="mt-4 italic text-ink/85">
          {d.dateLabel} <span className="mx-2 text-brand">·</span> {d.timeLabel}
        </p>
        <p className="mt-3 text-sm text-ink/90">{d.address}</p>
        <p className="mx-auto mt-5 max-w-sm italic leading-relaxed text-ink/85">{d.text}</p>
        <LinkButtons maps={mapsUrl(d.mapsQuery)} calendar={calendar} />
      </Reveal>
    </section>
  )
}

export function Gifts() {
  const g = WEDDING.gifts
  return (
    <section aria-label="Gifts" className="px-6 py-14">
      <Reveal className="relative mx-auto max-w-sm">
        <div className="relative border-[3px] border-double border-[#c9a874]/80 bg-white/60 px-8 pb-10 pt-14 text-center shadow-[0_24px_50px_-30px_rgb(var(--c-ink)/0.5)]">
          <span className="absolute -top-8 left-1/2 w-28 -translate-x-1/2">
            <RibbonBow className="bob w-full" />
          </span>
          <RoseVine className="absolute -left-5 top-6 h-[85%] w-7" height={300} seed={12} />
          <Heading>{g.title}</Heading>
          <p className="mt-4 italic leading-relaxed text-ink/85">{g.text}</p>
        </div>
      </Reveal>
    </section>
  )
}
