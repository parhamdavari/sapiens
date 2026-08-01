---
scenario: ci-triage
arm: sapiens
run: 34
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:16:33.785Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real user-facing bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws and the empty-cart page crashes for users. It came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default and the 3 tests in `Checkout.test.tsx` should pass.

The other two are test problems, not product problems:

- `packages/api`, 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()` directly, and last week's change froze the clock in global setup, so every invoice timestamp assertion fails. One-line fix in `test/setup.ts`.
- `packages/worker`, 1 flaky test in `retry.test.ts`. It asserts a retry happens within 100ms and CI runners are sometimes slower. Fails about 1 run in 5. Widen the tolerance or use a fake timer.

If you want CI green fast, the api fix is one line and clears 14 of the 18 failures. But the web bug is the one shipping to users.
