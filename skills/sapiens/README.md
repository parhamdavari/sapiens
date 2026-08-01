# Sapiens

A communication-style skill for Claude. It answers this complaint: *"I don't want the AI to over-explain everything, but I also don't want it stripped down to caveman fragments I can't parse, because English isn't my first language."*

## What it does

Turns on a plain, human, grammatically complete way of talking:

- Full sentences. Articles and prepositions stay in, always. That's the whole point. Those small words are what makes a sentence readable for someone reading English as a second language.
- Common, everyday vocabulary (roughly IELTS Band 6). No idioms, no slang, no rare words used to sound impressive. Technical terms stay precise.
- Short sentences, one idea each, with line breaks where the thought changes.
- No AI-isms. "I've gone ahead and...", "Let's dive in!", "Great question!", "I hope this helps!" are all gone.
- No narrating every step it took. Just the outcome, and why, in one line.

## Why it exists

Most "make the AI less verbose" tools (the well-known `caveman` skill, for example) save tokens by dropping grammar: articles, prepositions, connecting words. That works fine for a fluent native English reader, who fills in the gaps from context. It works badly for anyone reading in a second language, because those small words are exactly what tells you which word is the subject, which is the object, and how the pieces fit together. Strip them and a fluent reader barely notices. A non-native reader has to rebuild the sentence.

Sapiens takes the opposite approach. Cut the padding (over-explaining, hedging, filler, restating the question), but never cut the grammar. The result reads like a message from a real, reasonably concise colleague.

## It also controls *how often* Claude talks

Sentence style is the small half. On a long task — many tool calls, or several sub-agents running at once — the bigger cost is that Claude speaks at every opportunity, and most of what it says mid-task gets repeated in the final answer anyway.

Sapiens sets a speaking budget. The default is twice: once at the start if it needs something from you, and once at the end with the answer. Anything in between has to pass one test — *does this change what you would do in the next minute?* A blocker passes. A wrong premise passes. Anything destructive passes and gets full detail. "Agent 3 of 4 finished" does not, because the panel on your screen already says so.

Measured on two long tasks (a four-PR consistency review and a three-package CI triage), this cut the words spoken by 62% and 64%, with the assistant speaking once instead of 3 and 5 times. An independent check confirmed no material finding was lost in either.

## Three levels

| Level | Sounds like | Use when |
|---|---|---|
| `lead` | A tech lead giving a status update, big picture only | You just want to know what happened and whether it's handled |
| `dev` (default) | A solid teammate explaining a change | Everyday use, balanced detail |
| `geek` | A technical peer who likes the details | You want exact file names, functions, and precise cause and effect |

## How to turn it on

- **For the rest of the conversation:** say "sapiens mode", "human mode", or "talk like sapiens". Turn it off with "stop sapiens" or "normal mode". Change level anytime: "switch to geek", "lead mode from now on".
- **For one reply only:** type `/sapiens`, `/sapiens-lead`, `/sapiens-dev`, or `/sapiens-geek`.

## What it covers, and what it doesn't

Sapiens changes how Claude *talks to you*. It doesn't change what Claude *writes for you*. Code, commit messages, pull request descriptions, and documentation keep their normal conventions, because those have their own audiences and standards.

It also won't compromise on safety. Before anything destructive or risky (deleting files, force-pushing, sending something irreversible), it switches back to full plain detail. Clarity wins there, at every level.

It's not built to squeeze out the maximum number of tokens. If raw compression for a fluent reader is the goal, a fragment-style mode like `caveman` fits better. Sapiens optimizes for a real person understanding the message correctly on the first read.

## Credits

The AI-ism catalogue draws on the [`avoid-ai-writing`](https://github.com/) skill by Conor Bronsdon, filtered down to the patterns that show up in conversational replies. The plain-language principle comes from aerospace's ASD-STE100 (Simplified Technical English), a controlled-language standard built so that non-native technicians could read maintenance manuals without ambiguity. It bans dropping words for brevity, for the same reason this skill does.

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) in the repository root.
