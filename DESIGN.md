---
name: Ulduz — Factory Records Archival Catalog
world: brand-identity-canon-saville-catalog-sleeve
description: Archival Factory Records / Peter Saville exam catalog grounded in dry absorbent matte black stock, seamless paper grain tiles, zero-radius 1px hairlines, four industrial color codes, and a live angled 3D axonometric pulsar waveform.
colors:
  fac-ground: "#0C0C0E"
  fac-surface: "#111113"
  fac-surface-2: "#17171A"
  fac-elevated: "#1D1D21"
  fac-ink: "#EAEAE6"
  fac-ink-2: "#B8B8B2"
  fac-muted: "#90908B"
  fac-ink-on-light: "#0C0C0E"
  fac-red: "#D63031"
  fac-blue: "#2663C9"
  fac-yellow: "#DFB41D"
  fac-green: "#2E9E5B"
  fac-steel: "#848482"
  fac-cotton: "#ECECEB"
  fac-cotton-surface: "#E3E3E1"
  fac-line-faint: "rgba(234, 234, 230, 0.11)"
  fac-line: "rgba(234, 234, 230, 0.18)"
  fac-line-strong: "rgba(234, 234, 230, 0.4)"
  fac-line-bright: "#EAEAE6"
typography:
  display:
    fontFamily: "'Ulduz Nvidia', 'Inter Variable', system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 5.4vw, 5.1rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "0.03em"
  headline:
    fontFamily: "'Ulduz Nvidia', 'Inter Variable', system-ui, sans-serif"
    fontSize: "clamp(1.18rem, 1.8vw, 1.48rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  title:
    fontFamily: "'Ulduz Nvidia', 'Inter Variable', system-ui, sans-serif"
    fontSize: "clamp(0.98rem, 1.25vw, 1.14rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.03em"
  body:
    fontFamily: "'Inter Variable', 'Inter', 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: "0.96rem"
    fontWeight: 400
    lineHeight: 1.56
    letterSpacing: "0em"
  prose-serif:
    fontFamily: "'Source Serif 4 Variable', 'Source Serif 4', Georgia, serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "0em"
  label:
    fontFamily: "'Ulduz Nvidia', 'Inter Variable', system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.04em"
    fontFeature: "'tnum' 1"
rounded:
  xs: "0px"
  sm: "0px"
  md: "0px"
  lg: "0px"
  xl: "0px"
  pill: "0px"
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
    backgroundColor: "{colors.fac-ink}"
    textColor: "{colors.fac-ink-on-light}"
    accentTabColor: "{colors.fac-red}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 40px 0 18px"
    height: "42px"
  button-primary-lg:
    backgroundColor: "{colors.fac-ink}"
    textColor: "{colors.fac-ink-on-light}"
    accentTabColor: "{colors.fac-red}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 52px 0 24px"
    height: "50px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.fac-ink}"
    borderColor: "{colors.fac-line-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "42px"
  catalog-plate:
    width: "40px"
    height: "40px"
    rounded: "{rounded.xs}"
    typography: "{typography.mono}"
  signal-meter:
    blockSize: "9px"
    gap: "4px"
    peakColor: "{colors.fac-red}"
  nav-cell-active:
    backgroundColor: "{colors.fac-ink}"
    textColor: "{colors.fac-ink-on-light}"
    accentTabColor: "{colors.fac-red}"
    height: "52px"
---

# Design System: Ulduz — Factory Records Archival Catalog

## 1. Visual Theme & Atmosphere

Ulduz rejects generic rounded EdTech cards, floating glassmorphic navbars, and decorative neon glows in favor of an unmistakable **Factory Records / Peter Saville Archival Exam Catalog** (`brand-identity-canon-saville-catalog-sleeve`). Every screen behaves like a tactile 12-inch archival sleeve printed on dry absorbent matte black cardboard stock (`#0C0C0E` layered with the seamless 256×256 raster grain tile `site/assets/textures/matte-stock-dark.png`) — or, in the unlockable daylight `FAC 05 · Master Press` edition, cool archival cotton-rag stock (`#ECECEB` layered with `site/assets/textures/matte-stock-light.png`).

Structural authority comes from strict zero-radius (`0px`) `1px` architectural hairlines, monumental squared-corner grotesque typography (`Tektur`), four bold industrial Peter Saville color-code blocks (`DİM 01`–`DİM 04`), a live interactive angled 3D axonometric Canvas pulsar waveform grounded in real student accuracy, and high-frequency concentric polar spectrum dials below the fold.

## 2. Color Palette & Roles

| Token | Hex / Value | Role & Usage | Contrast Check |
|---|---|---|---|
| `--fac-ground` | `#0C0C0E` | Primary matte absorbent black sleeve ground (`FAC 01`) | Canvas base |
| `--fac-surface` | `#111113` | Subtle recessed sleeve surface (drawers, reading panel) | L+3 elevation |
| `--fac-surface-2` | `#17171A` | Interactive hover / selected row surface | L+6 elevation |
| `--fac-elevated` | `#1D1D21` | Floating toast notifications & overlays | L+10 elevation |
| `--fac-ink` | `#EAEAE6` | Warm paper-white plot ink, primary headings, inverted CTAs | `16.4:1` on `#0C0C0E` |
| `--fac-ink-2` | `#B8B8B2` | Secondary editorial copy & technical subtitles | `9.5:1` on `#111113` |
| `--fac-muted` | `#90908B` | Captions, placeholders, mono colophon keys | `5.9:1` on `#111113` |
| `--fac-red` | `#D63031` | `DİM 01` Mathematics · Primary CTA keycap · Signal peak · Wrong | Paired with icon + border |
| `--fac-blue` | `#2663C9` | `DİM 02` Russian language · Reading registration accent | Subject code `02` |
| `--fac-yellow` | `#DFB41D` | `DİM 03` English language · Partial credit · Flagged / Bookmarked | Subject code `03` |
| `--fac-green` | `#2E9E5B` | `DİM 04` Azerbaijani language · Verified correct answer | Subject code `04` |
| `--fac-steel` | `#848482` | Neutral archival industrial swatch (`FAC 505`) | Color strip anchor |
| `--fac-cotton` | `#ECECEB` | `FAC 05 · Master Press` cool daylight cotton-rag stock ground | `16.4:1` with `#0C0C0E` ink |

### Five Unlockable Archival Pressing Editions (`site/css/themes.css`)

1. **`FAC 01 · Archive` (`atelier`, default)** — Absorbent matte black `#0C0C0E` + `matte-stock-dark.png`, squared grotesque `Ulduz Nvidia` (`Tektur`), Saville 4-color blocks & crimson primary keycap.
2. **`FAC 02 · Blueprint [i]` (`prism`, 10 Math correct)** — Deep drafting blueprint `#080D18`, cobalt keycap `#2663C9`, symmetric 2-column task action dock, `Ulduz Intel` (`Exo 2`).
3. **`FAC 03 · Haçienda [n]` (`pulse`, 5 RU + 5 EN correct)** — Manchester charcoal `#0C0C0D`, hazard yellow `#F0C419` chamfered polygon CTAs, right-docked footer, `Ulduz Nvidia` (`Tektur`).
4. **`FAC 04 · Crimson [a]` (`monolith`, 10 AZ correct)** — Heavy iron graphite `#0F0D0E`, vermilion `#E63946` corner registration brackets (`::before`/`::after`), primary-left footer, `Ulduz AMD` (`Russo One + Ə/ə`).
5. **`FAC 05 · Master Press` (`eclipse`, 100/100 or 300/300 exam)** — Inverted cool cotton-rag daylight stock `#ECECEB` + `matte-stock-light.png`, pitch `#0C0C0E` plot ink, crimson keycap, wide `Ulduz Wide` (`Unbounded`).

## 3. Typography Rules

All fonts are 100% locally vendored `.woff2` assets in `site/vendor/fonts/` covering full Russian Cyrillic (`А–Я`, `а–я`, `Ёё`, `№`) and Azerbaijani Latin (`Əə Ğğ Iı İi Öö Şş Üü Çç`):

- **Display / Catalog Poster (`--font-display`):** `Ulduz Nvidia` (`Tektur Variable`, weight `600`, squared-corner architectural grotesque) on `FAC 01` — `DİM 300` rendered at monumental `clamp(2.9rem, 5.4vw, 5.1rem)` with `line-height: 0.94`.
- **Academic Prose (`--font-sans`):** `Inter Variable` (`0.96rem`, `line-height: 1.56`, max `72ch`) locked on all question stems, options, explanations, rubrics, and inputs regardless of active edition.
- **Long-Form Reading (`--font-serif`):** `Source Serif 4 Variable` (`1.02rem`, `line-height: 1.72`) locked on split-pane RU/EN/AZ reading passages.
- **Technical Telemetry (`--font-mono`):** `JetBrains Mono Variable` with `font-variant-numeric: tabular-nums` on catalog codes (`DİM 01`–`04`, `FAC 09.03`), colophons, timers, counters, and `<kbd>` hints.

## 4. Elevation, Materiality & Surface Architecture

- **Physical Stock Materiality:** Every dark sleeve tiles `site/assets/textures/matte-stock-dark.png` (`256×256`); `FAC 05` tiles `site/assets/textures/matte-stock-light.png` (`256×256`). Both rasters carry embedded provenance metadata (`impeccable embed-prompt`).
- **Zero-Radius Discipline:** `--r-xs` through `--r-pill` are strictly `0px`. No rounded pill chips, no rounded cards, no glassmorphism blurs.
- **Unboxed Hairline Chambers:** Inner screens (`Subject`, `Practice`, `Originals`, `Stats`) sit directly on the matte stock ground separated by `1px` hairlines and a `2px` subject-color top registration rule — never stacked inside nested bordered boxes.
- **Elevation:** Flat at rest; deep dark shadows (`--shadow-lg`) appear strictly on the right-docked slide-over drawers (`#theme-modal`, `#exam-grid-drawer`) and floating undo/unlock toasts.

## 5. Layout, Grid & Spacing

- **Full-Bleed `52px` Archival Topbar:** Left brand mark + 5-block Saville color strip; right hairline-celled navigation (`КАТАЛОГ | ОШИБКИ | СТАТИСТИКА | RU/AZ | FAC 01`) with inverted active cell + `6px` crimson right tab.
- **Home First-Viewport Sleeve (`.fac-sleeve`):** `minmax(436px, 500px) 1fr` asymmetric hairline split — left monumental `DİM 300` + four `DİM 01`–`04` catalog entries with `40×40px` square color plates; right live interactive angled 3D floating Canvas pulsar framed by surveyor crop marks and topped by a right-aligned Saville key-value colophon + 10-block signal meter; anchored across the bottom by the interactive 5-block Color Decoder bar and the square-keycap `ПОЛНЫЙ ЭКЗАМЕН ДИМ · 300 →` CTA.
- **Below-the-Fold Archival Releases:** 4-column hairline grid (`280px` intro + `FAC 09.03`, `FAC 15.03`, `FAC ERR`) featuring `196px` high-frequency jagged polar spectrum SVGs (`000/090/180/270`), real solved-count colophons, and 4-cell subject links.
- **Mobile Ergonomics (`<768px`):** Fixed 4-cell square bottom navigation dock (`min-height: 54px`), `≥48px` touch targets on all controls, `0px` horizontal overflow down to `360px`, sticky task action bar, and safe-area insets.

## 6. Component Specifications

- **Primary Action Button (`.btn--primary`):** Inverted paper-white `#EAEAE6` fill (`#0C0C0E` on `FAC 05`) + full-height square-proportioned solid crimson keycap (`::after`, `24px` default, `32px` `--lg`, `18px` `--sm`).
- **Secondary Action Button (`.btn--secondary`):** Pure hairline outline (`1px solid var(--border-strong)`, transparent fill, zero resting accent stripe).
- **Subject Color Plate (`.fac-catalog-row__plate` / `.stat-subj-card__icon`):** Solid `40×40px` square (`36×36px` mobile) carrying high-contrast mono index (`01`–`04`) or glyph (`Σ`, `Я`, `En`, `Ə`).
- **10-Block Signal Meter (`.fac-sig-meter`):** Ten `9×9px` square telemetry blocks with subject accent fill and crimson peak cell (`buildSignalMeterHtml`).
- **Right-Docked Archival Drawer (`#theme-modal`):** Full-height `560px` slide-over drawer (`bottom` sheet on `<768px`) housing the 3-row stacked Pulsar signal tier switcher and the 5-row stacked hairline edition ledger.

## 7. Interactive Physics & Motion

- **Single Signature Interactive Surface (`mountHomePulsar`):** 38-line (48-line in Ultra) angled 3D axonometric floating pulsar ridgefield reacting to hovered/focused catalog row, bottom color decoder swatches, pointer horizontal parallax, and click shockwave across bands. `minimal` mode & `prefers-reduced-motion: reduce` render a crisp static plot with zero `requestAnimationFrame` loops.
- **Top Hairline Impulse (`facFireImpulse`):** `2px` horizontal transmission scan sweeping across `#fac-impulse-bar` on answer verification (`green` / `yellow` / `red`) and edition unlocks.
- **Zero Count-Up Lies:** Stat counters render exact live values immediately on load (`oaAnimateCounter` removed from Home & Stats to prevent mid-tween discrepancies).

## 8. Anti-Patterns & Guardrails

- **Never** add rounded corners (`border-radius > 0`), pill badges, eyebrows/kickers above headings, or SaaS KPI card rows.
- **Never** put resting colored stripes on `.btn--secondary` — square color keycaps belong strictly to primary/active actions.
- **Never** fabricate placeholder telemetry percentages — every meter, polar dial, and colophon value must derive from real `storage.js` state.
- **Never** leak display fonts onto question stems, options, reading passages, explanations, or KaTeX math.
- **Never** use UI emojis (`🔥`, `📚`, `☀️`, `🌙`) in chrome — use `site/js/app/icons.js` inline SVGs and hairline `ulduzStarSvg` reticles.
