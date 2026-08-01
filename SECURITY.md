# Security policy

Sapiens is a set of Markdown instruction files. It runs no code, opens no network
connections, and collects nothing. The install script copies files into
`~/.claude/skills/sapiens/` and does nothing else.

The realistic security surface is small but not zero:

- The install script writes to your home directory. Read it before you run it. It is 90
  lines and does one thing.
- A malicious fork could publish a modified `SKILL.md`. Install from a source you trust
  and check the diff on updates.

## Reporting a vulnerability

Open a [security advisory](https://github.com/parhamdavari/sapiens/security/advisories/new)
rather than a public issue. Expect a first reply within a week.
