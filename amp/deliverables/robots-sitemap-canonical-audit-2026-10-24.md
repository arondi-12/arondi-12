# robots.txt, sitemap.xml and canonical audit: zedu.chat

Every result below is from a live fetch at **2026-10-24T17:25:10Z**. Nothing was cached from an earlier run.

## Headline

The site has **no robots.txt and no sitemap.xml**. Both URLs return HTTP 200 with `content-type: text/html` and the marketing app shell, not the file that was asked for:

| URL | HTTP | Content-Type | Bytes | What the body is | Robots directives | `<loc>` entries |
|---|---|---|---|---|---|---|
| https://zedu.chat/robots.txt | 200 | `text/html; charset=utf-8` | 22771 | HTML app shell | 0 | n/a |
| https://zedu.chat/sitemap.xml | 200 | `text/html; charset=utf-8` | 22774 | HTML app shell | n/a | 0 |

Consequences: crawlers get no crawl rules, no sitemap discovery and no canonical host hint from robots.txt. Search Console will report the sitemap as invalid because the response is HTML, not XML. Because every page currently relies on the header and footer for discovery, the missing sitemap matters most for `/resources` and any future long-tail page.

## Page-by-page audit

The brief's ten pages, plus `/resources` because the canonical check found a defect there. `In sitemap` is `No` for every row because no valid sitemap exists; that is one site-wide defect, not eleven separate ones. `robots.txt` is `None` for the same reason. `Meta robots` is read from the page itself.

| # | Page URL | HTTP | In sitemap | robots.txt directive | Meta robots | Canonical present | Canonical value | Canonical status | Overall |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 2 | `/pricing` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/pricing` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 3 | `/about` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/about` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 4 | `/products/channels` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/products/channels` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 5 | `/products/buzz` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/products/buzz` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 6 | `/products/file-management` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/products/file-management` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 7 | `/solutions/bootcamps` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/solutions/bootcamps` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 8 | `/solutions/schools` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/solutions/schools` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 9 | `/solutions/universities` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/solutions/universities` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 10 | `/download` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat/download` | Correct | **Problem**: no sitemap and no robots.txt (site-wide) |
| 11 | `/resources` | 200 | No (0 URLs) | None (HTML shell) | `index, follow` | Yes | `https://zedu.chat` | **Wrong**: points to the homepage | **Problem**: no sitemap/robots.txt; canonical consolidates this page into `/` |

## Other live checks that change the picture

| Check | Result | Why it matters |
|---|---|---|
| `https://zedu.chat/products/files` | 200, `text/html`, app shell | Soft 404. The real page is `/products/file-management`. A URL in the brief is not a page. |
| `https://zedu.chat/nonexistent-xyz-987` | 200, `text/html`, app shell | Unknown paths return 200, so crawlers can index unlimited fake URLs. A sitemap does not fix this; the catch-all needs a real 404 status. |
| `https://zedu.chat/press`, `/newsroom`, `/llms.txt`, `/sitemap_index.xml` | 200, `text/html`, app shell | Same soft-404 pattern. |
| `http://zedu.chat/` | 308 to `https://zedu.chat/` | Correct. |
| `https://www.zedu.chat/` | 200, same page, canonical `https://zedu.chat` | Host duplicate is served, not redirected. The canonical mitigates it, but a 301 to the apex is cleaner. |
| `x-robots-tag` | absent on `/` and `/robots.txt` | No header-level blocking; the problem is the missing file, not a noindex. |

## What to add in zedu-fe

Next.js 16.3.3 is in `package.json`, so use the App Router metadata files. Add `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/auth/", "/client/", "/api/", "/account"] },
    sitemap: "https://zedu.chat/sitemap.xml",
    host: "https://zedu.chat",
  };
}
```

Add `src/app/sitemap.ts` with only pages that return a marketing document. Suggested set and priorities:

```ts
import type { MetadataRoute } from "next";

const base = "https://zedu.chat";
const routes: Array<[string, number]> = [
  ["", 1], ["/pricing", 0.9], ["/products/channels", 0.8], ["/products/buzz", 0.8],
  ["/products/file-management", 0.8], ["/solutions/bootcamps", 0.8],
  ["/solutions/schools", 0.7], ["/solutions/universities", 0.7],
  ["/about", 0.6], ["/resources", 0.6], ["/download", 0.7],
  ["/contact-sales", 0.5], ["/policy", 0.2], ["/terms-of-service", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(([route, priority]) => ({
    url: `${base}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
```

Then: set `alternates.canonical: "/resources"` in a metadata export for `/resources` (it currently inherits `/`), and add a permanent redirect from `www.zedu.chat` to `zedu.chat` at the CDN or Caddy layer. After deployment, re-fetch both URLs and confirm `content-type` is `text/plain` and `application/xml`, and submit the sitemap in Search Console.

## Method

- `audit/fetch_site.py` requested each URL once with a normal browser user agent, recorded status, `content-type`, byte length, headers and body, and parsed the canonical, robots meta and titles from the HTML.
- Soft-404 checks used the same fetch path; `audit/live.json` keeps the raw evidence for robots, sitemap and the eleven pages.
- The page tables are generated from that JSON, so a reviewer can re-run `python3 audit/build_deliverables.py` and get the same table.
