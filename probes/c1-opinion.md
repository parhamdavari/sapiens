USER MESSAGE:

do you think we should move to a monorepo? the team keeps going back and forth on it and I want an outside opinion

CONTEXT AVAILABLE TO YOU (you already gathered this; do not go looking for more):

- 4 services, 3 shared libraries, 11 engineers.
- Today: 7 repos, each with its own CI config. Shared libraries are published to a private npm registry.
- The recurring pain: a change to a shared library needs a publish, a version bump, and 4 separate PRs. It usually takes two days to land everywhere.
- Two engineers strongly want a monorepo. One strongly does not, and argues CI times will get worse.
- Current CI: about 6 minutes per service. No one has measured what a monorepo build would cost.
- The team has no platform engineer and no one who has run a monorepo before.
