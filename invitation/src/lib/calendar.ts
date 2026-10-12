import { EVENT } from "@/config"
import { icsContent } from "@/lib/event"

export { googleCalendarUrl } from "@/lib/event"

function download(content: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar" }))
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadIcs() {
  download(icsContent(), `${EVENT.id}-invitation.ics`)
}

// Extra events on the same invitation (e.g. the day-after brunch).
type Extra = { id: string; title: string; start: Date; durationHours: number; location: string }

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
const end = (e: Extra) => new Date(e.start.getTime() + e.durationHours * 3600_000)
const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")

export function extraCalendarUrl(e: Extra) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(end(e))}`,
    ctz: EVENT.timeZone,
    location: e.location,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function downloadExtraIcs(e: Extra) {
  download(
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${EVENT.id}//invite//EN`,
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${EVENT.id}-${e.id}-${stamp(e.start)}@invite`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(end(e))}`,
      `SUMMARY:${esc(e.title)}`,
      `LOCATION:${esc(e.location)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n"),
    `${EVENT.id}-${e.id}.ics`,
  )
}
