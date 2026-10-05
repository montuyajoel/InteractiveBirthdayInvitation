import { SUPABASE } from "@/config"

export const supabaseConfigured = Boolean(SUPABASE.url && SUPABASE.anonKey)

export function supabaseHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SUPABASE.anonKey,
    Authorization: `Bearer ${SUPABASE.anonKey}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

export function supabaseUrl(path: string) {
  return `${SUPABASE.url.replace(/\/$/, "")}${path}`
}
