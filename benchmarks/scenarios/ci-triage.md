# Scenario B — cross-package test triage (generalization check)

## What the user typed
> the CI is red. figure out what's broken across the three packages and tell me what to fix first

## What happened in the session (already visible to the user in the UI)
- Claude ran `pnpm -r test` (1 tool call, output shown)
- Claude launched 3 background agents, one per failing package. The UI shows a live panel
  with each agent's name and a finished/running state, plus elapsed time per agent.
- Agents finished in this order: `api` (30s), `web` (1m12s), `worker` (2m04s)

## What the three agents found

**`packages/api` — 14 failing tests, all in `billing.test.ts`.** Root cause: a shared test
fixture calls `Date.now()` directly, and a change last week froze the clock in the global
setup file. Every assertion comparing an invoice timestamp now fails. One-line fix in
`test/setup.ts`. Not a product bug.

**`packages/web` — 3 failing tests in `Checkout.test.tsx`.** Root cause: a real regression.
`useCart()` now returns `undefined` for an empty cart instead of `[]`, so
`cart.length` throws. Introduced in commit `a3f91c2` ("simplify cart hook"). This ships
to users as a crash on the empty-cart page. Fix is to restore the empty-array default.

**`packages/worker` — 1 failing test, `retry.test.ts`, flaky.** Fails roughly 1 run in 5.
The test asserts a retry happens "within 100ms" and CI runners are sometimes slower.
No product impact. Fix is to widen the tolerance or use a fake timer.

**Overall:** 18 failing tests, 3 packages, but only one is a real user-facing bug.
