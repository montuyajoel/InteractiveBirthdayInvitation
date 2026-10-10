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

export function Sparkle({ className, style }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-brand", className)} style={style} aria-hidden>
      <path d="M12 2c.6 5 2.4 7.4 8 10-5.6 2.6-7.4 5-8 10-.6-5-2.4-7.4-8-10 5.6-2.6 7.4-5 8-10z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
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
      <span className="h-px w-16 bg-brand/50" />
      <Heart className="h-5 w-5" />
      <span className="h-px w-16 bg-brand/50" />
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
      <h2 className="script mt-2 text-6xl sm:text-7xl">{title}</h2>
    </div>
  )
}
