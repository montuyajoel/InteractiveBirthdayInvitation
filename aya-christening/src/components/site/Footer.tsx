import { COPY, fill } from "@/lib/copy"
import { BabysBreath, Cloud, Dove, Sparkle } from "./Decor"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand/20 bg-white/50 py-16">
      <BabysBreath className="pointer-events-none absolute -bottom-6 left-2 w-24 opacity-90" />
      <BabysBreath className="pointer-events-none absolute -bottom-6 right-2 w-24 -scale-x-100 opacity-90" />
      <Cloud className="pointer-events-none absolute left-[18%] top-6 hidden w-24 animate-cloud-drift opacity-80 sm:block" />
      <Sparkle className="absolute right-[22%] top-8 h-6 w-6 animate-twinkle" />
      <Sparkle className="absolute left-[30%] bottom-10 h-4 w-4 animate-twinkle text-brand" style={{ animationDelay: "-1.2s" }} />
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="eyebrow">{fill(COPY.footerLine)}</p>
        <Dove className="mx-auto mt-4 h-10 w-14 animate-bob" />
        <p className="script foil mt-4 text-5xl">{fill(COPY.footerSignature)}</p>
      </div>
    </footer>
  )
}
