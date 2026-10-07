import { useEffect, useState } from "react"
import { CalendarPlus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar"
import { Heart, Sparkle } from "./Decor"

function remaining(now: number) {
  const ms = Math.max(0, EVENT.start.getTime() - now)
  return {
    done: ms === 0,
    units: [
      { label: "Days", value: Math.floor(ms / 86_400_000) },
      { label: "Hours", value: Math.floor(ms / 3_600_000) % 24 },
      { label: "Minutes", value: Math.floor(ms / 60_000) % 60 },
      { label: "Seconds", value: Math.floor(ms / 1000) % 60 },
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
    <section aria-label="Countdown" className="relative border-y border-brand/25 bg-white/55">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[auto_1fr_auto] md:gap-12">
        <div className="relative">
          <p className="script foil -rotate-6 text-5xl sm:text-6xl">
            {fill(COPY.surprise ? COPY.surpriseHeadline : COPY.saveTheDate)}
          </p>
          <Heart className="absolute -right-2 -bottom-4 h-5 w-5" />
        </div>

        {done ? (
          <p className="text-center text-2xl uppercase tracking-[0.25em] text-ink">It's party time!</p>
        ) : (
          <ol className="grid grid-cols-4 divide-x divide-brand/30" aria-live="off">
            {units.map((u) => (
              <li key={u.label} className="px-2 text-center">
                <span className="block font-serif text-4xl tabular-nums text-ink sm:text-5xl">
                  {String(u.value).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.25em] text-brand sm:text-xs">
                  {u.label}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-wrap gap-2 md:flex-col">
          <Button asChild variant="ghost" className="justify-start gap-2 rounded-none text-ink hover:bg-highlight/60">
            <a href={googleCalendarUrl()} target="_blank" rel="noreferrer">
              <CalendarPlus /> Google Calendar
            </a>
          </Button>
          <Button variant="ghost" className="justify-start gap-2 rounded-none text-ink hover:bg-highlight/60" onClick={downloadIcs}>
            <Download /> Apple / Outlook (.ics)
          </Button>
        </div>
      </div>
      <Sparkle className="absolute right-6 top-4 h-6 w-6 animate-twinkle" />
      <Sparkle className="absolute left-8 bottom-6 h-4 w-4 animate-twinkle text-brand" style={{ animationDelay: "-1.5s" }} />
      <p className="sr-only">Event starts {EVENT.start.toString()}</p>
    </section>
  )
}
