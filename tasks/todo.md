# Tasks: measurement layer v2

Ordered by dependency. Tasks 5 to 7 can run in parallel after task 4. See
`tasks/plan.md` for the phase map.

## Phase 0: acquisitions

- [x] T1: Vendor the NGSL word list
  - Done when: `scripts/data/ngsl.txt` exists with source, licence, URL, retrieval date, and entry count in the header
  - Check: header fields present, count matches the file body
  - Files: `scripts/data/ngsl.txt`

- [x] T2: Fetch the Wiktionary idiom category dump
  - Done when: raw category data saved for the derivation script, with retrieval date
  - Check: file exists and parses
  - Files: `scripts/data/wiktionary-idioms-raw.json`

- [x] T3: Reference scores for calibration passages
  - Done when: public-domain passages chosen, reference grades computed by an independent tool, stored as expected values
  - Check: `tests/fixtures/calibration.json` holds passage, source, and expected scores per formula
  - Files: `tests/fixtures/calibration.json`, passage files under `tests/fixtures/`

- [x] T4: Spike one headless CLI reply
  - Done when: a script produces one reply to one scenario with the skill loaded, saving model, skill version, date, and run number
  - Check: the transcript file exists with all four metadata fields
  - Files: `benchmarks/generate.mjs`, one file under `benchmarks/runs/`

## Phase 1: library

- [x] T5: Extract `scripts/lib/text.mjs` and fix the splitter
  - Done when: `toProse` and sentence segmentation move to the lib, abbreviations and decimals no longer split sentences, the abbreviation set is a named constant
  - Check: `npm run test:unit` passes the splitter fixture set, including `vs.` and `e.g.`
  - Files: `scripts/lib/text.mjs`, `scripts/measure.mjs`, `tests/text.test.mjs`

- [x] T6: Golden snapshots for `toProse`
  - Done when: snapshots for the README and one transcript, compared byte-for-byte
  - Check: a deliberate one-character stripper change fails the test
  - Files: `tests/golden.test.mjs`, snapshots under `tests/fixtures/`

## Phases 2 to 4, parallel

- [x] T7: Formulas module
  - Done when: Flesch-Kincaid, Coleman-Liau, and ARI in `scripts/lib/formulas.mjs`, median exposed as the headline grade, disagreement over 2 grades flagged
  - Check: micro-fixtures assert exact values, calibration passages within one grade of reference
  - Files: `scripts/lib/formulas.mjs`, `tests/formulas.test.mjs`

- [x] T8: Vocabulary coverage module
  - Done when: share of words outside NGSL, with suffix rules and an irregular-forms table
  - Check: fixture texts with hand-counted coverage assert exactly
  - Files: `scripts/lib/vocab.mjs`, `scripts/data/irregular-forms.txt`, `tests/vocab.test.mjs`

- [x] T9: Idiom derivation script
  - Done when: mechanical filters only, documented in the script, output has a full provenance header
  - Check: running the script twice produces identical output
  - Files: `scripts/build-idiom-list.mjs`, `scripts/data/idioms.txt`

- [x] T10: Word-boundary matcher and corpora
  - Done when: matcher in `scripts/lib/idioms.mjs`, false-positive corpus of at least twenty literal phrases hits zero, true-positive corpus fully detected
  - Check: `npm run test:unit` passes both corpora, `in the redirect` and `expensive to compute` produce no hit
  - Files: `scripts/lib/idioms.mjs`, `tests/idioms.test.mjs`

## Phase 5: report and docs

- [x] T11: New report and `--markdown` output
  - Done when: report shows grade median, coverage, and idiom columns, `--markdown` emits the tables used by the docs
  - Check: `npm run measure` runs on the frozen transcripts without error, old `figurative-list.mjs` removed
  - Files: `scripts/measure.mjs`, `scripts/figurative-list.mjs` (deleted), `scripts/self-check.mjs`

- [x] T12: Recalibrate thresholds and regenerate docs
  - Done when: self-check thresholds redefined against the new formulas, with the method documented beside them. All tables in the README and benchmarks regenerated. Changelog comparability note added
  - Check: `npm run validate` and `npm run self-check` pass on a clean checkout
  - Files: `scripts/self-check.mjs`, `README.md`, `benchmarks/README.md`, `CHANGELOG.md`

## Phase 6: harness

- [x] T13: Findings checklists and recall scorer
  - Done when: each scenario carries a checklist of required facts, scorer reports recall per transcript
  - Check: the frozen `pr-review--sapiens.md` scores below full recall, because its dropped finding is on the checklist
  - Files: `benchmarks/scenarios/*.md`, `scripts/lib/recall.mjs`, `tests/recall.test.mjs`

- [x] T14: Full generation harness
  - Done when: one command answers every scenario three times, commits transcripts under `benchmarks/runs/` with full metadata
  - Check: a complete run produces nine transcripts and a scores summary
  - Files: `benchmarks/generate.mjs`

## Phase 7: loop demonstration

- [x] T15: One edit through the D9 protocol
  - Done when: a candidate `SKILL.md` edit scored before and after over three runs, decision recorded with the scores, recall not lower if the edit is kept
  - Check: the decision record exists under `benchmarks/runs/` and links both score sets
  - Files: `skills/sapiens/SKILL.md` (possibly reverted), decision record

## Phase 8: release

- [x] T16: Release
  - Done when: versions bumped, changelog complete, tag pushed, CI passes on both platforms, release carries the built skill
  - Check: `gh run list` shows the validate and release workflows passing
  - Files: `package.json`, `skills/sapiens/SKILL.md` frontmatter, `CHANGELOG.md`
