# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

11th-grade students in Azerbaijan (Russian and Azerbaijani language sectors) preparing daily for the State Examination Center (**DİM Buraxılış / Attestat**) final graduation exam, primarily on Android/iOS smartphones and desktop laptops, frequently during evening and late-night study sessions.

## Product Purpose

Provide a 100% offline-capable, zero-latency exam preparation studio covering all four DİM 11th-grade exam subjects (**Mathematics**, **Russian**, **English**, **Azerbaijani**). Success means students can drill procedural topics endlessly, work through authentic March 2026 PDF booklets step-by-step, simulate timed or untimed full DİM exams with official 100/300-point scoring, review mistakes effortlessly, and enjoy coming back every day.

## Positioning

Combines 230 digitized official March 2026 DİM exam tasks (`09.03.2026` and `15.03.2026`), 115 deterministic procedural task generators, official DİM 100-point/300-point scoring formulas shared between JS and the native Rust (Tauri v2) backend, full Russian/Azerbaijani (`RU / AZ`) localization, and a bold, unmistakable visual identity built specifically for Azerbaijani 11th-grade exam preparation.

## Operating Context

- Delivered both as an offline-first web/PWA app (`site/`) and as a native mobile app shell built on Rust + Tauri v2 (Android APK + iOS workflow) sharing the exact same `site/` frontend.
- High-stakes academic workflows: multi-format questions (`single`, `multi`, `short`, `match`, `order`, `open`), split-pane long reading passages (`Source Serif 4`), KaTeX math rendering, inline geometry SVGs, paper-booklet distractor strike-through, sentence-anchor jumps, exam timers, slide-over task grids, and open-task rubric self-grading.
- Strict offline self-containment: all fonts (`.woff2`), KaTeX runtime, icons, and task data ship locally with zero external network dependencies.

## Capabilities and Constraints

- Zero build-step ES modules in `site/`; all changes embed directly into the Rust Tauri binary (`src-tauri/`) via `frontendDist: "../site"`.
- Lazy subject chunk loading: cold start on `#/` and `#/stats` must fetch zero subject bundles.
- Strict multilingual typography coverage: every display and body font must support 100% of Russian Cyrillic (`А–Я`, `а–я`, `Ёё`, `№`) and Azerbaijani Latin (`Əə Ğğ Iı İi Öö Şş Üü Çç`).
- Display fonts remain scoped to headings, brand, navigation, buttons, HUD counters, and badges; reading passages, question stems, options, explanations, and KaTeX stay in `Inter Variable`, `Source Serif 4 Variable`, `JetBrains Mono Variable`, and KaTeX fonts for sustained exam legibility.
- Mobile ergonomic floor: 0px horizontal overflow down to `360px` width, `≥48px` touch targets on `<768px`, `env(safe-area-inset-*)` edge-to-edge support, and Android hardware Back button handling (`window.__ULDUZ_HANDLE_BACK__`).
- Motion accessibility: full `prefers-reduced-motion: reduce` support and steady 60fps performance on mobile devices.

## Brand Commitments

- **Committed Replacement Visual World — Factory Records / Peter Saville Archival Catalog (`brand-identity-canon-saville-catalog-sleeve`):** Chosen directly by the user to replace the discarded monochrome Obsidian Atelier design. Dry absorbent matte black paper ground (`#0C0C0E`), warm paper-white plot ink (`#EAEAE6`), strict zero-radius (`0px`) 1px hairline divisions, iconic 4-color industrial code blocks (`#D63031` Math Red, `#2663C9` Russian Blue, `#DFB41D` English Yellow, `#2E9E5B` Azerbaijani Green), live interactive 3D Canvas pulsar accuracy plots, and zero rounded SaaS card grids.
- **5 Unlockable Archival Pressing Editions:** Unlockable catalog editions (`FAC 01 · Archive` [default], `FAC 02 · Blueprint [i]`, `FAC 03 · Haçienda [n]`, `FAC 04 · Crimson [a]`, `FAC 05 · Master Press` daylight cotton edition) earned through solving subject tasks and scoring 100/100 or 300/300 on exams.
- **Signature Brand Name:** **Ulduz** (Azerbaijani for *Star*).
- **Reusable Design System:** Documented cleanly at finish in `DESIGN.md`, `.impeccable/design.json`, and `docs/DESIGN-TEMPLATE.md`.

## Evidence on Hand

- 230 digitized official tasks in `site/data/original/{math,ru,en,az}.json` (source PDFs are local only, never committed to git).
- 115 procedural generators in `site/js/subjects/{math,ru,en,az}/`, verified by `tools/selftest.mjs`.
- 5 vendored offline `.woff2` display fonts + `Inter Variable`, `Source Serif 4 Variable`, `JetBrains Mono Variable` in `site/vendor/fonts/`.
- Native Rust backend + DİM scoring engine + atomic storage in `src-tauri/src/`.

## Product Principles

1. **Archival clarity on matte stock:** Heavy absorbent black stock (`#0C0C0E`), cool cotton-rag daylight stock (`#ECECEB` on `FAC 05`), and hairline structural divisions elevate exam focus rather than competing with equations or reading passages.
2. **Tactile feedback with zero friction:** Every answer lock, strike-through, route shift, and mastery milestone feels immediate, physical, and reversible via crisp signal pulses and native haptics.
3. **Industrial Saville color-code + pattern semantics:** Subjects and exam statuses combine the four Peter Saville industrial color blocks (`#D63031` Math / Wrong, `#2663C9` Russian, `#DFB41D` English / Partial, `#2E9E5B` Azerbaijani / Correct) with catalog numbers (`DİM 01`–`DİM 04`), icons, and hairline geometry so meaning never depends on color alone.
4. **Mobile-first speed, desktop precision:** Touch gestures, square 4-cell thumb ergonomics, and 60fps Canvas pulsar telemetry work natively on Android/iOS as cleanly as keyboard shortcuts on desktop.
5. **Composable catalog discipline:** Every screen, drawer, and ledger is assembled from shared Factory Records tokens (`tokens.css`) and zero-radius primitives (`primitives.css`).

## Accessibility & Inclusion

- WCAG 2.1 AA+ contrast (`≥4.5:1` for body/muted/placeholder text, `≥7:1` for primary copy) across all 5 archival editions (`FAC 01`–`FAC 05`, including the daylight cotton-rag `FAC 05` Master Press edition).
- Full keyboard navigation (`1–5`/`A–E`, `Enter`, `Space`, `F`, `H`, `Esc`, arrow keys) and ARIA live announcements.
- Complete `RU / AZ` bilingual UI parity with proper `<html lang>` and localized dates.
- Full `prefers-reduced-motion: reduce` non-spatial fallback that preserves every confirmation state.
