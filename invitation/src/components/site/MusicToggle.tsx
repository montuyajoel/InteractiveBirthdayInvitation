import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { musicBox } from "@/lib/music"

export function useMusicPlaying() {
  const [playing, setPlaying] = useState(musicBox.playing)
  useEffect(() => musicBox.subscribe(setPlaying), [])
  return playing
}

/** A small round button in the corner: plays or pauses the music-box lullaby. */
export function MusicToggle() {
  const playing = useMusicPlaying()
  if (!musicBox.supported) return null

  return (
    <button
      type="button"
      onClick={() => musicBox.toggle()}
      aria-pressed={playing}
      aria-label={playing ? "Pause the music" : "Play music"}
      title={playing ? "Pause the music" : "Play a music-box lullaby"}
      className={cn(
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 grid h-12 w-12 place-items-center rounded-full",
        "bg-[rgb(255_253_249/0.92)] text-brand shadow-[0_10px_24px_-10px_rgb(var(--c-ink)/0.55)] ring-1 ring-gold/60 backdrop-blur",
        "transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-14 sm:w-14",
      )}
    >
      {playing ? (
        // three little bars dancing to the tune
        <span className="flex h-5 items-end gap-[3px]" aria-hidden>
          {[0, 0.25, 0.5].map((d) => (
            <span
              key={d}
              className="music-bar w-[3px] rounded-full bg-brand"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" fill="rgb(var(--c-bloom))" />
          <circle cx="16.5" cy="16" r="2.5" fill="rgb(var(--c-bloom))" />
        </svg>
      )}
      {!playing && (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-gold ring-2 ring-white" aria-hidden />
      )}
    </button>
  )
}
