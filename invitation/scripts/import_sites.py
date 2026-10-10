#!/usr/bin/env python3
"""Copy the four real event sites into the showcase, with made-up details.

    python3 scripts/import_sites.py [slug…] [--no-share]

For each sample event it takes that real event's site from its git branch
(design, decorations, layout: everything), then:

  1. drops what only the real event needs (its database setup, hen-party
     page, deploy settings) and anything private (the baby's photos),
  2. swaps every real name, place, map pin and date for the made-up ones,
  3. puts in the edited printed cards from cards/ (scripts/edit_cards.mjs),
  4. adds the showcase layer from overlay/ (sample guest list, sample
     confirmation email, Contact us, event switcher),
  5. fails if any real name, place or address is still there, and
  6. redraws the link-preview picture (public/share.jpg).

Sites are rebuilt from scratch each run; don't edit sites/ by hand.
"""
import importlib.util
import sys
sys.dont_write_bytecode = True
import re
import shutil
import subprocess
import sys
import tarfile
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
SKILL = REPO / ".claude/skills/event-invitation-site"
SHARE_IMAGE = SKILL / "scripts/share_image.mjs"

spec = importlib.util.spec_from_file_location("new_event", SKILL / "scripts/new_event.py")
new_event = importlib.util.module_from_spec(spec)
spec.loader.exec_module(new_event)

TEXT = {".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".html", ".css", ".md", ".sql", ".txt", ".svg"}
CARDS = ROOT / "cards"

# Real details that must never reach the showcase (checked after importing).
FORBIDDEN = re.compile(
    r"chelsea|louise|mallows|tea plan|villa angela|\bjoel\b|sugarland|araneta|bacolod|data analytics|"
    r"moriah|avrielle|\baya\b|montuya|noelle|brendan|angelina|\bangie\b|taguibao|keenan|"
    r"st\.? john the baptist|blackrock|talbot|stillorgan|buskers|"
    r"10\.630417|122\.963472|maps\.app\.goo\.gl|share\.google|supabase\.co",
    re.I,
)

SITES = {
    "birthday": {
        "branch": "origin/mallows-birthday",
        "cards": {"src/assets/invitation-card.jpg": "birthday.jpg"},
        "colors": {"brand": "mauve", "ink": "plum"},  # this older site names its colours
        "replace": [
            ('celebrant: "Chelsea Louise"', 'celebrant: "Isabel Sofia"'),
            ('new Date("2026-10-31T17:00:00+08:00")', 'new Date("2026-11-21T17:00:00+08:00")'),
            ("Tea Plan Villa Angela", "Casa Lumiere Garden"),
            ("https://maps.app.goo.gl/TWc4HcRm6JrqgXzw7", "https://www.google.com/maps/search/?api=1&query=San+Juan+City,+Metro+Manila"),
            ('mapsQuery: "Casa Lumiere Garden"', 'mapsQuery: "San Juan City, Metro Manila"'),
            ('"https://rgicukixlxexgzcxgvqg.supabase.co"', '""'),
            ('"https://uuiftuibexylqbhhzmix.supabase.co"', '""'),
            ('"mallows_birthday"', '"showcase_birthday"'),
            ('folder: "Mallows"', 'folder: "guests"'),
            ("Chelsea Louise", "Isabel Sofia"),
            ("chelsea-16th-birthday", "isabel-16th-birthday"),
            ("chelsea16", "showcase-birthday"),
            ("Chelsea", "Isabel"),
        ],
    },
    "wedding": {
        "branch": "origin/claude/brendan-angelina-wedding",
        "cards": {
            "src/assets/invitation-card.jpg": "wedding-2-ceremony.jpg",
            "src/assets/cards/1-nuptials.jpg": "wedding-1-nuptials.jpg",
            "src/assets/cards/2-ceremony.jpg": "wedding-2-ceremony.jpg",
            "src/assets/cards/3-reception.jpg": "wedding-3-reception.jpg",
        },
        "delete": [
            "hen-party", "api/hen-party-send-invitations.ts", "api/_lib/hen-party-page.ts",
            "src/assets/cards/hen-party.jpg", "public/email/hen-party-card.jpg", "public/hen-party-share.jpg",
        ],
        "replace": [
            # The hen-party page isn't part of the showcase.
            ('import henParty from "./cards/hen-party.jpg"\n', ""),
            ('  { src: henParty, alt: "Hen party: Saturday, October 24, 2026 at 5:00 PM, The Buskers Bar, City Centre" },\n', ""),
            ('        henParty: path.resolve(__dirname, "hen-party/index.html"),\n', ""),
            ('new Date("2026-12-19T12:00:00+00:00")', 'new Date("2027-02-13T12:00:00+00:00")'),
            ("Saturday, December 19, 2026", "Saturday, February 13, 2027"),
            ("Saturday, 19 December 2026", "Saturday, 13 February 2027"),
            ("The Taguibao and Keenan Nuptials", "The Santos and Rivera Nuptials"),
            ("St. John the Baptist Church, Blackrock, Co. Dublin", "St. Brigid's Church, Killiney, Co. Dublin"),
            ("St.+John+the+Baptist+Church+Blackrock+Co.+Dublin", "St.+Brigid's+Church+Killiney+Co.+Dublin"),
            ("St. John the Baptist Church, Blackrock", "St. Brigid's Church, Killiney"),
            ("St. John the Baptist Church", "St. Brigid's Church"),
            ('address: "Blackrock, Co. Dublin"', 'address: "Killiney, Co. Dublin"'),
            ("https://share.google/D9PKGaKOURMS67XGL", "https://www.google.com/maps/search/?api=1&query=Dalkey,+Co.+Dublin"),
            ("Talbot Hotel Stillorgan, Stillorgan Road, Co. Dublin", "The Glasshouse Hotel, Dalkey Road, Co. Dublin"),
            ("Stillorgan Road, Stillorgan, Co. Dublin", "Dalkey Road, Co. Dublin"),
            ("the Talbot Hotel Stillorgan", "The Glasshouse Hotel"),
            ("Talbot Hotel Stillorgan", "The Glasshouse Hotel"),
            ("The Buskers Bar, Dublin", "The Copper Kettle, Dublin"),
            ("The+Buskers+Bar+Dublin", "The+Copper+Kettle+Dublin"),
            ("The Buskers Bar", "The Copper Kettle"),
            ("brendan-angelina-2026", "showcase-wedding"),
            ('folder: "brendan-angelina"', 'folder: "guests"'),
            ("angelina-hen-party-2026", "showcase-wedding-hen"),
            ("angelina_hen_party_guests", "showcase_hen_party_guests"),
            ("angie_wedding_guest", "showcase_wedding_guests"),
            ('"B & A"', '"M & E"'),
            ("Brendan &amp; Angelina", "Marco &amp; Elena"),
            ("Brendan & Angelina", "Marco & Elena"),
            ("Angelina & Brendan", "Elena & Marco"),
            ("Brendan and Angelina", "Marco and Elena"),
            ("Angelina", "Elena"),
        ],
    },
    "graduation": {
        "branch": "origin/joel-graduation",
        "cards": {"src/assets/invitation-card.jpg": "graduation.jpg"},
        "replace": [
            ('new Date("2026-12-21T16:00:00+08:00")', 'new Date("2027-06-05T16:00:00+08:00")'),
            ("joel-graduation-2026", "showcase-graduation"),
            ("joel_graduation_2026_guests", "showcase_graduation_guests"),
            ("Sugarland Hotel, Araneta Street, Bacolod City", "The Palms Hotel, Rizal Street, Iloilo City"),
            ("Sugarland Hotel", "The Palms Hotel"),
            ("Araneta Street, Bacolod City", "Rizal Street, Iloilo City"),
            ("https://maps.app.goo.gl/F1sPrR8MnALdv5567", "https://www.google.com/maps/search/?api=1&query=Rizal+Street,+Iloilo+City"),
            ("a Master of Science in Data Analytics with Honours", "a Bachelor of Science in Computer Science, cum laude"),
            ("MSc in Data Analytics with Honours", "BS in Computer Science, cum laude"),
            ("MSc Data Analytics", "BS Computer Science"),
            ("late nights, datasets and determination", "late nights, lines of code and determination"),
            ('font-size="46" fill="${C.brand}">MSc</text>', 'font-size="46" fill="${C.brand}">BS</text>'),
            ('caption: "With Honours"', 'caption: "Cum Laude"'),
            ('logoAccent: "MSc"', 'logoAccent: "BS"'),
            ('kicker: "Class of 2026"', 'kicker: "Class of 2027"'),
            ("Joel", "Joaquin"),
            ("joel", "joaquin"),
        ],
    },
    "christening": {
        "branch": "origin/aya-christening",
        "cards": {
            "src/assets/invitation-card.jpg": "christening.jpg",
            "src/assets/sample-month-1.jpg": "christening-month-1.jpg",
            "src/assets/sample-month-2.jpg": "christening-month-2.jpg",
        },
        "delete": ["card", "src/assets/aya-month-1.jpg", "src/assets/aya-month-2.jpg"],
        "replace": [
            ('new Date("2026-12-20T10:00:00+08:00")', 'new Date("2026-12-06T10:00:00+08:00")'),
            # A public park instead of the family's home.
            ("10.630417,122.963472", "14.651600,121.049800"),
            ("Montuya's Residence", "The Reyes Residence"),
            ("aya-christening-2026", "showcase-christening"),
            ("aya_christening_2026_guests", "showcase_christening_guests"),
            ('folder: "aya-photos"', 'folder: "guests"'),
            ("@/assets/aya-month-1.jpg", "@/assets/sample-month-1.jpg"),
            ("@/assets/aya-month-2.jpg", "@/assets/sample-month-2.jpg"),
            ('{ month: 1, src: month1, position: "45% 32%" }', '{ month: 1, src: month1, position: "50% 55%" }'),
            ('{ month: 2, src: month2, position: "42% 22%" }', '{ month: 2, src: month2, position: "50% 45%" }'),
            ("Moriah Avrielle", "Sofia Gabrielle"),
            (re.compile(r"\bAya\b"), "Gabby"),
        ],
    },
}


def run(*cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def export(branch: str, dest: Path):
    """The branch's invitation/ folder → dest (node_modules kept)."""
    if dest.exists():
        for child in dest.iterdir():
            if child.name != "node_modules":
                shutil.rmtree(child) if child.is_dir() else child.unlink()
    dest.mkdir(parents=True, exist_ok=True)
    data = subprocess.run(["git", "archive", branch, "invitation"], cwd=REPO, check=True, capture_output=True).stdout
    with tarfile.open(fileobj=io.BytesIO(data)) as tar:
        for m in tar.getmembers():
            rel = Path(m.name).relative_to("invitation") if m.name != "invitation" else None
            if not rel or str(rel) == ".":
                continue
            m.name = str(rel)
            tar.extract(m, dest, filter="data")


def text_files(site: Path):
    for p in site.rglob("*"):
        if "node_modules" in p.parts or "dist" in p.parts or not p.is_file():
            continue
        if p.suffix in TEXT and p.name != "pnpm-lock.yaml":
            yield p


def replace_all(site: Path, pairs):
    used = [0] * len(pairs)
    for p in text_files(site):
        text = p.read_text()
        new = text
        for i, (old, rep) in enumerate(pairs):
            if isinstance(old, re.Pattern):
                new, n = old.subn(rep, new)
            else:
                n = new.count(old)
                new = new.replace(old, rep)
            used[i] += n
        if new != text:
            p.write_text(new)
    unused = [str(pairs[i][0]) for i, n in enumerate(used) if n == 0]
    if unused:
        sys.exit(f"{site.name}: these replacements matched nothing (has the branch changed?): {unused}")


def patch(path: Path, pattern: str, repl: str):
    text = path.read_text()
    new, n = re.subn(pattern, repl, text, count=1, flags=re.M)
    if n != 1:
        sys.exit(f"{path}: anchor not found: {pattern!r}")
    path.write_text(new)


def install_cards(site: Path, cards: dict):
    for rel, name in cards.items():
        target = site / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if rel == "src/assets/invitation-card.jpg":
            # Also the email copy and the base64 module the envelope uses.
            new_event.install_card(site, CARDS / name)
        else:
            run("convert", str(CARDS / name), "-resize", "960x>", "-strip", "-quality", "82", str(target))


def add_overlay(slug: str, site: Path, colors: dict):
    shutil.copytree(ROOT / "overlay", site, dirs_exist_ok=True)
    (site / "src/lib/showcase.ts").write_text((site / "src/lib/showcase.ts").read_text().replace("__SLUG__", slug))
    if colors:  # older site: its palette has other class names
        for f in ["src/components/site/SampleEmail.tsx"]:
            p = site / f
            text = p.read_text()
            for a, b in colors.items():
                text = re.sub(rf"\b(text|border|bg|ring|decoration)-{a}\b", rf"\1-{b}", text)
            p.write_text(text)

    src = site / "src"
    # Contact us above the footer, the event switcher below it.
    patch(src / "App.tsx", r'^import \{ useRoute \} from "@/lib/route"$',
          'import { useRoute } from "@/lib/route"\n'
          'import { ContactUs } from "@/components/site/ContactUs"\n'
          'import { ShowcaseBar } from "@/components/site/ShowcaseBar"')
    patch(src / "App.tsx", r"^(\s*)<Footer />$", r"\1<ContactUs />\n\1<Footer />\n\1<ShowcaseBar />")

    # Sample confirmation email after registering.
    rsvp = src / "components/site/Rsvp.tsx"
    patch(rsvp, r'^import \{ PhotoUpload \} from "./PhotoUpload"$',
          'import { PhotoUpload } from "./PhotoUpload"\nimport { SampleEmail } from "./SampleEmail"')
    patch(rsvp, r"^(\s*)<PhotoUpload guestName=", r"\1<SampleEmail guest={r} />\n\1<PhotoUpload guestName=")
    patch(rsvp, r"Preview mode: registrations are saved in this browser only\.",
          "Sample site: registrations are saved in this browser only.")

    # The sample "database" behind the hosts' guest list.
    reg = src / "lib/registrations.ts"
    patch(reg, r'^(import .* from "@/lib/supabase")$',
          r'\1\nimport { demoGuestList, demoInviteHistory, demoSend } from "@/lib/demoDb"')
    patch(reg, r"localStorage\.setItem\(LOCAL_KEY, JSON\.stringify\(\[\.\.\.saved, r\]\)\)",
          "localStorage.setItem(LOCAL_KEY, JSON.stringify([...saved, { ...r, createdAt: new Date().toISOString() }]))")
    patch(reg, r"^export async function fetchGuestList\(passcode: string\): Promise<GuestListEntry\[\]> \{$",
          "export async function fetchGuestList(passcode: string): Promise<GuestListEntry[]> {\n"
          "  if (!registrationsConnected) {\n"
          "    await new Promise((resolve) => setTimeout(resolve, 400))\n"
          "    const guests = demoGuestList(passcode)\n"
          "    if (!guests) throw new WrongPasswordError()\n"
          "    return guests\n"
          "  }")
    if "fetchInviteHistory" in reg.read_text():
        patch(reg, r"^export async function fetchInviteHistory\(passcode: string\): Promise<InviteLogEntry\[\]> \{$",
              "export async function fetchInviteHistory(passcode: string): Promise<InviteLogEntry[]> {\n"
              "  if (!registrationsConnected) {\n"
              "    const entries = demoInviteHistory(passcode)\n"
              "    if (!entries) throw new WrongPasswordError()\n"
              "    return entries\n"
              "  }")
    else:
        patch(reg, r'^import \{ demoGuestList, demoInviteHistory, demoSend \} from "@/lib/demoDb"$',
              'import { demoGuestList, demoSend } from "@/lib/demoDb"')
    patch(reg, r"^(\s*)for \(let i = 0; i < emails\.length; i \+= SEND_BATCH\) \{$",
          r"\1if (!registrationsConnected) return demoSend(emails, onProgress)\n\1for (let i = 0; i < emails.length; i += SEND_BATCH) {")

    gl = src / "components/site/GuestList.tsx"
    patch(gl, r'^\} from "@/lib/registrations"$', '} from "@/lib/registrations"\nimport { DEMO_PASSWORD } from "@/lib/showcase"')
    patch(gl, r"\{registrationsConnected \? \(", "{registrationsConnected || DEMO_PASSWORD ? (")
    ink = colors.get("ink", "ink")
    patch(gl, r'^(\s*)\{state\.status === "locked" && state\.error && \(',
          r"\1{!registrationsConnected && (\n"
          r'\1  <p className="mt-2 text-sm italic text-muted-foreground">' "\n"
          rf'\1    Sample site: the password is <strong className="not-italic text-{ink}">{{DEMO_PASSWORD}}</strong>. Sends to' "\n"
          r"\1    the made-up guests are simulated; your own registration gets a real sample email." "\n"
          r"\1  </p>" "\n"
          r"\1)}" "\n"
          r'\1{state.status === "locked" && state.error && (')


def import_site(slug: str):
    cfg = SITES[slug]
    site = ROOT / "sites" / slug
    export(cfg["branch"], site)
    for rel in ["README.md", "vercel.json", "supabase", "pnpm-lock.yaml", "api/send-invitations.ts",
                "public/share.jpg", *cfg.get("delete", [])]:
        p = site / rel
        if p.is_dir():
            shutil.rmtree(p)
        elif p.exists():
            p.unlink()
    replace_all(site, cfg["replace"])
    install_cards(site, cfg["cards"])
    add_overlay(slug, site, cfg.get("colors", {}))

    if slug == "birthday":
        # This older site never had the studio credit in its footer.
        footer = site / "src/components/site/Footer.tsx"
        patch(footer, r'^import \{ EVENT \} from "@/config"$', 'import { EVENT } from "@/config"\nimport { CONTACT_EMAIL } from "@/lib/showcase"')
        patch(footer, r"^      </div>\n    </footer>",
              "      </div>\n"
              '      <p className="mt-10 border-t border-mauve/15 px-4 pt-5 text-center text-xs tracking-wide text-muted-foreground">\n'
              "        For customized invitations, email us at{\" \"}\n"
              '        <a href={`mailto:${CONTACT_EMAIL}`} className="text-mauve underline-offset-4 hover:underline">\n'
              "          {CONTACT_EMAIL}\n"
              "        </a>\n"
              "      </p>\n"
              "    </footer>")

    if slug == "birthday":
        # Link-preview tags (the newer sites already have them). %SITE_URL% is
        # filled in by scripts/build.mjs; the picture is make_birthday_share.mjs.
        patch(site / "index.html", r"^(\s*)<title>Isabel Sofia at 16</title>$",
              r'\1<meta property="og:type" content="website" />' "\n"
              r'\1<meta property="og:url" content="%SITE_URL%/" />' "\n"
              r'\1<meta property="og:title" content="Isabel Sofia at 16" />' "\n"
              r'\1<meta property="og:description" content="You&#39;re invited to a surprise 16th birthday celebration for Isabel Sofia." />' "\n"
              r'\1<meta property="og:image" content="%SITE_URL%/share.jpg" />' "\n"
              r'\1<meta property="og:image:type" content="image/jpeg" />' "\n"
              r'\1<meta property="og:image:width" content="1200" />' "\n"
              r'\1<meta property="og:image:height" content="630" />' "\n"
              r'\1<meta property="og:image:alt" content="Isabel Sofia at 16" />' "\n"
              r'\1<meta name="twitter:card" content="summary_large_image" />' "\n"
              r'\1<meta name="twitter:image" content="%SITE_URL%/share.jpg" />' "\n"
              r"\1<title>Isabel Sofia at 16</title>")

    pkg = site / "package.json"
    pkg.write_text(re.sub(r'"name": "[^"]*"', f'"name": "showcase-{slug}"', pkg.read_text(), count=1))

    leaks = []
    for p in text_files(site):
        for n, line in enumerate(p.read_text().splitlines(), 1):
            if FORBIDDEN.search(line) and "data:image" not in line:
                leaks.append(f"  {p.relative_to(site)}:{n}: {line.strip()[:120]}")
    if leaks:
        sys.exit(f"{slug}: real details still present:\n" + "\n".join(leaks))

    if SHARE and slug == "birthday":
        run("node", str(ROOT / "scripts/make_birthday_share.mjs"), stdout=subprocess.DEVNULL)
    elif SHARE and (ROOT / "node_modules").exists():
        run("node", str(SHARE_IMAGE), str(site), stdout=subprocess.DEVNULL)
    elif SHARE:
        print(f"note: run `pnpm install`, then rerun to draw sites/{slug}/public/share.jpg")
    print("imported", slug)


SHARE = "--no-share" not in sys.argv

if __name__ == "__main__":
    for s in [a for a in sys.argv[1:] if not a.startswith("--")] or list(SITES):
        import_site(s)
