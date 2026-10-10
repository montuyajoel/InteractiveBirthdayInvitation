// Type-checks every site (app + email lib) and the showcase's email function.
import path from "node:path"
import { fileURLToPath } from "node:url"
import { run as runBin } from "./bin.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const run = (cwd, args) => runBin("typescript", "tsc", args, { cwd })
for (const slug of ["birthday", "wedding", "graduation", "christening"]) {
  const cwd = path.join(root, "sites", slug)
  console.log("▸", slug)
  run(cwd, ["-p", "tsconfig.app.json", "--noEmit"])
  run(cwd, ["-p", "tsconfig.api.json"])
}
console.log("▸ api")
run(root, ["-p", "tsconfig.json"])
