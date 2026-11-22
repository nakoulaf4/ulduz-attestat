// Crisp, theme-aware inline SVG diagram builders for Math tasks.
// Uses currentColor so diagrams adapt cleanly to both light and dark themes.
// Avoids inline style="" attributes per contract.js rules.

const wrapSvg = (w, h, body) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;

const txt = (x, y, s, { anchor = 'middle', italic = false, size = 14, bold = false } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central" fill="currentColor" font-family="${italic ? 'Georgia, serif' : 'system-ui, sans-serif'}" font-style="${italic ? 'italic' : 'normal'}" font-weight="${bold ? '700' : '400'}" font-size="${size}">${s}</text>`;

const rightAngle = (x, y, dx, dy, sz = 10) =>
  `<polyline points="${x + dx * sz},${y} ${x + dx * sz},${y + dy * sz} ${x},${y + dy * sz}" fill="none" stroke="currentColor" stroke-width="1.4"/>`;

/** Triangle ABC with parallel segment MN (MN || AC). */
export function svgTriSimilarity({ mLabel = 'M', nLabel = 'N', showValues = false, ac = '', bn = '', nc = '' } = {}) {
  const w = 240, h = 165;
  let extra = '';
  if (showValues) {
    if (ac) extra += txt(120, 152, ac, { size: 12 });
    if (bn) extra += txt(162, 52, bn, { size: 12 });
    if (nc) extra += txt(190, 108, nc, { size: 12 });
  }
  return wrapSvg(w, h, `
    <polygon points="120,22 44,136 196,136" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.8"/>
    <line x1="82" y1="79" x2="158" y2="79" stroke="currentColor" stroke-width="1.8"/>
    ${txt(120, 11, 'B', { italic: true })}
    ${txt(32, 140, 'A', { italic: true })}
    ${txt(208, 140, 'C', { italic: true })}
    ${txt(68, 77, mLabel, { italic: true })}
    ${txt(172, 77, nLabel, { italic: true })}
    ${extra}
  `);
}

/** Circle with center O and two inscribed angles subtending the same chord, or inscribed + central. */
export function svgInscribedAngles({ givenAngle = '40°', targetLabel = 'α', mode = 'inscribed-pair' } = {}) {
  const w = 200, h = 190;
  const cx = 100, cy = 96, r = 74;
  // Bottom chord endpoints at 235° and 305° (in SVG coords where y is down, bottom is +y)
  const pt = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [+(cx + r * Math.cos(rad)).toFixed(1), +(cy + r * Math.sin(rad)).toFixed(1)];
  };
  const [ax, ay] = pt(125);
  const [bx, by] = pt(45);
  const [px, py] = pt(245); // top-left
  const [qx, qy] = pt(312); // top-right

  if (mode === 'central') {
    return wrapSvg(w, h, `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="${cx}" cy="${cy}" r="2.6" fill="currentColor"/>
      <polyline points="${ax},${ay} ${px},${py} ${bx},${by}" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <polyline points="${ax},${ay} ${cx},${cy} ${bx},${by}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4,3"/>
      ${txt(cx - 10, cy - 8, 'O', { italic: true, size: 13 })}
      ${txt(px + 2, py + 24, givenAngle, { size: 13 })}
      ${txt(cx + 3, cy + 20, targetLabel, { italic: true, size: 14 })}
    `);
  }

  return wrapSvg(w, h, `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="${cx}" cy="${cy}" r="2.6" fill="currentColor"/>
    <polyline points="${ax},${ay} ${px},${py} ${bx},${by}" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <polyline points="${ax},${ay} ${qx},${qy} ${bx},${by}" fill="none" stroke="currentColor" stroke-width="1.7"/>
    ${txt(cx + 2, cy + 12, 'O', { italic: true, size: 13 })}
    ${txt(px + 3, py + 24, givenAngle, { size: 12 })}
    ${txt(qx - 10, qy + 20, targetLabel, { italic: true, size: 14 })}
  `);
}

/** Axial section of a cone with slant height, radius, height, and base angle. */
export function svgConeAngle({ slant = '', radius = 'R', height = '', angle = '30°', angleAtTop = false } = {}) {
  const w = 210, h = 185;
  return wrapSvg(w, h, `
    <ellipse cx="110" cy="144" rx="68" ry="18" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.7"/>
    <line x1="110" y1="24" x2="42" y2="144" stroke="currentColor" stroke-width="1.8"/>
    <line x1="110" y1="24" x2="178" y2="144" stroke="currentColor" stroke-width="1.8"/>
    <line x1="110" y1="24" x2="110" y2="144" stroke="currentColor" stroke-width="1.3" stroke-dasharray="4,3"/>
    <line x1="42" y1="144" x2="110" y2="144" stroke="currentColor" stroke-width="1.5"/>
    ${rightAngle(110, 144, 1, -1, 9)}
    ${angleAtTop
      ? `<path d="M 99,44 A 22,22 0 0,0 110,46" fill="none" stroke="currentColor" stroke-width="1.4"/>${txt(95, 60, angle, { size: 12 })}`
      : `<path d="M 55,144 A 15,15 0 0,0 50,130" fill="none" stroke="currentColor" stroke-width="1.4"/>${txt(68, 134, angle, { size: 12 })}`
    }
    ${slant ? txt(62, 76, slant, { size: 13, anchor: 'end' }) : ''}
    ${radius ? txt(76, 155, radius, { size: 13, italic: radius === 'R' }) : ''}
    ${height ? txt(120, 88, height, { size: 13, anchor: 'start', italic: height === 'H' }) : ''}
  `);
}

/** Cone formed by rotating a right triangle around a leg. */
export function svgConeRotation({ rLabel = 'a = 6', hLabel = 'b = 8', lLabel = 'l = ?' } = {}) {
  const w = 240, h = 198;
  return wrapSvg(w, h, `
    <ellipse cx="120" cy="146" rx="68" ry="17" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.7"/>
    <line x1="120" y1="22" x2="52" y2="146" stroke="currentColor" stroke-width="1.8"/>
    <line x1="120" y1="22" x2="188" y2="146" stroke="currentColor" stroke-width="1.8"/>
    <line x1="120" y1="22" x2="120" y2="146" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="120" y1="146" x2="188" y2="146" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3"/>
    ${rightAngle(120, 146, 1, -1, 8)}
    ${txt(113, 118, hLabel, { size: 12, anchor: 'end' })}
    ${txt(154, 179, rLabel, { size: 12, anchor: 'middle' })}
    ${txt(164, 78, lLabel, { size: 12, anchor: 'start' })}
  `);
}

/** Downward parabola with x-intercepts A, B, y-intercept C, and right angle ACB. */
export function svgParabolaRightTri() {
  const w = 260, h = 185;
  // Axes: origin O at (90, 132), A at (52, 132), B at (210, 132), C at (90, 62)
  // Parabola passing through A(52,132), C(90,62), B(210,132):
  // Let's sample points smoothly via quadratic through A(52,132), B(210,132), vertex x=131, y=42.
  const pts = [];
  for (let x = 36; x <= 226; x += 4) {
    const t = (x - 131) / 79;
    const y = 42 + 90 * t * t;
    if (y <= 165) pts.push(`${x},${y.toFixed(1)}`);
  }
  // C is at x=90: t = -41/79 => y = 42 + 90*(1681/6241) = 66.2
  const cy = 66.2;
  return wrapSvg(w, h, `
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <line x1="16" y1="132" x2="246" y2="132" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
    <line x1="90" y1="172" x2="90" y2="14" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
    <polyline points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="52" y1="132" x2="90" y2="${cy}" stroke="currentColor" stroke-width="1.5"/>
    <line x1="210" y1="132" x2="90" y2="${cy}" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="52" cy="132" r="2.5" fill="currentColor"/>
    <circle cx="210" cy="132" r="2.5" fill="currentColor"/>
    <circle cx="90" cy="${cy}" r="2.5" fill="currentColor"/>
    ${txt(245, 145, 'x', { italic: true, size: 13 })}
    ${txt(78, 16, 'y', { italic: true, size: 13 })}
    ${txt(81, 143, 'O', { italic: true, size: 13 })}
    ${txt(44, 144, 'A', { italic: true, size: 13 })}
    ${txt(216, 144, 'B', { italic: true, size: 13 })}
    ${txt(78, 60, 'C', { italic: true, size: 13 })}
  `);
}

/** Right triangle ABC (C=90°) with angle bisector AD. */
export function svgBisectorArea({ cd = '2,4', ab = '8,5' } = {}) {
  const w = 240, h = 190;
  // C=(44,154), A=(44,28), B=(202,154), D=(92,154)
  return wrapSvg(w, h, `
    <polygon points="44,28 44,154 202,154" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.8"/>
    <line x1="44" y1="28" x2="92" y2="154" stroke="currentColor" stroke-width="1.7"/>
    ${rightAngle(44, 154, 1, -1, 10)}
    <path d="M 44,54 A 26,26 0 0,0 53,52" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M 54,52 A 26,26 0 0,0 64,44" fill="none" stroke="currentColor" stroke-width="1.3"/>
    ${txt(44, 16, 'A', { italic: true })}
    ${txt(33, 158, 'C', { italic: true })}
    ${txt(92, 168, 'D', { italic: true })}
    ${txt(213, 158, 'B', { italic: true })}
    ${txt(68, 167, cd, { size: 12 })}
    ${txt(135, 82, ab, { size: 13 })}
  `);
}

/** Two overlapping sets Euler-Venn diagram. */
export function svgVennTwo({ left = '', mid = '', right = '' } = {}) {
  const w = 270, h = 128;
  return wrapSvg(w, h, `
    <ellipse cx="95" cy="70" rx="78" ry="42" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.7"/>
    <ellipse cx="175" cy="70" rx="78" ry="42" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.7"/>
    ${txt(62, 19, 'A', { italic: true, size: 15, bold: true })}
    ${txt(208, 19, 'B', { italic: true, size: 15, bold: true })}
    ${txt(58, 70, left, { size: 13 })}
    ${txt(135, 70, mid, { size: 13 })}
    ${txt(212, 70, right, { size: 13 })}
  `);
}

/** Nested subset Venn diagram B ⊂ A. */
export function svgVennSubset({ outerCount = '', innerCount = '' } = {}) {
  const w = 230, h = 125;
  return wrapSvg(w, h, `
    <ellipse cx="112" cy="66" rx="92" ry="46" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-width="1.7"/>
    <ellipse cx="82" cy="68" rx="44" ry="26" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.6"/>
    ${txt(202, 26, 'A', { italic: true, size: 14, bold: true })}
    ${txt(82, 34, 'B', { italic: true, size: 14, bold: true })}
    ${txt(82, 68, `(${innerCount})`, { size: 13 })}
    ${txt(162, 68, `(${outerCount})`, { size: 13 })}
  `);
}

/** Right trapezoid with top base a, bottom base b, height h. */
export function svgTrapezoid({ top = '2', bottom = '4', height = '12' } = {}) {
  const w = 200, h = 160;
  return wrapSvg(w, h, `
    <polygon points="56,30 116,30 158,132 56,132" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.8"/>
    ${rightAngle(56, 30, 1, 1, 9)}
    ${rightAngle(56, 132, 1, -1, 9)}
    ${txt(86, 18, top, { size: 14 })}
    ${txt(107, 146, bottom, { size: 14 })}
    ${txt(40, 81, height, { size: 14, anchor: 'end' })}
  `);
}

/** Coordinate plane showing a point A(x; y) with dashed projections to axes. */
export function svgCoordsPoint({ x = 6, y = -4 } = {}) {
  const w = 210, h = 180;
  const ox = 105, oy = 90;
  const px = ox + (x >= 0 ? 54 : -54);
  const py = oy + (y >= 0 ? -44 : 44);
  return wrapSvg(w, h, `
    <defs>
      <marker id="arr2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <line x1="16" y1="${oy}" x2="194" y2="${oy}" stroke="currentColor" stroke-width="1.4" marker-end="url(#arr2)"/>
    <line x1="${ox}" y1="166" x2="${ox}" y2="14" stroke="currentColor" stroke-width="1.4" marker-end="url(#arr2)"/>
    <line x1="${px}" y1="${oy}" x2="${px}" y2="${py}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4,3"/>
    <line x1="${ox}" y1="${py}" x2="${px}" y2="${py}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4,3"/>
    <circle cx="${px}" cy="${py}" r="3.5" fill="currentColor"/>
    ${txt(192, oy + 12, 'x', { italic: true, size: 13 })}
    ${txt(ox - 12, 16, 'y', { italic: true, size: 13 })}
    ${txt(ox - 10, oy + 11, 'O', { italic: true, size: 12 })}
    ${txt(px + (x >= 0 ? 12 : -12), py + (y >= 0 ? -12 : 12), 'A', { italic: true, size: 14, bold: true })}
    ${txt(px, oy + (y >= 0 ? 12 : -12), String(x), { size: 12 })}
    ${txt(ox + (x >= 0 ? -14 : 14), py, String(y).replace('-', '−'), { size: 12 })}
  `);
}

/** Right triangle ABC (C=90°) with sides a, b, c and acute angles α at B, β at A. */
export function svgRightTriTrig() {
  const w = 210, h = 165;
  // B=(40,136), C=(164,136), A=(164,28)
  return wrapSvg(w, h, `
    <polygon points="40,136 164,136 164,28" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-width="1.8"/>
    ${rightAngle(164, 136, -1, -1, 10)}
    <path d="M 64,136 A 24,24 0 0,0 58,120" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M 148,42 A 22,22 0 0,0 164,50" fill="none" stroke="currentColor" stroke-width="1.3"/>
    ${txt(168, 17, 'A', { italic: true })}
    ${txt(28, 140, 'B', { italic: true })}
    ${txt(175, 140, 'C', { italic: true })}
    ${txt(102, 149, 'a', { italic: true })}
    ${txt(176, 82, 'b', { italic: true })}
    ${txt(92, 72, 'c', { italic: true })}
    ${txt(73, 126, 'α', { italic: true, size: 13 })}
    ${txt(150, 58, 'β', { italic: true, size: 13 })}
  `);
}

/** Schematic train + two tunnels diagram. */
export function svgTrainTunnels({ trainLen = '200 м', tun1 = '500 м', gap = '15 км', tun2 = '300 м' } = {}) {
  const w = 320, h = 105;
  return wrapSvg(w, h, `
    <line x1="12" y1="68" x2="308" y2="68" stroke="currentColor" stroke-width="1.6"/>
    <!-- Train -->
    <rect x="20" y="50" width="48" height="16" rx="3" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.5"/>
    <polygon points="68,50 78,66 68,66" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/>
    <!-- Tunnel 1 -->
    <path d="M 96,68 L 96,42 Q 124,26 152,42 L 152,68 Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.6"/>
    <!-- Tunnel 2 -->
    <path d="M 232,68 L 232,42 Q 260,26 288,42 L 288,68 Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.6"/>
    ${txt(48, 86, trainLen, { size: 12 })}
    ${txt(124, 22, 'I туннель', { size: 11 })}
    ${txt(124, 57, tun1, { size: 12 })}
    ${txt(192, 54, gap, { size: 12, bold: true })}
    <line x1="156" y1="62" x2="228" y2="62" stroke="currentColor" stroke-width="1" stroke-dasharray="3,2"/>
    ${txt(260, 22, 'II туннель', { size: 11 })}
    ${txt(260, 57, tun2, { size: 12 })}
  `);
}

/** Circle with tangent AB and secant ACD, ∠BAD = 90°. */
export function svgTangentSecant() {
  const w = 210, h = 185;
  // Circle center O=(88,98), r=56. Tangent top horizontal y=42, B=(88,42), A=(168,42).
  // Secant vertical x=168? Wait: if A=(144,42)? No, secant AD intersects circle at C and D, so x_sec < 88+56=144.
  // Let's set A=(132, 42): then x=132 is inside r=56 (132-88=44 < 56).
  // Circle intersections at x=132: (y-98)^2 = 56^2 - 44^2 = 3136 - 1936 = 1200 => dy ≈ 34.6 => C=(132, 63.4), D=(132, 132.6).
  return wrapSvg(w, h, `
    <circle cx="88" cy="98" r="56" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="88" cy="98" r="2.5" fill="currentColor"/>
    <line x1="66" y1="42" x2="146" y2="42" stroke="currentColor" stroke-width="1.7"/>
    <line x1="132" y1="42" x2="132" y2="148" stroke="currentColor" stroke-width="1.7"/>
    ${rightAngle(132, 42, -1, 1, 9)}
    <circle cx="88" cy="42" r="2.2" fill="currentColor"/>
    <circle cx="132" cy="63.4" r="2.2" fill="currentColor"/>
    <circle cx="132" cy="132.6" r="2.2" fill="currentColor"/>
    ${txt(88, 29, 'B', { italic: true })}
    ${txt(140, 31, 'A', { italic: true })}
    ${txt(144, 65, 'C', { italic: true })}
    ${txt(144, 134, 'D', { italic: true })}
    ${txt(76, 100, 'O', { italic: true, size: 13 })}
  `);
}

/** Two perpendicular segments AD and BE from baseline DE, paths AE and BD intersecting at C. */
export function svgShipsSimilarity() {
  const w = 240, h = 170;
  // D=(46,136), E=(184,136), A=(46,82), B=(184,32)
  return wrapSvg(w, h, `
    <line x1="24" y1="136" x2="212" y2="136" stroke="currentColor" stroke-width="1.8"/>
    <line x1="46" y1="136" x2="46" y2="82" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4,3"/>
    <line x1="184" y1="136" x2="184" y2="32" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4,3"/>
    <line x1="46" y1="82" x2="184" y2="136" stroke="currentColor" stroke-width="1.8"/>
    <line x1="46" y1="136" x2="184" y2="32" stroke="currentColor" stroke-width="1.8"/>
    ${rightAngle(46, 136, 1, -1, 9)}
    ${rightAngle(184, 136, -1, -1, 9)}
    <circle cx="46" cy="82" r="2.8" fill="currentColor"/>
    <circle cx="184" cy="32" r="2.8" fill="currentColor"/>
    <circle cx="94" cy="100.8" r="2.5" fill="currentColor"/>
    ${txt(34, 80, 'A', { italic: true })}
    ${txt(196, 30, 'B', { italic: true })}
    ${txt(94, 86, 'C', { italic: true })}
    ${txt(46, 150, 'D', { italic: true })}
    ${txt(184, 150, 'E', { italic: true })}
  `);
}
