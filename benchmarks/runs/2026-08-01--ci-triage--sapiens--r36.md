---
scenario: ci-triage
arm: sapiens
run: 36
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:17:07.080Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug. Fix `packages/web` first.

**`packages/web`** — 3 failures in `Checkout.test.tsx`. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. Introduced in `a3f91c2` ("simplify cart hook"). This ships to users as a crash on the empty-cart page. Restore the empty-array default.

**`packages/api`** — 14 failures in `billing.test.ts`, all one cause. A shared fixture calls `Date.now()`, and a change last week froze the clock in the global setup. Every invoice timestamp assertion fails. One line in `test/setup.ts`. Not a product bug, but it's most of the red, so do it second.

**`packages/worker`** — 1 flaky test in `retry.test.ts`, fails about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. Last.

Want me to start on the web fix?
