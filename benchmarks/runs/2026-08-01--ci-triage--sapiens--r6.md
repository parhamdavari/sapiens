---
scenario: ci-triage
arm: sapiens
run: 6
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:17:53.017Z
generator: benchmarks/generate.mjs
---

Fix the web package first. Its 3 checkout test failures are a real regression: `useCart()` now returns `undefined` for an empty cart instead of an empty array, so `cart.length` throws. That ships as a crash on the empty-cart page. It came in with commit `a3f91c2`. Restore the empty-array default.

The other 15 failures are test-only problems.

The 14 api failures all come from one thing: the global setup now freezes the clock, but a shared fixture in `billing.test.ts` still calls `Date.now()`. One-line fix in `test/setup.ts`. Do this second since it clears most of the red.

The worker failure is a flaky timing test in `retry.test.ts` that fails about 1 run in 5 when CI is slow. Widen the 100ms tolerance or use a fake timer. No rush.
