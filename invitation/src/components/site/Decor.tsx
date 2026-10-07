import { useId } from "react"
import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }


// ---------------------------------------------------------------------------
// Balloons, after the dusty-rose, ivory, nude and gold garlands.

type Tone = "rose" | "blush" | "ivory" | "nude" | "gold"

// [light, base, shade] for each balloon colour
const TONES: Record<Tone, [string, string, string]> = {
  rose: ["#ecd0cf", "#d3a3a6", "#b48085"],
  blush: ["#fbeae6", "#efcdc8", "#d6aba6"],
  ivory: ["#fffcf7", "#f5ebe0", "#ddcbb8"],
  nude: ["#f5e6d7", "#e2c6ac", "#c4a284"],
  gold: ["#fbecbd", "#d2ae64", "#8f6a2c"],
}

export type BalloonSpec = [x: number, y: number, r: number, tone: Tone]

/** Seeded random numbers so a cluster looks the same on every visit. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Packs balloons of mixed sizes along a curve, like an organic garland. */
export function garland(points: [number, number][], seed = 7, size = 1): BalloonSpec[] {
  const rand = seeded(seed)
  const tones: Tone[] = ["rose", "ivory", "blush", "nude", "gold", "ivory", "rose", "blush"]
  const out: BalloonSpec[] = []
  points.forEach(([x, y], i) => {
    out.push([x, y, (16 + rand() * 12) * size, tones[i % tones.length]])
    // a smaller filler balloon tucked beside each big one
    const a = rand() * Math.PI * 2
    out.push([x + Math.cos(a) * 20 * size, y + Math.sin(a) * 20 * size, (7 + rand() * 6) * size, tones[(i + 3) % tones.length]])
  })
  // draw the small ones last so they sit on top
  return out.sort((p, q) => q[2] - p[2])
}

export function Balloons({
  balloons,
  viewBox,
  className,
  style,
  bob = true,
}: Props & { balloons: BalloonSpec[]; viewBox: string; bob?: boolean }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox={viewBox} className={cn("overflow-visible", className)} style={style} aria-hidden>
      <defs>
        {(Object.keys(TONES) as Tone[]).map((t) => (
          <radialGradient key={t} id={`${id}-${t}`} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor={TONES[t][0]} />
            <stop offset={t === "gold" ? ".45" : ".55"} stopColor={TONES[t][1]} />
            <stop offset="1" stopColor={TONES[t][2]} />
          </radialGradient>
        ))}
      </defs>
      {balloons.map(([x, y, r, t], i) => (
        <g
          key={i}
          className={cn(bob && i % 3 === 0 && "animate-bob")}
          style={bob ? { animationDelay: `${-(i % 7) * 0.7}s`, animationDuration: `${5 + (i % 4)}s` } : undefined}
        >
          <circle cx={x} cy={y} r={r} fill={`url(#${id}-${t})`} />
          <ellipse
            cx={x - r * 0.35}
            cy={y - r * 0.4}
            rx={r * 0.22}
            ry={r * 0.13}
            transform={`rotate(-35 ${x - r * 0.35} ${y - r * 0.4})`}
            fill="#fff"
            opacity={t === "gold" ? 0.85 : 0.55}
          />
        </g>
      ))}
    </svg>
  )
}

/** A few balloons on ribbons drifting up behind a section. */
export function FloatingBalloons({ className }: { className?: string }) {
  const items = [
    { left: "5%", size: 22, dur: "22s", delay: "0s", tone: "rose" },
    { left: "21%", size: 16, dur: "19s", delay: "-8s", tone: "gold" },
    { left: "40%", size: 14, dur: "24s", delay: "-15s", tone: "ivory" },
    { left: "58%", size: 18, dur: "21s", delay: "-4s", tone: "blush" },
    { left: "77%", size: 15, dur: "18s", delay: "-11s", tone: "gold" },
    { left: "92%", size: 20, dur: "23s", delay: "-6s", tone: "nude" },
  ] as const
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {items.map((b, i) => (
        <span
          key={i}
          className="absolute -bottom-16 animate-rise"
          style={{ left: b.left, "--dur": b.dur, "--dx": i % 2 ? "-14px" : "14px", animationDelay: b.delay } as React.CSSProperties}
        >
          <svg viewBox="0 0 20 44" style={{ width: b.size, height: b.size * 2.2 }}>
            <defs>
              <radialGradient id={`fb-${i}`} cx="35%" cy="30%" r="75%">
                <stop offset="0" stopColor={TONES[b.tone][0]} />
                <stop offset=".55" stopColor={TONES[b.tone][1]} />
                <stop offset="1" stopColor={TONES[b.tone][2]} />
              </radialGradient>
            </defs>
            <ellipse cx="10" cy="10" rx="9" ry="10" fill={`url(#fb-${i})`} />
            <path d="M10 20l-1.5 2h3z" fill={TONES[b.tone][2]} />
            <path d="M10 22c-3 6 3 10 0 16s2 6 0 6" fill="none" stroke={TONES[b.tone][2]} strokeWidth=".6" />
          </svg>
        </span>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Butterflies, flowers, bow and cross.

/** An ivory butterfly with a warm glow, like the lit butterflies by the arch. */
export function Butterfly({ className, style, flutter = true, glow = true }: Props & { flutter?: boolean; glow?: boolean }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg
      viewBox="0 0 64 48"
      className={cn("text-gold", className)}
      style={{ filter: glow ? "drop-shadow(0 0 6px rgb(255 226 170 / 0.95)) drop-shadow(0 0 14px rgb(255 214 150 / 0.6))" : undefined, ...style }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#f6e2bf" />
        </linearGradient>
      </defs>
      <g className={cn(flutter && "animate-flutter")} style={{ transformOrigin: "32px 24px" }}>
        <path
          d="M32 24C26 8 8 6 10 17c2 8 13 9 22 7zM32 24c6-16 24-18 22-7-2 8-13 9-22 7zM32 24c-6 4-15 13-9 16 4 2 8-6 9-16zM32 24c6 4 15 13 9 16-4 2-8-6-9-16z"
          fill={`url(#${id}-w)`}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="M31 22C26 13 17 11 14 15M33 22c5-9 14-11 17-7M30 26c-3 4-6 8-5 11M34 26c3 4 6 8 5 11" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".7" />
      </g>
      <path d="M32 17v16M32 17l-3-5M32 17l3-5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/** A thin gold cross, as on the welcome sign. */
export function Cross({ className, style }: Props) {
  return (
    <svg viewBox="0 0 24 32" className={cn("text-gold", className)} style={style} aria-hidden>
      <path d="M12 2v28M4 10h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 2v28M4 10h16" stroke="#fff6dc" strokeWidth=".6" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

/** A dusty-rose satin bow with long tails. */
export function Bow({ className, style }: Props) {
  return (
    <svg viewBox="0 0 120 150" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="bow-satin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dcb0b3" />
          <stop offset=".5" stopColor="#c4959a" />
          <stop offset="1" stopColor="#a7767c" />
        </linearGradient>
      </defs>
      <g fill="url(#bow-satin)" stroke="#9c6b71" strokeWidth=".8" strokeLinejoin="round">
        <path d="M58 40C46 50 34 92 22 140l16-6 8 14c4-40 10-82 18-104z" />
        <path d="M62 40c12 10 24 52 36 100l-16-6-8 14c-4-40-10-82-18-104z" />
        <path d="M58 36C40 14 10 8 8 26c-2 16 26 22 50 16z" />
        <path d="M62 36c18-22 48-28 50-10 2 16-26 22-50 16z" />
        <rect x="52" y="30" width="16" height="16" rx="5" />
      </g>
      <path d="M20 22c10-6 24-2 34 10M100 22c-10-6-24-2-34 10" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Rose({ x, y, r, white = true }: { x: number; y: number; r: number; white?: boolean }) {
  const [fill, edge] = white ? ["#fffaf2", "#dccab6"] : ["#f0cfca", "#c99a96"]
  return (
    <g stroke={edge} strokeWidth=".9" strokeLinecap="round">
      <circle cx={x} cy={y} r={r} fill={fill} />
      <path
        d={`M${x - r * 0.75} ${y + r * 0.1}c${r * 0.1} ${-r * 0.8} ${r * 1.3} ${-r * 0.9} ${r * 1.45} ${-r * 0.1}`}
        fill="none"
      />
      <path d={`M${x - r * 0.5} ${y + r * 0.35}c${r * 0.2} ${r * 0.4} ${r * 0.9} ${r * 0.4} ${r * 1.05} ${-r * 0.1}`} fill="none" />
      <path
        d={`M${x - r * 0.3} ${y}c0 ${-r * 0.45} ${r * 0.6} ${-r * 0.45} ${r * 0.6} 0s${-r * 0.3} ${r * 0.3} ${-r * 0.35} ${r * 0.05}`}
        fill="none"
      />
    </g>
  )
}

function Pampas({ d, n = 22 }: { d: [number, number, number, number, number, number]; n?: number }) {
  // a quadratic stem from (x0,y0) via (cx,cy) to (x1,y1), feathered along its length
  const [x0, y0, cx, cy, x1, y1] = d
  const at = (t: number) => [
    (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1,
    (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1,
  ]
  const feathers = Array.from({ length: n }, (_, i) => {
    const t = 0.35 + (i / n) * 0.65
    const [px, py] = at(t)
    const [qx, qy] = at(Math.min(1, t + 0.02))
    const ang = Math.atan2(qy - py, qx - px)
    const len = 9 * Math.sin(Math.PI * Math.min(1, (t - 0.3) / 0.75)) + 3
    const side = i % 2 ? 1 : -1
    const fx = px + Math.cos(ang + side * 0.9) * len
    const fy = py + Math.sin(ang + side * 0.9) * len
    return `M${px.toFixed(1)} ${py.toFixed(1)}L${fx.toFixed(1)} ${fy.toFixed(1)}`
  }).join("")
  return (
    <g fill="none" style={{ stroke: "rgb(var(--c-foliage))" }} strokeLinecap="round">
      <path d={`M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`} strokeWidth="1.1" />
      <path d={feathers} strokeWidth="1.6" opacity=".75" />
    </g>
  )
}

/** White and blush roses with baby's breath and pampas, like the sign's corners. */
export function FloralSpray({ className, style }: Props) {
  return (
    <svg viewBox="0 0 220 180" className={cn("overflow-visible", className)} style={style} aria-hidden>
      <Pampas d={[110, 110, 80, 50, 40, 6]} />
      <Pampas d={[112, 112, 150, 60, 200, 30]} n={18} />
      <Pampas d={[106, 116, 60, 110, 8, 96]} n={16} />
      <g style={{ fill: "#b9b896" }} opacity=".8">
        <ellipse cx="74" cy="128" rx="11" ry="4.5" transform="rotate(25 74 128)" />
        <ellipse cx="150" cy="132" rx="11" ry="4.5" transform="rotate(-20 150 132)" />
        <ellipse cx="128" cy="76" rx="9" ry="4" transform="rotate(-50 128 76)" />
      </g>
      <Rose x={96} y={110} r={20} />
      <Rose x={130} y={104} r={16} white={false} />
      <Rose x={114} y={136} r={15} />
      <Rose x={76} y={96} r={12} white={false} />
      <Rose x={150} y={124} r={11} />
      {[
        [60, 80], [70, 66], [150, 84], [164, 98], [90, 76], [140, 146], [84, 140], [170, 116], [58, 110], [104, 82],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.2" fill="#fff" stroke="#e7d6c6" strokeWidth=".6" />
          <circle cx={x} cy={y} r=".9" style={{ fill: "rgb(var(--c-bloom))" }} />
        </g>
      ))}
    </svg>
  )
}

export function Heart({ className, style, filled = false }: Props & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2C4.5 7.4 6.6 5.5 9 5.5c1.4 0 2.5.7 3 1.7.5-1 1.6-1.7 3-1.7 2.4 0 4.5 1.9 4.5 4.8 0 5.6-7.5 10.2-7.5 10.2z"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.55 : 0}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A four-point glint, gold by default. */
export function Sparkle({ className, style }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-gold", className)} style={style} aria-hidden>
      <path
        d="M12 1.5c.7 5.6 2.9 8.3 10.5 10.5C14.9 14.2 12.7 16.9 12 22.5 11.3 16.9 9.1 14.2 1.5 12 9.1 9.8 11.3 7.1 12 1.5z"
        fill="currentColor"
        fillOpacity=".85"
      />
      <circle cx="12" cy="12" r="1.6" fill="#fff" />
    </svg>
  )
}

// x%, y%, size px, duration, delay, colour
const GLITTER: [number, number, number, number, number, "gold" | "brand" | "bloom"][] = [
  [4, 12, 14, 4.2, 0, "gold"], [14, 36, 9, 3.6, 1.1, "brand"], [22, 8, 11, 5, 2.3, "gold"],
  [29, 64, 8, 3.8, 0.6, "bloom"], [37, 22, 12, 4.6, 3.1, "gold"], [44, 84, 10, 4, 1.7, "brand"],
  [52, 46, 8, 3.4, 2.6, "gold"], [58, 6, 13, 5.2, 0.3, "bloom"], [66, 72, 11, 4.4, 3.6, "gold"],
  [73, 30, 9, 3.7, 1.4, "brand"], [81, 58, 14, 4.8, 2.1, "gold"], [88, 16, 10, 3.9, 0.9, "bloom"],
  [94, 78, 12, 4.3, 2.9, "gold"], [9, 88, 11, 4.1, 3.3, "gold"], [48, 14, 7, 3.2, 1.9, "brand"],
  [18, 54, 7, 3.5, 2.7, "gold"], [63, 92, 8, 3.6, 0.7, "gold"], [97, 44, 8, 3.3, 1.2, "brand"],
]

/** Gold glints winking on and off across the page, like light on the gold balloons. */
export function GlitterField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {GLITTER.map(([x, y, size, dur, delay, tone], i) => (
        <Sparkle
          key={i}
          className={cn(
            "absolute animate-glint",
            tone === "bloom" ? "text-bloom" : "text-gold",
          )}
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              "--dur": `${dur}s`,
              animationDelay: `${delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** A quick shower of glints, played once (e.g. when the envelope opens). */
export function SparkleBurst({ className }: { className?: string }) {
  const bits = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2
    const dist = 90 + (i % 3) * 30
    return {
      dx: `${Math.round(Math.cos(angle) * dist)}px`,
      dy: `${Math.round(Math.sin(angle) * dist - 40)}px`,
      size: 10 + (i % 4) * 4,
      tone: i % 3 === 0 ? "text-mauve" : i % 3 === 1 ? "text-gold" : "text-bloom",
      delay: `${(i % 5) * 60}ms`,
    }
  })
  return (
    <div className={cn("pointer-events-none absolute left-1/2 top-1/2", className)} aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-burst"
          style={{ "--dx": b.dx, "--dy": b.dy, animationDelay: b.delay } as React.CSSProperties}
        >
          <Sparkle className={b.tone} style={{ width: b.size, height: b.size }} />
        </span>
      ))}
    </div>
  )
}

const BLOOMS: [number, number, number][] = [
  [30, 30, 7], [52, 18, 6], [70, 40, 8], [24, 62, 6], [88, 22, 5], [96, 56, 7], [48, 52, 5], [76, 74, 6], [40, 86, 7], [110, 38, 5],
]

/** A sprig of baby's breath, like the sprays framing the printed card. */
export function BabysBreath({ className, style }: Props) {
  return (
    <svg viewBox="0 0 130 200" className={className} style={style} aria-hidden>
      <g fill="none" style={{ stroke: "rgb(var(--c-foliage))" }} strokeWidth="1" strokeLinecap="round" opacity=".8">
        <path d="M60 198C58 160 54 120 48 86" />
        <path d="M58 150C40 120 30 90 30 30" />
        <path d="M56 130C70 100 80 60 88 22" />
        <path d="M52 110C30 90 24 70 24 62" />
        <path d="M57 120C80 90 96 70 96 56" />
        <path d="M48 86C50 60 52 40 52 18" />
        <path d="M54 112C60 96 70 60 70 40" />
        <path d="M58 160C70 120 76 90 76 74" />
        <path d="M52 140C44 110 40 96 40 86" />
        <path d="M62 140C90 100 106 60 110 38" />
        <path d="M50 120C50 90 48 60 48 52" />
      </g>
      {BLOOMS.map(([x, y, r], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={x + Math.cos((a * Math.PI) / 180) * r * 0.55}
              cy={y + Math.sin((a * Math.PI) / 180) * r * 0.55}
              r={r * 0.5}
              fill="#fff"
              style={{ stroke: "rgb(var(--c-bloom) / 0.6)" }}
              strokeWidth=".8"
            />
          ))}
          <circle cx={x} cy={y} r={r * 0.25} style={{ fill: "rgb(var(--c-bloom))" }} />
        </g>
      ))}
    </svg>
  )
}

export function HeartRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-brand", className)} aria-hidden>
      <span className="foil-line h-px w-20" />
      <Heart className="h-4 w-4 text-mauve" filled />
      <span className="foil-line h-px w-20" />
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="script foil mt-2 text-6xl sm:text-7xl">{title}</h2>
    </div>
  )
}
