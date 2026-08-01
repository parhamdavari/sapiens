---
scenario: ci-triage
arm: sapiens
run: 17
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:55:32.650Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug of the three. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page. It came from `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

The other 15 failures are test problems, not product problems.

`packages/api` has 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()` directly, and the global setup file froze the clock last week. Every invoice timestamp assertion now fails. One line in `test/setup.ts` fixes all 14.

`packages/worker` has 1 flaky failure in `retry.test.ts`, roughly 1 run in 5. The test asserts a retry happens within 100ms, and CI runners are sometimes slower. Widen the tolerance or use a fake timer. Lowest priority.

One tradeoff worth knowing: if your goal is a green pipeline in the next few minutes rather than a correct product, the `api` one-liner clears 14 of the 18 failures. The user-facing bug is still the one that matters.
