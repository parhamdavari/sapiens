---
scenario: ci-triage
arm: sapiens
run: 33
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:16:16.308Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug. Fix `packages/web` first.

In `web`, `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. It came in with commit `a3f91c2` ("simplify cart hook"). That ships to users as a crash on the empty-cart page. Restore the empty-array default.

The 14 failures in `api` look scary but are all one thing. A change last week froze the clock in the global setup, and the billing fixture still calls `Date.now()` directly. One-line fix in `test/setup.ts`. Noisy, not a product bug.

`worker` has one flaky test in `retry.test.ts`, failing about 1 run in 5. The assertion gives a retry 100ms, and CI runners are sometimes slower than that. Widen the tolerance or use a fake timer. Lowest priority.

Want me to start on the `web` fix?
