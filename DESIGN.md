---
name: Ulduz — Obsidian Atelier
description: Pure monochrome black-and-white neon dark exam workbench with living optical physics and five unlockable architectural modes.
colors:
  obsidian-void: "#030304"
  obsidian-surface: "#0A0A0D"
  obsidian-surface-2: "#111116"
  obsidian-elevated: "#17171E"
  neon-white: "#FFFFFF"
  neon-hover: "#E6E6EE"
  ink-on-neon: "#050507"
  chalk-ink: "#FAFAFC"
  silver-ink: "#C8C8D2"
  ash-muted: "#9898A6"
  hairline-faint: "rgba(255, 255, 255, 0.07)"
  hairline-subtle: "rgba(255, 255, 255, 0.14)"
  hairline-strong: "rgba(255, 255, 255, 0.34)"
  hairline-bright: "rgba(255, 255, 255, 0.88)"
typography:
  display:
    fontFamily: "'Ulduz Wide', 'Inter Variable', system-ui, sans-serif"
    fontSize: "clamp(1.78rem, 3.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Ulduz Wide', 'Inter Variable', system-ui, sans-serif"
    fontSize: "clamp(1.16rem, 1.8vw, 1.48rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Ulduz Wide', 'Inter Variable', system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.3vw, 1.16rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Inter Variable', 'Inter', 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: "0.96rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0em"
  prose-serif:
    fontFamily: "'Source Serif 4 Variable', 'Source Serif 4', Georgia, serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "0em"
  label:
    fontFamily: "'Ulduz Wide', 'Inter Variable', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.02em"
  mono:
    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
    fontFeature: "'tnum' 1"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  pill: "999px"
spacing:
  sp-1: "4px"
  sp-2: "8px"
  sp-3: "12px"
  sp-4: "16px"
  sp-5: "20px"
  sp-6: "24px"
  sp-8: "32px"
  sp-10: "40px"
  sp-12: "48px"
components:
  button-primary:
    backgroundColor: "{colors.neon-white}"
    textColor: "{colors.ink-on-neon}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.neon-hover}"
    textColor: "{colors.ink-on-neon}"
  button-primary-lg:
    backgroundColor: "{colors.neon-white}"
    textColor: "{colors.ink-on-neon}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.obsidian-surface-2}"
    textColor: "{colors.chalk-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "42px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.silver-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "42px"
  card-obsidian:
    backgroundColor: "{colors.obsidian-surface}"
    textColor: "{colors.chalk-ink}"
    rounded: "{rounded.xl}"
    padding: "22px 24px"
  input-short:
    backgroundColor: "{colors.obsidian-void}"
    textColor: "{colors.neon-white}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    padding: "4px 8px 4px 14px"
    height: "52px"
  fx-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ash-muted}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "32px"
  fx-pill-active:
    backgroundColor: "{colors.neon-white}"
    textColor: "{colors.ink-on-neon}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "32px"
---

# Design System: Ulduz — Obsidian Atelier

## Overview

**Creative North Star: "The Obsidian Atelier"**

Ulduz is a nocturnal precision examination instrument carved out of deep matte obsidian and illuminated solely by pure white optical light. Rather than wrapping a study app in pastel gradients or gamified candy chrome, the entire interface treats late-night DİM exam preparation with the quiet gravity of a Swiss horological observatory: pitch-black spatial voids, razor-thin 1px luminous hairlines, sculpted asymmetric layouts, and responsive light that tracks the student's cursor and fingertips.

Every surface, control, and verification state operates inside a strict pure-monochrome black-and-white luminance hierarchy. Emotional lift and tactile delight come from spatial geometry, interactive optical physics (three live-selectable FX engines — *Тишина*, *Свет 60 FPS*, and *Ультра WebGL*), and five unlockable monochrome architectural modes (*Obsidian*, *Prism [i]*, *Pulse [n]*, *Monolith [a]*, *Eclipse · Мастер*) that transform corner architecture, button docks, display typography, and ambient motion without ever breaking monochrome purity.

The system deliberately rejects rainbow accents, neon cyan/magenta clichés, boxed KPI tile grids, nested card-in-card chrome, and decorative UI emoji. Academic prose, mathematical KaTeX notation, and long reading passages stay calm and effortless to scan while the surrounding architectural shell responds like precision machined hardware.

**Key Characteristics:**
- Pure zero-hue monochrome luminance ladder (`#030304` void → `#17171E` elevated → `#FFFFFF` pure optical light) verified at WCAG AA+/AAA contrast across all 5 modes.
- Sculpted interactive **Ulduz 8-Ray Light Compass** and asymmetric 12-column subject runway (`7fr/5fr`, `5fr/7fr`) replacing generic dashboard grids.
- Three live-switchable FX engines (`minimal`, `tactile` 60fps Canvas-2D constellation + pointer specular rims, `webgl` GLSL liquid-mercury caustics & shockwaves) with automatic reduced-motion gating.
- Scoped display typography across five unlockable modes (`Ulduz Wide`, `Ulduz Intel`, `Ulduz Nvidia`, `Ulduz AMD`) strictly isolated from `Inter Variable`, `Source Serif 4 Variable`, `JetBrains Mono Variable`, and KaTeX academic prose.
- Native mobile-first ergonomics (`≥48px` touch targets `<768px`, floating pill bottom dock, edge-to-edge safe areas, zero horizontal overflow down to `360px`).

## Colors

The palette is strictly zero-hue monochrome: cool-neutral obsidian blacks step smoothly into chalk white, using luminance contrast and 1px hairline opacity instead of color saturation to communicate every hierarchy and state.

### Primary
- **Pure Optical White** (`#FFFFFF` / `--oa-neon`): Reserved for primary actions (`.btn--primary`), active navigation capsules, illuminated Ulduz star rays, luminous progress filaments, focus rings, and confirmed correct states. Contrast against **Ink on Neon** (`#050507`) is `20.4:1`.
- **Specular Silver Hover** (`#E6E6EE` / `--oa-neon-hover`): Hover step for primary white controls, keeping high contrast (`16.5:1`) while registering tactile pressure.
- **Ink on Neon** (`#050507` / `--oa-on-neon`): Primary ink set on pure white CTAs, active nav pills, active FX switches, and canonical answer badges.

### Neutral
- **Obsidian Void** (`#030304` / `--oa-void`): Deepest canvas layer hosting the interactive FX backdrop canvases and anchoring every screen.
- **Obsidian Surface** (`#0A0A0D` / `--oa-surface`): Primary card, modal, and panel substrate (`19.1:1` with Chalk Ink).
- **Obsidian Surface 2** (`#111116` / `--oa-surface-2`): Secondary interactive controls, option rows, and recessed chips (`11.4:1` with Silver Ink).
- **Obsidian Elevated** (`#17171E` / `--oa-elevated`): Raised hover surfaces, drawer panels, and danger actions (`5.8:1` minimum with Ash Muted).
- **Chalk Ink** (`#FAFAFC` / `--oa-ink`): Primary headings, task stems, and active controls.
- **Silver Ink** (`#C8C8D2` / `--oa-ink-2`): Secondary body copy, subtitles, explanations, and reading metadata.
- **Ash Muted** (`#9898A6` / `--oa-ink-muted`): Telemetry labels, mono captions, placeholders, and timestamps (`6.7:1` on Obsidian Surface, `5.8:1` on Elevated).
- **Hairlines** (`--oa-line-faint` 7%, `--oa-line-subtle` 14%, `--oa-line-strong` 34%, `--oa-line-bright` 88%): Structural white-alpha 1px strokes separating surfaces, rulers, and active borders.

### Named Rules
**The Zero-Hue Luminance Rule.** No chromatic accent hues (blue, green, red, gold, purple) may appear in chrome, modes, badges, or illustrations. Visual hierarchy and subject identity are expressed exclusively through luminance, typography, geometric glyph (`∑`, `Я`, `En`, `Ə`), and border weight.

**The Structural State Rule.** Answer verification and status communicate through border pattern, icon, and surface contrast rather than color: **Correct** uses solid `#FFFFFF` border + checkmark + luminous wash; **Partial** uses dotted `rgba(255,255,255,0.72)` border; **Wrong** uses dashed `rgba(255,255,255,0.56)` border + cross icon + horizontal recoil.

## Typography

**Display Font:** `'Ulduz Wide'` (default `atelier` & `eclipse`), switching per unlocked mode to `'Ulduz Intel'` (`prism`), `'Ulduz Nvidia'` (`pulse`), or `'Ulduz AMD'` (`monolith`), with `'Inter Variable', system-ui, sans-serif` fallback.
**Body Font:** `'Inter Variable'` (with `'Inter', 'Segoe UI', Roboto, system-ui, sans-serif` fallback).
**Reading Passage Font:** `'Source Serif 4 Variable'` (with `'Source Serif 4', Georgia, serif` fallback).
**Label / Mono Font:** `'JetBrains Mono Variable'` (with `'JetBrains Mono', ui-monospace, monospace` fallback, tabular numerals enabled).

**Character:** Wide geometric display lettering anchors headlines and HUD controls with architectural authority, while neutral neo-grotesque `Inter Variable` and bookish `Source Serif 4 Variable` guarantee fatigue-free legibility across 60-minute reading and math examinations in both Russian Cyrillic and Azerbaijani Latin (`Əə Ğğ Iı İi Öö Şş Üü Çç`).

### Hierarchy
- **Display** (`700`, `clamp(1.78rem, 3.4vw, 2.75rem)`, `1.12`, `-0.025em`): Page H1 headlines (`.home-title`, `.subject-hero__title`, `.exam-setup-title`). Uses `text-wrap: balance`.
- **Headline** (`700`, `clamp(1.16rem, 1.8vw, 1.48rem)`, `1.2`, `-0.015em`): Section titles (`.section-title`), modal titles, and result summaries.
- **Title** (`700`, `clamp(1rem, 1.3vw, 1.16rem)`, `1.25`, `-0.01em`): Subject cards, feature banners, and variant headings.
- **Body** (`400`, `0.96rem`–`1.04rem`, `1.62`–`1.66`, max `72ch`): Question stems, answer options, explanations, and rubrics.
- **Prose Serif** (`400`, `1.02rem`, `1.72`): Long Russian, English, and Azerbaijani reading passages with interactive sentence anchors.
- **Label** (`600`, `0.74rem`–`0.84rem`, `1.15`, `0.01em`–`0.02em`): Buttons, navigation links, badges, and action chips (`≥11.2px` hard floor everywhere).
- **Mono Telemetry** (`500`, `0.72rem`–`0.8rem`, `tabular-nums`): Counters, timers, DİM 100/300 scores, seed IDs, and metadata hairlines.

### Named Rules
**The Scoped Voice Rule.** Mode display fonts apply strictly to brand marks, headings, navigation, buttons, timers, and badges. Reading passages, question stems, option copy, explanations, rubrics, text inputs, and KaTeX formulas MUST NEVER inherit a display font.

## Layout

- **Max-width shells:** Primary workbench container is `1220px` (`.page-container`); focused Practice & Mistakes chamber is `860px` (`.page-container--narrow`); Split-Pane Reading workbench expands cleanly to `1220px` with a sticky `46%` passage column and `54%` question column above `1024px`, collapsing into a tabbed sticky switcher on mobile.
- **Asymmetric Home Stage:** Two-column opening stage (`minmax(0, 1.32fr) minmax(280px, 340px)`) pairing the headline, CTA, and hairline telemetry ruler on the left with the interactive **Ulduz 8-Ray Light Compass** and docked 3-tier FX strip on the right.
- **Staggered Subject Runway:** 12-column asymmetric CSS grid (`.atelier-subjects`) alternating `span 7` / `span 5` on row 1 and `span 5` / `span 7` on row 2, collapsing to a clean single column below `768px`.
- **Spacing Rhythm:** 4px base unit (`--sp-1: 4px` through `--sp-12: 48px`). Cards use `22px–26px` desktop padding (`16px–18px` mobile); vertical sections separate by `32px–44px`.
- **Breakpoints:**
  - `≤520px` / `≤560px`: Compact phone rules (2×2 telemetry grid, hidden secondary labels).
  - `≤767px`: Mobile ergonomic mode — floating obsidian pill bottom navigation dock, `≥48px` minimum tap targets on all interactive controls, flush sticky `.task-card__footer`, and bottom-sheet Studio Drawer.
  - `≥960px` / `≥1024px`: Two-column hero stage, split-pane reading workbench, and desktop pill header navigation.

## Elevation & Depth

Obsidian Atelier uses a **hybrid luminance + structural shadow model**. Depth is established first by stepping obsidian substrate luminance (`#030304` → `#0A0A0D` → `#111116` → `#17171E`) paired with a crisp 1px top inset highlight (`inset 0 1px 0 rgba(255,255,255,0.08)`), and reinforced by deep offset black shadows rather than muddy gray borders. Interactive elevation comes alive via pointer-tracked 1px specular border rims (`[data-specular]`) rather than exaggerated scale transforms.

### Shadow Vocabulary
- **shadow-sm** (`0 4px 14px rgba(0, 0, 0, 0.52)`): Orbital compass beacons, floating chips, and subtle hover lift.
- **shadow-md** (`0 12px 32px rgba(0, 0, 0, 0.68)`): Floating header bar, hovered subject cards, and elevated control surfaces.
- **shadow-lg** (`0 24px 56px rgba(0, 0, 0, 0.84)`): Sculpted Light Compass housing, Studio & FX modal, mobile bottom dock, and toasts.
- **shadow-neon-btn** (`0 8px 26px rgba(255, 255, 255, 0.18), 0 4px 12px rgba(0, 0, 0, 0.72)`): Primary pure-white CTA luminous floor reflection.

### Named Rules
**The Specular Rim Rule.** Surfaces remain flat and razor-sharp at rest with 1px hairlines. Luminous borders intensify only along the pointer/touch vector via `[data-specular]::before` (disabled automatically in `minimal` FX mode and `prefers-reduced-motion`).

**The Flat Hierarchy Rule.** Never nest rounded bordered cards inside cards. Secondary bands inside cards (such as `.task-figure`, `.exam-rules-strip`, `.setup-pills`, and mobile `.task-card__footer`) use hairline dividers, flush full-bleed bands, or subtle vertical surface tints instead of inner card containers.

## Shapes

- **Base Radius Scale:** `--r-xs: 4px`, `--r-sm: 6px`, `--r-md: 10px`, `--r-lg: 14px`, `--r-xl: 20px`, `--r-pill: 999px`.
- **Mode-Specific Architectural Form Language:** Each unlockable monochrome mode reshapes geometry while keeping token semantics intact:
  1. **Obsidian (`atelier`):** Balanced obsidian curves (`--r-md: 10px`, `--r-xl: 20px`), 7fr/5fr asymmetric runway.
  2. **Prism [i] (`prism`):** Precision 2px–6px engineering chamfers, subtle blueprint dot-hairline backdrop, symmetric 2-column task dock.
  3. **Pulse [n] (`pulse`):** 45° polygon-clipped primary CTAs (`clip-path: polygon(...)`), right-aligned high-velocity button docks.
  4. **Monolith [a] (`monolith`):** Sharp architectural slabs (`2px–8px`) framed by 22px pure-white L-corner laser brackets, primary button anchored left-first.
  5. **Eclipse · Мастер (`eclipse`):** Full pill primary CTAs, centered ceremonial header and command deck framed by a rotating pure-white conic plasma perimeter halo (`@property --master-angle`).

## Components

### Buttons
- **Character:** Machined obsidian & pure-white optical switches with WAAPI photon tap ripples (`[data-ripple]`) and optional inner-layer magnetic traction (`[data-magnetic] > .oa-mag-inner`).
- **Shape:** `--r-md` (`10px`) default; mode-adapted in `pulse` (chamfer polygon), `monolith` (angled bevel), and `eclipse` (`999px` pill).
- **Primary (`.btn--primary`):** `#FFFFFF` fill, `#050507` text, `42px` (`48px` `.btn--lg`), sweeping diagonal sheen on hover. Disabled primary switches to recessed obsidian (`rgba(255,255,255,0.055)` fill, `rgba(255,255,255,0.44)` text) instead of muddy faded gray.
- **Secondary (`.btn--secondary`):** `#111116` fill, `#FAFAFC` text, `1px solid rgba(255,255,255,0.34)` border; brightens to `rgba(255,255,255,0.66)` on hover.
- **Ghost (`.btn--ghost`):** Transparent fill, `#C8C8D2` text, `1px solid rgba(255,255,255,0.14)` hairline.
- **Danger / Warning (`.btn--danger`, `.btn--warn-soft`):** Dashed `#FFFFFF` hairline at rest, solid white inversion on hover.

### Chips & FX Pills
- **Style:** Pill containers (`999px`) housing mono labels (`JetBrains Mono`), `32px` desktop / `48px` mobile height.
- **States:** Inactive uses transparent fill + `#9898A6` text; active inverts to solid `#FFFFFF` fill + `#050507` bold text (`.home-fx-pill.is-active`, `.btn-chip.is-bookmarked`, `.seg-btn.is-active`). Active FX cards in `#theme-modal` use a crisp Obsidian Rim (`2px solid #FFFFFF` border + radial specular wash + small `#FFFFFF` active badge) rather than a full-card blinding white slab.

### Cards / Containers
- **Corner Style:** `--r-xl` (`20px`) for primary containers (`.subject-card`, `.task-card`, `.exam-setup-card`, `.stats-ledger`).
- **Background:** `#0A0A0D` with subtle radial/vertical sheen and `inset 0 1px 0 rgba(255,255,255,0.08)` top edge highlight.
- **Border:** `1px solid rgba(255,255,255,0.14)` at rest; live pointer-reactive 1px white rim via `[data-specular]`.
- **Internal Padding:** `22px–26px` desktop, `16px–18px` mobile.

### Inputs / Fields
- **Style:** Deep obsidian well (`#060608`), `1px solid rgba(255,255,255,0.34)`, `--r-md` (`10px`), `max-width: 440px` for short numeric/text inputs (`.short-input-row`), `JetBrains Mono` `1rem` white ink with `#FFFFFF` caret.
- **Focus:** Border snaps to `#FFFFFF` with `0 0 0 3px rgba(255,255,255,0.14)` luminous halo.
- **Validation:** Solid `#FFFFFF` border + subtle wash when correct; dashed `rgba(255,255,255,0.56)` border when wrong.

### Navigation
- **Desktop Header:** Sticky obsidian glass bar (`rgba(8,8,11,0.92)`, `blur(16px)`) with brand Ulduz star left, pill nav track center with GPU-FLIP gliding pure-white active capsule (`#nav-active-pill`), and compact FX toggle + `RU/AZ` switch + Mode Studio trigger right.
- **Mobile Dock (`<768px`):** Fixed floating obsidian pill dock (`left/right: 12px`, `bottom: 10px + safe-area-inset-bottom`), 3 equal tabs (`≥48px` height), pure-white pill indicator around the active icon.

### Signature Component: Ulduz 8-Ray Light Compass
- Circular `320×320px` (`248×248px` on mobile & Eclipse) precision astronomical dial built with layered concentric obsidian shading, 48 rotating vernier ticks, 8 geometric star rays that illuminate with the student's active streak (`0..8`), a spring-damped optical radar beam that smoothly tracks pointer angle or hovered cardinal beacons, a live central telemetry aperture, and 4 interactive `48×48px` orbital subject portals (`∑`, `Я`, `En`, `Ə`).

### Signature Engine: 3-Tier Interactive FX System (`site/js/app/fx-engine.js`)
- **`minimal` (Тишина):** Zero canvas/GPU animation loops; keeps GPU-composited FLIP nav glide, odometer counters, and clean exponential transitions.
- **`tactile` (Свет 60 FPS · Default):** 60fps Canvas-2D starlight constellation with pointer gravitational lens, live `[data-specular]` 1px edge light, inner-layer `[data-magnetic]` buttons, WAAPI `[data-ripple]` photon rings, and answer shockwave/star-spark bursts via `oaFireFxPulse()`.
- **`webgl` (Ультра WebGL):** Custom GLSL fragment shader rendering liquid-obsidian monochrome caustics, sharp double-ring liquid-mercury tap shockwaves, cursor light comet trail, and harmonic supernova answer bursts — with adaptive mobile DPR scaling and automatic Canvas-2D fallback.

## Do's and Don'ts

### Do:
- **Do** compose every new screen from `site/css/tokens.css`, `site/css/primitives.css`, and `site/js/app/ui-kit.js` (`oaBreadcrumbs`, `oaProgressFilament`, `oaFireFxPulse`, `oaAnimateCounter`).
- **Do** attach `data-specular` to primary cards/panels, `data-ripple` to interactive buttons/pills, and `data-magnetic` (with inner `.oa-mag-inner` wrapper) to hero/focal CTAs.
- **Do** maintain ≥4.5:1 contrast for muted/caption text (`--oa-ink-muted` `#9898A6`) and ≥7:1 for primary text (`--oa-ink` `#FAFAFC`), with font sizes ≥11.2px (`0.7rem`) across all DOM text.
- **Do** keep reading passages in `Source Serif 4 Variable`, stems/options/explanations in `Inter Variable`, and numeric readouts in `JetBrains Mono Variable` with `.tabular-nums`.
- **Do** verify every new route in both `RU` and `AZ` locales, at `1440×900` and `390×844` / `360×800`, and across all 3 FX modes (`minimal`, `tactile`, `webgl`).

### Don't:
- **Don't** introduce colored accents (green/red/blue/gold/rainbow) into UI chrome, status pills, or new modes — communicate exclusively through luminance, stroke pattern (solid/dotted/dashed), iconography, and motion.
- **Don't** nest rounded bordered cards inside cards, or wrap primary metrics in 4-box KPI grids when a hairline telemetry ruler or single-surface ledger fits cleaner.
- **Don't** apply mode display fonts to question stems, answer choices, reading passages, explanations, or KaTeX math blocks.
- **Don't** add pulsing status dots, decorative two-axis background grids on default obsidian views, or UI emoji icons — use monochrome SVG icons from `site/js/app/icons.js`.
- **Don't** animate layout properties (`width`, `height`, `top`, `left`) or leave `requestAnimationFrame` loops running when `document.hidden`, `data-fx="minimal"`, or `prefers-reduced-motion: reduce` is active.
