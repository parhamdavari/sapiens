<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-banner.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/logo-banner-light.png">
  <img src="assets/logo-banner.png" alt="sapiens — talk like a person, not a caveman" width="860">
</picture>

<br>

**A Claude skill that makes replies read like a person wrote them.**
Plain, complete, unpadded English, for people who work in English but do not think in it.

<br>

[![Agent Skills spec](https://img.shields.io/badge/Agent%20Skills-compliant-3fb950?style=flat-square)](https://agentskills.io/specification.md)
[![License](https://img.shields.io/github/license/parhamdavari/sapiens?style=flat-square&color=8fa4bd)](LICENSE)
[![Stars](https://img.shields.io/github/stars/parhamdavari/sapiens?style=flat-square&color=ffc86f)](https://github.com/parhamdavari/sapiens/stargazers)
[![Validate](https://img.shields.io/github/actions/workflow/status/parhamdavari/sapiens/validate.yml?style=flat-square&label=validate)](https://github.com/parhamdavari/sapiens/actions)

[Install](#install) · [Before / after](#before-and-after) · [Levels](#three-levels) · [What I measured](#what-i-measured) · [Limits](#what-this-evidence-does-not-show) · [How it works](#how-it-works) · [vs caveman](#how-this-differs-from-caveman)

</div>

---

An AI assistant can be hard to read in two ways, and most tools only fix one.

It can **say too much**. It narrates every step. It restates your question before answering.
It pads plain statements with "I've gone ahead and…". On a long task it reports each
sub-agent as that agent finishes, then repeats all of it in the final answer.

It can also **say too little**. Token-compression tools drop articles, prepositions and
connecting words. That reads fine if English is your first language. If it is not, those
small words are what tell you which noun is the subject and how the clauses relate.
Removing them turns a terse reply into a puzzle.

Sapiens takes the middle path. It cuts the padding and keeps the grammar.

## Before and after

Same question. Same facts. Both answers were written from one fixture,
[`benchmarks/scenarios/pr-orientation.md`](benchmarks/scenarios/pr-orientation.md).

The question was: *what is this PR about?* The PR contained six separate fixes.

<table>
<tr><th width="50%">Without the skill</th><th width="50%">With the skill</th></tr>
<tr valign="top"><td>

> PR #662 (`fix: grounding enforcement + fail-closed corrections`) is a correctness/safety
> PR — it's open and still waiting on code review, not merged. It bundles six fixes, and the
> theme running through all of them is "stop reporting success when the system didn't
> actually do the work."
>
> **The main fix — grounding enforcement.** An agent member could assert a claim in its
> answer without ever having called a tool, and the orchestrator would still mark the run
> SUCCEEDED and bill the user for the tokens. …

`307 words` · `reading grade 9.3` · `average sentence 13.3 words`

[full text](benchmarks/results/pr-orientation--baseline.md)

</td><td>

> It's mainly a grounding fix for agent runs. Grounding here means every claim in a member's
> answer has to point at the tool call that produced it. Before this, a member could state a
> claim without calling any tool. The run was still marked SUCCEEDED, and the user was still
> charged for it. Now a member that can't show the tool call is marked as failed. …

`113 words` · `reading grade 5.9` · `average sentence 14.1 words`

[full text](benchmarks/results/pr-orientation--sapiens.md)

</td></tr>
</table>

Both blocks are the verbatim opening of the linked file, cut at a similar length and marked
with `…`. The counts and grades cover the full replies rather than the excerpts.

Notice the one number that goes the wrong way. The short answer has **longer** average
sentences than the baseline, 14.1 against 13.3. The baseline hits its low average partly
through bold labels and a numbered list, which are short lines rather than plain sentences.
Length fell by 63%. Sentence length did not.

The short version ends by **offering** the remaining detail in one line instead of
delivering it. The skill has a rule for that.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/parhamdavari/sapiens/main/install.sh | bash
```

<details>
<summary>Windows (PowerShell)</summary>

```powershell
irm https://raw.githubusercontent.com/parhamdavari/sapiens/main/install.ps1 | iex
```

</details>

<details>
<summary>Manual, or for a single project</summary>

Download `sapiens.skill` from
[the latest release](https://github.com/parhamdavari/sapiens/releases/latest). It is a zip
archive. Unpack it:

```bash
# for every project
unzip sapiens.skill -d ~/.claude/skills/

# for this project only, so your team gets it when you commit it
unzip sapiens.skill -d .claude/skills/
```

From a clone, run `bash install.sh --project`.

</details>

<details>
<summary>claude.ai and Cowork</summary>

Those load skills from your account rather than from your disk, and the two do not sync.
Upload `sapiens.skill` in **Settings → Capabilities → Skills**.

</details>

The installer copies files into your skills directory and does nothing else. It is 90 lines
and you should read it before you run it. Restart Claude Code, then type `/skills` to
confirm sapiens is listed.

## Using it

| You type | What happens |
|---|---|
| `sapiens mode` | On for the whole conversation |
| `/sapiens` | One reply only |
| `/sapiens geek` | One reply, at the geek level |
| `switch to lead` | Change level, stay on |
| `stop sapiens` | Off |

## Three levels

All three write full sentences in plain words. Only the technical depth changes.

| | Sounds like | Use when |
|---|---|---|
| **lead** | A tech lead giving a status update | You want the outcome and whether it is handled |
| **dev** *(default)* | A solid teammate explaining a change | Everyday use |
| **geek** | A technical peer who wants the details | You want exact files, functions and cause |

<details>
<summary>The same fix, described at each level</summary>

**lead**
> The login bug is fixed. It was a timing problem between two parts of the system, not bad
> user input like we first thought. Tests are passing now.

**dev**
> Found the bug in the login flow. The session token was being checked before it finished
> saving, so valid logins sometimes failed. I added a check that waits for the save to
> finish. It should be fixed now.

**geek**
> The bug was a race condition in `AuthProvider.login()`. The session token check ran before
> the `saveSession()` promise resolved, so a fast client sometimes failed a valid login. I
> added an `await` before the check and covered it with a new test in `auth.test.ts`.

</details>

## What I measured

Three scenarios. Each one is a frozen set of facts. Two agents answer the same question from
those facts, one with the skill loaded and one without. The facts do not change, so the only
variable is how the answer gets written.

Raw transcripts and the full method are in [`benchmarks/`](benchmarks/). Recount them with
`npm run measure`.

| Scenario | | Times spoken | Words | Reading grade | Sentences >25w |
|---|---|---:|---:|---:|---:|
| **4-PR review** | without | 3 | 500 | 7.9 | 6 |
| | with | **1** | **207** | **6.1** | **1** |
| **CI triage, 3 packages** | without | 5 | 313 | 5.3 | 2 |
| | with | **1** | **112** | **4.6** | **0** |
| **"what is this PR about?"** | without | n/a | 307 | 9.3 | 1 |
| | with | n/a | **113** | **5.9** | **0** |

Words spoken fell by 59%, 64% and 63%. In the two multi-step scenarios the assistant spoke
once instead of three and five times. The third scenario is a single question with no
sub-agents, so a turn count means nothing there.

One caution about that first column. A turn is counted from where the transcript records a
message rather than a silence, and I wrote the transcripts. It reports a judgement about
what the skill should suppress, not an observation of a live session.

### The idiom problem, which I have not managed to measure

Reading-grade formulas measure word length and sentence length. They cannot see idioms.
Take this sentence, from a real reply:

> that's a product call about how hard an uncited claim should bite

Every word is short and the sentence is short, so it scores as easy English. A reader who
knows every one of those words still cannot say what the sentence means. That gap is the
reason this skill exists, and it is the reason to distrust a readability score on its own.

The measurement is a different story, and it has not gone well.

I built a detector for it. `npm run measure` reports a figurative column, counted against a
list in [`scripts/figurative-list.mjs`](scripts/figurative-list.mjs). Twice now I have had
to rewrite that list, because entries had been lifted from the very transcript they were
scoring. The file's header records both rounds. After the second cleanup the column reads
zero for every with-and-without pair in the benchmark, and one for the real-world reply.

So the honest position: **the idiom effect is argued, not measured.** The argument is
sound and the example is real. The number behind it is not evidence yet. A phrase list can
only find phrases someone thought to write down, and the ones worth catching are the ones
nobody noticed.

## What this evidence does not show

Read this before you trust the table above.

- **One run per cell.** Three scenarios, one answer each way. That makes this a demonstration
  and not a study. The direction of each result is worth more than its decimal places.
- **I wrote both sides.** Agents produced the transcripts from the fixtures, and I selected
  and edited what went into `benchmarks/results/`. Nobody independent reviewed them. The
  "without" column is my reconstruction of default behaviour, not a recording of a live
  unassisted session.
- **No human was tested.** The whole argument is about comprehension for second-language
  readers, and there is no reader study behind it. Nobody was asked to read anything and
  then answer questions. If you want to run one, I would like to hear from you.
- **The reading-grade anchor is not cited.** Grade 8 or so is where I find English
  comfortable to read at speed as a non-native reader. That is my own calibration. I have no
  source tying an IELTS band to a Flesch-Kincaid grade.
- **The skill missed a finding once.** In `pr-review--sapiens.md` the short answer leaves out
  one detail the fixture contained: PR #669 showed its hook passing rather than deliberately
  failing. That is a weak-evidence finding, which is the exact category the skill's last
  self-check exists to protect. It is recorded in
  [`benchmarks/README.md`](benchmarks/README.md) rather than quietly fixed.
- **Correctness is not measured.** Word counts and reading grades say nothing about whether
  an answer is right.

## Does this repo follow its own rules?

Some of them, and CI checks it on every push.

```bash
npm run self-check
```

That sweeps the 17 markdown files this project wrote and applies four of the skill's rules.
No sentence over 25 words. No idiom from the list. A reading grade under nine. At most three
em dashes per file. A failure blocks the merge.

Everything under `benchmarks/` is excluded. The transcripts are evidence and the scenarios
are inputs to it, so editing either one to pass a style check would be worse than failing.

Two things it does not do. It cannot check whether the writing is clear, only whether it
breaks countable rules. And it skips blockquotes, so a quoted bad example does not fail the
file that quotes it. That exclusion also covers blockquotes I wrote myself, which is a hole
I have not closed.

The version of this README before the pre-launch audit failed two of the four rules. It had
four sentences over the ceiling and fifteen em dashes against a budget of three. Its reading
grade and its idiom count were already fine. The old file is in this repo's git history:

```bash
git show 3b1d3f0:README.md > /tmp/old.md
npm run measure -- --prose-only /tmp/old.md
```

## How it works

The skill governs three things, ordered by how much waste each one causes.

**1. Size.** How much to say follows from the question, not from how much the model knows.
"What is this PR about?" asks for orientation. It does not ask for a walk through all six
fixes plus the review status plus the open design decision. When there is more worth saying,
the skill offers it in one line instead of delivering it.

**2. Frequency.** The default budget is two messages per task. One at the start if it needs
something from you, one at the end with the answer. Anything in between has to pass a single
test: does this change what you would do in the next minute? A blocker passes. A wrong
premise passes. Anything destructive passes and gets full detail. "Agent 3 of 4 finished"
does not, because the panel on your screen already says so.

**3. Sentence style.** Full grammar, common vocabulary, one idea per sentence with a 25-word
ceiling, no idioms, no undefined jargon, and none of the standard AI filler phrases.

A short checklist then runs on the finished draft. Rules alone drift, because a long reply
gets written one sentence at a time and no single sentence looks wasteful. The checks catch
what the rules miss. Is the answer the size of the question? Is anything here already known
to the reader? Count the words in the longest sentence. Scan once for figurative language.
The last check is the counterweight: did anything get dropped rather than shortened?

## How this differs from caveman

[caveman](https://github.com/JuliusBrussee/caveman) is good, and this project owes it the
idea. The two solve different problems. If you read English natively and you want the
smallest possible token bill, caveman is the better tool.

| | caveman | sapiens |
|---|---|---|
| Optimises for | Fewest output tokens | First-pass comprehension |
| Grammar | Articles and prepositions dropped | Never dropped |
| Best reader | Native or near-native | Anyone working in a second language |
| Idioms | Not addressed | Replaced with plain wording |
| Controls | How much is written | How much, how often, and how readable |

Dropping function words is close to free for a native reader, who fills the gaps from
context. It is expensive for everyone else, who has to rebuild the sentence.

One industry made the same trade-off deliberately.
[ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/about_STE.html) is a
controlled language for aircraft maintenance documentation, published by the AeroSpace and
Defence Industries Association of Europe. It exists so that technicians reading in a second
language cannot misread an instruction. It restricts vocabulary and sentence length, and it
forbids dropping words for brevity.

STE is a drafting standard, not a controlled study of second-language comprehension. It
shows a choice being made under real consequences. It does not prove the choice is right.

## Contributing

The most useful thing you can send is a phrase that stopped you. Native speakers rarely find
these, because they read past them without noticing. If a reply made you re-read a sentence,
open a
[hard-phrase issue](https://github.com/parhamdavari/sapiens/issues/new?template=hard-phrase.md)
with the phrase and what you thought it meant.

See [CONTRIBUTING.md](CONTRIBUTING.md). One rule matters above the rest: **every number in
this repo comes from a run you can reproduce.** If you change a figure, include the command
that produced it.

## Privacy

The skill is Markdown. It runs no code, makes no network calls and collects nothing. The
installer downloads the repo archive if you are not running from a clone, copies the skill
into your skills directory, and stops.

## Credits

The idiom and filler catalogue draws on
[avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) by Conor Bronsdon,
narrowed to the patterns that show up in conversational replies. The plain-language
principle comes from ASD-STE100. The naming and the packaging conventions follow the path
cut by [caveman](https://github.com/JuliusBrussee/caveman).

<div align="center">
<br>
<sub>MIT licensed. If it made a reply easier to read, a star helps other people find it.</sub>
</div>
