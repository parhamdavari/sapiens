# Spec: measurement layer v2

Rebuild `scripts/measure.mjs` and replace `scripts/figurative-list.mjs` so that every
published number rests on validated, externally sourced criteria. The current layer has
four verified weaknesses. This spec records them, the fixes, and the tests that prove the
fixes and then stay in CI.

## Objective

The repo claims its output is plain, complete English at a stated vocabulary level. The
measurement layer must be able to support that claim to an outside reader who trusts
nothing. That means three properties the current scripts do not have.

1. **Validated.** Grade scores must be checkable against published reference values, not
   against the intuition of whoever wrote the syllable counter.
2. **Independent.** No entry in the idiom list may exist because someone read this repo's
   own transcripts. The list author must never have seen them.
3. **Honest about matching.** A metric must not fire on text it was never meant to match.

### Verified defects being fixed

Each defect below was reproduced with a test before this spec was written.

- The sentence splitter breaks on abbreviations. `We compare A vs. B in stage 4. It
  works, e.g. on macOS.` counts as four sentences instead of two. This skews the
  `avg-sent` and `>25w` columns, which two self-check rules depend on.
- The idiom matcher uses substring matching. `in the redirect flow` fires the entry
  `in the red`. Literal technical use of `expensive to compute` fires `expensive to`.
- The Flesch-Kincaid grade depends on a rough syllable guesser with no accuracy test.
- The stated vocabulary level (roughly IELTS Band 6) is not measured by anything.

## Deliverables

**D1. Multi-formula grade analysis.** Report Flesch-Kincaid, Coleman-Liau, and ARI.
The last two count characters, not syllables, so they have no guessing step. The headline
`grade` column is the median of the three. Disagreement above 2 grades between formulas
is printed as a warning, because it usually means the input text confused the tokenizer.

**D2. Vocabulary coverage.** A new column: the share of words not on a vendored,
published familiar-word list. Primary list: NGSL (New General Service List, Browne,
Culligan and Phillips 2013, CC BY 3.0). Matching covers regular inflections through a
small documented suffix ruleset plus a vendored irregular-forms table.

**D3. Externally derived idiom list.** `scripts/build-idiom-list.mjs` (dev-time only,
network allowed there and nowhere else) derives the list from Wiktionary's English-idioms
category, which is openly licensed. Filters are mechanical and documented in the script:
multi-word entries only, ASCII only, no proper nouns. Anyone can re-run it and get the
same list. The output data file replaces `figurative-list.mjs`. Matching uses word
boundaries, lowercased.

**D4. Correct sentence segmentation.** The splitter must not break on common
abbreviations (`e.g.`, `i.e.`, `vs.`, `etc.`), decimals, or version numbers. The
abbreviation set is a visible constant, not a heuristic.

**D5. Calibration suite.** A permanent test set with two layers. Micro-fixtures where
expected values are hand-countable, asserted exactly. Public-domain passages with
reference scores computed once by an independent tool, asserted within plus or minus one
grade. This suite is the loop: implement, run, compare, adjust, repeat until inside
tolerance, and every iteration's test stays in CI.

**D6. Re-measured publications.** Every table in `README.md` and `benchmarks/README.md`
is regenerated from the new output. The changelog carries a note in the style of the
3.3.0 note: numbers before this version do not reproduce against the current scripts.
Self-check thresholds are recalibrated against the new formulas and the method is written
down next to the thresholds.

## Part B: closing the loop on SKILL.md

Part A above builds a valid ruler. Part B uses it to improve the skill itself, which is
the actual goal. The loop: generate replies from fixed scenarios with the skill loaded,
score them, edit `SKILL.md` where scores show weakness, regenerate, compare. Keep the
edit only if scores improve. Revert it if they do not.

**D7. Reproducible generation.** A script drives the Claude CLI in headless mode: it
answers every scenario three times with the skill loaded and saves the replies. Every
generated transcript records the model, the skill version, the date, and the run number.
Transcripts are committed, so the evidence behind each loop decision stays in history.
They live in a separate directory and never overwrite `benchmarks/results/`, which
stays frozen.

**D8. Findings-recall metric.** Each scenario fixture gains a checklist of the facts a
correct answer must contain. The scorer reports how many appear in the reply. This is
the metric class the current layer cannot see, and it is the one that catches a dropped
finding. It exists to stop the loop from rewarding replies that got shorter by losing
content.

**D9. Edit protocol for the skill.** A change to `SKILL.md` ships with before and after
scores over at least three runs per scenario, because single runs are noise. The rule is
strict: word counts and grades may improve only while recall holds. A change that trades
recall for brevity is rejected, whatever the other numbers say.

**Depth scenarios.** At least one new scenario asks the same question early and late in
a long conversation. Consistency across a session is a stated goal, and nothing
currently tests it.

## Tech stack

Plain Node ESM, zero runtime dependencies, matching the existing scripts. Tests use the
built-in `node:test` runner, which adds no dependency. Word lists and idiom lists are
vendored data files. Every data file header states source, licence, URL, retrieval date,
and entry count.

## Commands

```
npm run validate      # unchanged, spec check on SKILL.md
npm run self-check    # unchanged in role, thresholds recalibrated
npm run measure       # new columns, same entry point
npm run test:unit     # new, node --test over tests/
npm run build:idioms  # new, dev-time derivation of the idiom data file
npm test              # validate + self-check + test:unit
```

## Project structure

```
scripts/measure.mjs        CLI and report, imports the lib
scripts/lib/text.mjs       toProse, sentence segmentation
scripts/lib/formulas.mjs   FK, Coleman-Liau, ARI, syllable counter
scripts/lib/vocab.mjs      familiar-word coverage
scripts/lib/idioms.mjs     word-boundary matcher
scripts/data/ngsl.txt      vendored word list, header with provenance
scripts/data/idioms.txt    derived idiom list, header with provenance
scripts/build-idiom-list.mjs
tests/                     unit, golden, calibration, false-positive corpus
```

## Code style

Match the existing scripts: comment headers that explain provenance and what a number
does and does not mean, short functions, no clever one-liners. The style of
`figurative-list.mjs`'s header is the model.

## Testing strategy

- **Unit:** syllable counter against a hand-checked word set, sentence splitter against
  an abbreviation and decimal fixture set, matcher word-boundary cases.
- **Golden:** `toProse` snapshots for the README and one transcript, so a stripper change
  cannot silently move every number again.
- **Calibration:** the two-layer suite from D5.
- **False positives:** a corpus of literal phrases (`in the redirect`, `expensive to
  compute`, and at least twenty more) that must produce zero idiom hits.
- CI runs all of it on Ubuntu and macOS, in the existing `validate` workflow.

## Boundaries

- **Always:** run `npm test` before any commit. Keep provenance headers complete. Leave
  `benchmarks/results/` and `benchmarks/scenarios/` untouched. Every number printed in a
  document comes from a run.
- **Ask first:** adding any npm dependency. Changing a self-check threshold. Changing the
  licence or source of a vendored list. Publishing the release.
- **Never:** hand-edit a vendored or derived list to change a result. Edits go through
  the derivation script or the documented exception table. No network access at measure
  time. No invented or rounded figure.

## Success criteria

1. Calibration passages score within plus or minus one grade of independent reference
   values, for all three formulas.
2. Micro-fixtures assert exact values and pass.
3. The false-positive corpus produces zero idiom hits. The true-positive corpus is fully
   detected.
4. The abbreviation fixture set produces the correct sentence counts, including the two
   cases verified as broken above.
5. No entry in the idiom data file originates from this repo. The derivation is
   re-runnable by a stranger from the script alone.
6. `npm run validate` and `npm run self-check` pass after threshold recalibration.
7. All published tables are regenerated, and the changelog records the break in
   comparability.
8. Every scenario fixture carries a findings checklist, and the scorer reports recall
   against it.
9. One full loop iteration is demonstrated: a real `SKILL.md` edit, scored before and
   after over three runs, with the keep-or-revert decision recorded.
10. The frozen evidence in `benchmarks/results/` is byte-identical before and after all
    of this work.

## Out of scope

- Whether the skill behaves consistently at different depths of a conversation. That is
  skill behaviour, not measurement. It needs new benchmark scenarios recorded at several
  conversation depths, which should be its own spec.
- A human reader study. `benchmarks/README.md` already describes the design; it stays the
  most valuable missing evidence and cannot be replaced by these scripts.
- Any redesign of the skill text. The one exception is the single demonstration edit
  that criterion 9 requires, which goes through the D9 protocol and may end reverted.

## Open questions

1. The Dale-Chall word list has murky redistribution status, so NGSL is the primary
   list. Should we also seek permission to vendor Dale-Chall and report both coverages?
2. Version for the release: the 3.3.0 precedent treats renumbering as a minor bump, so
   the default is 3.5.0. Confirm, or argue for 4.0.0 since comparability breaks.
3. Should README tables become script-generated blocks, so a stale hand-typed number
   becomes impossible? Recommended, but it adds a small maintenance rule for
   contributors.
