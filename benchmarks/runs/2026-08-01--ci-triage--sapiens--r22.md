---
scenario: ci-triage
arm: sapiens
run: 22
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:00:06.365Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships to users as a crash on the empty-cart page. It came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

The other two are test-only problems:

- `packages/api`, 14 failures in `billing.test.ts`. A change last week froze the clock in the global setup, but a shared fixture still calls `Date.now()`, so every invoice timestamp assertion fails. One line in `test/setup.ts`.
- `packages/worker`, 1 flaky test in `retry.test.ts`. It asserts a retry happens within 100ms and CI runners are sometimes slower, so it fails about 1 run in 5. Widen the tolerance or switch to a fake timer.
