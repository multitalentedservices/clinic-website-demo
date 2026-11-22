VISUAL QUALITY SCORECARD — VERDICT
Build: Sehat Family Clinic (Demo) — Clinic Website + Appointments, Portfolio Queue #5  (client-facing owner: BalanceBit Solutions · production: MTS)
Build type / builder (AICOS-105–111): AICOS-109 (Clinic & Healthcare Website Builds), with AICOS-107 — executed by builder worker
Preview URL: none (not deployed — local file:// preview only)   Date of pass: 2026-11-21
Scored by: AICOS-115   Pass #: 1

 1. Visual identity & originality   13 / 15   Evidence: BUILD-NOTES.md design record (own "Clean Local" system — white/petrol #0E5A6D, Libre Franklin + Atkinson Hyperlegible; references PillPack + Good Neighbor Pharmacy from the library, Mayo Clinic + One Medical from fresh 2026-11-21 research); screenshots/index-desktop.png + index-phone.png match the record — a calm clinical system that could not belong to another industry and is visually unrelated to Gift Basket, Restaurant, MTS Core and Salon. Missing: AICOS-112 formal §0 sign-off.
 2. UI/UX & usability               14 / 15   Evidence: flow captures — flow-services-filtered-dental.png ("3 services"), flow-booking-step1-error.png, flow-booking-step2-doctors.png (coverage-filtered: Omar + First available), flow-booking-offday-error.png (doctor off-day rejected by name), flow-booking-step3-slots.png (taken slots struck), flow-booking-step4-phone-error.png (flow log proves the error cleared LIVE on fix), flow-booking-step5-review.png, flow-booking-confirmation.png; ONE conversion goal (a booked appointment) completed end-to-end without assistance, ref SF-DEMO-5598 at PKR 3,500 exact.
 3. Typography & composition        10 / 10   Evidence: screenshots/services-phone.png + doctors-phone.png (display names, PKR fees, durations legible at phone width), index-desktop.png hierarchy; pairing exactly as specified in BUILD-NOTES.md — Atkinson Hyperlegible body chosen for this brief's accessibility mandate.
 4. Animation & interactions        9 / 10   Evidence: reveal-on-scroll with rootMargin pre-reveal + opacity-settle wait — 0 hidden in every audit; Ken Burns hero observed in captures; REDUCED-MOTION RUN FILED (screenshots/reduced/ — 6 pages × 3 viewports, 0 overflow / 0 text-overflow / 0 hidden, motion disabled, content instant-visible). Remaining: no CLS measurement exists without a served preview.
 5. Responsive design               10 / 10   Evidence: screenshots/audit.json — 18 page×viewport combos (390×844 / 768×1024 / 1440×900): 0 overflow, 0 leaf text-overflow, 0 hidden, 0 broken images; screenshots/probe320/audit.json — 6 pages at 320px: 0 findings; screenshots/nojs/ run (6 pages × 3 viewports): content fully visible with JS disabled. All phone pages + desktop home read by eye; doctor portraits verified uncropped (tall anchored variant, lesson 22).
 6. Functionality                   15 / 15   Evidence: tests.js + tests-output.log — 60/60 PASS (data integrity, filter, doctor coverage, slot generation incl. Sunday closure + off-days + past-date rejection, patient/lead validation, fee formatting, GA4 locality, link integrity across 6 pages); flow run: full appointment completed (Dental Examination & Cleaning, Dr Omar Farooq, PKR 3,500 exact), persisted to localStorage and listed under My Appointments (flow-my-appointments.png); INTEGRATION FIRING RECORDED (lesson 21) — GA4-stub log after the run contains pageview + appointment_complete + lead_submit, and the lead form's submit wrote its localStorage demo log entry (flow-log.txt, flow-lead-success.png); Maps is a link by design (no iframe).
 7. Performance                     5 / 10   Evidence: weights measured — code 87 KB (< 400 KB), media 684 KB total, max image 94 KB (tests-output.log). Missing: served-preview Lighthouse / field Core Web Vitals (LCP/INP/CLS) — the build is not deployed, so no CWV numbers exist; not estimated.
 8. Accessibility                   5 / 5   Evidence: WCAG AA IS THIS BRIEF'S MANDATORY BAR AND IS PROVED, not asserted — 13 contrast assertions computed from the token hex values in tests.js, all PASS (body text 13.71:1, muted 7.39:1, buttons 7.77:1, error red 6.54:1, focus outline 7.77:1 vs the 3:1 non-text bar); KEYBOARD-WALK RECORD FILED (screenshots/keyboard-walk.md — 20 Tab stops across Booking + Home, visible 3px focus at every stop incl. the pick-card HOST outline via :focus-within, lesson 20; keyboard-focus-booking.png + keyboard-focus-home.png); semantic landmarks, skip link, aria-current/pressed/live regions, ≥44px touch targets (chips 46px, slots 48px, buttons 52px), 16px form fonts, alt text on all images.
 9. SEO                             5 / 5   Evidence: unique title + meta description per page (test-verified), MedicalClinic JSON-LD on index, sitemap.xml (6 pages) + robots.txt present, internal linking across all 6 pages (all refs resolve, tests-output.log).
10. Security                        4 / 5   Evidence: zero third-party packages/CDN libraries (Google Fonts only), no secrets or credentials in source, no backend — booking and lead forms write only to the visitor's own localStorage; the GA4 stub transmits nothing (source-asserted). HTTPS enforcement is a hosting property and the build is not deployed.

TOTAL: 90 / 100   (target ≥ 90)

BLOCKING FAILURES (security / data integrity / functionality):
- None. The ONE conversion goal (appointment → demo confirmation SF-DEMO-5598 + localStorage record) completes; the lead form and GA4 stub fire and log locally; no security or data-integrity findings; no promissory medical claims anywhere (test-asserted).

UNTESTED AREAS (score invalid without evidence):
- None scored as untested. Areas 1 and 7 carry named partial evidence (see above) and were scored down for it rather than marked untested — the same convention as Queue #2 (81), #3 (84), #1 (89) and #4 (90).

VERDICT:  [ ] APPROVE   [X] REJECT   [ ] REJECT — BLOCKED   [ ] REJECT — INCOMPLETE
Reasons (defects as: what is wrong · where · what fixed looks like):
- The ladder's evidence bar, not the §4 table alone, governs this queue's verdicts: every predecessor was REJECTED with the same two evidence items outstanding, and both are still outstanding here, so an APPROVE at exactly 90 would claim a standard the evidence does not yet carry. The build itself has no outstanding code defects.
- Missing evidence 1: served-preview Lighthouse/CWV · Area 7 (5 points held) · fixed by deploying a preview (Gate 7, Asad's decision) and filing a measured Lighthouse report.
- Missing evidence 2: AICOS-112 formal §0 sign-off · Area 1 (2 points held) · fixed by the design owner's recorded sign-off against BUILD-NOTES.md.
- Ladder note: this pass is the first to PROVE its brief's headline requirement in the battery — WCAG AA as 13 computed contrast assertions — and it matches Salon's 90 with the same two external evidence items outstanding. From Queue #6 on, 90 remains the local floor; the remaining points live at Gate 7.

Next step: [ ] To AICOS-025 release gate   [X] Back to Gate 5 (evidence completions only — both are external to the build)   [ ] Back to Gate 2

Disclosures: (1) the screenshot harness was fixed mid-pass for the no-JS run (settle helper skipped when page JS is disabled by design) and the run re-executed clean; (2) a dead unused line was removed from tests.js before its first successful run. No assertion was amended. Both are repeated in BUILD-NOTES.md, not hidden.

---

## Addendum — Re-verification FIX RUN (2026-11-21, later the same day)

Independent re-verification (`Reverification-2026-11-21/REPORT.md`) found 1 visible defect.
FIXED, re-shot and read; battery **60/60 PASS** unamended after fixes:

- **C-1 (visible) — no mobile menu: the desktop nav wrapped into 3 rows + the Book now CTA on
  a 4th row at 390px, and the CTA still wrapped at 768px.** Fix: a proper hamburger in the
  clinic's own system — a pill outline "Menu" toggle (the site's button geometry and tokens)
  at ≤768px on all 6 pages; the nav collapses behind it as a full-width in-container panel
  (aria-expanded, closes on link tap / Escape); "Book now" stays visible in the header action
  row at every width. Proof: DOM probe at 768 + 390 (closed: nav display none, header a single
  74px row at 768; open: panel block, expanded=true, 6 links) and captures read by eye —
  `fix-clinic/index-phone.png` (tidy logo row + action row) and
  `fix-clinic/index-state-menu-phone.png` (open panel, current page highlighted).
- **Same-family audit fixes (no defect was filed against this site):** reveal opacity-gating
  removed (v3 pattern — position-only rise, opacity never gated) and all content imagery made
  eager (3 page heroes + the doctor-card template in `js/render.js`), so no photo can freeze
  blank at any scroll speed. Re-shoot: 24 page×viewport combos, 0 blank / 0 overflow.

**Score: unchanged at 90/100 — REJECT (evidence bar only).** Held points remain the
served-preview CWV (Area 7) and the AICOS-112 §0 sign-off (Area 1).

---

## Addendum — PREMIUM UPGRADE (2026-11-22, ladder site #5)

Deliberately RESTRAINED premium, per plan §5 — this site remains the accessibility exemplar.

- **Animated numbers block** (index): count-up figures 12 / 4 / 4 / 6 — counted ONLY from this site's own demo data (12 services, 4 departments, 4 doctors, 6 open days Mon–Sat in `js/data.js`); the HTML carries the final figures, so no-JS/reduced-motion read the completed block. New-element contrast measured in the premium checks: stat numeral and label both ≥4.5:1 (accent-dark/ink-2 on white).
- **Services slider** (services.html): Swiper 14.4.0, all 12 services as static HTML slides in the site's own card system (name/desc/duration/fee generated from `js/data.js` — identical to the filter grid below, which is untouched). Keyboard-operable (verified: focus Next + Enter advances; 3px focus outline), no autoplay; reduced-motion/no-JS = the slides render as a complete static grid.
- **Hero motion** (index): ONE signature moment — a GSAP ScrollTrigger-scrubbed photo sequence crossfading the hero through the site's existing consultation/treatment photos (no video; frames 2–3 are aria-hidden decorative duplicates; reduced-motion/no-JS = first photo, complete).
- **New technique:** count-up + scrubbed sequence under the hard AA gate — battery's 13 contrast assertions still pass, keyboard walk unaffected, reduced-motion static state re-proven in the premium checks.
- **Deviations (honest):** (1) **No Lenis on this site** — smooth-scroll was dropped by design for the AA exemplar AND because the unamended battery's recursive 400 KB code-weight gate measured 403 KB with Lenis vendored (a real FAIL); without it: 384 KB, battery green. P2 therefore recorded as a deliberate deviation, not a pass. (2) P4 stays restrained (existing display scale kept — clinical restraint is the design).
- **Batteries:** `tests.js` UNAMENDED **60/60 PASS** before and after. Separate `premium-checks.js` run (filed as `premium-checks-output.log`): 49 PASS; the 14 "console" flags are one repeated sandbox artifact — the pre-existing Google Fonts stylesheet failing with ERR_TUNNEL_CONNECTION_FAILED in this offline browser (untouched pages flag identically); a follow-up probe recorded **0 page errors and 0 JS console errors** on every upgraded page. P1 re-probe: 0 blue / 0 underlined links on every page × viewport.
- **JS weights (gzip, total per page):** index (hero) **52.8 KB** ≤90 ✓ · services (slider) **50.2 KB** ≤90 ✓ · all other pages **6.4 KB** ≤20 ✓.
- **Screenshots:** full set re-shot via the project's own `shoot.js` (18 combos, 0 problem combos) + `screenshots/signature-moment.png` (mid-scrub crossfade + numbers block, read by eye — clean).

**Re-score: Area 4 (Animation & interactions) 9 → 10** (signature scrub scene + count-up + slider, all with proven static states). All other areas unchanged — Area 7 still holds 5 points for the unmeasured served-preview CWV.
**TOTAL: 90 → 91 / 100 — VERDICT UNCHANGED: REJECT (evidence bar only)** — the same two external items remain outstanding (served-preview Lighthouse/CWV; AICOS-112 §0 sign-off). No code defects outstanding.
