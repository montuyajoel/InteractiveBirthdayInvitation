// Shrinks a photo in the browser so it uploads as a JPEG under `maxBytes`.

const START_MAX_DIMENSION = 2048
const START_QUALITY = 0.85

async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number }> {
  try {
    // Honours the camera's EXIF rotation so portrait photos stay upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    return { source: bitmap, width: bitmap.width, height: bitmap.height }
  } catch {
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return { source: img, width: img.naturalWidth, height: img.naturalHeight }
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}

function toJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode image"))), "image/jpeg", quality),
  )
}

export async function resizeImage(file: File, maxBytes = 1_000_000): Promise<Blob> {
  const { source, width, height } = await decode(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not supported")

  let maxDimension = START_MAX_DIMENSION
  let quality = START_QUALITY
  for (let attempt = 0; attempt < 10; attempt++) {
    const scale = Math.min(1, maxDimension / Math.max(width, height))
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    // white backdrop so transparent PNGs don't turn black as JPEG
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height)

    const blob = await toJpeg(canvas, quality)
    if (blob.size < maxBytes) return blob

    // Trade a little quality first, then size.
    if (quality > 0.65) quality -= 0.1
    else maxDimension = Math.round(maxDimension * 0.8)
  }
  throw new Error("Photo is too large to shrink below 1 MB")
}
