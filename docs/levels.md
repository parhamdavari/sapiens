# Choosing a level

Three registers. All of them write full sentences in plain words. Only technical depth
changes.

## lead — the default

A tech lead giving a status update. Outcome and direction. No file names, no function names,
no implementation detail unless you ask.

Use it when you're deciding whether something needs your attention, when you're reporting
upward, or when you're catching up on work you didn't do yourself.

It is the default because it is the smallest answer that can still be complete, and asking
for more costs you one line. The risk runs the other way. This level can leave out a detail
you needed, and you will not always know it is missing. If that happens often to you, switch
to `dev` and stay there.

> The login bug is fixed. It was a timing problem between two parts of the system, not bad
> user input like we first thought. Tests are passing now.

## dev

A capable teammate explaining a change. Reaches for a technical term or a specific name only
when you need it to act.

Use it for everyday work where you will act on the answer yourself. It is the level that is
rarely wrong: `lead` can leave out something you needed, and `geek` can hide the answer under
detail. It was the default until 3.4.0, and it is the right choice if you find `lead` too
thin.

> Found the bug in the login flow. The session token was being checked before it finished
> saving, so valid logins sometimes failed. I added a check that waits for the save to
> finish. It should be fixed now.

## geek

A technical peer who wants the details. Real names, real terms, precise cause and effect.
Still full sentences and one idea at a time — just denser.

Use it when you're going to touch the code yourself, when you're reviewing, or when you need
to verify the reasoning rather than trust it.

> The bug was a race condition in `AuthProvider.login()`. The session token check ran before
> the `saveSession()` promise resolved, so a fast client sometimes failed a valid login. I
> added an `await` before the check and covered it with a new test in `auth.test.ts`.

## Switching

```
sapiens mode          # on, at lead
switch to geek        # change level, stay on
lead mode from now on # change level, stay on
/sapiens geek         # one reply at geek, then back
stop sapiens          # off
```

## What the level does not change

The **speaking budget** is the same at every level. `geek` means a more detailed final
report, not more interruptions during the task.

**Safety** is the same at every level. Before anything destructive or irreversible, all three
levels switch to full plain detail. Clarity beats brevity there, always.

The **pre-send checks** run at every level. `geek` never becomes a licence for a 40-word
sentence or an undefined term.
