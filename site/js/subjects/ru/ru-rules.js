// Вспомогательные алгоритмы и визуальные конструкторы (SVG-диаграммы, таблицы,
// генерация уникальных вариантов ответа) для модуля «Русский язык» (ru).

import { normalizeText } from '../../core/contract.js';

const VOWELS_RE = /[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g;

/** Подсчёт слогов (гласных букв) в русском слове. */
export function countSyllables(word) {
  const matches = String(word ?? '').match(VOWELS_RE);
  return matches ? matches.length : 0;
}

/** Безопасное экранирование текста для вставки в SVG/HTML. */
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Разбить короткую фразу на строки для SVG по заданной ширине в символах. */
function wrapTextLines(text, maxChars = 22) {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if (cur.length + 1 + w.length <= maxChars) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Сформировать 5 перемешанных, попарно различных вариантов для задания формата 'single'.
 * Гарантирует отсутствие дублей после normalizeText и точный индекс answer.
 */
export function buildSingleOptions(rng, correctHtml, distractorPool, totalOptions = 5) {
  const targetCount = Math.max(2, totalOptions);
  const normCorrect = normalizeText(correctHtml);
  const seen = new Set([normCorrect]);
  const distractors = [];

  for (const d of rng.shuffle(distractorPool)) {
    if (typeof d !== 'string' || !d.trim()) continue;
    const nd = normalizeText(d);
    if (!nd || seen.has(nd)) continue;
    seen.add(nd);
    distractors.push(d);
    if (distractors.length === targetCount - 1) break;
  }

  if (distractors.length < targetCount - 1) {
    throw new Error(`buildSingleOptions: недостаточно уникальных дистракторов для "${correctHtml}"`);
  }

  const options = rng.shuffle([correctHtml, ...distractors]);
  const answer = options.findIndex((o) => normalizeText(o) === normCorrect);
  return { options, answer };
}

/**
 * Сформировать 5 различных комбинаций номеров (например, "1, 3, 4" или "1, 3, 5; 2, 4, 6")
 * с единственно верным ответом.
 */
export function buildIndexSetOptions(rng, validIndices, totalItems, totalOptions = 5) {
  const sortedValid = [...validIndices].sort((a, b) => a - b);
  const correctStr = sortedValid.join(', ');
  const allNums = Array.from({ length: totalItems }, (_, i) => i + 1);
  const invalidNums = allNums.filter((n) => !sortedValid.includes(n));
  const pool = new Set();

  // Типичная ошибка — выбрать противоположное множество (или сдвинуть на 1-2 элемента)
  if (invalidNums.length >= 2) {
    pool.add(invalidNums.join(', '));
  }
  for (let attempt = 0; attempt < 40 && pool.size < 16; attempt++) {
    const k = Math.max(2, Math.min(totalItems - 1, sortedValid.length + rng.int(-1, 1)));
    const cand = rng.sample(allNums, k).sort((a, b) => a - b).join(', ');
    if (cand !== correctStr) pool.add(cand);
  }

  return buildSingleOptions(rng, correctStr, [...pool], totalOptions);
}

/**
 * Сформировать 5 вариантов для парного распределения 6 элементов (напр., 3 и 3: "1, 3, 5; 2, 4, 6").
 */
export function buildPairedSplitOptions(rng, groupA, groupB, totalOptions = 5) {
  const aSorted = [...groupA].sort((x, y) => x - y);
  const bSorted = [...groupB].sort((x, y) => x - y);
  const correctStr = `${aSorted.join(', ')}; ${bSorted.join(', ')}`;
  const reversedStr = `${bSorted.join(', ')}; ${aSorted.join(', ')}`;
  const all = [...aSorted, ...bSorted].sort((x, y) => x - y);
  const pool = new Set([reversedStr]);

  for (let attempt = 0; attempt < 50 && pool.size < 16; attempt++) {
    const pA = rng.sample(all, aSorted.length).sort((x, y) => x - y);
    const pB = all.filter((n) => !pA.includes(n));
    const cand = `${pA.join(', ')}; ${pB.join(', ')}`;
    if (cand !== correctStr) pool.add(cand);
  }

  return buildSingleOptions(rng, correctStr, [...pool], totalOptions);
}

/**
 * Построить чистую адаптивную inline-SVG диаграмму Эйлера–Венна (I / III / II).
 * Использует currentColor, корректно отображается в светлой и тёмной темах.
 */
export function renderVennSvg({
  leftTitle,
  rightTitle,
  leftMark = 'I',
  midMark = 'III',
  rightMark = 'II',
  openNumbers = false,
}) {
  const leftLines = wrapTextLines(leftTitle, 22);
  const rightLines = wrapTextLines(rightTitle, 22);
  const titleYBase = 24;

  const renderTitleLines = (lines, cx) =>
    lines
      .map((line, i) => {
        const y = titleYBase + i * 16;
        return `<text x="${cx}" y="${y}" text-anchor="middle" font-size="14" font-weight="600" font-style="italic" fill="currentColor">${escapeHtml(line)}</text>`;
      })
      .join('');

  const topOffset = Math.max(leftLines.length, rightLines.length) * 16 + 18;
  const cy = topOffset + 74;
  const rx = 122;
  const ry = 70;
  const cx1 = 165;
  const cx2 = 295;
  const svgHeight = cy + ry + 18;

  const insideText = openNumbers
    ? `<text x="108" y="${cy - 22}" text-anchor="middle" font-size="13" fill="currentColor">1.</text>
       <text x="108" y="${cy + 28}" text-anchor="middle" font-size="13" fill="currentColor">2.</text>
       <text x="230" y="${cy + 4}" text-anchor="middle" font-size="13" fill="currentColor">1.</text>
       <text x="352" y="${cy - 22}" text-anchor="middle" font-size="13" fill="currentColor">1.</text>
       <text x="352" y="${cy + 28}" text-anchor="middle" font-size="13" fill="currentColor">2.</text>`
    : `<text x="106" y="${cy + 6}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">${escapeHtml(leftMark)}</text>
       <text x="230" y="${cy + 6}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">${escapeHtml(midMark)}</text>
       <text x="354" y="${cy + 6}" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">${escapeHtml(rightMark)}</text>`;

  return `<svg viewBox="0 0 460 ${svgHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Диаграмма Эйлера-Венна">
    ${renderTitleLines(leftLines, cx1 - 24)}
    ${renderTitleLines(rightLines, cx2 + 24)}
    <ellipse cx="${cx1}" cy="${cy}" rx="${rx}" ry="${ry}" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.8"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${rx}" ry="${ry}" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.8"/>
    ${insideText}
  </svg>`;
}

/**
 * Построить адаптивный inline-SVG кластер (центральный блок + 5 лучей к узлам).
 * Подходит как для закрытых заданий (с заполненными узлами 1..5), так и для открытых (пустые поля).
 */
export function renderClusterSvg({ centerLabel, items = [], isOpen = false }) {
  if (isOpen) {
    // 5-лучевая схема как в PDF № 47 (центр + 5 пустых ячеек вокруг)
    const centerLines = wrapTextLines(centerLabel, 18);
    const centerStartY = 126 - ((centerLines.length - 1) * 16) / 2;
    const centerText = centerLines
      .map((l, idx) => `<text x="240" y="${centerStartY + idx * 17}" text-anchor="middle" font-size="14" font-weight="600" font-style="italic" fill="currentColor">${escapeHtml(l)}</text>`)
      .join('');

    return `<svg viewBox="0 0 480 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Кластер">
      <defs>
        <marker id="ru-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor"/>
        </marker>
      </defs>
      <rect x="20" y="18" width="130" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5"/>
      <rect x="330" y="18" width="130" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5"/>
      <rect x="20" y="100" width="110" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5"/>
      <rect x="350" y="100" width="110" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5"/>
      <rect x="175" y="182" width="130" height="44" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="240" cy="122" rx="78" ry="34" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.8"/>
      ${centerText}
      <line x1="185" y1="96" x2="132" y2="64" stroke="currentColor" stroke-width="1.4" marker-end="url(#ru-arrow)"/>
      <line x1="295" y1="96" x2="348" y2="64" stroke="currentColor" stroke-width="1.4" marker-end="url(#ru-arrow)"/>
      <line x1="162" y1="122" x2="133" y2="122" stroke="currentColor" stroke-width="1.4" marker-end="url(#ru-arrow)"/>
      <line x1="318" y1="122" x2="347" y2="122" stroke="currentColor" stroke-width="1.4" marker-end="url(#ru-arrow)"/>
      <line x1="240" y1="156" x2="240" y2="179" stroke="currentColor" stroke-width="1.4" marker-end="url(#ru-arrow)"/>
    </svg>`;
  }

  // Закрытый кластер: слева центральный блок, справа 5 пронумерованных блоков (как PDF 0903 #40)
  const centerLines = wrapTextLines(centerLabel, 15);
  const rowBoxes = items.slice(0, 5).map((txt, idx) => {
    const lines = wrapTextLines(`${idx + 1}. ${txt}`, 36).slice(0, 3);
    const boxH = Math.max(40, lines.length * 17 + 14);
    return { lines, boxH };
  });

  const gapY = 10;
  const totalRightH = rowBoxes.reduce((s, r) => s + r.boxH, 0) + gapY * (rowBoxes.length - 1);
  const svgH = Math.max(240, totalRightH + 24);
  const leftW = 148;
  const leftH = Math.max(66, centerLines.length * 18 + 20);
  const leftY = Math.round((svgH - leftH) / 2);
  const leftMidY = Math.round(svgH / 2);

  let curY = Math.round((svgH - totalRightH) / 2);
  const rightEls = [];
  const arrowEls = [];

  for (const r of rowBoxes) {
    const midY = curY + Math.round(r.boxH / 2);
    const textStartY = curY + 20;
    const tspans = r.lines
      .map((l, i) => `<text x="206" y="${textStartY + i * 17}" font-size="13.5" fill="currentColor">${escapeHtml(l)}</text>`)
      .join('');
    rightEls.push(
      `<rect x="194" y="${curY}" width="312" height="${r.boxH}" rx="7" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.4"/>${tspans}`
    );
    arrowEls.push(
      `<line x1="${16 + leftW}" y1="${leftMidY}" x2="191" y2="${midY}" stroke="currentColor" stroke-width="1.3" marker-end="url(#ru-cl-arrow)"/>`
    );
    curY += r.boxH + gapY;
  }

  const cTextStartY = leftY + Math.round((leftH - (centerLines.length - 1) * 18) / 2) + 5;
  const cTexts = centerLines
    .map((l, i) => `<text x="${16 + leftW / 2}" y="${cTextStartY + i * 18}" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">${escapeHtml(l)}</text>`)
    .join('');

  return `<svg viewBox="0 0 520 ${svgH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Кластерная схема">
    <defs>
      <marker id="ru-cl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <rect x="16" y="${leftY}" width="${leftW}" height="${leftH}" rx="8" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.8"/>
    ${cTexts}
    ${arrowEls.join('')}
    ${rightEls.join('')}
  </svg>`;
}

/** Сформировать чистую HTML-таблицу (без атрибутов style=). */
export function renderTableHtml(headers, rows, footerRow = null) {
  const thead = headers?.length
    ? `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`
    : '';
  const bodyRows = rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('');
  const foot = footerRow
    ? `<tr><td colspan="${headers?.length || rows[0]?.length || 2}"><b>${footerRow}</b></td></tr>`
    : '';
  return `<table>${thead}<tbody>${bodyRows}${foot}</tbody></table>`;
}
