// Event wording and calendar data shared by the website and the invitation
// email (api/send-invitations.ts), so both always say the same thing.
import { COPY, EVENT } from "../config.js"

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

/** Fills {name}, {honoree}, {time} and {date} in a COPY string. */
export function fill(text: string): string {
  return text
    .replace(/\{name\}/g, EVENT.honoreeShort)
    .replace(/\{honoree\}/g, EVENT.honoree)
    .replace(/\{time\}/g, eventTimeLabel)
    .replace(/\{date\}/g, eventDateLabel)
}

/** Plain-text version of a COPY title: fills placeholders, drops ^…^ marks. */
export const plainTitle = (text: string) => fill(text).replace(/\^(.*?)\^/g, "$1")

export const eventTitle = plainTitle(COPY.eventTitle)
/** The church, or "Church to be announced" while it isn't set. */
export const churchName = EVENT.church || fill(COPY.churchTba)
const reception = [EVENT.venue, EVENT.address].filter(Boolean).join(", ")
/** For calendar invites and the plain-text email: church, then reception. */
export const eventLocation = EVENT.church
  ? `${EVENT.church}; ${COPY.receptionLabel.toLowerCase()} at ${reception}`
  : `${reception} (${COPY.receptionLabel.toLowerCase()}); ${fill(COPY.churchTba).toLowerCase()}`
export const directionsUrl = EVENT.mapsShareUrl

const end = () => new Date(EVENT.start.getTime() + EVENT.durationHours * 3600_000)
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
const details = `${COPY.surprise ? `${fill(COPY.surpriseHeadline)} ` : ""}Directions: ${EVENT.mapsShareUrl}`

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
const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")

export function icsContent() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${EVENT.id}//invite//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${EVENT.id}-${stamp(EVENT.start)}@invite`,
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
