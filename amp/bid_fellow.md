I would build the pack against zeduchat/zedu-fe, because it is public, active and genuinely documented: CONTRIBUTING.md is 28 KB and written against the files in the repo, which makes it a fair test of whether a fellow can actually get to a first contribution. I have already cloned it at commit 8ca4708 (9 Oct 2026), read the prerequisites table (Node >= 20, pnpm 10.27.0 pinned in package.json), and listed the real scripts (dev, build, lint, check-types, test-all, cypress, security:audit).

What I will deliver in one pack:
1. A prerequisite checklist mapped line by line to CONTRIBUTING.md and package.json at that commit, with the exact version I ran and the version the repo asks for.
2. The setup steps, each tagged Executed (with the command and its output) or Untested (with the reason). I will run what is safe here — clone, version checks, script discovery, lint config checks — and I will not claim an install or build I did not run. A pnpm install and Cypress run are the steps I expect to mark untested, with the exact command and disk requirement recorded.
3. A starter-issue rubric, with one clearly labelled illustrative issue and a separate field for the maintainer-approved issue, since I will not invent an approval.
4. The documentation/testing route with a low-bandwidth alternative (reading the CONTRIBUTING sections in order, offline-capable checks, and what can be skipped on a metered connection).
5. A request-for-help template collecting command, error, and what was tried, with a secrets caution, an escalation decision tree, and one clearly fictional readiness record.
6. Proposed pilot measures — invitation to setup, setup to first accepted contribution, and blocked fellows with a named next action — labelled proposed, not results.

Zedu side: coordination runs on channels, threads and file sharing, all available on the free plan; there is no GitHub integration on the free plan and I will not imply one.

Time: two days. Reviewer check: every step either has a command and output beside it or is labelled untested.
