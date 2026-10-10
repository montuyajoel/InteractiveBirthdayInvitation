// The printed cards guests can flip through in the envelope, in order.
// (The first is what shows as the envelope opens.)
import { IS_HEN } from "@/config"
import nuptials from "./cards/1-nuptials.jpg"
import ceremony from "./cards/2-ceremony.jpg"
import reception from "./cards/3-reception.jpg"

export type Card = { src: string; alt: string }

const WEDDING_CARDS: Card[] = [
  { src: nuptials, alt: "The Santos and Rivera Nuptials" },
  { src: ceremony, alt: "Ceremony: Saturday, February 13, 2027 at 12:00 noon, St. Brigid's Church, Killiney" },
  { src: reception, alt: "Wedding Reception: Saturday, February 13, 2027 at 4:00 pm, The Glasshouse Hotel" },
]

const HEN_CARDS: Card[] = [
]

export const CARDS = IS_HEN ? HEN_CARDS : WEDDING_CARDS
