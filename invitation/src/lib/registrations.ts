import { SUPABASE } from "@/config"
import { supabaseConfigured, supabaseHeaders, supabaseUrl } from "@/lib/supabase"

export type Registration = {
  firstName: string
  lastName: string
  email: string
  wishes: string
}

export class AlreadyRegisteredError extends Error {}

const LOCAL_KEY = "chelsea16.registrations"

export async function submitRegistration(r: Registration): Promise<void> {
  if (supabaseConfigured) {
    const res = await fetch(supabaseUrl(`/rest/v1/${SUPABASE.registrationsTable}`), {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        first_name: r.firstName,
        last_name: r.lastName,
        email: r.email.toLowerCase(),
        wishes: r.wishes,
      }),
    })
    if (res.status === 409) throw new AlreadyRegisteredError()
    if (!res.ok) throw new Error(`Registration failed (${res.status})`)
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
