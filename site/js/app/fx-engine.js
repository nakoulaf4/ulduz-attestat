// Ulduz — Factory Records / Peter Saville Interactive Pulsar & Signal Engine
// Powers:
// 1. Live angled 3D axonometric floating Pulsar Ridgefield Canvas (CP1919 high-frequency spikes + matte stock void)
// 2. Full-scale jagged high-frequency SVG Polar Spectrum plots (180-sample radial telemetry + compass ticks)
// 3. 10-block Saville Industrial Signal Readout bars
// 4. Horizontal top-hairline transmission impulse wave on answer checks & edition changes

export const DEFAULT_FX_MODE = 'tactile';
export const VALID_FX_MODES = ['minimal', 'tactile', 'webgl'];

export function normalizeFxMode(raw) {
  return typeof raw === 'string' && VALID_FX_MODES.includes(raw) ? raw : DEFAULT_FX_MODE;
}

export const SUBJECT_CODES = {
  math: { catNo: 'DİM 01', num: '01', color: '#D63031', onColor: '#FFFFFF', short: 'МАТ' },
  ru:   { catNo: 'DİM 02', num: '02', color: '#2663C9', onColor: '#FFFFFF', short: 'РУС' },
  en:   { catNo: 'DİM 03', num: '03', color: '#DFB41D', onColor: '#0C0C0E', short: 'ENG' },
  az:   { catNo: 'DİM 04', num: '04', color: '#2E9E5B', onColor: '#0C0C0E', short: 'AZ'  },
};

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

/** Deterministic fast hash in [0, 1] for authentic CP1919 high-frequency spiky noise */
function hash1(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function fbm1(x, seed) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = hash1(i + seed * 19.31);
  const b = hash1(i + 1 + seed * 19.31);
  return a + (b - a) * u;
}

/**
 * Trigger a crisp 2px horizontal Factory Records transmission scan pulse along #fac-impulse-bar.
 * @param {'correct'|'partial'|'wrong'|'milestone'|'unlock'|'nav'} kind
 */
export function facFireImpulse(kind = 'nav') {
  const bar = document.getElementById('fac-impulse-bar');
  if (!bar) return;
  const colorMap = {
    correct:   '#2E9E5B',
    partial:   '#DFB41D',
    wrong:     '#D63031',
    milestone: '#DFB41D',
    unlock:    '#D63031',
    nav:       'var(--fac-ink)',
  };
  bar.style.setProperty('--impulse-color', colorMap[kind] || 'var(--fac-ink)');
  bar.classList.remove('is-firing');
  void bar.offsetWidth;
  bar.classList.add('is-firing');
  window.clearTimeout(bar._t);
  bar._t = window.setTimeout(() => bar.classList.remove('is-firing'), 560);
}

/**
 * Build an iconic 10-block Factory Records horizontal signal meter (■■■■■■■■□□).
 * @param {number} pct 0..100
 * @param {string} accentColor CSS color or hex
 * @param {{ blocks?: number, ariaLabel?: string }} [opts]
 */
export function buildSignalMeterHtml(pct, accentColor = 'var(--fac-red)', { blocks = 10, ariaLabel = '' } = {}) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  const lit = Math.round((clamped / 100) * blocks);
  const cells = [];
  for (let i = 0; i < blocks; i++) {
    const isLit = i < lit;
    const isPeak = isLit && i === lit - 1;
    cells.push(
      `<span class="fac-sig-block ${isLit ? 'is-lit' : ''} ${isPeak ? 'is-peak' : ''}" style="${isLit ? `--sig-c:${accentColor}` : ''}"></span>`
    );
  }
  const aria = ariaLabel ? ` aria-label="${ariaLabel.replace(/"/g, '&quot;')}"` : '';
  return `<div class="fac-sig-meter" role="progressbar" aria-valuenow="${clamped}" aria-valuemin="0" aria-valuemax="100"${aria}>${cells.join('')}</div>`;
}

/**
 * Build a full-scale Factory Records high-frequency concentric polar spectrum SVG.
 * Uses 180-sample jagged pulsar spikes (never smooth 6-petal amoebas!), 5 concentric rings,
 * 24 radial degree ticks, and honest dormant baseline when pct === 0.
 * @param {number} pct 0..100 (real solved/status ratio; 0 renders delicate baseline trace)
 * @param {string} accentHex
 * @param {{ size?: number, seed?: number }} [opts]
 */
export function buildRadialSpectrumSvg(pct, accentHex = '#D63031', { size = 196, seed = 17 } = {}) {
  const cx = 110;
  const cy = 110;
  const rInner = 18;
  const rOuter = 94;
  const rawPct = Math.max(0, Math.min(100, Number(pct) || 0));
  // Honest visual amplitude: 0% shows quiet baseline telemetry ring, higher % expands sharp radial bursts
  const activeScale = rawPct === 0 ? 0.32 : (0.44 + (rawPct / 100) * 0.56);

  const circles = [30, 46, 62, 78, 94].map(
    (r, idx) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${idx === 4 ? 'fac-rad-grid fac-rad-grid--outer' : 'fac-rad-grid'}" />`
  );

  // 24 precision radial ticks (every 15°), with major axis spokes every 90°
  const radials = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 6 === 0;
    const r0 = isMajor ? rInner : rOuter - 7;
    const r1 = rOuter + (isMajor ? 5 : 0);
    const x1 = (cx + Math.cos(a) * r0).toFixed(1);
    const y1 = (cy + Math.sin(a) * r0).toFixed(1);
    const x2 = (cx + Math.cos(a) * r1).toFixed(1);
    const y2 = (cy + Math.sin(a) * r1).toFixed(1);
    radials.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${isMajor ? 'fac-rad-axis' : 'fac-rad-grid'}" />`);
  }

  // Primary high-frequency jagged pulsar trace (180 samples around 360°)
  const steps = 180;
  const ptsOuter = [];
  const ptsEcho = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2 - Math.PI / 2;
    // Cluster sharp stochastic needle bursts along 5 asymmetric telemetry azimuths
    const burst1 = Math.exp(-Math.pow(Math.sin((a - seed * 0.41) * 1.5), 2) * 18);
    const burst2 = Math.exp(-Math.pow(Math.sin((a + seed * 0.73) * 2.5), 2) * 26);
    const spike = Math.pow(hash1(i * 1.37 + seed * 11.7), 3.4);
    const fine = fbm1(i * 0.42, seed) * 0.45 + fbm1(i * 1.15, seed + 5) * 0.55;
    const amp = (burst1 * 48 + burst2 * 34) * (0.28 + spike * 0.92) + fine * 14 * (0.4 + spike);
    const r = Math.min(rOuter - 1, rInner + 14 + amp * activeScale);
    const x = (cx + Math.cos(a) * r).toFixed(1);
    const y = (cy + Math.sin(a) * r).toFixed(1);
    ptsOuter.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);

    // Secondary echo harmonic ring
    const rE = Math.min(rOuter - 8, rInner + 8 + amp * activeScale * 0.52);
    const xe = (cx + Math.cos(a) * rE).toFixed(1);
    const ye = (cy + Math.sin(a) * rE).toFixed(1);
    ptsEcho.push(`${i === 0 ? 'M' : 'L'}${xe},${ye}`);
  }
  const wavePath = ptsOuter.join(' ') + ' Z';
  const echoPath = ptsEcho.join(' ') + ' Z';

  return `
    <svg class="fac-radial-svg" viewBox="0 0 220 220" width="${size}" height="${size}" aria-hidden="true" focusable="false">
      ${circles.join('')}
      ${radials.join('')}
      <path d="${echoPath}" class="fac-rad-echo" />
      <path d="${wavePath}" class="fac-rad-wave" />
      <circle cx="${cx}" cy="${cy}" r="${rInner}" class="fac-rad-core" />
      <circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="${accentHex}" stroke-width="1" />
      <circle cx="${cx}" cy="${cy}" r="2.6" fill="${accentHex}" />
      <text x="${cx}" y="10" text-anchor="middle" class="fac-rad-deg">000</text>
      <text x="212" y="${cy + 3}" text-anchor="end" class="fac-rad-deg">090</text>
      <text x="${cx}" y="216" text-anchor="middle" class="fac-rad-deg">180</text>
      <text x="8" y="${cy + 3}" text-anchor="start" class="fac-rad-deg">270</text>
    </svg>
  `;
}

/**
 * Mount a live interactive angled 3D axonometric floating Factory Records Pulsar Canvas.
 * Floats inside generous matte-stock void margins with authentic high-frequency jagged CP1919 spikes,
 * diagonal 3D perspective shear, active subject color highlight, and tactile stock transparency.
 */
export function mountHomePulsar(canvas, { statsBySubject = {}, activeSubject = 'math', onSelectSubject = null } = {}) {
  if (!canvas) return { setActive() {}, pulse() {}, destroy() {} };
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setActive() {}, pulse() {}, destroy() {} };

  let currentSubject = activeSubject || 'math';
  let destroyed = false;
  let rafId = 0;
  let pointerX = 0.5;
  let pointerY = 0.5;
  let targetX = 0.5;
  let targetY = 0.5;
  let pointerInside = false;
  let shockAmp = 0;
  let phase = 0;
  let lastTs = performance.now();

  const subjOrder = ['math', 'ru', 'en', 'az'];
  const subjAcc = subjOrder.map((id, idx) => {
    const s = statsBySubject?.[id];
    if (!s || !s.attempted) return 0.52 + idx * 0.07;
    return Math.max(0.32, Math.min(1, s.correct / s.attempted));
  });

  function getThemeColors() {
    const cs = getComputedStyle(document.documentElement);
    const isLight = document.documentElement.getAttribute('data-color-scheme') === 'light';
    return {
      bg: cs.getPropertyValue('--fac-ground').trim() || (isLight ? '#ECECEB' : '#0C0C0E'),
      ink: cs.getPropertyValue('--fac-ink').trim() || (isLight ? '#0C0C0E' : '#EAEAE6'),
      muted: cs.getPropertyValue('--fac-muted').trim() || '#848482',
      isLight,
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(260, Math.round(rect.width));
    const h = Math.max(180, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  function drawFrame(now) {
    if (destroyed) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
    lastTs = now;

    const fxMode = document.documentElement.getAttribute('data-fx') || 'tactile';
    const isStatic = prefersReducedMotion() || fxMode === 'minimal';
    const isUltra = fxMode === 'webgl';

    if (!isStatic) {
      phase += dt * (isUltra ? 0.95 : 0.55);
      pointerX += (targetX - pointerX) * Math.min(1, dt * 6);
      pointerY += (targetY - pointerY) * Math.min(1, dt * 6);
      shockAmp *= Math.exp(-dt * 4.5);
    } else {
      shockAmp = 0;
    }

    const { w, h } = resize();
    const colors = getThemeColors();
    // Clear transparently so real tactile matte-stock raster tile shows straight through the void!
    ctx.clearRect(0, 0, w, h);

    const isCompact = w < 520 || h < 260;
    const rows = isCompact ? 26 : (isUltra ? 48 : 38);
    const cols = isCompact ? 96 : 148;

    // Generous matte-stock void margins around the floating 3D axonometric ridgefield
    const slabW = isCompact ? w * 0.78 : Math.min(w * 0.68, 660);
    const slabH = isCompact ? h * 0.62 : Math.min(h * 0.64, 410);
    const shearX = isCompact ? w * 0.08 : Math.min(w * 0.12, 118); // diagonal 3D axonometric shear!
    const slopeY = isCompact ? -6 : -14; // subtle isometric tilt along each ridge line

    const originX = (w - slabW) * 0.5 + shearX * 0.5;
    const originY = isCompact ? h * 0.30 : h * 0.25;
    const rowStepY = slabH / Math.max(1, rows - 1);
    const rowStepX = -shearX / Math.max(1, rows - 1);

    const activeIdx = Math.max(0, subjOrder.indexOf(currentSubject));
    const activeInfo = SUBJECT_CODES[currentSubject] || SUBJECT_CODES.math;
    const activeCenterRow = Math.round(((activeIdx + 0.5) / 4) * (rows - 1));

    // Precision architectural corner ticks framing the floating 3D pulsar field (desktop)
    if (!isCompact) {
      const fx0 = Math.max(24, originX - shearX - 24);
      const fx1 = Math.min(w - 24, originX + slabW + 24);
      const fy0 = Math.max(22, originY - 46);
      const fy1 = Math.min(h - 22, originY + slabH + 18);
      const tick = 10;
      ctx.save();
      ctx.strokeStyle = colors.isLight ? 'rgba(12,12,14,0.28)' : 'rgba(234,234,230,0.24)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Top-left & bottom-right surveyor crop marks
      ctx.moveTo(fx0, fy0 + tick); ctx.lineTo(fx0, fy0); ctx.lineTo(fx0 + tick, fy0);
      ctx.moveTo(fx1 - tick, fy0); ctx.lineTo(fx1, fy0); ctx.lineTo(fx1, fy0 + tick);
      ctx.moveTo(fx0, fy1 - tick); ctx.lineTo(fx0, fy1); ctx.lineTo(fx0 + tick, fy1);
      ctx.moveTo(fx1 - tick, fy1); ctx.lineTo(fx1, fy1); ctx.lineTo(fx1, fy1 - tick);
      ctx.stroke();
      ctx.restore();
    }

    // Ultra mode subtle vertical coordinate crosshair on hover
    if (isUltra && pointerInside && !isStatic) {
      const gx = pointerX * w;
      ctx.save();
      ctx.strokeStyle = colors.isLight ? 'rgba(12,12,14,0.16)' : 'rgba(234,234,230,0.16)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(gx, 18);
      ctx.lineTo(gx, h - 18);
      ctx.stroke();
      ctx.restore();
    }

    const maxPeak = isCompact ? Math.min(54, h * 0.25) : Math.min(104, h * 0.23);

    for (let r = 0; r < rows; r++) {
      const baseStartX = originX + r * rowStepX;
      const baseStartY = originY + r * rowStepY;
      const bandIdx = Math.min(3, Math.floor((r / rows) * 4));
      const bandStrength = subjAcc[bandIdx];
      const distToActive = Math.abs(r - activeCenterRow);
      const isActiveLine = distToActive === 0;
      const isNearActive = distToActive <= 2;

      const rowSeed = r * 7.13 + bandIdx * 31.7;
      const pShift = pointerInside ? (pointerX - 0.5) * 0.09 : 0;
      const cMain = 0.44 + (hash1(r * 3.1) - 0.5) * 0.14 + Math.sin(r * 0.26 + phase * 0.45) * 0.03 + pShift;
      const cLeft = 0.29 + (hash1(r * 5.7) - 0.5) * 0.09 + pShift * 0.6;
      const cRight = 0.64 + (hash1(r * 4.3) - 0.5) * 0.10 + pShift * 0.6;

      // Calm flat flanks, jagged central CP1919 telemetry burst!
      const rowEnv = 0.34 + 0.66 * Math.pow(Math.sin(((r + 0.5) / rows) * Math.PI), 0.85);
      const activeBoost = isActiveLine ? 1.32 : (isNearActive ? 1.1 : 1.0);
      const shockBoost = 1 + shockAmp * Math.exp(-Math.pow((r - activeCenterRow) * 0.32, 2)) * 0.72;

      const ptsX = new Float32Array(cols + 1);
      const ptsY = new Float32Array(cols + 1);

      for (let i = 0; i <= cols; i++) {
        const t = i / cols;
        // Steep Tukey-like central window -> flat architectural baselines on outer 18% flanks
        const centerWindow = Math.pow(Math.max(0, Math.sin(Math.PI * t)), 2.2);

        // Multi-peak high-frequency spiky pulsar burst
        const envMain = Math.exp(-Math.pow((t - cMain) * 11.5, 2));
        const envLeft = Math.exp(-Math.pow((t - cLeft) * 16.0, 2));
        const envRight = Math.exp(-Math.pow((t - cRight) * 14.5, 2));

        // Sharp jagged harmonic spikes (CP1919 telemetry signature!)
        const n1 = fbm1(t * 22 + phase * 0.22, rowSeed);
        const n2 = fbm1(t * 54 - phase * 0.35, rowSeed + 13);
        const spike = Math.pow(n1, 1.9) * 0.68 + Math.pow(n2, 2.6) * 0.55;
        const fineJitter = (hash1(i * 1.91 + r * 29.3) - 0.35) * (isUltra ? 3.2 : 2.1);

        const rawAmp =
          (envMain * (0.48 + bandStrength * 0.68) * (0.55 + spike * 0.95) +
            envLeft * (0.35 + bandStrength * 0.45) * (0.45 + n2 * 0.95) +
            envRight * (0.30 + bandStrength * 0.42) * (0.4 + n1 * 0.9)) *
          maxPeak *
          rowEnv *
          activeBoost *
          shockBoost *
          centerWindow;

        const microSpike = Math.max(0, fineJitter) * (envMain + envLeft + envRight + 0.14) * centerWindow;
        const totalLift = Math.max(0, rawAmp + microSpike);

        ptsX[i] = baseStartX + t * slabW;
        ptsY[i] = baseStartY + t * slopeY - totalLift;
      }

      // 3D hidden-surface occlusion fill beneath ridge line (paints ground color to slice rear lines cleanly!)
      ctx.beginPath();
      ctx.moveTo(ptsX[0], ptsY[0] + rowStepY * 1.6);
      for (let i = 0; i <= cols; i++) {
        ctx.lineTo(ptsX[i], ptsY[i]);
      }
      ctx.lineTo(ptsX[cols], baseStartY + slopeY + rowStepY * 1.6);
      ctx.closePath();
      ctx.fillStyle = colors.bg;
      ctx.fill();

      // Razor-sharp hairline ridge stroke
      ctx.beginPath();
      for (let i = 0; i <= cols; i++) {
        if (i === 0) ctx.moveTo(ptsX[i], ptsY[i]);
        else ctx.lineTo(ptsX[i], ptsY[i]);
      }
      if (isActiveLine) {
        ctx.strokeStyle = activeInfo.color;
        ctx.lineWidth = 2.4;
      } else if (isNearActive) {
        ctx.strokeStyle = colors.isLight ? 'rgba(12,12,14,0.92)' : 'rgba(234,234,230,0.95)';
        ctx.lineWidth = 1.25;
      } else {
        ctx.strokeStyle = colors.isLight ? 'rgba(12,12,14,0.52)' : 'rgba(234,234,230,0.62)';
        ctx.lineWidth = 0.95;
      }
      ctx.stroke();
    }

    if (!isStatic && !document.hidden) {
      rafId = requestAnimationFrame(drawFrame);
    } else {
      rafId = 0;
    }
  }

  function kick() {
    if (destroyed) return;
    if (rafId) cancelAnimationFrame(rafId);
    lastTs = performance.now();
    rafId = requestAnimationFrame(drawFrame);
  }

  const onPointerMove = (ev) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    targetX = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
    targetY = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
    pointerInside = true;
    if (rafId === 0) kick();
  };
  const onPointerLeave = () => {
    pointerInside = false;
    targetX = 0.5;
    targetY = 0.5;
  };
  const onClick = (ev) => {
    if (!onSelectSubject) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.height) return;
    const relY = Math.max(0, Math.min(0.999, (ev.clientY - rect.top) / rect.height));
    const idx = Math.min(3, Math.floor(relY * 4));
    const sid = subjOrder[idx];
    if (sid) {
      currentSubject = sid;
      shockAmp = 1;
      onSelectSubject(sid);
      kick();
    }
  };
  const onVis = () => {
    if (!document.hidden) kick();
  };
  const onFxChange = () => kick();
  const onResize = () => kick();

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
  canvas.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('ulduz:fx-change', onFxChange);
  window.addEventListener('resize', onResize, { passive: true });

  kick();

  return {
    setActive(sid) {
      if (!sid || !SUBJECT_CODES[sid]) return;
      if (currentSubject !== sid) {
        currentSubject = sid;
        shockAmp = 0.9;
      }
      kick();
    },
    pulse() {
      shockAmp = 1.15;
      kick();
    },
    destroy() {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('ulduz:fx-change', onFxChange);
      window.removeEventListener('resize', onResize);
    },
  };
}

class FactorySignalEngine {
  constructor() {
    this.mode = 'tactile';
    this._onPulse = (ev) => {
      const kind = ev?.detail?.kind || 'nav';
      facFireImpulse(kind);
    };
  }

  init(initialMode = 'tactile') {
    this.setMode(initialMode);
    window.addEventListener('ulduz:fx-pulse', this._onPulse);
  }

  setMode(mode) {
    const clean = VALID_FX_MODES.includes(mode) ? mode : 'tactile';
    this.mode = clean;
    document.documentElement.setAttribute('data-fx', clean);
  }

  destroy() {
    window.removeEventListener('ulduz:fx-pulse', this._onPulse);
  }
}

export const fxEngine = new FactorySignalEngine();
export function syncNavIndicator() {}
