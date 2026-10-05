// Event wording and calendar data shared by the website and the invitation
// email (api/send-invitations.ts), so both always say the same thing.
import { EVENT } from "../config"

const opts = { timeZone: EVENT.timeZone }

export const eventDateLabel = EVENT.start.toLocaleDateString("en-US", {
  ...opts,
  weekday: "long",
  month: "long",
  day: "numeric",
})
export const eventDateLongLabel = EVENT.start.toLocaleDateString("en-US", {
  ...opts,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
})
export const eventTimeLabel = EVENT.start.toLocaleTimeString("en-US", {
  ...opts,
  hour: "numeric",
  minute: "2-digit",
})

export const eventTitle = `${EVENT.celebrant}'s Surprise ${EVENT.age}th Birthday`
export const eventLocation = [EVENT.venue, EVENT.address].filter(Boolean).join(", ")
export const directionsUrl = EVENT.mapsShareUrl

const end = () => new Date(EVENT.start.getTime() + EVENT.durationHours * 3600_000)
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
const details = `Shhh... it's a surprise! Directions: ${EVENT.mapsShareUrl}`

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle,
    dates: `${stamp(EVENT.start)}/${stamp(end())}`,
    ctz: EVENT.timeZone,
    location: eventLocation,
    details,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

// RFC 5545 text escaping
const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")

export function icsContent() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//chelsea16//invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:chelsea16-${stamp(EVENT.start)}@invite`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(EVENT.start)}`,
    `DTEND:${stamp(end())}`,
    `SUMMARY:${esc(eventTitle)}`,
    `LOCATION:${esc(eventLocation)}`,
    `DESCRIPTION:${esc(details)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(eventTitle)} is tomorrow`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
