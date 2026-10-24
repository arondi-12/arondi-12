# Internal linking map: the ten heaviest zedu.chat pages

Live crawl: **2026-10-24T17:25:10Z**. Code reference: **zeduchat/zedu-fe @ 8ca4708 (public clone, 9 Oct 2026)**. No code was changed; this is the map the zedu-fe team can action.

## What exists now, counted

`Total anchors` is every `<a href>` to zedu.chat in the served HTML. `Header/footer` is the subset that appears on at least 10 of the 11 crawled pages (same destination and same anchor text). `Body` is everything else: the contextual links a reader can follow inside the page content. Anchors are de-duplicated by destination + anchor text.

| Page | Total internal anchors | Header/footer anchors | Body links | Body destinations | Contextual inbound links |
|---|---|---|---|---|---|
| `/` | 30 | 26 | 4 | /auth/sign-up, /client/settings/organisation/billing/all-plans, /contact-sales | 0 |
| `/pricing` | 25 | 23 | 2 | /client/settings/organisation/billing/all-plans | 1 |
| `/about` | 27 | 25 | 2 | /auth/login, /pricing | 0 |
| `/products/channels` | 26 | 24 | 2 | /auth/sign-up | 0 |
| `/products/buzz` | 28 | 23 | 2 | /auth/sign-up | 0 |
| `/products/file-management` | 27 | 26 | 1 | /auth/sign-up | 0 |
| `/solutions/bootcamps` | 27 | 24 | 2 | /auth/sign-up, /contact-sales | 0 |
| `/solutions/schools` | 27 | 24 | 2 | /auth/sign-up, /contact-sales | 0 |
| `/solutions/universities` | 27 | 24 | 2 | /auth/sign-up, /contact-sales | 0 |
| `/resources` | 23 | 23 | 0 | none | 0 |
| `/download` | 23 | 23 | 0 | none | 0 |

## The two findings that matter

1. **Almost every internal link is boilerplate.** Between 23 and 26 of the 23-30 internal anchors on each page are the same header and footer links. Only the homepage has more than two (it has four); the rest have two or fewer, and `/resources` and `/download` have zero.
2. **Nine of the ten target pages have no contextual inbound link at all.** `/pricing` is the only exception, linked once from `/about` with the anchor "View Pricing". No page is a strict orphan, because the header and footer link every marketing page from every page, but a link that appears on 11 pages in identical boilerplate passes far less relevance than a contextual link inside the copy.

Two specific defects sit inside those numbers:

- The homepage's two pricing links, "Start Pro Plan" and "Compare different plans", point to `/client/settings/organisation/billing/all-plans`, an auth-gated app route (HTTP 200 app shell for a logged-out fetch), not to `/pricing`. The public pricing page gets no homepage body link.
- On `/resources`, every card sourced from `_lib/resources.ts` uses `link: "#"` (15 occurrences), so the resource library has zero working internal links even though it is in the header and footer.

## Orphan check

| Page | Receives any internal link? | Receives a contextual link? | Verdict |
|---|---|---|---|
| `/` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/pricing` | Yes (header/footer) | Yes: /about | Linked contextually once |
| `/about` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/products/channels` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/products/buzz` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/products/file-management` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/solutions/bootcamps` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/solutions/schools` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/solutions/universities` | Yes (header/footer) | No | Not orphaned, but under-linked |
| `/resources` | Yes (header/footer) | No | Not orphaned, but under-linked |

No target page is a true orphan. `/resources` receives 22 boilerplate anchors (header "Resources" plus footer "Blogs" on every page) but no contextual link, so it is the weakest page in the set.

## Links that exist now (body only)

Header and footer links are excluded because they are identical on every page. This is what the proposed links will be compared against, so the change can be counted.

| Page | Existing body link (anchor -> destination) |
|---|---|
| `/` | "Try for free" -> `/auth/sign-up`; "Contact sales" -> `/contact-sales`; "Start Pro Plan" -> `/client/settings/organisation/billing/all-plans`; "Compare different plans" -> `/client/settings/organisation/billing/all-plans` |
| `/pricing` | "Start Pro Plan" -> `/client/settings/organisation/billing/all-plans`; "Compare different plans" -> `/client/settings/organisation/billing/all-plans` |
| `/about` | "Explore the product" -> `/auth/login`; "View Pricing" -> `/pricing` |
| `/products/channels` | "Start using channels" -> `/auth/sign-up`; "Start Now" -> `/auth/sign-up` |
| `/products/buzz` | "Start a buzz" -> `/auth/sign-up`; "Start a Buzz" -> `/auth/sign-up` |
| `/products/file-management` | "Start Organising Files" -> `/auth/sign-up` |
| `/solutions/bootcamps` | "Book a Demo" -> `/contact-sales`; "Start for Free" -> `/auth/sign-up` |
| `/solutions/schools` | "Book a Demo" -> `/contact-sales`; "Start for Free" -> `/auth/sign-up` |
| `/solutions/universities` | "Book a Demo" -> `/contact-sales`; "Start for Free" -> `/auth/sign-up` |
| `/resources` | none |
| `/download` | none |

The shared header links are `/`, `Resources`, `Pricing`, `About Us`, `Download`, `Log in`, `Contact Sales`, `Get Started`, and the three Products and three Solutions dropdown items. The footer repeats the product and solution sets and adds `Blogs`, `Privacy Policy` and `Terms of Service`. All of them are defined once in `_components/header/index.tsx` and `_components/footer/index.tsx`.

## First ten links to add, highest value first

| # | Source page | Exact anchor text | Destination | Journey or query it serves | File or component to change | Action |
|---|---|---|---|---|---|---|
| 1 | `/` | How Bootcamps Use Zedu to Improve Cohort Outcomes | `/solutions/bootcamps` | Bootcamp operator comparing cohort platforms; query: bootcamp cohort management platform | `src/app/(homepage)/_components/home/ArticlesSection.tsx (article 1) + _components/ui/ArticleCard.tsx (add href prop)` | Add |
| 2 | `/` | A Better Campus Communication Layer for Institutions | `/solutions/universities` | University administrator replacing scattered email and LMS tools; query: university communication platform | `ArticlesSection.tsx (article 2) + ArticleCard.tsx` | Add |
| 3 | `/` | Keeping K-12 Classrooms Organized, Safe, and Engaging | `/solutions/schools` | K-12 school leader looking for structured classroom communication | `ArticlesSection.tsx (article 3) + ArticleCard.tsx` | Add |
| 4 | `/` | Compare different plans | `/pricing` | Commercial comparison from the homepage; currently sends logged-out users to an auth-gated app route | `src/app/(homepage)/_components/home/PricingSection.tsx, lines 90-98` | Fix href |
| 5 | `/` | File Management | `/products/file-management` | Reader of the 'All Your Learning Tools' grid who wants the file product page | `src/app/(homepage)/_components/home/FeatureSection.tsx + _lib/featureSectionData.ts (otherFeatures[5])` | Add |
| 6 | `/` | Messaging System | `/products/channels` | Reader who wants the channels/messaging product detail; query: team messaging for education | `FeatureSection.tsx + _lib/featureSectionData.ts (otherFeatures[0])` | Add |
| 7 | `/download` | Buzz (Live Huddles) | `/products/buzz` | Mobile app visitor deciding which in-app tool to use; query: voice chat for online classes | `src/app/(homepage)/download/page.tsx, features array lines 58-80 and render lines 149-155` | Add |
| 8 | `/download` | Channels | `/products/channels` | App visitor looking for course and cohort discussion spaces | `download/page.tsx, features array + render` | Add |
| 9 | `/download` | File Management | `/products/file-management` | App visitor looking for course files and resources | `download/page.tsx, features array + render` | Add |
| 10 | `/products/channels` | Buzz | `/products/buzz` | Product-page reader cross-shopping voice; the 'More That Just Channels' card is already on the page | `src/app/(homepage)/products/channels/page.tsx, otherFeatures[0] lines 91-97, render lines 262-282` | Add |

Ranking logic: the first three turn the homepage's three dead "Read More" cards into the only contextual routes into the three solution pages, which are the highest-intent pages for the brief's bootcamp audience. Ranks 4-6 fix commercial navigation on the homepage. Ranks 7-9 give `/download` its first internal links, and rank 10 starts the product cross-link cluster.

## The rest of the map

| # | Source page | Exact anchor text | Destination | Journey or query it serves | File or component to change | Action |
|---|---|---|---|---|---|---|
| 11 | `/products/channels` | File Management | `/products/file-management` | Channels reader moving course files into the workspace | `channels/page.tsx, otherFeatures[1] + render` | Add |
| 12 | `/products/channels` | Are Channels free? | `/pricing` | FAQ question about plan limits; query: is Zedu free | `channels/page.tsx, channelsFAQs item 4, lines 115-140` | Add |
| 13 | `/products/file-management` | Buzz | `/products/buzz` | File reader who wants live voice discussion around documents | `src/app/(homepage)/products/file-management/page.tsx, otherFeatures[0] + render lines 262-282` | Add |
| 14 | `/products/file-management` | Channels | `/products/channels` | File reader who wants files inside class discussions | `file-management/page.tsx, otherFeatures[1] + render` | Add |
| 15 | `/products/buzz` | learning channels | `/products/channels` | Buzz reader learning where voice sessions live; the hero sentence already contains the phrase | `src/app/(homepage)/products/buzz/page.tsx, hero paragraph` | Add |
| 16 | `/pricing` | bootcamps and structured programs | `/solutions/bootcamps` | Pro-plan reader checking the bootcamp use case; query: bootcamp software pricing | `src/app/(homepage)/_lib/pricingData.ts (Pro description) + _components/ui/PricingCard.tsx` | Add |
| 17 | `/pricing` | small classes and educators | `/solutions/schools` | Starter-plan reader checking the school use case | `pricingData.ts (Starter description), PricingCard.tsx` | Add |
| 18 | `/pricing` | Universities, large programs, and institutions | `/solutions/universities` | Enterprise reader checking the higher-education use case | `pricingData.ts (Enterprise description), PricingCard.tsx` | Add |
| 19 | `/about` | Bootcamps | `/solutions/bootcamps` | 'Designed for Modern Learning Teams' card; query: who is Zedu for | `src/app/(homepage)/about/page.tsx, learning-team cards around lines 200-260` | Add |
| 20 | `/about` | Universities | `/solutions/universities` | About-page reader checking the university offer | `about/page.tsx, learning-team cards` | Add |
| 21 | `/solutions/bootcamps` | dedicated channels | `/products/channels` | Bootcamp reader who wants the channel feature detail | `src/app/(homepage)/solutions/bootcamps/page.tsx, higherEducationCards[0] / structuredCommunicationCards` | Add |
| 22 | `/solutions/bootcamps` | run live classes | `/products/buzz` | Bootcamp reader checking live teaching tools | `solutions/bootcamps/page.tsx, hero paragraph` | Add |
| 23 | `/solutions/schools` | structured channels | `/products/channels` | School reader who wants the channel feature detail | `src/app/(homepage)/solutions/schools/page.tsx, higherEducationCards[0]` | Add |
| 24 | `/solutions/schools` | Assignments, feedback, and clarifications | `/products/file-management` | School reader looking for homework and feedback storage | `solutions/schools/page.tsx, comparison 'with Zedu' list` | Add |
| 25 | `/solutions/universities` | dedicated channels | `/products/channels` | University reader who wants the channel feature detail | `src/app/(homepage)/solutions/universities/page.tsx, higherEducationCards[1]` | Add |
| 26 | `/solutions/universities` | Department Workspaces | `/products/file-management` | University reader looking for separated academic spaces and resources | `solutions/universities/page.tsx, institution-control cards` | Add |
| 27 | `/resources` | Organizing Courses with Channels | `/products/channels` | Guide reader who wants the product behind the guide; the card currently uses href "#" | `src/app/(homepage)/_lib/resources.ts (item 1) + resources/_components/guide-resource-card.tsx` | Fix href |
| 28 | `/resources` | Running Active Class Discussions | `/products/channels` | Teacher looking for discussion tooling | `resources.ts (item 2)` | Fix href |
| 29 | `/resources` | Managing Bootcamp Cohorts | `/solutions/bootcamps` | Bootcamp operator reading the cohort guide | `resources.ts (item 3)` | Fix href |
| 30 | `/resources` | Getting Started with Zedu for Universities | `/solutions/universities` | University reader entering the resource library | `resources.ts (universities item)` | Fix href |
| 31 | `/resources` | Running Bootcamp Cohorts on Zedu Platform | `/solutions/bootcamps` | Bootcamp reader entering the resource library | `resources.ts (bootcamp item)` | Fix href |

## Coverage by source page

| Source page | Proposed links | Destinations |
|---|---|---|
| `/` | 6 | `/solutions/bootcamps`, `/solutions/universities`, `/solutions/schools`, `/pricing`, `/products/file-management`, `/products/channels` |
| `/pricing` | 3 | `/solutions/bootcamps`, `/solutions/schools`, `/solutions/universities` |
| `/about` | 2 | `/solutions/bootcamps`, `/solutions/universities` |
| `/products/channels` | 3 | `/products/buzz`, `/products/file-management`, `/pricing` |
| `/products/buzz` | 1 | `/products/channels` |
| `/products/file-management` | 2 | `/products/buzz`, `/products/channels` |
| `/solutions/bootcamps` | 2 | `/products/channels`, `/products/buzz` |
| `/solutions/schools` | 2 | `/products/channels`, `/products/file-management` |
| `/solutions/universities` | 2 | `/products/channels`, `/products/file-management` |
| `/resources` | 5 | `/products/channels`, `/products/channels`, `/solutions/bootcamps`, `/solutions/universities`, `/solutions/bootcamps` |

Nine of the ten source pages get at least two proposed links. The exception is `/products/buzz`, which gets one because its page is short and Channels is the natural destination; its FAQ answers are a second candidate if the team wants more. `/download`, outside the ten, gets three because it had zero.

## Destination checks

Every proposed destination returned HTTP 200 and a marketing document at crawl time: `/pricing`, `/about`, `/products/channels`, `/products/buzz`, `/products/file-management`, `/solutions/bootcamps`, `/solutions/schools`, `/solutions/universities`, `/resources`. `/products/files` was not used; it is a soft 404. No proposed link points at `/client/...`, `/auth/...` or `#`.

## Notes for the implementer

- `ArticleCard` currently takes `title`, `desc`, `tag` and `image`, and renders a `<button>Read More</button>`. Add an optional `href` prop and wrap the title and button in a `next/link`; keep the existing card layout unchanged.
- `FeatureCard` (used on `/download` and the homepage tool grid) has no `href` prop. Add an optional one rather than wrapping each card in a new div, so the icon, title and description all become part of one link.
- `PricingCard` already receives `ctaHref`; the plan descriptions are plain strings. Rendering the three descriptions with links requires either splitting the string into parts or adding an optional `descriptionHref` prop. The cleaner change is a second line under each plan: "See the bootcamp setup" linked to `/solutions/bootcamps`.
- `/resources` is a client component, and `resources.ts` stores `link: "#"` for every item. Replace those values with the destinations above; `guide-resource-card.tsx` and `webinar-resource-card.tsx` already render a `next/link`.
- Do not add site-wide footer links as a substitute. The point of this map is contextual relevance: a link inside the paragraph or card that already talks about the destination.
- Twenty-nine of the 31 anchor texts are visible in the initial HTML of the source page. The two exceptions are `/resources` card titles, "Getting Started with Zedu for Universities" and "Running Bootcamp Cohorts on Zedu Platform", which render when the Universities or Bootcamps tab is selected; they are stored in `_lib/resources.ts`.

## Method

- `audit/fetch_site.py` captured every anchor with its raw href and visible text from the live HTML on the date above.
- `audit/analyze_links.py` treats a destination + anchor pair as header/footer chrome when it appears on 10 or more of the 11 pages, then counts body links and contextual inbound links. Raw output is in `audit/links.json`.
- `proposals.py` holds the 31 proposed links, and this file is generated from it, so the priority order and per-page coverage stay in sync.
