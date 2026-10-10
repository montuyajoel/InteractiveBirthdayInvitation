// The printed cards guests can flip through in the envelope, in order.
// (The first is what shows as the envelope opens.)
import nuptials from "./cards/1-nuptials.jpg"
import ceremony from "./cards/2-ceremony.jpg"
import reception from "./cards/3-reception.jpg"

export type Card = { src: string; alt: string }

export const CARDS: Card[] = [
  { src: nuptials, alt: "The Taguibao and Keenan Nuptials" },
  { src: ceremony, alt: "Ceremony: Saturday, December 19, 2026 at 12:00 noon, St. John the Baptist Church, Blackrock" },
  { src: reception, alt: "Wedding Party: Saturday, December 19, 2026 at 4 pm, Talbot Hotel Stillorgan" },
]
