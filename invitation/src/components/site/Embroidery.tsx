// Embroidered / clay-relief artwork for the wedding: roses, wisteria, pearls,
// the château, swans and the timeline icons. Everything is inline SVG and
// gets its puffy, stitched look from the shared filters in <ArtDefs />
// (rendered once in App.tsx).
import { cn } from "@/lib/utils"

type Props = { className?: string; style?: React.CSSProperties }

// Thread colours. Fixed rather than theme tokens: they're the "embroidery
// silks" and stay the same whatever the paper colour.
export const SILK = {
  roseDeep: "#9b4f67",
  rose: "#c4849a",
  rosePale: "#f0d3da",
  roseCream: "#f7e6e3",
  leaf: "#7f8c6c",
  leafDark: "#5f6b50",
  wisteria: "#8b6aa0",
  wisteriaLight: "#ad92c0",
  wisteriaDeep: "#694a7e",
  pearl: "#fbf3f2",
  gold: "#b39062",
  stone: "#f2dfe4",
  stoneShade: "#e2c6cf",
  roof: "#b97c8e",
  shutter: "#3b2d33",
  hedge: "#6f7a5f",
}

/** Shared SVG filters and gradients. Render once, near the top of the page. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        {/* soft raised "clay" relief with a light from the top left */}
        <filter id="puffy" x="-15%" y="-15%" width="130%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="2.6" specularConstant=".7" specularExponent="16" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth="225" elevation="48" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0" result="lit" />
          <feDropShadow in="lit" dx="0" dy="1.6" stdDeviation="1.3" floodColor="#4a2e3b" floodOpacity=".3" />
        </filter>
        {/* gentler version for large shapes (buildings, frames) */}
        <filter id="relief" x="-5%" y="-5%" width="110%" height="115%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="1.6" specularConstant=".45" specularExponent="12" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth="225" elevation="55" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3=".4" k4="0" result="lit" />
          <feDropShadow in="lit" dx="0" dy="2" stdDeviation="2" floodColor="#4a2e3b" floodOpacity=".22" />
        </filter>
        <radialGradient id="pearl" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".55" stopColor="#f6e9ea" />
          <stop offset="1" stopColor="#d9bfc6" />
        </radialGradient>
        <radialGradient id="pearl-sage" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#e9eee0" />
          <stop offset=".6" stopColor="#a7b296" />
          <stop offset="1" stopColor="#6c7759" />
        </radialGradient>
        <radialGradient id="wax" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#f6e4e2" />
          <stop offset=".6" stopColor="#e6c3bd" />
          <stop offset="1" stopColor="#c99a93" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// Small seeded random so decorations look hand-placed but never change.
function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const TONES = {
  deep: [SILK.roseDeep, "#7a3a50"],
  mid: [SILK.rose, "#9b5a70"],
  pale: [SILK.rosePale, "#c99aa6"],
  cream: [SILK.roseCream, "#d7b4b0"],
} as const
type Tone = keyof typeof TONES

/** A ribbon-embroidery rose: a round bloom with spiralling petal stitches. */
export function RoseBloom({ x, y, r, tone = "mid" }: { x: number; y: number; r: number; tone?: Tone }) {
  const [fill, line] = TONES[tone]
  const arcs = [0.82, 0.6, 0.4, 0.2].map((k, i) => {
    const rr = r * k
    const a0 = (i * 97 + 20) * (Math.PI / 180)
    const a1 = a0 + 4.2
    const p = (a: number) => `${(x + Math.cos(a) * rr).toFixed(2)} ${(y + Math.sin(a) * rr).toFixed(2)}`
    return <path key={i} d={`M${p(a0)}A${rr} ${rr} 0 1 1 ${p(a1)}`} fill="none" stroke={line} strokeWidth={r * 0.13} strokeLinecap="round" strokeOpacity=".75" />
  })
  return (
    <g filter="url(#puffy)">
      <circle cx={x} cy={y} r={r} fill={fill} />
      {arcs}
    </g>
  )
}

export function LeafShape({ x, y, angle, size, color = SILK.leaf }: { x: number; y: number; angle: number; size: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size / 20})`} filter="url(#puffy)">
      <path d="M0 0C6 -7 16 -7 22 0C16 7 6 7 0 0Z" fill={color} />
      <path d="M1 0H19" stroke={SILK.leafDark} strokeWidth="1" strokeOpacity=".6" />
    </g>
  )
}

/** A drooping wisteria raceme made of tiny raised florets. */
export function Wisteria({ x, y, length, width = length * 0.32, seed = 1 }: { x: number; y: number; length: number; width?: number; seed?: number }) {
  const rand = rng(seed * 7919)
  const dots: React.ReactElement[] = []
  const rows = Math.round(length / 4.2)
  for (let i = 0; i < rows; i++) {
    const t = i / rows
    const w = width * (1 - t * 0.85) * (0.5 + Math.sin(t * Math.PI) * 0.5 + 0.2)
    const n = Math.max(1, Math.round(w / 4.5))
    for (let j = 0; j < n; j++) {
      const dx = (j - (n - 1) / 2) * (w / n) + (rand() - 0.5) * 2
      const c = t < 0.35 ? SILK.wisteriaDeep : t < 0.7 ? SILK.wisteria : SILK.wisteriaLight
      dots.push(<circle key={`${i}-${j}`} cx={x + dx} cy={y + i * 4.2 + rand() * 1.5} r={2.3 - t * 0.6} fill={c} />)
    }
  }
  return <g filter="url(#puffy)">{dots}</g>
}

/** A string of pearls along a quadratic curve. */
export function PearlString({ from, to, sag, r = 3, gap = 1.2, sage = false }: { from: [number, number]; to: [number, number]; sag: number; r?: number; gap?: number; sage?: boolean }) {
  const [x0, y0] = from
  const [x1, y1] = to
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2 + sag
  const len = Math.hypot(x1 - x0, y1 - y0) + Math.abs(sag) * 0.6
  const n = Math.max(2, Math.round(len / (r * 2 + gap)))
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const u = 1 - t
    return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]
  })
  return (
    <g filter="url(#puffy)">
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={r} fill={`url(#${sage ? "pearl-sage" : "pearl"})`} />
      ))}
    </g>
  )
}

/** A wide garland: leafy vine with wisteria, roses and pearl swags (top of a section). */
export function WisteriaGarland({ className, style, flip = false, seed = 3 }: Props & { flip?: boolean; seed?: number }) {
  const rand = rng(seed * 104729)
  const leaves = Array.from({ length: 22 }, (_, i) => {
    const x = 6 + i * 18 + rand() * 6
    const y = 22 + Math.sin(i * 0.9) * 6
    return <LeafShape key={i} x={x} y={y} angle={(i % 2 ? -1 : 1) * (25 + rand() * 30) + (i % 2 ? 180 : 0)} size={11 + rand() * 4} />
  })
  return (
    <svg viewBox="0 0 400 130" className={className} style={{ ...style, transform: flip ? "scaleY(-1)" : undefined }} aria-hidden preserveAspectRatio="xMidYMin meet">
      <path d="M0 24C60 10 120 36 200 22S340 12 400 26" fill="none" stroke={SILK.leafDark} strokeWidth="2.4" filter="url(#puffy)" />
      <PearlString from={[30, 26]} to={[130, 28]} sag={34} r={2.6} />
      <PearlString from={[130, 28]} to={[270, 24]} sag={40} r={2.6} />
      <PearlString from={[270, 24]} to={[370, 28]} sag={34} r={2.6} />
      {leaves}
      {[20, 62, 104, 152, 200, 248, 296, 338, 382].map((x, i) => (
        <Wisteria key={x} x={x + (rand() - 0.5) * 6} y={30} length={46 + (i % 3) * 18 + rand() * 12} seed={seed + i} />
      ))}
      {[44, 128, 178, 226, 272, 356].map((x, i) => (
        <RoseBloom key={x} x={x} y={22 + (i % 2) * 4} r={7 + (i % 3)} tone={(["deep", "mid", "pale"] as Tone[])[i % 3]} />
      ))}
    </svg>
  )
}

/** A thick sage-and-pearl rope with roses, used as a section divider. */
export function PearlRope({ className, curve = 30 }: { className?: string; curve?: number }) {
  return (
    <svg viewBox="0 0 400 90" className={cn("w-full", className)} aria-hidden preserveAspectRatio="none">
      <PearlString from={[-10, 14]} to={[410, 14]} sag={curve * 2} r={4.2} gap={0.6} sage />
      <PearlString from={[-10, 22]} to={[410, 22]} sag={curve * 2} r={4.6} gap={0.6} />
      <PearlString from={[-10, 31]} to={[410, 31]} sag={curve * 2} r={3.6} gap={0.6} sage />
      {[60, 140, 200, 260, 340].map((x, i) => {
        const t = x / 400
        const y = (1 - t) * (1 - t) * 22 + 2 * (1 - t) * t * (22 + curve * 2) + t * t * 22
        return (
          <g key={x}>
            <LeafShape x={x - 4} y={y + 2} angle={150} size={13} />
            <LeafShape x={x + 4} y={y + 2} angle={30} size={13} />
            <RoseBloom x={x} y={y} r={7.5} tone={i % 2 ? "deep" : "mid"} />
          </g>
        )
      })}
    </svg>
  )
}

/** A climbing rose vine, for the sides of a framed section. */
export function RoseVine({ className, style, seed = 5, height = 400 }: Props & { seed?: number; height?: number }) {
  const rand = rng(seed * 15485863)
  const steps = Math.round(height / 32)
  return (
    <svg viewBox={`0 0 40 ${height}`} className={className} style={style} aria-hidden preserveAspectRatio="xMidYMid meet">
      <path
        d={`M20 0 ${Array.from({ length: steps }, (_, i) => `Q${i % 2 ? 30 : 10} ${i * 32 + 16} 20 ${(i + 1) * 32}`).join(" ")}`}
        fill="none"
        stroke={SILK.leafDark}
        strokeWidth="1.8"
        filter="url(#puffy)"
      />
      {Array.from({ length: steps }, (_, i) => (
        <g key={i}>
          <LeafShape x={20} y={i * 32 + 10} angle={i % 2 ? -30 : 210} size={10} />
          {i % 2 === 0 ? (
            <RoseBloom x={20 + (rand() - 0.5) * 8} y={i * 32 + 24} r={6 + rand() * 2} tone={rand() > 0.5 ? "deep" : "mid"} />
          ) : (
            <LeafShape x={20} y={i * 32 + 22} angle={i % 4 === 1 ? 20 : 160} size={9} />
          )}
        </g>
      ))}
    </svg>
  )
}

/** A full arch of roses, blossoms and wisteria, framing "Our Story". */
export function FloralArch({ className }: { className?: string }) {
  const rand = rng(77)
  const W = 300
  const H = 420
  const cx = W / 2
  const R = 130
  const top = 150
  const pts: [number, number, number][] = []
  // two straight legs and a semicircle on top
  for (let y = H - 10; y > top; y -= 13) {
    pts.push([cx - R, y, 180])
    pts.push([cx + R, y, 0])
  }
  const legPoints = pts.length
  for (let a = 180; a <= 360; a += 7) {
    const rad = (a * Math.PI) / 180
    pts.push([cx + Math.cos(rad) * R, top + Math.sin(rad) * R, a])
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      {pts.map(([x, y, a], i) => (
        <LeafShape key={`l${i}`} x={x + (rand() - 0.5) * 6} y={y} angle={a + 180 + (rand() - 0.5) * 120} size={11 + rand() * 5} />
      ))}
      {pts
        .filter((_, i) => i % 5 === 2)
        .map(([x, y], i) => (
          <Wisteria key={`w${i}`} x={x} y={y + 4} length={20 + rand() * 18} seed={i + 9} />
        ))}
      {pts.map(([x, y], i) =>
        // every other point down each leg (leg points alternate left/right), every other around the top
        (i < legPoints ? Math.floor(i / 2) % 2 : (i - legPoints) % 2) ? null : (
          <RoseBloom key={`r${i}`} x={x + (rand() - 0.5) * 8} y={y + (rand() - 0.5) * 6} r={6 + rand() * 4} tone={(["deep", "mid", "pale", "cream"] as Tone[])[Math.floor(rand() * 4)]} />
        ),
      )}
    </svg>
  )
}

/** A branch with long wisteria strands hanging like a curtain. */
export function HangingWisteria({ className, seed = 21 }: { className?: string; seed?: number }) {
  const rand = rng(seed * 31337)
  return (
    <svg viewBox="0 0 400 190" className={className} aria-hidden preserveAspectRatio="xMidYMin slice">
      <path d="M-5 12C100 22 300 2 405 14" fill="none" stroke={SILK.leafDark} strokeWidth="3" filter="url(#puffy)" />
      {Array.from({ length: 26 }, (_, i) => {
        const x = 4 + i * 15.5 + rand() * 5
        const len = 70 + rand() * 100
        return (
          <g key={i}>
            <path d={`M${x} 12V${12 + len}`} stroke={SILK.leaf} strokeWidth=".8" strokeOpacity=".7" />
            <LeafShape x={x} y={14 + rand() * 20} angle={60 + rand() * 60} size={8} />
            {i % 2 === 0 && <Wisteria x={x} y={18 + len * 0.45} length={len * 0.5} width={9} seed={i + seed} />}
            {i % 2 === 1 && <LeafShape x={x} y={20 + len * 0.6} angle={80 + rand() * 30} size={7} color={SILK.leafDark} />}
          </g>
        )
      })}
      {[60, 170, 250, 340].map((x, i) => (
        <RoseBloom key={x} x={x} y={13} r={8} tone={i % 2 ? "deep" : "pale"} />
      ))}
    </svg>
  )
}

/** Two swans whose necks make a heart, on a band of pearls. */
export function Swans({ className }: { className?: string }) {
  const swan = (
    <g filter="url(#relief)">
      {/* body and folded wing */}
      <path d="M38 118C20 118 6 108 4 94C26 102 46 100 60 92C74 84 86 86 96 96C104 104 102 116 88 120C72 124 52 120 38 118Z" fill="#fbf3f3" />
      <path d="M30 104C44 96 60 84 76 88C88 92 92 102 86 110C70 116 48 114 30 104Z" fill="#f3e3e5" stroke="#d9bcc4" strokeWidth="1" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${40 + i * 9} ${102 - i}c4 -4 8 -6 12 -6`} fill="none" stroke="#d6b5be" strokeWidth="1.1" strokeLinecap="round" />
      ))}
      {/* neck curving up and in, forming half a heart */}
      <path d="M92 100C100 84 104 66 98 50C92 34 76 30 70 42C66 50 72 56 80 54" fill="none" stroke="#fbf3f3" strokeWidth="9" strokeLinecap="round" />
      <path d="M92 100C100 84 104 66 98 50C92 34 76 30 70 42" fill="none" stroke="#d9bcc4" strokeWidth="1" strokeOpacity=".7" />
      {/* head and beak */}
      <ellipse cx="78" cy="56" rx="6.5" ry="5.5" fill="#fbf3f3" />
      <path d="M84 57l9 4-9 1z" fill="#3b2d33" />
      <circle cx="80" cy="54" r="1.1" fill="#3b2d33" />
    </g>
  )
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <g transform="translate(6 0)">{swan}</g>
      <g transform="translate(214 0) scale(-1 1)">{swan}</g>
      <PearlString from={[6, 132]} to={[214, 132]} sag={0} r={3.2} gap={0.5} />
      <PearlString from={[6, 140]} to={[214, 140]} sag={0} r={3.2} gap={0.5} sage />
    </svg>
  )
}

/** The château façade with its fountain, wisteria, hedges and rose borders. */
export function Chateau({ className }: { className?: string }) {
  const windows = (y: number, xs: number[], h = 26) =>
    xs.map((x) => (
      <g key={`${x}-${y}`}>
        <rect x={x - 10} y={y} width="6" height={h} fill={SILK.shutter} rx="1" />
        <rect x={x + 14} y={y} width="6" height={h} fill={SILK.shutter} rx="1" />
        <rect x={x - 3} y={y} width="16" height={h} fill="#5a4650" rx="1.5" />
        <path d={`M${x + 5} ${y}V${y + h}M${x - 3} ${y + h / 2}H${x + 13}`} stroke={SILK.stone} strokeWidth="1.2" />
      </g>
    ))
  const rand = rng(11)
  return (
    <svg viewBox="0 0 400 330" className={className} aria-hidden>
      {/* cypress trees */}
      {[18, 382].map((x) => (
        <path key={x} d={`M${x} 40C${x - 14} 90 ${x - 16} 170 ${x - 10} 200H${x + 10}C${x + 16} 170 ${x + 14} 90 ${x} 40Z`} fill={SILK.hedge} filter="url(#puffy)" />
      ))}
      <g filter="url(#relief)">
        {/* roofs */}
        <path d="M58 92L84 66H316L342 92Z" fill={SILK.roof} />
        <path d="M150 70L200 36L250 70Z" fill={SILK.roof} />
        {/* main block */}
        <rect x="56" y="90" width="288" height="118" fill={SILK.stone} />
        {/* centre bay with pediment */}
        <rect x="150" y="70" width="100" height="138" fill="#f6e6ea" />
        <path d="M146 72L200 40L254 72Z" fill="#f6e6ea" stroke={SILK.stoneShade} strokeWidth="2" />
        <circle cx="200" cy="60" r="7" fill={SILK.stoneShade} />
        {/* cornice lines */}
        <path d="M56 92H344M56 146H344M56 208H344" stroke={SILK.stoneShade} strokeWidth="3" />
      </g>
      {windows(100, [76, 116, 268, 308], 32)}
      {windows(100, [176, 214], 32)}
      {windows(158, [76, 116, 268, 308], 36)}
      {/* balcony */}
      <rect x="166" y="138" width="68" height="10" fill={SILK.stoneShade} filter="url(#puffy)" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={170 + i * 7.5} y="130" width="2.4" height="9" fill={SILK.stoneShade} />
      ))}
      {/* arched door */}
      <path d="M186 208V176A14 14 0 0 1 214 176V208Z" fill="#5a4650" filter="url(#puffy)" />
      <circle cx="166" cy="172" r="3" fill={SILK.gold} />
      <circle cx="234" cy="172" r="3" fill={SILK.gold} />
      {/* wisteria climbing the left wing */}
      <g>
        {Array.from({ length: 8 }, (_, i) => (
          <LeafShape key={i} x={60 + i * 9} y={96 + (i % 3) * 6} angle={rand() * 360} size={9} />
        ))}
        {[62, 74, 86, 98, 110].map((x, i) => (
          <Wisteria key={x} x={x} y={98 + (i % 2) * 6} length={26 + (i % 3) * 8} seed={x} />
        ))}
      </g>
      {/* hedges */}
      {[60, 110, 290, 340].map((x) => (
        <rect key={x} x={x - 26} y="204" width="52" height="22" rx="10" fill={SILK.hedge} filter="url(#puffy)" />
      ))}
      {/* steps and path */}
      <path d="M180 208H220L236 236H164Z" fill={SILK.stoneShade} filter="url(#relief)" />
      {/* fountain */}
      <g filter="url(#relief)">
        <ellipse cx="200" cy="262" rx="62" ry="16" fill={SILK.stoneShade} />
        <ellipse cx="200" cy="258" rx="54" ry="11" fill="#cfe0dc" />
        <rect x="195" y="226" width="10" height="32" fill={SILK.stone} />
        <ellipse cx="200" cy="230" rx="18" ry="5" fill={SILK.stone} />
      </g>
      <path d="M200 226C196 210 186 206 180 214M200 226C204 210 214 206 220 214M200 224V208" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".9" />
      {/* rose borders */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = 12 + i * 27 + rand() * 6
        const y = 296 + (i % 2) * 10 + rand() * 6
        return (
          <g key={i}>
            <LeafShape x={x - 6} y={y + 6} angle={150} size={12} />
            <LeafShape x={x + 6} y={y + 6} angle={30} size={12} />
            <RoseBloom x={x} y={y} r={11 + rand() * 4} tone={(["deep", "mid", "pale", "cream"] as Tone[])[i % 4]} />
          </g>
        )
      })}
      {[40, 130, 270, 360].map((x, i) => (
        <RoseBloom key={x} x={x} y={282} r={8} tone={i % 2 ? "pale" : "deep"} />
      ))}
    </svg>
  )
}

/** A small townhouse for the day-after venue. */
export function Townhouse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g filter="url(#relief)">
        <path d="M20 40L34 24H166L180 40Z" fill={SILK.roof} />
        <rect x="20" y="38" width="160" height="70" fill={SILK.stone} />
      </g>
      {[38, 70, 130, 162].map((x) => (
        <g key={x}>
          <rect x={x - 8} y="48" width="16" height="20" fill="#5a4650" rx="1" />
          <rect x={x - 8} y="78" width="16" height="22" fill="#5a4650" rx="1" />
        </g>
      ))}
      <path d="M88 108V84A12 12 0 0 1 112 84V108Z" fill="#5a4650" filter="url(#puffy)" />
      {[28, 50, 150, 172].map((x, i) => (
        <Wisteria key={x} x={x} y={40} length={22 + (i % 2) * 8} seed={x} />
      ))}
      {[30, 70, 130, 170].map((x, i) => (
        <rect key={x} x={x - 18} y="100" width="36" height="12" rx="6" fill={SILK.hedge} filter="url(#puffy)" style={{ opacity: i % 2 ? 0.9 : 1 }} />
      ))}
    </svg>
  )
}

/** The ornate monogram seal on the closed curtains. */
export function MonogramSeal({ text, className }: { text: string; className?: string }) {
  // a cartouche: rounded body with scalloped edges and scroll "ears"
  const scallops = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    return [100 + Math.cos(a) * 78, 120 + Math.sin(a) * 100] as const
  })
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden>
      <g filter="url(#relief)">
        {scallops.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="11" fill="#f3dde3" />
        ))}
        <ellipse cx="100" cy="120" rx="78" ry="100" fill="#f3dde3" />
      </g>
      <ellipse cx="100" cy="120" rx="68" ry="90" fill="none" stroke={SILK.gold} strokeWidth="2.2" />
      <ellipse cx="100" cy="120" rx="62" ry="84" fill="none" stroke={SILK.gold} strokeWidth=".9" />
      {/* scroll flourishes */}
      {[
        "M100 26c-10 0-16 8-10 14 4 4 10 0 8-4",
        "M100 26c10 0 16 8 10 14-4 4-10 0-8-4",
        "M100 214c-10 0-16-8-10-14 4-4 10 0 8 4",
        "M100 214c10 0 16-8 10-14-4-4-10 0-8 4",
        "M30 120c0-10 8-16 14-10 4 4 0 10-4 8",
        "M170 120c0-10-8-16-14-10-4 4 0 10 4 8",
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke={SILK.gold} strokeWidth="1.6" strokeLinecap="round" />
      ))}
      <text x="100" y="140" textAnchor="middle" fontFamily="var(--font-serif), serif" fontSize="58" fontStyle="italic" fill="#8a6a4a">
        {text}
      </text>
    </svg>
  )
}

/** Round wax-and-pearl medallion for the countdown numbers. */
export function Medallion({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-square", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <g filter="url(#relief)">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2
            return <circle key={i} cx={50 + Math.cos(a) * 44} cy={50 + Math.sin(a) * 44} r="5" fill="url(#pearl)" />
          })}
          <circle cx="50" cy="50" r="40" fill="url(#wax)" />
        </g>
        <circle cx="50" cy="50" r="33" fill="none" stroke="#b78b84" strokeWidth=".8" strokeDasharray="2 2" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

/** Timeline icons, in the same raised-thread style. */
export function TimelineIcon({ name, className }: { name: string; className?: string }) {
  const art: Record<string, React.ReactElement> = {
    chapel: (
      <g filter="url(#relief)">
        <path d="M14 30L32 14L50 30V56H14Z" fill={SILK.stone} />
        <path d="M10 32L32 12L54 32" fill="none" stroke={SILK.roof} strokeWidth="5" strokeLinejoin="round" />
        <path d="M26 56V42A6 6 0 0 1 38 42V56Z" fill="#5a4650" />
        <path d="M32 2V12M28 6H36" stroke={SILK.gold} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="32" cy="28" r="4" fill="#5a4650" />
        <rect x="8" y="50" width="12" height="8" rx="4" fill={SILK.hedge} />
        <rect x="44" y="50" width="12" height="8" rx="4" fill={SILK.hedge} />
      </g>
    ),
    rings: (
      <g filter="url(#puffy)">
        <circle cx="25" cy="36" r="13" fill="none" stroke={SILK.gold} strokeWidth="5" />
        <circle cx="40" cy="30" r="13" fill="none" stroke="#c9a874" strokeWidth="5" />
        <path d="M40 12l4 -5h-8z" fill="#ffffff" stroke="#d6c7b0" strokeWidth=".8" />
        <LeafShape x={8} y={52} angle={-20} size={12} />
        <RoseBloom x={50} y={50} r={6} tone="mid" />
      </g>
    ),
    coupe: (
      <g filter="url(#relief)">
        <path d="M14 18H50C50 30 42 36 32 36C22 36 14 30 14 18Z" fill="#f2e6c9" stroke={SILK.gold} strokeWidth="1.6" />
        <path d="M32 36V54M22 56H42" stroke={SILK.gold} strokeWidth="2.6" strokeLinecap="round" />
        {[22, 30, 38].map((x) => (
          <circle key={x} cx={x} cy={24 + (x % 3)} r="1.4" fill="#ffffff" />
        ))}
      </g>
    ),
    disco: (
      <g filter="url(#relief)">
        <path d="M32 2V14" stroke={SILK.gold} strokeWidth="1.6" />
        <circle cx="32" cy="34" r="20" fill="#e9dde2" />
        {Array.from({ length: 6 }, (_, r) =>
          Array.from({ length: 6 }, (_, c) => (
            <rect key={`${r}-${c}`} x={15 + c * 6} y={17 + r * 6} width="5" height="5" fill={(r + c) % 3 ? "#d8c6cd" : "#ffffff"} />
          )),
        )}
        <circle cx="32" cy="34" r="20" fill="none" stroke="#bfa8b1" strokeWidth="1.2" />
      </g>
    ),
    flutes: (
      <g filter="url(#relief)">
        <path d="M18 8H28L26 34H20Z" fill="#f2e6c9" stroke={SILK.gold} strokeWidth="1.4" transform="rotate(-14 23 30)" />
        <path d="M36 8H46L44 34H38Z" fill="#f2e6c9" stroke={SILK.gold} strokeWidth="1.4" transform="rotate(14 41 30)" />
        <path d="M22 34V52M17 54H27M42 34V52M37 54H47" stroke={SILK.gold} strokeWidth="2" strokeLinecap="round" />
        <path d="M30 6l2-4 2 4M32 10V4" stroke="#d9c49f" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    ),
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {art[name] ?? art.rings}
    </svg>
  )
}

/** A garment-and-bow-tie pairing for the dress code. */
export function DressCodeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden>
      {/* gown on a hanger */}
      <g filter="url(#relief)">
        <path d="M74 10c-6 0-8 8-2 10" fill="none" stroke={SILK.gold} strokeWidth="2" />
        <path d="M54 26L72 18L90 26" fill="none" stroke={SILK.gold} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M62 28C64 40 64 48 60 56L44 140H100L84 56C80 48 80 40 82 28C76 34 68 34 62 28Z" fill={SILK.rose} />
        <path d="M60 56C68 62 76 62 84 56" fill="none" stroke={SILK.roseDeep} strokeWidth="2" />
        {[52, 62, 72, 82, 92].map((x) => (
          <path key={x} d={`M${72 + (x - 72) * 0.2} 62L${x} 138`} stroke={SILK.roseDeep} strokeOpacity=".35" strokeWidth="1" />
        ))}
      </g>
      <RoseBloom x={78} y={58} r={5} tone="pale" />
      {/* tuxedo jacket */}
      <g filter="url(#relief)">
        <path d="M150 22L166 16L182 22L198 34L196 138H136L134 34Z" fill="#2f2a3d" />
        <path d="M150 22L166 70L182 22" fill="#f8f1f2" />
        <path d="M150 22L160 64L146 40ZM182 22L172 64L186 40Z" fill="#1f1b2a" />
        <circle cx="166" cy="84" r="2" fill={SILK.gold} />
        <circle cx="166" cy="98" r="2" fill={SILK.gold} />
      </g>
      {/* bow tie */}
      <g filter="url(#puffy)" transform="translate(166 34)">
        <path d="M0 0L-12 -7V7ZM0 0L12 -7V7Z" fill="#2f2a3d" />
        <circle r="3" fill="#2f2a3d" />
      </g>
      <RoseBloom x={182} y={44} r={4.5} tone="deep" />
      <LeafShape x={112} y={130} angle={-40} size={14} />
      <LeafShape x={122} y={132} angle={200} size={12} />
      <RoseBloom x={117} y={126} r={7} tone="mid" />
    </svg>
  )
}

/** A gift-card frame with a ribbon bow. */
export function RibbonBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden>
      <g filter="url(#puffy)">
        <path d="M60 30C44 10 22 10 24 26C26 38 46 36 60 30Z" fill="#ecd3da" stroke="#c99aa6" strokeWidth="1.2" />
        <path d="M60 30C76 10 98 10 96 26C94 38 74 36 60 30Z" fill="#ecd3da" stroke="#c99aa6" strokeWidth="1.2" />
        <path d="M58 32L44 58L52 56L60 34ZM62 32L76 58L68 56L60 34Z" fill="#e4c3cc" stroke="#c99aa6" strokeWidth="1" />
        <ellipse cx="60" cy="30" rx="7" ry="6" fill="#e4c3cc" stroke="#c99aa6" strokeWidth="1.2" />
      </g>
    </svg>
  )
}
