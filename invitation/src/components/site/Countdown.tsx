import { useEffect, useState } from "react"
import { CalendarPlus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar"
import { Medallion, PearlRope, WisteriaGarland } from "./Embroidery"
import { Reveal } from "./Reveal"

function remaining(now: number) {
  const ms = Math.max(0, EVENT.start.getTime() - now)
  return {
    done: ms === 0,
    units: [
      { label: "Days", value: Math.floor(ms / 86_400_000) },
      { label: "Hours", value: Math.floor(ms / 3_600_000) % 24 },
      { label: "Minutes", value: Math.floor(ms / 60_000) % 60 },
    ],
  }
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const { done, units } = remaining(now)

  return (
    <section aria-label="Countdown" className="relative overflow-hidden pb-4">
      <WisteriaGarland className="mx-auto block w-full max-w-3xl" seed={8} />
      <Reveal className="mx-auto max-w-xl px-4 text-center">
        <h2 className="font-serif text-5xl text-ink">{fill(COPY.surprise ? COPY.surpriseHeadline : COPY.saveTheDate)}</h2>
        {done ? (
          <p className="mt-8 text-2xl uppercase tracking-[0.25em] text-ink">Today's the day!</p>
        ) : (
          <ol className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4 sm:gap-6" aria-live="off">
            {units.map((u) => (
              <li key={u.label} className="text-center">
                <Medallion>
                  <span className="font-serif text-[clamp(1.6rem,7vw,2.4rem)] tabular-nums text-[#6d4a46]">
                    {String(u.value).padStart(2, "0")}
                  </span>
                </Medallion>
                <span className="mt-2 block text-[0.65rem] uppercase tracking-[0.3em] text-brand">{u.label}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-1">
          <Button asChild variant="ghost" className="gap-2 rounded-none text-xs uppercase tracking-[0.2em] text-ink hover:bg-highlight/60">
            <a href={googleCalendarUrl()} target="_blank" rel="noreferrer">
              <CalendarPlus /> Google Calendar
            </a>
          </Button>
          <Button variant="ghost" className="gap-2 rounded-none text-xs uppercase tracking-[0.2em] text-ink hover:bg-highlight/60" onClick={downloadIcs}>
            <Download /> Apple / Outlook
          </Button>
        </div>
      </Reveal>
      <PearlRope className="mt-10 h-16 sm:h-24" />
      <p className="sr-only">Event starts {EVENT.start.toString()}</p>
    </section>
  )
}
