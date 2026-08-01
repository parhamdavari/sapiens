---
scenario: ci-triage
arm: sapiens
run: 30
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:11:07.176Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page. It came in with commit `a3f91c2` ("simplify cart hook"), and the fix is to restore the empty-array default.

The other 15 failures are test problems, not product problems.

`packages/api` has 14 failures, all in `billing.test.ts`. A shared fixture calls `Date.now()` directly, and a change last week froze the clock in the global setup file. So every assertion on an invoice timestamp fails now. One-line fix in `test/setup.ts`.

`packages/worker` has 1 flaky test in `retry.test.ts`. It asserts that a retry happens within 100ms, and CI runners are sometimes slower than that. Fails roughly 1 run in 5. Widen the tolerance or use a fake timer.

Do api second, since 14 failures make the log hard to read. Worker last.
