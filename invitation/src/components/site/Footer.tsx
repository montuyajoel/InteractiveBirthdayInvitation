import { EVENT } from "@/config"
import { BabysBreath, Heart } from "./Decor"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-mauve/20 bg-white/50 py-16">
      <BabysBreath className="pointer-events-none absolute -bottom-6 left-2 w-24 opacity-90" />
      <BabysBreath className="pointer-events-none absolute -bottom-6 right-2 w-24 -scale-x-100 opacity-90" />
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="eyebrow">We can't wait to celebrate with you</p>
        <Heart className="mx-auto mt-3 h-5 w-5" filled />
        <p className="script mt-4 text-5xl">{EVENT.celebrant} · {EVENT.age}</p>
      </div>
    </footer>
  )
}
