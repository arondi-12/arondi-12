A rerunnable check is only useful if it fails loudly on the exact URL and value, so that is what I will build and then run against the live site.

What I will deliver: a single Python script (no browser needed, one file, standard library only) that crawls the listed routes with a real user agent and prints one row per URL with HTTP status, title, meta description length, canonical, robots directive, H1 count and each H1 string, og:url and og:image. It compares canonical to the page's own URL, requires exactly one H1, and exits non-zero when a row fails, so a release job can gate on it. Alongside it: a sample results table from a real run on 22 Oct 2026, the expected-value rules written out, and a two-line instruction for running it after a release.

What it will catch today, measured: the home page title "Home", canonical https://zedu.chat on /resources, /policy and /terms-of-service, the shared og:image across eight pages, and H1 counts from 0 to 9 depending on the route.

Boundaries: this is a check, not a copy rewrite, and not the Telex-reference audit. It reads public pages only, no authenticated routes.

Time: one day. The reviewer can run the script themselves against the live site and compare their output with the sample table.
