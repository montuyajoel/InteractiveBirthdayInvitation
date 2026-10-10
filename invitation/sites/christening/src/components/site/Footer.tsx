import { CREDIT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { Balloons, Butterfly, Cross, FloralSpray, Sparkle, garland } from "./Decor"

const LEFT = garland([[20, 120], [50, 100], [10, 80], [80, 120], [40, 60]], 31, 0.9)
const RIGHT = garland([[100, 120], [70, 104], [110, 80], [40, 122], [84, 64]], 37, 0.9)

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand/20 bg-white/50 py-16">
      <Balloons balloons={LEFT} viewBox="0 0 120 140" className="pointer-events-none absolute -bottom-4 -left-6 w-28 sm:w-36" />
      <Balloons balloons={RIGHT} viewBox="0 0 120 140" className="pointer-events-none absolute -bottom-4 -right-6 w-28 sm:w-36" />
      <FloralSpray className="pointer-events-none absolute -top-2 left-[14%] hidden w-28 opacity-90 sm:block" />
      <Butterfly className="absolute right-[20%] top-6 hidden h-10 w-12 animate-drift sm:block" />
      <Sparkle className="absolute left-[30%] bottom-10 h-4 w-4 animate-twinkle" style={{ animationDelay: "-1.2s" }} />
      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Cross className="mx-auto h-8 w-6" />
        <p className="eyebrow mt-4">{fill(COPY.footerLine)}</p>
        <p className="script foil mt-4 text-6xl">{fill(COPY.footerSignature)}</p>
      </div>
      <p className="border-t border-brand/15 px-4 py-5 text-center text-xs tracking-wide text-muted-foreground">
        {CREDIT.text}{" "}
        <a href={`mailto:${CREDIT.email}`} className="text-brand underline-offset-4 hover:underline">
          {CREDIT.email}
        </a>
      </p>
    </footer>
  )
}
