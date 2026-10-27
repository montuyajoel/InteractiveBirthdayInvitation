import invitationCard from "@/assets/invitationCard"
import { EVENT } from "@/config"
import { HERO_CAR } from "@/lib/cars"
import { COPY, fill } from "@/lib/copy"
import { eventDateLongLabel, eventTimeLabel } from "@/lib/event"
import { ComicBurst, Flame } from "./Decor"

// The 1200×630 picture that link previews show (WhatsApp, Messenger,
// iMessage, Facebook…). Not linked from the site: scripts/share_image.mjs
// screenshots #/share-card into public/share.jpg, which index.html points
// og:image at. Re-run it whenever the names, date, venue or design change.
export function ShareCard() {
  return (
    <div className="relative h-[630px] w-[1200px] overflow-hidden bg-[radial-gradient(circle_at_70%_55%,#3d8bff_0%,#1257e6_30%,#0a2f9e_60%,#061a5c_100%)]">
      {/* die-cast backing card: sunburst rays and a flame edge */}
      <div className="absolute inset-[-400px] translate-x-[200px] translate-y-[40px] bg-[repeating-conic-gradient(from_0deg_at_50%_50%,rgb(255_255_255/0.075)_0_6deg,transparent_6deg_15deg)]" />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#e4002b] via-[#ff6a00] to-[#ffd400] [clip-path:polygon(0_100%,0_40%,4%_80%,7%_20%,11%_75%,15%_5%,18%_70%,23%_15%,26%_80%,31%_10%,34%_72%,39%_25%,43%_85%,48%_8%,51%_75%,56%_20%,59%_82%,64%_12%,68%_72%,73%_25%,76%_85%,81%_5%,84%_70%,89%_22%,93%_80%,97%_15%,100%_60%,100%_100%)]" />

      {/* name badge */}
      <div className="absolute left-[50px] top-[50px] -rotate-[5deg]">
        <div className="relative skew-x-[-12deg] rounded-[22px] border-[8px] border-[#ffd400] bg-gradient-to-b from-[#ff3b3b] via-[#e4002b] to-[#9e0018] px-12 py-3 shadow-[0_0_0_6px_#061a5c,10px_12px_0_6px_#061a5c]">
          <p className="skew-x-[12deg] font-script text-[112px] italic leading-none text-white [-webkit-text-stroke:6px_#061a5c] [paint-order:stroke_fill]">
            {EVENT.honoreeShort.toUpperCase()}
          </p>
        </div>
        <Flame className="absolute -right-10 -top-12 h-24 w-24 rotate-12" />
      </div>
      <div className="absolute left-[560px] top-[22px] h-[150px] w-[150px] rotate-12">
        <ComicBurst className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 grid place-items-center text-center font-script leading-[0.9] text-[#e4002b]">
          <div>
            <b className="block text-[56px] font-normal">
              8<sup className="text-[24px]">TH</sup>
            </b>
            <span className="block text-[15px] text-[#061a5c]">BIRTHDAY!</span>
          </div>
        </div>
      </div>

      <p className="absolute left-[60px] top-[268px] font-script text-[52px] text-white [-webkit-text-stroke:3px_#061a5c] [paint-order:stroke_fill] [text-shadow:0_5px_0_#061a5c]">
        IS TURNING 8!
      </p>

      {/* date panel */}
      <div className="absolute left-[60px] top-[355px] w-[540px] overflow-hidden rounded-[20px] border-[5px] border-[#ffd400] bg-gradient-to-b from-[#0b0f1f] to-[#161b33] px-7 pb-5 pt-7">
        <div className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,#ff6a00_0_34px,#ffd400_34px_68px)]" />
        <p className="whitespace-nowrap font-script text-[31px] leading-tight text-[#ffd400]">{eventDateLongLabel.toUpperCase()}</p>
        <p className="font-serif text-[30px] font-black tracking-wider text-white">{eventTimeLabel}</p>
        <p className="font-serif text-[26px] font-bold text-[#cfe1ff]">{EVENT.venue}</p>
      </div>

      {/* the car, on a spotlight */}
      <div className="absolute bottom-[50px] right-[20px] h-[160px] w-[580px] rounded-[50%] bg-[radial-gradient(ellipse,rgb(255_255_255/0.3),transparent_65%)]" />
      <img
        src={HERO_CAR.src}
        alt=""
        className="absolute bottom-[78px] right-[24px] w-[560px] drop-shadow-[0_22px_16px_rgb(0_0_0/0.55)]"
      />

      <div className="absolute right-[56px] top-[60px] rotate-[4deg] rounded-xl border-[5px] border-[#061a5c] bg-[#ffd400] px-5 py-1 font-script text-[34px] text-[#061a5c] shadow-[6px_6px_0_#061a5c]">
        {fill(COPY.shareHeadline).toUpperCase()}
      </div>

      {/* the printed card, small, for anyone who knows it */}
      <img
        src={invitationCard}
        alt=""
        className="absolute right-[40px] top-[150px] w-[110px] rotate-[6deg] rounded-sm shadow-[0_12px_24px_-8px_rgb(0_0_0/0.6)] ring-2 ring-white"
      />
    </div>
  )
}
