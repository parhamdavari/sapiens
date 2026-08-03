# Keeping sapiens on

A skill you have to ask for is a skill you will forget to ask for. Most people try sapiens once, like it, and then get the default style back on their next session because they did not repeat the phrase.

Pick one of these and stop thinking about it.

## Claude Code, every project

Add one line to your global `~/.claude/CLAUDE.md`:

```markdown
Always use sapiens mode. Default level: lead.
```

Use `dev` or `geek` instead if you want more technical detail in every reply.

## Claude Code, one project only

Add the same line to the project's `./CLAUDE.md`. A project file wins over the global one, so you can run `geek` in a codebase you know well and `lead` everywhere else.

## Any agent that reads AGENTS.md

```markdown
Always use sapiens mode. Default level: dev.
```

## Turning it off for one reply

Say "normal mode" or "stop sapiens". A single `/sapiens` or `/sapiens geek` also works the other way: it applies to one reply and then hands control back to whatever was already on.

## If it does not seem to be on

Ask for it by name once. If the reply changes shape, the skill was installed and simply had not triggered, which means the phrasing in your `CLAUDE.md` is the thing to fix. If nothing changes, the skill is not installed.
