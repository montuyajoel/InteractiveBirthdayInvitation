import { cn } from "@/lib/utils"
import { LeafShape, RoseBloom, SILK, Wisteria } from "./Embroidery"

type Props = { className?: string; style?: React.CSSProperties }

/** Small embroidered rose sprig. (Named Butterfly so the template's call sites keep working.) */
export function Butterfly({ className, style, flutter = true }: Props & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 64 48" className={className} style={style} aria-hidden>
      <g className={cn(flutter && "animate-flutter")} style={{ transformOrigin: "32px 40px" }}>
        <LeafShape x={30} y={30} angle={200} size={14} />
        <LeafShape x={34} y={30} angle={-20} size={14} />
        <Wisteria x={14} y={22} length={20} width={8} seed={4} />
        <RoseBloom x={32} y={22} r={9} tone="mid" />
        <RoseBloom x={48} y={28} r={6} tone="pale" />
      </g>
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

/** An embroidered spray of roses and wisteria on a curving stem. */
export function BabysBreath({ className, style }: Props) {
  return (
    <svg viewBox="0 0 130 200" className={className} style={style} aria-hidden>
      <path d="M62 198C58 150 50 110 36 60" fill="none" stroke={SILK.leafDark} strokeWidth="2" filter="url(#puffy)" />
      <path d="M58 150C76 120 86 90 92 50" fill="none" stroke={SILK.leafDark} strokeWidth="1.6" filter="url(#puffy)" />
      {[
        [52, 120, 200], [56, 140, -20], [44, 90, 210], [70, 110, -30], [84, 80, -40], [40, 70, 190], [62, 170, 200],
      ].map(([x, y, a], i) => (
        <LeafShape key={i} x={x} y={y} angle={a} size={15} />
      ))}
      <Wisteria x={24} y={74} length={44} width={14} seed={2} />
      <Wisteria x={100} y={56} length={36} width={12} seed={6} />
      <RoseBloom x={36} y={58} r={13} tone="deep" />
      <RoseBloom x={92} y={46} r={11} tone="pale" />
      <RoseBloom x={70} y={100} r={9} tone="mid" />
      <RoseBloom x={48} y={110} r={7} tone="cream" />
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
      <h2 className="mt-2 font-serif text-[2.6rem] leading-tight text-ink sm:text-5xl">{title}</h2>
    </div>
  )
}
