import invitationCard from "@/assets/invitationCard"
import { EVENT, WEDDING } from "@/config"
import { COPY, fill } from "@/lib/copy"
import { eventTimeLabel } from "@/lib/event"
import { PearlRope, RoseVine, WisteriaGarland } from "./Embroidery"

// The 1200×630 picture that link previews show (WhatsApp, Messenger,
// iMessage, Facebook…). Not linked from the site: scripts/share_image.mjs
// screenshots #/share-card into public/share.jpg, which index.html points
// og:image at. Re-run it whenever the names, date, venue or design change.
export function ShareCard() {
  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-[radial-gradient(ellipse_at_35%_40%,#fdf7f8_0%,#f5e6eb_60%,#ecd6de_100%)]">
      <WisteriaGarland className="absolute -top-4 left-0 w-[700px]" seed={8} />
      <RoseVine className="absolute left-4 top-24 h-[520px] w-10" height={520} />

      <div className="absolute left-[70px] top-[230px] w-[640px] text-center">
        <p className="font-script text-[72px] leading-none text-brand">{fill(COPY.shareHeadline)}</p>
        <p className="mt-5 font-serif text-[64px] leading-none text-ink">{EVENT.honoree}</p>
        <p className="mt-6 text-[22px] uppercase tracking-[0.24em] text-ink">
          {WEDDING.celebrate.date} · {eventTimeLabel}
        </p>
        <p className="mt-2 text-[19px] uppercase tracking-[0.24em] text-brand">
          {EVENT.venue} · Bourgogne
        </p>
        <PearlRope className="mx-auto mt-4 h-12 w-[420px]" curve={8} />
      </div>

      <div className="absolute right-[70px] top-1/2 w-[330px] -translate-y-1/2 rotate-[3deg] bg-white p-3 shadow-[0_30px_60px_-20px_rgb(var(--c-ink)/0.45)]">
        <img src={invitationCard} alt="" className="block w-full" />
      </div>
    </div>
  )
}
