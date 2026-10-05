import type { Registration } from "@/lib/registrations"

// Remembers who's using this device so they don't have to retype their name.
const ME_KEY = "chelsea16.me"
const UPLOADER_KEY = "chelsea16.uploader"

function read<T>(key: string): T | null {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null")
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode, sandbox): just don't remember
  }
}

export const rememberedGuest = () => read<Registration>(ME_KEY)
export const rememberGuest = (r: Registration | null) => write(ME_KEY, r)

/** Name to prefill on the photo uploader. */
export function rememberedUploaderName(): string {
  const saved = read<string>(UPLOADER_KEY)
  if (saved) return saved
  const me = rememberedGuest()
  return me ? `${me.firstName} ${me.lastName}`.trim() : ""
}
export const rememberUploaderName = (name: string) => write(UPLOADER_KEY, name)
