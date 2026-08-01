import { test } from "node:test";
import assert from "node:assert/strict";
import { idiomHits, listSize } from "../scripts/lib/idioms.mjs";

test("list is externally derived and non-trivial", () => {
  assert.ok(listSize > 5000, `list size ${listSize}`);
});

// Literal phrases that the old substring matcher, or a sloppier list, would
// flag. Every one of these must produce zero hits.
const FALSE_POSITIVES = [
  "the user lands in the redirect flow",
  "this query is expensive to compute",
  "the fix is cheap to verify",
  "logging is read in the redis config",
  "the value in the reducer is stale",
  "we run the suite on demand",
  "say what is true and stop",
  "call it whatever you like",
  "the test checks that way of loading",
  "files load at all times",
  "the diff is good and the tests pass",
  "the other side of the file is unchanged",
  "cut it into three commits",
  "the deploy is used to verify the build",
  "the answer arrived as well as the logs",
  "the schema is not quite finished",
  "handlers fire on purpose built events",
  "the loop runs up to ten times",
  "the branch was merged after the review",
  "we compare A vs. B in stage 4",
  "the pointer moves down the list",
  "the numbers are in the table below",
];

test("false-positive corpus produces zero hits", () => {
  for (const text of FALSE_POSITIVES) {
    assert.deepEqual(idiomHits(text), [], text);
  }
});

// Real idioms present in the derived list. Full detection required.
const TRUE_POSITIVES = [
  ["the elephant in the room", ["elephant in the room"]],
  ["we keep kicking the can down the road", ["down the road"]],
  ["that will move the needle", ["move the needle"]],
  ["it is low-hanging fruit", ["low hanging fruit"]],
  ["let us touch base tomorrow", ["touch base"]],
  ["reading between the lines here", []], // inflected: documented miss, stays a miss
  ["it happened out of the blue", ["out of the blue"]],
  ["a dime a dozen", ["a dime a dozen"]],
];

test("true-positive corpus is detected as documented", () => {
  for (const [text, expected] of TRUE_POSITIVES) {
    assert.deepEqual(idiomHits(text), expected, text);
  }
});

test("word boundaries hold inside longer words", () => {
  assert.deepEqual(idiomHits("in the redirect"), []);
  assert.deepEqual(idiomHits("the redistribution of in the redaction"), []);
});
