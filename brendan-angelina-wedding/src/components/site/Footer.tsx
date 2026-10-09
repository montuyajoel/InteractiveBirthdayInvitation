import { COPY, fill } from "@/lib/copy"
import { FloralBand, Heart } from "./Decor"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand/20 bg-white/50 pt-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="eyebrow">{fill(COPY.footerLine)}</p>
        <Heart className="mx-auto mt-3 h-5 w-5" filled />
        <p className="script mt-4 text-5xl">{fill(COPY.footerSignature)}</p>
      </div>
      <FloralBand edge="bottom" className="mx-auto mt-6 block w-full max-w-5xl" />
    </footer>
  )
}
