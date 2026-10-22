I will do this from both the served HTML and the source, because they disagree on several pages and that disagreement is the useful part.

What I have already checked in zeduchat/zedu-fe: the extra H1 on the three solutions pages is not in the page file but in the shared closing panel, src/app/(homepage)/_components/footer/dynamic-footer.tsx line 12, which every page using DynamicFooter renders as an <h1>. Any plan that only edits page.tsx will leave that one behind.

What I will deliver: the 15-row table, with all H1 strings in order, the survivor and one line on why (usually the hero heading, because it names the page for a first-time visitor and matches the title tag), each demoted heading's new level chosen so no level is skipped, and the expected H1 count and heading order after the change. Where two headings could both be the main one — /about "Built for Structured Learning Not Noise" against "Our Vision" — I will say so and give the tie-break rather than hide it.

No code changes, as the brief asks. Time: one day. Reviewer check: pick any row, open the page, count the H1s, and compare with the after column.
