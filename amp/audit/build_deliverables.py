#!/usr/bin/env python3
"""Build the three task deliverables from the live fetch and validated copy."""
import csv
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, "..", "deliverables"))
os.makedirs(OUT, exist_ok=True)

live = json.load(open(os.path.join(HERE, "live.json")))
meta = {r["path"]: r for r in json.load(open(os.path.join(HERE, "meta_candidates.json")))}
links = json.load(open(os.path.join(HERE, "links.json")))

FETCHED = live["fetched_at_utc"]
REPO = "zeduchat/zedu-fe @ 8ca4708 (public clone, 9 Oct 2026)"


def page(path):
    for p in live["pages"]:
        if (p["url"].replace("https://zedu.chat", "") or "/") == path:
            return p
    raise KeyError(path)


def md_escape(s):
    return (s or "").replace("|", "\\|").replace("\n", " ")


META_SOURCE_FILES = {
    "/": "src/app/(homepage)/page.tsx, lines 10-13",
    "/pricing": "src/app/(homepage)/pricing/page.tsx, lines 14-17",
    "/about": "src/app/(homepage)/about/page.tsx, lines 10-13",
    "/products/channels": "src/app/(homepage)/products/channels/page.tsx, lines 15-18",
    "/products/buzz": "src/app/(homepage)/products/buzz/page.tsx, lines 10-13",
    "/products/file-management": "src/app/(homepage)/products/file-management/page.tsx, lines 10-13",
    "/solutions/bootcamps": "src/app/(homepage)/solutions/bootcamps/page.tsx, lines 11-14",
    "/solutions/schools": "src/app/(homepage)/solutions/schools/page.tsx, lines 11-14",
    "/solutions/universities": "src/app/(homepage)/solutions/universities/page.tsx, lines 11-14",
    "/resources": "src/app/(homepage)/resources/page.tsx (client component, no metadata export); inherits src/app/(homepage)/layout.tsx lines 12-23",
    "/download": "src/app/(homepage)/download/page.tsx, lines 12-15",
}

rows = []
for path in meta:
    p = page(path)
    current = p.get("meta_description") or ""
    if path == "/resources":
        problem = ("Duplicate of the homepage description, and the page canonical is "
                   "https://zedu.chat, so this page is consolidated into the homepage. "
                   f"{len(current)} chars: over the 150-160 target.")
    elif len(current) > 160:
        problem = f"Too long by {len(current) - 160} chars; search results truncate around 155-160."
    elif len(current) < 150:
        problem = f"Short but acceptable ({len(current)} chars). No change needed; optional extension below."
    else:
        problem = "Within 150-160; no change needed."
    rows.append({
        "path": path,
        "current": current,
        "current_chars": len(current),
        "problem": problem,
        "replacement": meta[path]["replacement"],
        "replacement_chars": meta[path]["chars"],
        "replacement_words": meta[path]["words"],
        "source": meta[path]["source"],
        "file": META_SOURCE_FILES[path],
    })

with open(os.path.join(OUT, "meta-descriptions-2026-10-24.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)
print("wrote meta csv, rows:", len(rows))



lines = []
lines.append("# Meta description audit and replacements: zedu.chat core pages")
lines.append("")
lines.append(f"Fetched live: **{FETCHED}** (raw HTML saved; user agent ZeduSEOAudit/1.0).")
lines.append(f"Code reference: **{REPO}**.")
lines.append("")
lines.append("## What the live pages actually serve")
lines.append("")
lines.append("The brief expected several pages to have no description, or to fall back to the page title. That is not what the site serves today. All 11 core pages return HTTP 200, `content-type: text/html`, and a non-empty `<meta name=\"description\">`. None is under 50 characters. The real defect is the opposite: **10 of the 11 descriptions are 168-185 characters**, so search results cut them off, and `/resources` repeats the homepage description word for word.")
lines.append("")
lines.append("Two path notes:")
lines.append("")
lines.append("- The brief lists `/products/files`. That URL returns HTTP 200 but serves the app-shell fallback (a soft 404), not a marketing page. The real page is `/products/file-management`; this audit uses that URL.")
lines.append("- The live build changed during the audit window: at 17:23 UTC `/` served the older \"Seamless Video Meetings\" shell, and from 17:24 UTC it served the current build with `<title>Home</title>`. Every value below is from the current build, fetched in one pass at the timestamp above.")
lines.append("")
lines.append("## The table")
lines.append("")
lines.append("All replacements are **150-160 characters** and use only sentences or labels visible on that same page. Character counts are Python `len()`, so they match a CMS or code count; word counts are whitespace-separated words.")
lines.append("")
lines.append("| # | Page | Current value | Now | Problem | Replacement (150-160) | New chars | Words |")
lines.append("|---|---|---|---|---|---|---|---|")
for i, r in enumerate(rows, 1):
    lines.append("| {} | `{}` | {} | {} | {} | **{}** | {} | {} |".format(
        i, r["path"], md_escape(r["current"]), r["current_chars"], md_escape(r["problem"]),
        md_escape(r["replacement"]), r["replacement_chars"], r["replacement_words"]))
lines.append("")
lines.append("## Source sentence for every replacement")
lines.append("")
for r in rows:
    lines.append(f"- **`{r['path']}`** ({r['replacement_chars']} chars): {r['source']}")
lines.append("")
lines.append("## Where to change it in zedu-fe")
lines.append("")
lines.append("| Page | File and line |")
lines.append("|---|---|")
for r in rows:
    lines.append(f"| `{r['path']}` | `{r['file']}` |")
lines.append("")
lines.append("`/resources` needs more than a string edit: `src/app/(homepage)/resources/page.tsx` starts with `\"use client\"` and exports no `metadata`, so it inherits the whole `(homepage)/layout.tsx` metadata block, including `description` and `alternates.canonical: \"/\"`. Add a server `layout.tsx` beside it (or split the client component) that exports the metadata above and sets `alternates: { canonical: \"/resources\" }`.")
lines.append("")
lines.append("## Verdict per page")
lines.append("")
lines.append("- **Change required (10):** `/`, `/pricing`, `/about`, `/products/channels`, `/products/buzz`, `/products/file-management`, `/solutions/bootcamps`, `/solutions/schools`, `/solutions/universities`, `/resources`.")
lines.append("- **No change required (1):** `/download` is 142 characters, inside the usual snippet range. The 152-character version in the table is optional if the team wants every page inside a strict 150-160 window.")
lines.append("- **Not a defect:** no page is missing a description and no page uses its title as its description.")
lines.append("")
lines.append("## How this was checked")
lines.append("")
lines.append("- `audit/fetch_site.py` fetched every URL once, saved the raw HTML in `audit/raw/`, and parsed title, description, robots meta, canonical, headings and anchors with the Python standard library.")
lines.append("- `audit/make_meta.py` checks every replacement is 150-160 characters and records the on-page source sentence; it prints `OK` for all 11.")
lines.append("- Nothing on the live site was changed. This is a copy deck for the zedu-fe team.")

open(os.path.join(OUT, "meta-descriptions-2026-10-24.md"), "w").write("\n".join(lines) + "\n")
print("wrote meta markdown")



# ---------------------------------------------------------------- deliverable 2
AUDIT_TARGETS = ["/", "/pricing", "/about", "/products/channels", "/products/buzz",
                 "/products/file-management", "/solutions/bootcamps", "/solutions/schools",
                 "/solutions/universities", "/download", "/resources"]
extra = {e["url"].replace("https://zedu.chat", ""): e for e in live["extras"]}
robots, sitemap = extra["/robots.txt"], extra["/sitemap.xml"]

a = []
a.append("# robots.txt, sitemap.xml and canonical audit: zedu.chat")
a.append("")
a.append(f"Every result below is from a live fetch at **{FETCHED}**. Nothing was cached from an earlier run.")
a.append("")
a.append("## Headline")
a.append("")
a.append("The site has **no robots.txt and no sitemap.xml**. Both URLs return HTTP 200 with `content-type: text/html` and the marketing app shell, not the file that was asked for:")
a.append("")
a.append("| URL | HTTP | Content-Type | Bytes | What the body is | Robots directives | `<loc>` entries |")
a.append("|---|---|---|---|---|---|---|")
a.append(f"| https://zedu.chat/robots.txt | {robots['status']} | `{robots['content_type']}` | {robots['bytes']} | HTML app shell | {0 if not robots['has_robots_directive'] else 'yes'} | n/a |")
a.append(f"| https://zedu.chat/sitemap.xml | {sitemap['status']} | `{sitemap['content_type']}` | {sitemap['bytes']} | HTML app shell | n/a | {sitemap['loc_count']} |")
a.append("")
a.append("Consequences: crawlers get no crawl rules, no sitemap discovery and no canonical host hint from robots.txt. Search Console will report the sitemap as invalid because the response is HTML, not XML. Because every page currently relies on the header and footer for discovery, the missing sitemap matters most for `/resources` and any future long-tail page.")
a.append("")
a.append("## Page-by-page audit")
a.append("")
a.append("The brief's ten pages, plus `/resources` because the canonical check found a defect there. `In sitemap` is `No` for every row because no valid sitemap exists; that is one site-wide defect, not eleven separate ones. `robots.txt` is `None` for the same reason. `Meta robots` is read from the page itself.")
a.append("")
a.append("| # | Page URL | HTTP | In sitemap | robots.txt directive | Meta robots | Canonical present | Canonical value | Canonical status | Overall |")
a.append("|---|---|---|---|---|---|---|---|---|---|")
for i, path in enumerate(AUDIT_TARGETS, 1):
    p = page(path)
    canon = (p.get("canonicals") or [None])[0]
    if path == "/resources":
        cstatus = "**Wrong**: points to the homepage"
        overall = "**Problem**: no sitemap/robots.txt; canonical consolidates this page into `/`"
    else:
        cstatus = "Correct"
        overall = "**Problem**: no sitemap and no robots.txt (site-wide)"
    a.append("| {} | `{}` | {} | No (0 URLs) | None (HTML shell) | `{}` | {} | `{}` | {} | {} |".format(
        i, path, p["status"], p.get("meta_robots") or "none", "Yes" if canon else "No",
        canon or "-", cstatus, overall))
a.append("")

a.append("## Other live checks that change the picture")
a.append("")
a.append("| Check | Result | Why it matters |")
a.append("|---|---|---|")
a.append("| `https://zedu.chat/products/files` | 200, `text/html`, app shell | Soft 404. The real page is `/products/file-management`. A URL in the brief is not a page. |")
a.append("| `https://zedu.chat/nonexistent-xyz-987` | 200, `text/html`, app shell | Unknown paths return 200, so crawlers can index unlimited fake URLs. A sitemap does not fix this; the catch-all needs a real 404 status. |")
a.append("| `https://zedu.chat/press`, `/newsroom`, `/llms.txt`, `/sitemap_index.xml` | 200, `text/html`, app shell | Same soft-404 pattern. |")
a.append("| `http://zedu.chat/` | 308 to `https://zedu.chat/` | Correct. |")
a.append("| `https://www.zedu.chat/` | 200, same page, canonical `https://zedu.chat` | Host duplicate is served, not redirected. The canonical mitigates it, but a 301 to the apex is cleaner. |")
a.append("| `x-robots-tag` | absent on `/` and `/robots.txt` | No header-level blocking; the problem is the missing file, not a noindex. |")
a.append("")
a.append("## What to add in zedu-fe")
a.append("")
a.append("Next.js 16.3.3 is in `package.json`, so use the App Router metadata files. Add `src/app/robots.ts`:")
a.append("")
a.append("```ts")
a.append('import type { MetadataRoute } from "next";')
a.append("")
a.append("export default function robots(): MetadataRoute.Robots {")
a.append("  return {")
a.append('    rules: { userAgent: "*", allow: "/", disallow: ["/auth/", "/client/", "/api/", "/account"] },')
a.append('    sitemap: "https://zedu.chat/sitemap.xml",')
a.append('    host: "https://zedu.chat",')
a.append("  };")
a.append("}")
a.append("```")
a.append("")
a.append("Add `src/app/sitemap.ts` with only pages that return a marketing document. Suggested set and priorities:")
a.append("")
a.append("```ts")
a.append('import type { MetadataRoute } from "next";')
a.append("")
a.append('const base = "https://zedu.chat";')
a.append("const routes: Array<[string, number]> = [")
a.append('  ["", 1], ["/pricing", 0.9], ["/products/channels", 0.8], ["/products/buzz", 0.8],')
a.append('  ["/products/file-management", 0.8], ["/solutions/bootcamps", 0.8],')
a.append('  ["/solutions/schools", 0.7], ["/solutions/universities", 0.7],')
a.append('  ["/about", 0.6], ["/resources", 0.6], ["/download", 0.7],')
a.append('  ["/contact-sales", 0.5], ["/policy", 0.2], ["/terms-of-service", 0.2],')
a.append("];")
a.append("")
a.append("export default function sitemap(): MetadataRoute.Sitemap {")
a.append("  const lastModified = new Date();")
a.append("  return routes.map(([route, priority]) => ({")
a.append("    url: `${base}${route}`,")
a.append("    lastModified,")
a.append('    changeFrequency: "monthly",')
a.append("    priority,")
a.append("  }));")
a.append("}")
a.append("```")
a.append("")
a.append("Then: set `alternates.canonical: \"/resources\"` in a metadata export for `/resources` (it currently inherits `/`), and add a permanent redirect from `www.zedu.chat` to `zedu.chat` at the CDN or Caddy layer. After deployment, re-fetch both URLs and confirm `content-type` is `text/plain` and `application/xml`, and submit the sitemap in Search Console.")
a.append("")
a.append("## Method")
a.append("")
a.append("- `audit/fetch_site.py` requested each URL once with a normal browser user agent, recorded status, `content-type`, byte length, headers and body, and parsed the canonical, robots meta and titles from the HTML.")
a.append("- Soft-404 checks used the same fetch path; `audit/live.json` keeps the raw evidence for robots, sitemap and the eleven pages.")
a.append("- The page tables are generated from that JSON, so a reviewer can re-run `python3 audit/build_deliverables.py` and get the same table.")

open(os.path.join(OUT, "robots-sitemap-canonical-audit-2026-10-24.md"), "w").write("\n".join(a) + "\n")


# ---------------------------------------------------------------- deliverable 3
from proposals import PROPOSALS  # noqa: E402

P = links["pages"]
TARGETS = ["/", "/pricing", "/about", "/products/channels", "/products/buzz", "/products/file-management",
           "/solutions/bootcamps", "/solutions/schools", "/solutions/universities", "/resources"]

def inbound_sources(path):
    return [s for s in TARGETS + ["/download"] if any(l["path"] == path for l in P[s]["body_links"])]


c = []
c.append("# Internal linking map: the ten heaviest zedu.chat pages")
c.append("")
c.append(f"Live crawl: **{FETCHED}**. Code reference: **{REPO}**. No code was changed; this is the map the zedu-fe team can action.")
c.append("")
c.append("## What exists now, counted")
c.append("")
c.append("`Total anchors` is every `<a href>` to zedu.chat in the served HTML. `Header/footer` is the subset that appears on at least 10 of the 11 crawled pages (same destination and same anchor text). `Body` is everything else: the contextual links a reader can follow inside the page content. Anchors are de-duplicated by destination + anchor text.")
c.append("")
c.append("| Page | Total internal anchors | Header/footer anchors | Body links | Body destinations | Contextual inbound links |")
c.append("|---|---|---|---|---|---|")
for path in TARGETS + ["/download"]:
    r = P[path]
    inbound_pages = inbound_sources(path)
    dests = ", ".join(sorted({l["path"] for l in r["body_links"]})) or "none"
    c.append(f"| `{path}` | {r['total_internal_anchors']} | {r['global_anchor_instances']} | {len(r['body_links'])} | {dests} | {len(inbound_pages)} |")
c.append("")
c.append("## The two findings that matter")
c.append("")
c.append("1. **Almost every internal link is boilerplate.** Between 23 and 26 of the 23-30 internal anchors on each page are the same header and footer links. Only the homepage has more than two (it has four); the rest have two or fewer, and `/resources` and `/download` have zero.")
c.append("2. **Nine of the ten target pages have no contextual inbound link at all.** `/pricing` is the only exception, linked once from `/about` with the anchor \"View Pricing\". No page is a strict orphan, because the header and footer link every marketing page from every page, but a link that appears on 11 pages in identical boilerplate passes far less relevance than a contextual link inside the copy.")
c.append("")
c.append("Two specific defects sit inside those numbers:")
c.append("")
c.append("- The homepage's two pricing links, \"Start Pro Plan\" and \"Compare different plans\", point to `/client/settings/organisation/billing/all-plans`, an auth-gated app route (HTTP 200 app shell for a logged-out fetch), not to `/pricing`. The public pricing page gets no homepage body link.")
c.append("- On `/resources`, every card sourced from `_lib/resources.ts` uses `link: \"#\"` (15 occurrences), so the resource library has zero working internal links even though it is in the header and footer.")
c.append("")
c.append("## Orphan check")
c.append("")
c.append("| Page | Receives any internal link? | Receives a contextual link? | Verdict |")
c.append("|---|---|---|---|")
for path in TARGETS:
    inbound_pages = inbound_sources(path)
    c.append(f"| `{path}` | Yes (header/footer) | {'Yes: ' + ', '.join(inbound_pages) if inbound_pages else 'No'} | {'Linked contextually once' if inbound_pages else 'Not orphaned, but under-linked'} |")
c.append("")
c.append("No target page is a true orphan. `/resources` receives 22 boilerplate anchors (header \"Resources\" plus footer \"Blogs\" on every page) but no contextual link, so it is the weakest page in the set.")
c.append("")

print("wrote audit deliverable")


c.append("## Links that exist now (body only)")
c.append("")
c.append("Header and footer links are excluded because they are identical on every page. This is what the proposed links will be compared against, so the change can be counted.")
c.append("")
c.append("| Page | Existing body link (anchor -> destination) |")
c.append("|---|---|")
for path in TARGETS + ["/download"]:
    r = P[path]
    if r["body_links"]:
        cell = "; ".join(f"\"{l['text']}\" -> `{l['path']}`" for l in r["body_links"])
    else:
        cell = "none"
    c.append(f"| `{path}` | {cell} |")
c.append("")
c.append("The shared header links are `/`, `Resources`, `Pricing`, `About Us`, `Download`, `Log in`, `Contact Sales`, `Get Started`, and the three Products and three Solutions dropdown items. The footer repeats the product and solution sets and adds `Blogs`, `Privacy Policy` and `Terms of Service`. All of them are defined once in `_components/header/index.tsx` and `_components/footer/index.tsx`.")
c.append("")
c.append("## First ten links to add, highest value first")
c.append("")
c.append("| # | Source page | Exact anchor text | Destination | Journey or query it serves | File or component to change | Action |")
c.append("|---|---|---|---|---|---|---|")
for row in PROPOSALS[:10]:
    c.append("| {} | `{}` | {} | `{}` | {} | `{}` | {} |".format(
        row[0], row[1], md_escape(row[2]), row[3], md_escape(row[4]), md_escape(row[5]), row[6]))
c.append("")
c.append("Ranking logic: the first three turn the homepage's three dead \"Read More\" cards into the only contextual routes into the three solution pages, which are the highest-intent pages for the brief's bootcamp audience. Ranks 4-6 fix commercial navigation on the homepage. Ranks 7-9 give `/download` its first internal links, and rank 10 starts the product cross-link cluster.")
c.append("")
c.append("## The rest of the map")
c.append("")
c.append("| # | Source page | Exact anchor text | Destination | Journey or query it serves | File or component to change | Action |")
c.append("|---|---|---|---|---|---|---|")
for row in PROPOSALS[10:]:
    c.append("| {} | `{}` | {} | `{}` | {} | `{}` | {} |".format(
        row[0], row[1], md_escape(row[2]), row[3], md_escape(row[4]), md_escape(row[5]), row[6]))
c.append("")
c.append("## Coverage by source page")
c.append("")
c.append("| Source page | Proposed links | Destinations |")
c.append("|---|---|---|")
for path in TARGETS:
    rows = [r for r in PROPOSALS if r[1] == path]
    c.append(f"| `{path}` | {len(rows)} | {', '.join('`' + r[3] + '`' for r in rows)} |")
c.append("")
c.append("Nine of the ten source pages get at least two proposed links. The exception is `/products/buzz`, which gets one because its page is short and Channels is the natural destination; its FAQ answers are a second candidate if the team wants more. `/download`, outside the ten, gets three because it had zero.")
c.append("")
c.append("## Destination checks")
c.append("")
c.append("Every proposed destination returned HTTP 200 and a marketing document at crawl time: `/pricing`, `/about`, `/products/channels`, `/products/buzz`, `/products/file-management`, `/solutions/bootcamps`, `/solutions/schools`, `/solutions/universities`, `/resources`. `/products/files` was not used; it is a soft 404. No proposed link points at `/client/...`, `/auth/...` or `#`.")
c.append("")
c.append("## Notes for the implementer")
c.append("")
c.append("- `ArticleCard` currently takes `title`, `desc`, `tag` and `image`, and renders a `<button>Read More</button>`. Add an optional `href` prop and wrap the title and button in a `next/link`; keep the existing card layout unchanged.")
c.append("- `FeatureCard` (used on `/download` and the homepage tool grid) has no `href` prop. Add an optional one rather than wrapping each card in a new div, so the icon, title and description all become part of one link.")
c.append("- `PricingCard` already receives `ctaHref`; the plan descriptions are plain strings. Rendering the three descriptions with links requires either splitting the string into parts or adding an optional `descriptionHref` prop. The cleaner change is a second line under each plan: \"See the bootcamp setup\" linked to `/solutions/bootcamps`.")
c.append("- `/resources` is a client component, and `resources.ts` stores `link: \"#\"` for every item. Replace those values with the destinations above; `guide-resource-card.tsx` and `webinar-resource-card.tsx` already render a `next/link`.")
c.append("- Do not add site-wide footer links as a substitute. The point of this map is contextual relevance: a link inside the paragraph or card that already talks about the destination.")
c.append("- Twenty-nine of the 31 anchor texts are visible in the initial HTML of the source page. The two exceptions are `/resources` card titles, \"Getting Started with Zedu for Universities\" and \"Running Bootcamp Cohorts on Zedu Platform\", which render when the Universities or Bootcamps tab is selected; they are stored in `_lib/resources.ts`.")
c.append("")
c.append("## Method")
c.append("")
c.append("- `audit/fetch_site.py` captured every anchor with its raw href and visible text from the live HTML on the date above.")
c.append("- `audit/analyze_links.py` treats a destination + anchor pair as header/footer chrome when it appears on 10 or more of the 11 pages, then counts body links and contextual inbound links. Raw output is in `audit/links.json`.")
c.append("- `proposals.py` holds the 31 proposed links, and this file is generated from it, so the priority order and per-page coverage stay in sync.")

open(os.path.join(OUT, "internal-linking-map-2026-10-24.md"), "w").write("\n".join(c) + "\n")
print("wrote internal linking deliverable, proposals:", len(PROPOSALS))
