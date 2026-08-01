# Loop decision: enumeration rule — REVERTED

Third attempt at the 25-word ceiling ([issue #6](https://github.com/parhamdavari/sapiens/issues/6)),
and the first aimed at a mechanism found in the data rather than guessed. It also failed.
The way it failed is the most useful thing in this folder.

## The edit

Core rule 3 gained an explicit enumeration clause:

> **Three or more parallel items never share a sentence.** Give each its own sentence, or
> make them a list. Chaining four findings with commas is how this rule breaks most often.

The shape section's bullet guidance was clarified in the same direction, from "bullets only
when the content is genuinely a list" to "Use bullets when the content is genuinely a list,
which four findings are."

Motivation: 26 of 41 breached sentences ran 29 words or longer, and nearly all were three
or more parallel findings in one comma chain. `ci-triage`, whose answer names one decision,
never breached.

## Method

Two blocks, 36 runs per arm in total, all `claude-opus-5[1m]`, six runs per scenario per
block. The skill was stashed during every before-run, so the two arms differ only by the
edit.

## Result

| | before (n=36) | after (n=36) |
|---|---:|---:|
| sentences over 25 words, per run | 1.47 | 1.22 |
| `ci-triage` | 0.17 | 0.00 |
| `pr-orientation` | 2.08 | 2.08 |
| `pr-review` | 2.17 | 1.58 |
| reading grade | 6.88 | 6.63 |
| words | 180 | 171 |
| off-list vocabulary | 13.7% | 13.4% |
| recall | 170/180 | 171/180 |

Permutation tests, 100,000 iterations, two-sided:

| Scope | difference | p |
|---|---:|---:|
| all scenarios | 0.25 | 0.475 |
| `ci-triage` | 0.17 | 0.479 |
| `pr-orientation` | 0.00 | 1.000 |
| `pr-review` | 0.58 | 0.342 |

## Decision

**Reverted.** No detectable effect. On the scenario that motivated the edit the two arms
are identical.

## Why the second block mattered

The first block, 18 runs per arm, looked like a win: the target metric fell 38%, all three
scenarios improved, every secondary metric moved the right way, and the test came back at
p = 0.158. That is the shape of a result somebody ships.

Doubling the sample collapsed it. The difference fell from 0.72 to 0.25, and
`pr-orientation` went from an apparent 0.66 improvement to exactly zero.

Had this been kept on block 1 alone, the README would now carry a claim that a rewrite
of the pre-launch audit would later have to strip. That is the whole argument for running
the second block before deciding, and for a protocol that treats "the number moved" as a
question rather than an answer.

## Three attempts, one conclusion

| Attempt | Target | p |
|---|---|---:|
| [wording of the pre-send check](DECISION-2026-08-01-sentence-ceiling.md) | length | not run, null on inspection |
| [target below the ceiling](DECISION-2026-08-01-sentence-ceiling-v2.md) | length | 0.784 |
| enumeration rule (this one) | enumeration | 0.475 |

Three edits, increasingly well aimed, none with a detectable effect. The third was built
from the failure pattern in the transcripts rather than from intuition, and still moved
nothing on the scenario that fails most.

The reasonable conclusion is that this behaviour is not reachable by adding or rewording a
rule in `SKILL.md`. The instruction is already stated twice, in a core rule and in a
pre-send check, and a third statement changes nothing.

## What to try instead

Stop editing the instruction. The remaining options are structural:

- **Test whether the ceiling is right.** A 26-word sentence and a 57-word comma chain both
  count as one breach. They are not the same problem for a reader. A severity-weighted
  metric would say whether the long tail is shrinking even when the count does not move.
- **Get a human reader involved.** The skill's claim is comprehension, not word count.
  A reader study would say whether these sentences actually cost anything, which no
  amount of counting can answer.
- **Accept and document the limit.** If instruction-level control cannot hold this rule,
  the honest move is to say so in the README rather than keep the rule and quietly miss it.

Issue #6 stays open, with the target narrowed: not "make the rule work" but "find out
whether it can work at all".
