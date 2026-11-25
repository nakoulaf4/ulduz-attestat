/**
 * Ulduz Educational SVG Diagrams — Factory Records / Technical Blueprint aesthetic.
 * Uses CSS variables & currentColor so every schematic has crisp WCAG AA+ contrast
 * on dark stock (#0C0C0E) and FAC 05 light cotton (#ECECEB) alike.
 */

const BASE_OPEN = (w, h, label) =>
  `<svg class="lesson-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`;

const GRID_BG = (w, h) => `
  <defs>
    <pattern id="ul-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.07" stroke-width="0.7"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#ul-grid)"/>`;

const DIAGRAMS = {
  'math-percent': () => `${BASE_OPEN(480, 210, 'Схема дробей и процентов')}${GRID_BG(480, 210)}
    <text x="20" y="28" fill="currentColor" font-family="monospace" font-size="11" opacity="0.7">100% = ЦЕЛОЕ (1.0)</text>
    <rect x="20" y="42" width="440" height="34" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="20" y="42" width="110" height="34" fill="var(--accent-blue, #2663C9)" fill-opacity="0.28" stroke="var(--accent-blue, #2663C9)" stroke-width="1.5"/>
    <rect x="130" y="42" width="176" height="34" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.22" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.5"/>
    <text x="75" y="64" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">25% = 1/4</text>
    <text x="218" y="64" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">40% = 2/5</text>
    <text x="383" y="64" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" opacity="0.8">35% = 7/20</text>
    <line x1="20" y1="115" x2="460" y2="115" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="4 4"/>
    <rect x="20" y="130" width="205" height="58" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="32" y="152" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">+p% УВЕЛИЧЕНИЕ</text>
    <text x="32" y="174" fill="currentColor" font-family="monospace" font-size="13">S · (1 + p / 100)</text>
    <rect x="255" y="130" width="205" height="58" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="267" y="152" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11" font-weight="700">−p% СКИДКА</text>
    <text x="267" y="174" fill="currentColor" font-family="monospace" font-size="13">S · (1 − p / 100)</text>
  </svg>`,

  'math-sets': () => `${BASE_OPEN(480, 220, 'Диаграмма Венна для множеств A и B')}${GRID_BG(480, 220)}
    <rect x="24" y="18" width="432" height="184" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
    <text x="36" y="36" fill="currentColor" font-family="monospace" font-size="11" opacity="0.65">U (универсальное множество)</text>
    <circle cx="192" cy="112" r="64" fill="var(--accent-blue, #2663C9)" fill-opacity="0.18" stroke="var(--accent-blue, #2663C9)" stroke-width="2"/>
    <circle cx="282" cy="112" r="64" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.18" stroke="var(--accent-green, #2E9E5B)" stroke-width="2"/>
    <text x="155" y="116" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">A \ B</text>
    <text x="237" y="116" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">A ∩ B</text>
    <text x="320" y="116" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">B \ A</text>
    <text x="240" y="194" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</text>
  </svg>`,

  'math-prob': () => `${BASE_OPEN(480, 215, 'Дерево вероятностей и комбинаторика')}${GRID_BG(480, 215)}
    <circle cx="52" cy="108" r="7" fill="currentColor"/>
    <line x1="59" y1="104" x2="178" y2="54" stroke="var(--accent-blue, #2663C9)" stroke-width="2"/>
    <line x1="59" y1="112" x2="178" y2="162" stroke="var(--accent-red, #D63031)" stroke-width="2"/>
    <text x="108" y="68" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12">p</text>
    <text x="102" y="154" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12">1−p</text>
    <rect x="180" y="34" width="110" height="36" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.5"/>
    <text x="235" y="57" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">Событие A</text>
    <rect x="180" y="144" width="110" height="36" fill="none" stroke="var(--accent-red, #D63031)" stroke-width="1.5"/>
    <text x="235" y="167" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">Событие Ā</text>
    <line x1="290" y1="52" x2="345" y2="52" stroke="currentColor" stroke-width="1.4"/>
    <rect x="345" y="24" width="118" height="164" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="357" y="48" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">P(A) = m / n</text>
    <text x="357" y="80" fill="currentColor" font-family="monospace" font-size="11">P_n = n!</text>
    <text x="357" y="112" fill="currentColor" font-family="monospace" font-size="11">A_n^k = n!/(n−k)!</text>
    <text x="357" y="144" fill="currentColor" font-family="monospace" font-size="11">C_n^k = A_n^k / k!</text>
    <text x="357" y="174" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">0 ≤ P(A) ≤ 1</text>
  </svg>`,

  'math-quad': () => `${BASE_OPEN(480, 225, 'График квадратичной функции и дискриминант')}${GRID_BG(480, 225)}
    <line x1="30" y1="150" x2="310" y2="150" stroke="currentColor" stroke-width="1.4"/>
    <line x1="170" y1="20" x2="170" y2="205" stroke="currentColor" stroke-width="1.4"/>
    <text x="304" y="144" fill="currentColor" font-family="monospace" font-size="11">x</text>
    <text x="178" y="30" fill="currentColor" font-family="monospace" font-size="11">y</text>
    <path d="M 88 30 Q 170 250 252 30" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="2.4"/>
    <circle cx="122" cy="150" r="4.5" fill="var(--accent-red, #D63031)"/>
    <circle cx="218" cy="150" r="4.5" fill="var(--accent-red, #D63031)"/>
    <circle cx="170" cy="182" r="4.5" fill="var(--accent-green, #2E9E5B)"/>
    <text x="108" y="168" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">x₁</text>
    <text x="220" y="168" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">x₂</text>
    <text x="178" y="196" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">V(x₀, y₀)</text>
    <rect x="322" y="24" width="142" height="176" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="334" y="48" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">y = ax² + bx + c</text>
    <text x="334" y="76" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11">D = b² − 4ac</text>
    <text x="334" y="104" fill="currentColor" font-family="monospace" font-size="10">D &gt; 0 → 2 корня</text>
    <text x="334" y="124" fill="currentColor" font-family="monospace" font-size="10">D = 0 → 1 корень</text>
    <text x="334" y="144" fill="currentColor" font-family="monospace" font-size="10">D &lt; 0 → нет корн.</text>
    <text x="334" y="176" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">x₀ = −b / (2a)</text>
  </svg>`,

  'math-log': () => `${BASE_OPEN(480, 220, 'Симметрия показательной и логарифмической функций')}${GRID_BG(480, 220)}
    <line x1="40" y1="170" x2="290" y2="170" stroke="currentColor" stroke-width="1.3"/>
    <line x1="90" y1="20" x2="90" y2="200" stroke="currentColor" stroke-width="1.3"/>
    <line x1="60" y1="200" x2="255" y2="22" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="5 4"/>
    <text x="252" y="34" fill="currentColor" opacity="0.6" font-family="monospace" font-size="10">y = x</text>
    <path d="M 46 164 C 95 160, 125 140, 165 30" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="2.2"/>
    <path d="M 98 196 C 108 148, 140 120, 275 88" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.2"/>
    <circle cx="90" cy="142" r="4" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="118" cy="170" r="4" fill="var(--accent-green, #2E9E5B)"/>
    <text x="155" y="42" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">y = aˣ</text>
    <text x="210" y="114" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">y = logₐ x</text>
    <rect x="305" y="28" width="158" height="162" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="317" y="54" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ОДЗ логарифма</text>
    <text x="317" y="82" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">x &gt; 0</text>
    <text x="317" y="106" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">a &gt; 0, a ≠ 1</text>
    <text x="317" y="140" fill="currentColor" font-family="monospace" font-size="10">logₐ(xy) = logₐx+logₐy</text>
    <text x="317" y="164" fill="currentColor" font-family="monospace" font-size="10">a^(logₐ b) = b</text>
  </svg>`,

  'math-interval': () => `${BASE_OPEN(480, 190, 'Метод интервалов для неравенств')}${GRID_BG(480, 190)}
    <text x="24" y="34" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">(x − a)(x − b)(x − c) ≥ 0</text>
    <line x1="30" y1="110" x2="448" y2="110" stroke="currentColor" stroke-width="1.8"/>
    <polygon points="452,110 442,105 442,115" fill="currentColor"/>
    <path d="M 40 135 Q 80 155 120 110 Q 175 62 230 110 Q 285 155 340 110 Q 395 62 435 80" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="2.2"/>
    <circle cx="120" cy="110" r="5" fill="currentColor"/>
    <circle cx="230" cy="110" r="5" fill="var(--bg-card, #111)" stroke="currentColor" stroke-width="2"/>
    <circle cx="340" cy="110" r="5" fill="currentColor"/>
    <text x="116" y="134" fill="currentColor" font-family="monospace" font-size="12">a</text>
    <text x="226" y="134" fill="currentColor" font-family="monospace" font-size="12">b</text>
    <text x="336" y="134" fill="currentColor" font-family="monospace" font-size="12">c</text>
    <text x="74" y="100" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="16" font-weight="700">−</text>
    <text x="170" y="92" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="16" font-weight="700">+</text>
    <text x="280" y="100" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="16" font-weight="700">−</text>
    <text x="385" y="92" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="16" font-weight="700">+</text>
    <text x="24" y="172" fill="currentColor" opacity="0.75" font-family="monospace" font-size="11">● точка входит (≤, ≥)   ○ точка выколота (&lt;, &gt;, знаменатель ≠ 0)</text>
  </svg>`,

  'math-prog': () => `${BASE_OPEN(480, 210, 'Сравнение арифметической и геометрической прогрессий')}${GRID_BG(480, 210)}
    <rect x="20" y="22" width="210" height="168" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="34" y="46" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">АРИФМЕТИЧЕСКАЯ (+d)</text>
    <polyline points="40,145 85,125 130,105 175,85 210,70" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="2"/>
    <circle cx="40" cy="145" r="3.5" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="85" cy="125" r="3.5" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="130" cy="105" r="3.5" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="175" cy="85" r="3.5" fill="var(--accent-blue, #2663C9)"/>
    <text x="34" y="174" fill="currentColor" font-family="monospace" font-size="11">aₙ = a₁ + (n−1)d</text>
    <rect x="250" y="22" width="210" height="168" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="264" y="46" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">ГЕОМЕТРИЧЕСКАЯ (×q)</text>
    <path d="M 270 148 Q 345 142 435 64" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="2"/>
    <circle cx="270" cy="148" r="3.5" fill="var(--accent-green, #2E9E5B)"/>
    <circle cx="325" cy="140" r="3.5" fill="var(--accent-green, #2E9E5B)"/>
    <circle cx="380" cy="116" r="3.5" fill="var(--accent-green, #2E9E5B)"/>
    <circle cx="435" cy="64" r="3.5" fill="var(--accent-green, #2E9E5B)"/>
    <text x="264" y="174" fill="currentColor" font-family="monospace" font-size="11">bₙ = b₁ · q^(n−1)</text>
  </svg>`,

  'math-trig': () => `${BASE_OPEN(480, 230, 'Тригонометрическая окружность')}${GRID_BG(480, 230)}
    <line x1="40" y1="115" x2="260" y2="115" stroke="currentColor" stroke-width="1.2"/>
    <line x1="150" y1="18" x2="150" y2="212" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="150" cy="115" r="76" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <line x1="150" y1="115" x2="210" y2="68" stroke="var(--accent-blue, #2663C9)" stroke-width="2.2"/>
    <line x1="210" y1="68" x2="210" y2="115" stroke="var(--accent-red, #D63031)" stroke-width="2" stroke-dasharray="4 3"/>
    <line x1="150" y1="115" x2="210" y2="115" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.4"/>
    <circle cx="210" cy="68" r="4.5" fill="var(--accent-blue, #2663C9)"/>
    <text x="216" y="64" fill="currentColor" font-family="monospace" font-size="11">P(cos α, sin α)</text>
    <text x="172" y="130" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11">cos α</text>
    <text x="215" y="96" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">sin α</text>
    <rect x="295" y="26" width="168" height="178" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="307" y="50" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ОСНОВНОЕ ТОЖДЕСТВО</text>
    <text x="307" y="76" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11">sin²α + cos²α = 1</text>
    <text x="307" y="106" fill="currentColor" font-family="monospace" font-size="10">30° = π/6: sin=1/2</text>
    <text x="307" y="128" fill="currentColor" font-family="monospace" font-size="10">45° = π/4: √2/2</text>
    <text x="307" y="150" fill="currentColor" font-family="monospace" font-size="10">60° = π/3: sin=√3/2</text>
    <text x="307" y="180" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">tg α = sin α / cos α</text>
  </svg>`,

  'math-planimetry': () => `${BASE_OPEN(480, 220, 'Треугольник, высота и окружность')}${GRID_BG(480, 220)}
    <circle cx="155" cy="116" r="80" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="5 4"/>
    <polygon points="84,154 226,154 176,42" fill="var(--accent-blue, #2663C9)" fill-opacity="0.12" stroke="var(--accent-blue, #2663C9)" stroke-width="2"/>
    <line x1="176" y1="42" x2="176" y2="154" stroke="var(--accent-red, #D63031)" stroke-width="1.8" stroke-dasharray="4 3"/>
    <rect x="176" y="144" width="10" height="10" fill="none" stroke="var(--accent-red, #D63031)"/>
    <text x="72" y="168" fill="currentColor" font-family="monospace" font-size="12">A</text>
    <text x="230" y="168" fill="currentColor" font-family="monospace" font-size="12">B</text>
    <text x="172" y="34" fill="currentColor" font-family="monospace" font-size="12">C</text>
    <text x="182" y="106" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">h</text>
    <rect x="275" y="24" width="188" height="172" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="287" y="50" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ФОРМУЛЫ ТРЕУГОЛЬНИКА</text>
    <text x="287" y="80" fill="currentColor" font-family="monospace" font-size="11">S = ½ · a · h</text>
    <text x="287" y="108" fill="currentColor" font-family="monospace" font-size="11">S = ½ · a · b · sin γ</text>
    <text x="287" y="138" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10">c² = a²+b²−2ab·cos γ</text>
    <text x="287" y="168" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">a / sin A = 2R</text>
  </svg>`,

  'math-stereometry': () => `${BASE_OPEN(480, 220, 'Стереометрия: цилиндр и конус')}${GRID_BG(480, 220)}
    <ellipse cx="115" cy="54" rx="52" ry="16" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <ellipse cx="115" cy="166" rx="52" ry="16" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8" stroke-dasharray="4 3"/>
    <line x1="63" y1="54" x2="63" y2="166" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <line x1="167" y1="54" x2="167" y2="166" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <line x1="115" y1="166" x2="167" y2="166" stroke="var(--accent-red, #D63031)" stroke-width="1.8"/>
    <text x="138" y="161" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">R</text>
    <text x="48" y="114" fill="currentColor" font-family="monospace" font-size="11">H</text>
    <text x="115" y="202" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">V = πR²H</text>

    <ellipse cx="330" cy="166" rx="58" ry="16" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.8"/>
    <line x1="330" y1="42" x2="272" y2="166" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.8"/>
    <line x1="330" y1="42" x2="388" y2="166" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.8"/>
    <line x1="330" y1="42" x2="330" y2="166" stroke="var(--accent-red, #D63031)" stroke-width="1.6" stroke-dasharray="4 3"/>
    <text x="336" y="114" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">H</text>
    <text x="370" y="102" fill="currentColor" font-family="monospace" font-size="11">l</text>
    <text x="330" y="202" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">V = ⅓πR²H · Sб = πRl</text>
  </svg>`,

  'math-vectors': () => `${BASE_OPEN(480, 215, 'Сложение векторов и скалярное произведение')}${GRID_BG(480, 215)}
    <line x1="40" y1="175" x2="275" y2="175" stroke="currentColor" stroke-width="1.2"/>
    <line x1="65" y1="22" x2="65" y2="195" stroke="currentColor" stroke-width="1.2"/>
    <line x1="65" y1="175" x2="185" y2="145" stroke="var(--accent-blue, #2663C9)" stroke-width="2.4"/>
    <line x1="65" y1="175" x2="135" y2="65" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.4"/>
    <line x1="65" y1="175" x2="255" y2="35" stroke="var(--accent-red, #D63031)" stroke-width="2.2" stroke-dasharray="5 3"/>
    <line x1="185" y1="145" x2="255" y2="35" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="3 3"/>
    <line x1="135" y1="65" x2="255" y2="35" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="3 3"/>
    <text x="148" y="168" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">a</text>
    <text x="88" y="108" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">b</text>
    <text x="180" y="84" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12" font-weight="700">a + b</text>
    <rect x="290" y="28" width="174" height="158" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="302" y="54" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">КООРДИНАТЫ</text>
    <text x="302" y="82" fill="currentColor" font-family="monospace" font-size="10">|a| = √(x₁² + y₁²)</text>
    <text x="302" y="112" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10">a·b = x₁x₂ + y₁y₂</text>
    <text x="302" y="140" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">a·b = |a||b|cos θ</text>
    <text x="302" y="168" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">a ⊥ b ⇔ a·b = 0</text>
  </svg>`,

  'lang-morpheme': () => `${BASE_OPEN(480, 190, 'Морфемный состав слова')}${GRID_BG(480, 190)}
    <text x="24" y="34" fill="currentColor" font-family="monospace" font-size="11" opacity="0.7">СТРУКТУРА СЛОВА · ПОРЯДОК РАЗБОРА</text>
    <rect x="24" y="64" width="96" height="46" fill="var(--accent-blue, #2663C9)" fill-opacity="0.16" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="72" y="92" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">ПРИ-</text>
    <text x="72" y="128" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10">приставка</text>

    <rect x="130" y="64" width="112" height="46" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.16" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="186" y="92" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">ШКОЛЬ-</text>
    <text x="186" y="128" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">корень</text>

    <rect x="252" y="64" width="96" height="46" fill="var(--accent-yellow, #DFB41D)" fill-opacity="0.18" stroke="var(--accent-yellow, #DFB41D)" stroke-width="1.6"/>
    <text x="300" y="92" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">-Н-</text>
    <text x="300" y="128" text-anchor="middle" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="10">суффикс</text>

    <rect x="358" y="64" width="96" height="46" fill="var(--accent-red, #D63031)" fill-opacity="0.16" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="406" y="92" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">-ЫЙ</text>
    <text x="406" y="128" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">окончание</text>

    <line x1="24" y1="150" x2="348" y2="150" stroke="currentColor" stroke-width="2"/>
    <text x="186" y="170" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">ОСНОВА СЛОВА (без окончания)</text>
  </svg>`,

  'lang-syntax': () => `${BASE_OPEN(480, 200, 'Схема синтаксической связи в предложении')}${GRID_BG(480, 200)}
    <rect x="24" y="34" width="210" height="58" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <text x="129" y="56" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">[ ГЛАВНОЕ ПРЕДЛОЖЕНИЕ ]</text>
    <text x="129" y="78" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">Подлежащее ══ Сказуемое</text>

    <path d="M 234 63 Q 275 30 302 63" fill="none" stroke="var(--accent-red, #D63031)" stroke-width="1.8"/>
    <text x="268" y="42" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">вопрос?</text>

    <rect x="302" y="34" width="154" height="58" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.8"/>
    <text x="379" y="56" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">( ПРИДАТОЧНОЕ )</text>
    <text x="379" y="78" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">что / который / если</text>

    <rect x="24" y="118" width="432" height="58" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="38" y="142" fill="currentColor" font-family="monospace" font-size="11">ССП: [  ], и / а / но [  ]   ·   СПП: [  ], (что  )   ·   БСП: [  ] : / — / , [  ]</text>
    <text x="38" y="164" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="10">Причастный оборот после определяемого слова выделяется запятыми.</text>
  </svg>`,

  'en-tenses': () => `${BASE_OPEN(480, 215, 'Временная ось английских времён')}${GRID_BG(480, 215)}
    <line x1="28" y1="78" x2="452" y2="78" stroke="currentColor" stroke-width="2"/>
    <polygon points="456,78 446,73 446,83" fill="currentColor"/>
    <circle cx="98" cy="78" r="6" fill="var(--accent-red, #D63031)"/>
    <circle cx="240" cy="78" r="7" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="382" cy="78" r="6" fill="var(--accent-green, #2E9E5B)"/>
    <text x="98" y="54" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12" font-weight="700">PAST</text>
    <text x="240" y="54" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">PRESENT (NOW)</text>
    <text x="382" y="54" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">FUTURE</text>

    <rect x="24" y="102" width="136" height="92" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="34" y="122" fill="currentColor" font-family="monospace" font-size="10" font-weight="700">SIMPLE (факт)</text>
    <text x="34" y="144" fill="currentColor" font-family="monospace" font-size="10">V2 / did</text>
    <text x="34" y="164" fill="currentColor" font-family="monospace" font-size="10">V1 / V+s</text>
    <text x="34" y="184" fill="currentColor" font-family="monospace" font-size="10">will + V1</text>

    <rect x="172" y="102" width="136" height="92" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="182" y="122" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10" font-weight="700">CONTINUOUS</text>
    <text x="182" y="144" fill="currentColor" font-family="monospace" font-size="10">was/were + V-ing</text>
    <text x="182" y="164" fill="currentColor" font-family="monospace" font-size="10">am/is/are + V-ing</text>
    <text x="182" y="184" fill="currentColor" font-family="monospace" font-size="10">will be + V-ing</text>

    <rect x="320" y="102" width="136" height="92" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="330" y="122" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10" font-weight="700">PERFECT (результ.)</text>
    <text x="330" y="144" fill="currentColor" font-family="monospace" font-size="10">had + V3</text>
    <text x="330" y="164" fill="currentColor" font-family="monospace" font-size="10">have/has + V3</text>
    <text x="330" y="184" fill="currentColor" font-family="monospace" font-size="10">will have + V3</text>
  </svg>`,

  'en-passive': () => `${BASE_OPEN(480, 195, 'Преобразование Active Voice в Passive Voice')}${GRID_BG(480, 195)}
    <rect x="24" y="28" width="110" height="40" fill="none" stroke="currentColor" stroke-opacity="0.6"/>
    <text x="79" y="53" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">Subject</text>
    <rect x="174" y="28" width="110" height="40" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="229" y="53" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12">Verb</text>
    <rect x="324" y="28" width="130" height="40" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.16" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="389" y="53" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">Object</text>

    <line x1="389" y1="68" x2="79" y2="128" stroke="var(--accent-green, #2E9E5B)" stroke-width="2"/>
    <line x1="79" y1="68" x2="389" y2="128" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3"/>

    <rect x="24" y="128" width="110" height="42" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.16" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="79" y="154" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">Object</text>
    <rect x="154" y="128" width="160" height="42" fill="var(--accent-blue, #2663C9)" fill-opacity="0.16" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <text x="234" y="154" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">to be + V3 / -ed</text>
    <rect x="334" y="128" width="120" height="42" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
    <text x="394" y="154" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">(by Subject)</text>
  </svg>`,

  'az-harmony': () => `${BASE_OPEN(480, 210, 'Закон гармонии гласных (Ahəng qanunu)')}${GRID_BG(480, 210)}
    <text x="24" y="30" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">AHƏNG QANUNU · ЗАКОН СИНГАРМОНИЗМА</text>
    <rect x="24" y="48" width="206" height="138" fill="var(--accent-red, #D63031)" fill-opacity="0.1" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="38" y="74" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12" font-weight="700">QALIN (Твёрдые)</text>
    <text x="38" y="104" fill="currentColor" font-family="monospace" font-size="16" font-weight="700">a · ı · o · u</text>
    <text x="38" y="136" fill="currentColor" font-family="monospace" font-size="11">→ суффиксы: -lar, -da, -dan</text>
    <text x="38" y="162" fill="currentColor" opacity="0.8" font-family="monospace" font-size="11">kitab + lar → kitablar</text>

    <rect x="250" y="48" width="206" height="138" fill="var(--accent-blue, #2663C9)" fill-opacity="0.1" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="264" y="74" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">İNCƏ (Мягкие)</text>
    <text x="264" y="104" fill="currentColor" font-family="monospace" font-size="16" font-weight="700">e · ə · i · ö · ü</text>
    <text x="264" y="136" fill="currentColor" font-family="monospace" font-size="11">→ суффиксы: -lər, -də, -dən</text>
    <text x="264" y="162" fill="currentColor" opacity="0.8" font-family="monospace" font-size="11">şəhər + lər → şəhərlər</text>
  </svg>`,

  'az-cases': () => `${BASE_OPEN(480, 210, '6 падежей азербайджанского языка')}${GRID_BG(480, 210)}
    <text x="24" y="28" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">İSMİN HALLARI · 6 ПАДЕЖЕЙ (на примере слова «ev»)</text>
    <rect x="24" y="46" width="138" height="68" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="34" y="68" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">1. Adlıq (Ø)</text>
    <text x="34" y="92" fill="currentColor" font-family="monospace" font-size="11">ev (kim? nə?)</text>

    <rect x="172" y="46" width="138" height="68" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="182" y="68" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">2. Yiyəlik (-ın⁴)</text>
    <text x="182" y="92" fill="currentColor" font-family="monospace" font-size="11">evin (kimin?)</text>

    <rect x="320" y="46" width="136" height="68" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="330" y="68" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">3. Yönlük (-a²)</text>
    <text x="330" y="92" fill="currentColor" font-family="monospace" font-size="11">evə (hara?)</text>

    <rect x="24" y="126" width="138" height="68" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="34" y="148" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">4. Təsirlik (-ı⁴)</text>
    <text x="34" y="172" fill="currentColor" font-family="monospace" font-size="11">evi (kimi? nəyi?)</text>

    <rect x="172" y="126" width="138" height="68" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="182" y="148" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">5. Yerlik (-da²)</text>
    <text x="182" y="172" fill="currentColor" font-family="monospace" font-size="11">evdə (harada?)</text>

    <rect x="320" y="126" width="136" height="68" fill="none" stroke="currentColor" stroke-opacity="0.45"/>
    <text x="330" y="148" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">6. Çıxışlıq (-dan²)</text>
    <text x="330" y="172" fill="currentColor" font-family="monospace" font-size="11">evdən (haradan?)</text>
  </svg>`,

  'phys-kinematics': () => `${BASE_OPEN(480, 220, 'График скорости v(t) и путь как площадь')}${GRID_BG(480, 220)}
    <line x1="48" y1="178" x2="290" y2="178" stroke="currentColor" stroke-width="1.6"/>
    <line x1="48" y1="24" x2="48" y2="178" stroke="currentColor" stroke-width="1.6"/>
    <polygon points="48,178 48,128 242,56 242,178" fill="var(--accent-blue, #2663C9)" fill-opacity="0.22"/>
    <line x1="48" y1="128" x2="242" y2="56" stroke="var(--accent-blue, #2663C9)" stroke-width="2.6"/>
    <line x1="48" y1="128" x2="242" y2="128" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="4 3"/>
    <text x="28" y="132" fill="currentColor" font-family="monospace" font-size="11">v₀</text>
    <text x="28" y="60" fill="currentColor" font-family="monospace" font-size="11">v</text>
    <text x="238" y="196" fill="currentColor" font-family="monospace" font-size="11">t</text>
    <text x="145" y="156" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">Путь S = Площадь</text>
    <rect x="304" y="28" width="158" height="162" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="316" y="54" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">РАВНОУСКОРЕННОЕ</text>
    <text x="316" y="84" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11">v = v₀ + a·t</text>
    <text x="316" y="114" fill="currentColor" font-family="monospace" font-size="11">S = v₀t + at²/2</text>
    <text x="316" y="144" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11">v² − v₀² = 2aS</text>
    <text x="316" y="174" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">наклон = a = Δv/Δt</text>
  </svg>`,

  'phys-dynamics': () => `${BASE_OPEN(480, 220, 'Схема сил на наклонной плоскости')}${GRID_BG(480, 220)}
    <polygon points="48,182 288,182 288,72" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <g transform="translate(178,122) rotate(-24.6)">
      <rect x="-24" y="-28" width="48" height="28" fill="var(--accent-blue, #2663C9)" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>
      <line x1="0" y1="-14" x2="0" y2="-66" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.2"/>
      <text x="8" y="-56" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">N</text>
      <line x1="0" y1="-14" x2="54" y2="-14" stroke="var(--accent-red, #D63031)" stroke-width="2.2"/>
      <text x="34" y="-22" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11" font-weight="700">Fтр</text>
    </g>
    <line x1="184" y1="110" x2="184" y2="178" stroke="var(--accent-blue, #2663C9)" stroke-width="2.4"/>
    <text x="192" y="170" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">mg</text>
    <rect x="306" y="28" width="158" height="162" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="318" y="54" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ЗАКОНЫ НЬЮТОНА</text>
    <text x="318" y="84" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12">ΣF = m · a</text>
    <text x="318" y="114" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11">Fтр = μ · N</text>
    <text x="318" y="144" fill="currentColor" font-family="monospace" font-size="10">N = mg · cos α</text>
    <text x="318" y="170" fill="currentColor" font-family="monospace" font-size="10">F₁₂ = −F₂₁</text>
  </svg>`,

  'phys-energy': () => `${BASE_OPEN(480, 210, 'Закон сохранения механической энергии')}${GRID_BG(480, 210)}
    <path d="M 52 54 Q 160 185 268 54" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="58" cy="60" r="8" fill="var(--accent-red, #D63031)"/>
    <circle cx="160" cy="120" r="8" fill="var(--accent-green, #2E9E5B)"/>
    <circle cx="262" cy="60" r="8" fill="var(--accent-blue, #2663C9)"/>
    <text x="42" y="42" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11" font-weight="700">Ep = max</text>
    <text x="122" y="150" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">Ek = max</text>
    <text x="234" y="42" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">Ep = max</text>
    <rect x="298" y="24" width="166" height="164" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="310" y="50" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">СОХРАНЕНИЕ</text>
    <text x="310" y="80" fill="currentColor" font-family="monospace" font-size="11">Ek = mv² / 2</text>
    <text x="310" y="106" fill="currentColor" font-family="monospace" font-size="11">Ep = mgh</text>
    <text x="310" y="134" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11">p = m · v</text>
    <text x="310" y="164" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">Ek + Ep = const</text>
  </svg>`,

  'phys-thermo': () => `${BASE_OPEN(480, 215, 'Изопроцессы на p-V диаграмме')}${GRID_BG(480, 215)}
    <line x1="54" y1="178" x2="275" y2="178" stroke="currentColor" stroke-width="1.5"/>
    <line x1="54" y1="24" x2="54" y2="178" stroke="currentColor" stroke-width="1.5"/>
    <text x="36" y="34" fill="currentColor" font-family="monospace" font-size="12">p</text>
    <text x="266" y="195" fill="currentColor" font-family="monospace" font-size="12">V</text>
    <line x1="86" y1="62" x2="225" y2="62" stroke="var(--accent-blue, #2663C9)" stroke-width="2.2"/>
    <text x="148" y="52" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10">p=const (изобара)</text>
    <line x1="86" y1="62" x2="86" y2="152" stroke="var(--accent-red, #D63031)" stroke-width="2.2"/>
    <text x="94" y="134" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">V=const</text>
    <path d="M 105 70 Q 150 135 245 155" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.2"/>
    <text x="176" y="128" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">T=const</text>
    <rect x="292" y="28" width="172" height="158" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="304" y="54" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ТЕРМОДИНАМИКА</text>
    <text x="304" y="84" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11">pV = νRT</text>
    <text x="304" y="114" fill="currentColor" font-family="monospace" font-size="11">Q = ΔU + A</text>
    <text x="304" y="144" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">η = (T₁−T₂)/T₁</text>
    <text x="304" y="170" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">T(K) = t(°C) + 273</text>
  </svg>`,

  'phys-ohm': () => `${BASE_OPEN(480, 210, 'Последовательное и параллельное соединение резисторов')}${GRID_BG(480, 210)}
    <text x="26" y="34" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">ПОСЛЕДОВАТЕЛЬНО: I₁ = I₂ · R = R₁ + R₂</text>
    <line x1="28" y1="64" x2="78" y2="64" stroke="currentColor" stroke-width="1.8"/>
    <rect x="78" y="52" width="66" height="24" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <text x="111" y="68" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">R₁</text>
    <line x1="144" y1="64" x2="196" y2="64" stroke="currentColor" stroke-width="1.8"/>
    <rect x="196" y="52" width="66" height="24" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <text x="229" y="68" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">R₂</text>
    <line x1="262" y1="64" x2="318" y2="64" stroke="currentColor" stroke-width="1.8"/>
    <text x="336" y="68" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">I = U / R</text>

    <text x="26" y="114" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">ПАРАЛЛЕЛЬНО: U₁ = U₂ · 1/R = 1/R₁ + 1/R₂</text>
    <line x1="28" y1="158" x2="88" y2="158" stroke="currentColor" stroke-width="1.8"/>
    <line x1="88" y1="136" x2="88" y2="180" stroke="currentColor" stroke-width="1.8"/>
    <line x1="88" y1="136" x2="124" y2="136" stroke="currentColor" stroke-width="1.8"/>
    <rect x="124" y="125" width="76" height="22" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.8"/>
    <text x="162" y="140" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">R₁</text>
    <line x1="200" y1="136" x2="236" y2="136" stroke="currentColor" stroke-width="1.8"/>
    <line x1="88" y1="180" x2="124" y2="180" stroke="currentColor" stroke-width="1.8"/>
    <rect x="124" y="169" width="76" height="22" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.8"/>
    <text x="162" y="184" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">R₂</text>
    <line x1="200" y1="180" x2="236" y2="180" stroke="currentColor" stroke-width="1.8"/>
    <line x1="236" y1="136" x2="236" y2="180" stroke="currentColor" stroke-width="1.8"/>
    <line x1="236" y1="158" x2="318" y2="158" stroke="currentColor" stroke-width="1.8"/>
    <text x="336" y="162" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">P = U · I</text>
  </svg>`,

  'phys-optics': () => `${BASE_OPEN(480, 210, 'Ход лучей в собирающей линзе')}${GRID_BG(480, 210)}
    <line x1="22" y1="112" x2="458" y2="112" stroke="currentColor" stroke-width="1.2" stroke-dasharray="5 3"/>
    <line x1="235" y1="26" x2="235" y2="196" stroke="var(--accent-blue, #2663C9)" stroke-width="2.6"/>
    <polygon points="235,22 229,34 241,34" fill="var(--accent-blue, #2663C9)"/>
    <polygon points="235,200 229,188 241,188" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="155" cy="112" r="3.5" fill="currentColor"/>
    <circle cx="315" cy="112" r="3.5" fill="currentColor"/>
    <text x="150" y="130" fill="currentColor" font-family="monospace" font-size="11">F</text>
    <text x="310" y="130" fill="currentColor" font-family="monospace" font-size="11">F</text>
    <line x1="88" y1="112" x2="88" y2="56" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.4"/>
    <line x1="88" y1="56" x2="235" y2="56" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <line x1="235" y1="56" x2="410" y2="178" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <line x1="88" y1="56" x2="410" y2="178" stroke="var(--accent-yellow, #DFB41D)" stroke-width="1.6"/>
    <line x1="406" y1="112" x2="406" y2="174" stroke="var(--accent-green, #2E9E5B)" stroke-width="2.4"/>
    <text x="26" y="198" fill="currentColor" font-family="monospace" font-size="11">1/F = 1/d + 1/f   ·   D = 1/F (дптр)   ·   E = hν = hc/λ</text>
  </svg>`,

  'chem-atom': () => `${BASE_OPEN(480, 215, 'Электронные оболочки атома')}${GRID_BG(480, 215)}
    <circle cx="150" cy="108" r="18" fill="var(--accent-red, #D63031)" fill-opacity="0.25" stroke="var(--accent-red, #D63031)" stroke-width="2"/>
    <text x="150" y="112" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">+Z</text>
    <circle cx="150" cy="108" r="42" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
    <circle cx="150" cy="108" r="68" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
    <circle cx="150" cy="108" r="92" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.5" stroke-dasharray="4 3"/>
    <circle cx="150" cy="66" r="4.5" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="150" cy="150" r="4.5" fill="var(--accent-blue, #2663C9)"/>
    <circle cx="218" cy="108" r="4.5" fill="var(--accent-green, #2E9E5B)"/>
    <circle cx="82" cy="108" r="4.5" fill="var(--accent-green, #2E9E5B)"/>
    <circle cx="242" cy="108" r="5" fill="var(--accent-yellow, #DFB41D)"/>
    <rect x="278" y="24" width="184" height="168" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="290" y="50" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">СТРОЕНИЕ АТОМА</text>
    <text x="290" y="78" fill="currentColor" font-family="monospace" font-size="11">p⁺ = e⁻ = Z (№)</text>
    <text x="290" y="104" fill="currentColor" font-family="monospace" font-size="11">n⁰ = A − Z</text>
    <text x="290" y="134" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10">Слои: N_max = 2n²</text>
    <text x="290" y="160" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">2 · 8 · 18 · 32</text>
    <text x="290" y="182" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">Период = число слоёв</text>
  </svg>`,

  'chem-bond': () => `${BASE_OPEN(480, 190, 'Шкала типов химической связи')}${GRID_BG(480, 190)}
    <text x="24" y="34" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ТИП СВЯЗИ ПО РАЗНОСТИ ЭЛЕКТРООТРИЦАТЕЛЬНОСТИ (ΔЭО)</text>
    <rect x="24" y="58" width="136" height="58" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.14" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="92" y="82" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">Ков. неполярная</text>
    <text x="92" y="102" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">H₂, O₂, N₂ (ΔЭО=0)</text>

    <rect x="172" y="58" width="136" height="58" fill="var(--accent-blue, #2663C9)" fill-opacity="0.14" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="240" y="82" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">Ков. полярная</text>
    <text x="240" y="102" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">HCl, H₂O, CO₂</text>

    <rect x="320" y="58" width="136" height="58" fill="var(--accent-red, #D63031)" fill-opacity="0.14" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="388" y="82" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">Ионная связь</text>
    <text x="388" y="102" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">NaCl, CaO (Ме+НеМе)</text>

    <text x="24" y="154" fill="currentColor" font-family="monospace" font-size="11">Металлическая: в чистых металлах (Fe, Cu, Al) · Водородная: H₂O, NH₃, HF</text>
    <text x="24" y="176" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="10">Сумма степеней окисления всех атомов в молекуле всегда равна 0.</text>
  </svg>`,

  'chem-mole': () => `${BASE_OPEN(480, 210, 'Молярная схема пересчёта вещества')}${GRID_BG(480, 210)}
    <rect x="186" y="76" width="108" height="54" fill="var(--accent-blue, #2663C9)" fill-opacity="0.2" stroke="var(--accent-blue, #2663C9)" stroke-width="2"/>
    <text x="240" y="100" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="14" font-weight="700">n (моль)</text>
    <text x="240" y="118" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">центр расчётов</text>

    <rect x="24" y="24" width="136" height="50" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
    <text x="92" y="46" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">МАССА m (г)</text>
    <text x="92" y="64" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11">n = m / M</text>

    <rect x="320" y="24" width="136" height="50" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
    <text x="388" y="46" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ОБЪЁМ ГАЗА V</text>
    <text x="388" y="64" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11">n = V / 22.4 л</text>

    <rect x="148" y="150" width="184" height="46" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
    <text x="240" y="170" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ЧИСЛО ЧАСТИЦ N</text>
    <text x="240" y="188" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">n = N / (6.02·10²³)</text>

    <line x1="160" y1="60" x2="186" y2="88" stroke="currentColor" stroke-width="1.6"/>
    <line x1="320" y1="60" x2="294" y2="88" stroke="currentColor" stroke-width="1.6"/>
    <line x1="240" y1="130" x2="240" y2="150" stroke="currentColor" stroke-width="1.6"/>
  </svg>`,

  'chem-inorganic': () => `${BASE_OPEN(480, 200, 'Генетические ряды неорганических соединений')}${GRID_BG(480, 200)}
    <text x="24" y="34" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">РЯД МЕТАЛЛОВ</text>
    <rect x="24" y="46" width="84" height="36" fill="none" stroke="var(--accent-blue, #2663C9)"/><text x="66" y="68" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">Ме (Ca)</text>
    <text x="118" y="68" fill="currentColor" font-family="monospace">→</text>
    <rect x="134" y="46" width="110" height="36" fill="none" stroke="var(--accent-blue, #2663C9)"/><text x="189" y="68" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">Осн. оксид (CaO)</text>
    <text x="254" y="68" fill="currentColor" font-family="monospace">→</text>
    <rect x="270" y="46" width="100" height="36" fill="none" stroke="var(--accent-blue, #2663C9)"/><text x="320" y="68" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">Щёлочь Ca(OH)₂</text>
    <text x="380" y="68" fill="currentColor" font-family="monospace">→</text>
    <rect x="394" y="46" width="64" height="122" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.16" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="426" y="112" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12" font-weight="700">СОЛЬ</text>

    <text x="24" y="120" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11" font-weight="700">РЯД НЕМЕТАЛЛОВ</text>
    <rect x="24" y="132" width="84" height="36" fill="none" stroke="var(--accent-red, #D63031)"/><text x="66" y="154" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">НеМе (S)</text>
    <text x="118" y="154" fill="currentColor" font-family="monospace">→</text>
    <rect x="134" y="132" width="110" height="36" fill="none" stroke="var(--accent-red, #D63031)"/><text x="189" y="154" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">Кисл. оксид SO₃</text>
    <text x="254" y="154" fill="currentColor" font-family="monospace">→</text>
    <rect x="270" y="132" width="100" height="36" fill="none" stroke="var(--accent-red, #D63031)"/><text x="320" y="154" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">Кислота H₂SO₄</text>
    <text x="380" y="154" fill="currentColor" font-family="monospace">→</text>
  </svg>`,

  'chem-organic': () => `${BASE_OPEN(480, 195, 'Классы углеводородов и кратность связей')}${GRID_BG(480, 195)}
    <rect x="22" y="28" width="138" height="140" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="91" y="54" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">АЛКАНЫ</text>
    <text x="91" y="84" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13">C — C</text>
    <text x="91" y="114" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">CₙH₂ₙ₊₂</text>
    <text x="91" y="144" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">sp³ · замещение</text>

    <rect x="171" y="28" width="138" height="140" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="240" y="54" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">АЛКЕНЫ</text>
    <text x="240" y="84" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13">C = C</text>
    <text x="240" y="114" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">CₙH₂ₙ</text>
    <text x="240" y="144" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">sp² · присоединение</text>

    <rect x="320" y="28" width="138" height="140" fill="none" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="389" y="54" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12" font-weight="700">АЛКИНЫ</text>
    <text x="389" y="84" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13">C ≡ C</text>
    <text x="389" y="114" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">CₙH₂ₙ₋₂</text>
    <text x="389" y="144" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">sp · линейная</text>
  </svg>`,

  'bio-cell': () => `${BASE_OPEN(480, 220, 'Схема строения эукариотической клетки')}${GRID_BG(480, 220)}
    <ellipse cx="165" cy="112" rx="124" ry="84" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.08" stroke="currentColor" stroke-width="2"/>
    <circle cx="155" cy="108" r="34" fill="var(--accent-blue, #2663C9)" fill-opacity="0.2" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <text x="155" y="112" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ЯДРО</text>
    <ellipse cx="236" cy="82" rx="24" ry="12" fill="var(--accent-red, #D63031)" fill-opacity="0.2" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="236" y="85" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">АТФ</text>
    <circle cx="96" cy="146" r="4" fill="var(--accent-yellow, #DFB41D)"/>
    <circle cx="108" cy="154" r="4" fill="var(--accent-yellow, #DFB41D)"/>
    <circle cx="88" cy="158" r="4" fill="var(--accent-yellow, #DFB41D)"/>
    <rect x="308" y="24" width="154" height="172" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="320" y="48" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ОРГАНОИДЫ</text>
    <text x="320" y="76" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10">Ядро — ДНК (2 мембр.)</text>
    <text x="320" y="102" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">Митохондрия — АТФ</text>
    <text x="320" y="128" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="10">Рибосома — белок</text>
    <text x="320" y="154" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">Хлоропласт — свет</text>
    <text x="320" y="180" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">Лизосома — расщепл.</text>
  </svg>`,

  'bio-genetics': () => `${BASE_OPEN(480, 215, 'Решётка Пеннета Aa × Aa')}${GRID_BG(480, 215)}
    <text x="28" y="32" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">РЕШЁТКА ПЕННЕТА · ВТОРОЙ ЗАКОН МЕНДЕЛЯ (Aa × Aa)</text>
    <rect x="52" y="54" width="180" height="132" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <line x1="112" y1="54" x2="112" y2="186" stroke="currentColor" stroke-width="1.4"/>
    <line x1="172" y1="54" x2="172" y2="186" stroke="currentColor" stroke-width="1.4"/>
    <line x1="52" y1="98" x2="232" y2="98" stroke="currentColor" stroke-width="1.4"/>
    <line x1="52" y1="142" x2="232" y2="142" stroke="currentColor" stroke-width="1.4"/>
    <text x="82" y="81" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="12">♀\♂</text>
    <text x="142" y="81" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="13" font-weight="700">A</text>
    <text x="202" y="81" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="13" font-weight="700">a</text>
    <text x="82" y="125" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="13" font-weight="700">A</text>
    <text x="82" y="169" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="13" font-weight="700">a</text>
    <text x="142" y="125" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">AA</text>
    <text x="202" y="125" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">Aa</text>
    <text x="142" y="169" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="13" font-weight="700">Aa</text>
    <text x="202" y="169" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="13" font-weight="700">aa</text>

    <rect x="262" y="54" width="194" height="132" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="274" y="82" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">ФЕНОТИП: 3 : 1</text>
    <text x="274" y="106" fill="currentColor" font-family="monospace" font-size="10">75% доминант (AA, Aa)</text>
    <text x="274" y="124" fill="currentColor" font-family="monospace" font-size="10">25% рецессив (aa)</text>
    <text x="274" y="154" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">ГЕНОТИП: 1 : 2 : 1</text>
    <text x="274" y="174" fill="currentColor" opacity="0.75" font-family="monospace" font-size="10">Дигибридное: 9:3:3:1</text>
  </svg>`,

  'bio-dna': () => `${BASE_OPEN(480, 195, 'Центральная догма: ДНК → иРНК → Белок')}${GRID_BG(480, 195)}
    <rect x="22" y="42" width="124" height="72" fill="var(--accent-blue, #2663C9)" fill-opacity="0.14" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="84" y="68" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="13" font-weight="700">ДНК</text>
    <text x="84" y="94" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">А=Т · Г≡Ц</text>

    <text x="164" y="82" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="16">→</text>
    <text x="164" y="102" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="9">ядро</text>

    <rect x="184" y="42" width="124" height="72" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.14" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="246" y="68" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="13" font-weight="700">иРНК</text>
    <text x="246" y="94" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">А→У · Т→А</text>

    <text x="326" y="82" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="16">→</text>
    <text x="326" y="102" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="9">рибосома</text>

    <rect x="346" y="42" width="112" height="72" fill="var(--accent-red, #D63031)" fill-opacity="0.14" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="402" y="68" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="13" font-weight="700">БЕЛОК</text>
    <text x="402" y="94" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">1 АК = 3 нукл.</text>

    <text x="24" y="152" fill="currentColor" font-family="monospace" font-size="11">Правило Чаргаффа: %А = %Т,  %Г = %Ц,  А+Т+Г+Ц = 100%</text>
    <text x="24" y="176" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="10">ДНК → иРНК (транскрипция)   ·   иРНК → Белок (трансляция)</text>
  </svg>`,

  'bio-ecology': () => `${BASE_OPEN(480, 210, 'Экологическая пирамида правила 10%')}${GRID_BG(480, 210)}
    <polygon points="150,24 198,64 102,64" fill="var(--accent-red, #D63031)" fill-opacity="0.24" stroke="var(--accent-red, #D63031)" stroke-width="1.5"/>
    <polygon points="102,68 198,68 232,108 68,108" fill="var(--accent-yellow, #DFB41D)" fill-opacity="0.2" stroke="var(--accent-yellow, #DFB41D)" stroke-width="1.5"/>
    <polygon points="68,112 232,112 264,152 36,152" fill="var(--accent-blue, #2663C9)" fill-opacity="0.2" stroke="var(--accent-blue, #2663C9)" stroke-width="1.5"/>
    <polygon points="36,156 264,156 286,194 14,194" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.24" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.5"/>
    <text x="150" y="54" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">10</text>
    <text x="150" y="94" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">100 (хищн.)</text>
    <text x="150" y="138" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">1 000 (травояд.)</text>
    <text x="150" y="180" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">10 000 (продуценты)</text>

    <rect x="304" y="34" width="160" height="150" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="316" y="60" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="11" font-weight="700">ПРАВИЛО ЛИНДЕМАНА</text>
    <text x="316" y="90" fill="currentColor" font-family="monospace" font-size="11">На каждый уровень</text>
    <text x="316" y="110" fill="currentColor" font-family="monospace" font-size="11">переходит ≈ 10%</text>
    <text x="316" y="130" fill="currentColor" font-family="monospace" font-size="11">энергии (÷10).</text>
    <text x="316" y="164" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">90% → тепло/дыхание</text>
  </svg>`,

  'hist-az-timeline': () => `${BASE_OPEN(480, 210, 'Хронология истории Азербайджана')}${GRID_BG(480, 210)}
    <text x="22" y="30" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">КЛЮЧЕВЫЕ ЭПОХИ ИСТОРИИ АЗЕРБАЙДЖАНА</text>
    <line x1="26" y1="108" x2="454" y2="108" stroke="currentColor" stroke-width="2"/>
    <circle cx="52" cy="108" r="5" fill="var(--accent-blue, #2663C9)"/>
    <text x="52" y="88" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10" font-weight="700">321 до н.э.</text>
    <text x="52" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">Атропатена</text>

    <circle cx="136" cy="108" r="5" fill="var(--accent-green, #2E9E5B)"/>
    <text x="136" y="88" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10" font-weight="700">861</text>
    <text x="136" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">Ширваншахи</text>

    <circle cx="218" cy="108" r="5" fill="var(--accent-red, #D63031)"/>
    <text x="218" y="88" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10" font-weight="700">1501</text>
    <text x="218" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">Сефевиды</text>

    <circle cx="298" cy="108" r="5" fill="var(--accent-yellow, #DFB41D)"/>
    <text x="298" y="88" text-anchor="middle" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="10" font-weight="700">1813/28</text>
    <text x="298" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">Договоры</text>

    <circle cx="372" cy="108" r="5" fill="var(--accent-blue, #2663C9)"/>
    <text x="372" y="88" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10" font-weight="700">1918</text>
    <text x="372" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">АДР</text>

    <circle cx="438" cy="108" r="6" fill="var(--accent-green, #2E9E5B)"/>
    <text x="438" y="88" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10" font-weight="700">1991/2020</text>
    <text x="438" y="134" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="9">Независ.</text>

    <text x="22" y="182" fill="currentColor" opacity="0.75" font-family="monospace" font-size="10">АДР: 28 мая 1918 · Независимость: 18 октября 1991 · День Победы: 8 ноября 2020</text>
  </svg>`,

  'geo-scale': () => `${BASE_OPEN(480, 215, 'Компас азимутов и перевод масштаба')}${GRID_BG(480, 215)}
    <circle cx="128" cy="112" r="68" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <line x1="128" y1="36" x2="128" y2="188" stroke="currentColor" stroke-opacity="0.4"/>
    <line x1="52" y1="112" x2="204" y2="112" stroke="currentColor" stroke-opacity="0.4"/>
    <polygon points="128,46 122,112 134,112" fill="var(--accent-red, #D63031)"/>
    <text x="128" y="30" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12" font-weight="700">С · 0°</text>
    <text x="222" y="116" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">В · 90°</text>
    <text x="128" y="204" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">Ю · 180°</text>
    <text x="32" y="116" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">З · 270°</text>

    <rect x="266" y="28" width="194" height="162" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="278" y="54" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11" font-weight="700">ПЕРЕВОД МАСШТАБА</text>
    <text x="278" y="84" fill="currentColor" font-family="monospace" font-size="11">−2 нуля → в метрах</text>
    <text x="278" y="108" fill="currentColor" font-family="monospace" font-size="11">−5 нулей → в км</text>
    <text x="278" y="140" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">1 : 500 000 = 5 км/см</text>
    <text x="278" y="168" fill="currentColor" opacity="0.75" font-family="monospace" font-size="10">1° меридиана ≈ 111 км</text>
  </svg>`,

  'geo-atmo': () => `${BASE_OPEN(480, 215, 'Высотная поясность: температура и давление')}${GRID_BG(480, 215)}
    <polygon points="36,184 185,38 308,184" fill="var(--accent-blue, #2663C9)" fill-opacity="0.14" stroke="currentColor" stroke-width="2"/>
    <line x1="150" y1="72" x2="218" y2="72" stroke="var(--accent-blue, #2663C9)" stroke-dasharray="4 3"/>
    <text x="185" y="30" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">Базардюзю 4466 м</text>
    <text x="38" y="198" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">Каспий −28 м</text>
    <line x1="36" y1="184" x2="314" y2="184" stroke="currentColor" stroke-width="1.5"/>

    <rect x="322" y="28" width="144" height="158" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="332" y="54" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="11" font-weight="700">ГРАДИЕНТЫ</text>
    <text x="332" y="84" fill="currentColor" font-family="monospace" font-size="10">Температура:</text>
    <text x="332" y="102" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="11">−6 °C / 1 км</text>
    <text x="332" y="134" fill="currentColor" font-family="monospace" font-size="10">Давление:</text>
    <text x="332" y="152" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">−10 мм / 100 м</text>
    <text x="332" y="176" fill="currentColor" opacity="0.7" font-family="monospace" font-size="9">Норма: 760 мм</text>
  </svg>`,

  'info-radix': () => `${BASE_OPEN(480, 195, 'Веса разрядов двоичной системы счисления')}${GRID_BG(480, 195)}
    <text x="24" y="32" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ВЕСА РАЗРЯДОВ ДВОИЧНОЙ СИСТЕМЫ (2ⁿ)</text>
    ${[128, 64, 32, 16, 8, 4, 2, 1].map((w, i) => {
      const x = 24 + i * 54;
      const bit = [0, 0, 1, 0, 1, 1, 0, 1][i];
      return `
        <rect x="${x}" y="54" width="48" height="36" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
        <text x="${x + 24}" y="76" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="11">${w}</text>
        <rect x="${x}" y="90" width="48" height="42" fill="${bit ? 'var(--accent-blue, #2663C9)' : 'none'}" fill-opacity="${bit ? '0.24' : '0'}" stroke="${bit ? 'var(--accent-blue, #2663C9)' : 'currentColor'}" stroke-width="${bit ? '1.8' : '1'}"/>
        <text x="${x + 24}" y="117" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="15" font-weight="700">${bit}</text>`;
    }).join('')}
    <text x="24" y="166" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">101101₂ = 32 + 8 + 4 + 1 = 45₁₀ = 2D₁₆</text>
  </svg>`,

  'info-logic': () => `${BASE_OPEN(480, 200, 'Логические операции И, ИЛИ, НЕ')}${GRID_BG(480, 200)}
    <rect x="22" y="28" width="138" height="146" fill="none" stroke="var(--accent-blue, #2663C9)" stroke-width="1.6"/>
    <text x="91" y="54" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="12" font-weight="700">И · AND (∧)</text>
    <text x="91" y="84" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">1 ∧ 1 = 1</text>
    <text x="91" y="108" text-anchor="middle" fill="currentColor" opacity="0.75" font-family="monospace" font-size="11">иначе → 0</text>
    <text x="91" y="148" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">умножение</text>

    <rect x="171" y="28" width="138" height="146" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="240" y="54" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="12" font-weight="700">ИЛИ · OR (∨)</text>
    <text x="240" y="84" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">0 ∨ 0 = 0</text>
    <text x="240" y="108" text-anchor="middle" fill="currentColor" opacity="0.75" font-family="monospace" font-size="11">иначе → 1</text>
    <text x="240" y="148" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">сложение</text>

    <rect x="320" y="28" width="138" height="146" fill="none" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="389" y="54" text-anchor="middle" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="12" font-weight="700">НЕ · NOT (¬)</text>
    <text x="389" y="84" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">¬1 = 0, ¬0 = 1</text>
    <text x="389" y="114" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">де Морган:</text>
    <text x="389" y="138" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="10">¬(A∧B)=¬A∨¬B</text>
    <text x="389" y="158" text-anchor="middle" fill="currentColor" opacity="0.7" font-family="monospace" font-size="10">Приоритет: ¬ → ∧ → ∨</text>
  </svg>`,

  'info-python': () => `${BASE_OPEN(480, 210, 'Блок-схема цикла и ветвления')}${GRID_BG(480, 210)}
    <rect x="44" y="24" width="120" height="32" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <text x="104" y="45" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">s = 0; i = 1</text>
    <line x1="104" y1="56" x2="104" y2="76" stroke="currentColor" stroke-width="1.5"/>
    <polygon points="104,76 168,108 104,140 40,108" fill="var(--accent-blue, #2663C9)" fill-opacity="0.14" stroke="var(--accent-blue, #2663C9)" stroke-width="1.8"/>
    <text x="104" y="112" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">i ≤ n ?</text>
    <line x1="168" y1="108" x2="218" y2="108" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="188" y="100" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="10">Да</text>
    <rect x="218" y="88" width="136" height="40" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.6"/>
    <text x="286" y="112" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">s += i; i += 1</text>
    <path d="M 286 88 L 286 64 L 104 64" fill="none" stroke="var(--accent-green, #2E9E5B)" stroke-width="1.4" stroke-dasharray="4 3"/>
    <line x1="104" y1="140" x2="104" y2="164" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="114" y="156" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">Нет</text>
    <rect x="44" y="164" width="120" height="32" fill="none" stroke="var(--accent-red, #D63031)" stroke-width="1.6"/>
    <text x="104" y="185" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11">print(s)</text>

    <rect x="368" y="24" width="96" height="172" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="378" y="50" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="10" font-weight="700">PYTHON</text>
    <text x="378" y="76" fill="currentColor" font-family="monospace" font-size="10">// цел. дел</text>
    <text x="378" y="100" fill="currentColor" font-family="monospace" font-size="10">% остаток</text>
    <text x="378" y="124" fill="currentColor" font-family="monospace" font-size="10">** степень</text>
    <text x="378" y="148" fill="currentColor" font-family="monospace" font-size="10">range(a,b)</text>
    <text x="378" y="172" fill="currentColor" opacity="0.7" font-family="monospace" font-size="9">без b!</text>
  </svg>`,

  'info-net': () => `${BASE_OPEN(480, 195, 'Структура URL и IPv4-адреса')}${GRID_BG(480, 195)}
    <text x="24" y="34" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">АНАТОМИЯ URL-АДРЕСА</text>
    <rect x="24" y="48" width="92" height="38" fill="var(--accent-blue, #2663C9)" fill-opacity="0.16" stroke="var(--accent-blue, #2663C9)"/>
    <text x="70" y="72" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">https://</text>
    <text x="70" y="102" text-anchor="middle" fill="var(--accent-blue, #2663C9)" font-family="monospace" font-size="9">протокол</text>

    <rect x="122" y="48" width="160" height="38" fill="var(--accent-green, #2E9E5B)" fill-opacity="0.16" stroke="var(--accent-green, #2E9E5B)"/>
    <text x="202" y="72" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">ulduz.edu.az</text>
    <text x="202" y="102" text-anchor="middle" fill="var(--accent-green, #2E9E5B)" font-family="monospace" font-size="9">сервер / домен</text>

    <rect x="288" y="48" width="168" height="38" fill="var(--accent-yellow, #DFB41D)" fill-opacity="0.16" stroke="var(--accent-yellow, #DFB41D)"/>
    <text x="372" y="72" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="11" font-weight="700">/exam/physics.pdf</text>
    <text x="372" y="102" text-anchor="middle" fill="var(--accent-yellow, #DFB41D)" font-family="monospace" font-size="9">путь и файл</text>

    <rect x="24" y="122" width="432" height="54" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
    <text x="38" y="146" fill="currentColor" font-family="monospace" font-size="11">IPv4 = 4 октета по 8 бит (0..255): 192 . 168 . 1 . 10</text>
    <text x="38" y="166" fill="var(--accent-red, #D63031)" font-family="monospace" font-size="10">Адрес сети = IP &amp; Маска (побитовое И) · 1 байт = 8 бит</text>
  </svg>`,
};

export function renderLessonDiagram(key) {
  const fn = DIAGRAMS[key] || DIAGRAMS['math-quad'];
  return fn();
}
