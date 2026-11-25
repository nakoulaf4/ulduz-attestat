# Self-Test Report: `math` (Математика)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 53
- **Originals count**: 50 ({"Attestat_all_09.03.2026_1773051095.pdf":25,"Attestat_all_15.03.2026_1773569675.pdf":25})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `math.interval-count` | Числа, дроби и проценты | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.fractions-percent` | Числа, дроби и проценты | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.percent-word` | Числа, дроби и проценты | `short` | 200/200 | YES | 200 | 0% | 0 |
| `math.train-motion` | Числа, дроби и проценты | `short` | 200/200 | YES | 182 | 9% | 0 |
| `math.sets-ops` | Множества | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.venn-ineq` | Множества | `short` | 200/200 | YES | 200 | 0% | 0 |
| `math.combinatorics` | Комбинаторика, вероятность и статистика | `single` | 200/200 | YES | 191 | 4.5% | 0 |
| `math.probability-subsets` | Комбинаторика, вероятность и статистика | `single` | 200/200 | YES | 195 | 2.5% | 0 |
| `math.probability-digits` | Комбинаторика, вероятность и статистика | `short` | 200/200 | YES | 72 | 64% | 0 |
| `math.gcd-lcm` | Числа, дроби и проценты | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.statistics` | Комбинаторика, вероятность и статистика | `short` | 200/200 | YES | 200 | 0% | 0 |
| `math.diff-squares-eval` | Алгебраические выражения | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.poly-factor` | Алгебраические выражения | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.rational-simplify` | Алгебраические выражения | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.real-power` | Степени и логарифмы | `single` | 200/200 | YES | 197 | 1.5% | 0 |
| `math.abs-eval` | Алгебраические выражения | `short` | 200/200 | YES | 196 | 2% | 0 |
| `math.log-eval` | Степени и логарифмы | `short` | 200/200 | YES | 186 | 7% | 0 |
| `math.log-equation` | Степени и логарифмы | `short` | 200/200 | YES | 48 | 76% | 0 |
| `math.linear-ineq` | Неравенства | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.exp-ineq` | Неравенства | `short` | 200/200 | YES | 45 | 77.5% | 0 |
| `math.quad-ineq` | Неравенства | `short` | 200/200 | YES | 117 | 41.5% | 0 |
| `math.rational-motion-eq` | Уравнения и системы уравнений | `short` | 200/200 | YES | 168 | 16% | 0 |
| `math.linear-eq-table` | Уравнения и системы уравнений | `short` | 200/200 | YES | 192 | 4% | 0 |
| `math.linear-system-word` | Уравнения и системы уравнений | `short` | 200/200 | YES | 193 | 3.5% | 0 |
| `math.arith-prog-diff` | Прогрессии | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.arith-prog-sum` | Прогрессии | `short` | 200/200 | YES | 128 | 36% | 0 |
| `math.vieta-quad` | Уравнения и системы уравнений | `short` | 200/200 | YES | 103 | 48.5% | 0 |
| `math.geom-prog` | Прогрессии | `short` | 200/200 | YES | 75 | 62.5% | 0 |
| `math.func-eval` | Функции и графики | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.coords-quadrant` | Метод координат | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.midpoint-param` | Метод координат | `short` | 200/200 | YES | 195 | 2.5% | 0 |
| `math.parabola-right-tri` | Функции и графики | `short` | 200/200 | YES | 16 | 92% | 0 |
| `math.trig-sum-prod` | Тригонометрия | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.trig-special-val` | Тригонометрия | `single` | 200/200 | YES | 195 | 2.5% | 0 |
| `math.trig-quadrant-signs` | Тригонометрия | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.trig-half-angle` | Тригонометрия | `single` | 200/200 | YES | 193 | 3.5% | 0 |
| `math.trig-equation` | Тригонометрия | `single` | 200/200 | YES | 196 | 2% | 0 |
| `math.parallel-angles` | Планиметрия | `short` | 200/200 | YES | 13 | 93.5% | 0 |
| `math.right-tri-trig` | Планиметрия | `single` | 200/200 | YES | 181 | 9.5% | 0 |
| `math.tri-similarity` | Планиметрия | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.ships-similarity` | Планиметрия | `short` | 200/200 | YES | 34 | 83% | 0 |
| `math.bisector-area` | Планиметрия | `short` | 200/200 | YES | 96 | 52% | 0 |
| `math.rect-perimeter` | Планиметрия | `single` | 200/200 | YES | 199 | 0.5% | 0 |
| `math.polygon-diagonals` | Планиметрия | `single` | 200/200 | YES | 181 | 9.5% | 0 |
| `math.trapezoid-area` | Планиметрия | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.circle-inscribed-angles` | Планиметрия | `single` | 200/200 | YES | 191 | 4.5% | 0 |
| `math.circle-tangent-secant` | Планиметрия | `short` | 200/200 | YES | 25 | 87.5% | 0 |
| `math.prism-base` | Стереометрия | `single` | 200/200 | YES | 200 | 0% | 0 |
| `math.prism-lateral` | Стереометрия | `short` | 200/200 | YES | 168 | 16% | 0 |
| `math.cone-angle` | Стереометрия | `short` | 200/200 | YES | 67 | 66.5% | 0 |
| `math.cone-rotation` | Стереометрия | `short` | 200/200 | YES | 18 | 91% | 0 |
| `math.vectors-2d` | Векторы | `single` | 200/200 | YES | 198 | 1% | 0 |
| `math.cylinder-sphere` | Стереометрия | `short` | 200/200 | YES | 104 | 48% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 25
- **Total raw points per exam**: 32
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/math.json`)

- **File exists**: YES
- **Valid JSON**: YES
- **Total tasks**: 50
- **By PDF**: `{"Attestat_all_09.03.2026_1773051095.pdf":25,"Attestat_all_15.03.2026_1773569675.pdf":25}`
- **Errors**: None
