---
scenario: ci-triage
arm: sapiens
run: 10
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:14:40.803Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug of the three.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws in `Checkout.test.tsx`. That ships as a crash on the empty-cart page. It came from commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

Second, `packages/api`: 14 failures in `billing.test.ts`, all noise. A shared fixture calls `Date.now()` directly, and the global setup froze the clock last week, so every invoice timestamp assertion fails. One line in `test/setup.ts`. It's loud but harmless, and fixing it clears most of the red.

Last, `packages/worker`: one flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. No user impact.

So: 18 failing tests, one user-facing bug. Want me to start on the web fix?
