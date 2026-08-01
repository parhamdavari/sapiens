# Loop decision: sentence-length target below the ceiling — REVERTED

Second attempt at the 25-word ceiling, after
[the first](DECISION-2026-08-01-sentence-ceiling.md) was reverted on a null result. This
one was better designed and also failed. The diagnosis it produced is worth more than the
edit was.

## The edit

Two places, one mechanism. Core rule 3 gained a target below the limit, on the theory that
aiming at a ceiling puts half the distribution over it:

> One idea per sentence. Target 15 to 20 words. 25 is the ceiling, not the target.

Pre-send check 3 gained a concrete trigger instead of an instruction to count:

> The suspects are easy to spot: two or more commas, or two clauses joined by "and" or
> "which".

## Method

Nine before-runs and eighteen after-runs, all `claude-opus-5[1m]`.

The earlier r1 to r6 transcripts are **excluded**. They were generated on
`claude-fable-5` before the session model changed. Comparing across that boundary would
measure the model, not the edit. The frontmatter is what made the split visible, which is
the reason it is recorded.

## Result

| | before (n=9) | after (n=18) |
|---|---:|---:|
| sentences over 25 words, per run | 1.67 | 1.44 |
| runs with zero breaches | 4/9 | 6/18 |
| reading grade | 6.9 | 7.4 |
| words | 172 | 180 |
| off-list vocabulary | 13.8% | 14.2% |
| recall | 42/45 | 88/90 |

Per-run breach counts:

```
before  ci-triage 0,0,0   pr-orientation 2,3,3         pr-review 0,5,2
after   ci-triage 0,0,0   pr-orientation 3,3,2,3,1,1   pr-review 3,2,3,3,1,1
```

A two-sided permutation test over those counts, 20,000 iterations, gives **p = 0.784**.
The `pr-review` before-arm alone spans 0 to 5, and that spread is wider than the effect
being chased.

Recall held, so the veto did not fire. Two secondary numbers moved the wrong way: clean
runs fell from 44% to 33%, and reading grade rose 0.45.

## Decision

**Reverted.** No detectable effect on the target, and two secondary metrics slightly
worse.

## What this attempt established

Reading the flagged sentences, which neither attempt had done before deciding, explains
both failures.

41 sentences breached across the 27 runs. Only 15 sit at 26 to 28 words. The other 26 run
29 words or longer, up to 66. They share one shape:

> Five smaller fixes ride along, mostly in the same area: compiled members were being
> dispatched with an empty tool array (nine-member runs finished with zero tool calls), an
> empty ontology allow-list allowed everything instead of blocking everything, SQL imports
> skipped the ontology check entirely, and the knowledge-graph service defaulted to a stub
> credential broker that handed out the platform's own database connection instead of the
> user's.

That is five parallel items in one comma chain. The breach is an **enumeration** failure,
not a sentence-length failure.

The scenario evidence agrees. `ci-triage` scored zero breaches in all nine runs across
both arms, because its answer names one decision. `pr-orientation` and `pr-review` both
require listing several findings, and both breach in nearly every run.

Both edits so far attacked length in the abstract. Neither said anything about what to do
when a reply must name three or more parallel things. The skill's shape section leans
against bullets ("bullets only when the content is genuinely a list"), which may be
reading as a discouragement in exactly the case where a list is correct.

## Next hypothesis

Give the enumeration case its own rule: three or more parallel items become a list or
separate sentences, never one comma chain. That is a different intervention from a
stricter limit, and it is aimed at the shape the evidence actually shows.

A third rewrite of the length rule is not worth running.
