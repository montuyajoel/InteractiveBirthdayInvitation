# Event invitation sites

This branch holds only the `event-invitation-site` skill
(`.claude/skills/event-invitation-site`). Every event gets its own branch,
started from here, named `<celebrant>-<event>`:

| Branch | Event |
| --- | --- |
| `mallows-birthday` | Chelsea Louise's 16th birthday |
| `aya-christening` | Avrielle Noelle's christening |

## Start a new event

Ask Claude Code to "make an invitation site for …", or run it yourself from a
clean checkout:

```bash
python3 .claude/skills/event-invitation-site/scripts/new_event.py --example > /tmp/event.json
# edit /tmp/event.json
python3 .claude/skills/event-invitation-site/scripts/init_project.py \
    --celebrant "Aya" --event christening --spec /tmp/event.json --card card.jpg
```

This creates the branch `aya-christening` with the site in `aya-christening/`
and a `vercel.json` that deploys only that branch. Then commit, push, and add a
Vercel project with Root Directory and Production Branch both set to the branch
name. Details: `.claude/skills/event-invitation-site/references/setup.md`.

Improve the template on this branch; existing events keep their own copy.
