// Topic Lesson & Inline Russian YouTube Video Studio (#/lesson/:id?topic=...)
// Combines written theory, KaTeX formulas, Factory Records SVG technical diagrams,
// worked step-by-step examples, DİM exam traps, and inline YouTube video playback.

import { getSubject } from '../../subjects/index.js';
import { getSubjectLessons, findTopicLesson } from '../../lessons/index.js';
import { renderLessonDiagram } from '../../lessons/svg-diagrams.js';
import { openExternalUrl, haptic } from '../../core/native.js';
import { t, subjectTitle } from '../i18n.js';
import { icon } from '../icons.js';
import { escapeHtml, prepareRichHtml, hydrateMath } from '../math.js';
import { SUBJECT_CODES } from '../fx-engine.js';

function formatLessonText(raw) {
  const html = prepareRichHtml(String(raw || ''));
  return html.replace(/`([^`]+)`/g, '<code class="lesson-inline-code">$1</code>');
}

export async function renderLessonView(container, { params, query, navigate }) {
  const subjectId = params.id;
  const subject = await getSubject(subjectId);
  if (!subject) {
    navigate('#/');
    return;
  }

  const lessons = await getSubjectLessons(subjectId);
  if (!lessons.length) {
    navigate(`#/subject/${subjectId}`);
    return;
  }

  const requestedTopic = query.get('topic') || '';
  let currentLesson = (await findTopicLesson(subjectId, requestedTopic)) || lessons[0];
  let activeVideoIdx = 0;

  const localizedSubject = subjectTitle(subjectId);
  const codeMeta = SUBJECT_CODES[subjectId] || { catNo: 'DİM', color: '#2663C9' };

  function render() {
    const videos = Array.isArray(currentLesson.videos) ? currentLesson.videos : [];
    const activeVideo = videos[activeVideoIdx] || videos[0] || null;
    const topicIdx = lessons.findIndex((l) => l.topic === currentLesson.topic);
    const prevLesson = topicIdx > 0 ? lessons[topicIdx - 1] : null;
    const nextLesson = topicIdx >= 0 && topicIdx < lessons.length - 1 ? lessons[topicIdx + 1] : null;
    const pracHref = `#/practice/${subjectId}?topic=${encodeURIComponent(currentLesson.topic)}`;

    container.innerHTML = `
      <div class="page-container">
        <section class="lesson-page fade-in">
          <nav class="breadcrumbs" aria-label="${escapeHtml(t('breadcrumbsAria'))}">
            <a href="#/">${escapeHtml(t('navHome'))}</a>
            <span aria-hidden="true">/</span>
            <a href="#/subject/${escapeHtml(subjectId)}">${escapeHtml(localizedSubject)}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${escapeHtml(t('lessonBreadcrumb'))}</span>
          </nav>

          <nav class="lesson-topic-strip" aria-label="${escapeHtml(t('lessonTopicsAria'))}">
            ${lessons.map((l, idx) => {
              const active = l.topic === currentLesson.topic;
              return `<button type="button" class="lesson-topic-chip ${active ? 'is-active' : ''}" data-topic-idx="${idx}">
                <span class="lesson-topic-chip__num mono-code">${String(idx + 1).padStart(2, '0')}</span>
                <span class="lesson-topic-chip__label">${escapeHtml(l.topic)}</span>
              </button>`;
            }).join('')}
          </nav>

          <header class="lesson-hero">
            <div class="lesson-hero__meta">
              <span class="fac-code-stamp mono-code" style="border-color: ${codeMeta.color}; color: ${codeMeta.color};">${escapeHtml(codeMeta.catNo)}</span>
              <span class="lesson-hero__index mono-code">${escapeHtml(t('lessonCounter', { current: topicIdx + 1, total: lessons.length }))}</span>
            </div>
            <h1 class="lesson-hero__title">${escapeHtml(currentLesson.topic)}</h1>
            <p class="lesson-hero__sub">${escapeHtml(currentLesson.subtitle || '')}</p>
            <p class="lesson-hero__summary">${formatLessonText(currentLesson.summary || '')}</p>
            <div class="lesson-hero__actions">
              <a class="btn btn--primary" href="${pracHref}">${icon('play', { size: 15 })} <span>${escapeHtml(t('lessonPracticeTopicBtn'))}</span></a>
              <a class="btn btn--secondary" href="#/exam/${escapeHtml(subjectId)}">${icon('clock', { size: 15 })} <span>${escapeHtml(t('lessonExamBtn'))}</span></a>
              <button type="button" class="btn btn--secondary" data-ask-ai-topic>${icon('sparkles', { size: 15 })} <span>${escapeHtml(t('lessonAskAiBtn'))}</span></button>
            </div>
          </header>

          ${activeVideo ? `
            <section class="lesson-block lesson-video-section" aria-label="${escapeHtml(t('lessonVideoSectionTitle'))}">
              <div class="lesson-block__head">
                <div>
                  <h2 class="lesson-block__title">${icon('video', { size: 17 })} <span>${escapeHtml(t('lessonVideoSectionTitle'))}</span></h2>
                  <p class="lesson-block__sub">${escapeHtml(t('lessonVideoSectionSub'))}</p>
                </div>
                <button type="button" class="btn btn--secondary btn--sm" data-open-yt="${escapeHtml(activeVideo.id)}">
                  ${icon('external-link', { size: 14 })}
                  <span>${escapeHtml(t('lessonOpenYoutubeBtn'))}</span>
                </button>
              </div>

              <div class="lesson-video-stage">
                <div class="lesson-video-frame">
                  <iframe
                    id="lesson-yt-iframe"
                    src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(activeVideo.id)}?rel=0&amp;modestbranding=1"
                    title="${escapeHtml(activeVideo.title)}"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowfullscreen
                  ></iframe>
                </div>
                <div class="lesson-video-now">
                  <span class="lesson-video-now__title">${escapeHtml(activeVideo.title)}</span>
                  <span class="lesson-video-now__channel mono-code">${escapeHtml(activeVideo.channel)} · RU</span>
                </div>
              </div>

              ${videos.length > 1 ? `
                <div class="lesson-video-playlist">
                  ${videos.map((v, i) => `
                    <button type="button" class="lesson-video-card ${i === activeVideoIdx ? 'is-active' : ''}" data-video-idx="${i}">
                      <span class="lesson-video-card__num mono-code">${String(i + 1).padStart(2, '0')}</span>
                      <span class="lesson-video-card__info">
                        <span class="lesson-video-card__title">${escapeHtml(v.title)}</span>
                        <span class="lesson-video-card__channel mono-code">${escapeHtml(v.channel)}</span>
                      </span>
                      <span class="lesson-video-card__play">${icon('play', { size: 13 })}</span>
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </section>
          ` : ''}

          <div class="lesson-grid">
            <section class="lesson-block lesson-diagram-section">
              <div class="lesson-block__head">
                <h2 class="lesson-block__title">${icon('layers', { size: 17 })} <span>${escapeHtml(t('lessonVisualSectionTitle'))}</span></h2>
              </div>
              <div class="lesson-svg-box">
                ${renderLessonDiagram(currentLesson.diagram)}
              </div>
            </section>

            <section class="lesson-block lesson-theory-section">
              <div class="lesson-block__head">
                <h2 class="lesson-block__title">${icon('book-open', { size: 17 })} <span>${escapeHtml(t('lessonTheorySectionTitle'))}</span></h2>
              </div>
              ${(currentLesson.sections || []).map((sec) => `
                <article class="lesson-article">
                  <h3 class="lesson-article__heading">${escapeHtml(sec.heading)}</h3>
                  <p class="lesson-article__body">${formatLessonText(sec.body)}</p>
                  ${sec.bullets?.length ? `
                    <ul class="lesson-bullets">
                      ${sec.bullets.map((b) => `<li>${formatLessonText(b)}</li>`).join('')}
                    </ul>
                  ` : ''}
                </article>
              `).join('')}
            </section>
          </div>

          ${currentLesson.formulas?.length ? `
            <section class="lesson-block lesson-formulas-section">
              <div class="lesson-block__head">
                <h2 class="lesson-block__title">${icon('calculator', { size: 17 })} <span>${escapeHtml(t('lessonFormulasTitle'))}</span></h2>
              </div>
              <div class="lesson-formula-grid">
                ${currentLesson.formulas.map((f) => `
                  <div class="lesson-formula-card">$$${f}$$</div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <div class="lesson-grid">
            ${currentLesson.example ? `
              <section class="lesson-block lesson-example-section">
                <div class="lesson-block__head">
                  <h2 class="lesson-block__title">${icon('check-circle', { size: 17 })} <span>${escapeHtml(t('lessonExampleTitle'))}</span></h2>
                </div>
                <div class="lesson-example-problem">${formatLessonText(currentLesson.example.problem)}</div>
                <ol class="lesson-example-steps">
                  ${(currentLesson.example.steps || []).map((st) => `<li>${formatLessonText(st)}</li>`).join('')}
                </ol>
                <div class="lesson-example-answer">
                  <strong>${escapeHtml(t('lessonAnswerLabel'))}:</strong> ${formatLessonText(currentLesson.example.answer)}
                </div>
              </section>
            ` : ''}

            ${currentLesson.traps?.length ? `
              <section class="lesson-block lesson-traps-section">
                <div class="lesson-block__head">
                  <h2 class="lesson-block__title">${icon('alert-triangle', { size: 17 })} <span>${escapeHtml(t('lessonTrapsTitle'))}</span></h2>
                </div>
                <ul class="lesson-traps-list">
                  ${currentLesson.traps.map((tr) => `<li>${formatLessonText(tr)}</li>`).join('')}
                </ul>
              </section>
            ` : ''}
          </div>

          <footer class="lesson-pager">
            ${prevLesson ? `
              <button type="button" class="btn btn--secondary" data-topic-idx="${topicIdx - 1}">
                ${icon('arrow-left', { size: 15 })} <span>${escapeHtml(prevLesson.topic)}</span>
              </button>
            ` : '<span></span>'}
            ${nextLesson ? `
              <button type="button" class="btn btn--primary" data-topic-idx="${topicIdx + 1}">
                <span>${escapeHtml(nextLesson.topic)}</span> ${icon('arrow-right', { size: 15 })}
              </button>
            ` : `<a class="btn btn--primary" href="${pracHref}">${icon('play', { size: 15 })} <span>${escapeHtml(t('lessonPracticeTopicBtn'))}</span></a>`}
          </footer>
        </section>
      </div>
    `;

    hydrateMath(container);

    container.querySelectorAll('[data-topic-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.topicIdx);
        if (lessons[idx]) {
          haptic('light');
          currentLesson = lessons[idx];
          activeVideoIdx = 0;
          const nextHash = `#/lesson/${subjectId}?topic=${encodeURIComponent(currentLesson.topic)}`;
          if (location.hash !== nextHash) {
            history.replaceState(null, '', nextHash);
          }
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    container.querySelectorAll('[data-video-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.videoIdx);
        if (idx !== activeVideoIdx && videos[idx]) {
          haptic('light');
          activeVideoIdx = idx;
          render();
        }
      });
    });

    container.querySelector('[data-open-yt]')?.addEventListener('click', (e) => {
      const vid = e.currentTarget.dataset.openYt;
      if (vid) {
        haptic('light');
        openExternalUrl(`https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`);
      }
    });

    container.querySelector('[data-ask-ai-topic]')?.addEventListener('click', () => {
      haptic('light');
      const prompt = `Объясни мне подробнее тему «${currentLesson.topic}» по предмету ${localizedSubject} и дай 2 тренировочных примера с разбором в формате экзамена ДИМ.`;
      try {
        sessionStorage.setItem('ulduz_ai_pending_prompt', prompt);
      } catch { /* ignore */ }
      navigate('#/ai');
    });

    const activeChip = container.querySelector('.lesson-topic-chip.is-active');
    if (activeChip && typeof activeChip.scrollIntoView === 'function') {
      activeChip.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    }
  }

  render();
}
