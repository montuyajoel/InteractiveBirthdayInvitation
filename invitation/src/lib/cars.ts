// Die-cast style hot rods seen from the side (viewBox 0 0 200 72), shared by
// the page decorations, the gallery's sample tiles and the printed card.
// Candy paint, chrome blower, flames and red-stripe tyres; no badges or logos.

export type CarModel = "blaze" | "blue" | "purple"

type Spec = {
  label: string
  paint: [string, string, string] // light, mid, dark (top to bottom)
  flames: [string, string] | null
  stripe: string | null
}

export const CARS: Record<CarModel, Spec> = {
  blaze: { label: "Flame Rod", paint: ["#ffb347", "#ff6a00", "#b83200"], flames: ["#fff36b", "#ffb000"], stripe: null },
  blue: { label: "Blue Blaster", paint: ["#7cc4ff", "#1f6bff", "#0a2a8a"], flames: null, stripe: "#ffffff" },
  purple: { label: "Purple Thunder", paint: ["#e3a6ff", "#9b2fe0", "#4b0f7a"], flames: ["#ffd400", "#ff6a00"], stripe: null },
}

const BODY =
  "M10 50Q8 38 22 35L72 33L84 21Q86 18 90 18L112 18Q116 18 119 21L131 34L178 39Q192 41 194 50L193 54H177A15 15 0 0 0 147 54H65A19 19 0 0 0 27 54H12Z"
const FLAMES =
  "M193 46C182 42 174 43 168 44L150 37L157 44.5L136 35.5L143 45L120 38L128 46.5L100 42L114 48.5C140 51 170 52 193 51Z"

function wheel(id: string, x: number, y: number, r: number) {
  const spokes = [0, 72, 144, 216, 288]
    .map((a) => {
      const t = ((a - 90) * Math.PI) / 180
      const p = (k: number) => `${(x + Math.cos(t) * r * k).toFixed(1)} ${(y + Math.sin(t) * r * k).toFixed(1)}`
      return `M${p(0.18)}L${p(0.5)}`
    })
    .join("")
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#121212"/>
    <circle cx="${x}" cy="${y}" r="${r - 1.2}" fill="none" stroke="#2e2e2e" stroke-width="1.6" stroke-dasharray="2 1.6"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="#e4002b" stroke-width="1.3"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.56}" fill="url(#chrome-${id})"/>
    <path d="${spokes}" stroke="#5b6270" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.14}" fill="#e9edf3" stroke="#5b6270" stroke-width=".6"/>`
}

/** SVG markup (inside a 0 0 200 72 viewBox) for one car; `id` keeps gradient ids unique. */
export function carSvg(model: CarModel, id: string = model) {
  const c = CARS[model]
  return `<defs>
    <linearGradient id="paint-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c.paint[0]}"/><stop offset=".45" stop-color="${c.paint[1]}"/><stop offset="1" stop-color="${c.paint[2]}"/>
    </linearGradient>
    <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9fd8ff"/><stop offset=".5" stop-color="#16324f"/><stop offset="1" stop-color="#0b1626"/>
    </linearGradient>
    <linearGradient id="chrome-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#b9c2cf"/><stop offset=".55" stop-color="#6b7480"/><stop offset="1" stop-color="#e9edf3"/>
    </linearGradient>
    ${c.flames ? `<linearGradient id="flame-${id}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${c.flames[0]}"/><stop offset="1" stop-color="${c.flames[1]}"/></linearGradient>` : ""}
    <clipPath id="body-${id}"><path d="${BODY}"/></clipPath>
  </defs>
  <ellipse cx="102" cy="70" rx="92" ry="2.6" fill="#000" opacity=".35"/>
  <rect x="64" y="52" width="62" height="4.5" rx="2.2" fill="url(#chrome-${id})" stroke="#4b5260" stroke-width=".4"/>
  <path d="${BODY}" fill="url(#paint-${id})" stroke="#140a05" stroke-width="1" stroke-linejoin="round"/>
  <g clip-path="url(#body-${id})">
    ${c.flames ? `<path d="${FLAMES}" fill="url(#flame-${id})" stroke="#7a1d00" stroke-width=".5"/>` : ""}
    ${c.stripe ? `<path d="M10 44L194 47.5V50.5L10 47Z" fill="${c.stripe}"/><path d="M10 49L194 52V53L10 50.5Z" fill="${c.stripe}" opacity=".7"/>` : ""}
    <path d="M14 38Q40 34 72 34.5M132 36L178 41" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7" fill="none"/>
  </g>
  <path d="M87 32L92 21.5H111L118 32Z" fill="url(#glass-${id})" stroke="#140a05" stroke-width=".8"/>
  <path d="M93 22L97 22L92 31L89 31Z" fill="#fff" opacity=".35"/>
  <path d="M102 21.5V32" stroke="#140a05" stroke-width="1.4"/>
  <rect x="134" y="22" width="20" height="13" rx="2" fill="url(#chrome-${id})" stroke="#3b414c" stroke-width=".6"/>
  <path d="M137 24V33M141 24V33M145 24V33M149 24V33" stroke="#7b8494" stroke-width=".8"/>
  <rect x="136.5" y="16.5" width="15" height="6" rx="1.5" fill="#1b1b1b" stroke="#3b414c" stroke-width=".6"/>
  <path d="M5 44L14 43V46L5 47Z" fill="#ff2d2d"/><path d="M190 44L195 45V48L190 48Z" fill="#fff6c2"/>
  ${wheel(id, 46, 52, 18)}
  ${wheel(id, 162, 56, 13)}`
}
