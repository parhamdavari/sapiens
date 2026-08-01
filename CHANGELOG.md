# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com). Versions follow
[Semantic Versioning](https://semver.org).

> **A note on figures in older entries.** The measurement scripts changed in 3.3.0. The
> idiom list was rebuilt from scratch, and the text extractor learned to ignore markdown,
> tables and frontmatter. Numbers quoted in entries before 3.3.0 came from the old scripts
> and do not reproduce against the current ones. Only the 3.3.0 table below is current.
> Run `npm run measure` for the live figures.

## [3.4.0]

**Changed**

- `lead` is now the default level. It was `dev`. Without a named level, a reply is a status
  update rather than a teammate's explanation, and asking for more costs one line.
- The reason recorded for the old default was that `dev` is the level that is rarely wrong.
  That reason still holds, and it is now stated under `dev` in `docs/levels.md` for anyone
  who wants to switch back. The new default trades a small risk of omission for a shorter
  reply by default.
- `SKILL.md` and `docs/levels.md` both carry the caution that comes with the change: `lead`
  can leave out a detail you needed, and you will not always notice it is missing. Any
  detail that changes what the reader does next stays in, at every level.
- No measured figure changed. The benchmark transcripts are not level-tagged, so this
  release adds no new numbers and removes none.

## [3.3.0]

The pre-launch audit release. Nothing about the skill's behaviour changed. Everything about
how the project reports itself did.

**Honesty fixes**

- The old idiom list had 32 entries, eight of which appeared only in the single transcript
  the README used as its bad example. That list had been written by reading its own exhibit,
  so its output was not a measurement. `scripts/figurative-list.mjs` replaces it. A second audit found six
  lifted strings still in the replacement, and removed those too. The list now holds 175
  entries, and the column reads zero for every with-and-without pair in the benchmark.
- The before/after table labelled a real-session reply as the "Default" column, while the
  results table two sections below called the same file "real session". The table now shows
  the generated baseline against the generated sapiens answer, both from one fixture. The
  honest comparison is 307 words to 113, not 191 to 113.
- Both quotes in that table had been rewritten by hand while presented as excerpts from the
  linked files. They are now the verbatim openings of those files.
- Removed the claim that "an independent adversarial pass confirmed no material finding was
  dropped". There was no artifact behind it, and it was wrong. `pr-review--sapiens.md` drops
  one weak-evidence finding, and `benchmarks/README.md` now records that failure.
- The README gained a section called "What this evidence does not show": one run per cell,
  both sides written by the author, no human readers, no cited grade anchor.
- The README now points out the one number that moves the wrong way. Average sentence length
  is worse with the skill in the showcase scenario, 14.1 against 13.3.
- Corrected "62% and 64% fewer words" to 59% and 64%.
- Corrected "the installer is forty lines" to 90 lines.
- Corrected "twelve words" to thirteen, and dropped "defined in six words", which was 19.
- `docs/why-not-caveman.md` now attributes caveman's 65% token figure to caveman's own
  README rather than stating it as measured here.
- Fixed the Credits link, which pointed at `https://github.com/` with no path.
- A review of this release caught three more. The claim that the old README failed all four
  self-check rules was wrong: it failed two, and the grade and idiom figures quoted for it
  came from the pre-3.3.0 scripts. The README said self-check sweeps every markdown file
  when it sweeps 17 of 27. The `npm run measure --prose-only` example was missing the `--`
  that npm needs to pass a flag through. All three are corrected.

**New**

- `npm run self-check` holds this repo's own writing to the standard the skill sells. No
  sentence over 25 words. No idiom from the list. A reading grade under nine. At most three
  em dashes per file. It sweeps every markdown file outside `benchmarks/`, with no per-file
  exemptions, and a failure blocks the merge.
- `npm run measure` accepts file arguments, so any document can be scored.
- New brand mark: an early-human head in profile speaking three ochre strokes. Dark and
  light variants for the icon and the banner, plus a head-only favicon for 48px and below.
- `docs/brand.md` records the mark's reasoning, the palette and the responsive rule.

**Measured after this release**

| transcript | turns | words | FK | >25w |
|---|---:|---:|---:|---:|
| `pr-review--baseline` | 3 | 500 | 7.9 | 6 |
| `pr-review--sapiens` | 1 | 207 | 6.1 | 1 |
| `ci-triage--baseline` | 5 | 313 | 5.3 | 2 |
| `ci-triage--sapiens` | 1 | 112 | 4.6 | 0 |
| `pr-orientation--baseline` | 1 | 307 | 9.3 | 1 |
| `pr-orientation--sapiens` | 1 | 113 | 5.9 | 0 |

**Fixed**

- `install.ps1` threw before it could run when piped into `iex`, because `$PSScriptRoot` is
  null in that case. It now guards the local-checkout branch.
- `scripts/init-repo.sh` named the wrong file for the GitHub social preview.

## [3.2.0]

Restructured for the [Agent Skills specification](https://agentskills.io/specification.md).

- Long lookup tables moved to `references/plain-english.md`, loaded on demand
- Rationale prose compressed, and a duplicate levels table removed
- `SKILL.md` cut from about 6,900 to about 5,000 tokens, inside the recommended budget

## [3.1.0]

- **Size budget.** Answer length now follows from the question asked, with a table of
  defaults and the habit of offering depth in one line instead of delivering it.
- **Figurative language and undefined jargon.** The failure that standard readability scores
  cannot detect.
- A hard 25-word ceiling on sentences, with counting moved into the pre-send checks.

## [3.0.0]

- **Turn architecture.** Rules for how often to speak across a long task: a speaking budget,
  a test for what earns a mid-task message, and a final-report shape where one fact has one
  home.
- **Pre-send checklist.** Cheap self-checks on the finished draft, ending with a
  completeness check so shortening never becomes dropping a finding.
- Reporting depth now scales with the level.

## [2.0.0]

- Scope boundary between chat prose and artifacts such as code and commit messages
- A larger catalogue of banned AI phrases, grouped by function
- Plain-English word swap table
- Shape and rhythm section
- A "don't overcorrect" section, so the rules do not produce sterile output

## [1.0.0]

- Initial release: three levels, dual activation, core grammar rules
