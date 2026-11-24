---
version: 1
slug: "site-index-html"
primary_target: "site/index.html"
related_targets: ["site/css/tokens.css","site/css/primitives.css","site/css/styles.css","site/css/themes.css"]
---

# Surface Brief — Ulduz Application Shell & Core Screens (`site/index.html`)

- **Scope:** Full application redesign across Home (`#/`), Subject Hub (`#/subject/:id`), Practice (`#/practice/:id`), Exam (`#/exam/:id`), Originals (`#/originals/:id`), Mistakes (`#/mistakes`), Stats (`#/stats`), and Studio Drawer (`#theme-modal`).
- **Visitor Mode:** Operate + Read (daily exam workbench + long-form multilingual reading) with an Experience-grade focal Home centerpiece and interactive motion signature.
- **Audience & Job:** 11th-grade Azerbaijan DİM students practicing tasks, taking timed exams, reviewing mistakes, and evaluating 3 live interactive FX tiers + 5 unlockable monochrome modes.
- **Constraints:** 100% pure monochrome black-and-white neon dark theme, zero colored themes, offline ES modules, RU/AZ full typography, 0px horizontal overflow `360px–1440px`, 60fps mobile budget, WCAG AA+, zero banned eyebrows or nested cards.

## Direction contract

**THESIS:** Ulduz is an architectural *Obsidian Atelier* exam instrument where pure monochrome light — not color — encodes focus, mastery, and momentum. It refuses the category default of pastel edu-dashboards and 4 identical boxed subject cards, replacing them with an asymmetric obsidian workbench anchored by a live, pointer-and-touch reactive 8-ray Ulduz Light Compass.

**OWN-WORLD:** Pure achromatic obsidian void (`#030304`), charcoal monolith planes (`#0A0A0C`, `#111115`), razor-sharp 1px luminous white hairlines (`rgba(255,255,255,0.14)` to `0.88`), incandescent `#FFFFFF` primary CTAs (`#050507` ink), monochrome stroke-pattern semantic states (solid white correct, diagonal-hatched dashed silver wrong, dotted silver partial), wide display typography (`Ulduz Wide` / Unbounded) paired with `Inter Variable`, `Source Serif 4`, and `JetBrains Mono`, plus 5 unlockable monochrome architectural modes and 3 live-selectable FX engines (`minimal`, `tactile`, `webgl`).

**STORY:** On arrival, the student immediately recognizes a serious, ultra-premium precision study studio, sees their 4 exam subjects wired directly into the interactive Ulduz Compass and asymmetric subject slabs, can start a timed DİM exam or topic drill in one tap, and feels unmistakable luminous confirmation on every answer and mastery sprint.

**FIRST VIEWPORT:** Floating frosted-obsidian header with FLIP-gliding neon tab indicator, live FX tier toggle, RU/AZ toggle, and Studio Mode drawer trigger. Below it, an asymmetric 2-column Obsidian Atelier stage: left rail carries the bold wide `H1`, crisp subtitle, primary luminous CTA with magnetic inner surface, and (for returning users) a hairline telemetry ruler; right rail houses the interactive 8-ray Ulduz Light Compass with 4 cardinal subject beacons (`∑`, `Я`, `En`, `Az`) whose beam and center readout respond live to pointer/touch. Immediately below begins the staggered asymmetric 12-column Subject Runway (`7fr/5fr`, `5fr/7fr`). On mobile (`<768px`), the stage stacks cleanly with a compact interactive compass dial and a floating luminous obsidian pill dock at the bottom.

**FORM:** Obsidian Atelier — asymmetric architectural monochrome-neon studio + live Ulduz Light Compass + 3-tier interactive FX engine (`minimal` / `tactile` / `webgl`). `seed: none (pinned)` — user pinned: "Единый премиальный Ч/Б неон для всего приложения — заменить цветные темы на открываемые монохромные режимы/эффекты света и типографики", "Obsidian Atelier — асимметричная премиальная сетка, живой световой компас 8-лучевой звезды Ulduz, световые 1px-грани и глубина обсидиана", "сделай все три варианта на выбор и Я оценю их."

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
