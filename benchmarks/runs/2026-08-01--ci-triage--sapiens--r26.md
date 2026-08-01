---
scenario: ci-triage
arm: sapiens
run: 26
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:09:52.880Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It is the only real bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships to users as a crash on the empty-cart page. It came from commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

The other two are test problems, not product problems.

`packages/api` has 14 failures, all in `billing.test.ts`. A shared fixture calls `Date.now()` directly, and last week's change froze the clock in the global setup, so every invoice timestamp assertion fails. One line in `test/setup.ts` fixes it. Do this second, since it clears 14 of the 18 failures.

`packages/worker` has 1 flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms, and CI runners are sometimes slower than that. Widen the tolerance or use a fake timer. Lowest priority.
