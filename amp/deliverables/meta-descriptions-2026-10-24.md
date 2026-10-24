# Meta description audit and replacements: zedu.chat core pages

Fetched live: **2026-10-24T17:25:10Z** (raw HTML saved; user agent ZeduSEOAudit/1.0).
Code reference: **zeduchat/zedu-fe @ 8ca4708 (public clone, 9 Oct 2026)**.

## What the live pages actually serve

The brief expected several pages to have no description, or to fall back to the page title. That is not what the site serves today. All 11 core pages return HTTP 200, `content-type: text/html`, and a non-empty `<meta name="description">`. None is under 50 characters. The real defect is the opposite: **10 of the 11 descriptions are 168-185 characters**, so search results cut them off, and `/resources` repeats the homepage description word for word.

Two path notes:

- The brief lists `/products/files`. That URL returns HTTP 200 but serves the app-shell fallback (a soft 404), not a marketing page. The real page is `/products/file-management`; this audit uses that URL.
- The live build changed during the audit window: at 17:23 UTC `/` served the older "Seamless Video Meetings" shell, and from 17:24 UTC it served the current build with `<title>Home</title>`. Every value below is from the current build, fetched in one pass at the timestamp above.

## The table

All replacements are **150-160 characters** and use only sentences or labels visible on that same page. Character counts are Python `len()`, so they match a CMS or code count; word counts are whitespace-separated words.

| # | Page | Current value | Now | Problem | Replacement (150-160) | New chars | Words |
|---|---|---|---|---|---|---|---|
| 1 | `/` | Zedu is an AI-powered education platform built for bootcamps and learning communities. Organize cohorts, run classes, manage communication, and scale modern learning in one workspace. | 183 | Too long by 23 chars; search results truncate around 155-160. | **Zedu brings structured channels, cohort communication, live collaboration and AI agents into one shared workspace for bootcamps and learning communities.** | 153 | 20 |
| 2 | `/pricing` | Explore Zedu pricing plans for schools, bootcamps, and cohort-based learning teams. Compare features, choose the right plan, and scale structured learning with AI-powered collaboration. | 185 | Too long by 25 chars; search results truncate around 155-160. | **Compare Zedu Starter, Pro and Enterprise plans for educators, bootcamps and institutions, with flexible pricing for structured learning and AI support.** | 151 | 21 |
| 3 | `/about` | Learn how Zedu helps schools, universities, and bootcamps run structured, AI-assisted learning communication with organized channels, collaboration tools, and educator-first workflows. | 184 | Too long by 24 chars; search results truncate around 155-160. | **See how Zedu helps educators and learning teams run organized, distraction-free communication for modern cohorts, with AI that assists, not replaces, teachers.** | 159 | 22 |
| 4 | `/products/channels` | Explore Zedu Channels for structured classroom and cohort communication. Organize discussions by subject, share updates clearly, and scale collaboration across learning teams. | 175 | Too long by 15 chars; search results truncate around 155-160. | **Keep discussions organized by course, cohort or topic with Zedu Channels. Threaded replies and clear announcements help everyone follow the conversation.** | 153 | 21 |
| 5 | `/products/buzz` | Use Zedu Buzz to start instant voice conversations inside learning channels. Collaborate in real time, clarify lessons faster, and review AI-generated session summaries. | 169 | Too long by 9 chars; search results truncate around 155-160. | **Start instant voice conversations inside any Zedu learning channel. Buzz adds AI-generated summaries after each session so students can review key ideas.** | 153 | 22 |
| 6 | `/products/file-management` | Manage course files in one structured workspace with Zedu File Management. Organize resources, share securely, and collaborate across classes, cohorts, and departments. | 168 | Too long by 8 chars; search results truncate around 155-160. | **Store, share and collaborate on course materials, assignments and resources in Zedu. File Management keeps every resource tied to its class and conversation.** | 157 | 23 |
| 7 | `/solutions/bootcamps` | Streamline bootcamp management with Zedu. Give instructors, mentors, and students one cohort management platform for structured learning, collaboration, and community building. | 176 | Too long by 16 chars; search results truncate around 155-160. | **Zedu gives bootcamps one platform to manage cohorts, run live classes, support students and build active learning communities with structured channels.** | 151 | 21 |
| 8 | `/solutions/schools` | Improve classroom communication with Zedu. Give teachers and students structured channels for lessons, assignments, discussions, and school-wide updates in one platform. | 169 | Too long by 9 chars; search results truncate around 155-160. | **Connect teachers, students and school staff in one organized workspace. Zedu gives classrooms structured channels for lessons, homework and announcements.** | 154 | 20 |
| 9 | `/solutions/universities` | Power higher education communication with Zedu. Connect departments, professors, and students with structured channels, searchable discussions, and AI-assisted learning workflows. | 179 | Too long by 19 chars; search results truncate around 155-160. | **Bring departments, courses and student communities into one structured learning workspace for higher education, with role-based permissions and secure spaces.** | 158 | 20 |
| 10 | `/resources` | Zedu is an AI-powered education platform built for bootcamps and learning communities. Organize cohorts, run classes, manage communication, and scale modern learning in one workspace. | 183 | Duplicate of the homepage description, and the page canonical is https://zedu.chat, so this page is consolidated into the homepage. 183 chars: over the 150-160 target. | **Explore Zedu guides, case studies, templates and webinars for universities, schools and bootcamps building modern, structured learning communities with Zedu.** | 157 | 20 |
| 11 | `/download` | Download Zedu on iOS, Android, and desktop. Join classes, chat with peers, manage files, and stay updated in one connected learning workspace. | 142 | Short but acceptable (142 chars). No change needed; optional extension below. | **Download Zedu on iOS, Android and desktop. Join classes, chat with peers, manage files and keep up with assignments in one connected learning workspace.** | 152 | 24 |

## Source sentence for every replacement

- **`/`** (153 chars): Home: 'Built for Bootcamps and Learning Communities'; 'From organized channels to AI-powered agents, Zedu brings communication, collaboration, and automation into one seamless workspace.'
- **`/pricing`** (151 chars): Pricing: plan cards Starter / Pro / Enterprise; subtitle 'Flexible plans for educators, bootcamps, and institutions building structured learning environments with collaboration and AI support.'
- **`/about`** (159 chars): About: 'Zedu was created to help educators and learning teams run organized, distraction-free communication for modern cohorts.'; 'AI Should Assist, Not Replace'.
- **`/products/channels`** (153 chars): Channels: 'Channels keep discussions organized by course, cohort, or topic'; 'Threaded replies'; 'send announcements directly within the relevant channels'.
- **`/products/buzz`** (153 chars): Buzz: 'Buzz lets students, educators, and teams jump into quick voice conversations directly inside learning channels.'; 'automatically generates a summary of the conversation'.
- **`/products/file-management`** (157 chars): File Management: 'Store, share, and collaborate on course materials, assignments, and resources directly inside Zedu. Everything stays connected to the conversations and classes where it belongs.'
- **`/solutions/bootcamps`** (151 chars): Bootcamps: 'An all-in-one platform for bootcamps to manage cohorts, run live classes, support students, and build active learning communities.'; 'dedicated channels'.
- **`/solutions/schools`** (154 chars): Schools: 'Connect teachers, students, and school staff in one organized workspace designed for modern classrooms.'; 'Teachers manage discussions, homework, and announcements in structured channels.'
- **`/solutions/universities`** (158 chars): Universities: 'Bring departments, courses, and student communities together in one structured learning workspace designed for higher education.'; 'Role-Based Permissions'; 'Secure Communication'.
- **`/resources`** (157 chars): Resources: 'Explore guides, insights, and tools to help universities, schools, and bootcamps run better learning communities.'; tabs Guides, Case studies, Templates, Webinars, Help center.
- **`/download`** (152 chars): Download: 'Download Zedu on iOS, Android, and desktop' equivalent (App Store / Google Play / Desktop); 'communication, file sharing, and scheduling'; 'Assignments & Updates'.

## Where to change it in zedu-fe

| Page | File and line |
|---|---|
| `/` | `src/app/(homepage)/page.tsx, lines 10-13` |
| `/pricing` | `src/app/(homepage)/pricing/page.tsx, lines 14-17` |
| `/about` | `src/app/(homepage)/about/page.tsx, lines 10-13` |
| `/products/channels` | `src/app/(homepage)/products/channels/page.tsx, lines 15-18` |
| `/products/buzz` | `src/app/(homepage)/products/buzz/page.tsx, lines 10-13` |
| `/products/file-management` | `src/app/(homepage)/products/file-management/page.tsx, lines 10-13` |
| `/solutions/bootcamps` | `src/app/(homepage)/solutions/bootcamps/page.tsx, lines 11-14` |
| `/solutions/schools` | `src/app/(homepage)/solutions/schools/page.tsx, lines 11-14` |
| `/solutions/universities` | `src/app/(homepage)/solutions/universities/page.tsx, lines 11-14` |
| `/resources` | `src/app/(homepage)/resources/page.tsx (client component, no metadata export); inherits src/app/(homepage)/layout.tsx lines 12-23` |
| `/download` | `src/app/(homepage)/download/page.tsx, lines 12-15` |

`/resources` needs more than a string edit: `src/app/(homepage)/resources/page.tsx` starts with `"use client"` and exports no `metadata`, so it inherits the whole `(homepage)/layout.tsx` metadata block, including `description` and `alternates.canonical: "/"`. Add a server `layout.tsx` beside it (or split the client component) that exports the metadata above and sets `alternates: { canonical: "/resources" }`.

## Verdict per page

- **Change required (10):** `/`, `/pricing`, `/about`, `/products/channels`, `/products/buzz`, `/products/file-management`, `/solutions/bootcamps`, `/solutions/schools`, `/solutions/universities`, `/resources`.
- **No change required (1):** `/download` is 142 characters, inside the usual snippet range. The 152-character version in the table is optional if the team wants every page inside a strict 150-160 window.
- **Not a defect:** no page is missing a description and no page uses its title as its description.

## How this was checked

- `audit/fetch_site.py` fetched every URL once, saved the raw HTML in `audit/raw/`, and parsed title, description, robots meta, canonical, headings and anchors with the Python standard library.
- `audit/make_meta.py` checks every replacement is 150-160 characters and records the on-page source sentence; it prints `OK` for all 11.
- Nothing on the live site was changed. This is a copy deck for the zedu-fe team.
