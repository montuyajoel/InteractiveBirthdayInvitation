// Side-view supercar drawings (viewBox 0 0 200 60), shared by the page
// decorations, the gallery's sample tiles and the printed card.
// Styled after famous supercar colours and shapes; no badges or logos.

export type CarModel = "rosso" | "bleu" | "giallo"

const TYRE = "#0b0b0d"
const RIM = "#c9ced8"
const GLASS = "#121318"

type Spec = {
  label: string
  body: string
  front?: string // second tone over the front half (two-tone hypercar)
  stripe: string
  shape: string
  glass: string
  extra: string // per-model details drawn on top of the body
}

const ARCHES = "H171A13 13 0 0 0 145 46H61A13 13 0 0 0 35 46Z"

export const CARS: Record<CarModel, Spec> = {
  // Italian red: long low wedge, rear wing.
  rosso: {
    label: "Ferrari red",
    body: "#d90f0f",
    stripe: "#ffc400",
    shape: `M6 46V36Q8 31 22 30L62 27Q88 12 118 12Q138 12 160 25L190 31Q197 34 196 42L194 46${ARCHES}`,
    glass: "M70 27Q90 16 116 16Q132 16 150 26Z",
    extra: `<path d="M4 26L22 24V29L6 30Z" fill="${GLASS}"/><path d="M80 39L112 33L106 42Z" fill="${GLASS}"/>`,
  },
  // French blue two-tone hypercar: rounded roof and the big C-shaped side sweep.
  bleu: {
    label: "Bugatti blue",
    body: "#0c2a66",
    front: "#2563eb",
    stripe: "#c9ced8",
    shape: `M6 46V33Q8 27 24 26L60 24Q86 11 116 11Q142 12 164 25L188 31Q197 34 196 42L194 46${ARCHES}`,
    glass: "M72 24Q92 15 116 15Q134 15 152 25Z",
    extra: `<path d="M98 20Q74 32 92 45" fill="none" stroke="#c9ced8" stroke-width="3" stroke-linecap="round"/>
      <path d="M189 34Q195 36 194 42L189 42Z" fill="#c9ced8"/>`,
  },
  // Raging-bull yellow: sharp angular wedge.
  giallo: {
    label: "Lambo yellow",
    body: "#ffc400",
    stripe: "#111216",
    shape: `M6 46V36L30 31L70 26L100 13L140 14L192 33L196 40L194 46${ARCHES}`,
    glass: "M74 26L101 16L136 17L152 26Z",
    extra: `<path d="M78 40L118 32L112 43Z" fill="${GLASS}"/><path d="M4 27L24 26L24 30L6 31Z" fill="${GLASS}"/>`,
  },
}

/** SVG markup (inside a 0 0 200 60 viewBox) for one car. */
export function carSvg(model: CarModel, outline = "#f4f4f5", id: string = model) {
  const c = CARS[model]
  const wheel = (x: number) =>
    `<circle cx="${x}" cy="46" r="11" fill="${TYRE}" stroke="${outline}" stroke-width=".8"/>` +
    `<circle cx="${x}" cy="46" r="5.5" fill="${RIM}"/><circle cx="${x}" cy="46" r="1.8" fill="${c.body}"/>`
  return [
    `<defs><clipPath id="front-${id}"><rect x="96" y="0" width="110" height="60"/></clipPath></defs>`,
    `<path d="${c.shape}" fill="${c.body}"/>`,
    c.front ? `<path d="${c.shape}" fill="${c.front}" clip-path="url(#front-${id})"/>` : "",
    `<path d="${c.shape}" fill="none" stroke="${outline}" stroke-width="1" stroke-linejoin="round"/>`,
    `<path d="${c.glass}" fill="${GLASS}" stroke="${outline}" stroke-width=".5"/>`,
    `<path d="M14 36H58M150 34H186" stroke="${c.stripe}" stroke-width="2.5" stroke-linecap="round"/>`,
    c.extra,
    wheel(48),
    wheel(158),
  ].join("")
}
