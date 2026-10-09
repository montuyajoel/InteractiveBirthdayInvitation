# Event invitation sites

This branch holds only the `event-invitation-site` skill
(`.claude/skills/event-invitation-site`). Every event gets its own branch,
started from here, named `<celebrant>-<event>`:

| Branch | Event | Site folder |
| --- | --- | --- |
| `mallows-birthday` | Chelsea Louise's 16th birthday | `invitation/` |
| `aya-christening` | Avrielle Noelle's christening | `aya-christening/` (made before this convention) |
| `claude/brendan-angelina-wedding` | Brendan & Angelina's wedding party | `invitation/` (branch named before this convention) |

## Start a new event

Ask Claude Code to "make an invitation site for …", or run it yourself from a
clean checkout:

```bash
python3 .claude/skills/event-invitation-site/scripts/new_event.py --example > /tmp/event.json
# edit /tmp/event.json
python3 .claude/skills/event-invitation-site/scripts/init_project.py \
    --celebrant "Aya" --event christening --spec /tmp/event.json --card card.jpg
```

This creates the branch `aya-christening` with the site in `invitation/` and a
`vercel.json` that deploys only that branch. Then commit, push, and add a
Vercel project with Root Directory `invitation` and Production Branch set to
the branch name. Later changes for that event are made in `invitation/` on
its branch. Details: `.claude/skills/event-invitation-site/references/setup.md`.

Every event can use the same Supabase project: each gets its own table
(named from the branch, e.g. `aya_christening_guests`), send log, functions
and hosts' password, so no event sees another's guests.

Improve the template on this branch; existing events keep their own copy.
