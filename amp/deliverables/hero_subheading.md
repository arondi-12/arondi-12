# Home page hero subheading: three replacements

**Checked live:** 24 Oct 2026, https://zedu.chat/
**Where it is:** `src/app/(homepage)/_components/home/Herosection.tsx:23`
**Current string:** "Talk about structured channels, cohort communication, and affordable pricing."
**H1 above it:** "Built for Bootcamps and Learning Communities"

## The three options

### Option 1 (recommended) — 22 words
> One workspace for your cohort: subject channels, live teaching, shared files and assignments, with AI that helps learners and no per-student pricing.

Why: it answers "what is this and who is it for" in one line, follows the H1 instead of repeating it, and every clause is already on the home page (Organized Channels, Live Teaching, File Management, Assignment and cohort management, "No Per-Student Pricing").

### Option 2 — 24 words
> Run each cohort with clear channels, weekly goals and assignment checkpoints, so mentors and learners stop juggling chat apps, video links and shared drives.

Why: it leads with the programme manager's job rather than the product, and the pain it names matches the page's own "Replace scattered apps with one structured platform". Longer, so it wraps to two lines at 390px.

### Option 3 — 22 words
> Built for the people running cohorts: subject-based channels, live classes, file sharing and AI support in one place, with no per-student pricing.

Why: closest echo of the H1's "Built for", and the flat-pricing line is the strongest differentiator for a bootcamp buyer. Slightly more product-led than option 2.

## Word counts and checks

| Option | Words | Characters | Claims on the home page today |
|---|---|---|---|
| 1 | 22 | 149 | Organized Channels, Live Teaching, File Management, Assignment and cohort management, "No Per-Student Pricing" |
| 2 | 24 | 157 | "Run each cohort with clear channels, weekly goals, assignment checkpoints", "Replace scattered apps with one structured platform" |
| 3 | 22 | 146 | "Built for Bootcamps and Learning Communities", Organized Channels, Live Teaching, File sharing, AI Agents, "No Per-Student Pricing" |

## The change

Replace line 23 only:

```diff
-        Talk about structured channels, cohort communication, and affordable
-        pricing.
+        One workspace for your cohort: subject channels, live teaching, shared
+        files and assignments, with AI that helps learners and no per-student
+        pricing.
```

The existing classes (`max-w-[95%] text-xs ... md:max-w-[65%] lg:max-w-[45%] lg:text-lg`) stay as they are; the new line is longer than the old one, so check the 390px wrap once in the browser.

## What I did not do

- Did not touch the H1, the CTA button or any other hero element.
- Used no numbers: the home page's "10,000+", "15,000+", "98%", "3x" and "40%" have no source on the page, so they do not belong in a new line either.
- Avoided "seamless" and "all-in-one" here; the page already uses them elsewhere and the hero reads better without them.
