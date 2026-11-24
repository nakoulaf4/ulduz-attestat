// Ulduz — Obsidian Atelier 3-Tier Interactive FX & Animation Engine
// Supports 3 live-switchable modes persisted via storage.js:
//   1. 'minimal' — Restraint & surgical micro-physics (0 background canvas/GPU loops)
//   2. 'tactile' — 60fps Canvas-2D starlight constellation + pointer specular borders + magnetic buttons + photon ripples
//   3. 'webgl'   — Custom GLSL monochrome liquid-obsidian caustic shader + interactive ripple wake + comet trails + starbursts
// Automatically pauses offscreen, honors prefers-reduced-motion, and adapts DPR for 60fps mobile stability.

export const VALID_FX_MODES = ['minimal', 'tactile', 'webgl'];
export const DEFAULT_FX_MODE = 'tactile';

export function normalizeFxMode(raw) {
  return VALID_FX_MODES.includes(raw) ? raw : DEFAULT_FX_MODE;
}

const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Pure Monochrome Liquid Obsidian Caustics & Interactive Ripple Wake Shader (WebGL1 compatible)
const FRAG_SRC = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform vec4 uRipples[6];
uniform float uPulse;
uniform float uDim;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.04 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uRes, vec2(1.0));
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 ptr = (uPointer - 0.5) * vec2(aspect, 1.0);

  // Subtle architectural light field distortion
  float t = uTime * 0.14;
  vec2 q = vec2(fbm(p * 1.9 + vec2(t, -t * 0.6)), fbm(p * 1.9 + vec2(-t * 0.5, t * 0.8) + 4.3));

  // Pointer gravity bend
  vec2 toPtr = p - ptr;
  float ptrDist = length(toPtr);
  float ptrLens = uPointerActive * exp(-ptrDist * 3.6);
  vec2 warped = p + q * 0.42 - normalize(toPtr + vec2(0.0001)) * ptrLens * 0.09;

  // Liquid monochrome silk caustic ridges (razor-sharp topographic light veins)
  float field = fbm(warped * 2.55 + vec2(t * 0.7, -t * 0.45));
  float ridge = 1.0 - abs(field * 2.0 - 1.0);
  ridge = pow(clamp(ridge, 0.0, 1.0), 5.2);

  // Interactive razor-sharp liquid-mercury interference rings from pointer taps / answers
  float waveSum = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 rp = uRipples[i];
    if (rp.z > 0.001) {
      vec2 rc = (rp.xy - 0.5) * vec2(aspect, 1.0);
      float age = uTime - rp.z;
      if (age >= 0.0 && age < 2.0) {
        float dist = length(p - rc);
        float radius = age * 0.62;
        float primaryRing = exp(-pow((dist - radius) * 68.0, 2.0));
        float echoRing = exp(-pow((dist - max(0.0, radius - 0.045)) * 84.0, 2.0)) * 0.42;
        float fade = pow(1.0 - age / 2.0, 1.4) * rp.w;
        waveSum += (primaryRing + echoRing) * fade * 0.24;
      }
    }
  }

  // Supernova harmonic pulse on correct answer / unlock
  float pulseWave = uPulse * (0.09 + 0.14 * ridge);

  // Obsidian depth vignette preserving WCAG AA contrast over all text regions
  float vignette = smoothstep(1.38, 0.14, length(p * vec2(0.85, 1.05) + vec2(0.0, -0.14)));

  float lum = 0.012
    + ridge * 0.165 * vignette
    + ptrLens * 0.055
    + waveSum
    + pulseWave;

  lum *= (1.0 - uDim * 0.64);
  lum = clamp(lum, 0.012, 0.225);

  // 100% pure achromatic monochrome
  gl_FragColor = vec4(lum, lum, lum * 1.015, 1.0);
}
`;

class ObsidianFxEngine {
  constructor() {
    this.mode = DEFAULT_FX_MODE;
    this.reducedMotion = false;
    this.hidden = false;
    this.rafId = 0;
    this.lastTs = 0;
    this.startTime = performance.now();

    // DOM canvases
    this.glCanvas = null;
    this.canvas2d = null;
    this.ctx = null;
    this.gl = null;
    this.glProg = null;
    this.glUniforms = null;
    this.webglSupported = false;

    // Adaptive viewport & performance scaling
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.glScale = 0.85;
    this.slowFrames = 0;

    // Unified pointer state (works for both mouse & touch)
    this.pointer = { x: -9999, y: -9999, nx: 0.5, ny: 0.5, active: false, vx: 0, vy: 0 };
    this.smoothPointer = { nx: 0.5, ny: 0.5, active: 0 };

    // Canvas-2D starlight nodes, shockwaves, sparks & comet trails
    this.nodes = [];
    this.shockwaves = [];
    this.sparks = [];
    this.trails = [];

    // WebGL ripple ring buffer (6 slots: x, y, startTimeSec, strength)
    this.ripples = Array.from({ length: 6 }, () => [0.5, 0.5, 0, 0]);
    this.rippleCursor = 0;
    this.shaderPulse = 0;

    // Specular / magnetic tracking
    this.specularRaf = 0;
    this.lastPointerEvent = null;
    this.activeSpecularEl = null;
    this.activeMagneticEl = null;

    this._boundTick = this._tick.bind(this);
    this._boundResize = this._handleResize.bind(this);
    this._boundVis = this._handleVisibility.bind(this);
    this._boundPointerMove = this._handlePointerMove.bind(this);
    this._boundPointerDown = this._handlePointerDown.bind(this);
    this._boundPointerLeave = this._handlePointerLeave.bind(this);
    this._boundFxPulse = this._handleFxPulse.bind(this);
  }

  init(initialMode = DEFAULT_FX_MODE) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.glCanvas = document.getElementById('oa-fx-webgl');
    this.canvas2d = document.getElementById('oa-fx-canvas');

    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.reducedMotion = Boolean(mq?.matches);
    mq?.addEventListener?.('change', (e) => {
      this.reducedMotion = Boolean(e.matches);
      this._syncRunningState();
    });

    window.addEventListener('resize', this._boundResize, { passive: true });
    document.addEventListener('visibilitychange', this._boundVis);
    window.addEventListener('pointermove', this._boundPointerMove, { passive: true });
    window.addEventListener('pointerdown', this._boundPointerDown, { passive: true });
    document.addEventListener('pointerleave', this._boundPointerLeave, { passive: true });
    window.addEventListener('ulduz:fx-pulse', this._boundFxPulse);

    this._handleResize();
    this.setMode(initialMode);
  }

  getMode() {
    return this.mode;
  }

  setMode(rawMode) {
    const next = normalizeFxMode(rawMode);
    this.mode = next;
    document.documentElement.setAttribute('data-fx', next);

    if (this.glCanvas) {
      this.glCanvas.hidden = next !== 'webgl';
    }
    if (this.canvas2d) {
      this.canvas2d.hidden = next === 'minimal';
    }

    if (next === 'webgl' && !this.gl && !this.reducedMotion) {
      this._initWebGL();
    }
    if (next !== 'minimal') {
      this._seedNodes();
    }
    if (next === 'minimal') {
      this._resetMagnetic();
      this._clearSpecular();
    }

    this._handleResize();
    this._syncRunningState();
  }

  _initWebGL() {
    if (!this.glCanvas) return false;
    try {
      const opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
      const gl = this.glCanvas.getContext('webgl', opts) || this.glCanvas.getContext('experimental-webgl', opts);
      if (!gl) return false;

      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, VERT_SRC);
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) return false;

      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, FRAG_SRC);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return false;

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      this.gl = gl;
      this.glProg = prog;
      this.glUniforms = {
        uRes: gl.getUniformLocation(prog, 'uRes'),
        uTime: gl.getUniformLocation(prog, 'uTime'),
        uPointer: gl.getUniformLocation(prog, 'uPointer'),
        uPointerActive: gl.getUniformLocation(prog, 'uPointerActive'),
        uRipples: gl.getUniformLocation(prog, 'uRipples'),
        uPulse: gl.getUniformLocation(prog, 'uPulse'),
        uDim: gl.getUniformLocation(prog, 'uDim'),
      };
      this.webglSupported = true;
      return true;
    } catch {
      this.webglSupported = false;
      return false;
    }
  }

  _handleResize() {
    this.width = window.innerWidth || 1024;
    this.height = window.innerHeight || 768;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (this.canvas2d) {
      this.canvas2d.width = Math.round(this.width * this.dpr);
      this.canvas2d.height = Math.round(this.height * this.dpr);
      this.ctx = this.canvas2d.getContext('2d');
    }

    if (this.glCanvas) {
      const mobile = this.width < 768;
      const scale = mobile ? Math.min(this.glScale, 0.5) : this.glScale;
      this.glCanvas.width = Math.max(160, Math.round(this.width * scale));
      this.glCanvas.height = Math.max(160, Math.round(this.height * scale));
      if (this.gl) {
        this.gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);
      }
    }

    if (this.mode !== 'minimal') {
      this._seedNodes();
    }
  }

  _seedNodes() {
    const mobile = this.width < 768;
    const count = this.mode === 'webgl'
      ? (mobile ? 34 : 58)
      : (mobile ? 30 : 54);
    if (this.nodes.length === count) return;
    this.nodes = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i % 5) * 0.37;
      const speed = 0.08 + ((i * 19) % 10) * 0.014;
      this.nodes.push({
        x: ((i * 137.5) % 100) / 100 * this.width,
        y: ((i * 73.1 + 19) % 100) / 100 * this.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: (i % 6 === 0) ? 1.85 : 1.05,
        phase: i * 0.85,
      });
    }
  }

  _handleVisibility() {
    this.hidden = document.visibilityState === 'hidden';
    this._syncRunningState();
  }

  _syncRunningState() {
    const shouldRun = !this.hidden && !this.reducedMotion && this.mode !== 'minimal';
    if (shouldRun && !this.rafId) {
      this.lastTs = performance.now();
      this.rafId = requestAnimationFrame(this._boundTick);
    } else if (!shouldRun && this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      if (this.ctx && this.canvas2d) {
        this.ctx.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height);
      }
    }
  }

  _pushWebglRipple(nx, ny, strength = 1.0) {
    const sec = (performance.now() - this.startTime) / 1000;
    this.ripples[this.rippleCursor] = [nx, 1.0 - ny, sec, strength];
    this.rippleCursor = (this.rippleCursor + 1) % this.ripples.length;
  }

  _handlePointerMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.pointer.vx = x - (this.pointer.active ? this.pointer.x : x);
    this.pointer.vy = y - (this.pointer.active ? this.pointer.y : y);
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.nx = this.width > 0 ? x / this.width : 0.5;
    this.pointer.ny = this.height > 0 ? y / this.height : 0.5;
    this.pointer.active = true;

    if (this.mode === 'webgl' && !this.reducedMotion) {
      const spd = Math.hypot(this.pointer.vx, this.pointer.vy);
      if (spd > 2.5) {
        this.trails.push({ x, y, life: 1, r: Math.min(2.4, 0.9 + spd * 0.04) });
        if (this.trails.length > 34) this.trails.shift();
      }
    }

    if (this.mode === 'minimal' || this.reducedMotion) return;
    this.lastPointerEvent = e;
    if (!this.specularRaf) {
      this.specularRaf = requestAnimationFrame(() => {
        this.specularRaf = 0;
        if (this.lastPointerEvent) this._updateInteractiveSurfaces(this.lastPointerEvent);
      });
    }
  }

  _handlePointerDown(e) {
    const x = e.clientX;
    const y = e.clientY;
    const nx = this.width > 0 ? x / this.width : 0.5;
    const ny = this.height > 0 ? y / this.height : 0.5;

    if (this.mode === 'webgl' && !this.reducedMotion) {
      this._pushWebglRipple(nx, ny, 0.85);
    }

    if (this.mode === 'minimal' || this.reducedMotion) return;

    // Photon ring ripple inside [data-ripple] or .btn
    const host = e.target?.closest?.('[data-ripple], .btn, .option-btn, .mobile-bottom-nav__item');
    if (host && !host.disabled) {
      this._spawnDomRipple(host, x, y);
    }
  }

  _handlePointerLeave() {
    this.pointer.active = false;
    this._clearSpecular();
    this._resetMagnetic();
  }

  _spawnDomRipple(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ring = document.createElement('span');
    ring.className = 'oa-ripple-ring';
    const maxDim = Math.max(rect.width, rect.height) * 1.9;
    ring.style.width = `${maxDim}px`;
    ring.style.height = `${maxDim}px`;
    ring.style.left = `${clientX - rect.left}px`;
    ring.style.top = `${clientY - rect.top}px`;
    el.appendChild(ring);

    if (typeof ring.animate === 'function') {
      const anim = ring.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.08)', opacity: 0.85 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
        ],
        { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
      anim.onfinish = () => ring.remove();
    } else {
      setTimeout(() => ring.remove(), 480);
    }
  }

  _clearSpecular() {
    if (this.activeSpecularEl) {
      this.activeSpecularEl.style.setProperty('--specular-on', '0');
      this.activeSpecularEl = null;
    }
  }

  _resetMagnetic() {
    if (this.activeMagneticEl) {
      const inner = this.activeMagneticEl.querySelector(':scope > .oa-mag-inner');
      if (inner) inner.style.transform = '';
      this.activeMagneticEl = null;
    }
  }

  _updateInteractiveSurfaces(e) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // 1. Specular 1px perimeter light tracking
    const specEl = target.closest('[data-specular]');
    if (specEl !== this.activeSpecularEl) {
      this._clearSpecular();
      this.activeSpecularEl = specEl;
    }
    if (specEl) {
      const r = specEl.getBoundingClientRect();
      specEl.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(1)}px`);
      specEl.style.setProperty('--my', `${(e.clientY - r.top).toFixed(1)}px`);
      specEl.style.setProperty('--specular-on', '1');
    }

    // 2. Magnetic inner layer physics (desktop fine pointer only — outer hit target stays stationary!)
    if (e.pointerType === 'mouse') {
      const magEl = target.closest('[data-magnetic]');
      if (magEl !== this.activeMagneticEl) {
        this._resetMagnetic();
        this.activeMagneticEl = magEl;
      }
      if (magEl) {
        const inner = magEl.querySelector(':scope > .oa-mag-inner');
        if (inner) {
          const r = magEl.getBoundingClientRect();
          const dx = ((e.clientX - (r.left + r.width / 2)) / Math.max(r.width / 2, 1)) * 4.5;
          const dy = ((e.clientY - (r.top + r.height / 2)) / Math.max(r.height / 2, 1)) * 3.5;
          inner.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        }
      }
    }
  }

  _handleFxPulse(e) {
    if (this.mode === 'minimal' || this.reducedMotion) return;
    const { kind = 'correct', x = null, y = null, intensity = 1 } = e.detail || {};
    const px = Number.isFinite(x) ? x : (this.pointer.active ? this.pointer.x : this.width * 0.5);
    const py = Number.isFinite(y) ? y : (this.pointer.active ? this.pointer.y : this.height * 0.42);
    const nx = this.width > 0 ? px / this.width : 0.5;
    const ny = this.height > 0 ? py / this.height : 0.45;

    if (this.mode === 'webgl') {
      this._pushWebglRipple(nx, ny, kind === 'unlock' ? 1.45 : kind === 'wrong' ? 0.6 : 1.15);
      this.shaderPulse = Math.min(1.4, this.shaderPulse + (kind === 'unlock' ? 1.1 : kind === 'correct' ? 0.65 : 0.25));
    }

    const ringCount = kind === 'unlock' ? 3 : kind === 'milestone' ? 2 : 1;
    for (let i = 0; i < ringCount; i++) {
      this.shockwaves.push({
        x: px,
        y: py,
        r: 10 + i * 16,
        maxR: (kind === 'unlock' ? 340 : kind === 'wrong' ? 120 : 230) * intensity,
        life: 1,
        dashed: kind === 'wrong',
        delay: i * 90,
      });
    }

    const sparkCount = kind === 'unlock' ? 28 : kind === 'milestone' ? 20 : kind === 'correct' ? 14 : 6;
    for (let i = 0; i < sparkCount; i++) {
      const ang = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.25;
      const spd = (kind === 'unlock' ? 3.2 : kind === 'wrong' ? 1.6 : 2.4) + Math.random() * 2.2;
      this.sparks.push({
        x: px,
        y: py,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1,
        len: 4 + Math.random() * 9,
      });
    }
  }

  _tick(now) {
    if (this.hidden || this.reducedMotion || this.mode === 'minimal') {
      this.rafId = 0;
      return;
    }

    const dtMs = Math.min(48, Math.max(8, now - this.lastTs));
    this.lastTs = now;
    const dt = dtMs / 16.667;

    // Adaptive WebGL resolution guard if a mobile GPU runs slow
    if (this.mode === 'webgl' && this.webglSupported) {
      if (dtMs > 26) {
        this.slowFrames++;
        if (this.slowFrames > 24 && this.glScale > 0.35) {
          this.glScale = Math.max(0.35, this.glScale - 0.12);
          this.slowFrames = 0;
          this._handleResize();
        }
      } else {
        this.slowFrames = Math.max(0, this.slowFrames - 1);
      }
      this._renderWebGL(now, dt);
    }

    this._renderCanvas2D(now, dt);
    this.rafId = requestAnimationFrame(this._boundTick);
  }

  _renderWebGL(now, dt) {
    const gl = this.gl;
    if (!gl || !this.glProg) return;

    const lerp = Math.min(1, 0.12 * dt);
    this.smoothPointer.nx += (this.pointer.nx - this.smoothPointer.nx) * lerp;
    this.smoothPointer.ny += ((1.0 - this.pointer.ny) - this.smoothPointer.ny) * lerp;
    const targetAct = this.pointer.active ? 1.0 : 0.0;
    this.smoothPointer.active += (targetAct - this.smoothPointer.active) * lerp;
    this.shaderPulse = Math.max(0, this.shaderPulse - 0.025 * dt);

    const isFocusedExam = document.body.classList.contains('is-exam-focused') ? 1.0 : 0.0;
    const sec = (now - this.startTime) / 1000;

    gl.useProgram(this.glProg);
    gl.uniform2f(this.glUniforms.uRes, this.glCanvas.width, this.glCanvas.height);
    gl.uniform1f(this.glUniforms.uTime, sec);
    gl.uniform2f(this.glUniforms.uPointer, this.smoothPointer.nx, this.smoothPointer.ny);
    gl.uniform1f(this.glUniforms.uPointerActive, this.smoothPointer.active);
    gl.uniform1f(this.glUniforms.uPulse, this.shaderPulse);
    gl.uniform1f(this.glUniforms.uDim, isFocusedExam);

    const flatRipples = new Float32Array(24);
    for (let i = 0; i < 6; i++) {
      flatRipples[i * 4] = this.ripples[i][0];
      flatRipples[i * 4 + 1] = this.ripples[i][1];
      flatRipples[i * 4 + 2] = this.ripples[i][2];
      flatRipples[i * 4 + 3] = this.ripples[i][3];
    }
    gl.uniform4fv(this.glUniforms.uRipples, flatRipples);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  _renderCanvas2D(now, dt) {
    const ctx = this.ctx;
    if (!ctx) return;

    const w = this.width;
    const h = this.height;
    const dpr = this.dpr;
    const isFocusedExam = document.body.classList.contains('is-exam-focused');
    const dimMul = isFocusedExam ? 0.34 : 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // 1. Starlight Constellation Nodes & Filaments (Tactile primary; subtle overlay on WebGL)
    const nodes = this.nodes;
    const linkDist = w < 768 ? 120 : 168;
    const ptrDistMax = w < 768 ? 145 : 210;
    const nodeOpacityBase = this.mode === 'webgl' ? 0.42 : 0.72;

    // Subtle text-safe damping over central hero reading zone so specks never look like dust on letters
    const textSafeFactor = (x, y) => {
      if (w < 960) return 0.75;
      const inLeftHero = x > w * 0.08 && x < w * 0.56 && y > 90 && y < 440;
      return inLeftHero ? 0.24 : 1.0;
    };

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      if (n.x < -20) n.x = w + 20;
      else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      else if (n.y > h + 20) n.y = -20;

      const zoneMul = textSafeFactor(n.x, n.y);
      let nearPtrBoost = 0;
      if (this.pointer.active) {
        const dx = this.pointer.x - n.x;
        const dy = this.pointer.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d > 6 && d < ptrDistMax) {
          const pull = (1 - d / ptrDistMax);
          n.x += (dx / d) * pull * 0.46 * dt;
          n.y += (dy / d) * pull * 0.46 * dt;
          nearPtrBoost = pull;

          ctx.strokeStyle = `rgba(255, 255, 255, ${(pull * 0.28 * dimMul).toFixed(3)})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(this.pointer.x, this.pointer.y);
          ctx.stroke();
        }
      }

      const twinkle = 0.68 + 0.32 * Math.sin(now * 0.0018 + n.phase);
      const a = Math.min(0.95, (nodeOpacityBase * twinkle * zoneMul + nearPtrBoost * 0.5) * dimMul);
      const rad = (n.r > 1.5 ? 1.95 : 1.2) + nearPtrBoost * 0.75;
      if (n.r > 1.5 && zoneMul > 0.5 && this.mode === 'tactile') {
        ctx.fillStyle = `rgba(255, 255, 255, ${(a * 0.16).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gossamer inter-node constellation hairlines
    ctx.lineWidth = 0.75;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const za = textSafeFactor(a.x, a.y);
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < linkDist * linkDist) {
          const ratio = 1 - Math.sqrt(distSq) / linkDist;
          const z = Math.min(za, textSafeFactor(b.x, b.y));
          const alpha = ratio * (this.mode === 'webgl' ? 0.11 : 0.21) * z * dimMul;
          if (alpha > 0.012) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    // 2. WebGL Mode Pointer Comet Trail
    if (this.mode === 'webgl' && this.trails.length > 1) {
      for (let i = this.trails.length - 1; i >= 0; i--) {
        const tr = this.trails[i];
        tr.life -= 0.055 * dt;
        if (tr.life <= 0) {
          this.trails.splice(i, 1);
        }
      }
      if (this.trails.length > 1) {
        for (let i = 1; i < this.trails.length; i++) {
          const prev = this.trails[i - 1];
          const cur = this.trails[i];
          ctx.strokeStyle = `rgba(255, 255, 255, ${(cur.life * 0.38 * dimMul).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.6, cur.r * cur.life);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(cur.x, cur.y);
          ctx.stroke();
        }
      }
    }

    // 3. Expanding Monochrome Photon Shockwaves (on answer check / unlock)
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      if (sw.delay > 0) {
        sw.delay -= dt * 16.67;
        continue;
      }
      sw.life -= 0.026 * dt;
      if (sw.life <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }
      const ease = 1 - Math.pow(sw.life, 2.4);
      const rad = sw.r + (sw.maxR - sw.r) * ease;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${(sw.life * 0.62).toFixed(3)})`;
      ctx.lineWidth = sw.dashed ? 1.2 : 1.5;
      if (sw.dashed) ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Radiating Luminous Star-Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vx *= Math.pow(0.94, dt);
      sp.vy *= Math.pow(0.94, dt);
      sp.life -= 0.03 * dt;
      if (sp.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${(sp.life * 0.85).toFixed(3)})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(sp.x - sp.vx * sp.len * 0.45, sp.y - sp.vy * sp.len * 0.45);
      ctx.stroke();
    }
  }
}

export const fxEngine = new ObsidianFxEngine();

/**
 * FLIP-morphed neon indicator bar for the desktop header navigation.
 * Moves smoothly from previous active link bounding rect to new active link.
 */
let lastNavRect = null;

export function syncNavIndicator(navEl) {
  if (!navEl) return;
  const activeLink = navEl.querySelector('.nav-link.is-active');
  let pill = navEl.querySelector('.main-nav__indicator');
  if (!activeLink) {
    if (pill) pill.style.opacity = '0';
    return;
  }
  if (!pill) {
    pill = document.createElement('span');
    pill.className = 'main-nav__indicator';
    pill.setAttribute('aria-hidden', 'true');
    navEl.appendChild(pill);
  }

  const navRect = navEl.getBoundingClientRect();
  const targetRect = activeLink.getBoundingClientRect();
  if (!targetRect.width) return;

  const left = targetRect.left - navRect.left;
  const width = targetRect.width;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const moved = lastNavRect && Math.abs(lastNavRect.left - left) > 1;
  if (moved && !reduced) {
    navEl.classList.add('is-nav-gliding');
    pill.style.transition = 'none';
    pill.style.transform = `translate3d(${lastNavRect.left}px, 0, 0) scaleX(${(lastNavRect.width / Math.max(width, 1)).toFixed(4)})`;
    pill.style.width = `${width.toFixed(1)}px`;
    pill.style.opacity = '1';
    void pill.offsetWidth;
    pill.style.transition = 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease';
    pill.style.transform = `translate3d(${left.toFixed(1)}px, 0, 0) scaleX(1)`;
    clearTimeout(navEl._glideTimer);
    navEl._glideTimer = setTimeout(() => {
      navEl.classList.remove('is-nav-gliding');
      pill.style.opacity = '0';
    }, 290);
  } else {
    navEl.classList.remove('is-nav-gliding');
    pill.style.opacity = '0';
  }

  lastNavRect = { left, width };
}
