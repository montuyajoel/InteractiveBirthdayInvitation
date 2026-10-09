# Designing a new look

The template's structure (sections, features, layout grid) stays; the look
comes from tokens, fonts, wording and decorations.

## Token roles (`src/theme.ts`)

| Token | Used for | Guidance |
| --- | --- | --- |
| `ink` | body text, headings, primary buttons | darkest colour; ≥ 7:1 contrast on `paper` |
| `brand` | script titles, labels, icons, links, seal | the card's lettering colour; ≥ 4.5:1 on `paper` for small labels |
| `soft` | panels, skeletons, borders, email page | pale tint of `brand` |
| `highlight` | warm wash, hovers, email call-out box | second pale tint (often warmer) |
| `paper` | page background | near-white, slightly tinted |
| `night` | full-screen photo viewer | very dark version of `ink` |
| `foliage`, `bloom` | stems / petals in decorations | muted greens; small accent |
| `envelope.*` | envelope back, pocket, sides, flap | 4 close shades of `soft`, flap darkest |

Check contrast before shipping, e.g. with a quick script:
`node -e "const L=h=>{const c=h.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const r=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return((x+.05)/(y+.05)).toFixed(2)};console.log(r('#5c3a63','#fbf6fb'))"`

The site sets shadcn/ui's own variables (buttons, inputs, focus rings) from
these tokens in `applyTheme()`, so don't edit the HSL values in `index.css`;
they're only a fallback.

## Fonts

One **script** font for big titles and one **serif** (or sans) for
everything else, both from Google Fonts. Set `fonts.script`, `fonts.serif`
and a `googleFontsUrl` that loads exactly those families (include italic for
the serif; the intro and wishes are italic). Script fonts vary a lot in
size; if the new one runs large or small, adjust the title classes in
`Hero.tsx` (`text-[5.5rem] sm:text-[8rem]` for short titles,
`text-[3.75rem] sm:text-[5.5rem]` for long ones, switching at 16 characters).

Good pairs: Allura + Cormorant Garamond (romantic), Great Vibes + Lora
(classic wedding), Pinyon Script + EB Garamond (formal), Dancing Script +
Nunito (playful/kids), Parisienne + Playfair Display (glam), Sacramento +
Josefin Sans (modern minimal).

## Presets

Starting points when there's no printed card (hex for ink / brand / soft / highlight / paper):

- **Lilac garden** (default): `#5c3a63 #9a6aa0 #e9dcf0 #f6dde8 #fbf6fb`, baby's breath + butterflies
- **Sage & gold wedding**: `#2f3d33 #a8843a #e3e8dc #f3ead7 #fbfaf5`, leaves, no butterflies
- **Midnight & champagne debut**: `#1f2340 #b8955a #e6e1ef #f4ece0 #fbfaf8`, stars/sparkles; `night` `#0f1226`
- **Blush & rose gold**: `#4a2e35 #b76e79 #f3e1e3 #fbeee8 #fffaf9`, roses/peonies
- **Ocean / beach**: `#1f3b4d #2f8f9d #dcecef #f6efe3 #fbfdfd`, shells/waves
- **Kids' party**: `#2d2a4a #ff6f59 #e3f2fd #fff3c4 #fffdf7`, balloons/confetti (try Dancing Script + Nunito)

## Decorations (`src/components/site/Decor.tsx`)

`Butterfly`, `Heart`, `Sparkle`, `BabysBreath` (flower sprig) and `HeartRule`
are inline SVGs coloured with `currentColor` or the `--c-*` variables, so they
follow the theme automatically. To change motif, redraw these functions
(keep their names and props so the call sites in Hero/Rsvp/Footer/Directions
still work) or swap the calls. Keep strokes thin (1–1.3 px at 24 px), fills
at low opacity, and avoid adding motifs to every section: two or three placements per
screen is plenty.

Don't crop artwork out of the printed card for decorations: the crops show
hard edges and look cut off. Draw the motif as SVG instead, coloured to match
the card. `invitation/src/components/site/Florals.tsx` on the
`claude/brendan-angelina-wedding` branch is a worked example (peonies,
hydrangea, eucalyptus, ferns, an arch along the hero top that flips for the
footer, plus falling petals). Gentle motion suits these: stems swaying from
their base (`transform-origin` at the stem's base in SVG user units), slow
"breathing" flowers, a dozen drifting petals. Keep it subtle and pointer-events
free; the `prefers-reduced-motion` rule in `index.css` already stills it.

The gallery's sample tiles (`src/lib/gallery.ts`, `MOTIFS` and `SAMPLES`)
are small SVG illustrations shown before real photos exist; rename the
captions (and redraw if needed) to suit the event.

## Wording

Everything visible is in `COPY` (`src/config.ts`). Write it in the hosts'
voice, warm and short. Keep `{name}` where a name belongs so one change of
`EVENT.honoreeShort` updates every sentence. For non-English events
translate all `COPY` strings; the few fixed UI strings (button labels like
"Count me in", "Register", "Gallery", form errors) live in the components.

## Don't break

- the `id` anchors (`#invitation`, `#rsvp`, `#gallery`, `#directions`, `#guests`) used by the header
- the `#/photos` route (hash routing works on any static host)
- mobile: test at 390 px; long names must wrap, not overflow
- `prefers-reduced-motion` handling in `index.css`
