import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff, Pause, Play, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { GALLERY_CHANGED, loadPhotos, type GalleryResult, type Photo } from "@/lib/gallery"
import { PHOTOS_ROUTE } from "@/lib/route"
import { cn } from "@/lib/utils"
import { Butterfly, SectionTitle } from "./Decor"
import { PhotoUpload } from "./PhotoUpload"

/** How many of the newest photos the home page shows. */
const PREVIEW_COUNT = 10

export type PhotosState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | ({ status: "ready" } & GalleryResult)

/** Loads the gallery and reloads whenever a guest shares new photos. */
export function usePhotos(): PhotosState {
  const [state, setState] = useState<PhotosState>({ status: "loading" })
  useEffect(() => {
    const load = () =>
      loadPhotos()
        .then((r) => setState({ status: "ready", ...r }))
        .catch((e: Error) => setState({ status: "error", message: e.message }))
    load()
    window.addEventListener(GALLERY_CHANGED, load)
    return () => window.removeEventListener(GALLERY_CHANGED, load)
  }, [])
  return state
}

/** Photo grid with loading/empty/error states and a full-screen lightbox. */
export function PhotoWall({
  state,
  limit,
  className,
}: {
  state: PhotosState
  limit?: number
  className?: string
}) {
  const [index, setIndex] = useState<number | null>(null)
  const all = state.status === "ready" ? state.photos : []
  const photos = limit ? all.slice(0, limit) : all

  return (
    <div className={className}>
      {state.status === "loading" && (
        <div className="columns-2 gap-4 md:columns-3">
          {[260, 340, 220, 300, 260, 320].map((h, i) => (
            <Skeleton key={i} className="mb-4 w-full rounded-none bg-soft/70" style={{ height: h }} />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <Empty icon={<ImageOff className="h-8 w-8" />} text="We couldn't load the photos right now. Please try again later." />
      )}

      {state.status === "ready" && photos.length === 0 && (
        <Empty icon={<Butterfly className="h-10 w-12" glow={false} />} text="No photos yet. Be the first to share one!" />
      )}

      {photos.length > 0 && (
        <ul className={cn("columns-2 gap-4 md:columns-3", !limit && "lg:columns-4")}>
          {photos.map((p, i) => (
            <li key={p.id} className="mb-4 break-inside-avoid">
              <Tile photo={p} index={i} onOpen={() => setIndex(i)} />
            </li>
          ))}
        </ul>
      )}

      <Lightbox photos={photos} index={index} onIndex={setIndex} />
    </div>
  )
}

export function Gallery() {
  const state = usePhotos()
  const total = state.status === "ready" ? state.photos.length : 0

  return (
    <section id="gallery" className="relative scroll-mt-16 border-t border-brand/20 bg-white/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow="Moments & memories" title="Gallery" />
          <p className="max-w-sm text-lg italic text-ink/80">
            {state.status === "ready" && state.source === "sample"
              ? "A preview of the gallery. Party photos will appear here once they're uploaded."
              : "The latest moments from our guests. Tap any photo to see it up close."}
          </p>
        </div>

        <PhotoWall state={state} limit={PREVIEW_COUNT} className="mt-12" />

        {total > PREVIEW_COUNT && (
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="gap-3 rounded-none px-8 uppercase tracking-[0.2em]">
              <a href={PHOTOS_ROUTE}>
                See all {total} photos <ArrowRight />
              </a>
            </Button>
          </div>
        )}

        <div className="paper mx-auto mt-14 max-w-xl border border-brand/25 p-6 shadow-[0_30px_60px_-40px_rgb(var(--c-ink)/0.6)] sm:p-8">
          <PhotoUpload />
        </div>
      </div>
    </section>
  )
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="grid place-items-center gap-3 border border-dashed border-brand/40 py-16 text-center text-brand">
      {icon}
      <p className="italic">{text}</p>
    </div>
  )
}

function Tile({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  // alternate a slight tilt so the grid feels like prints laid on a table
  const tilt = ["-rotate-[0.6deg]", "rotate-[0.5deg]", "rotate-0"][index % 3]

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative block w-full bg-white p-2 text-left shadow-[0_14px_30px_-20px_rgb(var(--c-ink)/0.6)] ring-1 ring-brand/15 transition duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_24px_40px_-20px_rgb(var(--c-ink)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        photo.caption ? "pb-9" : "pb-2",
        tilt,
      )}
      aria-label={photo.caption ? `Open photo: ${photo.caption}` : `Open photo ${index + 1}`}
    >
      <span
        className="relative block overflow-hidden bg-soft/60"
        // Reserve a 4:3 box until the real shape is known, so tiles don't collapse.
        style={{ aspectRatio: photo.ratio || (loaded ? undefined : 4 / 3) }}
      >
        {failed && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm italic text-muted-foreground">
            <ImageOff className="h-6 w-6" aria-hidden />
            Photo unavailable
          </span>
        )}
        <img
          src={photo.src}
          alt={photo.caption || `Party photo ${index + 1}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            // Usually a private bucket: public photo links only work when the
            // bucket is marked Public (supabase/gallery-setup.sql does this).
            console.error("Gallery photo failed to load (is the bucket public?):", photo.src)
            setFailed(true)
          }}
          className={cn(
            "block h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0",
            failed && "invisible",
          )}
        />
      </span>
      {photo.caption && (
        <span className="absolute inset-x-3 bottom-2 truncate font-script text-2xl text-brand">{photo.caption}</span>
      )}
    </button>
  )
}

function Lightbox({
  photos,
  index,
  onIndex,
}: {
  photos: Photo[]
  index: number | null
  onIndex: (i: number | null) => void
}) {
  const [playing, setPlaying] = useState(false)
  const touchX = useRef<number | null>(null)
  const open = index !== null
  const count = photos.length

  const go = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return
      onIndex((index + delta + count) % count)
    },
    [index, count, onIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
      if (e.key === " ") {
        e.preventDefault()
        setPlaying((p) => !p)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, go])

  useEffect(() => {
    if (!open || !playing) return
    const t = setInterval(() => go(1), 3500)
    return () => clearInterval(t)
  }, [open, playing, go])

  useEffect(() => {
    if (!open) setPlaying(false)
  }, [open])

  const photo = index !== null ? photos[index] : null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent
        className="flex h-[100dvh] max-h-none w-screen max-w-none flex-col gap-0 border-none bg-night/95 p-0 text-white sm:rounded-none [&>button.absolute]:hidden"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <DialogTitle className="font-script text-3xl font-normal text-soft">
            {photo?.caption || "Moments & memories"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Photo {index !== null ? index + 1 : 0} of {count}. Use arrow keys to browse.
          </DialogDescription>
          <div className="flex items-center gap-1">
            <span className="mr-3 text-xs uppercase tracking-[0.25em] text-white/60 tabular-nums">
              {index !== null ? index + 1 : 0} / {count}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
            <DialogClose asChild>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" aria-label="Close">
                <X />
              </Button>
            </DialogClose>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
          {photo && (
            <img
              key={photo.id}
              src={photo.src}
              alt={photo.caption || `Party photo ${(index ?? 0) + 1}`}
              className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-300"
            />
          )}
          <NavButton side="left" onClick={() => go(-1)} />
          <NavButton side="right" onClick={() => go(1)} />
        </div>

        <ol className="flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center">
          {photos.map((p, i) => (
            <li key={p.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onIndex(i)}
                className={cn(
                  "block h-14 w-14 overflow-hidden ring-1 transition sm:h-16 sm:w-16",
                  i === index ? "opacity-100 ring-2 ring-soft" : "opacity-50 ring-white/20 hover:opacity-90",
                )}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
              >
                <img src={p.src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  )
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 hidden -translate-y-1/2 p-3 text-white/70 transition hover:text-white sm:block",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      <Icon className="h-9 w-9" strokeWidth={1.2} />
    </button>
  )
}
