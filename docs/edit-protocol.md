# Changing the skill text

`skills/sapiens/SKILL.md` is the only file that changes what Claude writes. Everything
else in this repo measures it. So a change here needs evidence, and this page is the
procedure that produces it.

The short version: score the skill before your edit, make the edit, score it again, and
keep the edit only if the numbers earned it.

## Why a protocol at all

A wording change to a set of instructions feels cheap. It is not. Nobody can tell by
reading whether a rewritten rule makes replies better. An edit that sounds convincing and
does nothing looks exactly like one that works, until you measure both.

The protocol also protects against the failure that matters most. Every metric in this
repo except one rewards shorter and plainer text. A reply can improve on all of them by
quietly dropping a fact. Recall is the counterweight, and it has veto power.

## The loop

**1. Generate the before-runs.**

```bash
node benchmarks/generate.mjs --all 3
```

That drives the Claude CLI in headless mode, answering every scenario from its frozen
fixture, three runs per arm. Three is the minimum: a single run is noise. Each transcript
records the model, the skill version, the date, and the run number in its frontmatter.

Output lands in `benchmarks/runs/`. `benchmarks/results/` is frozen evidence from the
original study and is never written to.

**2. Make one edit to `SKILL.md`.**

One change at a time. Two changes in one batch cannot be told apart afterwards.

Watch the token budget. `node scripts/validate.mjs` reports it, and the file sits close
to the 5,000-token ceiling the Agent Skills spec recommends. Adding a rule usually means
removing one or moving it to `references/plain-english.md`.

**3. Generate the after-runs**, three per scenario again, with fresh run numbers.

**4. Score both sets.**

```bash
node benchmarks/generate.mjs --score
```

This reports words, grade, sentences over 25 words, off-list vocabulary share, idiom
hits, and recall against each scenario's findings checklist.

**5. Decide, and write the decision down.**

## The rule

> Word counts and grades may improve only while recall holds.

A change that trades recall for brevity is rejected, whatever the other numbers say. That
is the whole point of the recall column: a shortening pass loses weak-evidence findings
first, and those are usually the ones worth keeping.

Beyond that veto, judge the size of the effect honestly. Three runs per scenario detects a
large change, not a small one. If the target metric moves a little and the scenario that
motivated the edit does not move at all, that is a null result. Keeping an edit because it
"did not hurt" is how a project starts overclaiming.

## The decision record

Every attempt lands in `benchmarks/runs/` as `DECISION-<date>-<topic>.md`, whether the
edit was kept or reverted, containing:

- the observation that motivated the edit
- the before and after text of the changed rule
- the comparison table, with recall on both sides
- the decision, and the reasoning behind it
- what the attempt established, including what it failed to establish

Reverted attempts are recorded in exactly the same detail as successful ones. A record of
only the changes that worked is a sales brochure, not evidence.

The first decision under this protocol is
[`DECISION-2026-08-01-sentence-ceiling.md`](../benchmarks/runs/DECISION-2026-08-01-sentence-ceiling.md).
It was a revert.

## What CI enforces

`npm run evidence-gate` runs on every pull request. It fails a pull request that changes
`SKILL.md` without adding a decision record. It also fails a record that is missing a
comparison table, recall figures, or a named model, and one that cites a transcript
nobody committed.

Two things it deliberately does not do. It does not generate replies. Generation needs
credentials, costs tokens per run, and varies between runs, so a contributor's change
could fail on variance rather than on its own quality. It also cannot tell whether a
decision was right. It checks that the evidence exists and is reachable. A reviewer still
reads the numbers and decides.

A release that only bumps the version line in the frontmatter passes without a record.

## Rules that hold for any change in this repo

**Always.** Run `npm test` before a commit. Keep the provenance headers in
`scripts/data/` complete. Leave `benchmarks/results/` and the facts in
`benchmarks/scenarios/` untouched. Every number printed in a document comes from a run
you can reproduce.

**Ask first.** Adding an npm dependency. Changing a self-check threshold. Changing the
licence or the source of a vendored word list.

**Never.** Hand-edit a vendored or derived list to change a result; change a filter in
the derivation script and re-run it instead. No network access at measure time. No
invented or rounded figure.

**Release tags publish.** Pushing any `v*` tag triggers `release.yml`, which packages
the skill and publishes a public GitHub release immediately. The tag is the publish
button, not a label. Tag only after the release pull request is merged and green, from
the merged commit on the default branch.

## Known gap

No scenario asks the same question early and late in a long conversation. Consistency
across a session is a stated goal of the skill, and nothing here tests it. A depth
scenario is the most useful addition this folder could get.
