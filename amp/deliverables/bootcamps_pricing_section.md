# Pricing section for /solutions/bootcamps

**Checked live:** 24 Oct 2026, https://zedu.chat/pricing and https://zedu.chat/
**Where it goes:** between the "Run Leaner. Move Faster. Launch Better Cohorts." block and the closing "Power Your Next Bootcamp Cohort" CTA.
**Why it is needed:** /solutions/bootcamps mentions no price, no plan and no cohort limit today. The only route to /pricing is the top menu.

---

## 1. The section copy

### Run Your Next Cohort Without Limits

Start free with up to 3 cohorts. Move to Pro when your programme grows.

**No Per-Student Pricing** — you pay for the programme, not for each learner who joins.

| Starter — ₦0/month | Pro — ₦20K/month |
|---|---|
| Up to 3 cohorts | Unlimited cohorts |
| Organized learning channels | Live classes and collaboration tools |
| Basic messaging and threads | AI study assistants |
| File sharing | Assignment and cohort management |
| Basic notifications | Admin moderation tools |
| Limited AI assistance | |
| No credit card needed | |
| **[Start Free](https://zedu.chat/auth/sign-up)** | **[Start Pro Plan](https://zedu.chat/auth/sign-up)** |

**Need more than 3 cohorts?** Pro gives you unlimited cohorts for ₦20K a month, plus live classes, AI study assistants and admin moderation tools. [Start Pro Plan](https://zedu.chat/auth/sign-up)

Running a university or a large programme? [Contact Sales](https://zedu.chat/contact-sales) for Enterprise. No price is published for Enterprise.

---

## 2. Notes the team needs before publishing

1. **The free CTA label.** The brief asks for "Start Free"; /pricing's own card says "Get Started Free". I used "Start Free" as briefed, but matching the pricing page exactly ("Get Started Free") is the safer choice for consistency. Pick one and use it in both places.
2. **The Pro CTA target.** /pricing's "Start Pro Plan" points at `/client/settings/organisation/billing/all-plans`, which returns HTTP 200 but serves the app shell with no H1 to a logged-out visitor. I have therefore pointed both buttons in this section at `/auth/sign-up`, which is a real, public page. If the team wants the billing route, it needs a signed-out fallback first.
3. **Plan names.** The Pro card lists "Everything in Zedu Free, and" and the Enterprise card "Everything in Zedu Educator, and". No plan called Zedu Free or Zedu Educator exists on the page (the cards are Starter / Pro / Enterprise, while the comparison table header says Starter / Growth / Enterprise). I did **not** copy those two lines into this section. Fix the cards before a second page repeats them.
4. **Students per cohort.** The comparison table shows "Limited" on Starter, "Up to 500" on the Growth column and "Custom" on Enterprise. This section does not state a student number, because the marketing cards do not publish one. If the team wants "up to 500 students per cohort" on this page, confirm the limit is real and current first.

---

## 3. Source table

| Line in this section | Where it comes from, verbatim |
|---|---|
| Run Your Next Cohort Without Limits | Brief; echoes the page's existing "Power Your Next Bootcamp Cohort" |
| Start free with up to 3 cohorts | /pricing Starter card: "Up to 3 cohorts" |
| Move to Pro when your programme grows | /pricing Pro card: "Unlimited cohorts" |
| No Per-Student Pricing | Home page section heading, verbatim: "No Per-Student Pricing" (the brief's "No per-student fees" is not the live wording) |
| Starter — ₦0/month | /pricing Starter card: "₦0" and "/month" |
| Pro — ₦20K/month | /pricing Pro card: "₦20K" and "/month" |
| Up to 3 cohorts | /pricing Starter card |
| Unlimited cohorts | /pricing Pro card |
| Organized learning channels | /pricing Starter card |
| Basic messaging and threads | /pricing Starter card |
| File sharing | /pricing Starter card |
| Basic notifications | /pricing Starter card |
| Limited AI assistance | /pricing Starter card |
| No credit card needed | /pricing Starter card, verbatim |
| Live classes and collaboration tools | /pricing Pro card |
| AI study assistants | /pricing Pro card |
| Assignment and cohort management | /pricing Pro card |
| Admin moderation tools | /pricing Pro card |
| Need more than 3 cohorts? | Written for this section from the Starter limit ("Up to 3 cohorts") |
| Running a university or a large programme? | /pricing Enterprise card: "Flexible pricing for Universities, large programs, and institutions." |
| Contact Sales | /pricing Enterprise card, verbatim |

Nothing in this section quotes an Enterprise price, implies per-seat billing, or names an integration.
