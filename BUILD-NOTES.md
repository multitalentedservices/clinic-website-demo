# Build Notes — Sehat Family Clinic (Demo) — Portfolio Queue #5

**Built:** 2026-11-21 · **Builders:** AICOS-109 (Clinic & Healthcare Website Builds), with AICOS-107 · AICOS-112 (design system) · AICOS-115 (QA)
**Queue position:** #5, after Gift Basket #2 (81), Restaurant #3 (84), MTS flagship #1 rebuild (89), Salon #4 (90) — this build had to match or beat 90 and prove WCAG AA, this brief's mandatory bar, with computed evidence.
**Stack:** hand-coded HTML/CSS/vanilla JS, zero third-party packages/CDN libraries except Google Fonts. No build step. All files strictly inside this project's folder.

## Design record (Gate 2)

**Identity — "Clean Local": calm, clinical, accessible-first.** A white ground, deep petrol ink and one calm clinical accent; generous spacing, plain language, fees and doctor days printed before any booking ask. The layout could not belong to another industry: departments → named practitioners with working days → a five-step appointment engine whose calendar obeys those days. Distinct from Gift Basket (cream/emerald/terracotta), Restaurant (ink/parchment/brick, Fraunces), MTS Core (black/lime, Archivo) and Salon (porcelain/blush/bronze, Cormorant Garamond).

**References researched (2026-11-21):**
1. **PillPack** (Design Inspiration Library P1, opened 2026-11-21) — a complicated health service reduced to scannable benefits with trust signals doing the heavy lifting. Taken: benefit-led clarity, one obvious CTA. Not copied: assets, layout.
2. **Good Neighbor Pharmacy** (library P2, opened 2026-11-21) — the *local* store as hero. Taken: local-first framing ("close to home", visit panel prominent). Not copied: assets, layout.
3. **Mayo Clinic** (fresh web research 2026-11-21, via Toimi/SliderRevolution healthcare design reviews) — the benchmark for content discipline and accessibility rigour on a content-heavy health site. Taken: plain-language information architecture, calm white space for anxious readers.
4. **One Medical** (same fresh research) — the gold standard for accessibility-annotated consumer primary-care design. Taken: AA treated as a brand signal, proved in the token table and the test battery rather than asserted on a policy page.

**Tokens + WCAG AA contrast table (computed from hex; asserted in tests.js — all PASS):**
- `--bg #FFFFFF` · `--surface #F2F7F7` · `--tint #E6F0F1` · `--tint-2 #DCEBEC` · `--line #C4D8DB` (borders only, non-text)
- `--ink #14313B` · `--ink-2 #1D4350` · `--muted #3D5A63` · `--accent #0E5A6D` · `--accent-dark #0A4351` · `--error #B3261E` (semantic error red — the ONLY extra hue, ladder rule 4; itself AA at 6.54:1 on white)

| Pairing | Ratio | Bar |
|---|---|---|
| Ink #14313B on white | 13.71:1 | ≥4.5 ✓ |
| Ink on surface #F2F7F7 | 12.68:1 | ≥4.5 ✓ |
| Muted #3D5A63 on white | 7.39:1 | ≥4.5 ✓ |
| Muted on surface | 6.84:1 | ≥4.5 ✓ |
| White on accent #0E5A6D (buttons) | 7.77:1 | ≥4.5 ✓ |
| Accent-dark #0A4351 on white (links) | 10.86:1 | ≥4.5 ✓ |
| Accent-dark on tint (badges) | 9.36:1 | ≥4.5 ✓ |
| Error #B3261E on white | 6.54:1 | ≥4.5 ✓ |
| Footer note #DCEBEC on ink | 11.18:1 | ≥4.5 ✓ |
| Accent focus outline on white (non-text) | 7.77:1 | ≥3.0 ✓ |

**Type pairing:** Libre Franklin (600/700/800) display + **Atkinson Hyperlegible** body — a typeface designed for low-vision readers, chosen deliberately for this brief. Body 18px desktop / 17px phone; form fields 16px (iOS zoom guard).
**Components:** buttons 52px (46px small), chips 46px, slots 48px, nav links ≥44px — all touch targets ≥44px. Focus: 3px accent outline + offset everywhere; pick cards use `:focus-within` on the card HOST (lesson 20).

**The clinic (fictional):** Sehat Family Clinic, 14-B Main Boulevard, Model Town, Gujranwala (demo address). Open Mon–Sat 09:00–20:00, closed Sundays — modelled in the booking logic. All practitioners, credentials, fees and availability are fictional demo data; all health copy is generic and non-promissory (a test asserts no cure/guarantee language in data or source).

**ONE conversion goal:** a booked appointment (engine → demo confirmation with reference). Secondary: the general-enquiry lead form.
**Pages (6):** `index.html` · `services.html` (12 services from data, department filter) · `doctors.html` (4 practitioners from data, tall anchored portraits — lesson 22) · `booking.html` (engine + My Appointments) · `info.html` (patient info + FAQ from data) · `visit.html` (styled Maps panel + link, hours, lead form).

**Video position (plain, per owner rule): video: none — photo + CSS motion.** Video generation is region-blocked (403) — not attempted. Hero uses a real photograph with subtle Ken Burns CSS motion, disabled under reduced motion.

## Features — all working client-side, demo data only
Pure logic in `js/logic.js` shared by site + Node battery (lesson 13); data in `js/data.js`; DOM in `js/render.js`, `js/main.js`, `js/booking.js`, `js/forms.js`; GA4 stub in `js/analytics.js`.
- **Services:** 12 rendered from data (4 departments × 3; description, duration, PKR fee); department chips actually filter (flow-proven: Dental → "3 services").
- **Practitioners:** 4 rendered from data (speciality, fictional-demo qualifications, working days); deep links preselect doctor/service in booking; booking step 2 offers only the practitioners covering the chosen service, plus "First available" (flow-proven: Dental → exactly Omar + First available).
- **Appointment engine (clinic skin):** service → practitioner → date + slot → patient name/phone (+ optional note) → review → confirm. Date validation rejects past dates, closed Sundays and the chosen doctor's off-days **by name** (flow-proven: "Dr Omar Farooq is not available on Mondays…"). Slots: 11 generated from 09:00–19:00 clinic hours; deterministic taken slots disabled/struck; today's elapsed slots marked past. Per-step validation; errors clear LIVE (flow-proven: bad phone error → corrected → error text empty). Confirmation `SF-DEMO-5598` (Dental Examination & Cleaning, Dr Omar Farooq, PKR 3,500 exact) states plainly that no real appointment is booked; booking persists to localStorage (`sehat_appointments`) and lists under My Appointments.
- **Lead form (visit page):** name/phone/message with the same validation standard; submit appends to localStorage demo log (`sehat_lead_log`) and shows an honest demo success state — **FIRING RECORDED** in the flow run (log entry + screenshot).
- **GA4 — LOCAL STUB ONLY:** `SehatAnalytics.track()` with clearly-marked DEMO placeholder ID `G-DEMO-PLACEHOLDER`, recording pageview / appointment_complete / lead_submit to the local log + console. **Nothing transmits to Google** — the battery asserts no live google-analytics/googletagmanager endpoints anywhere in source. Flow run recorded the firing: GA4 log = pageview, appointment_complete, lead_submit.
- **Google Maps:** styled visit panel + "Open in Google Maps" link (NO live iframe).
- **DEMO labelling:** ribbon on every page, footer demo note on every page, demo wording in every success state.

## Ladder mechanics (lessons 1–22, all applied)
Reveal-by-default + IO rootMargin pre-reveal + 2s fallback + reduced-motion instant (2+11); pure-logic split (13); one component system (5); palette discipline incl. AA error red (4); `min-width:0` on grid children (6); no inline-style grid rows (6 — two layout-only inline margins exist, no grid rows); row+column pinning — no lone-axis placed children (15); leaf-text overflow audit in the harness (14); specificity verified via state evidence (16); complete-repo/assets rule + nothing-mixes (17+18); video honesty (19); focus HOST for hidden inputs, recorded in the keyboard walk (20); integration FIRING recorded, not just construction (21); portrait `.card-img.tall` top-anchored variant (22). Weights: code 87 KB < 400 KB; media 684 KB ≤ 1.6 MB, largest image 94 KB ≤ ~120 KB (10).

## Media
8 generated photographs in ONE consistent calm clinical style (bright white + deep petrol interiors, no text in any image), 684 KB total, largest 94 KB:
`assets/hero.jpg` · `assets/reception.jpg` · `assets/consultation.jpg` · `assets/treatment.jpg` · `assets/doctor-amina.jpg` · `assets/doctor-bilal.jpg` · `assets/doctor-omar.jpg` · `assets/doctor-sana.jpg` (+ `assets/favicon.svg`, vector, pushed with code).
**Repo note (owner rule):** the connector push carries text files only, so the 8 photographs are PENDING WEB-UPLOAD; repo status is "code pushed — images pending web-upload", not complete. Video: none — photo + CSS motion.

## QA summary
- Tests: `tests.js` → **60 PASS / 0 FAIL** (`tests-output.log`): data integrity, filter, doctor coverage, slot generation (clinic hours, deterministic taken mix, past-date + closed-Sunday + off-day rejection, elapsed slots), patient/lead validation, fee formatting, refs, **13 contrast assertions computed from hex**, GA4 locality, link integrity across all 6 pages, SEO artefacts, weights.
- Screenshots (`screenshots/`): 6 pages × 390/768/1440 (18) + 320px probe (6) + JS-disabled run (18) + reduced-motion run (18) — final audits: **0 overflow, 0 leaf text-overflow, 0 hidden reveals, 0 broken images** in every run (`audit.json` per folder). Phone + desktop pages read by eye; portraits verified uncropped; palette disciplined.
- Flow captures (`screenshots/flow-*.png` + `flow-log.txt`): services filtered to Dental, step-1 error, step-2 doctor coverage, off-day (Monday) rejection, slot picker with taken slots, step-4 phone error + live clear, review, confirmation SF-DEMO-5598, My Appointments, lead-form success — with localStorage firing records for appointments, lead log and the GA4 stub.
- Keyboard walk: `screenshots/keyboard-walk.md` — 20 Tab stops across Booking + Home, visible 3px focus at every stop incl. the pick-card HOST outline at the service radio stop (lesson 20); `keyboard-focus-booking.png` / `keyboard-focus-home.png`.

**Disclosures:** (1) The no-JS screenshot run initially crashed the harness's settle helper (it evaluates page JS that is disabled by design in that run); the harness was fixed to skip scroll-settle under `--nojs` and the run re-executed clean — a harness fix, not a site or assertion change. (2) A dead leftover line in tests.js (an unused weight subtotal referencing shoot.js) was removed before the battery's first successful run; no assertion was amended. Both disclosed here, never silent (lesson 9).
