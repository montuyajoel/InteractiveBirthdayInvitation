// The invitation email sent to registered guests. Email clients ignore most
// modern CSS, so this is table-based HTML with inline styles.
import { EVENT } from "../../src/config.js"
import {
  directionsUrl,
  eventDateLongLabel,
  eventLocation,
  eventTimeLabel,
  eventTitle,
  googleCalendarUrl,
  icsContent,
} from "../../src/lib/event.js"

export type InvitationGuest = { first_name: string; last_name: string; email: string; wishes: string }

const C = {
  page: "#f6eef8",
  card: "#ffffff",
  plum: "#5c3a63",
  mauve: "#9a6aa0",
  lilac: "#efe1f4",
  blush: "#f9e6ef",
  line: "#e6d5ec",
}
const SERIF = "Georgia, 'Times New Roman', serif"

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function button(href: string, label: string, primary: boolean) {
  const bg = primary ? C.plum : C.card
  const fg = primary ? "#ffffff" : C.plum
  return `<a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;margin:4px;padding:12px 22px;background:${bg};color:${fg};border:1px solid ${C.plum};font-family:${SERIF};font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">${label}</a>`
}

function detailRow(label: string, value: string, sub?: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.mauve};width:120px;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:16px;color:${C.plum};vertical-align:top;">${value}${
      sub ? `<br><span style="font-size:13px;color:${C.mauve};">${sub}</span>` : ""
    }</td>
  </tr>`
}

export function invitationEmail(guest: InvitationGuest, siteUrl: string) {
  const first = escapeHtml(guest.first_name)
  const celebrantFirst = escapeHtml(EVENT.celebrant.split(" ")[0])
  const subject = `Your seat is confirmed: ${eventTitle}`
  const preheader = `See you on ${eventDateLongLabel} at ${eventTimeLabel}. Shhh… it's a surprise!`
  const site = siteUrl.replace(/\/$/, "")

  const venue = [
    `<strong style="font-weight:normal;">${escapeHtml(EVENT.venue)}</strong>`,
    EVENT.address ? `<span style="font-size:14px;color:${C.mauve};">${escapeHtml(EVENT.address)}</span>` : "",
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
      <p style="margin:0;font-family:${SERIF};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.mauve};">You're invited to a surprise</p>
      <h1 style="margin:10px 0 0;font-family:${SERIF};font-size:34px;font-weight:normal;font-style:italic;color:${C.mauve};">${EVENT.age}th Birthday</h1>
      <p style="margin:8px 0 0;font-family:${SERIF};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.mauve};">Celebration for</p>
      <p style="margin:6px 0 0;font-family:${SERIF};font-size:28px;font-style:italic;color:${C.plum};">${escapeHtml(EVENT.celebrant)}</p>
      <p style="margin:14px 0 0;font-size:18px;color:${C.mauve};">&#9825;</p>
    </td></tr>

    <tr><td style="padding:12px 32px 0;">
      <img src="${site}/email/invitation-card.jpg" width="496" alt="${escapeHtml(eventTitle)} invitation" style="display:block;width:100%;max-width:496px;height:auto;border:0;">
    </td></tr>

    <tr><td style="padding:28px 32px 0;font-family:${SERIF};color:${C.plum};">
      <p style="margin:0;font-size:18px;">Dear ${first},</p>
      <p style="margin:14px 0 0;font-size:16px;line-height:1.6;">
        Your seat is <strong>confirmed</strong>! Thank you for registering. We can't wait to celebrate ${celebrantFirst}'s sweet sixteen with you.
      </p>
    </td></tr>

    <tr><td style="padding:22px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};">
        ${detailRow("When", escapeHtml(eventDateLongLabel), `${escapeHtml(eventTimeLabel)} (${escapeHtml(EVENT.timeZoneLabel)})`)}
        ${EVENT.arriveBy ? detailRow("Arrive by", escapeHtml(EVENT.arriveBy), `So we're all hidden before ${celebrantFirst} walks in`) : ""}
        ${detailRow("Where", venue)}
        ${detailRow("Guest", `${first} ${escapeHtml(guest.last_name)}`)}
      </table>
    </td></tr>

    <tr><td align="center" style="padding:24px 24px 0;">
      ${button(directionsUrl, "Get directions", true)}
      ${button(googleCalendarUrl(), "Add to Google Calendar", false)}
      <p style="margin:10px 0 0;font-family:${SERIF};font-size:13px;font-style:italic;color:${C.mauve};">
        Using Apple Calendar or Outlook? Open the attached <strong>invitation.ics</strong>.
      </p>
    </td></tr>

    <tr><td style="padding:26px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.blush};">
        <tr><td align="center" style="padding:18px 20px;font-family:${SERIF};">
          <p style="margin:0;font-size:22px;font-style:italic;color:${C.mauve};">Shhh… it's a surprise!</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:1.5;color:${C.plum};">Please don't mention the party to ${celebrantFirst}, and hold off on posting until after the big reveal.</p>
        </td></tr>
      </table>
    </td></tr>

    ${
      guest.wishes
        ? `<tr><td style="padding:24px 32px 0;font-family:${SERIF};">
      <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.mauve};">Your birthday wish</p>
      <p style="margin:8px 0 0;padding-left:14px;border-left:2px solid ${C.line};font-size:15px;font-style:italic;line-height:1.6;color:${C.plum};">“${escapeHtml(guest.wishes)}”</p>
    </td></tr>`
        : ""
    }

    <tr><td align="center" style="padding:30px 32px 34px;font-family:${SERIF};">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.mauve};">We can't wait to celebrate with you &#9829;</p>
      <p style="margin:12px 0 0;font-size:13px;color:${C.mauve};">
        <a href="${site}/" style="color:${C.plum};">Visit the invitation site</a> to see the photo gallery and share your own photos.
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
    `Your seat is confirmed for ${eventTitle}!`,
    "",
    `When: ${eventDateLongLabel}, ${eventTimeLabel} (${EVENT.timeZoneLabel})`,
    EVENT.arriveBy ? `Arrive by: ${EVENT.arriveBy}` : null,
    `Where: ${eventLocation}`,
    `Directions: ${directionsUrl}`,
    `Add to Google Calendar: ${googleCalendarUrl()}`,
    "",
    `Shhh… it's a surprise! Please don't mention the party to ${EVENT.celebrant.split(" ")[0]}.`,
    "",
    `We can't wait to celebrate with you. ${site}/`,
  ]
    .filter((line) => line !== null)
    .join("\n")

  return { subject, html, text, ics: icsContent() }
}
