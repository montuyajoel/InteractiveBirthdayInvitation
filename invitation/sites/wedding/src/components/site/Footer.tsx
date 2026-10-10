import { CREDIT } from "@/config"
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
      <FloralBand edge="bottom" className="mx-auto mb-8 mt-2 block w-[115%] max-w-none -translate-x-[6.5%] sm:w-full sm:max-w-4xl sm:translate-x-0" />
      <p className="border-t border-brand/15 px-4 py-5 text-center text-xs tracking-wide text-muted-foreground">
        {CREDIT.text}{" "}
        <a href={`mailto:${CREDIT.email}`} className="text-brand underline-offset-4 hover:underline">
          {CREDIT.email}
        </a>
      </p>
    </footer>
  )
}
