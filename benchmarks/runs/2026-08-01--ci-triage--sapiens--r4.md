---
scenario: ci-triage
arm: sapiens
run: 4
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:17:07.931Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real product bug: `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws and the empty-cart page crashes for users. It came in with commit `a3f91c2`. Restore the empty-array default in the hook.

The other two are test-only problems.

`packages/api` has 14 failures in `billing.test.ts`, but they all trace to one thing: the global setup now freezes the clock, and a shared fixture still calls `Date.now()`. One-line fix in `test/setup.ts` clears all 14. Do this second since it's cheap and removes most of the red.

`packages/worker` has one flaky test in `retry.test.ts` that asserts a retry happens within 100ms and fails about 1 run in 5 on slow CI runners. No product impact. Widen the tolerance or use a fake timer whenever.

So: 18 failing tests across 3 packages, but only the web one ships a crash to users.
