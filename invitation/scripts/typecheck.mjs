// Type-checks every site (app + email lib) and the showcase's email function.
import { execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const run = (cwd, args) => execFileSync("pnpm", ["exec", "tsc", ...args], { cwd, stdio: "inherit" })
for (const slug of ["birthday", "wedding", "graduation", "christening"]) {
  const cwd = path.join(root, "sites", slug)
  console.log("▸", slug)
  run(cwd, ["-p", "tsconfig.app.json", "--noEmit"])
  run(cwd, ["-p", "tsconfig.api.json"])
}
console.log("▸ api")
run(root, ["-p", "tsconfig.json"])
