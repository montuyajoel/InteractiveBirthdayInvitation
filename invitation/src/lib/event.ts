// Event wording and calendar data shared by the website and the invitation
// email (api/send-invitations.ts), so both always say the same thing.
import { COPY, EVENT, type Stop } from "../config.js"

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

/** Every place on the day, in order. A single-venue event is one stop. */
export const stops: Stop[] = EVENT.schedule.length
  ? EVENT.schedule
  : [
      {
        label: "",
        time: eventTimeLabel,
        venue: EVENT.venue,
        address: EVENT.address,
        mapsShareUrl: EVENT.mapsShareUrl,
        mapsQuery: EVENT.mapsQuery,
      },
    ]
export const hasSchedule = stops.length > 1
export const stopLocation = (s: Stop) => [s.venue, s.address].filter(Boolean).join(", ")
/** "Ceremony 12:00 noon · Reception 7:00 PM", or just the start time. */
export const eventTimesLabel = hasSchedule ? stops.map((s) => `${s.label} ${s.time}`).join(" · ") : eventTimeLabel

export const eventLocation = stopLocation(stops[0])
export const directionsUrl = stops[0].mapsShareUrl

const end = () => new Date(EVENT.start.getTime() + EVENT.durationHours * 3600_000)
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
const details = [
  COPY.surprise ? fill(COPY.surpriseHeadline) : "",
  ...(hasSchedule
    ? stops.map((s) => `${s.label}: ${s.time}, ${stopLocation(s)}. Directions: ${s.mapsShareUrl}`)
    : [`Directions: ${stops[0].mapsShareUrl}`]),
]
  .filter(Boolean)
  .join("\n")

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
