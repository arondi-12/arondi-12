# Admin-time measurement handoff pack

**For:** the "Bootcamp Director's ROI Calculator" workstream, replacing assumed admin-time savings with a small, comparable before-and-after measurement protocol.
**Version:** 1.0, 22 Oct 2026. **Author:** Radar (research and audience insight), Zedu project.
**What this is:** one document a bootcamp operator and a Zedu staff member can run together. No new calculator, no software instrumentation.
**What this is not:** it contains no real operational data, collects nothing itself, and claims nothing about Zedu's effect. Every number below is synthetic and labelled as such.

---

## 0. The three rules that decide whether a result may be reported

1. **No baseline, no claim.** If a task category has no baseline window, its result is "not measured", never "improved".
2. **Minutes are capacity, money is money.** An hour of admin time freed is *staff capacity*. It becomes a *cash saving* only when a payment actually changes: an overtime line drops, a contractor invoice falls, a role is not filled. Otherwise it is reported as capacity, and the hourly rate is only used for a value clearly labelled hypothetical.
3. **Observed association, not proof of cause.** Two matched windows show a change that was observed alongside the process or tool change. Other things move too, which is what the concurrent-change register is for (section 6).

---

## 1. Definitions

**Task category.** A repeating administrative job with a clear start and end, recorded once per occurrence. The minimum set, chosen so totals map onto the calculator's inputs:

| Code | Task category | Unit of work | Why separate |
|---|---|---|---|
| T1 | Onboarding a new cohort (channels, invites, welcome, access fixes) | one cohort intake | Fixed cost per intake; not divided by students |
| T2 | Answering a learner question (any channel, including repeats) | one question answered | Scales with learner activity |
| T3 | Sharing or collecting an assignment (post, chase, collect, file) | one assignment round | Scales with assignment count |
| T4 | Setting up or hosting a live session | one session | Scales with sessions |
| T5 | Producing a status or progress report | one report | Fixed per reporting cycle |

**Unit of work.** The thing counted in the denominator. Never "per week": weekly volume changes between windows, and a busier week looks slower without anyone being slower.

**Comparable unit.** Same category, counted the same way, same definition of "one". A question answered by voice note and one answered in a thread are both one question. A question answered and reopened the same day is still one question.

**Window.** A fixed number of consecutive weeks with a stated start and end date. Two weeks minimum per window; one week only for T1 (a whole intake) and T5 (a whole report cycle).

**Denominator check.** Before any percentage: confirm numerator and denominator cover the same period and the same staff group. Minutes from three staff divided by questions handled by two staff is the most common error in this kind of measurement.

---

## 2. The aggregate time log (minimal, manual, voluntary)

One row per **staff member per task category per day**. No names, a role code only. No screenshots, no monitoring software, no learner records, no message contents. Voluntary, and anyone may skip a day without a reason.

Columns (ready-to-use CSV attached separately):

```
date, week_no, window (baseline|pilot), role_code (ADM1|ADM2|MEN1|OPS1),
task_code (T1..T5), unit_count, minutes_total, tool_used,
exception_flag (Y|N), exception_note (max 60 chars), logged_by_role
```

Rules for filling it:

- `unit_count` is units of work **completed** in that block, not attempted.
- `minutes_total` is a whole-minute estimate for the block, rounded to the nearest 5. Stopwatch precision is not the goal; consistency is.
- `tool_used` names where the work happened (WhatsApp group, Zedu channel, email, spreadsheet). It is what shows whether a change is really a tool change.
- `exception_flag` = Y for anything that made the day unusual: absence, outage, public holiday, bulk import, funder visit. The note says what, in a few words.
- One missed day is not a crisis. Section 5 says what to do with gaps.

**Effort for the team:** about three minutes per person per day, at the end of the day. If it takes longer, the log is too detailed and will be abandoned by week two. Cut a category rather than add a field.

---

## 3. Baseline and pilot windows

**Baseline window.** The last two full weeks *before* any change, at a stage of the programme that will recur. For a cohort tool that means weeks 1-2 of an intake, not the quiet weeks between intakes.

**Pilot window.** The same two weeks of the *next comparable intake*, after the change. Not "the next two weeks": the next two weeks at the same stage.

**Matching-window checklist.** All six must hold, or the comparison is reported as unmatched:

| # | Check | Pass condition | If it fails |
|---|---|---|---|
| 1 | Programme stage | Same stage in both windows (e.g. weeks 1-2 of an intake) | Move the window; do not compare |
| 2 | Cohort size | Within plus or minus 20% of baseline learners | Report per-unit numbers only, and say so |
| 3 | Staffing | Same number of admin staff, no long absence | Log it in the concurrent-change register; report raw and per-staff-hour figures |
| 4 | Calendar | No public holiday or exam week inside either window | Shift the window by a week |
| 5 | Product and process | No other tool or process change inside either window | Record it; comparison becomes "observed alongside both changes" |
| 6 | Task definitions | Same categories, same definition of one unit | Re-train the log before starting; never merge old and new definitions |

---

## 4. Calculation rules

For one category *c* in one window *w*: `U(c,w)` = sum of `unit_count`, `M(c,w)` = sum of `minutes_total`, and `m(c,w) = M(c,w) / U(c,w)` = minutes per unit.

**Per-unit change**

```
change(c) = (m(c,pilot) - m(c,baseline)) / m(c,baseline)
```

Report as a percentage with the sign kept. A rise is a rise.

**Capacity freed per week, per category**

```
hours_freed(c) = (M(c,baseline)/weeks(baseline) - M(c,pilot)/weeks(pilot)) / 60
```

**Total capacity freed:** sum `hours_freed(c)` over categories that passed the baseline check. A category with no baseline is listed as "not measured" and adds nothing.

**Hypothetical capacity value (never called a saving)**

```
capacity_value_month = hours_freed_total_per_week * 4.33 * hourly_rate
```

Label it exactly: *"capacity value at NGN X per hour: hypothetical, not a cash saving."*

**Cash actually removed**

```
cash_removed_month = change in money paid out that is attributable to the freed hours
```

That means an overtime line, a contractor invoice, or a role not filled. If nothing in the accounts changed, `cash_removed_month = 0`, and that zero is the honest headline.

**Sample-size floor.** A category is reportable only if the smaller window has at least 20 units (T2, T3, T4) or at least 2 complete units (T1, T5). Below that, report raw minutes and write "too few units to report a rate".

**Rounding.** Minutes per unit to one decimal. Round percentages once, at the point of writing, never mid-calculation.

---

## 5. Missing data

| Situation | Rule | What appears in the report |
|---|---|---|
| A whole day missing for one person | Leave it missing; do not impute | `completeness` figure for that window |
| A category with under 60% of expected days logged | Exclude it from totals | "T3 excluded: 11 of 20 expected days logged" |
| A window under 60% overall completeness | Call the window "indicative only", no percentage | Raw minutes only |
| Unit count known, minutes missing | Exclude the row; count units only where minutes also exist | Note dropped rows |
| A day flagged as an exception | Keep the row; run totals with and without exception days | Both figures, labelled |

**Completeness** = (days with at least one row) / (days in window x participating staff). Report it next to every result. A tidy 12% improvement on 41% completeness is not a result.

---

## 6. Concurrent-change register

One row for anything that changed during either window and could move admin time. This is the section that stops a good result being over-claimed.

```
date, window, what changed (staffing|process|tool|pricing|policy|season),
description (one line), expected direction (faster|slower|unclear), evidence link or note
```

Typical entries: an admin left and was not replaced; intake size doubled; a new assignment template was introduced; group rules changed; a public holiday fell in week two.

If two or more material changes land in the same window, the report says the change **cannot be separated** from them, and no single-cause claim is made.

---

## 7. Worked synthetic example (hypothetical numbers, no real data)

**Story:** a bootcamp with one intake per quarter, two admin staff (ADM1, ADM2) and one mentor (MEN1). Baseline: weeks 1-2 of the January intake. Pilot: weeks 1-2 of the April intake, after moving cohort admin into Zedu channels. Cohort size 40 in both windows, same staff, no public holiday, no other process change.

| Category | Baseline units | Baseline minutes | Pilot units | Pilot minutes |
|---|---|---|---|---|
| T1 Onboarding a cohort | 1 | 900 | 1 | 720 |
| T2 Learner questions | 240 | 600 | 260 | 520 |
| T3 Assignment rounds | 8 | 240 | 8 | 210 |
| T4 Live sessions | 10 | 150 | 10 | 140 |
| T5 Status reports | 2 | 120 | 2 | 100 |
| **Total** | | **2,010** | | **1,690** |

**Step 1 - per-unit rates**

- T2: 600/240 = 2.5 min; 520/260 = 2.0 min; change = (2.0-2.5)/2.5 = **-20.0%**
- T3: 240/8 = 30.0 min; 210/8 = 26.25 min; **-12.5%**
- T4: 150/10 = 15.0 min; 140/10 = 14.0 min; **-6.7%**
- T1: 900/1 = 900 min; 720/1 = 720 min; **-20.0%** (2 units across windows, meets the T1 floor of 2)
- T5: 120/2 = 60.0 min; 100/2 = 50.0 min; **-16.7%**

**Step 2 - capacity freed per week** (both windows are two weeks)

```
T2: (600/2 - 520/2)/60 = (300 - 260)/60 = 0.67 h/week
T3: (240/2 - 210/2)/60 = (120 - 105)/60 = 0.25 h/week
T4: (150/2 - 140/2)/60 = ( 75 -  70)/60 = 0.08 h/week
T1: (900/2 - 720/2)/60 = (450 - 360)/60 = 1.50 h/week
T5: (120/2 - 100/2)/60 = ( 60 -  50)/60 = 0.17 h/week
Total = 2.67 h/week
```

**Step 3 - denominator check.** Cohort sizes match (40 vs 40). Same three staff. Assignment rounds and live sessions are equal in both windows, so T3 and T4 rates sit on equal denominators. Question volume rose 8%, which is why T2 is reported per question and not per week: a weekly total would have shown a smaller change for the wrong reason.

**Step 4 - completeness.** Baseline 20 of 20 person-days (100%). Pilot 18 of 20 (90%). Both above 60%, so percentages are reportable.

**Step 5 - what is reported to the director**

- Capacity freed: **2.67 hours per week** (90 of those minutes from onboarding, the rest spread thin).
- At a hypothetical NGN 3,000/hour staff rate: 2.67 x 4.33 x 3,000 = 34,683, written as **about NGN 34,700 per month capacity value. Hypothetical, not a cash saving.**
- Cash removed from the accounts this quarter: **NGN 0**. No overtime was cut and no role changed.
- The wording used: *"Across two matched two-week windows, admin time per learner question fell from 2.5 to 2.0 minutes (20%), observed alongside the move to Zedu channels. No other material change landed in the same period, and this is an association, not proof that the tool caused it."*

**Step 6 - how the numbers feed the existing calculator**

| Calculator input | Baseline | Pilot | Source in this pack |
|---|---|---|---|
| Minutes per learner question | 2.5 | 2.0 | section 7, step 1 |
| Admin hours per week, per cohort | 16.75 | 14.08 | 2,010/2/60 and 1,690/2/60 |
| Assignment rounds per week | 4 | 4 | log totals |
| Live sessions per week | 5 | 5 | log totals |
| Staff hourly cost | operator-supplied | operator-supplied | used only for capacity value |
| Cash removed per month | 0 | 0 | section 7, step 5 |

The calculator may accept the pilot rates as an **observed** input only after the operator has run a baseline of their own. Until then the field stays blank, or shows the default assumption marked as an assumption.

---

## 8. Zero and negative results

| Result | How it is written | What must not happen |
|---|---|---|
| Change = 0% | "No measured change (T2: 2.5 to 2.5 min, n=238 vs n=241)" | Do not report "no regression" as a win |
| Slower | "Slower: 2.4 to 2.9 min (+21%), n=180 vs n=95", with the concurrent-change register quoted | Do not bury it, and do not switch to weekly totals to hide it |
| Negative but tiny | Report the number and the unit counts; say it is within noise if the count is under the floor | Do not round -2% into "up to 20% faster" |
| Baseline missing entirely | "Not measured: no baseline window" | Do not substitute a competitor figure, an industry average, or the 40%/50% claims on the site |
| Windows unmatched | Report both windows separately, no percentage | Do not compute a change and then footnote the mismatch |

---

## 9. Permissions and limits (read before the first log)

- Written permission from the director and from each participating staff member, with the purpose stated: improving a process, not assessing people.
- No individual performance use. Logs are aggregated to role level before anyone outside the team sees them; a row is never used in a performance review.
- No learner records, no message content, no names of learners or parents, no screenshots of conversations.
- No monitoring or time-tracking software, no browser extension, no keystroke logging. Manual, voluntary, aggregate.
- No customer contact, no recruitment, no publication as part of this pack. Any published case study needs separate written consent and a separate review.
- Raw logs stay with the bootcamp; the analyst sees aggregates only, and the retention date is agreed in writing at the start.

---

## 10. Reviewer checklist

1. Open the log template. Confirm it has no field for a person's name, a learner identifier or message content.
2. Recompute T2 by hand from section 7: 600/240 = 2.5; 520/260 = 2.0; (2.0-2.5)/2.5 = -20%. The other four categories should match to one decimal.
3. Try to make the pack produce an improvement with no baseline. It should be impossible: the per-unit change divides by the baseline rate, and section 5 excludes any category without a baseline from the totals.
4. Search the document for "saving". The only permitted use is `cash_removed_month`, which is 0 in the example.
5. Confirm every rule names the operator's decision, not Zedu's assumption: hourly rate, plan price and cohort size are all supplied by the operator.
6. Confirm the matching checklist is a gate, not advice: a failed check changes what may be reported.

---

## 11. What this pack deliberately leaves out

- No telemetry from the app: Zedu's own logs would measure Zedu's actions, not the operator's admin time.
- No staff monitoring: the moment the log becomes surveillance, the numbers stop being true.
- No money figure for time. The calculator may show a hypothetical value, but the pack keeps it separate from cash.
- No claim about Zedu's effect. That needs longer windows, more than one bootcamp, and a comparison group this protocol does not have.
