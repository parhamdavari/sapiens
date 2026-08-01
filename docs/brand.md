# Brand

## The mark

A human head in profile, speaking three ochre strokes.

The head is early-human but dignified: a heavy brow, a broad nose, a full jaw. It is not a
modern silhouette, and not a caveman caricature either.

The three strokes leaving the mouth are the speech. They are short, separate and ordered,
and each one is shorter than the last. They read as three plain words rather than as a
stream or a scribble.

That combination is the whole positioning. Sapiens sits between two things and has to look
like neither.

| | What it is | What it would look like |
|---|---|---|
| **caveman** | Grunts. Words dropped until only stumps remain. | One crude gash. Chaos. |
| **default AI** | Elaborate, padded, ornamental. | A dense tangled scribble. Noise. |
| **sapiens** | Simple, complete, ordered speech. | A person saying three clear things. Signal. |

Ochre is the pigment of the first human marks. It also keeps the project out of the
blue-grey that most developer tooling defaults to.

**Two things the mark is deliberately not.** It is not the ape-to-man walking line. That
image is the most overused in graphic design, and it retells caveman's evolution joke rather
than this project's point. It is also not cave imagery. These are early humans *after* the
cave.

## Palette

```
Ochre / burnt sienna   #C8622F   the marks, primary
Warm highlight         #F0A860   accent, inner glow
Dark stone             #1C1A17   background
Stone shadow           #2A2723   depth
Bone / chalk white     #F2EEE8   wordmark on dark
Muted stone            #7E7468   secondary text
```

Never pure black and never pure white. Everything carries a little warmth.

## Type

| Use | Face | Setting |
|---|---|---|
| Wordmark | Inter Display Bold | all lowercase, `letter-spacing: -4px` at 108px |
| Tagline | JetBrains Mono Regular | ochre, echoes the terminal the skill lives in |
| Body | Inter Regular | muted stone |

Both fonts are open-licensed and vendored in `assets/src/` so a rebuild is reproducible.

## Files

| File | Use |
|---|---|
| `logo.png`, `logo-light.png` | 1024 icon, rounded tile, dark and light |
| `logo-128/64/32.png` | Icon exports |
| `mark-dark-square.png`, `mark-light-square.png` | The mark on a square, no rounding |
| `logo-banner.png`, `logo-banner-light.png` | README hero. 2560×800, a 2x export of a 1280×400 layout. |
| `social-preview.png` | GitHub social preview. 2560×1280, a 2x export of a 1280×640 layout. |
| `favicon.png` + `-64/48/32/16` | Head only. See below. |
| `favicon-light.png` + sizes | Same, for light browser chrome |
| `src/` | Layout HTML for the composites, plus the vendored fonts |

### Why the favicon drops the speech marks

At 32 pixels the three strokes stop being three strokes. They merge into a single brown
wedge next to the head, which reads as a smudge rather than as speech. Below about 48
pixels the head alone is the stronger mark: it keeps the silhouette, and it loses only the
detail that was already illegible.

This is ordinary responsive-logo practice, not a compromise. Use the full mark at 64 pixels
and above, the head alone below that.

## Rebuilding

```bash
npm i -D playwright
npm run render
```

The mark is a raster and is checked in. Everything laid out around it is HTML and CSS: the
wordmark, the tagline, the spacing. The type stays crisp and editable. Edit the HTML, then
re-render.

`npm run render` rebuilds `social-preview.png`. The two banners were produced alongside the
mark and are checked in as they are.

## Checks before changing the mark

- At 32 pixels, is it still one clear shape?
- Does it read as *deliberate*? Careless and over-decorated both fail.
- Next to the caveman logo, does it look like a different project rather than a sequel?
- Does it survive on both a light and a dark README background?
