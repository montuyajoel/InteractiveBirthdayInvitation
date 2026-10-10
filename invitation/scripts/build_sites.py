#!/usr/bin/env python3
"""Regenerate the four sample event sites from the skill's template.

    python3 scripts/build_sites.py

For each spec in specs/ it runs the skill's new_event.py into sites/<slug>/
(with the card from cards/<slug>.jpg; make those with make_cards.mjs), then
copies overlay/ on top and applies the small showcase patches below: event
switcher, Contact us section, sample guest list (password "demo") and the
sample confirmation email. Finally it redraws each site's link-preview
picture (public/share.jpg) with the skill's share_image.mjs. Every patch checks that its anchor text is still
there, so a template change fails loudly instead of silently skipping.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
NEW_EVENT = REPO / ".claude/skills/event-invitation-site/scripts/new_event.py"
SHARE_IMAGE = REPO / ".claude/skills/event-invitation-site/scripts/share_image.mjs"
SLUGS = ["birthday", "wedding", "graduation", "christening"]

# Gallery sample captions, in the template's motif order:
# cake, balloons, butterfly, ribbon, flowers, heart.
CAPTIONS = {
    "birthday": ["Birthday cake", "Balloons & bows", "Garden butterflies", "Satin ribbons", "Flowers", "With love"],
    "wedding": ["Cake tasting", "Garden party", "Butterflies at the villa", "Ribbons & lace", "The bouquet", "Forever"],
    "graduation": ["Grad cake", "Party balloons", "New beginnings", "Diploma ribbon", "Flowers from Lola", "Proud of you"],
    "christening": ["Baptism cake", "Baby blue balloons", "Little wings", "Christening ribbon", "Altar flowers", "Blessed"],
}
TEMPLATE_CAPTIONS = CAPTIONS["birthday"]


def patch(path: Path, old: str, new: str, count: int = 1):
    text = path.read_text()
    if text.count(old) != count:
        sys.exit(f"{path}: expected {count} of {old!r}, found {text.count(old)}")
    path.write_text(text.replace(old, new))


def build(slug: str):
    site = ROOT / "sites" / slug
    subprocess.run(
        [sys.executable, str(NEW_EVENT), "--dest", str(site), "--spec", str(ROOT / "specs" / f"{slug}.json"),
         "--card", str(ROOT / "cards" / f"{slug}.jpg"), "--replace"],
        check=True, stdout=subprocess.DEVNULL,
    )
    # One pnpm workspace for all four sites (lockfile at the root).
    (site / "pnpm-lock.yaml").unlink(missing_ok=True)
    pkg = json.loads((site / "package.json").read_text())
    pkg["name"] = f"showcase-{slug}"
    (site / "package.json").write_text(json.dumps(pkg, indent=2) + "\n")
    # The showcase deploys its own email function (api/send-confirmation.ts);
    # the sites keep api/_lib for the email itself.
    (site / "api" / "send-invitations.ts").unlink()
    shutil.copytree(ROOT / "overlay", site, dirs_exist_ok=True)

    src = site / "src"
    # Event switcher + Contact us on every page.
    patch(src / "App.tsx", 'import { useRoute } from "@/lib/route"',
          'import { useRoute } from "@/lib/route"\n'
          'import { ContactUs } from "@/components/site/ContactUs"\n'
          'import { ShowcaseBar } from "@/components/site/ShowcaseBar"')
    patch(src / "App.tsx", "      <Footer />\n",
          "      <ContactUs />\n      <Footer />\n      <ShowcaseBar />\n")
    patch(src / "components/site/Header.tsx", '  { href: "#directions", label: "Directions" },\n',
          '  { href: "#directions", label: "Directions" },\n  { href: "#contact", label: "Contact" },\n')
    # Phones have room for three links; Contact us is at the bottom anyway.
    patch(src / "components/site/Header.tsx", 'className={l.href === "#invitation" ? "hidden sm:block" : undefined}',
          'className={l.href === "#invitation" || l.href === "#contact" ? "hidden sm:block" : undefined}')

    # Sample confirmation email after registering.
    rsvp = src / "components/site/Rsvp.tsx"
    patch(rsvp, 'import { PhotoUpload } from "./PhotoUpload"',
          'import { PhotoUpload } from "./PhotoUpload"\nimport { SampleEmail } from "./SampleEmail"')
    patch(rsvp, "      <PhotoUpload guestName=",
          "      <SampleEmail guest={r} />\n      <PhotoUpload guestName=")
    patch(rsvp, "Preview mode: registrations are saved in this browser only.",
          "Sample site: registrations are saved in this browser only.")

    # Sample "database" behind the hosts' guest list.
    reg = src / "lib/registrations.ts"
    patch(reg, 'import { isConfigured, supabaseHeaders, supabaseUrl } from "@/lib/supabase"',
          'import { isConfigured, supabaseHeaders, supabaseUrl } from "@/lib/supabase"\n'
          'import { demoGuestList, demoInviteHistory, demoSend } from "@/lib/demoDb"')
    patch(reg, "    localStorage.setItem(LOCAL_KEY, JSON.stringify([...saved, r]))",
          "    localStorage.setItem(LOCAL_KEY, JSON.stringify([...saved, { ...r, createdAt: new Date().toISOString() }]))")
    patch(reg, "export async function fetchInviteHistory(passcode: string): Promise<InviteLogEntry[]> {\n",
          "export async function fetchInviteHistory(passcode: string): Promise<InviteLogEntry[]> {\n"
          "  if (!registrationsConnected) {\n"
          "    const entries = demoInviteHistory(passcode)\n"
          "    if (!entries) throw new WrongPasswordError()\n"
          "    return entries\n"
          "  }\n")
    patch(reg, "export async function fetchGuestList(passcode: string): Promise<GuestListEntry[]> {\n",
          "export async function fetchGuestList(passcode: string): Promise<GuestListEntry[]> {\n"
          "  if (!registrationsConnected) {\n"
          "    await new Promise((resolve) => setTimeout(resolve, 400))\n"
          "    const guests = demoGuestList(passcode)\n"
          "    if (!guests) throw new WrongPasswordError()\n"
          "    return guests\n"
          "  }\n")
    patch(reg, "  const errors: Record<string, string> = {}\n  for (let i = 0; i < emails.length; i += SEND_BATCH) {",
          "  const errors: Record<string, string> = {}\n"
          "  if (!registrationsConnected) return demoSend(emails, onProgress)\n"
          "  for (let i = 0; i < emails.length; i += SEND_BATCH) {")

    gl = src / "components/site/GuestList.tsx"
    patch(gl, '} from "@/lib/registrations"\n',
          '} from "@/lib/registrations"\nimport { DEMO_PASSWORD } from "@/lib/showcase"\n')
    patch(gl, "            {registrationsConnected ? (\n", "            {registrationsConnected || DEMO_PASSWORD ? (\n")
    patch(gl, "                {state.status === \"locked\" && state.error && (",
          "                {!registrationsConnected && (\n"
          "                  <p className=\"mt-2 text-sm italic text-muted-foreground\">\n"
          "                    Sample site: the password is <strong className=\"not-italic text-ink\">{DEMO_PASSWORD}</strong>. Sends to\n"
          "                    the made-up guests are simulated; your own registration gets a real sample email.\n"
          "                  </p>\n"
          "                )}\n"
          "                {state.status === \"locked\" && state.error && (")

    gallery = src / "lib/gallery.ts"
    for old, new in zip(TEMPLATE_CAPTIONS, CAPTIONS[slug]):
        patch(gallery, f'caption: "{old}"', f'caption: "{new}"')

    # --replace cleared public/share.jpg: redraw the link-preview picture
    # (needs the packages installed: pnpm install at the showcase root).
    if (ROOT / "node_modules").exists():
        subprocess.run(["node", str(SHARE_IMAGE), str(site)], check=True, stdout=subprocess.DEVNULL)
    else:
        print(f"note: run `pnpm install`, then rerun to draw sites/{slug}/public/share.jpg")

    print("built", slug)


if __name__ == "__main__":
    for s in sys.argv[1:] or SLUGS:
        build(s)
