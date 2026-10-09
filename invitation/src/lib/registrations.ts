import { EVENT, REGISTRATIONS } from "@/config"
import { isConfigured, supabaseHeaders, supabaseUrl } from "@/lib/supabase"

export const registrationsConnected = isConfigured(REGISTRATIONS)

export type Registration = {
  firstName: string
  lastName: string
  email: string
  wishes: string
  // ticked "I'd love to be a Ninong/Ninang"
  sponsor: boolean
}

export class AlreadyRegisteredError extends Error {}

const LOCAL_KEY = `${EVENT.id}.registrations`

export async function submitRegistration(r: Registration): Promise<void> {
  if (registrationsConnected) {
    const res = await fetch(supabaseUrl(REGISTRATIONS, `/rest/v1/${REGISTRATIONS.table}`), {
      method: "POST",
      headers: supabaseHeaders(REGISTRATIONS, { Prefer: "return=minimal" }),
      body: JSON.stringify({
        first_name: r.firstName,
        last_name: r.lastName,
        email: r.email.toLowerCase(),
        wishes: r.wishes,
        // Only sent when ticked (the column defaults to false).
        ...(r.sponsor ? { ninong_ninang: true } : {}),
      }),
    })
    if (res.status === 409) throw new AlreadyRegisteredError()
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error(`Supabase rejected the registration (${res.status}):`, detail)
      throw new Error(`Registration failed (${res.status})`)
    }
    return
  }

  // Preview mode: no database yet, keep the RSVP in this browser.
  await new Promise((resolve) => setTimeout(resolve, 600))
  try {
    const saved: Registration[] = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]")
    if (saved.some((s) => s.email.toLowerCase() === r.email.toLowerCase())) {
      throw new AlreadyRegisteredError()
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify([...saved, r]))
  } catch (err) {
    if (err instanceof AlreadyRegisteredError) throw err
    // Storage can be unavailable (private mode, sandboxed previews); the RSVP
    // still "succeeds" visually in preview mode.
  }
}

// ---------------------------------------------------------------------------
// Hosts-only guest list. The password is checked by this event's
// `<table>_guest_list` database function (supabase/setup.sql), never in the
// browser.

/** This event's database functions are named after its table. */
const rpc = (name: string) => supabaseUrl(REGISTRATIONS, `/rest/v1/rpc/${REGISTRATIONS.table}_${name}`)

export type GuestListEntry = {
  first_name: string
  last_name: string
  email: string
  wishes: string
  created_at: string
  invite_sent_at?: string | null
  // ticked "I'd love to be a Ninong/Ninang"
  ninong_ninang?: boolean
  invite_count?: number
  last_invite_status?: "sent" | "failed" | null
  last_invite_error?: string | null
  last_invite_at?: string | null
}

/** One row of the invite_log table: a single send attempt. */
export type InviteLogEntry = {
  email: string
  guest_name: string
  status: "sent" | "failed"
  error: string | null
  message_id: string | null
  sent_at: string
}

export class InviteLogNotSetUpError extends Error {}

/** Every send attempt, newest first. */
export async function fetchInviteHistory(passcode: string): Promise<InviteLogEntry[]> {
  const res = await fetch(rpc("invite_history"), {
    method: "POST",
    headers: supabaseHeaders(REGISTRATIONS),
    body: JSON.stringify({ passcode }),
  })
  if (res.ok) return res.json()

  const detail = await res.text().catch(() => "")
  if (detail.includes("invalid passcode") || detail.includes("28P01")) throw new WrongPasswordError()
  if (res.status === 404 || detail.includes("PGRST202")) throw new InviteLogNotSetUpError()
  console.error(`Supabase rejected the invite history request (${res.status}):`, detail)
  throw new Error(`Could not load the invite history (${res.status})`)
}

export class WrongPasswordError extends Error {}
export class GuestListNotSetUpError extends Error {}

export async function fetchGuestList(passcode: string): Promise<GuestListEntry[]> {
  const res = await fetch(rpc("guest_list"), {
    method: "POST",
    headers: supabaseHeaders(REGISTRATIONS),
    body: JSON.stringify({ passcode }),
  })
  if (res.ok) return res.json()

  const detail = await res.text().catch(() => "")
  if (detail.includes("invalid passcode") || detail.includes("28P01")) throw new WrongPasswordError()
  if (res.status === 404 || detail.includes("PGRST202")) throw new GuestListNotSetUpError()
  console.error(`Supabase rejected the guest list request (${res.status}):`, detail)
  throw new Error(`Could not load the guest list (${res.status})`)
}

// ---------------------------------------------------------------------------
// Invitation emails, sent by the server function api/send-invitations.ts.

export class EmailNotConfiguredError extends Error {}
/** No email function here: local dev server or the single-file preview. */
export class SendingUnavailableError extends Error {}
/** The email function exists but didn't answer properly. */
export class SendFunctionError extends Error {
  status: number
  constructor(status: number) {
    super(`Email function error (${status})`)
    this.status = status
  }
}

const isLocalPreview = () =>
  location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)

const SEND_BATCH = 10

/** Emails the invitation to these registered guests, 10 per request. */
export async function sendInvitations(
  passcode: string,
  emails: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<{ sent: string[]; failed: string[]; errors: Record<string, string> }> {
  const sent: string[] = []
  const failed: string[] = []
  const errors: Record<string, string> = {}
  for (let i = 0; i < emails.length; i += SEND_BATCH) {
    const batch = emails.slice(i, i + SEND_BATCH)
    let res: Response
    try {
      res = await fetch("/api/send-invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, emails: batch }),
      })
    } catch {
      if (isLocalPreview()) throw new SendingUnavailableError()
      throw new SendFunctionError(0)
    }
    if (!res.headers.get("content-type")?.includes("json")) {
      // Local servers answer with the web page; on Vercel this means the
      // function is missing (404) or crashed (500).
      if (isLocalPreview()) throw new SendingUnavailableError()
      console.error("send-invitations answered", res.status, await res.text().catch(() => ""))
      throw new SendFunctionError(res.status)
    }
    const body = await res.json().catch(() => ({}))
    if (res.status === 401) throw new WrongPasswordError()
    if (body.error === "email-not-configured") throw new EmailNotConfiguredError()
    if (!res.ok) throw new Error(`Sending failed (${res.status})`)
    sent.push(...body.sent)
    failed.push(...body.failed)
    Object.assign(errors, body.errors ?? {})
    onProgress?.(Math.min(i + SEND_BATCH, emails.length), emails.length)
  }
  return { sent, failed, errors }
}
