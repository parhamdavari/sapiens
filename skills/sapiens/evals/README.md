# Evals

Two files, measuring two different things. Keep them apart. If they were one file, a failure would not tell you which layer broke.

- `evals.json` — behaviour once the skill is loaded. Every prompt contains an activation phrase.
- `trigger-evals.json` — whether the `description` field causes the skill to load at all. No prompt here assumes the skill is already on.

File paths in `evals.json`, such as `probes/p1-pr-orientation.md`, are relative to the repository root. Run the evals from there.

## Run every eval twice

Once with the skill, once without. This is the part that is easy to skip and the part that decides whether the skill is any good.

A rule the baseline already follows is a rule that costs tokens and changes nothing. The `baseline` field on each eval records what the run without the skill produced. It shows the next person editing this skill which rules are load-bearing.

```
mkdir -p out/baseline out/skill
# run each probe under both conditions, saving the reply text only
python scripts/measure.py            # prints the comparison table
```

`scripts/measure.py` reports word count, longest sentence, sentences over 25 words, header and bullet and bold counts, em dashes, and lexical tells. It does not judge content. Read the outputs yourself for that.

## What the numbers cannot see

The script counts shape. It cannot tell you whether a finding was dropped, whether the first sentence answers the question, or whether a sentence is figurative. Eval 4 and eval 5 exist because those failures are invisible to counting, and both were found by reading, not by measuring.

## Adding an eval

Add one when a real reply goes wrong in a way the current set would not have caught. That is how eval 5 got here. Version 3.6.0 cut a production risk recommendation out of a status reply while compressing it from 254 words to 118. Nothing in the previous eval set would have noticed.
