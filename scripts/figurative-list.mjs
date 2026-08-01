// Figurative expressions common in software writing.
//
// PROVENANCE — read this before trusting the number it produces.
//
// This list is a general list of idioms and metaphors that appear in engineering prose.
//
// It has been through two rounds of correction, and both are worth knowing about.
//
// Round one: the original list had 32 entries. Eight of them appeared only in the single
// transcript the README used as its bad example, because the list had been written by
// reading that transcript. Its output was not a measurement.
//
// Round two: the replacement list was longer, but six of the entries that still fired were
// the same lifted strings wearing a bigger crowd. "settled as" and "not fully green" are
// not idioms anyone has catalogued. They were on the list because they appear in that one
// file. Those entries are gone.
//
// What remains are expressions a reader would recognise as idioms without being shown the
// text first. Most of them match nothing in this repo. That is expected, and it is not
// evidence of anything: a list that only fires on the files you want to condemn is a
// transcription, and a list that fires on nothing tells you nothing either.
//
// WHAT THE NUMBER MEANS. A hit count is a lower bound on figurative density, not a
// complete count. English has thousands of idioms; this list has a few hundred. Two texts
// are comparable to each other because the same list is applied to both. Neither number is
// an absolute measure of how figurative a text is.
//
// Entries are matched as substrings, lowercased. Keep them specific enough that they don't
// fire on ordinary literal use.

export const FIGURATIVE = [
  // motion and direction
  "down the line", "down the road", "going forward", "further down the track",
  "move the needle", "gain traction", "hit the ground running", "get off the ground",
  "in the pipeline", "on the horizon", "off the table", "on the table",
  "a long way off", "come a long way", "the way forward", "circle back",
  "loop in", "loop back", "touch base", "reach out to", "run past you",

  // combat and force
  "bite back", "take a hit", "push back on", "double down",
  "bulletproof", "battle-tested", "war story", "firefighting", "fire drill",
  "put out fires", "blast radius", "shoot yourself in the foot", "footgun",
  "silver bullet", "magic bullet", "attack surface", "hardened against",
  "throw under the bus", "bite the bullet", "an uphill battle",

  // building and structure
  "bake it in", "baked in", "under the hood", "moving parts", "load-bearing",
  "build on top of", "lay the groundwork", "the foundation of", "cornerstone of",
  "paper over", "papered over", "band-aid", "duct tape", "stopgap",
  "held together with", "brittle", "a house of cards", "scaffolding around",

  // money and trade
  "product call", "judgment call", "buy us time", "at a cost of complexity",
  "eat the cost", "pay off later", "pays dividends", "cheap to", "expensive to",
  "tech debt", "technical debt", "bang for the buck", "worth its weight",
  "a hard sell", "no free lunch",

  // food and consumption
  "low-hanging fruit", "cherry-pick", "a taste of", "half-baked", "bread and butter",
  "the meat of", "digest the", "chew through", "swallow the", "a bitter pill",

  // status and colour
  "the tests are green", "in the green",
  "in the red", "red across the board", "flying blind", "in the dark about",
  "a black box", "grey area", "the golden path", "the happy path",

  // people and body
  "hand-wavy", "hand off to", "keep an eye on", "raise an eyebrow", "gut feeling",
  "gut check", "heavy lifting", "shoulder the", "head-scratcher", "eyeballing it",
  "on the same page", "see eye to eye", "a pain point", "a headache to",
  "muscle memory", "growing pains",

  // speed and weight
  "hit differently", "punch above its weight", "heavyweight", "lightweight approach",
  "drag on the", "friction in the", "smooth sailing", "an uphill climb",
  "spinning our wheels", "in the weeds", "boil the ocean", "scope creep",

  // certainty and revelation
  "the elephant in the room", "the writing on the wall",
  "read between the lines", "the tip of the iceberg", "scratch the surface",
  "peel back the layers", "unpack the", "dig into the", "drill down into",
  "surface the issue", "shine a light on", "a can of worms", "open the floodgates",

  // process metaphors
  "kick the can", "kick off the", "wrap up the", "spin up a", "tear down the",
  "greenlight", "rubber-stamp", "signed off on", "green-lit",
  "a handful of",

  // judgement shortcuts
  "a no-brainer", "a slam dunk", "a game changer", "a step change",
  "night and day", "apples to oranges", "the sweet spot", "the best of both worlds",
  "cut both ways", "a double-edged sword", "the long tail",

  // quiet, sneaky, deceptive
  "silently fails", "fails silently",
  "flies under the radar", "slips through the cracks", "falls through the cracks",
  "sweep under the rug", "smoke and mirrors",

  // vague authority and hedging idioms
  "at the end of the day", "when push comes to shove", "for what it's worth",
  "the jury is still out", "time will tell", "your mileage may vary",

  // headline / emphasis idioms
  "the big one", "the main event", "the star of the show",
  "the crown jewel", "front and centre", "front and center",
];

// A few entries above are also plain technical vocabulary in some contexts. These are
// excluded when they appear inside a code span, which the caller strips before matching:
//   "brittle", "lightweight approach", "greenlight"
