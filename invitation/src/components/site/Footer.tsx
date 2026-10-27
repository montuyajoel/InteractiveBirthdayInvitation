import { CREDIT } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { BabysBreath, Heart } from "./Decor"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand/20 bg-white/[0.03] pt-16 pb-5">
      <BabysBreath className="pointer-events-none absolute -bottom-6 left-2 hidden w-24 opacity-90 sm:block" />
      <BabysBreath className="pointer-events-none absolute -bottom-6 right-2 hidden w-24 -scale-x-100 opacity-90 sm:block" />
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="eyebrow">{fill(COPY.footerLine)}</p>
        <Heart className="mx-auto mt-3 h-5 w-5" filled />
        <p className="script mt-4 text-5xl">{fill(COPY.footerSignature)}</p>
      </div>
      <p className="mt-12 border-t border-brand/15 px-4 pt-5 text-center text-xs tracking-wide text-ink/70">
        {CREDIT.text}{" "}
        <a href={`mailto:${CREDIT.email}`} className="inline-block text-brand underline-offset-4 hover:underline">
          {CREDIT.email}
        </a>
      </p>
    </footer>
  )
}
