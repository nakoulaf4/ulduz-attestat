# Шаблон разработки UI — Ulduz «Obsidian Atelier»

> Практический шаблон для добавления любых новых экранов, карточек, модальных окон и интерактивных виджетов в **Ulduz** в едином чёрно-белом неоновом стиле **Obsidian Atelier**.
> Полная спецификация токенов и правил системы находится в корневом [DESIGN.md](../DESIGN.md) и машинном sidecar [.impeccable/design.json](../.impeccable/design.json).

---

## 1. Архитектура шаблона (единый источник правды)

Любой новый модуль автоматически наследует все **5 разблокируемых монохромных режимов** (`atelier`, `prism`, `pulse`, `monolith`, `eclipse`), все **3 живых FX-движка** (`minimal`, `tactile`, `webgl`), мобильную эргономику (`≥48px` tap targets) и `prefers-reduced-motion`, если собран из четырёх слоёв:

| Слой | Файл | Назначение |
|---|---|---|
| **Токены** | `site/css/tokens.css` | Палитра (`--oa-*`), типографика, отступы, радиусы, кривые физики (`--ease-out`, `--ease-snappy`), модификаторы `data-fx`. |
| **Примитивы** | `site/css/primitives.css` | Готовые классы `.btn`, `.badge`, `.seg-btn`, `.progress-bar`, `.breadcrumbs`, `.empty-card`, `.oa-stagger-item` и интерактивные атрибуты `[data-specular]`, `[data-magnetic]`, `[data-ripple]`. |
| **Режимы** | `site/css/themes.css` | Переопределения геометрии, раскладок кнопок и акцентных шрифтов для `Obsidian`, `Prism [i]`, `Pulse [n]`, `Monolith [a]`, `Eclipse · Мастер`. |
| **UI-Kit и FX** | `site/js/app/ui-kit.js`, `site/js/app/fx-engine.js` | HTML-билдеры (`oaBreadcrumbs`, `oaProgressFilament`), одометр (`oaAnimateCounter`), декод заголовков (`oaKineticDecode`), реактивные импульсы (`oaFireFxPulse`). |

---

## 2. Интерактивные HTML-атрибуты (работают автоматически)

`ObsidianFxEngine` (`site/js/app/fx-engine.js`) использует делегирование событий на `document`, поэтому новым элементам **не нужно подключать ручные обработчики** — достаточно добавить `data-*` атрибуты:

| Атрибут | Где использовать | Что делает |
|---|---|---|
| `data-specular` | Основные карточки, панели, баннеры, модалки | Рисует живой 1px зеркальный блик по периметру рамки, отслеживающий указатель/касание (отключается в `minimal` и `reduced-motion`). |
| `data-ripple` | Кнопки, пилюли, чипы, интерактивные ссылки | Запускает WAAPI-волну фотонного кольца из точных координат клика/тапа. |
| `data-magnetic` | Главные CTA-кнопки (обязательно с внутренней обёрткой `<span class="oa-mag-inner">`) | Мягко притягивает внутреннее содержимое к курсору без сдвига внешнего хитбокса (исключает дрожание краёв). |
| `.oa-stagger-item` + `style="--stagger-i:N"` | Элементы списков и карточных рядов | Запускает каскадное появление с шагом `42ms` и экспоненциальным торможением. |

---

## 3. Готовый шаблон нового экрана (`site/js/app/views/<new-view>.js`)

```js
import { t } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml } from '../math.js';
import {
  oaBreadcrumbs,
  oaProgressFilament,
  oaAnimateCounter,
  oaFireFxPulse,
} from '../ui-kit.js';

export async function renderExampleView(container, { setCleanup } = {}) {
  container.innerHTML = `
    <div class="page-container page-container--narrow">
      ${oaBreadcrumbs([
        { label: t('navSubjects'), href: '#/' },
        { label: 'Новый раздел' },
      ])}

      <header class="page-header">
        <div>
          <h1 class="page-title">Заголовок раздела</h1>
          <p class="page-subtitle">Лаконичное описание задачи в спокойной академической типографике.</p>
        </div>
        <button type="button" class="btn btn--primary" data-action="primary-go" data-magnetic data-ripple>
          <span class="oa-mag-inner">
            <span>Начать</span>
            ${icon('arrow-right', { size: 16 })}
          </span>
        </button>
      </header>

      <!-- Основная обсидиановая поверхность: БЕЗ вложенных карточек внутри -->
      <section class="oa-panel oa-stagger-item" style="--stagger-i:0" data-specular>
        <div class="home-stats-strip" style="margin-top:0; padding-top:0; border-top:none;">
          <div class="home-stat">
            <span class="home-stat__val tabular-nums" data-count-to="92" data-count-suffix="%">92%</span>
            <span class="home-stat__lbl">Точность</span>
          </div>
          <div class="home-stat">
            <span class="home-stat__val tabular-nums" data-count-to="24">24</span>
            <span class="home-stat__lbl">Решено</span>
          </div>
        </div>

        <div style="margin-top:18px;">
          ${oaProgressFilament(92, { ariaLabel: 'Прогресс раздела' })}
        </div>

        <div class="task-card__footer">
          <div class="task-footer-left">
            <button type="button" class="btn btn--ghost btn--sm" data-ripple>Сбросить</button>
          </div>
          <div class="task-footer-right">
            <button type="button" class="btn btn--secondary btn--sm" data-action="save-step" data-ripple>
              Сохранить
            </button>
          </div>
        </div>
      </section>
    </div>
  `;

  // Одометр цифр (автоматически учитывает prefers-reduced-motion)
  container.querySelectorAll('[data-count-to]').forEach((el) => {
    oaAnimateCounter(el, Number(el.dataset.countTo), {
      suffix: el.dataset.countSuffix || '',
      duration: 520,
    });
  });

  // Реактивный FX-импульс в Canvas-2D / WebGL при важном действии
  const onClick = (ev) => {
    const btn = ev.target.closest('[data-action="save-step"]');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    oaFireFxPulse('correct', {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      intensity: 1,
    });
  };

  container.addEventListener('click', onClick);
  if (setCleanup) setCleanup(() => container.removeEventListener('click', onClick));
}
```

---

## 4. Чек-лист перед коммитом новой фичи

1. **Чистый монохром:** используйте только переменные из `site/css/tokens.css` (`--oa-void`, `--oa-surface`, `--oa-ink`, `--oa-ink-2`, `--oa-ink-muted`, `--border-subtle`, `--border-strong`). Никаких цветных HEX-кодов.
2. **Семантика без цвета:** статусы различаются геометрией рамки (`solid` = верно, `dotted` = частично, `dashed` = ошибка), иконками из `site/js/app/icons.js` и контрастом.
3. **Изоляция шрифтов:** `var(--font-display)` только для заголовков, кнопок, бейджей и навигации; тексты задач и формулы всегда в `Inter Variable` / `Source Serif 4 Variable` / `JetBrains Mono Variable` + KaTeX.
4. **Плоская иерархия:** внутри карточек используйте hairline-разделители (`1px solid var(--oa-line-faint)`), а не вложенные скруглённые карточки.
5. **Минимальные размеры и контраст:** текст в DOM не меньше `0.7rem` (`11.2px`), тач-цели на `<768px` не меньше `48×48px`, `0px` горизонтального скролла при `360px` и `390px`.
6. **Локализация и тесты:** добавьте ключи `RU` и `AZ` в `site/js/app/i18n.js` и прогоните `node tools/e2e.mjs` + `impeccable detect`.
