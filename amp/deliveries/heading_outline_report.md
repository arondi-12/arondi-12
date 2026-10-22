# Heading outline as Chrome's accessibility tree reports it

**Date checked:** 22 Oct 2026. **Author:** Radar (research and audience insight).

**Tool and version:** Chrome/156.0.8078.47, headless, viewport 1280x900. The tree is read over the DevTools protocol with `Accessibility.getFullAXTree` and walked depth-first from the `RootWebArea` node, so the order below is the order the browser exposes. Axe-core 4.14.0 ran in the same page for `heading-order`, `empty-heading`, `page-has-heading-one` and `region`.

**Pages checked:** /, /pricing, /about, /solutions/universities, /products/channels.

**Pages not checked:** /download, /solutions/schools, /solutions/bootcamps, /products/buzz, /products/file-management, /resources, /policy, /terms-of-service, /auth/login, /auth/sign-up.

**Scope:** nothing was changed. No NVDA or VoiceOver was run, so nothing below is described as "heard"; it is what the browser exposes to those readers.


## Summary

| Page | Raw HTML h1/h2/h3 | Tree h1/h2/h3 | Same? | H1s | First heading in the tree | Level jumps | Sections with text but no heading | Main landmark |
|---|---|---|---|---|---|---|---|---|
| / | 9/22/21 | 9/22/21 | yes | 9 | h1 "Built for Bootcamps andLearning Communities" | h1→h3, h1→h3, h1→h3 | 0 of 10 | none |
| /pricing | 4/7/10 | 4/7/10 | yes | 4 | h1 "Simple, Flexible Pricing for Education" | h1→h3, h1→h3 | 0 of 3 | none |
| /about | 5/10/4 | 5/10/4 | yes | 5 | h1 "Built for StructuredLearning Not Noise" | h1→h3, h1→h3 | 0 of 8 | none |
| /solutions/universities | 7/10/9 | 7/10/9 | yes | 7 | h1 "Modern Communication for Universities" | h1→h3, h1→h3, h1→h3, h1→h3 | 0 of 7 | none |
| /products/channels | 6/8/9 | 6/8/9 | yes | 6 | h1 "Organise Learning with Structured Channels." | h1→h3, h1→h3, h1→h3 | 0 of 6 | none |

**What the numbers say.** The heading counts in the served HTML and in the browser tree are identical on all five pages, and the order of levels is identical too, so nothing is being hidden from the parser. The problem the goal is chasing is the count itself: nine H1s on the home page, seven on /solutions/universities, six on /products/channels, five on /about, four on /pricing. A reader using headings to skim is told five to nine times that a new page is starting.

A second, separate problem: every page has a footer block headed `h3` ("Get Zedu today") after an `h1`, and several feature cards are `h3` under a section that starts at `h1`. That is the level jump axe reports, and it is the cheapest fix in this report: those cards should be `h2`.

A third finding, outside headings but relevant to anyone fixing them: **there is no `<main>` landmark on any of the five pages** (one `<nav>`, one `<footer>`, no `role="main"`). Axe's `region` rule fires on 71 nodes on the home page for exactly this reason, and it means a skip-to-content link has nothing to target.


## /

Outline in tree order. Names are copied exactly as the tool returns them, which is why words sometimes run together where the markup breaks a line ("Bootcamps andLearning") — that is the tree joining text nodes, not a typo in the page.

1. h1 — Built for Bootcamps andLearning Communities
2. h1 — Everything you need forModern Learning
3. h2 — Organized Channels
4. h2 — Cohort Communication
5. h2 — Calls & Collaboration
6. h2 — AI Agents
7. h1 — Fewer Tools, Smarter Learning
8. h2 — 3x
9. h2 — 40%
10. h2 — 24/7
11. h2 — All Your Learning Tools. One Simple Subscription
12. h3 — Messaging System
13. h3 — Live Teaching
14. h3 — Storyboard
15. h3 — Class Recordings
16. h3 — Conversation Mesh
17. h3 — File Management
18. h3 — Whiteboard
19. h3 — AI class notes
20. h1 — The Platform for Every Type of Learning
21. h3 — How Bootcamps Use Zedu to Improve Cohort Outcomes
22. h3 — A Better Campus Communication Layer for Institutions
23. h3 — Keeping K-12 Classrooms Organized, Safe, and Engaging
24. h1 — Simple, Flexible Pricing for Education
25. h2 — Starter
26. h3 — ₦0 /month
27. h2 — Pro
28. h3 — ₦20K /month
29. h2 — Enterprise
30. h3 — Let's Talk
31. h1 — Launching a bootcamp? Let's build a pricing model that fits your cohort size.
32. h1 — Why Educators Choose Zedu
33. h2 — Built for Education, Not Business
34. h2 — No Per-Student Pricing
35. h2 — AI-Powered Teaching Support
36. h2 — Built For Secured, Structured Learning
37. h2 — Role-Based Access Control
38. h2 — Private Cohorts & Controlled Spaces
39. h2 — Data Protection & Platform Reliability
40. h1 — Got a Question?We Have an Answer
41. h3 — What is Zedu?
42. h3 — How does Zedu support students and learners?
43. h3 — Is Zedu difficult to set up for a school or bootcamp?
44. h3 — Can Zedu use our institution’s information to answer questions?
45. h3 — Is student support fully automated?
46. h3 — How does pricing work for educational institutions?
47. h1 — Run Your Next Cohort Without Limits
48. h3 — Get Zedu today
49. h2 — Products
50. h2 — Solutions
51. h2 — Zedu
52. h2 — Resources

Axe-core reported 3 heading-order node(s):

- `.max-w-\[380px\].mx-auto.w-full:nth-child(1) > .drop-shadow-md > .px-5.py-5.sm\:py-6 > .sm\:text-lg.text-base` → `<h3 class="text-base font-semibold text-neutral-900 sm:text-lg">How Bootcamps Use Zedu to Improve Cohort Outcomes</h3>`
- `.border-\[\#E5E8FF\].bg-\[\#FAFAFF\].border:nth-child(1) > h3` → `<h3 data-orientation="vertical" data-state="closed" class="flex">`
- `.leading-none.text-2xl.text-white` → `<h3 class="text-2xl font-semibold leading-none text-white">Get Zedu today</h3>`
Empty headings: none.

Sections with text but no heading: 0 of 10 sections on the page. Rule: every `<section>` containing 40 or more characters of text was checked for a heading inside it; none lacked one.


## /pricing

Outline in tree order. Names are copied exactly as the tool returns them, which is why words sometimes run together where the markup breaks a line ("Bootcamps andLearning") — that is the tree joining text nodes, not a typo in the page.

1. h1 — Simple, Flexible Pricing for Education
2. h2 — Starter
3. h3 — ₦0 /month
4. h2 — Pro
5. h3 — ₦20K /month
6. h2 — Enterprise
7. h3 — Let's Talk
8. h1 — Launching a bootcamp? Let's build a pricing model that fits your cohort size.
9. h1 — Got a Question?We Have an Answer
10. h3 — What is Zedu?
11. h3 — How does Zedu support students and learners?
12. h3 — Is Zedu difficult to set up for a school or bootcamp?
13. h3 — Can Zedu use our institution’s information to answer questions?
14. h3 — Is student support fully automated?
15. h3 — How does pricing work for educational institutions?
16. h1 — Start Building Structured Learning Today
17. h3 — Get Zedu today
18. h2 — Products
19. h2 — Solutions
20. h2 — Zedu
21. h2 — Resources

Axe-core reported 2 heading-order node(s):

- `.border-\[\#E5E8FF\].bg-\[\#FAFAFF\].rounded-xl:nth-child(1) > h3` → `<h3 data-orientation="vertical" data-state="closed" class="flex">`
- `.leading-none.text-2xl` → `<h3 class="text-2xl font-semibold leading-none text-white">Get Zedu today</h3>`
Empty headings: none.

Sections with text but no heading: 0 of 3 sections on the page. Rule: every `<section>` containing 40 or more characters of text was checked for a heading inside it; none lacked one.


## /about

Outline in tree order. Names are copied exactly as the tool returns them, which is why words sometimes run together where the markup breaks a line ("Bootcamps andLearning") — that is the tree joining text nodes, not a typo in the page.

1. h1 — Built for StructuredLearning Not Noise
2. h1 — Our Philosophy
3. h2 — Structure Drives Clarity
4. h2 — AI Should Assist, Not Replace
5. h2 — Educators Deserve Better Tools
6. h2 — Move quickly from ideas to execution
7. h1 — Designed for Modern Learning Teams
8. h3 — Bootcamps
9. h3 — Universities
10. h3 — Online Learning platforms
11. h2 — Built for Modern Learning
12. h1 — Our Vision
13. h2 — Built with Privacy and Protection in Mind
14. h1 — Start Building Structured Learning Today
15. h3 — Get Zedu today
16. h2 — Products
17. h2 — Solutions
18. h2 — Zedu
19. h2 — Resources

Axe-core reported 2 heading-order node(s):

- `.p-4:nth-child(1) > .sm\:text-lg` → `<h3 class="text-base font-semibold text-neutral-900 sm:text-lg">Bootcamps</h3>`
- `.gap-3.items-center.flex > .leading-none` → `<h3 class="text-2xl font-semibold leading-none text-white">Get Zedu today</h3>`
Empty headings: none.

Sections with text but no heading: 0 of 8 sections on the page. Rule: every `<section>` containing 40 or more characters of text was checked for a heading inside it; none lacked one.


## /solutions/universities

Outline in tree order. Names are copied exactly as the tool returns them, which is why words sometimes run together where the markup breaks a line ("Bootcamps andLearning") — that is the tree joining text nodes, not a typo in the page.

1. h1 — Modern Communication for Universities
2. h1 — Built for Higher Education Environments
3. h2 — Large Cohorts
4. h2 — Organized Courses
5. h2 — AI Assisted Learning
6. h1 — Structured Communication Across the University
7. h3 — Organized Communication
8. h3 — Collaboration at Scale
9. h3 — AI-Powered Learning
10. h1 — Institution Control and Security
11. h3 — Role-Based Permissions
12. h3 — Department Workspaces
13. h3 — Secure Communication
14. h1 — How Zedu transforms Universities
15. h3 — Without Zedu
16. h3 — With Zedu
17. h1 — Run Leaner. Move Faster. Teach Better.
18. h2 — 40%
19. h2 — 2x
20. h2 — 60%
21. h1 — Bring Structured Communication to Your University
22. h3 — Get Zedu today
23. h2 — Products
24. h2 — Solutions
25. h2 — Zedu
26. h2 — Resources

Axe-core reported 4 heading-order node(s):

- `article:nth-child(1) > .space-y-4.text-center > .sm\:text-xl.text-lg` → `<h3 class="text-lg font-semibold text-[#1f2530] sm:text-xl">Organized Communication</h3>`
- `.border-neutral-200.p-6.border:nth-child(1) > .text-lg` → `<h3 class="text-lg font-semibold text-[#1f2530]">Role-Based Permissions</h3>`
- `.md\:rounded-none > .text-lg` → `<h3 class="text-lg font-semibold">Without Zedu</h3>`
- `.leading-none.text-2xl` → `<h3 class="text-2xl font-semibold leading-none text-white">Get Zedu today</h3>`
Empty headings: none.

Sections with text but no heading: 0 of 7 sections on the page. Rule: every `<section>` containing 40 or more characters of text was checked for a heading inside it; none lacked one.


## /products/channels

Outline in tree order. Names are copied exactly as the tool returns them, which is why words sometimes run together where the markup breaks a line ("Bootcamps andLearning") — that is the tree joining text nodes, not a typo in the page.

1. h1 — Organise Learning with Structured Channels.
2. h1 — Organized Communication for Learning
3. h2 — Keep conversations in the right place
4. h2 — Follow discussions without noise
5. h2 — Share important updates clearly
6. h2 — Channels built for education
7. h1 — Channels that Scale with Your Institution
8. h1 — More That Just Channels
9. h3 — Buzz
10. h3 — File Management
11. h3 — Ai Agents
12. h3 — Assignments
13. h1 — Got a Question?We Have an Answer
14. h3 — When should I use Channels?
15. h3 — What can I do in a Channels?
16. h3 — How do I start a Channels?
17. h3 — Are Channels free?
18. h1 — Organize Your Learning Community with Channels
19. h3 — Get Zedu today
20. h2 — Products
21. h2 — Solutions
22. h2 — Zedu
23. h2 — Resources

Axe-core reported 3 heading-order node(s):

- `.sm\:gap-4.sm\:rounded-3xl.bg-white:nth-child(1) > .sm\:text-lg.text-base.text-neutral-900` → `<h3 class="text-base font-semibold text-neutral-900 sm:text-lg">Buzz</h3>`
- `.border-\[\#E5E8FF\].bg-\[\#FAFAFF\].rounded-xl:nth-child(1) > h3` → `<h3 data-orientation="vertical" data-state="closed" class="flex">`
- `.text-2xl.leading-none` → `<h3 class="text-2xl font-semibold leading-none text-white">Get Zedu today</h3>`
Empty headings: none.

Sections with text but no heading: 0 of 6 sections on the page. Rule: every `<section>` containing 40 or more characters of text was checked for a heading inside it; none lacked one.


## What I could not establish, and did not claim

- **Which headings a sighted visitor actually sees.** I tried to measure this and stopped: several headings here have a zero-height line box because of the page's line-height and overflow CSS, so a naive check reports them as invisible when the text may still paint. I am not putting a visibility number in this report, because I could not make it reliable from outside the page. It needs a person with the page open, or the CSS owner.

- **What a screen reader says.** The tree is the input, not the output. Landmark announcements, skip links and reading order between headings are outside this check.

- **Mobile.** Only 1280x900 was tested. At 390px the same markup exposes different layout, and any count above should be re-run there before the fix is signed off.


## How to reproduce

1. Chrome 156 → DevTools → Elements → select the first `h1` → Accessibility pane. The list appears in the same order as above.
2. Or run the attached `headings2.js` with `node` (needs `puppeteer` and `axe-core` installed); it regenerates `headings_final.json`, the file every table here was built from.
3. Cross-check a count with `curl -s https://zedu.chat/ | grep -o '<h[1-6]' | wc -l` — 52 on the home page, the same number the tree reports.
