// Studio renders of a Ferrari 458 Italia in four paint colours, side view,
// on transparent backgrounds (cars face right). Rendered with three.js from
// the "Ferrari 458 Italia" 3D model by vicent091036 (Sketchfab, via the
// three.js examples); see the credit in README.md.
import heroRosso from "@/assets/cars/hero-rosso.webp"
import sideArancio from "@/assets/cars/side-arancio.webp"
import sideBlu from "@/assets/cars/side-blu.webp"
import sideGiallo from "@/assets/cars/side-giallo.webp"
import sideRosso from "@/assets/cars/side-rosso.webp"

export type CarModel = "rosso" | "giallo" | "blu" | "arancio"

export const CARS: Record<CarModel, { label: string; src: string }> = {
  rosso: { label: "Ferrari Rosso", src: sideRosso },
  giallo: { label: "Ferrari Giallo", src: sideGiallo },
  blu: { label: "Ferrari Blu", src: sideBlu },
  arancio: { label: "Ferrari Arancio", src: sideArancio },
}

/** width / height of the side-view images */
export const SIDE_RATIO = 720 / 216

/** A front three-quarter view, for bigger moments. */
export const HERO_CAR = { src: heroRosso, ratio: 1100 / 460 }
