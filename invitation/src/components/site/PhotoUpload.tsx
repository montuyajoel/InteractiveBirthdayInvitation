import { useEffect, useRef, useState } from "react"
import { Check, ImagePlus, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GALLERY_CHANGED, galleryConnected, uploadPhoto } from "@/lib/gallery"
import { rememberUploaderName, rememberedUploaderName } from "@/lib/guest"
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

/**
 * Lets anyone add photos to the gallery. Pass `guestName` when we already
 * know who's uploading (e.g. right after registering); otherwise the panel
 * asks for a name first.
 */
export function PhotoUpload({ guestName, className }: { guestName?: string; className?: string }) {
  const askName = guestName === undefined
  const [name, setName] = useState(() => (askName ? rememberedUploaderName() : ""))
  const [nameError, setNameError] = useState(false)
  const uploaderName = (askName ? name : guestName).trim()
  const [items, setItems] = useState<Item[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previews = useRef<string[]>([])

  useEffect(() => () => previews.current.forEach(URL.revokeObjectURL), [])

  const update = (id: string, patch: Partial<Item>) =>
    setItems((all) => all.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  function needName() {
    if (uploaderName) return false
    setNameError(true)
    return true
  }

  async function handleFiles(list: FileList | null) {
    const files = list ? Array.from(list) : []
    // Reset the picker so choosing the same photo again still fires a change.
    if (inputRef.current) inputRef.current.value = ""
    if (files.length === 0 || needName()) return
    if (askName) rememberUploaderName(uploaderName)
    const images = files
      .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
      .slice(0, MAX_FILES)
    if (images.length === 0) return

    const batch = images.map((file) => {
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
        await uploadPhoto(small, uploaderName)
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
  }

  if (!galleryConnected) {
    return (
      <p className={cn("text-sm italic text-muted-foreground", className)}>
        Photo sharing opens once the gallery is connected.
      </p>
    )
  }

  const busy = items.some((i) => i.status === "resizing" || i.status === "uploading")
  const doneCount = items.filter((i) => i.status === "done").length

  return (
    <div className={cn("text-left", className)}>
      <p className="eyebrow text-center">Share your photos</p>
      <p className="mx-auto mt-2 max-w-sm text-center italic text-ink/80">
        Add your favourite snaps for the gallery. We'll shrink them for you before they upload.
      </p>

      {askName && (
        <div className="mx-auto mt-5 max-w-sm">
          <label htmlFor="uploader-name" className="eyebrow text-[0.7rem]">
            Your name
          </label>
          <Input
            id="uploader-name"
            value={name}
            maxLength={40}
            autoComplete="name"
            placeholder="So we know who to thank"
            aria-invalid={nameError}
            onChange={(e) => {
              setName(e.target.value)
              if (e.target.value.trim()) setNameError(false)
            }}
            className="mt-1 rounded-none border-0 border-b border-brand/40 bg-transparent px-0 text-lg shadow-none placeholder:italic placeholder:text-brand/50 focus-visible:border-brand focus-visible:ring-0"
          />
          {nameError && <p className="mt-1 text-sm text-destructive">Please tell us your name first.</p>}
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onClick={(e) => {
          if (needName()) e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "mt-5 flex cursor-pointer flex-col items-center gap-2 border border-dashed px-4 py-7 text-center text-brand transition",
          dragging ? "border-brand bg-highlight/50" : "border-brand/45 bg-soft/50 hover:bg-highlight/30",
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
              <li key={it.id} className="relative bg-soft p-1 shadow-sm ring-1 ring-brand/15">
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
                    <Loader2 className="h-6 w-6 animate-spin text-ink" aria-label={it.status} />
                  ) : it.status === "done" ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-paper">
                      <Check className="h-4 w-4" aria-label="Uploaded" />
                    </span>
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-destructive text-white">
                      <X className="h-4 w-4" aria-label="Failed" />
                    </span>
                  )}
                </span>
                {it.size !== undefined && it.status !== "error" && (
                  <span className="absolute bottom-1 left-1 bg-soft/85 px-1 text-[0.6rem] tabular-nums text-ink">
                    {formatSize(it.size)}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 text-center text-sm" aria-live="polite">
            {busy ? (
              <p className="italic text-brand">Uploading…</p>
            ) : doneCount > 0 ? (
              <p className="italic text-brand">
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
