// Showcase-only "database": sample guests with made-up names, plus anyone
// who registers in this browser (kept in localStorage by registrations.ts).
// Sends to the sample guests are simulated; sends to people who registered
// here go through /api/send-confirmation as a real sample email.
import type { Registration } from "@/lib/registrations"
import { DEMO_PASSWORD, SLUG } from "@/lib/showcase"

// Same key registrations.ts uses (import_sites.py names every site's keys showcase-<slug>).
const LOCAL_KEY = `showcase-${SLUG}.registrations`
const LOG_KEY = `showcase-${SLUG}.demo-invite-log`

// The fields every site's guest list reads (older sites use fewer of them).
export type GuestListEntry = {
  first_name: string
  last_name: string
  email: string
  wishes: string
  created_at: string
  invite_sent_at?: string | null
  invite_count?: number
  last_invite_status?: "sent" | "failed" | null
  last_invite_error?: string | null
  last_invite_at?: string | null
}

export type InviteLogEntry = {
  email: string
  guest_name: string
  status: "sent" | "failed"
  error: string | null
  message_id: string | null
  sent_at: string
}

const WISHES: Record<string, string[]> = {
  birthday: [
    "Happy sweet sixteen! Can't wait to see your face when you walk in.",
    "Sixteen looks good on you. Love you, Bella!",
    "Wishing you the best year yet. See you at the party!",
    "Happy birthday from all of us at the office!",
    "Here's to more adventures together. Happy 16th!",
  ],
  wedding: [
    "Wishing you a lifetime of laughter and love.",
    "Never go to bed angry, and always share dessert.",
    "So happy for you both. See you in Tagaytay!",
    "Cheers to the happy couple!",
    "May your home always be full of friends.",
  ],
  graduation: [
    "Congratulations, Joaquin! All those late nights paid off.",
    "So proud of you. The world is lucky to have you.",
    "On to the next chapter. Congrats!",
    "Engineer na! Congratulations!",
    "We knew you could do it. Congrats, Joaquin!",
  ],
  christening: [
    "May God bless and guide you always, little Gabriel.",
    "Welcome to the family of faith, baby Gabriel!",
    "Praying for a life full of love and joy.",
    "So blessed to be part of your special day.",
    "Love you, little one. See you at church!",
  ],
}

const NAMES: [string, string][] = [
  ["Andrea", "Villanueva"],
  ["Paolo", "Mendoza"],
  ["Camille", "Torres"],
  ["Miguel", "Bautista"],
  ["Trisha", "Aquino"],
]

const daysAgo = (d: number, h = 10) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  t.setHours(h, 15, 0, 0)
  return t.toISOString()
}

export const SAMPLE_GUESTS: GuestListEntry[] = NAMES.map(([first, last], i) => ({
  first_name: first,
  last_name: last,
  email: `${first}.${last}@example.com`.toLowerCase(),
  wishes: (WISHES[SLUG] ?? WISHES.birthday)[i],
  created_at: daysAgo(12 - i * 2, 9 + i),
}))

// Two sample guests already have their confirmation, so the list shows both states.
const SEEDED_LOG: InviteLogEntry[] = SAMPLE_GUESTS.slice(0, 2).map((g, i) => ({
  email: g.email,
  guest_name: `${g.first_name} ${g.last_name}`,
  status: "sent",
  error: null,
  message_id: null,
  sent_at: daysAgo(6 - i, 14),
}))

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback
  } catch {
    return fallback
  }
}

function log(): InviteLogEntry[] {
  return [...read<InviteLogEntry[]>(LOG_KEY, []), ...SEEDED_LOG]
}

function addToLog(entries: InviteLogEntry[]) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify([...entries, ...read<InviteLogEntry[]>(LOG_KEY, [])].slice(0, 200)))
  } catch {
    // storage unavailable: the send still happened, it just isn't remembered
  }
}

const localGuests = (): GuestListEntry[] =>
  read<(Registration & { createdAt?: string })[]>(LOCAL_KEY, []).map((r) => ({
    first_name: r.firstName,
    last_name: r.lastName,
    email: r.email.toLowerCase(),
    wishes: r.wishes,
    created_at: r.createdAt ?? new Date().toISOString(),
  }))

const isSample = (email: string) => SAMPLE_GUESTS.some((g) => g.email === email.toLowerCase())

/** The guest list, or null when the password is wrong. */
export function demoGuestList(passcode: string): GuestListEntry[] | null {
  if (passcode.trim().toLowerCase() !== DEMO_PASSWORD) return null
  const entries = log()
  return [...localGuests().reverse(), ...SAMPLE_GUESTS].map((g) => {
    const mine = entries.filter((e) => e.email === g.email)
    const sent = mine.filter((e) => e.status === "sent")
    const last = mine[0]
    return {
      ...g,
      invite_sent_at: sent[0]?.sent_at ?? null,
      invite_count: sent.length,
      last_invite_status: last?.status ?? null,
      last_invite_error: last?.error ?? null,
      last_invite_at: last?.sent_at ?? null,
    }
  })
}

export function demoInviteHistory(passcode: string): InviteLogEntry[] | null {
  return passcode.trim().toLowerCase() === DEMO_PASSWORD ? log() : null
}

export type SampleSendResult = { ok: true } | { ok: false; error: string }

const ERRORS: Record<string, string> = {
  "email-not-configured": "Email sending isn't switched on for this sample site yet.",
  "rate-limited": "That's a lot of sample emails. Please try again in a while.",
  "bad-request": "Please check the name and email address.",
}

/** Sends one real sample confirmation through the showcase's email function. */
export async function sendSampleConfirmation(g: { firstName: string; lastName: string; email: string }): Promise<SampleSendResult> {
  let res: Response
  try {
    res = await fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: SLUG, firstName: g.firstName, lastName: g.lastName, email: g.email }),
    })
  } catch {
    return { ok: false, error: "Couldn't reach the email service. Please try again." }
  }
  const body = res.headers.get("content-type")?.includes("json") ? await res.json().catch(() => ({})) : {}
  const result: SampleSendResult = res.ok
    ? { ok: true }
    : {
        ok: false,
        error:
          ERRORS[body.error] ??
          (res.status === 404 || !body.error
            ? "Sample emails only go out from the live site, not this preview."
            : "Couldn't send the sample email. Please try again."),
      }
  addToLog([
    {
      email: g.email.toLowerCase(),
      guest_name: `${g.firstName} ${g.lastName}`,
      status: result.ok ? "sent" : "failed",
      error: result.ok ? null : result.error,
      message_id: null,
      sent_at: new Date().toISOString(),
    },
  ])
  return result
}

/** The guest list's "Send" buttons in the sample site. */
export async function demoSend(
  emails: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<{ sent: string[]; failed: string[]; errors: Record<string, string> }> {
  const guests = demoGuestList(DEMO_PASSWORD) ?? []
  const sent: string[] = []
  const failed: string[] = []
  const errors: Record<string, string> = {}
  for (const [i, raw] of emails.entries()) {
    const email = raw.toLowerCase()
    const g = guests.find((x) => x.email === email)
    if (!g) continue
    if (isSample(email)) {
      // Made-up guests: pretend, so nobody gets mail at example.com.
      await new Promise((r) => setTimeout(r, 350))
      addToLog([{ email, guest_name: `${g.first_name} ${g.last_name}`, status: "sent", error: null, message_id: null, sent_at: new Date().toISOString() }])
      sent.push(email)
    } else {
      const r = await sendSampleConfirmation({ firstName: g.first_name, lastName: g.last_name, email })
      if (r.ok) sent.push(email)
      else {
        failed.push(email)
        errors[email] = r.error
      }
    }
    onProgress?.(i + 1, emails.length)
  }
  return { sent, failed, errors }
}
