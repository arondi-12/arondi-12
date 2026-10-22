I have already located every one of them in the public repo (zeduchat/zedu-fe), so this is verification rather than guesswork.

What the code shows: each solutions page keeps its own H1s inline, with no shared heading component. src/app/(homepage)/solutions/bootcamps/page.tsx has five at lines 139, 181, 201, 226, 243. schools/page.tsx has five at 139, 181, 201, 226, 243. universities/page.tsx has six at 161, 203, 223, 248, 279, 296. The extra H1 on the live pages (six on bootcamps and schools, seven on universities) comes from one shared file: src/app/(homepage)/_components/footer/dynamic-footer.tsx line 12, the closing "Power Your Next Bootcamp Cohort" panel, which renders an <h1> for every page that uses DynamicFooter.

What I will deliver: a table with one row per rendered H1 — the exact string, whether it is inline in the page file or from the shared footer, the file and line, and the class string in use — plus the count the live HTML and the source each produce, so the difference is explained rather than assumed. I will note the two places where my source count and the served count differ and why.

Time: same day. The reviewer can open each file and line and see the tag.
