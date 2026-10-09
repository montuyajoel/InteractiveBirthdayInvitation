// Design tokens: the ONE place colours and fonts live.
// The website applies them as CSS variables at startup (src/main.tsx), and the
// invitation email (api/_lib/invitationEmail.ts) reads the same values, so a
// new look only needs changes here (plus decorations in Decor.tsx if wanted).
//
// Colours are hex. Keep enough contrast between `ink` and `paper` for body
// text (aim for 7:1), and between `brand` and `paper` for labels (4.5:1).

export const THEME = {
  colors: {
    ink: "#1b2440", // body text, headings, primary buttons
    brand: "#86672c", // script titles, labels, icons, links
    soft: "#e4e6ef", // tinted panels, skeletons, borders' fill
    highlight: "#f4ecdc", // warm wash, hover backgrounds, email call-out
    paper: "#fbfaf7", // page background
    night: "#0e1326", // full-screen photo viewer background
    foliage: "#6d7a99", // stems / leaves in floral decorations
    bloom: "#e2cf9f", // flower centres and small accents in decorations
  },
  // The envelope in the hero (back, front pocket, side folds, top flap).
  envelope: {
    back: "#dfe2ec",
    pocket: "#e8eaf1",
    sides: "#d7dae6",
    flap: "#cdd1df",
  },
  fonts: {
    script: "Pinyon Script", // big decorative titles
    serif: "EB Garamond", // everything else
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Pinyon+Script&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap",
    // Email clients can't load web fonts reliably; use a safe stack there.
    emailSerif: "Georgia, 'Times New Roman', serif",
  },
  radius: "0.375rem",
}

export type Theme = typeof THEME

// ---------------------------------------------------------------------------
// Helpers used by main.tsx to turn the tokens into CSS variables.

export function hexToRgbTriplet(hex: string) {
  const h = hex.replace("#", "")
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/** "H S% L%" as shadcn/ui's CSS variables expect, optionally lightened. */
export function hexToHslTriplet(hex: string, lighten = 0) {
  const [r, g, b] = hexToRgbTriplet(hex).split(" ").map((v) => Number(v) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h *= 60
  }
  const L = Math.min(100, l * 100 + lighten)
  return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${L.toFixed(1)}%`
}

export function applyTheme(theme: Theme = THEME, root: HTMLElement = document.documentElement) {
  const set = (k: string, v: string) => root.style.setProperty(k, v)
  for (const [name, hex] of Object.entries(theme.colors)) set(`--c-${name}`, hexToRgbTriplet(hex))
  for (const [name, hex] of Object.entries(theme.envelope)) set(`--env-${name}`, hex)
  set("--font-script", `"${theme.fonts.script}"`)
  set("--font-serif", `"${theme.fonts.serif}"`)
  // shadcn/ui component colours, derived from the same palette
  const c = theme.colors
  set("--background", hexToHslTriplet(c.paper))
  set("--foreground", hexToHslTriplet(c.ink))
  set("--card", hexToHslTriplet(c.paper, 2))
  set("--card-foreground", hexToHslTriplet(c.ink))
  set("--popover", hexToHslTriplet(c.paper, 2))
  set("--popover-foreground", hexToHslTriplet(c.ink))
  set("--primary", hexToHslTriplet(c.ink))
  set("--primary-foreground", hexToHslTriplet(c.paper, 2))
  set("--secondary", hexToHslTriplet(c.soft))
  set("--secondary-foreground", hexToHslTriplet(c.ink))
  set("--muted", hexToHslTriplet(c.soft, 4))
  set("--muted-foreground", hexToHslTriplet(c.ink, 16))
  set("--accent", hexToHslTriplet(c.highlight))
  set("--accent-foreground", hexToHslTriplet(c.ink))
  set("--border", hexToHslTriplet(c.soft, -4))
  set("--input", hexToHslTriplet(c.soft, -8))
  set("--ring", hexToHslTriplet(c.brand))
  set("--radius", theme.radius)

  const fonts = document.createElement("link")
  fonts.rel = "stylesheet"
  fonts.href = theme.fonts.googleFontsUrl
  document.head.appendChild(fonts)
}
