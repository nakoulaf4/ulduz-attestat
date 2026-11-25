# Ulduz — Шаблон дизайн-системы «Factory Records Archival Catalog» (v3.0.0)

Этот документ описывает переиспользуемый фундамент интерфейса **Ulduz** в стиле **Factory Records / Peter Saville** (`brand-identity-canon-saville-catalog-sleeve`), чтобы любой новый экран, тренажёр, карточка или виджет органично продолжал общую эстетику без шаблонных скруглённых карточек и визуального шума.

---

## 1. Файлы-первоисточники

| Слой | Путь | Назначение |
|---|---|---|
| **Токены** | `site/css/tokens.css` | Цвета матового картона (`#0C0C0E`), тёплых чернил (`#EAEAE6`), 4 индустриальных кода Saville (`#D63031`, `#2663C9`, `#DFB41D`, `#2E9E5B`), тайл зерна `--fac-stock-tile`, шкала типографики и строгие `0px` радиусы. |
| **Примитивы** | `site/css/primitives.css` | Кнопки с красным кейкапом (`.btn--primary`), чистые контурные кнопки (`.btn--secondary`), 10-блочные индикаторы сигнала (`.fac-sig-meter`), полярные SVG-спектры (`.fac-radial-svg`), сегменты и бейджи. |
| **Макеты экранов** | `site/css/styles.css` | Архивный конверт Главной, безоболочечные 1px-разделы Subject / Practice / Originals / Exam / Stats, 4-ячеечный квадратный мобильный док. |
| **5 изданий и выдвижная панель** | `site/css/themes.css` | `FAC 01 Archive`, `FAC 02 Blueprint [i]`, `FAC 03 Haçienda [n]`, `FAC 04 Crimson [a]`, `FAC 05 Master Press` (дневной хлопок `#ECECEB`) и правая выдвижная панель `#theme-modal`. |
| **Движок пульсара и сигналов** | `site/js/app/fx-engine.js` | `mountHomePulsar`, `buildRadialSpectrumSvg`, `buildSignalMeterHtml`, `facFireImpulse`, `SUBJECT_CODES`. |
| **Растровые текстуры** | `site/assets/textures/` | Бесшовные `256×256` тайлы `matte-stock-dark.png` и `matte-stock-light.png` с внедрённым provenance. |

---

## 2. Готовые строительные блоки (Copy-Paste)

### 2.1. Действия (строгая иерархия кейкапов)

```html
<!-- Главное действие: инвертированный лист + квадратный красный кейкап справа -->
<a href="#/exam/all" class="btn btn--primary btn--lg">
  <span>Полный экзамен ДИМ · 300</span>
  <!-- inline SVG arrow-right -->
</a>

<!-- Вторичное действие: чистая 1px hairline-рамка БЕЗ цветной полоски в покое -->
<a href="#/subject/math" class="btn btn--secondary btn--sm">Начать экзамен</a>

<!-- Тихое действие -->
<button type="button" class="btn btn--ghost btn--sm">Подсказка</button>
```

### 2.2. Каталожная строка с квадратной цветной плашкой (`40×40px`)

```html
<article class="fac-catalog-row" data-fac-subject="math">
  <span class="fac-catalog-row__plate mono-code" style="background:#D63031;color:#FFFFFF" aria-hidden="true">01</span>
  <div class="fac-catalog-row__main">
    <div class="fac-catalog-row__top">
      <span class="fac-catalog-row__no mono-code">DİM 01</span>
      <h2 class="fac-catalog-row__title"><a href="#/subject/math" class="fac-catalog-row__link">Математика</a></h2>
    </div>
    <div class="fac-catalog-row__sub mono-code">53 типов · 50 PDF · ТРЕНИРОВКА / PDF</div>
  </div>
  <div class="fac-catalog-row__pct mono-code tabular-nums">89%</div>
</article>
```

### 2.3. Колофон телеметрии и 10-блочный индикатор сигнала (вместо SaaS KPI-карточек)

```js
import { buildSignalMeterHtml, buildRadialSpectrumSvg, facFireImpulse, SUBJECT_CODES } from './fx-engine.js';

const meter = buildSignalMeterHtml(89, SUBJECT_CODES.math.color, { ariaLabel: 'Точность' });
const dial  = buildRadialSpectrumSvg(realProgressPct, '#D63031', { size: 196, seed: 9 });
facFireImpulse('correct'); // 2px верхняя полоса передачи (#2E9E5B / #DFB41D / #D63031)
```

---

## 3. Жёсткие правила для новых экранов

1. **Никаких скруглений (`border-radius: 0px`) и никаких вложенных рамок** — секции разделяются только сквозными `1px` линиями и верхней `2px` полосой цвета предмета поверх текстуры матового картона.
2. **Академическая читаемость неприкосновенна:** условия, варианты ответов, разборы и рубрики всегда в `Inter Variable`, тексты чтения — в `Source Serif 4 Variable`, числа и коды — в `JetBrains Mono` с `tabular-nums`.
3. **Только реальные данные:** запрещены фейковые проценты и «накрутки» цифр от нуля на загрузке — экран сразу показывает точные значения из `storage.js`.
4. **Контраст и мобильная эргономика:** ≥4.5:1 на всех 5 изданиях (включая дневное `FAC 05` на `#ECECEB`), `0px` горизонтального скролла при `360–1440px`, зоны нажатия `≥48px` на `<768px`, полная поддержка `prefers-reduced-motion: reduce`.
