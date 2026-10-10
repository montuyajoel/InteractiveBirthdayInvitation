// Runs a package's command-line tool with node, found the way Node finds the
// package from `from` (works whether npm or pnpm installed it).
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

export function bin(pkg, name, from) {
  const manifest = createRequire(path.resolve(from, "package.json")).resolve(`${pkg}/package.json`)
  const { bin } = JSON.parse(readFileSync(manifest, "utf8"))
  return path.join(path.dirname(manifest), typeof bin === "string" ? bin : bin[name])
}

export function run(pkg, name, args, opts) {
  execFileSync(process.execPath, [bin(pkg, name, opts.cwd), ...args], { stdio: "inherit", ...opts })
}
