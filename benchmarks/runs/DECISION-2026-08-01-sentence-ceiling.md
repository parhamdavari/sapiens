# Loop decision: strengthen pre-send check 3 — REVERTED

The first `SKILL.md` edit taken through the D9 protocol (`tasks/spec.md`). Recorded
whether kept or not, because the decision and its evidence are the point.

## The observation that motivated the edit

The first committed batch (runs r1 to r3, sapiens arm, model `claude-fable-5`) broke the
25-word sentence ceiling 17 times across 9 replies, no better than the baseline arm. The
skill's pre-send check 3 exists to prevent exactly this.

## The edit

Check 3 was changed from:

> **Count the words in your longest sentence.** Actually count. Past about 25, split it
> in two. Counting is required because a long sentence always reads fine to whoever just
> wrote it.

to:

> **Count the words in your three longest sentences.** Past 25, split that sentence in
> two. A long sentence reads fine to whoever just wrote it, so counting decides, not
> feel. Zero sentences over 25 is the exit condition.

## The comparison

Nine runs per side, three per scenario, same model, same fixtures. Before = r1 to r3,
after = r4 to r6, all committed in this directory.

| | >25w total | words total | grade avg | recall |
|---|---:|---:|---:|---:|
| before (r1-r3) | 17 | 1570 | 8.26 | 43/45 |
| after (r4-r6) | 14 | 1439 | 8.17 | 43/45 |

Recall held, which the protocol requires before anything else counts. The guard also
caught real drops on both sides: `hook-passing-not-failing` fell out of one run in each
set, and `only-one-real-bug` out of one after-run.

## The decision, and why

**Reverted.** The target metric moved from 17 to 14, but the scenario that motivated the
edit did not move at all: pr-orientation scored 3, 3, 2 before and 3, 3, 3 after. With
three runs per scenario and per-run variance of one to two long sentences, a change of
three across nine runs is not a demonstrated effect. Keeping an edit on a null result,
because it "did not hurt", is the overclaiming pattern this repo's audit removed, and
the protocol does not get an exemption from it.

What this run of the loop actually established:

1. The protocol works end to end: generate, score, compare, decide, record.
2. The guard metric catches real dropped findings in live runs, twice here.
3. Three runs per scenario is enough to hold the recall line and not enough to detect a
   wording-level effect on sentence discipline. The next attempt at this target needs
   either a larger effect (a structural rule change, not a phrasing change) or more runs.

The 25-word breach stands as the top open finding against the skill text.
