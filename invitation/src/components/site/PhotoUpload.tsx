import { useEffect, useRef, useState } from "react"
import { Check, ImagePlus, Loader2, X } from "lucide-react"
import { GALLERY_CHANGED, galleryConnected, uploadPhoto } from "@/lib/gallery"
import { resizeImage } from "@/lib/resizeImage"
import { cn } from "@/lib/utils"

const MAX_FILES = 10
const MAX_ORIGINAL_BYTES = 40_000_000

type Item = {
  id: string
  preview: string
  name: string
  status: "resizing" | "uploading" | "done" | "error"
  size?: number
  error?: string
}

const formatSize = (bytes: number) => `${(bytes / 1_000_000).toFixed(bytes < 100_000 ? 2 : 1)} MB`

export function PhotoUpload({ guestFirstName }: { guestFirstName: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previews = useRef<string[]>([])

  useEffect(() => () => previews.current.forEach(URL.revokeObjectURL), [])

  const update = (id: string, patch: Partial<Item>) =>
    setItems((all) => all.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  async function handleFiles(list: FileList | null) {
    if (!list) return
    const files = Array.from(list)
      .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
      .slice(0, MAX_FILES)
    if (files.length === 0) return

    const batch = files.map((file) => {
      const preview = URL.createObjectURL(file)
      previews.current.push(preview)
      return { file, item: { id: crypto.randomUUID(), preview, name: file.name, status: "resizing" } as Item }
    })
    setItems((all) => [...batch.map((b) => b.item), ...all])

    let uploaded = 0
    // One at a time keeps phones responsive and the network calm.
    for (const { file, item } of batch) {
      try {
        if (file.size > MAX_ORIGINAL_BYTES) throw new Error("File is too large")
        const small = await resizeImage(file)
        update(item.id, { status: "uploading", size: small.size })
        await uploadPhoto(small, guestFirstName)
        update(item.id, { status: "done" })
        uploaded++
      } catch (err) {
        const msg =
          err instanceof Error && /decode|source image|encode/i.test(err.message)
            ? "This photo format isn't supported. Try a JPEG or PNG."
            : err instanceof Error && err.message.startsWith("Upload failed")
              ? "Upload failed. Please try again."
              : err instanceof Error
                ? err.message
                : "Something went wrong"
        update(item.id, { status: "error", error: msg })
      }
    }
    if (uploaded > 0) window.dispatchEvent(new Event(GALLERY_CHANGED))
    if (inputRef.current) inputRef.current.value = ""
  }

  if (!galleryConnected) {
    return (
      <p className="mt-8 border-t border-mauve/20 pt-6 text-sm italic text-muted-foreground">
        Photo sharing opens once the gallery is connected.
      </p>
    )
  }

  const busy = items.some((i) => i.status === "resizing" || i.status === "uploading")
  const doneCount = items.filter((i) => i.status === "done").length

  return (
    <div className="mt-10 border-t border-mauve/20 pt-8 text-left">
      <p className="eyebrow text-center">Share your photos</p>
      <p className="mx-auto mt-2 max-w-sm text-center italic text-plum/80">
        Add your favourite snaps for the gallery. We'll shrink them for you before they upload.
      </p>

      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "mt-5 flex cursor-pointer flex-col items-center gap-2 border border-dashed px-4 py-7 text-center text-mauve transition",
          dragging ? "border-mauve bg-blush/50" : "border-mauve/45 bg-white/50 hover:bg-blush/30",
        )}
      >
        <ImagePlus className="h-7 w-7" strokeWidth={1.3} aria-hidden />
        <span className="text-sm uppercase tracking-[0.2em]">Choose photos</span>
        <span className="text-xs italic text-muted-foreground">Up to {MAX_FILES} at a time · tap or drop here</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {items.length > 0 && (
        <>
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {items.map((it) => (
              <li key={it.id} className="relative bg-white p-1 shadow-sm ring-1 ring-mauve/15">
                <img
                  src={it.preview}
                  alt=""
                  className={cn("aspect-square w-full object-cover", it.status !== "done" && "opacity-60")}
                />
                <span
                  className={cn(
                    "absolute inset-1 grid place-items-center",
                    it.status === "done" && "place-items-end justify-items-end p-1",
                  )}
                  title={it.error ?? it.name}
                >
                  {it.status === "resizing" || it.status === "uploading" ? (
                    <Loader2 className="h-6 w-6 animate-spin text-plum" aria-label={it.status} />
                  ) : it.status === "done" ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-mauve text-white">
                      <Check className="h-4 w-4" aria-label="Uploaded" />
                    </span>
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-destructive text-white">
                      <X className="h-4 w-4" aria-label="Failed" />
                    </span>
                  )}
                </span>
                {it.size !== undefined && it.status !== "error" && (
                  <span className="absolute bottom-1 left-1 bg-white/85 px-1 text-[0.6rem] tabular-nums text-plum">
                    {formatSize(it.size)}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 text-center text-sm" aria-live="polite">
            {busy ? (
              <p className="italic text-mauve">Uploading…</p>
            ) : doneCount > 0 ? (
              <p className="italic text-mauve">
                {doneCount} photo{doneCount === 1 ? "" : "s"} shared. Thank you!{" "}
                <a href="#gallery" className="underline underline-offset-4">
                  See the gallery
                </a>
              </p>
            ) : null}
            {items
              .filter((i) => i.status === "error")
              .map((i) => (
                <p key={i.id} className="text-destructive">
                  {i.name}: {i.error}
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
