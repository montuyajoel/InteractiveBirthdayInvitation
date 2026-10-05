import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENT } from "@/config"
import { HeartRule } from "./Decor"
import { PhotoWall, usePhotos } from "./Gallery"
import { PhotoUpload } from "./PhotoUpload"

/** Every photo in the gallery, newest first (route: #/photos). */
export function PhotosPage() {
  const state = usePhotos()
  const total = state.status === "ready" ? state.photos.length : null

  return (
    <main className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Button asChild variant="ghost" className="-ml-3 gap-2 rounded-none text-mauve hover:bg-blush/50 hover:text-plum">
          <a href="#gallery">
            <ArrowLeft /> Back to the invitation
          </a>
        </Button>

        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end">
          <div>
            <p className="eyebrow">
              {EVENT.celebrant} · {EVENT.age}
            </p>
            <h1 className="script mt-2 text-6xl sm:text-7xl">All photos</h1>
            <HeartRule className="mt-4" />
            <p className="mt-4 text-lg italic text-plum/80">
              {total === null ? "Loading the memories…" : `${total} photo${total === 1 ? "" : "s"}, newest first.`}
            </p>
          </div>
          <div className="paper border border-mauve/25 p-5 sm:p-6">
            <PhotoUpload />
          </div>
        </div>

        <PhotoWall state={state} className="mt-12" />
      </div>
    </main>
  )
}
