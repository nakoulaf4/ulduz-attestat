# Ulduz — `/impeccable` Design Critique & E2E Audit (`docs/design-audit.md`)

**Method:** dual-agent (`A: 020651e7-0a06-4721-aa8c-015afb36931b` · `B: 962d0696-1333-4bfa-a633-a9131dcf0791`)
**Target:** `site/index.html` (`site-index-html`), served at `http://127.0.0.1:8123/`
**Surface Mode:** **Operate + Read** (daily exam-preparation workspace + long-form multilingual reading comprehension)
**Baseline Health Score:** **20 / 40 (Acceptable — 50%)** · **Cognitive Load:** **7 / 8 failures (High)**

---

## 1. Combined Assessment Synthesis (Assessment A + Assessment B)

### Design Specificity Verdict
The underlying domain engineering is strong (`115,000/115,000` generator tests PASS, `230/230` digitized DİM originals PASS, exact DİM 100-point formulas, local KaTeX + `Inter Variable` + `Source Serif 4` + `JetBrains Mono` with full Cyrillic + Azerbaijani Latin support). However, the visual shell reads like a generic AI quiz template and violates both `docs/design.md` ("академическое издание; никакого визуального шума") and `impeccable` `craft-floor.md`:
- **Emoji/Unicode soup** (`🌙 ☀️ 🔥 📚 📄 📖 ❓ 🔊 💡 📋 ✦ ⏱ ★ ☆ ⚑ ✓ ✕`) instead of one unified drawn SVG icon family.
- **Banned kickers/eyebrows** above headings across Home, Subject Hub, Reading Passages, Exam Setup, and Exam Results.
- **Colored `border-left` > 1px** (`impeccable detect`: `side-tab` at `styles.css:1313` `.note` and `styles.css:1821` `.explanation-card`).
- **Nested cards & hero-metric zeroes** (`impeccable detect`: `nested-cards` on Home `.metric-pill` inside `.hero-card` and Exam Setup `.rule-box` inside `.exam-setup-card`; Subject Hub nests `.task-type-item` inside `.topic-group-card`; Stats repeats 4-KPI boilerplate).
- **Unstyled browser surfaces** — zero `color-scheme`, `::selection`, `caret-color`, `text-underline-offset`, dark scrollbar styling (creating a blinding white Windows scrollbar in dark mode), or `::placeholder` styling (`impeccable detect`: `low-contrast` 4.14–4.26:1).
- **Typography & measure**: `Source Serif 4` is vendored locally yet unused on headings; `.hero-title` uses fluid `clamp()` against Operate mode rules; `.tabular-nums` forces monospace onto prose labels (`60 мин`); single-column `.task-card` stretches to `1152px`; Exam + Reading crushes passage prose to `357–402px` (~38ch); `stats.js` `<h2>` has `0px` bottom margin; `subject.js` skips `<h1>` -> `<h3>` (`impeccable detect`: `skipped-heading`); `straggler` orphans on Home/Subject (`text-wrap: pretty` needed).

---

## 2. Prioritized Fix & Redesign Checklist (ALL MUST BE IMPLEMENTED)

### P0 — Blocking Functional & Trust Bugs
1. **Phantom Option A Selection (`site/js/app/task-view.js:280, 289`)**
   - `Number(null) === 0` paints Option A blue and sets `aria-checked="true"` before the user picks anything!
   - **Fix:** `const selected = resp !== null && resp !== undefined && resp !== '' && Number(resp) === idx;`
2. **`Enter` inside `.short-input` skips feedback & jumps immediately to next task (`site/js/app/task-view.js:731-740`)**
   - Missing `e.stopPropagation()` lets `Enter` bubble to `document` after `render()` destroys `.short-input` and resets focus to `BODY`, triggering `onNext()` in 0ms!
   - **Fix:** Call `e.stopPropagation()` inside `shortInput`'s `Enter` handler.
3. **Global `Enter` handler hijacks focused `<a>` links and `<button>` controls (`site/js/app/task-view.js:913-922`)**
   - Guard global `Enter` identically to `Space`: ignore when `tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY'` (or inside an interactive element `e.target.closest('a, button, input, textarea, select')`).
4. **Comma-decimal list answers rejected by `shortEquals()` (`site/js/core/contract.js:289-291`)**
   - `normalizeText(given).replace(/,/g, ';')` splits `'1,5; 2,5'` into 4 tokens!
   - **Fix:** Only treat `,` as list separator when there is no `;` AND it's `, ` (comma + space) rather than decimal `,` between digits (`/(?<!\d),(?!\d)|,\s+/`), or split on `;` first if `;` is present! Keep `'1,5'` as single number `1.5`, `'1,5; 2,5'` as `['1,5', '2,5']`, and `'2, 3'` as `['2', '3']`. Verify with node unit tests!
5. **Exam open-task status betrayal & post-exam self-grade sync (`site/js/core/scoring.js`, `site/js/core/storage.js`, `site/js/app/views/exam.js`)**
   - Distinguish `pending-self-grade` (`task.format === 'open' && resp?.text?.trim() && resp?.self == null`) from truly `unanswered`.
   - On Exam Results, if any open tasks lack `self` grade (especially ones where the student wrote a draft!), show a clear, calm action banner at the top of Results (*«Осталось оценить N письменных заданий по критериям ДИМ»*) with a button to jump directly to/expand open items.
   - When the student self-grades an open task on Exam Results, **also sync `st.mistakes` (resolve/remove if full points, add/keep if < max) and update `st.stats`** so Stats and Mistakes never contradict Results!
   - Do **not** flood `st.mistakes` with 29 untouched `unanswered` tasks when a student ends an exam early — only record actually *wrong / partial* answers into `st.mistakes` (and show unanswered count separately on Results so students can review or optionally add them).
6. **1-click unconfirmed exam discard & active-exam overcount (`site/js/app/views/home.js`, `site/js/app/views/exam.js`)**
   - Require a 2-step inline confirmation before `clearActiveExam()` on Home (no accidental thumb wipes!).
   - Count active-exam answered tasks using `hasResponse(task, responses[task.id])` (not `Object.keys(responses).length`, which counts cleared `""` entries!).
   - If an active exam exists for Subject X and the student visits `#/exam/Y`, show a clear non-blocking banner warning that an exam for X is active (with "Вернуться к X" / "Начать новый Y") instead of silently overwriting X!
   - Add a 5-second **Undo toast** when removing a mistake or bookmark in `#/mistakes`.

### P1 — Major UX, Layout, Accessibility & Localization Fixes
7. **Full `RU / AZ` UI Localization across ALL 7 views (`site/js/app/i18n.js`, `main.js`, `task-view.js`, `views/*.js`)**
   - Translate every UI chrome string in Subject Hub, Practice, Exam (setup, HUD, running, results), Originals, Mistakes, Stats, and TaskCard into Azerbaijani (`az`) via `t()`.
   - Update `document.documentElement.lang` (`'ru'` / `'az'`), `document.title`, and date formatting locale (`'ru-RU'` / `'az-AZ'`) on language toggle.
8. **Live Header Mistakes Badge (`site/js/app/main.js`)**
   - Always render `#header-mistakes-badge` in the DOM (toggled with `hidden` attribute when count is `0`), and update it cleanly via a shared event/helper (`updateHeaderBadges()`) whenever mistakes change (including first mistake and Undo/resolve!).
9. **Focus Preservation & Full WCAG 2.1 AA Accessibility (`site/js/app/task-view.js`, `site/css/styles.css`, `views/*.js`)**
   - Stop destroying keyboard focus on simple state changes (`pick-single`, `toggle-multi`, `pick-match`, `toggle-bookmark`, `order-up/down`): restore focus to the equivalent interactive control (`[data-action][data-index]` / `[data-pos]`) or update DOM state in place!
   - Add semantic `<h1>` on Practice, Exam Running, and Originals (visually clean or `.sr-only` where a compact bar is preferred). Fix skipped heading `<h1>` -> `<h2>` on `#/subject/:id` (no `<h1>` -> `<h3>` jump).
   - Style `.short-input::placeholder, .open-textarea::placeholder { color: var(--text-muted); opacity: 1; }` (ensure ≥ 4.5:1 contrast in BOTH light and dark themes — verify exact hex values: Light `--text-muted` `#5C6678` on `#F7F6F2` ≥ 5.4:1; Dark `--text-muted` `#8B98AD` on `#0C1017` ≥ 6.4:1!).
   - Fix `.skip-link` in dark mode: `color: var(--on-primary);` (≥ 7:1 contrast).
   - Restore `:focus-visible` ring on `.short-input-row:focus-within` and `.open-textarea:focus-visible`.
   - Fix `.btn-icon[hidden], [hidden] { display: none !important; }` so clear `✕` stays hidden when `.short-input` is empty.
   - Add explicit `aria-label` on all icon-only buttons, `aria-pressed` on toggle/match buttons, `Escape` dismissal + focus return on `.confirm-banner`, and an optional **"Без таймера" (Untimed)** switch on Exam Setup.
   - Hide `<kbd class="option-kbd">` badges after a task is checked (`checked === true`) so disabled options don't advertise dead keys.
10. **Calm, Authoritative Layout & Zero Cognitive Overload (`site/css/styles.css`, `views/{home,subject,practice,exam,originals,mistakes,stats}.js`, `task-view.js`)**
    - **Single-column TaskCard measure**: constrain non-passage `.task-card` to `max-width: 780px; margin-inline: auto;` so math/grammar tasks have clean 65–72ch reading measure and options/diagrams feel balanced.
    - **Eliminate Exam + Reading 3-column crush**: When in Exam Running mode, switch the app shell into **Focused Exam Mode** (hide distracting global nav links `Предметы / Ошибки / Статистика`, show one unified `56px` calm Exam Top Bar with Exit/Home, Subject, Timer + Pause, Progress + Grid Drawer trigger, and Finish). On desktop when a reading `passage` is present (or viewport `< 1360px`), show the Exam Grid in a clean **slide-over drawer / toggleable top strip** instead of a 3rd column — giving `.passage-panel` (`52%`, ~65ch) and `.task-card` (`48%`) luxurious reading comfort!
    - **Clean TaskCard header**: Replace the 7–8 noisy pills with a calm 2-part header: left = clean typographic metadata row (`№11 / 30 · Работа с текстом · 1 балл` + subtle `Оригинал 09.03` tag only when original); right = compact Flag (in exam) + Bookmark icon buttons with clean SVG icons and tooltips/labels.
    - **Collapsible Practice filter bar**: Replace the giant permanent 3-dropdown box with a single compact summary bar (`Математика · Планиметрия · Подобие треугольников · Любая ▾ [Настроить]`) that expands the 3 selects only when toggled, and auto-syncs `Тема` when entering via `?type=...`.
    - **Context-smart Short-Answer char bar**: Show Azerbaijani diacritics (`ə ğ ı İ ö ş ü ç`) ONLY for `subject === 'az'` (or when needed); show concise math helpers (`−`, `,`, `/`, `;`) ONLY for `subject === 'math'`; omit the bar for plain English/Russian words unless needed.
    - **Match Open-Task rubric steps to subject**: Show `0 / 0.67 (⅓) / 1 (½) / 1.33 (⅔) / 2` ONLY for `math` 2-pt open tasks (or when `rubric` mentions ⅓/⅔); show clean `0 / 1 / 2 б.` for `ru`/`az`/`en` 2-pt open rubrics, and hide the dead disabled `Проверить ответ` button once rubric buttons are open.
    - **Originals sync & persistence**: Live-update `"Решено оригиналов: X / Y"` on check, sync `window.location.hash` on PDF/task navigation, persist `sessionAnswers` in `localStorage`, and unify booklet numbering clarity.
11. **Mobile Ergonomics (`< 768px`, `390×844`)**
    - Enforce `min-height: 44px; min-width: 44px;` on mobile touch targets (`.nav-link`, `.btn-icon`, `.btn-icon-pill`, `.btn-chip`, `.match-pill`, `.char-btn`, `.seg-btn`, `.strip-num-btn`).
    - Slim sticky mobile Exam Bar (`~52px`, 1 row: `59:57 ⏸ · 11/30 ▾ · Сдать`).
    - **Sticky bottom thumb bar** (`position: sticky; bottom: 0`) on Practice, Originals, and Exam on `< 768px` holding primary `←` / `Проверить` / `Далее →` actions comfortably in the thumb zone.
    - Sticky 2-tab mobile Reading switcher (`Текст` / `Задание`, preserving scroll per tab, zero 2-line wrap!).
    - Horizontal single-row scrollable `.originals-strip` on mobile (`overflow-x: auto; scroll-snap-type: x proximity`) with active item scrolled into view.
    - Stacked card layout for Stats exam history table on `< 640px` (zero mid-word clipping!).

### P2 — `/impeccable` Craft, Identity, Typography & Earned Delight
12. **Unified Drawn SVG Icon System (`site/js/app/icons.js`)**
    - Author crisp `16–20px` inline SVG icons (`stroke="currentColor"`, `stroke-width="1.75"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `aria-hidden="true"`) replacing **100% of emojis and ad-hoc Unicode symbols** across the entire app (including header, Home, Subject, Practice, Exam, Originals, Mistakes, Stats, TaskCard, footer).
13. **Editorial Academic Visual World (`craft-floor.md` + `mode-operate.md`)**
    - **Remove ALL banned eyebrow/kicker badges above headings** (`.hero-eyebrow`, `.passage-panel__eyebrow`, `.feature-banner .badge`, `.exam-setup-card__head .badge`, `.subject-hero__badges` above H1, `.variant-card__head` badge above H3, `.results-hero__badges` above H1). Put supporting metadata quietly *below* or inline after the heading.
    - **Use vendored `Source Serif 4` for editorial headings** (`h1`, major `h2` page/passage titles) with fixed `rem` scale (remove fluid `clamp()` per `operate.md`), `text-wrap: balance` on headings, `text-wrap: pretty` on descriptions/subtitles (fixes all `straggler` orphans!).
    - **Kill nested cards & hero-metric zeroes**:
      - On Home: replace the nested `.hero-card` + 4 `.metric-pill` boxes with a serene, flat typographic welcome band (editorial `Source Serif 4` title + concise subtitle + **one** clear primary action: *"Продолжить"* if returning, or *"Начать пробный экзамен"* / *"Выбрать предмет"*). Show compact inline divider-separated stats ONLY once `totalAttempted > 0` (no `0 / 0% / 0 / 0 🔥` wall for first-timers!).
      - On Home Subject cards: clean flat cards with generous breathing room, hairline divider metadata (no emoji pill clusters), **1 subtle action emphasis** per card (clicking the card or main quiet button opens the Subject Hub/Practice; secondary inline links for `Экзамен` and `PDF 09.03/15.03` — not 5 identical bright-blue CTAs competing on one page!).
      - On Exam Setup: flatten `.rule-box` inside `.exam-setup-card` into a clean hairline-divided rule strip (eliminates `nested-cards` warning!).
      - On Subject Hub: flatten `.task-type-item` rows inside `.topic-group-card` into clean hairline-separated list rows (`border-top` dividers, not cards-inside-cards!) + add a compact topic filter/search input when a subject has > 12 types (like Math's 53 types!).
      - On Stats: add proper `.section-header` spacing (`margin-bottom: var(--sp-4)`), restore per-subject accent colors to `.stat-subj-card__icon`, and move JSON Export/Import/Reset into a quiet bottom "Управление данными" footer strip.
      - On Mistakes: add a top primary CTA **«Начать тренировку по ошибкам (N)»** (sequential drill mode over active mistakes!), group or cleanly filter mistakes, and use secondary buttons on individual cards instead of 31 bright-blue buttons.
    - **Remove `side-tab` > 1px colored `border-left`**: replace `border-left: 4px` on `.explanation-card` and `border-left: 3px` on `.note` with refined full `1px` semantic borders + soft tinted surfaces (fixes both `impeccable detect` `side-tab` warnings!).
    - **Theme ALL browser surfaces**: `color-scheme: light` / `dark`, themed `::selection`, `caret-color: var(--accent-primary)`, `text-underline-offset: 0.18em`, subtle custom thin scrollbars (`scrollbar-width: thin; scrollbar-color` + `::-webkit-scrollbar` matching light/dark surface tokens — eliminates the blinding white dark-mode scrollbar!), soft subtle bottom fade indicator on scrollable `.passage-panel`, and remove `font-family: var(--font-mono)` from `.tabular-nums` (use `font-variant-numeric: tabular-nums` on Inter, reserve `--font-mono` strictly for clocks & answer codes).
    - **Interactive format ergonomics**:
      - `order`: track user interaction (`hasTouchedOrder`) or clearly allow submitting after touching/reordering, plus click-to-swap / move smoothly without losing focus.
      - `match`: show assigned badge (e.g. `1` / `2` / `3`) on matched right-hand items and allow clicking left item then clicking a right item directly!
    - **Fix Math Cone SVG label overlap (`site/js/subjects/math/svg.js:93-105`)**: move `hLabel` and `rLabel` so they never collide with the cone stroke lines.
14. **Two Earned `/impeccable delight` Moments (Operate + Read)**
    - **Ulduz 8-Ray Mastery Star**: Custom SVG 8-pointed star in Practice header & Home progress that smoothly illuminates rays (`1..8` per focused study sprint, `180ms` ease-out, `prefers-reduced-motion` safe) replacing the generic `🔥` flame, plus an actionable DİM score-insight line on Exam Results (*e.g., сколько первичных баллов до следующего уровня и какая тема даст самый быстрый прирост*).
    - **Paper-Booklet Distractor Strike-Through & Reading Sentence Anchor**:
      1. Right-click (or subtle `✕`/strike icon on hover/focus) any MCQ option in Practice/Exam/Originals to softly cross it out as eliminated — instant exam-booklet craft with zero extra noise when unused!
      2. Clickable/auto-linked sentence numbers in Reading questions (e.g. `предложение № 5` / `№ 5`) that smoothly scroll and briefly pulse `(5)` inside the sticky `.passage-panel`!
15. **Smooth, Purposeful Motion (`animate.md` + `operate.md`)**
    - Subtle `150–220ms` `cubic-bezier(0.16, 1, 0.3, 1)` transitions on answer selection, verdict card reveal, passage tab switch, drawer slide, and Ulduz star ray illumination — all strictly gated by `@media (prefers-reduced-motion: reduce)`.
