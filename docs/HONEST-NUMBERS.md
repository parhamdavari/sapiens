# Honest numbers

Everything below comes from one run, eight probes, two conditions. It is a small sample and it is reproducible. The probes are in `probes/`, the outputs are in `out/`, and the script that produced the table is `scripts/measure.py`.

## Method

Eight realistic scenarios, each written as a user message plus the context an assistant would already have gathered. Every probe was answered twice by the same model. One run had no skill loaded and no skill consulted; the other had `SKILL.md` loaded and followed at the default level. Neither run was allowed to use tools beyond reading its own probe file, so the reply is the only variable.

Six probes are task-shaped: review this, debug this, clean this up, did it finish. Two are conversational: an open-ended opinion question, and a thank-you followed by a vague "what else could we improve?". The split matters, because the two kinds of prompt pull different failures out of the default style.

The two runs never saw each other. Both wrote plain reply text to a file, and the script measured the files.

## What changed

| | baseline | with sapiens | change |
|---|---|---|---|
| words per reply, task prompts | 341 | 203 | −41% |
| words per reply, conversational prompts | 396 | 144 | −64% |
| sentences over 25 words | 23 | 0 | −100% |
| em dashes | 39 | 0 | −100% |
| decorative bold spans | 20 | 0 | −100% |
| messages sent during one multi-step task | 4 | 2 | −50% |

The headline: **replies get 40 to 60 percent shorter, and the long sentences that break a second-language reader effectively disappear.** Every baseline reply broke the ceiling at least once, all but one broke it at least twice, and the worst sentence ran 53 words. The skill produced none, across all eight.

The gap is wider on conversational prompts than on task prompts. An open-ended question gives the default style more room to expand, so there is more to cut. This is worth knowing if you are deciding when to switch the skill on. The payoff is largest exactly where a task-shaped benchmark would not look.

The message count matters more than its size suggests. On the multi-step task, the baseline sent four messages and the skill sent two. A user does not count words, but they notice being interrupted twice instead of four times.

## What did not change, and why that is in this document

Three rule groups produced no measurable difference, because the baseline already followed them.

| rule group | baseline violations across eight replies |
|---|---|
| banned openers and closers ("Great question!", "I hope this helps!") | 0 |
| inflated vocabulary, 37 words tested | 0 |
| "don't restate the question" | 0 |
| "common vocabulary, IELTS Band 6" | 0 |
| figurative expressions from the lookup table | 2 |

The first four were checked twice, because six task-shaped probes are a weak test for phrases that surface in conversation. The two conversational probes were written specifically to bait them: one asks for an opinion, one opens with praise and a vague follow-up. Both are the shape that normally produces "Great question!" and "I hope this helps!". Neither produced any.

Those rules were the largest block of text in version 3.6.0. In 3.7.0 the lists moved to `references/plain-english.md`, and the skill body keeps only the one-line test that catches the cases a lookup table cannot. Nothing was deleted from the project. The question was only whether the model should carry them on every turn to prevent something that did not happen once in eight tries.

Figurative language went the other way. It was the only lexical rule with any hits at all, and the count went up when the sample widened. It stays in the body.

This is the honest version of "only add what the model does not already have". It is a subtraction test, and it can only be run against a baseline.

## Where the skill is still worse than the baseline

On the status-report probe the baseline volunteered something the skill did not. It said this migration should be made re-runnable before it reaches production, where lock contention is far more likely. That is a real recommendation and it changes what the reader does next.

Version 3.6.0 produced 118 words without it. Version 3.7.0 sharpened check 8 and produced 119 words, still without it. The fix did not work, and the reason is worth stating plainly.

Check 8 asks whether a finding was dropped between the draft and the final reply. Here the finding was never drafted. Size discipline suppressed it at generation time rather than at editing time, so there was nothing in the notes for check 8 to compare against. **A check that runs on a finished draft cannot recover a thought that was never had.**

Adding a content rule was rejected at first, on the grounds that one probe is not enough to justify one. Then the conversational probes turned up a second instance. Asked "what else could we improve?", the baseline recommended doing the most invasive fix as its own change, so it would be easy to revert. The skill named the same fix and dropped the revert advice.

Two independent scenarios, same shape: **advice attached to a moment other than now**. A risk in another environment. A way to de-risk a change. What to do if it fails. Check 8 in 3.7.0 now names that category directly, and says to look for it rather than to check whether it survived. The advice is never written down at all, so checking whether it survived finds nothing.

A third instance of the same category appeared during this release itself, outside any probe. The repository's release workflow publishes a public release the moment any version tag is pushed. That consequence sat unstated next to the tagging step until the reviewer preparing the merge looked for it. Neither the skill nor this document's author had found it.

The rule was then measured, because a rule written in response to a failure is exactly the kind that looks right and does nothing. Both probes were re-run against the final file. The result is partial and worth stating exactly.

On the migration probe, the reply now carries a deferred consequence that no earlier version had. Staging has the new table but nothing links it to webhook deliveries yet. Any test that depends on that link will give a wrong answer. On the improvements probe, it now warns about the database URL bug. It fails at connection time with an error that will not point at the cause, so fix it before someone rotates a password. Neither of those existed before the rule.

But neither reply produced the specific item the baseline produced. The migration reply still does not say to make the file re-runnable before production. The improvements reply still does not say to do the invasive fix as its own revertible change.

So the category now fires and the individual item still does not. The cost was about 50 words per reply. **Both evals stay red.** Moving an assertion to match what the skill happens to do is how an eval suite stops being useful.

## What these numbers do not claim

The sentence counts above are corrected. The first version of `measure.py` split on terminal punctuation alone, so a bullet list or a bolded lead-in with no period merged into one fake sentence. Two probes were also totalled twice. That version reported 37 baseline sentences over the ceiling and one for the skill. The repository's own 36-run measurement, recorded in the README section "The 25-word rule does not hold", contradicted the skill-side count, and the repository's number was kept. The corrected instrument reports 23 and 0. The correction cuts the skill's compliance claim on this run both ways: the baseline looks better than first reported, and so does the skill. It does not touch the 36-run finding that the ceiling is missed in normal use.

They are not token savings for a session. Like any skill, sapiens adds input tokens on every turn it is loaded, and shorter output does not automatically mean a cheaper session. The point of this skill is a reply a person can read correctly on the first pass, especially in a second language. Shorter replies are a side effect of cutting filler and repetition, never of cutting grammar or findings.

Eight probes is enough to see a large effect and not enough to size it precisely. Treat −41% as the shape of the result, not as a guarantee. Run `scripts/measure.py` on your own work and see what you get.
