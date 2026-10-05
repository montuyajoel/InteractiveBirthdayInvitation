// Vercel serverless function: POST /api/send-invitations
// Emails the invitation to registered guests chosen by a host.
//
// Body: { passcode: string, emails: string[] }  (at most 10 per request)
// The hosts' password is checked by the database (guest_list), and mail is
// only ever sent to addresses that are actually registered.
//
// Env (Vercel → Settings → Environment Variables):
//   GMAIL_USER          the Gmail address to send from
//   GMAIL_APP_PASSWORD  a Google app password for that account (not the normal password)
//   EMAIL_FROM_NAME     optional sender name, default "Chelsea's 16th Birthday"
//   SITE_URL            optional, e.g. https://chelsea16.vercel.app (defaults to the request's site)
//   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY  same as the website
import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"
import { REGISTRATIONS } from "../src/config.js"
import { invitationEmail, type InvitationGuest } from "./_lib/invitationEmail.js"

export const config = { maxDuration: 60 }

export const MAX_PER_REQUEST = 10

type Deps = {
  env: Record<string, string | undefined>
  fetch: typeof fetch
  createTransport: (env: Record<string, string | undefined>) => Transporter
}

const json = (status: number, body: unknown) => Response.json(body, { status })

export async function handleSend(request: Request, deps: Deps): Promise<Response> {
  let body: { passcode?: unknown; emails?: unknown }
  try {
    body = await request.json()
  } catch {
    return json(400, { error: "bad-request" })
  }
  const passcode = typeof body.passcode === "string" ? body.passcode : ""
  const emails = Array.isArray(body.emails) ? body.emails.filter((e): e is string => typeof e === "string") : []
  if (!passcode || emails.length === 0) return json(400, { error: "bad-request" })
  if (emails.length > MAX_PER_REQUEST) return json(400, { error: "too-many", max: MAX_PER_REQUEST })

  const { env } = deps
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) return json(500, { error: "email-not-configured" })

  const supabaseUrl = (env.VITE_SUPABASE_URL || REGISTRATIONS.url).replace(/\/$/, "")
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || REGISTRATIONS.key
  const rpc = (name: string, args: unknown) =>
    deps.fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        ...(supabaseKey.startsWith("eyJ") ? { Authorization: `Bearer ${supabaseKey}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    })

  // The password check happens here, in the database.
  const listRes = await rpc("guest_list", { passcode })
  if (!listRes.ok) {
    const detail = await listRes.text().catch(() => "")
    if (detail.includes("invalid passcode")) return json(401, { error: "wrong-password" })
    console.error("guest_list failed", listRes.status, detail)
    return json(502, { error: "database" })
  }
  const guests: InvitationGuest[] = await listRes.json()
  const byEmail = new Map(guests.map((g) => [g.email.toLowerCase(), g]))
  const wanted = [...new Set(emails.map((e) => e.toLowerCase()))]
  const notRegistered = wanted.filter((e) => !byEmail.has(e))

  const transport = deps.createTransport(env)
  const siteUrl = env.SITE_URL || new URL(request.url).origin
  const fromName = env.EMAIL_FROM_NAME || "Chelsea's 16th Birthday"
  const sent: string[] = []
  const failed: string[] = []

  for (const email of wanted) {
    const guest = byEmail.get(email)
    if (!guest) continue
    const mail = invitationEmail(guest, siteUrl)
    try {
      await transport.sendMail({
        from: { name: fromName, address: env.GMAIL_USER },
        to: { name: `${guest.first_name} ${guest.last_name}`, address: guest.email },
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        attachments: [
          {
            filename: "invitation.ics",
            content: mail.ics,
            contentType: "text/calendar; charset=utf-8; method=PUBLISH",
          },
        ],
      })
      sent.push(email)
    } catch (err) {
      console.error("send failed", email, err)
      failed.push(email)
    }
  }

  if (sent.length > 0) {
    const mark = await rpc("mark_invites_sent", { passcode, emails: sent })
    if (!mark.ok) console.error("mark_invites_sent failed", mark.status, await mark.text().catch(() => ""))
  }

  return json(200, { sent, failed, notRegistered })
}

export function POST(request: Request) {
  return handleSend(request, {
    env: process.env,
    fetch,
    createTransport: (env) =>
      nodemailer.createTransport({
        service: "gmail",
        auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
      }),
  })
}
