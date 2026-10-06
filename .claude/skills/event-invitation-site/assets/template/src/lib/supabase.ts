export type SupabaseProject = { url: string; key: string }

export const isConfigured = (p: SupabaseProject) => Boolean(p.url && p.key)

export function supabaseHeaders(p: SupabaseProject, extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: p.key,
    // Legacy anon keys are JWTs and go in Authorization too; new
    // sb_publishable_ keys only belong in the apikey header.
    ...(p.key.startsWith("eyJ") ? { Authorization: `Bearer ${p.key}` } : {}),
    "Content-Type": "application/json",
    ...extra,
  }
}

export function supabaseUrl(p: SupabaseProject, path: string) {
  return `${p.url.replace(/\/$/, "")}${path}`
}
