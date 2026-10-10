// Vercel serverless function: POST /api/send-confirmation
// Sends ONE sample confirmation email for one of the showcase's events to the
// visitor who just registered, so they can see what guests receive.
//
// Body: { event: "birthday" | "wedding" | "graduation" | "christening",
//         firstName: string, lastName: string, email: string }
//
// Because anyone can call this, the email's content is fixed: only the
// guest's name goes in (letters only, short), their wish is left out, and
// sends are throttled per visitor and per address.
//
// Env (Vercel → Settings → Environment Variables):
//   GMAIL_USER          the Gmail address to send from
//   GMAIL_APP_PASSWORD  a Google app password for that account
//   SITE_URL            optional, e.g. https://celebrations.vercel.app (defaults to the request's site)
import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"
import * as birthday from "../sites/birthday/api/_lib/invitationEmail.js"
import * as wedding from "../sites/wedding/api/_lib/invitationEmail.js"
import * as graduation from "../sites/graduation/api/_lib/invitationEmail.js"
import * as christening from "../sites/christening/api/_lib/invitationEmail.js"
import { COPY as birthdayCopy } from "../sites/birthday/src/config.js"
import { COPY as weddingCopy } from "../sites/wedding/src/config.js"
import { COPY as graduationCopy } from "../sites/graduation/src/config.js"
import { COPY as christeningCopy } from "../sites/christening/src/config.js"
import { fill as birthdayFill } from "../sites/birthday/src/lib/event.js"
import { fill as weddingFill } from "../sites/wedding/src/lib/event.js"
import { fill as graduationFill } from "../sites/graduation/src/lib/event.js"
import { fill as christeningFill } from "../sites/christening/src/lib/event.js"

export const config = { maxDuration: 30 }

const EVENTS = {
  birthday: { email: birthday.invitationEmail, from: birthdayFill(birthdayCopy.emailFromName) },
  wedding: { email: wedding.invitationEmail, from: weddingFill(weddingCopy.emailFromName) },
  graduation: { email: graduation.invitationEmail, from: graduationFill(graduationCopy.emailFromName) },
  christening: { email: christening.invitationEmail, from: christeningFill(christeningCopy.emailFromName) },
} as const

const NAME = /^[\p{L}][\p{L}\p{M} .'-]{0,39}$/u
const EMAIL = /^[^\s@<>()",;:]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/

// Best-effort limits, per server instance (enough to stop casual abuse of a demo).
const HOUR = 60 * 60 * 1000
const LIMITS = { perVisitor: 5, perAddress: 3, perInstance: 200 }
const hits = new Map<string, number[]>()

function allow(key: string, max: number, now: number) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 24 * HOUR)
  const window = key.startsWith("ip:") ? recent.filter((t) => now - t < HOUR) : recent
  if (window.length >= max) return false
  recent.push(now)
  hits.set(key, recent)
  return true
}

type Deps = {
  env: Record<string, string | undefined>
  createTransport: (env: Record<string, string | undefined>) => Transporter
  now?: number
}

const json = (status: number, body: unknown) => Response.json(body, { status })

export async function handleConfirmation(request: Request, deps: Deps): Promise<Response> {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(400, { error: "bad-request" })
  }
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "")
  const slug = str("event") as keyof typeof EVENTS
  const firstName = str("firstName")
  const lastName = str("lastName")
  const email = str("email").toLowerCase()
  if (!(slug in EVENTS) || !NAME.test(firstName) || !NAME.test(lastName) || !EMAIL.test(email)) {
    return json(400, { error: "bad-request" })
  }
  if (email.endsWith("@example.com")) return json(400, { error: "bad-request" })

  const { env } = deps
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) return json(500, { error: "email-not-configured" })

  const now = deps.now ?? Date.now()
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"
  if (
    !allow("all", LIMITS.perInstance, now) ||
    !allow(`ip:${ip}`, LIMITS.perVisitor, now) ||
    !allow(`to:${email}`, LIMITS.perAddress, now)
  ) {
    return json(429, { error: "rate-limited" })
  }

  const event = EVENTS[slug]
  const site = `${(env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "")}/${slug}`
  const mail = event.email({ first_name: firstName, last_name: lastName, email, wishes: "" }, site)
  try {
    const info = await deps.createTransport(env).sendMail({
      from: { name: `${event.from} (sample)`, address: env.GMAIL_USER },
      to: { name: `${firstName} ${lastName}`, address: email },
      subject: `[Sample] ${mail.subject}`,
      html: mail.html,
      text: mail.text,
      attachments: [
        { filename: "invitation.ics", content: mail.ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" },
      ],
    })
    return json(200, { sent: true, messageId: info?.messageId ?? null })
  } catch (err) {
    console.error("sample send failed", err)
    return json(502, { error: "send-failed" })
  }
}

export function POST(request: Request) {
  return handleConfirmation(request, {
    env: process.env,
    createTransport: (env) =>
      nodemailer.createTransport({ service: "gmail", auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD } }),
  })
}
