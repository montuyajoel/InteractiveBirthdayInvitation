import { Fragment } from "react"
import { fill } from "./event.js"

export { COPY } from "../config.js"
export { fill, plainTitle } from "./event.js"

/** Renders a COPY title, turning ^…^ into a superscript ("16^th^ Birthday"). */
export function Title({ text }: { text: string }) {
  const parts = fill(text).split(/\^(.*?)\^/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <sup key={i} className="text-[0.4em]">
            {part}
          </sup>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
