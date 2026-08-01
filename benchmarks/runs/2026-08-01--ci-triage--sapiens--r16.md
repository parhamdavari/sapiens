---
scenario: ci-triage
arm: sapiens
run: 16
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:55:13.163Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug. `useCart()` returns `undefined` for an empty cart instead of `[]`, introduced in `a3f91c2` ("simplify cart hook"), so `cart.length` throws. That ships to users as a crash on the empty-cart page. Restore the empty-array default.

Then `packages/api`. 14 failures in `billing.test.ts`, all one cause: a shared fixture calls `Date.now()` while the global setup now freezes the clock. One-line fix in `test/setup.ts`. Not a product bug, but it clears most of the red.

Last, `packages/worker`. One flaky test in `retry.test.ts`, fails about 1 run in 5. It asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or switch to a fake timer.

Want me to start on the web fix?
