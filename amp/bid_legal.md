The cause is in the code, not the legal pages: src/app/(homepage)/layout.tsx line 57 sets canonical "/" for every child route that does not override it, and both /policy and /terms-of-service are client components that only set document.title at runtime (useDocumentTitle in each page.tsx), so the served HTML carries the layout's marketing title and the homepage canonical.

What I will deliver:
1. The exact change: a small server layout for each legal route exporting metadata with a distinct title (under 60 characters), a description written from what the page actually says, alternates.canonical and openGraph.url pointing at that route, and the OG title matching. Legal wording untouched, since the fix is metadata only.
2. The current response table (title, description, canonical, og:url per route) measured on 22 Oct 2026, with the after column left for the deploy and a one-line curl command to fill it in, because I cannot deploy.
3. An explicit question for the owner on indexability, since the brief says to confirm rather than assume: the recommendation is index,follow for both, because they are public legal pages.

Time: same day. Reviewer check: apply the two metadata blocks, deploy, run the curl, and compare with the table.
