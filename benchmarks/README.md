# Benchmarks

Every number in this repo came from a run recorded here. Nothing is estimated. If a figure
in the README isn't reproducible from these files, it's a bug — please open an issue.

## How to reproduce

```bash
npm run measure
```

That reads every transcript in `results/` and prints the table below.

## What is being measured

Each scenario is a fixed set of facts in `scenarios/`, written as if the research phase had
already happened: the PR contents, the test failures, what each sub-agent found. Two agents
then answer the same user question from the same facts. One has sapiens loaded, one doesn't.
Neither can invent detail, because the facts are fixed, so the only variable is how the
answer is written.

Transcripts that cover a long task record **every message the assistant would speak**,
including the ones it chooses not to send. `NONE` between two `---MESSAGE---` markers means
the skill decided silence was correct at that point. That's how the `turns` column is
counted, and it's the whole point of the *speaking budget* rule.

## The metrics, and why there are two kinds

| Column | What it catches |
|---|---|
| `turns` | How many separate times the assistant spoke during one task |
| `words` | Total spoken words across the whole task |
| `avg-sent` | Average sentence length |
| `FK` | Flesch-Kincaid grade level. Lower is easier. An IELTS Band 6 reader is comfortable around grade 8. |
| `>25w` | Sentences over 25 words. Each one asks the reader to hold two ideas at once. |
| `figurative` | Idioms and metaphors, counted against a sample list from `references/plain-english.md` |

The last column exists because the others are blind to the problem that hurts non-native
readers most. Flesch-Kincaid measures word length and sentence length, so a sentence like
*"that's a product call about how hard an uncited claim should bite"* scores as easy English.
Every word is short. A reader who knows all of them still cannot say what the sentence means.
Any readability tool that only counts syllables will miss this entirely.

## Results

| transcript | turns | words | avg-sent | FK | >25w | figurative |
|---|---:|---:|---:|---:|---:|---:|
| `ci-triage--baseline` | 5 | 377 | 11.8 | 5.8 | 3 | 0 |
| `ci-triage--sapiens` | **1** | **133** | 10.2 | 5.8 | **0** | 0 |
| `pr-orientation--baseline` | 1 | 327 | 14.2 | 8.9 | 2 | 1 |
| `pr-orientation--real-world` | 1 | 192 | 14.8 | 8.4 | 1 | **9** |
| `pr-orientation--sapiens` | 1 | **113** | 14.1 | **5.9** | **0** | **0** |
| `pr-review--baseline` | 3 | 581 | 16.1 | 7.4 | 8 | 0 |
| `pr-review--sapiens` | **1** | **234** | 13.8 | **5.7** | 1 | 0 |

## The scenarios

**`pr-review`** — "review the last 4 PRs, are they consistent with this prompt file?"
Four sub-agents run in parallel and finish at different times. This is the scenario that
tests the speaking budget: the baseline reports each agent as it lands and then repeats
all of it in the final answer.

**`ci-triage`** — "CI is red, what's broken across the three packages and what do I fix
first?" Three sub-agents, and only one of the three failures is a real user-facing bug.
Tests whether the answer leads with the decision the user asked for.

**`pr-orientation`** — "what is this PR about?" A short question about a PR containing six
separate fixes. Tests the size budget: the honest answer is a few sentences, and the
temptation is to describe all six.

`pr-orientation--real-world` is not a generated baseline. It's a real reply from an actual
session, included because it's the case that motivated the figurative-language rules. It is
shorter than the generated baseline and scores as plain English on Flesch-Kincaid, and it
was still the hardest of the three to read.

## What these numbers do not show

- **One run per cell.** These are deterministic-ish comparisons on fixed facts, not a
  statistical study. Treat the direction as real and the exact decimals as noise.
- **No measurement of whether the answer is right.** A separate adversarial check confirmed
  no material finding was dropped from the sapiens transcripts, but that check is a
  judgement call, not a metric.
- **Token savings are a side effect, not the goal.** Sapiens cuts filler and repetition. It
  never cuts grammar. If maximum token compression is what you want, a fragment-style skill
  will beat this one on words-per-answer and lose on whether a non-native reader can parse
  the result.
