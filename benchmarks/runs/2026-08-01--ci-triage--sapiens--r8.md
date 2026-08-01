---
scenario: ci-triage
arm: sapiens
run: 8
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:08:36.317Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It is the only real bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws in `Checkout.test.tsx`. It came from commit `a3f91c2` ("simplify cart hook") and ships to users as a crash on the empty-cart page. Restore the empty-array default.

The other two are test problems, not product problems.

`packages/api` has 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()`, and a change last week froze the clock in the global setup. One-line fix in `test/setup.ts`. That is most of the noise for the least work, so do it second.

`packages/worker` has 1 flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. Lowest priority.
