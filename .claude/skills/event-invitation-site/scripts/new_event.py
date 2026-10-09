#!/usr/bin/env python3
"""Create a new event invitation site from the template.

    python3 new_event.py --spec event.json [--card card.jpg] [--dest invitation] [--replace]
    python3 new_event.py --example            # print an example event.json

The spec is JSON with any of these sections (see assets/event.example.json):
  event         -> EVENT in src/config.ts       (id, honoree, start, venue, ...)
  copy          -> COPY in src/config.ts        (all wording)
  registrations -> REGISTRATIONS in config.ts   (url, table)
  gallery       -> GALLERY in config.ts         (url, bucket, folder)
  theme         -> THEME in src/theme.ts        (colors, envelope, fonts, radius)

The site always lives in the repo's `invitation/` folder (the Vercel project's
Root Directory), one client per git branch. --dest defaults to it; when it
already holds the previous event, --replace clears it first (keeping
vercel.json, node_modules and .vercel) so no old files are left behind.
Only keys you give are changed; everything else keeps the template default.
Unknown keys are an error, so typos don't silently do nothing.
"""
import argparse
import base64
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
TEMPLATE = SKILL / "assets" / "template"
EXAMPLE = SKILL / "assets" / "event.example.json"

# spec section -> (file, path of nested object blocks)
TARGETS = {
    "event": ("src/config.ts", ["EVENT"]),
    "copy": ("src/config.ts", ["COPY"]),
    "registrations": ("src/config.ts", ["REGISTRATIONS"]),
    "gallery": ("src/config.ts", ["GALLERY"]),
    "theme.colors": ("src/theme.ts", ["THEME", "colors"]),
    "theme.envelope": ("src/theme.ts", ["THEME", "envelope"]),
    "theme.fonts": ("src/theme.ts", ["THEME", "fonts"]),
    "theme": ("src/theme.ts", ["THEME"]),  # top-level scalars such as radius
}
# Left in place by --replace: deploy settings and installed packages.
KEEP = {"vercel.json", "node_modules", ".vercel"}
# Never written into the site: these must stay out of public code.
FORBIDDEN = re.compile(r"service_role|sb_secret_|postgres(ql)?://|password", re.I)


def find_block(text, path):
    """Return (start, end) of the `{ ... }` body for a nested object path."""
    m = re.search(r"export const " + re.escape(path[0]) + r"\b[^=]*=\s*\{", text)
    if not m:
        raise SystemExit(f"cannot find `export const {path[0]}` block")
    start = m.end()
    for key in path[1:]:
        end = match_brace(text, start)
        m = re.compile(r"^\s*" + re.escape(key) + r":\s*\{", re.M).search(text, start, end)
        if not m:
            raise SystemExit(f"cannot find `{key}: {{` inside {path[0]}")
        start = m.end()
    return start, match_brace(text, start)


def match_brace(text, start):
    depth, i, quote = 1, start, None
    while i < len(text):
        c = text[i]
        if quote:
            if c == "\\":
                i += 1
            elif c == quote:
                quote = None
        elif text.startswith("//", i):
            i = text.find("\n", i)  # line comment: skip to its end
            if i == -1:
                break
        elif text.startswith("/*", i):
            i = text.find("*/", i) + 1  # block comment
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise SystemExit("unbalanced braces in template")


def ts_value(key, value):
    if key == "start":
        if not isinstance(value, str) or not re.match(r"^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?[+-]\d\d:\d\d$", value):
            raise SystemExit('event.start must look like "2026-10-31T17:00:00+08:00" (local time WITH its UTC offset)')
        return f'new Date("{value}")'
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    raise SystemExit(f"{key}: only strings, numbers and booleans are supported")


def set_keys(text, path, values, section):
    start, end = find_block(text, path)
    body = text[start:end]
    # only top-level keys of this block (indent of its first key)
    indent = re.search(r"\n(\s+)\S", body).group(1)
    for key, value in values.items():
        if isinstance(value, str) and FORBIDDEN.search(value) and section in ("registrations", "gallery"):
            raise SystemExit(f"{section}.{key}: looks like a secret. Only public URLs / bucket names belong here.")
        # value may start on the next line (long strings); it's rewritten onto one line
        pat = re.compile(r"^(" + re.escape(indent) + re.escape(key) + r":)\s*(.*?)(,[ \t]*(//[^\n]*)?)$", re.M)
        if not pat.search(body):
            known = re.findall(r"^" + re.escape(indent) + r"(\w+):", body, re.M)
            raise SystemExit(f"unknown key {section}.{key}. Known keys: {', '.join(known)}")
        body = pat.sub(lambda m: m.group(1) + " " + ts_value(key, value) + m.group(3), body, count=1)
    return text[:start] + body + text[end:]


def apply_spec(dest, spec):
    for section, values in spec.items():
        if section.startswith("_"):
            continue  # comments
        if section == "theme":
            nested = {k: v for k, v in values.items() if isinstance(v, dict)}
            scalars = {k: v for k, v in values.items() if not isinstance(v, dict)}
            for sub, vals in nested.items():
                apply_section(dest, f"theme.{sub}", vals)
            if scalars:
                apply_section(dest, "theme", scalars)
        else:
            apply_section(dest, section, values)


def apply_section(dest, section, values):
    if section not in TARGETS:
        raise SystemExit(f"unknown section '{section}'. Use: event, copy, registrations, gallery, theme")
    if not isinstance(values, dict):
        raise SystemExit(f"'{section}' must be an object")
    rel, path = TARGETS[section]
    f = dest / rel
    f.write_text(set_keys(f.read_text(), path, values, section))


def read_config_string(text, block, key):
    start, end = find_block(text, [block])
    m = re.search(r"^\s+" + key + r': ("(?:[^"\\]|\\.)*")', text[start:end], re.M)
    return json.loads(m.group(1)) if m else ""


def fill_static_files(dest):
    cfg = (dest / "src/config.ts").read_text()
    honoree = read_config_string(cfg, "EVENT", "honoree")
    short = read_config_string(cfg, "EVENT", "honoreeShort")

    def fill(s):
        s = s.replace("{honoree}", honoree).replace("{name}", short)
        return re.sub(r"\^(.*?)\^", r"\1", s)

    html = dest / "index.html"
    h = html.read_text()
    esc = lambda s: s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")
    h = h.replace("%PAGE_TITLE%", esc(fill(read_config_string(cfg, "COPY", "pageTitle"))))
    h = h.replace("%META_DESCRIPTION%", esc(fill(read_config_string(cfg, "COPY", "metaDescription"))))
    html.write_text(h)

    sql = dest / "supabase/gallery-setup.sql"
    bucket = read_config_string(cfg, "GALLERY", "bucket")
    folder = read_config_string(cfg, "GALLERY", "folder").strip("/")
    s = sql.read_text().replace("{{GALLERY_BUCKET}}", bucket)
    s = s.replace("'{{GALLERY_FOLDER}}/%.jpg'", f"'{folder}/%.jpg'" if folder else "'%.jpg'")
    sql.write_text(s.replace("{{GALLERY_FOLDER}}", folder or "(bucket root)"))


def install_card(dest, card):
    card = Path(card)
    if not card.is_file():
        raise SystemExit(f"card image not found: {card}")
    email = dest / "public/email/invitation-card.jpg"
    site = dest / "src/assets/invitation-card.jpg"
    if shutil.which("convert"):
        # 992px is plenty for a 496px email column at 2x; ~960px for the site.
        subprocess.run(["convert", str(card), "-auto-orient", "-resize", "992x>", "-strip", "-quality", "82", str(email)], check=True)
        subprocess.run(["convert", str(card), "-auto-orient", "-resize", "960x>", "-strip", "-quality", "80", str(site)], check=True)
    else:
        print("note: ImageMagick not found; using the card image as-is (resize it below ~300 KB yourself)")
        shutil.copy(card, email)
        shutil.copy(card, site)
    b64 = base64.b64encode(site.read_bytes()).decode()
    (dest / "src/assets/invitationCard.ts").write_text(
        "// Generated by scripts/new_event.py from the invitation card image so it survives single-file bundling.\n"
        f'export default "data:image/jpeg;base64,{b64}"\n'
    )


def placeholder_card(dest):
    """Draw a simple card in the event's own colours until the real one exists."""
    if not shutil.which("convert"):
        return
    theme = (dest / "src/theme.ts").read_text()
    color = lambda k: re.search(r"\b" + k + r': "(#[0-9a-fA-F]{6})"', theme).group(1)
    cfg = (dest / "src/config.ts").read_text()
    honoree = read_config_string(cfg, "EVENT", "honoree")
    title = re.sub(r"\^(.*?)\^", r"\1", read_config_string(cfg, "COPY", "title"))
    tmp = dest / "src/assets/invitation-card.jpg"
    subprocess.run([
        "convert", "-size", "960x1440", f"gradient:{color('paper')}-{color('soft')}",
        "-fill", "none", "-stroke", color("brand"), "-strokewidth", "3", "-draw", "rectangle 40,40 920,1400",
        "-strokewidth", "1", "-draw", "rectangle 56,56 904,1384", "-stroke", "none", "-gravity", "north",
        "-fill", color("brand"), "-font", "DejaVu-Serif", "-pointsize", "34", "-annotate", "+0+300", "YOU'RE INVITED",
        "-fill", color("ink"), "-pointsize", "70", "-annotate", "+0+430", honoree,
        "-fill", color("brand"), "-pointsize", "40", "-annotate", "+0+560", title,
        "-pointsize", "26", "-annotate", "+0+1180", "Placeholder: add your printed card with --card",
        "-quality", "82", str(tmp),
    ], check=True)
    install_card(dest, tmp)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dest", default="invitation", help="site folder (default: invitation, the Vercel Root Directory)")
    ap.add_argument("--spec", help="event.json with the event details, wording and theme")
    ap.add_argument("--card", help="the printed invitation image (jpg/png)")
    ap.add_argument("--replace", action="store_true", help="clear the previous event out of --dest first (keeps vercel.json, node_modules, .vercel)")
    ap.add_argument("--example", action="store_true", help="print an example event.json and exit")
    a = ap.parse_args()

    if a.example:
        print(EXAMPLE.read_text())
        return
    dest = Path(a.dest).resolve()
    if dest.exists() and any(dest.iterdir()) and not a.replace:
        raise SystemExit(
            f"{dest} already holds a site. Start a new branch for this client, then rerun with --replace "
            "to swap the previous event out (vercel.json is kept)."
        )

    spec = json.loads(Path(a.spec).read_text()) if a.spec else {}
    if dest.exists():
        for child in dest.iterdir():
            if child.name in KEEP:
                continue
            shutil.rmtree(child) if child.is_dir() and not child.is_symlink() else child.unlink()
    shutil.copytree(TEMPLATE, dest, dirs_exist_ok=True)
    apply_spec(dest, spec)
    fill_static_files(dest)
    if a.card:
        install_card(dest, a.card)
    else:
        placeholder_card(dest)

    print(f"Created {dest}")
    print("Next: cd into it, run `pnpm install` (or npm install), then `pnpm dev`.")
    if not a.card:
        print("Note: no --card given, so the envelope shows a placeholder card.")


if __name__ == "__main__":
    main()
