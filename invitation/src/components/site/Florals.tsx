import { cn } from "@/lib/utils"

// Hand-drawn white peonies, hydrangea, eucalyptus and ferns echoing the
// printed card. Every stem sways from its base; peonies breathe slowly.
// Motion stops under prefers-reduced-motion (see index.css).

type Pt = [number, number]

const C = {
  petal: "#fdfdf9",
  petal2: "#f6f5ec",
  petal3: "#efeddf",
  petalEdge: "#d9ded0",
  stamen: "#e2b23c",
  stamenDark: "#c4932b",
  fern: "#7d9a78",
  fernLight: "#9db59a",
  euca: "#93ad9f",
  eucaDark: "#6f8d80",
  stem: "#7b8a6e",
  leaf: "#3f6136",
  leafLight: "#5e7f52",
  willow: "#6f9a5c",
  berry: "#a5b95c",
}

// Deterministic jitter so the drawing is identical on every render.
const jit = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x) - 0.5
}

const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
]
const angle = (a: Pt, c: Pt, b: Pt, t: number) =>
  Math.atan2(2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]))
const deg = (r: number) => (r * 180) / Math.PI
const curve = (a: Pt, c: Pt, b: Pt) => `M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`

type Stem = { a: Pt; c: Pt; b: Pt }

/** Sways around the stem's base. */
function Sway({ origin, delay = 0, slow = false, children }: { origin: Pt; delay?: number; slow?: boolean; children: React.ReactNode }) {
  return (
    <g
      className={slow ? "animate-sway-slow" : "animate-sway-soft"}
      style={{ transformOrigin: `${origin[0]}px ${origin[1]}px`, animationDelay: `${delay}s` }}
    >
      {children}
    </g>
  )
}

function Fern({ a, c, b, n = 16, len = 30, color = C.fern }: Stem & { n?: number; len?: number; color?: string }) {
  const leaflets = []
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1)
    const p = quad(a, c, b, t)
    const ang = angle(a, c, b, t)
    const l = len * (1 - t * 0.65)
    for (const side of [-1, 1]) {
      const d = ang + side * 1.05
      const cx = p[0] + (Math.cos(d) * l) / 2
      const cy = p[1] + (Math.sin(d) * l) / 2
      leaflets.push(
        <ellipse key={`${i}${side}`} cx={cx} cy={cy} rx={l / 2} ry={l / 5} transform={`rotate(${deg(d)} ${cx} ${cy})`} />,
      )
    }
  }
  return (
    <g fill={color}>
      <path d={curve(a, c, b)} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {leaflets}
    </g>
  )
}

function Eucalyptus({ a, c, b, n = 7, r = 15 }: Stem & { n?: number; r?: number }) {
  const leaves = []
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.6)
    const p = quad(a, c, b, t)
    const ang = angle(a, c, b, t) + (i % 2 ? 1.4 : -1.4)
    const rr = r * (1 - t * 0.35)
    const cx = p[0] + Math.cos(ang) * rr * 0.95
    const cy = p[1] + Math.sin(ang) * rr * 0.95
    leaves.push(
      <g key={i}>
        <path d={`M${p[0]} ${p[1]}L${cx} ${cy}`} stroke={C.stem} strokeWidth="1.2" />
        <ellipse cx={cx} cy={cy} rx={rr} ry={rr * 0.86} fill={i % 3 ? C.euca : C.eucaDark} opacity=".95" />
        <path d={`M${p[0]} ${p[1]}L${cx + (cx - p[0]) * 0.6} ${cy + (cy - p[1]) * 0.6}`} stroke="#fff" strokeOpacity=".25" strokeWidth=".8" />
      </g>,
    )
  }
  return (
    <g>
      <path d={curve(a, c, b)} stroke={C.stem} strokeWidth="2" fill="none" strokeLinecap="round" />
      {leaves}
    </g>
  )
}

function Willow({ a, c, b, n = 7, len = 46 }: Stem & { n?: number; len?: number }) {
  const leaves = []
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.5)
    const p = quad(a, c, b, t)
    const d = angle(a, c, b, t) + (i % 2 ? 0.55 : -0.55)
    const l = len * (1 - t * 0.3)
    leaves.push(<Leaf key={i} x={p[0]} y={p[1]} len={l} w={l * 0.22} rot={deg(d) + 90} fill={i % 2 ? C.willow : C.leafLight} rib={false} />)
  }
  return (
    <g>
      <path d={curve(a, c, b)} stroke={C.stem} strokeWidth="1.4" fill="none" />
      {leaves}
      <Leaf x={b[0]} y={b[1]} len={len * 0.7} w={len * 0.16} rot={deg(angle(a, c, b, 1)) + 90} fill={C.willow} rib={false} />
    </g>
  )
}

/** Pointed leaf whose base is at (x, y), pointing along rot (0 = up). */
function Leaf({ x, y, len, w, rot, fill = C.leaf, rib = true }: { x: number; y: number; len: number; w: number; rot: number; fill?: string; rib?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0Q${w} ${-len * 0.45} 0 ${-len}Q${-w} ${-len * 0.45} 0 0z`} fill={fill} />
      {rib && <path d={`M0 0Q${w * 0.12} ${-len * 0.5} 0 ${-len * 0.92}`} stroke="#fff" strokeOpacity=".28" strokeWidth="1" fill="none" />}
    </g>
  )
}

function Berries({ a, c, b }: Stem) {
  const out = []
  for (let i = 1; i <= 5; i++) {
    const t = i / 5.5
    const p = quad(a, c, b, t)
    const d = angle(a, c, b, t) + (i % 2 ? 0.9 : -0.9)
    const e: Pt = [p[0] + Math.cos(d) * 18, p[1] + Math.sin(d) * 18]
    out.push(
      <g key={i}>
        <path d={`M${p[0]} ${p[1]}L${e[0]} ${e[1]}`} stroke={C.stem} strokeWidth="1" />
        <circle cx={e[0]} cy={e[1]} r="5.5" fill={C.berry} />
        <circle cx={e[0] - 1.6} cy={e[1] - 1.6} r="1.6" fill="#fff" opacity=".45" />
      </g>,
    )
  }
  return (
    <g>
      <path d={curve(a, c, b)} stroke={C.stem} strokeWidth="1.3" fill="none" />
      {out}
    </g>
  )
}

function ring(count: number, dist: number, rx: number, ry: number, fill: string, seed: number, r: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (360 / count) * i + jit(seed + i) * 18
    const d = dist * r * (1 + jit(seed + i + 50) * 0.15)
    return (
      <ellipse
        key={`${seed}-${i}`}
        cx="0"
        cy={-d}
        rx={rx * r * (1 + jit(seed + i + 90) * 0.12)}
        ry={ry * r}
        transform={`rotate(${a})`}
        fill={fill}
        stroke={C.petalEdge}
        strokeWidth="1.1"
      />
    )
  })
}

/** Open white peony with a golden centre, or a ruffled one without. */
function Peony({ x, y, r, rot = 0, open = true, delay = 0 }: { x: number; y: number; r: number; rot?: number; open?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="animate-breathe" style={{ transformOrigin: "0 0", animationDelay: `${delay}s` }}>
        <circle r={r * 1.02} fill="#e6eadf" opacity=".55" />
        {ring(9, 0.5, 0.42, 0.55, C.petal, 1 + r, r)}
        {ring(8, 0.32, 0.33, 0.42, C.petal2, 20 + r, r)}
        {open ? (
          <>
            {ring(5, 0.2, 0.22, 0.26, C.petal3, 40 + r, r)}
            {Array.from({ length: 22 }, (_, i) => {
              const a = (i / 22) * Math.PI * 2
              const d = r * (0.1 + (i % 3) * 0.035)
              return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={r * 0.028} fill={i % 2 ? C.stamen : C.stamenDark} />
            })}
            <circle r={r * 0.07} fill="#d9e2b5" />
          </>
        ) : (
          <>
            {ring(7, 0.18, 0.24, 0.3, C.petal, 60 + r, r)}
            {ring(5, 0.08, 0.16, 0.2, C.petal2, 80 + r, r)}
          </>
        )}
      </g>
    </g>
  )
}

function Hydrangea({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 22 }, (_, i) => {
        const a = i * 2.4
        const d = r * Math.sqrt((i + 0.5) / 22) * 0.9
        const fx = Math.cos(a) * d
        const fy = Math.sin(a) * d
        const s = r * 0.24
        return (
          <g key={i} transform={`translate(${fx} ${fy}) rotate(${i * 23})`}>
            {[0, 90, 180, 270].map((p) => (
              <ellipse key={p} cx="0" cy={-s * 0.6} rx={s * 0.5} ry={s * 0.65} transform={`rotate(${p})`} fill={i % 3 ? C.petal : C.petal2} stroke={C.petalEdge} strokeWidth=".8" />
            ))}
            <circle r={s * 0.16} fill="#c8d4b6" />
          </g>
        )
      })}
    </g>
  )
}

/** One side of the spray, drawn for the left; the right side mirrors it. */
function Side({ mirror = false }: { mirror?: boolean }) {
  const o: Pt = [450, 40]
  return (
    <g transform={mirror ? "translate(900 0) scale(-1 1)" : undefined}>
      <Sway origin={o} delay={mirror ? -2 : 0} slow>
        <Fern a={o} c={[260, 10]} b={[60, 130]} n={26} len={44} />
      </Sway>
      <Sway origin={o} delay={mirror ? -1 : -3}>
        <Willow a={o} c={[300, 60]} b={[140, 220]} n={8} len={54} />
      </Sway>
      <Sway origin={o} delay={mirror ? -4 : -1.5}>
        <Eucalyptus a={o} c={[330, 120]} b={[200, 270]} n={9} r={22} />
      </Sway>
      <Sway origin={o} delay={mirror ? -0.5 : -2.5} slow>
        <Fern a={o} c={[380, 150]} b={[320, 315]} n={18} len={34} color={C.fernLight} />
      </Sway>
      <Sway origin={o} delay={mirror ? -3 : -0.8}>
        <Eucalyptus a={o} c={[240, 60]} b={[110, 70]} n={8} r={18} />
      </Sway>
    </g>
  )
}

/** The arch of white flowers and greenery along an edge of the page. */
export function FloralSpray({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 900 330" className={cn("pointer-events-none select-none overflow-visible", className)} aria-hidden>
      <g transform={flip ? "translate(0 330) scale(1 -1)" : undefined}>
        <Side />
        <Side mirror />
        <Sway origin={[560, 60]} delay={-1.2}>
          <Berries a={[560, 60]} c={[680, 90]} b={[700, 190]} />
        </Sway>
        <Leaf x={400} y={120} len={150} w={52} rot={-118} />
        <Leaf x={520} y={140} len={140} w={50} rot={150} fill={C.leafLight} />
        <Leaf x={640} y={120} len={120} w={44} rot={125} />
        <Leaf x={380} y={150} len={110} w={40} rot={-160} fill={C.leafLight} />
        <Leaf x={560} y={170} len={100} w={36} rot={200} />
        <Leaf x={420} y={110} len={120} w={42} rot={-125} />
        <Leaf x={500} y={120} len={110} w={40} rot={140} fill={C.leafLight} />
        <Leaf x={470} y={150} len={95} w={34} rot={185} />
        <Leaf x={600} y={100} len={90} w={32} rot={115} />
        <Leaf x={300} y={100} len={80} w={28} rot={-100} fill={C.leafLight} />
        <Hydrangea x={290} y={165} r={56} />
        <Hydrangea x={650} y={180} r={50} />
        <Peony x={360} y={90} r={68} rot={20} open={false} delay={-2} />
        <Peony x={555} y={95} r={90} rot={-8} delay={0} />
        <Peony x={445} y={175} r={52} rot={40} open={false} delay={-4} />
        <Peony x={700} y={70} r={42} rot={-30} open={false} delay={-1} />
      </g>
    </svg>
  )
}

/** A small bouquet for side panels. */
export function CornerBouquet({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const o: Pt = [120, 230]
  return (
    <svg viewBox="0 0 240 240" className={cn("pointer-events-none select-none overflow-visible", className)} style={style} aria-hidden>
      <Sway origin={o} slow>
        <Fern a={o} c={[60, 160]} b={[20, 60]} n={14} len={26} />
      </Sway>
      <Sway origin={o} delay={-2}>
        <Eucalyptus a={o} c={[190, 170]} b={[215, 70]} n={6} r={14} />
      </Sway>
      <Sway origin={o} delay={-1}>
        <Willow a={o} c={[120, 120]} b={[110, 20]} n={6} len={36} />
      </Sway>
      <Leaf x={120} y={150} len={70} w={26} rot={-40} />
      <Leaf x={125} y={150} len={64} w={24} rot={35} fill={C.leafLight} />
      <Hydrangea x={160} y={140} r={30} />
      <Peony x={100} y={120} r={52} rot={10} />
    </svg>
  )
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: ((i * 37 + 11) % 100) + jit(i) * 6,
  size: 10 + ((i * 7) % 10),
  duration: 11 + (i % 5) * 2.5,
  delay: -i * 1.7,
  leaf: i % 4 === 3,
}))

/** White petals (and the odd eucalyptus leaf) drifting down the section. */
export function PetalFall({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute -top-8 block animate-petal-fall"
          style={{ left: `${p.left}%`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
        >
          <svg viewBox="0 0 20 24" width={p.size} height={p.size * 1.2} className="animate-petal-spin" style={{ animationDuration: `${p.duration / 3}s` }}>
            {p.leaf ? (
              <ellipse cx="10" cy="12" rx="8" ry="7" fill={C.euca} opacity=".85" />
            ) : (
              <path d="M10 23C3 18 1 11 4 5c2-4 10-4 12 0 3 6 1 13-6 18z" fill={C.petal} stroke={C.petalEdge} strokeWidth="1" />
            )}
          </svg>
        </span>
      ))}
    </div>
  )
}
