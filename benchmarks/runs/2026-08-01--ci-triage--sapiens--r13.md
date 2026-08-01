---
scenario: ci-triage
arm: sapiens
run: 13
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:15:29.851Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug. Fix `packages/web` first.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws in `Checkout.test.tsx`. It came from commit `a3f91c2` ("simplify cart hook"). This ships to users as a crash on the empty-cart page. Restore the empty-array default.

The other 15 failures are test problems, not product problems. In `packages/api`, 14 tests fail because a shared fixture calls `Date.now()` while the global setup now freezes the clock. One line in `test/setup.ts` clears all of them, so it is the cheapest way to get CI mostly green. In `packages/worker`, `retry.test.ts` is flaky and fails about 1 run in 5, because it asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer whenever you get to it.

Order: web, then api, then worker.
