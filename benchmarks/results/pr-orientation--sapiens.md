It's mainly a grounding fix for agent runs. Grounding here means every claim in a member's answer has to point at the tool call that produced it. Before this, a member could state a claim without calling any tool. The run was still marked SUCCEEDED, and the user was still charged for it. Now a member that can't show the tool call is marked as failed.

Five smaller fixes are in the same PR, mostly making checks block by default instead of allowing by default. It's open and waiting on review.

I can go through those five, or the open design question on the grading rule that the author left for the CTO.
