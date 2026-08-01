# Benchmarks

Every number in the README comes from a file in this folder. Recount them all with:

```bash
npm run measure
```

Read the next two sections before you quote any of it.

## Who made these, and how

I wrote the three scenario fixtures in `scenarios/`. Each one is a frozen set of facts,
written as though the research phase had already finished. Agents then answered the same
question from those facts, once with the skill loaded and once without. I selected and
edited the results into `results/`.

That means one person produced both sides of every comparison, and that person wanted a
particular outcome. There was no blind protocol and no independent reviewer. The fixtures
hold the facts steady, which removes the largest source of noise, but it does not remove me.

Treat this as a worked demonstration rather than a study. The direction of each result is
real. The decimal places are not.

## What the columns mean

| Column | What it catches |
|---|---|
| `turns` | How many separate times the assistant spoke during one task |
| `words` | Total spoken words across the whole task |
| `avg-sent` | Average sentence length |
| `FK` | Flesch-Kincaid grade. Lower is easier. |
| `>25w` | Sentences over 25 words. Each one asks the reader to hold two ideas at once. |
| `figurative` | Hits against the list in `scripts/figurative-list.mjs` |
| `em-dash` | Em dashes, which split a sentence into two half-thoughts |

Transcripts covering a long task record every message the assistant would speak, including
the ones it decides not to send. `NONE` between two `---MESSAGE---` markers means the skill
chose silence at that point. That is how `turns` gets counted.

Be careful with that column. It is set by where the author typed `NONE`, so it reports a
judgement rather than an observation. The `pr-orientation` pair has no markers at all, and
its `1` is the script's default rather than a count. The same caution applies to `em-dash`,
which records a style choice made while writing both sides.

### Why there is a figurative column at all

Flesch-Kincaid measures word length and sentence length. It cannot see idioms. Here is a
real sentence that scores as easy English:

> that's a product call about how hard an uncited claim should bite

Every word is short. Every reader of English as a second language stops at it anyway.

### What the figurative number is not

It is a hit count against one fixed list of 175 expressions. English has thousands. The
number is a lower bound, comparable between two texts scored by the same list, and
meaningless as an absolute.

That list has been rewritten twice, and both rounds are recorded at the top of
[`scripts/figurative-list.mjs`](../scripts/figurative-list.mjs). The first version had been
written by reading the transcript it scored. The second version was longer, and six of the
entries that still fired were the same lifted strings hiding in a bigger crowd.

After the second cleanup the column reads zero for every with-and-without pair, and one for
the real-world reply. **This metric currently provides no evidence that the skill reduces
idioms.** The argument for the idiom rules rests on the example above, not on this column.

## Results

| transcript | turns | words | avg-sent | FK | >25w | figurative | em-dash |
|---|---:|---:|---:|---:|---:|---:|---:|
| `ci-triage--baseline` | 5 | 313 | 9.5 | 5.3 | 2 | 0 | 7 |
| `ci-triage--sapiens` | **1** | **112** | 8.6 | **4.6** | **0** | 0 | **0** |
| `pr-orientation--baseline` | 1 | 307 | 13.3 | 9.3 | 1 | 0 | 4 |
| `pr-orientation--real-world` | 1 | 191 | 14.7 | 8.5 | 1 | **1** | 0 |
| `pr-orientation--sapiens` | 1 | **113** | 14.1 | **5.9** | **0** | 0 | 0 |
| `pr-review--baseline` | 3 | 500 | 12.5 | 7.9 | 6 | 0 | 13 |
| `pr-review--sapiens` | **1** | **207** | 11.5 | **6.1** | 1 | 0 | **0** |

## The scenarios

**`pr-review`** asks: review the last 4 PRs, are they consistent with this prompt file? Four
sub-agents run in parallel and finish at different times. This scenario tests the speaking
budget. The baseline speaks three times: an opening line, a plan summary after launching the
agents, and the final report. The skill speaks once.

**`ci-triage`** asks: CI is red, what is broken across the three packages and what do I fix
first? Three sub-agents run, and only one of the three failures is a real user-facing bug.
This scenario tests whether the answer leads with the decision that was asked for. The
baseline reports each agent as that agent lands, then repeats all of it at the end.

**`pr-orientation`** asks: what is this PR about? The PR holds six separate fixes. This
scenario tests the size budget. The honest answer is a few sentences. The temptation is to
describe all six.

`pr-orientation--real-world` is not a generated baseline. It is a real reply from a working
session, kept because it is the case that produced the idiom rules. It is shorter than the
generated baseline and it scores as plainer English, and it was still the hardest of the
three to read.

## A finding the skill dropped

`pr-review--sapiens.md` leaves out one detail that the fixture contains. PR #669 showed its
git hook passing rather than deliberately failing, which is weaker evidence than what #670
provides. The baseline transcript reports it. The short answer does not.

This matters more than its size. A shortening pass loses weak-evidence findings first. The
skill's own last check exists to catch that case, and here it did not fire.

The transcript stays as it is. Editing a result after the fact to make a tool look better
would make every other number in this folder worthless.

## What these numbers do not show

- **One run per cell.** Three scenarios, one answer each way.
- **No correctness measurement.** Word counts and reading grades say nothing about whether
  an answer is right.
- **No human readers.** The argument is about comprehension for second-language readers, and
  nobody was asked to read anything and then answer questions.
- **No model or date recorded.** The transcripts carry no model name, no version and no
  timestamp, so nobody can rerun the exact conditions. A future revision should record them.
- **Token savings are a side effect.** The skill cuts filler and repetition, never grammar.
  A fragment-style tool will beat this one on words per answer, and will lose on whether a
  second-language reader can parse the result.

## How to make this better

The most valuable contribution would be a real reader study. Give ten second-language
readers a baseline transcript and a sapiens transcript, ask three comprehension questions
about each, and record accuracy and time. That would replace most of this folder. If you
want to run one, open an issue.
