---
scenario: ci-triage
arm: sapiens
run: 19
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:59:15.839Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug of the three.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That's the 3 failures in `Checkout.test.tsx`, introduced in commit `a3f91c2` ("simplify cart hook"). It ships to users as a crash on the empty-cart page. Restore the empty-array default.

The other two are test problems, not product problems. `packages/api` has 14 failures in `billing.test.ts`, all from one shared fixture calling `Date.now()` after the global setup froze the clock. One line in `test/setup.ts`. `packages/worker` has one flaky test in `retry.test.ts`, asserting a retry within 100ms, failing about 1 run in 5 on slow runners. Widen the tolerance or use a fake timer.

Order: web for the users, api to clear 14 of the 18 failures, worker last.
