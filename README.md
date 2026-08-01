<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-banner.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/logo-banner-light.png">
  <img src="assets/logo-banner.png" alt="sapiens — talk like a person, not a caveman" width="860">
</picture>

<br>

**A Claude skill that makes replies read like a person wrote them.**
Plain, complete, unpadded English — built for the millions of us who work in English but don't think in it.

<br>

[![Agent Skills spec](https://img.shields.io/badge/Agent%20Skills-compliant-3fb950?style=flat-square)](https://agentskills.io/specification.md)
[![License](https://img.shields.io/github/license/parhamdavari/sapiens?style=flat-square&color=8fa4bd)](LICENSE)
[![Stars](https://img.shields.io/github/stars/parhamdavari/sapiens?style=flat-square&color=ffc86f)](https://github.com/parhamdavari/sapiens/stargazers)
[![Validate](https://img.shields.io/github/actions/workflow/status/parhamdavari/sapiens/validate.yml?style=flat-square&label=validate)](https://github.com/parhamdavari/sapiens/actions)

[Install](#install) · [Before / after](#before-and-after) · [Levels](#three-levels) · [Benchmarks](#measured-results) · [How it works](#how-it-works) · [vs caveman](#how-this-differs-from-caveman)

</div>

---

There are two ways an AI assistant can be hard to read, and most tools only fix one.

It can **say too much** — narrating every step, restating your question, padding plain
statements with "I've gone ahead and…", reporting each sub-agent as it finishes and then
repeating all of it in the final answer.

Or it can **say too little** — the token-compression approach, which drops articles,
prepositions and connecting words. That reads fine if English is your first language. If it
isn't, those small words are exactly what tells you which noun is the subject and how the
clauses relate. Removing them doesn't make the reply terse. It makes it a puzzle.

Sapiens is the middle. Cut the padding, never cut the grammar.

## Before and after

Same question, same facts, same model.

<table>
<tr><th width="50%">Default</th><th width="50%">sapiens</th></tr>
<tr valign="top"><td>

> PR #662 is a bundle of six fixes that all share one theme: the platform was reporting
> success on work it never actually did. The headline one is grounding. A team member could
> claim an answer without ever calling a tool, and the run still settled as SUCCEEDED and
> billed real tokens. … That's a product call about how hard an uncited claim should bite.

`192 words` · `9 figurative expressions`
`grounding` and `fail-closed` never defined

</td><td>

> It's mainly a grounding fix for agent runs. Grounding here means every claim in a member's
> answer has to point at the tool call that produced it. Before this, a member could state a
> claim without calling any tool. The run was still marked SUCCEEDED, and the user was still
> charged for it.
>
> Five smaller fixes are in the same PR, mostly making checks block by default instead of
> allowing by default. It's open and waiting on review.
>
> I can go through those five, or the open design question the author left for the CTO.

`113 words` · `0 figurative expressions`
`grounding` defined in six words

</td></tr>
</table>

Notice what the second one does at the end. It **offers** the detail instead of delivering
it. Twelve words instead of a hundred and fifty, and you choose.

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

Download `sapiens.skill` from [the latest release](https://github.com/parhamdavari/sapiens/releases/latest)
— it's a zip archive — and unpack it:

```bash
# for every project
unzip sapiens.skill -d ~/.claude/skills/

# for this project only (commit it and your team gets it too)
unzip sapiens.skill -d .claude/skills/
```

Or from a clone: `bash install.sh --project`

</details>

<details>
<summary>claude.ai and Cowork</summary>

Those load skills from your account, not from your disk — the two don't sync. Upload
`sapiens.skill` in **Settings → Capabilities → Skills**.

</details>

Restart Claude Code, then type `/skills` to confirm it's listed.

## Using it

| You type | What happens |
|---|---|
| `sapiens mode` | On for the whole conversation |
| `/sapiens` | One reply only |
| `/sapiens geek` | One reply, at the geek level |
| `switch to lead` | Change level, stay on |
| `stop sapiens` | Off |

## Three levels

All three write full sentences and plain words. What changes is technical depth.

| | Sounds like | Use when |
|---|---|---|
| **lead** | A tech lead giving a status update | You want the outcome and whether it's handled |
| **dev** *(default)* | A solid teammate explaining a change | Everyday use |
| **geek** | A technical peer who wants the details | You want exact files, functions, and cause |

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

## Measured results

Three scenarios, each answered twice from the same fixed facts — once with sapiens, once
without. Full method and raw transcripts in [`benchmarks/`](benchmarks/). Reproduce with
`npm run measure`.

| Scenario | | Times spoken | Words | Reading grade | Sentences >25w | Figurative |
|---|---|---:|---:|---:|---:|---:|
| **4-PR review** | default | 3 | 581 | 7.4 | 8 | 0 |
| | sapiens | **1** | **234** | **5.7** | **1** | 0 |
| **CI triage, 3 packages** | default | 5 | 377 | 5.8 | 3 | 0 |
| | sapiens | **1** | **133** | 5.8 | **0** | 0 |
| **"what is this PR about?"** | default | 1 | 327 | 8.9 | 2 | 1 |
| | real session | 1 | 192 | 8.4 | 1 | **9** |
| | sapiens | 1 | **113** | **5.9** | **0** | **0** |

> [!NOTE]
> The `figurative` column is the one that matters most and the one every readability tool
> misses. Flesch-Kincaid measures word length and sentence length, so *"that's a product call
> about how hard an uncited claim should bite"* scores as **easy** English. Every word is
> short. A reader who knows all of them still can't tell you what the sentence means.
>
> The `real session` row is an actual reply from a working session, not a generated
> baseline. It is shorter than the default and scores as plain English, and it was still the
> hardest of the three to read. That row is why the skill has a dedicated idiom check.

An independent adversarial pass confirmed no material finding was dropped from any sapiens
transcript. Shortening is the goal; losing a finding is not, and the skill's last self-check
exists to enforce exactly that.

## How it works

The skill governs three things, in order of how much waste each one causes.

**1. Size — how much to say.** Length follows from the question, not from how much the model
happens to know. "What is this PR about?" asks for orientation, not a walkthrough of all six
fixes plus the review status plus the open design decision. When there's more worth saying,
the skill offers it in one line rather than delivering it.

**2. Frequency — how often to speak.** The default budget is twice per task: once at the
start if it needs something from you, once at the end with the answer. Anything in between
has to pass one test — *does this change what you would do in the next minute?* A blocker
passes. A wrong premise passes. Anything destructive passes and gets stated in full detail.
"Agent 3 of 4 finished" does not, because the panel on your screen already says so.

**3. Sentence style — how a reply is written.** Full grammar, common vocabulary, roughly one
idea per sentence with a 25-word ceiling, no idioms, no undefined jargon, none of the
standard AI filler phrases.

Then a short **pre-send checklist** runs on the finished draft. Rules alone drift, because a
long reply is written one sentence at a time and no single sentence looks wasteful. The
checks catch what the rules miss: is the answer the size of the question, is anything here
already known to the reader, count the words in the longest sentence, scan once for
figurative language, and — last, as a counterweight — *did anything get dropped rather than
shortened?*

## How this differs from caveman

[caveman](https://github.com/JuliusBrussee/caveman) is excellent and this project owes it
the idea. They solve different problems, and if you're a fluent English reader chasing
maximum token savings, caveman is the better tool.

| | caveman | sapiens |
|---|---|---|
| Optimises for | Fewest output tokens | First-pass comprehension |
| Grammar | Articles and prepositions dropped | Never dropped |
| Best reader | Fluent, native or near-native | Anyone working in a second language |
| Idioms | Not addressed | Explicitly replaced |
| Controls | How much is written | How much, how often, and how readable |

The reason for the split: dropping function words is nearly free for a native reader, who
fills the gaps from context, and expensive for everyone else, who has to rebuild the
sentence. Aerospace settled this decades ago. [ASD-STE100 Simplified Technical
English](https://www.asd-ste100.org/about_STE.html), the controlled language used for
aircraft maintenance manuals so that technicians worldwide can't misread them, bans dropping
words for brevity — for the same reason this skill does.

## Contributing

The most valuable contribution is a phrase that stopped you. Native speakers can't find
these; they read straight past them. If a reply made you re-read a sentence, open a
[hard-phrase issue](https://github.com/parhamdavari/sapiens/issues/new?template=hard-phrase.md) with the phrase and what you
thought it meant.

See [CONTRIBUTING.md](CONTRIBUTING.md). One rule above all: **every number in this repo comes
from a real measured run.** If you change a figure, include the run that produced it.

## Privacy

The skill is Markdown. It runs no code, makes no network calls, and collects nothing. The
installer copies files into your skills directory and stops. Read it — it's forty lines.

## Credits

The AI-ism catalogue draws on [`avoid-ai-writing`](https://github.com/) by Conor Bronsdon,
filtered down to the patterns that show up in conversational replies. The plain-language
principle comes from ASD-STE100. The naming and the packaging conventions follow the trail
cut by [caveman](https://github.com/JuliusBrussee/caveman).

<div align="center">
<br>
<sub>MIT licensed. If it made a reply easier to read, a star helps other people find it.</sub>
</div>
