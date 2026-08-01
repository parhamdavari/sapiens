---
scenario: ci-triage
arm: sapiens
run: 24
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:00:37.905Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It is the only real bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships to users as a crash on the empty-cart page. It came from commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

The other two are test problems, not product problems.

`packages/api` has 14 failures in `billing.test.ts`, all from one cause. A shared fixture calls `Date.now()` directly, and a change last week froze the clock in the global setup file. Every invoice timestamp assertion fails. One-line fix in `test/setup.ts`. Big number, small fix.

`packages/worker` has 1 flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer.

Order: web for the user-facing crash, then api to get CI green again, then worker whenever.
