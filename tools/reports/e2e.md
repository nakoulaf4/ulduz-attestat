# Ulduz — E2E, Accessibility, Localization & Visual Verification Report

**Target:** `http://127.0.0.1:8123/` (`site/`)
**Date:** 2026-11-21
**Status:** **REDESIGN VERIFIED — ALL CHECKS PASS (21/21 E2E, 115,000/115,000 Self-Test, 0 `impeccable detect` Primary Warnings)**

---

## 1. Content & Exam Self-Test (`node tools/selftest.mjs --count 1000 --exams 20`)

| Subject | Task Types | Valid / Generated | Uniqueness | Exam Sim (20× each) | Originals | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **math** | 53 | 53,000 / 53,000 | 67.4% | 25 tasks (32 pts) | 50 | **PASS** |
| **ru** | 14 | 14,000 / 14,000 | 92.1% | 30 tasks (40 pts) | 60 | **PASS** |
| **en** | 37 | 37,000 / 37,000 | 71.3% | 30 tasks (37 pts) | 60 | **PASS** |
| **az** | 11 | 11,000 / 11,000 | 85.5% | 30 tasks (40 pts) | 60 | **PASS** |
| **Total** | **115** | **115,000 / 115,000** | — | **80 / 80 exams** | **230 / 230** | **PASS** |

---

## 2. `impeccable detect` Static & Live Browser Audits

Routes scanned live: `#/`, `#/subject/math`, `#/practice/math`, `#/practice/ru`, `#/exam/math`, `#/originals/math`, `#/mistakes`, `#/stats`.

- **Desktop `1280×800` live scan:** `[]` — **0 findings (`EXIT=0`)**.
- **Mobile `390×844` live scan:** **0 primary warnings (`EXIT=0`)**. Zero `side-tab`, zero `nested-cards` warnings (sticky mobile `.task-card__footer` fixed cleanly), zero `skipped-heading`, zero `low-contrast`, zero `straggler`. *(Only 3 non-blocking `severity: "advisory"` notes: `figure.task-figure` diagram frame and mobile `flat-type-hierarchy`.)*
- **Static `site/` scan:** Zero `side-tab`, zero `nested-cards`, zero `skipped-heading`, zero `low-contrast`, zero `straggler`. *(Only vendored `Inter` font declarations in `site/vendor/fonts/fonts.css`, documented as intentional local font stack in `docs/design-audit.md`.)*

---

## 3. Playwright Headless Chrome E2E Suite (`node tools/e2e.mjs`)

**Result:** **21 / 21 PASSED, 0 FAILED** (`tools/reports/e2e-results.json`).

### Runtime Cleanliness
- **0** console errors, **0** uncaught `pageerror`s, **0** failed HTTP requests across the full run.

### P0 Functional & Trust Fixes (#1–#6)
1. **#1 Phantom Option A Selection & Distractor Strike-Through:** Option A loads with `aria-checked="false"` and no `.is-selected`; Check button starts disabled. Both button click (`.option-elim-btn`) and right-click (`contextmenu`) toggle `.is-eliminated`; picking the eliminated option restores and selects it with focus preserved.
2. **#2 `Enter` inside `.short-input`:** Pressing `Enter` checks the answer and stays on `№1` with `.explanation-card` visible (does not skip). Clear button (`[data-action="clear-short"]`) stays `display: none` when empty.
3. **#3 Global `Enter` Guard:** Pressing `Enter` on focused `<button>` (Bookmark, Hint) and `<a>` (breadcrumb Home) activates the control natively instead of submitting the task.
4. **#4 `shortEquals()` Comma-Decimal Lists:** Direct contract unit tests verified `7/7` cases: `'1,5; 2,5'` == `'1.5; 2.5'`, `'2, 3'` == `'2; 3'`, `'0,5'` == `'1/2'`, `'1,2,3'` == `'1; 2; 3'`, `'1,5'` == `'1.5'`, and rejects `'1,5; 3,5'` and partial `'1,5'`.
5. **#5 Exam Open-Task Pending Self-Grade & Sync:** Drafted open task without `self` renders `.pending-grade-banner` and `.review-badge--pending` on Results; untouched skipped tasks (28 of 30) do **not** flood `st.mistakes` (only the 1 wrong MCQ was recorded); jumping via `[data-action="jump-ungraded-open"]` and self-grading (`2` pts, then `0` pts) live-syncs Results `scaledScore`, `st.exams[0]`, `st.stats.totalCorrect`, `st.mistakes`, and `#header-mistakes-badge`.
6. **#6 Active Exam Guard, Accurate Count, Cross-Subject Warning & Undo Toasts:** Active-exam banner accurately counts `1 из 25` (ignoring cleared `""` short input); visiting `#/exam/ru` with active `math` exam displays the cross-subject conflict banner; Home discard requires 2-step inline confirmation (Cancel preserves session, Confirm clears); deleting a mistake or bookmark shows a 5s Undo toast that restores the item and syncs the header badge.

### P1 UX, Layout, Accessibility & Localization (#7–#11)
7. **#7 Full `RU / AZ` Localization:** Toggling `#btn-lang-toggle` syncs `<html lang="az">` and `document.title` (`"Ulduz — DİM Buraxılış İmtahanı Trenajoru (Attestat)"`), with zero leaked Russian UI chrome across all 7 routes (`#/`, `#/subject/math`, `#/practice/math`, `#/exam/math`, `#/originals/math`, `#/mistakes`, `#/stats`), and cleanly toggles back to `ru`.
8. **#8 Live Header Mistakes Badge:** `#header-mistakes-badge` exists hidden at `0`, live-updates to `1` then `2` immediately on wrong answers without page reload, and syncs on Undo/self-grade.
9. **#9 Focus Preservation, Keyboard & WCAG AA Contrast:**
   - Focus preserved across single pick, eliminate, hint toggle, `order` up/down & click-to-swap, `match` direct right-click pairing, and `Escape` dismissal of `.exam-drawer` & `.confirm-banner`.
   - Option `<kbd>` hints hide automatically after Check.
   - Measured WCAG AA contrast ratios (all ≥ 4.5:1):
     - **Light:** `--text-muted` on canvas `5.88:1`, on surface `6.36:1`, `.short-input::placeholder` `5.88:1`, `.skip-link` `6.70:1`.
     - **Dark:** `--text-muted` on canvas `6.85:1`, on surface `6.20:1`, `.short-input::placeholder` `6.85:1`, `.skip-link` `7.32:1`.
10. **#10 Calm Workspace, Exam Mode, Originals & 230-Task Render Audit:**
    - Practice collapsible filter bar starts collapsed and auto-syncs `Тема` (`Стереометрия`) on `?type=math.cone-rotation`.
    - Context-smart char bar: math helpers (`− , / ;`, zero AZ letters) on Math; omitted on plain English short answers.
    - Open rubric steps: integer `0 / 1 / 2` on language tasks (`az.reading-open`), dead Check button hidden once rubric reveals.
    - Focused Exam Mode (`body.is-exam-focused`): hides global header, renders slim top bar, supports Untimed mode (synchronous toggle), Pause/Resume, Flag, slide-over Grid Drawer, mid-exam `F5` reload persistence, and 85-task multi-subject `#/exam/all`.
    - Reading split-view at `1120×860`: `0` `.exam-sidebar` columns; `.passage-panel` `546px` / `.task-card` `506px` (zero 3-column crush).
    - Originals: hash sync (`#/originals/math?pdf=0903&n=3`), live solved counter (`0 / 25 -> 1 / 25`), reload persistence, and **all 230/230 originals** (`math:50, ru:60, en:60, az:60`) rendered in live DOM with **0 `.katex-error`**, **0 broken SVGs**, **0 broken images**.
11. **#11 Responsive Matrix & Mobile Ergonomics:**
    - **64/64** checks across 8 routes × 4 viewports (`390×844`, `820×1180`, `1120×860`, `1440×900`) × 2 themes (`light`/`dark`): **0px horizontal overflow**, valid semantic headings (zero `h1 -> h3` skip on Subject Hub, `<h1>` on all routes).
    - Mobile `390×844`: all interactive touch targets `>= 44px`, sticky bottom thumb bar `.task-card__footer` (`position: sticky; bottom: 0px`), single-line sticky 2-tab Reading switcher (`Текст` / `Задание`), slim mobile Exam top bar (`← Рус | 1:00:00 ⏸ | 11/30 | Сдать`), and stacked Stats exam history cards (`0px` clipping).

### P2 Craft, Visual Identity & Delight (#12–#15)
12. **#12 Unified Drawn SVG Icons:** **0** banned UI emojis (`🌙☀️🔥📚📄📖❓🔊💡📋`) found across all 64 viewport/theme scans.
13. **#13 Editorial Visual System & Surfaces:** **0** banned eyebrow kickers above headings; fresh Home omits `0/0%/0` wall; Stats renders 4 distinct subject icon accents and round-trips Export -> 2-step Reset -> Import JSON; Mistakes sequential drill mode (`1/2`) verified; dark mode `color-scheme: dark` and styled thin scrollbars active.
14. **#14 Earned Delight:**
    - **Ulduz 8-Ray Mastery Star:** All 8 geometric rays render crisply around `(16, 16)` in Practice header, Home/Stats streak, and filled brand emblem in footer; illuminates `0 -> 1` ray on 1st correct Practice answer.
    - **Clickable Reading Sentence Anchor:** `.sentence-ref` (`предложение № 5`) on RU reading scrolls to and pulses `(5)` (`.is-pulsing`) inside `.passage-panel`.
    - **Exam Results DİM Score-Insight:** Actionable next-tier + weakest-topic line rendered cleanly below primary score summary.
    - **Math SVGs:** `math.cone-rotation` (`H = 12`, `R = 9`, `l = ?` — zero label overlap) and `math.tri-similarity` (`ABC`, `MN || AC`) render cleanly.

---

## 4. Visually Inspected Screenshots (`tools/reports/shots/`)

All 13 fresh screenshots were inspected directly and confirmed free of visual flaws, truncation, overlap, or contrast issues:

- `tools/reports/shots/home-light-desktop.png` (1440×900 Light, fresh user — clean welcome band, 4 calm cards, crisp footer brand star)
- `tools/reports/shots/home-dark-desktop.png` (1440×900 Dark, returning user — inline stats strip with lit 8-ray Ulduz star, live mistakes badge)
- `tools/reports/shots/home-light-mobile.png` (390×844 Light)
- `tools/reports/shots/home-dark-mobile.png` (390×844 Dark)
- `tools/reports/shots/practice-math-svg.png` (1280×860 — `math.tri-similarity` SVG, unselected Option A, collapsible filter bar, 0/8 Ulduz star)
- `tools/reports/shots/practice-math-cone.png` (1280×860 — `math.cone-rotation` Cone SVG with non-overlapping `H = 12`, `R = 9`, `l = ?` labels & math-only char helpers)
- `tools/reports/shots/practice-ru-reading-dark.png` (1280×860 Dark — Reading passage with highlighted `предложение № 5` anchor & pulsing `(5)`)
- `tools/reports/shots/exam-ru-reading-1120.png` (1120×860 — Focused Exam Mode topbar + balanced 546px/506px reading split-view)
- `tools/reports/shots/exam-ru-reading-mobile.png` (390×844 — slim mobile exam bar `← Рус`, 2-tab switcher, flush sticky thumb bar)
- `tools/reports/shots/exam-results.png` (1280×860 — pending self-grade banner, score ring, actionable DİM insight, topic bars, review list)
- `tools/reports/shots/mistakes.png` (1280×860 — sequential drill CTA, calm cards, live header badge)
- `tools/reports/shots/stats-desktop.png` (1280×860 — hairline summary strip, 4 subject accent colors, exam history table, bottom Data Management footer)
- `tools/reports/shots/stats-mobile.png` (390×844 — stacked mobile history cards with right-aligned `0 / 300`, 8-ray streak star, zero overflow)
