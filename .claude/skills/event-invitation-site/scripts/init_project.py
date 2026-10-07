#!/usr/bin/env python3
"""Start a new event on its own git branch, ready for its own Vercel project.

    python3 init_project.py --celebrant "Aya" --event christening --spec event.json [--card card.jpg]

Every event lives on a branch named <celebrant>-<event> (e.g. aya-christening,
mallows-birthday), created from the skill branch (default: invitation-skill),
with the site in a folder of the same name. That folder gets a vercel.json that
builds only for that branch, so each event's Vercel project ignores pushes to
the others. Nothing is committed or pushed: verify the site first, then
commit and `git push -u origin <branch>`.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import new_event  # noqa: E402

SKILL_BRANCH = "invitation-skill"


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def git(*args, check=True, cwd=None):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    if check and r.returncode:
        raise SystemExit(f"git {' '.join(args)} failed:\n{r.stderr.strip()}")
    return r


def vercel_json(branch):
    return json.dumps(
        {
            "$schema": "https://openapi.vercel.sh/vercel.json",
            # exit 1 = build, exit 0 = skip: only this event's branch deploys.
            "ignoreCommand": f'if [ "$VERCEL_GIT_COMMIT_REF" = "{branch}" ]; then exit 1; else exit 0; fi',
        },
        indent=2,
    ) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--celebrant", required=True, help='short name used in the branch, e.g. "Aya" or "Mallows"')
    ap.add_argument("--event", required=True, help='occasion, e.g. "birthday", "christening", "wedding"')
    ap.add_argument("--spec", help="event.json for new_event.py")
    ap.add_argument("--card", help="the printed invitation image")
    ap.add_argument("--base", default=SKILL_BRANCH, help=f"branch to start from (default {SKILL_BRANCH})")
    ap.add_argument("--repo", default=".", help="the git repository (default: current folder)")
    a = ap.parse_args()

    branch = f"{slugify(a.celebrant)}-{slugify(a.event)}"
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)+", branch):
        raise SystemExit(f"can't make a branch name from {a.celebrant!r} and {a.event!r} (got {branch!r})")

    repo = Path(git("rev-parse", "--show-toplevel", cwd=a.repo).stdout.strip())
    if git("status", "--porcelain", cwd=repo).stdout.strip():
        raise SystemExit("the working tree has uncommitted changes; commit or stash them first")

    if git("rev-parse", "--verify", "--quiet", f"refs/heads/{branch}", check=False, cwd=repo).returncode == 0:
        raise SystemExit(f"branch {branch} already exists locally")
    remote = git("ls-remote", "--heads", "origin", branch, check=False, cwd=repo)
    if remote.returncode:
        print(f"note: couldn't check origin for {branch} ({remote.stderr.strip() or 'no origin'})")
    elif remote.stdout.strip():
        raise SystemExit(f"branch {branch} already exists on origin; pick another name or work on that branch")

    git("fetch", "origin", a.base, check=False, cwd=repo)
    base = f"origin/{a.base}"
    if git("rev-parse", "--verify", "--quiet", base, check=False, cwd=repo).returncode:
        base = a.base
        if git("rev-parse", "--verify", "--quiet", base, check=False, cwd=repo).returncode:
            raise SystemExit(f"base branch {a.base} not found locally or on origin")

    # The event's storage keys and calendar file names default to the branch name.
    spec = json.loads(Path(a.spec).read_text()) if a.spec else {}
    spec.setdefault("event", {}).setdefault("id", branch)
    spec_file = Path(tempfile.mkstemp(suffix=".json")[1])
    spec_file.write_text(json.dumps(spec))

    git("switch", "-c", branch, base, cwd=repo)
    dest = repo / branch
    if dest.exists():
        raise SystemExit(f"{dest} already exists on {base}")

    argv = ["new_event.py", "--dest", str(dest), "--spec", str(spec_file)]
    if a.card:
        argv += ["--card", str(Path(a.card).resolve())]
    sys.argv = argv
    new_event.main()
    spec_file.unlink()
    (dest / "vercel.json").write_text(vercel_json(branch))

    print(f"""
Branch:  {branch} (from {base}, not committed yet)
Site:    {branch}/  (vercel.json builds only for {branch})

Next:
  1. cd {branch} && pnpm install, then verify (see SKILL.md step 4)
  2. git add {branch} && git commit && git push -u origin {branch}
  3. Vercel: new project from this repo, Root Directory = {branch},
     Production Branch = {branch} (deploy the branch once first:
     Deployments -> ... -> Create Deployment -> {branch})""")


if __name__ == "__main__":
    main()
