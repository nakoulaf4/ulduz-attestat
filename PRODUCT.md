# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

11th-grade students in Azerbaijan (Russian and Azerbaijani language sectors) preparing daily for the State Examination Center (**DİM Buraxılış / Attestat**) final graduation exam, primarily on Android/iOS smartphones and desktop laptops, frequently during evening and late-night study sessions.

## Product Purpose

Provide a 100% offline-capable, zero-latency exam preparation studio covering all four DİM 11th-grade exam subjects (**Mathematics**, **Russian**, **English**, **Azerbaijani**). Success means students can drill procedural topics endlessly, work through authentic March 2026 PDF booklets step-by-step, simulate timed or untimed full DİM exams with official 100/300-point scoring, review mistakes effortlessly, and enjoy coming back every day.

## Positioning

Combines 230 digitized official March 2026 DİM exam tasks (`09.03.2026` and `15.03.2026`), 115 deterministic procedural task generators, official DİM 100-point/300-point scoring formulas shared between JS and the native Rust (Tauri v2) backend, full Russian/Azerbaijani (`RU / AZ`) localization, and a bespoke dark monochrome-neon design system (**Obsidian Atelier**) with live-selectable interactive animation engines.

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

- **Unified Pure Monochrome Black-and-White Neon Aesthetic ("Obsidian Atelier"):** Entire application operates in an obsidian dark theme with pure black-to-white luminance hierarchy, razor-sharp 1px luminous borders, architectural asymmetry, and zero colored themes or rainbow accents.
- **5 Unlockable Monochrome Modes:** Visual modes unlocked through solving tasks and mastering full exams (`Obsidian`, `Prism [i]`, `Pulse [n]`, `Monolith [a]`, `Eclipse · Мастер`), each strictly monochrome B&W neon yet distinct in layout geometry, button placement, display font voice, and signature animations.
- **3 Live-Selectable Interactive FX Modes:** Users can switch live between `minimal` (restraint + micro-physics), `tactile` (60fps Canvas-2D constellation + specular light borders + magnetic physics + photon ripples), and `webgl` (custom GLSL monochrome liquid-light shader + velocity trails + supernova pulses).
- **Signature Brand Mark:** The 8-ray geometric Azerbaijani **Ulduz** star, used as the interactive home Light Compass and the 8-ray focus sprint meter.
- **Reusable Design Template:** Documented in `DESIGN.md`, `.impeccable/design.json`, `docs/DESIGN-TEMPLATE.md`, `site/css/tokens.css`, `site/css/primitives.css`, and `site/js/app/ui-kit.js` so future features automatically inherit the same Obsidian Atelier language.

## Evidence on Hand

- 230 digitized official tasks in `site/data/original/{math,ru,en,az}.json` (source PDFs are local only, never committed to git).
- 115 procedural generators in `site/js/subjects/{math,ru,en,az}/`, verified by `tools/selftest.mjs`.
- 5 vendored offline `.woff2` display fonts + `Inter Variable`, `Source Serif 4 Variable`, `JetBrains Mono Variable` in `site/vendor/fonts/`.
- Native Rust backend + DİM scoring engine + atomic storage in `src-tauri/src/`.

## Product Principles

1. **Academic clarity inside dark luxury:** Atmospheric craft and interactive light elevate focus rather than competing with equations or reading passages.
2. **Tactile feedback with zero friction:** Every answer lock, strike-through, route shift, and mastery milestone feels immediate, physical, and reversible.
3. **Pure luminance semantics:** Status, progress, and hierarchy communicate through contrast, stroke pattern, geometry, icon, and motion — never relying on hue.
4. **Mobile-first speed, desktop precision:** Touch gestures, bottom thumb ergonomics, and 60fps GPU-composited effects work natively on Android/iOS as cleanly as keyboard shortcuts on desktop.
5. **Composable template discipline:** Every new screen or widget is assembled from shared Obsidian Atelier primitives and tokens.

## Accessibility & Inclusion

- WCAG 2.1 AA+ contrast (`≥4.5:1` for body/muted/placeholder text, `≥7:1` for primary copy) across all 5 monochrome modes.
- Full keyboard navigation (`1–5`/`A–E`, `Enter`, `Space`, `F`, `H`, `Esc`, arrow keys) and ARIA live announcements.
- Complete `RU / AZ` bilingual UI parity with proper `<html lang>` and localized dates.
- Full `prefers-reduced-motion: reduce` non-spatial fallback that preserves every confirmation state.
