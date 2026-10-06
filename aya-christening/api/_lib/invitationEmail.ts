// The invitation email sent to registered guests. Email clients ignore most
// modern CSS, so this is table-based HTML with inline styles.
import { COPY, EVENT } from "../../src/config.js"
import { THEME } from "../../src/theme.js"
import {
  directionsUrl,
  eventDateLongLabel,
  churchName,
  eventLocation,
  eventTimeLabel,
  eventTitle,
  fill,
  googleCalendarUrl,
  plainTitle,
  icsContent,
} from "../../src/lib/event.js"

export type InvitationGuest = {
  first_name: string
  last_name: string
  email: string
  wishes: string
  // ticked "I'd love to be a Ninong/Ninang" (missing on older databases)
  ninong_ninang?: boolean
}

// Email clients ignore CSS variables, so the theme's hex values go in directly.
const C = {
  page: THEME.colors.paper,
  card: "#ffffff",
  ink: THEME.colors.ink,
  brand: THEME.colors.brand,
  soft: THEME.colors.soft,
  highlight: THEME.colors.highlight,
  line: THEME.colors.soft,
}
const SERIF = THEME.fonts.emailSerif

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function button(href: string, label: string, primary: boolean) {
  const bg = primary ? C.ink : C.card
  const fg = primary ? "#ffffff" : C.ink
  return `<a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;margin:4px;padding:12px 22px;background:${bg};color:${fg};border:1px solid ${C.ink};font-family:${SERIF};font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">${label}</a>`
}

function detailRow(label: string, value: string, sub?: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.brand};width:120px;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:16px;color:${C.ink};vertical-align:top;">${value}${
      sub ? `<br><span style="font-size:13px;color:${C.brand};">${sub}</span>` : ""
    }</td>
  </tr>`
}

export function invitationEmail(guest: InvitationGuest, siteUrl: string) {
  const first = escapeHtml(guest.first_name)
  const subject = `Your seat is confirmed: ${eventTitle}`
  const preheader = `See you on ${eventDateLongLabel} at ${eventTimeLabel}.${COPY.surprise ? ` ${fill(COPY.surpriseHeadline)}` : ""}`
  const site = siteUrl.replace(/\/$/, "")

  const venue = [
    `<span style="font-size:13px;color:${C.brand};">${escapeHtml(COPY.churchLabel)}</span>`,
    `<strong style="font-weight:normal;">${escapeHtml(churchName)}</strong>`,
    `<span style="display:inline-block;margin-top:8px;font-size:13px;color:${C.brand};">${escapeHtml(COPY.receptionLabel)}</span>`,
    `<strong style="font-weight:normal;">${escapeHtml(EVENT.venue)}</strong>`,
    EVENT.address ? `<span style="font-size:14px;color:${C.brand};">${escapeHtml(EVENT.address)}</span>` : "",
  ]
    .filter(Boolean)
    .join("<br>")

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border:1px solid ${C.line};">
    <tr><td align="center" style="padding:36px 32px 8px;">
      <p style="margin:0;font-family:${SERIF};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.brand};">${escapeHtml(fill([COPY.invitedLine, COPY.kicker].filter(Boolean).join(" ")))}</p>
      <h1 style="margin:10px 0 0;font-family:${SERIF};font-size:34px;font-weight:normal;font-style:italic;color:${C.brand};">${escapeHtml(plainTitle(COPY.title))}</h1>
      <p style="margin:8px 0 0;font-family:${SERIF};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.brand};">${escapeHtml(fill(COPY.celebrationFor))}</p>
      <p style="margin:6px 0 0;font-family:${SERIF};font-size:28px;font-style:italic;color:${C.ink};">${escapeHtml(EVENT.honoree)}</p>
      <p style="margin:14px 0 0;font-size:18px;color:${C.brand};">&#9825;</p>
    </td></tr>

    <tr><td style="padding:12px 32px 0;">
      <img src="${site}/email/invitation-card.jpg" width="496" alt="${escapeHtml(eventTitle)} invitation" style="display:block;width:100%;max-width:496px;height:auto;border:0;">
    </td></tr>

    <tr><td style="padding:28px 32px 0;font-family:${SERIF};color:${C.ink};">
      <p style="margin:0;font-size:18px;">Dear ${first},</p>
      <p style="margin:14px 0 0;font-size:16px;line-height:1.6;">
        ${escapeHtml(fill(COPY.emailIntro))}
      </p>
    </td></tr>

    <tr><td style="padding:22px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};">
        ${detailRow("When", escapeHtml(eventDateLongLabel), `${escapeHtml(eventTimeLabel)} (${escapeHtml(EVENT.timeZoneLabel)})`)}
        ${EVENT.arriveBy ? detailRow("Arrive by", escapeHtml(EVENT.arriveBy), escapeHtml(fill(COPY.arriveByNote))) : ""}
        ${detailRow("Where", venue)}
        ${detailRow("Guest", `${first} ${escapeHtml(guest.last_name)}`)}
      </table>
    </td></tr>

    <tr><td align="center" style="padding:24px 24px 0;">
      ${button(directionsUrl, "Get directions", true)}
      ${button(googleCalendarUrl(), "Add to Google Calendar", false)}
      <p style="margin:10px 0 0;font-family:${SERIF};font-size:13px;font-style:italic;color:${C.brand};">
        Using Apple Calendar or Outlook? Open the attached <strong>invitation.ics</strong>.
      </p>
    </td></tr>

    ${
      COPY.surprise
        ? `<tr><td style="padding:26px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.highlight};">
        <tr><td align="center" style="padding:18px 20px;font-family:${SERIF};">
          <p style="margin:0;font-size:22px;font-style:italic;color:${C.brand};">${escapeHtml(fill(COPY.surpriseHeadline))}</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:1.5;color:${C.ink};">${escapeHtml(fill(COPY.surpriseNote))}</p>
        </td></tr>
      </table>
    </td></tr>`
        : ""
    }

    ${
      guest.wishes
        ? `<tr><td style="padding:24px 32px 0;font-family:${SERIF};">
      <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.brand};">${escapeHtml(fill(COPY.emailWishLabel))}</p>
      <p style="margin:8px 0 0;padding-left:14px;border-left:2px solid ${C.line};font-size:15px;font-style:italic;line-height:1.6;color:${C.ink};">“${escapeHtml(guest.wishes)}”</p>
    </td></tr>`
        : ""
    }

    ${
      guest.ninong_ninang
        ? `<tr><td style="padding:24px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.highlight};">
        <tr><td align="center" style="padding:16px 20px;font-family:${SERIF};font-size:15px;font-style:italic;line-height:1.5;color:${C.ink};">
          &#10013; ${escapeHtml(fill(COPY.emailSponsorNote))}
        </td></tr>
      </table>
    </td></tr>`
        : ""
    }

    <tr><td align="center" style="padding:30px 32px 34px;font-family:${SERIF};">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.brand};">${escapeHtml(fill(COPY.footerLine))} &#9829;</p>
      <p style="margin:12px 0 0;font-size:13px;color:${C.brand};">
        <a href="${site}/" style="color:${C.ink};">Visit the invitation site</a> to see the photo gallery and share your own photos.
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`

  const text = [
    `Dear ${guest.first_name},`,
    "",
    fill(COPY.emailIntro),
    "",
    `When: ${eventDateLongLabel}, ${eventTimeLabel} (${EVENT.timeZoneLabel})`,
    EVENT.arriveBy ? `Arrive by: ${EVENT.arriveBy}` : null,
    `Where: ${eventLocation}`,
    `Directions: ${directionsUrl}`,
    `Add to Google Calendar: ${googleCalendarUrl()}`,
    "",
    COPY.surprise ? `${fill(COPY.surpriseHeadline)} ${fill(COPY.surpriseNote)}` : null,
    guest.ninong_ninang ? fill(COPY.emailSponsorNote) : null,
    "",
    `We can't wait to celebrate with you. ${site}/`,
  ]
    .filter((line) => line !== null)
    .join("\n")

  return { subject, html, text, ics: icsContent() }
}
