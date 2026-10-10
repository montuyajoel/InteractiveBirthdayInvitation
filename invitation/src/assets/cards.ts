// The printed cards guests can flip through in the envelope, in order.
// (The first is what shows as the envelope opens.)
import { IS_HEN } from "@/config"
import nuptials from "./cards/1-nuptials.jpg"
import ceremony from "./cards/2-ceremony.jpg"
import reception from "./cards/3-reception.jpg"
import henParty from "./cards/hen-party.jpg"

export type Card = { src: string; alt: string }

const WEDDING_CARDS: Card[] = [
  { src: nuptials, alt: "The Taguibao and Keenan Nuptials" },
  { src: ceremony, alt: "Ceremony: Saturday, December 19, 2026 at 12:00 noon, St. John the Baptist Church, Blackrock" },
  { src: reception, alt: "Wedding Reception: Saturday, December 19, 2026 at 4:00 pm, Talbot Hotel Stillorgan" },
]

const HEN_CARDS: Card[] = [
  { src: henParty, alt: "Hen party: Saturday, October 24, 2026 at 5:00 PM, The Buskers Bar, City Centre" },
]

export const CARDS = IS_HEN ? HEN_CARDS : WEDDING_CARDS
