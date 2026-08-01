---
scenario: ci-triage
arm: sapiens
run: 29
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:10:49.423Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page. It came from commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default. 3 failing tests in `Checkout.test.tsx`.

The other 15 failures are test problems, not product bugs.

`packages/api` is second: 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()`, and a change last week froze the clock in the global setup, so every invoice timestamp assertion fails. One line in `test/setup.ts`. It clears most of the red for almost no work.

`packages/worker` is last: 1 flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. No product impact.
