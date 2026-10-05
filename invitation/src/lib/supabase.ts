import { SUPABASE } from "@/config"

export const supabaseConfigured = Boolean(SUPABASE.url && SUPABASE.anonKey)

export function supabaseHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE.anonKey,
    // Legacy anon keys are JWTs and go in Authorization too; new
    // sb_publishable_ keys only belong in the apikey header.
    ...(SUPABASE.anonKey.startsWith("eyJ") ? { Authorization: `Bearer ${SUPABASE.anonKey}` } : {}),
    "Content-Type": "application/json",
    ...extra,
  }
}

export function supabaseUrl(path: string) {
  return `${SUPABASE.url.replace(/\/$/, "")}${path}`
}
