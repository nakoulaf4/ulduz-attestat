// Combined passage bank & parameterized closed/open reading task builders.

import { LITERARY_PASSAGES } from './passages-lit.js';
import { INFORMATIONAL_PASSAGES } from './passages-inf.js';
import { buildSingleOptions, buildComboOptions, fmtNums } from '../az-rules.js';

export { LITERARY_PASSAGES, INFORMATIONAL_PASSAGES };
export const ALL_PASSAGES = [...LITERARY_PASSAGES, ...INFORMATIONAL_PASSAGES];

const STATUSES = ['Doğrudur', 'Yanlışdır', 'Ehtimaldır'];

/**
 * Build one closed reading task (`single`, 1 pt) for a given passage & slot (0..4).
 */
export function buildReadingClosedTask(rng, p, slotIdx, difficulty = 2) {
  const passage = { id: p.id, title: p.title, html: p.html };

  switch (slotIdx % 5) {
    case 0: {
      // Table: Doğrudur | Yanlışdır | Ehtimaldır (0903#43 / 0903#55 style)
      const byStatus = {
        Doğrudur: rng.shuffle(p.truthPool.filter((x) => x.status === 'Doğrudur')),
        Yanlışdır: rng.shuffle(p.truthPool.filter((x) => x.status === 'Yanlışdır')),
        Ehtimaldır: rng.shuffle(p.truthPool.filter((x) => x.status === 'Ehtimaldır')),
      };
      // Build 6 items (2 per column). In each column, 1 matches its true status and 1 does not (or 2+1),
      // ensuring 3–4 matching items total.
      const pool = [
        byStatus.Doğrudur[0],
        byStatus.Yanlışdır[0],
        byStatus.Ehtimaldır[0],
        byStatus.Doğrudur[1] ?? byStatus.Yanlışdır[1],
        byStatus.Yanlışdır[1] ?? byStatus.Ehtimaldır[1],
        byStatus.Ehtimaldır[1] ?? byStatus.Doğrudur[1],
      ].filter(Boolean);

      // Assign 2 items per column: col 0 (Doğrudur), col 1 (Yanlışdır), col 2 (Ehtimaldır)
      // Guarantee each column gets 1 matching and 1 mismatched statement!
      const colItems = { Doğrudur: [], Yanlışdır: [], Ehtimaldır: [] };
      colItems.Doğrudur.push(byStatus.Doğrudur[0]);
      colItems.Doğrudur.push(byStatus.Yanlışdır[1] ?? byStatus.Ehtimaldır[1]);

      colItems.Yanlışdır.push(byStatus.Yanlışdır[0]);
      colItems.Yanlışdır.push(byStatus.Ehtimaldır[1] ?? byStatus.Doğrudur[1]);

      colItems.Ehtimaldır.push(byStatus.Ehtimaldır[0]);
      colItems.Ehtimaldır.push(byStatus.Doğrudur[1] ?? byStatus.Yanlışdır[1]);

      // Shuffle order inside each column so matching item isn't always first
      for (const s of STATUSES) colItems[s] = rng.shuffle(colItems[s]);

      // Number them 1..6 (top row 1,3,5; bottom row 2,4,6 — matching DİM layout)
      const numbered = [
        { num: 1, col: 'Doğrudur', item: colItems.Doğrudur[0] },
        { num: 2, col: 'Doğrudur', item: colItems.Doğrudur[1] },
        { num: 3, col: 'Yanlışdır', item: colItems.Yanlışdır[0] },
        { num: 4, col: 'Yanlışdır', item: colItems.Yanlışdır[1] },
        { num: 5, col: 'Ehtimaldır', item: colItems.Ehtimaldır[0] },
        { num: 6, col: 'Ehtimaldır', item: colItems.Ehtimaldır[1] },
      ];
      const correctNums = numbered.filter((x) => x.item.status === x.col).map((x) => x.num);
      const { options, answer } = buildComboOptions(rng, correctNums, 6, 5);

      const tableHtml =
        `<table><thead><tr><th>Doğrudur</th><th>Yanlışdır</th><th>Ehtimaldır</th></tr></thead>` +
        `<tbody>` +
        `<tr><td>1. ${numbered[0].item.text}</td><td>3. ${numbered[2].item.text}</td><td>5. ${numbered[4].item.text}</td></tr>` +
        `<tr><td>2. ${numbered[1].item.text}</td><td>4. ${numbered[3].item.text}</td><td>6. ${numbered[5].item.text}</td></tr>` +
        `</tbody></table>`;

      const expLines = numbered.map((x) =>
        `${x.num}) «${x.item.text}» — фактически <i>${x.item.status}</i> (размещено в столбце «${x.col}» → ${x.item.status === x.col ? 'верно' : 'неверно'}).`
      );

      return {
        passage,
        stem: `<p>Mətnə əsasən cədvəldəki <b>uyğun</b> (düzgün yerləşdirilmiş) fikirləri müəyyən edin:</p>${tableHtml}`,
        format: 'single',
        options,
        answer,
        points: 1,
        difficulty,
        explanation: `В таблице нужно выбрать пункты, чей фактический статус совпадает со столбцом:<br>${expLines.join('<br>')}<br><b>Верный набор:</b> ${fmtNums(correctNums)}.`,
      };
    }

    case 1: {
      // Cannot determine / missing information (0903#41 style)
      const shuffled = rng.shuffle(p.cantDetermine.items).map((it, i) => ({ ...it, num: i + 1 }));
      const correctNums = shuffled.filter((x) => x.cant).map((x) => x.num);
      const { options, answer } = buildComboOptions(rng, correctNums, shuffled.length, 5);
      const listHtml = shuffled.map((x) => `${x.num}. ${x.text}`).join('<br>');

      return {
        passage,
        stem: `<p>${p.cantDetermine.stem}</p><p>${listHtml}</p>`,
        format: 'single',
        options,
        answer,
        points: 1,
        difficulty,
        explanation: `${p.cantDetermine.note} (в данном порядке пунктов: <b>${fmtNums(correctNums)}</b>).`,
      };
    }

    case 2: {
      // Removable numbered sentences (0903#42 / 1503#42 style)
      const okStr = fmtNums(p.removable.ok);
      const distractorNums = [
        [p.removable.ok[0], p.removable.bad[0]],
        [p.removable.ok[1], p.removable.bad[1]],
        [p.removable.bad[0], p.removable.bad[1]],
        [p.removable.bad[1], p.removable.bad[2]],
      ].map((arr) => fmtNums(arr));
      const { options, answer } = buildSingleOptions(rng, okStr, distractorNums, 5);

      return {
        passage,
        stem: 'Mətndə əvvəlində rəqəm yazılmış hansı cümlələr mətndən çıxarılsa, məzmuna və məntiqi ardıcıllığa xələl <b>gəlməz</b>?',
        format: 'single',
        options,
        answer,
        points: 1,
        difficulty,
        explanation: `Без ущерба для логики текста можно удалить предложения <b>${okStr}</b>: ${p.removable.note}`,
      };
    }

    case 3: {
      // Insert sentence into [I]–[V] (0903#51 style)
      const allSlots = ['I', 'II', 'III', 'IV', 'V'];
      const correctSlot = p.insertSentence.correctSlot;
      const distractors = allSlots.filter((s) => s !== correctSlot);
      const { options, answer } = buildSingleOptions(rng, correctSlot, distractors, 5);

      return {
        passage,
        stem: `<p><i>«${p.insertSentence.quote}»</i> cümləsi mətndə nömrələnmiş hansı çərçivənin yerinə artırılsa, məzmun ardıcıllığı pozulmaz?</p>`,
        format: 'single',
        options,
        answer,
        points: 1,
        difficulty,
        explanation: `Верная позиция — <b>[${correctSlot}]</b>: ${p.insertSentence.note}`,
      };
    }

    case 4:
    default: {
      // Contextual meaning of word with superscript 1 (0903#54 style)
      const { targetWord, meaning1, exOk, exWrong, note } = p.polysemy;
      const { options, answer } = buildSingleOptions(rng, exOk, exWrong, 5);

      return {
        passage,
        stem: `Mətndə üzərində <b>1</b> rəqəmi yazılmış «<b>${targetWord}</b>» sözü hansı nümunədə kontekstə görə mətndəki mənasında işlədilmişdir?`,
        format: 'single',
        options,
        answer,
        points: 1,
        difficulty,
        explanation: `В тексте слово «${targetWord}» означает «${meaning1}». ${note}`,
      };
    }
  }
}

/**
 * Build one open written reading task (`open`, 2 pts) for a given passage & slot (0..4).
 */
export function buildReadingOpenTask(p, slotIdx, difficulty = 2) {
  const passage = { id: p.id, title: p.title, html: p.html };
  const item = p.openSet[slotIdx % p.openSet.length];
  return {
    passage,
    stem: item.stem,
    format: 'open',
    answer: item.answer,
    rubric: item.rubric,
    points: 2,
    difficulty,
    explanation: item.explanation,
  };
}
