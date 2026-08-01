---
scenario: ci-triage
arm: sapiens
run: 18
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:55:50.542Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug. Fix `packages/web` first.

1. web — `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships to users as a crash on the empty-cart page. It came from commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.
2. api — 14 failures in `billing.test.ts`, all one cause. A shared fixture calls `Date.now()`, and last week's change froze the clock in the global setup, so every invoice timestamp assertion fails. One line in `test/setup.ts`. Not a product bug.
3. worker — `retry.test.ts` is flaky, fails about 1 run in 5. It asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer.

Worth knowing: api owns 14 of the 18 failures, so fixing that one line makes the CI output look almost clean while the real crash is still there. Do web first anyway.
