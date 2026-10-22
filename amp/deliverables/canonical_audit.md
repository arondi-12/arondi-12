# Canonical link audit: zedu.chat marketing pages

Checked 22 Oct 2026 by live fetch (HTTP 200 on every URL below, browser user agent). Repo: zedu-fe (public), branch `dev`.

## What the audit found

The marketing pages named in the brief already declare a correct self-canonical. The pages that fail are the ones the shared homepage layout covers and nobody overrode: three real pages and one route with no page of its own.

The cause is one line: `src/app/(homepage)/layout.tsx:57` sets

```ts
alternates: { canonical: "/" }
```

Every page under `(homepage)` inherits it unless its own `metadata` sets `alternates`. Three pages never do.

## Table

| Page | Status | Canonical served | Verdict | Fix |
|---|---|---|---|---|
| / | 200 | https://zedu.chat | correct | none |
| /pricing | 200 | https://zedu.chat/pricing | correct | none |
| /about | 200 | https://zedu.chat/about | correct | none |
| /products/channels | 200 | /products/channels | correct | none |
| /products/buzz | 200 | /products/buzz | correct | none |
| /products/file-management | 200 | /products/file-management | correct | none |
| /solutions/bootcamps | 200 | /solutions/bootcamps | correct | none |
| /solutions/schools | 200 | /solutions/schools | correct | none |
| /solutions/universities | 200 | /solutions/universities | correct | none |
| /download | 200 | /download | correct | none |
| /resources | 200 | **https://zedu.chat** | wrong: real page canonicalised to home | add self-canonical |
| /policy | 200 | **https://zedu.chat** | wrong: real page canonicalised to home | add self-canonical |
| /terms-of-service | 200 | **https://zedu.chat** | wrong: real page canonicalised to home | add self-canonical |
| /products | 200 | **https://zedu.chat** | route has no page: serves the app shell (0 H1, generic title) | return 404 or build the page; a canonical tag cannot fix a route with no content |
| /products/files | 200 | **https://zedu.chat** | route has no page: shell; real page is /products/file-management | 301 to /products/file-management, or build it |

## The change

In each file, inside the existing `export const metadata: Metadata = { ... }`, add:

```ts
// src/app/(homepage)/resources/page.tsx
alternates: { canonical: "/resources" },
```

```ts
// src/app/(homepage)/policy/page.tsx
alternates: { canonical: "/policy" },
```

```ts
// src/app/(homepage)/terms-of-service/page.tsx
alternates: { canonical: "/terms-of-service" },
```

All three files currently have no `alternates` key (checked in the public repo). Nothing else changes.

## Contributor pages (bonus finding, checked in code)

`contributors/ibis`, `contributors/sparrow` and `contributors/zedu-weaver` also lack `alternates` and would inherit `/`. `zedu-flamingo` has none in its `page.tsx` but its `layout.tsx:20` sets one, so it is fine. If those three are meant to be indexed, they need the same one-line fix; if not, they should be `noindex`.

## What was not checked

- Rendered (post-JavaScript) canonicals: the tag is in the server HTML, so rendering should not change it, but I did not run a headless browser.
- Authenticated routes under /client are out of scope.
- I did not check hreflang or sitemap inclusion; there is no sitemap file today (both /robots.txt and /sitemap.xml return the app shell with HTTP 200).
