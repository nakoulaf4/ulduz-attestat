---
version: 1
slug: "site-index-html"
primary_target: "site/index.html"
related_targets: ["site/css/tokens.css","site/css/primitives.css","site/css/styles.css","site/css/themes.css"]
---

# Surface Brief — Ulduz (`site/index.html`)

- **Scope:** Full-application ground-up redesign across Home (`#/`), Subject Hub (`#/subject/:id`), Practice (`#/practice/:id`), Originals (`#/originals/:id`), Exam (`#/exam/:id`), Mistakes (`#/mistakes`), Stats (`#/stats`), and Archival Editions Drawer (`#theme-modal`).
- **Visitor Mode:** Experience (opening archival showcase & identity) transitioning into high-clarity Operate + Read examination chambers.
- **Audience & Job:** Azerbaijani 11th-grade DİM Buraxılış / Attestat students (RU & AZ sectors) on phones and laptops launching drills, official March 2026 (`09.03` / `15.03`) booklets, full 300-point exams, and mistake reviews offline.
- **Constraints:** Zero build step ES modules in `site/`; lazy subject loading; 100% local fonts supporting RU Cyrillic + AZ Latin (`Əə Ğğ Iı İi Öö Şş Üü Çç`); KaTeX + SVG math intact; `0px` horizontal overflow `360–1440px`; `≥48px` mobile touch targets; Android hardware Back priority chain; WCAG AA+ contrast; `prefers-reduced-motion` support.
- **Chosen Sketch:** `.impeccable/mocks/decision/r2-saville.html` (plus craft bar `.impeccable/mocks/worlds/brand-identity-canon-saville-catalog-sleeve-board.webp` and `brand-identity-canon-saville-catalog-sleeve-hero.webp`).

## Direction contract

**THESIS:** Ulduz abandons every generic EdTech navbar, floating pill dock, and 2×2 rounded card grid to become an archival **Factory Records / Peter Saville Exam Catalog** (`DİM 01`–`DİM 04`, `FAC 09.03`, `FAC 15.03`), where industrial 4-color code blocks and a live interactive 3D pulsar accuracy plot replace decorative chrome.

**OWN-WORLD:** Dry matte absorbent black stock (`#0C0C0E`), recessed sleeve `#111113`, warm paper-white plot ink (`#EAEAE6`), steel muted (`#848482`), zero-radius `1px` architectural hairlines (`border-radius: 0px`), and four flat Saville industrial color codes (`#D63031` Math Red, `#2663C9` Russian Blue, `#DFB41D` English Yellow, `#2E9E5B` Azerbaijani Green) powering swatch-tabbed rectangular buttons, hairline-celled navigation, and semantic exam verification.

**STORY:** Within two seconds the student sees their live accuracy rendered as a real stacked white-line pulsar beside the 4 numbered catalog entries (`DİM 01`–`DİM 04`), decodes subjects by color block or title, and launches a drill, March 2026 PDF booklet, or full 300-point exam in one click.

**FIRST VIEWPORT:** Full-bleed `52px` hairline archival top strip (left `ULDUZ · КАТАЛОГ DİM 2026` + 5-block color strip; right hairline-celled nav `КАТАЛОГ | ОШИБКИ | СТАТИСТИКА | RU/AZ | ИЗДАНИЯ`), below which a `440px | 1fr` hairline-split sleeve pairs the monumental `DİM 300` heading and four color-blocked `DİM 01`–`DİM 04` rows on the left with a live interactive 40-line Canvas 3D pulsar waveform on the right, anchored across the bottom by the interactive 5-block color decoder bar and the sharp rectangular `ПОЛНЫЙ ЭКЗАМЕН · 300 →` primary button with its solid red signal tab.

**FORM:** `brand-identity-canon-saville-catalog-sleeve` (Challenger #2 from Re-roll #1, chosen by user on the Decision Board, code-led with `.impeccable/mocks/decision/r2-saville.html`), `seed:d1994830870d59e8`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
