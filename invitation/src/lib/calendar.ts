import { EVENT } from "@/config"

const end = () => new Date(EVENT.start.getTime() + EVENT.durationHours * 3600_000)
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
const title = () => `${EVENT.celebrant}'s Surprise ${EVENT.age}th Birthday`

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title(),
    dates: `${stamp(EVENT.start)}/${stamp(end())}`,
    location: EVENT.venue,
    details: `Shhh... it's a surprise! Directions: ${EVENT.mapsShareUrl}`,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//chelsea16//invite//EN",
    "BEGIN:VEVENT",
    `UID:chelsea16-${stamp(EVENT.start)}@invite`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(EVENT.start)}`,
    `DTEND:${stamp(end())}`,
    `SUMMARY:${title()}`,
    `LOCATION:${EVENT.venue}`,
    `DESCRIPTION:Shhh... it's a surprise! Directions: ${EVENT.mapsShareUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }))
  const a = document.createElement("a")
  a.href = url
  a.download = "chelsea-16th-birthday.ics"
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
