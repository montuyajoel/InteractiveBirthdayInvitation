import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }

export function Butterfly({ className, style, flutter = true }: Props & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 64 48" className={cn("text-brand", className)} style={style} aria-hidden>
      <g className={cn(flutter && "animate-flutter")} style={{ transformOrigin: "32px 24px" }}>
        <path
          d="M32 24C26 8 8 6 10 17c2 8 13 9 22 7zM32 24c6-16 24-18 22-7-2 8-13 9-22 7zM32 24c-6 4-15 13-9 16 4 2 8-6 9-16zM32 24c6 4 15 13 9 16-4 2-8-6-9-16z"
          fill="currentColor"
          fillOpacity=".12"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </g>
      <path d="M32 17v16M32 17l-3-5M32 17l3-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
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

/** Gold and rose-gold glints winking on and off across the whole page. */
export function GlitterField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {GLITTER.map(([x, y, size, dur, delay, tone], i) => (
        <Sparkle
          key={i}
          className={cn(
            "absolute animate-glint",
            tone === "gold" ? "text-gold" : tone === "brand" ? "text-brand" : "text-bloom",
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
      tone: i % 3 === 0 ? "text-brand" : i % 3 === 1 ? "text-gold" : "text-bloom",
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

/** A soft, puffy cloud. */
export function Cloud({ className, style }: Props) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} aria-hidden>
      <path
        d="M24 52h72c11 0 18-7 18-16s-7-16-17-16c-2-10-11-16-21-16-8 0-15 4-19 11-3-2-7-3-11-3-9 0-16 7-17 15C17 26 8 33 8 40c0 7 7 12 16 12z"
        fill="#fff"
        fillOpacity=".9"
        style={{ stroke: "rgb(var(--c-gold) / 0.45)" }}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A five-point star with rounded corners. */
export function Star({ className, style, filled = true }: Props & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <path
        d="M12 3.2l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.1l-5.1 2.8L8 13.2l-4.3-4 5.8-.7z"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.35 : 0}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A dove carrying an olive sprig, the christening symbol. */
export function Dove({ className, style }: Props) {
  return (
    <svg viewBox="0 0 80 56" className={cn("text-brand", className)} style={style} aria-hidden>
      <g strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M14 34c8 0 16-2 22-8 4-4 8-6 13-6 4 0 7 2 9 5l7-1-5 5c-2 8-10 14-22 14-8 0-15-3-20-6l-6 4 2-7z"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <g className="animate-flutter" style={{ transformOrigin: "40px 28px" }}>
          <path
            d="M34 28C30 16 34 6 44 2c-2 8 2 12 8 14-6 2-10 6-12 12z"
            fill="currentColor"
            fillOpacity=".12"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </g>
        <circle cx="56" cy="24" r="1" fill="currentColor" />
        <path d="M65 24c3 2 6 3 10 3" fill="none" style={{ stroke: "rgb(var(--c-foliage))" }} strokeWidth="1.2" />
        <ellipse cx="71" cy="23" rx="3" ry="1.4" transform="rotate(-25 71 23)" style={{ fill: "rgb(var(--c-foliage) / 0.7)" }} />
        <ellipse cx="74" cy="29" rx="3" ry="1.4" transform="rotate(25 74 29)" style={{ fill: "rgb(var(--c-foliage) / 0.7)" }} />
      </g>
    </svg>
  )
}

/** A crib mobile: a moon, stars and clouds swaying from a little bar. */
export function BabyMobile({ className, style }: Props) {
  const charms: { x: number; len: number; delay: string; kind: "star" | "moon" | "cloud" | "heart" }[] = [
    { x: 20, len: 46, delay: "0s", kind: "star" },
    { x: 50, len: 70, delay: "-1.5s", kind: "cloud" },
    { x: 80, len: 52, delay: "-3s", kind: "moon" },
    { x: 110, len: 76, delay: "-4.5s", kind: "heart" },
    { x: 140, len: 44, delay: "-2s", kind: "star" },
  ]
  return (
    <svg viewBox="0 0 160 130" className={cn("overflow-visible text-brand", className)} style={style} aria-hidden>
      <g className="animate-sway" style={{ transformOrigin: "80px 0px", transformBox: "view-box" }}>
        <path d="M80 0v14" stroke="currentColor" strokeWidth="1" />
        <path d="M14 18 Q80 8 146 18" fill="none" style={{ stroke: "rgb(var(--c-gold))" }} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="80" cy="14" r="3.4" style={{ fill: "rgb(var(--c-gold))" }} />
        {charms.map((c, i) => (
          <g
            key={i}
            className="animate-sway"
            style={{ transformOrigin: `${c.x}px 16px`, transformBox: "view-box", animationDelay: c.delay, animationDuration: `${4 + i * 0.6}s` }}
          >
            <path d={`M${c.x} 16v${c.len - 10}`} stroke="currentColor" strokeOpacity=".5" strokeWidth=".8" />
            <g transform={`translate(${c.x} ${c.len + 6})`}>
              {c.kind === "star" && (
                <path d="M0-10l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L0 4.8-5.9 8l1.3-6.5-4.9-4.6 6.6-.8z" style={{ fill: "rgb(var(--c-gold) / 0.55)", stroke: "rgb(var(--c-foliage))" }} strokeWidth="1" strokeLinejoin="round" />
              )}
              {c.kind === "moon" && (
                <path d="M4-10a10 10 0 1 0 6 17A8 8 0 0 1 4-10z" style={{ fill: "rgb(var(--c-gold) / 0.45)", stroke: "rgb(var(--c-foliage))" }} strokeWidth="1" />
              )}
              {c.kind === "cloud" && (
                <path d="M-10 6h20c4 0 7-3 7-6s-3-6-6-6c-1-4-4-6-8-6-3 0-6 2-7 4-4 0-7 3-7 7 0 4 0 7 1 7z" fill="#fff" stroke="currentColor" strokeWidth="1" />
              )}
              {c.kind === "heart" && (
                <path d="M0 9s-9-5.5-9-12c0-3.4 2.4-5.5 5.2-5.5 1.6 0 3 .8 3.8 2 .8-1.2 2.2-2 3.8-2C6.6-8.5 9-6.4 9-3 9 3.5 0 9 0 9z" fill="rgb(var(--c-bloom))" stroke="currentColor" strokeWidth="1" />
              )}
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}

const BUBBLES = [
  { left: "6%", size: 14, dur: "16s", delay: "0s", dx: "18px", kind: "bubble" },
  { left: "18%", size: 10, dur: "13s", delay: "-6s", dx: "-12px", kind: "heart" },
  { left: "31%", size: 18, dur: "18s", delay: "-3s", dx: "14px", kind: "bubble" },
  { left: "47%", size: 9, dur: "12s", delay: "-9s", dx: "-10px", kind: "star" },
  { left: "62%", size: 16, dur: "17s", delay: "-1s", dx: "16px", kind: "bubble" },
  { left: "74%", size: 11, dur: "14s", delay: "-11s", dx: "-14px", kind: "heart" },
  { left: "86%", size: 20, dur: "19s", delay: "-5s", dx: "10px", kind: "bubble" },
  { left: "94%", size: 9, dur: "13s", delay: "-8s", dx: "-8px", kind: "star" },
] as const

/** Pearly bubbles, little hearts and gold glints drifting up behind a section. */
export function FloatingBubbles({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute -bottom-6 animate-rise"
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              "--dur": b.dur,
              "--dx": b.dx,
              animationDelay: b.delay,
            } as React.CSSProperties
          }
        >
          {b.kind === "bubble" && (
            <span className="block h-full w-full rounded-full border border-gold/40 bg-[radial-gradient(circle_at_35%_30%,#fff,rgb(var(--c-bloom)/0.5)_55%,rgb(var(--c-gold)/0.35))] shadow-[0_0_8px_rgb(var(--c-gold)/0.35)]" />
          )}
          {b.kind === "heart" && <Heart className="h-full w-full opacity-70" filled />}
          {b.kind === "star" && <Sparkle className="h-full w-full" />}
        </span>
      ))}
    </div>
  )
}

export function HeartRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-brand", className)} aria-hidden>
      <span className="foil-line h-px w-20" />
      <Sparkle className="h-3 w-3" />
      <Heart className="h-5 w-5" />
      <Sparkle className="h-3 w-3" />
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
