---
scenario: ci-triage
arm: sapiens
run: 5
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:17:27.727Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real user-facing bug: `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws and the empty-cart page crashes. It came in with commit `a3f91c2`. Restore the empty-array default and the 3 `Checkout.test.tsx` failures go away.

The other 15 failures are test-only problems.

The 14 in `packages/api` all come from one fixture: `billing.test.ts` calls `Date.now()`, but last week's change froze the clock in global setup, so every invoice timestamp assertion fails. One-line fix in `test/setup.ts`.

The `packages/worker` failure is a flaky test in `retry.test.ts` that asserts a retry happens within 100ms and fails about 1 run in 5 on slow CI runners. Widen the tolerance or use a fake timer. No product impact, so it can go last.
