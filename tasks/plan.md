# Plan: measurement layer v2

Implements `tasks/spec.md`. Nine phases. Phases 2, 3, and 4 can run in parallel once
phase 1 lands. The task list with acceptance criteria is in `tasks/todo.md`.

## Phase order and dependencies

```
0 acquire ──┬─→ 3 vocabulary ──┐
            └─→ 4 idioms ──────┤
1 library ──┬─→ 2 formulas ────┼─→ 5 report and docs ─→ 8 release
            │                  │                          ↑
            └─→ 6 harness ─────┴─→ 7 loop demo ──────────┘
```

**Phase 0: acquisitions.** Download the NGSL word list and the Wiktionary idiom category.
Compute reference grade scores for the calibration passages with an independent tool.
This phase runs first because it carries the only external risk: network access. If the
environment blocks a download, the affected task gets handed to the human as a command to
run, and everything else continues.

**Phase 1: library extraction.** Split `measure.mjs` into `scripts/lib/` modules. Fix the
sentence splitter with an explicit abbreviation set. Add unit tests and `toProse` golden
snapshots. Everything downstream depends on this phase, so it goes first and alone.

**Phase 2: formulas.** Add Coleman-Liau and ARI beside Flesch-Kincaid. The headline grade
becomes the median of the three. Calibrate against the phase 0 reference values.

**Phase 3: vocabulary.** The familiar-word coverage metric against the vendored NGSL,
with suffix rules and an irregular-forms table for inflections.

**Phase 4: idioms.** The derivation script, the derived data file with a provenance
header, the word-boundary matcher, and the false-positive and true-positive corpora.

**Phase 5: report and docs.** New report format with the added columns. A `--markdown`
flag emits the tables, and the README and benchmarks tables get regenerated from it.
Self-check thresholds are recalibrated and the method is documented beside them. The
changelog gets a comparability note in the style of the 3.3.0 one.

**Phase 6: harness.** The generation script that drives the Claude CLI headless, three
runs per scenario, transcripts committed under `benchmarks/runs/` with model, skill
version, date, and run number recorded. A findings checklist is added to each scenario,
and the scorer reports recall against it.

**Phase 7: loop demonstration.** One candidate `SKILL.md` edit goes through the D9
protocol: before and after scores over three runs, keep or revert, decision recorded.

**Phase 8: release.** Version bumps, tag, and the release notes. Default 3.5.0.

## Risks

| Risk | Mitigation |
|---|---|
| No network access for downloads | Phase 0 runs first. Blocked downloads become commands handed to the human, with the rest unblocked. |
| Reference-score tool unavailable | Micro-fixtures carry hand-counted exact values either way. Passage references can come from published examples if the tool is missing. |
| Wiktionary list too large or noisy | Filters are mechanical and documented. The matcher compiles one regex, so size costs little. If noise remains, tighten a filter and re-run, never hand-prune. |
| New thresholds fail existing docs | Expected. Offending sentences get rewritten, and the recalibration method is written down so the change is not silent. |
| Headless CLI generation misbehaves | A one-scenario spike runs early, in phase 0, before the harness is built on top of it. |
| Every published number changes | Planned. Phase 5 regenerates all tables by script and the changelog records the break. |

## Verification checkpoints

- After phase 1: `npm test` passes, and the old README measured with the new splitter is
  recorded, so the splitter's effect on numbers is visible on its own.
- After phases 2 to 4: calibration, corpus, and coverage tests all pass.
- After phase 5: `npm run validate` and `npm run self-check` pass on a clean checkout,
  and no hand-typed number remains in any regenerated table.
- After phase 7: the decision record exists with scores attached.
- After phase 8: CI passes on both platforms and the release carries the built skill.
