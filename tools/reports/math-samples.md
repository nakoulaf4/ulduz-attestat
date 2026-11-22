# Manual QA Sample: `math` (seed=202603)

## Generated Sample (25 tasks across 53 taskTypes)

### GEN #1 (seed=42497, diff=1)
- **id**: `math.parallel-angles#42497` | **typeId**: `math.parallel-angles` | **format**: `short` | **difficulty**: 1 | **points**: 2 | **topic**: Планиметрия
- **stem**: $\alpha$ и $\beta$ — разноимённые углы с соответственно параллельными сторонами, а $\gamma$ и $\varphi$ — одноимённые углы с соответственно параллельными сторонами. Градусная мера $\gamma$ на $40\%$ меньше $\alpha$, а градусная мера $\varphi$ на $40\%$ больше $\beta$. Найдите градусные меры $\alpha$ и $\beta$ (введите через точку с запятой, например: 108; 72).
- **answer**: `"126; 54"` | **accept**: `["126°; 54°","126, 54"]`
- **explanation**: Так как $\alpha$ и $\beta$ разноимённые, $\alpha + \beta = 180^\circ$. Так как $\gamma$ и $\varphi$ одноимённые, $\gamma = \varphi$. По условию $\gamma = 0{,}6\alpha$ и $\varphi = 1{,}4\beta$, откуда $0{,}6\alpha = 1{,}4\beta$ ($\gamma = \varphi = 75{,}6^\circ$). Решая совместно с $\alpha + \beta = 180^\circ$, находим $\alpha = 126^\circ$ и $\beta = 54^\circ$.

### GEN #2 (seed=3243, diff=2)
- **id**: `math.poly-factor#3243` | **typeId**: `math.poly-factor` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Алгебраические выражения
- **stem**: Разложите многочлен $13b^2 - 26b$ на множители.
- **options**:
  - [0] A) $b(2b - 26)$
  - [1] B) $13(b - 26)$
  - [2] C) $13b(2b - 2)$
  - [3] D) $13b(b - 2)$  **<-- ANSWER**
  - [4] E) $13b(b + 2)$
- **answer**: `3`
- **explanation**: Общим множителем обоих слагаемых является $13b$. Выносим его за скобки: $13b^2 - 26b = 13b(b - 2)$.

### GEN #3 (seed=32629, diff=3)
- **id**: `math.trapezoid-area#32629` | **typeId**: `math.trapezoid-area` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Планиметрия
- **image**: alt="Прямоугольная трапеция с верхним основанием 4, нижним основанием 8 и высотой 11" | src=(inline svg, len=1008)
- **stem**: Найдите площадь прямоугольной трапеции по данным на рисунке.
- **options**:
  - [0] A) $132$
  - [1] B) $66$  **<-- ANSWER**
  - [2] C) $44$
  - [3] D) $176$
  - [4] E) $23$
- **answer**: `1`
- **explanation**: По формуле площади трапеции $S = \frac{a + b}{2} \cdot h = \frac{4 + 8}{2} \cdot 11 = 66$.

### GEN #4 (seed=18344, diff=1)
- **id**: `math.right-tri-trig#18344` | **typeId**: `math.right-tri-trig` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Планиметрия
- **image**: alt="Прямоугольный треугольник ABC с прямым углом C, катетами a=BC, b=AC, гипотенузой c=AB и острыми углами α при B и β при A" | src=(inline svg, len=2015)
- **stem**: В прямоугольном треугольнике $ABC$ ($\angle C = 90^\circ$) выразите $\sin\alpha \cdot \cos\beta$ через $a, b, c$ (см. рисунок).
- **options**:
  - [0] A) $\frac{b^2}{c^2}$  **<-- ANSWER**
  - [1] B) $\frac{b}{c}$
  - [2] C) $\frac{ab}{c^2}$
  - [3] D) $\frac{a^2}{c^2}$
  - [4] E) $\frac{c^2}{b^2}$
- **answer**: `0`
- **explanation**: По рисунку $\sin\alpha = \frac{b}{c}$ и $\cos\beta = \frac{b}{c}$. Перемножая, получаем $\sin\alpha \cdot \cos\beta = \frac{b}{c} \cdot \frac{b}{c} = \frac{b^2}{c^2}$.

### GEN #5 (seed=29539, diff=2)
- **id**: `math.trig-equation#29539` | **typeId**: `math.trig-equation` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Тригонометрия
- **stem**: Дано $\cos\alpha = -\frac{12}{13}$ и $180^\circ \lt \alpha \lt 270^\circ$. Найдите $\sin\alpha$.
- **options**:
  - [0] A) $-\frac{5}{13}$  **<-- ANSWER**
  - [1] B) $\frac{13}{5}$
  - [2] C) $-\frac{13}{5}$
  - [3] D) $\frac{5}{13}$
  - [4] E) $\frac{5}{12}$
- **answer**: `0`
- **explanation**: Из тождества $\sin^2\alpha + \cos^2\alpha = 1$ находим модуль $\sin\alpha$: $\frac{5}{13}$. Учитывая, что угол $\alpha$ в III четверти, $\sin\alpha = -\frac{5}{13}$ и $\cos\alpha = -\frac{12}{13}$. Ответ: $-\frac{5}{13}$.

### GEN #6 (seed=7276, diff=3)
- **id**: `math.rect-perimeter#7276` | **typeId**: `math.rect-perimeter` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Планиметрия
- **stem**: Найдите периметр прямоугольника с шириной $31$ и длиной $m + 7$.
- **options**:
  - [0] A) $P = 2(38 + m)$  **<-- ANSWER**
  - [1] B) $P = 2(38 + 2m)$
  - [2] C) $P = 38 + m$
  - [3] D) $P = 2(76 + 2m)$
  - [4] E) $P = 2(19 + m)$
- **answer**: `0`
- **explanation**: По формуле периметра прямоугольника $P = 2(a + b)$ получаем $P = 2(31 + m + 7) = 2(38 + m)$.

### GEN #7 (seed=40199, diff=1)
- **id**: `math.circle-tangent-secant#40199` | **typeId**: `math.circle-tangent-secant` | **format**: `short` | **difficulty**: 1 | **points**: 2 | **topic**: Планиметрия
- **image**: alt="Окружность с центром O, касательной AB и секущей AD (C и D на окружности), угол BAD прямой" | src=(inline svg, len=1662)
- **stem**: Из внешней точки $A$ к окружности проведены касательная $AB$ и секущая $AD$ (пересекает окружность в точках $C$ и $D$). Известно, что $\angle BAD = 90^\circ$, $AB = 2\sqrt{14}$ см и $AC = 4$ см. Найдите радиус окружности (в см).
- **answer**: `"9"` | **accept**: `["9 см"]`
- **explanation**: По теореме о касательной и секущей $AB^2 = AC \cdot AD \Rightarrow 56 = 4 \cdot (4 + CD) \Rightarrow CD = 10$ см. Опустим перпендикуляр $OM \perp CD$: хорда делится пополам, $CM = MD = 5$ см. Так как $\angle BAD = \angle OBA = \angle OMA = 90^\circ$, четырёхугольник $OBAM$ — прямоугольник, значит $OM = AB = 2\sqrt{14}$ и $AM = OB = R$. Тогда $MC = R - 4$, и из $\triangle OMC$ по теореме Пифагора: $R^2 = 56 + (R - 4)^2 \Rightarrow 8R = 72 \Rightarrow R = 9$ см.

### GEN #8 (seed=20241, diff=2)
- **id**: `math.combinatorics#20241` | **typeId**: `math.combinatorics` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Комбинаторика, вероятность и статистика
- **stem**: Вычислите значение выражения $5! - 4!$ (то есть $P_{5} - P_{4}$).
- **options**:
  - [0] A) $144$
  - [1] B) $1$
  - [2] C) $48$
  - [3] D) $106$
  - [4] E) $96$  **<-- ANSWER**
- **answer**: `4`
- **explanation**: $P_{5} = 5! = 120$, $P_{4} = 4! = 24$. Тогда $120 - 24 = 96$.

### GEN #9 (seed=29553, diff=3)
- **id**: `math.sets-ops#29553` | **typeId**: `math.sets-ops` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Множества
- **stem**: Даны множества $A = \{3;\ 6;\ 8;\ 11;\ 16\}$ и $B = \{6;\ 7;\ 8;\ 9\}$. Найдите $A \cup B$.
- **options**:
  - [0] A) $\{3;\ 6;\ 7;\ 8;\ 9;\ 11;\ 16\}$  **<-- ANSWER**
  - [1] B) $\{6;\ 8\}$
  - [2] C) $\{3;\ 11;\ 16\}$
  - [3] D) $\varnothing$
  - [4] E) $\{7;\ 9\}$
- **answer**: `0`
- **explanation**: Множество $A \cup B$ содержит все элементы, входящие хотя бы в одно из множеств $A$ или $B$: $\{3;\ 6;\ 7;\ 8;\ 9;\ 11;\ 16\}$.

### GEN #10 (seed=3969, diff=1)
- **id**: `math.probability-digits#3969` | **typeId**: `math.probability-digits` | **format**: `short` | **difficulty**: 1 | **points**: 1 | **topic**: Комбинаторика, вероятность и статистика
- **stem**: Из натуральных чисел от $1$ до $20$ включительно наугад выбирается одно. Найдите вероятность того, что оно кратно $4$.
- **answer**: `"0,25"` | **accept**: `["0.25","1/4"]`
- **explanation**: Всего в наборе $20$ чисел, из них кратны $4$ числа $4, 8, 12, 16, 20$ ($5$ чисел). Вероятность: $P = \frac{5}{20} = 0{,}25$.

### GEN #11 (seed=25669, diff=2)
- **id**: `math.venn-ineq#25669` | **typeId**: `math.venn-ineq` | **format**: `short` | **difficulty**: 2 | **points**: 2 | **topic**: Множества
- **image**: alt="Диаграмма Эйлера–Венна: в левой части 5x + 2, в пересечении 3x - 6, в правой части 18 - 2x" | src=(inline svg, len=1324)
- **stem**: На диаграмме Эйлера–Венна указано количество элементов множеств $A$ и $B$: $n(A \setminus B) = 5x + 2$, $n(A \cap B) = 3x - 6$, $n(B \setminus A) = 18 - 2x$. Известно, что $n(A \cap B) > n(B \setminus A)$. Найдите сумму наименьшего и наибольшего возможных значений $n(A \setminus B)$ при натуральных значениях $x$.
- **answer**: `"69"`
- **explanation**: Из условия $n(A \cap B) > n(B \setminus A)$ получаем $3x - 6 > 18 - 2x \Rightarrow 5x > 24$, откуда наименьшее натуральное $x = 5$. Поскольку число элементов $n(B \setminus A)$ положительно, $18 - 2x > 0 \Rightarrow x \lt \frac{18}{2}$, значит наибольшее натуральное $x = 8$. При $x \in [5;\ 8]$ выражение $n(A \setminus B) = 5x + 2$ принимает наименьшее значение $5\cdot5+2=27$ и наибольшее $5\cdot8+2=42$. Их сумма: $27 + 42 = 69$.

### GEN #12 (seed=22179, diff=3)
- **id**: `math.polygon-diagonals#22179` | **typeId**: `math.polygon-diagonals` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Планиметрия
- **stem**: Найдите сумму внутренних углов выпуклого четырёхугольника.
- **options**:
  - [0] A) $360^\circ$  **<-- ANSWER**
  - [1] B) $720^\circ$
  - [2] C) $180^\circ$
  - [3] D) $900^\circ$
  - [4] E) $540^\circ$
- **answer**: `0`
- **explanation**: Подставляя $n = 4$ в формулу $180^\circ(n - 2)$, получаем $180^\circ \cdot 2 = 360^\circ$.

### GEN #13 (seed=24778, diff=1)
- **id**: `math.linear-system-word#24778` | **typeId**: `math.linear-system-word` | **format**: `short` | **difficulty**: 1 | **points**: 2 | **topic**: Уравнения и системы уравнений
- **stem**: В коллективе из $18$ сотрудников средний возраст женщин равен $18$ годам, а средний возраст мужчин — $54$ годам. Если средний возраст всех сотрудников равен $40$ годам, сколько мужчин в этом коллективе?
- **answer**: `"11"`
- **explanation**: Обозначим число женщин за $x$, а мужчин за $y$. Имеем систему: $x + y = 18$ и $18x + 54y = 40\cdot 18$. Подставив $x = 18 - y$, получаем $(54 - 18)y = (40 - 18)\cdot 18$, откуда $y = 11$ и $x = 7$. Искомое количество мужчин: $11$.

### GEN #14 (seed=4484, diff=2)
- **id**: `math.func-eval#4484` | **typeId**: `math.func-eval` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Функции и графики
- **stem**: Дана функция $f(x) = \frac{5x + 6}{x^2 + 4}$. Вычислите $f(4)$.
- **options**:
  - [0] A) $\frac{13}{4}$
  - [1] B) $\frac{7}{5}$
  - [2] C) $\frac{27}{20}$
  - [3] D) $\frac{5}{4}$
  - [4] E) $\frac{13}{10}$  **<-- ANSWER**
- **answer**: `4`
- **explanation**: Подставим $x = 4$: $f(4) = \frac{5 \cdot 4 + 6}{4^2 + 4} = \frac{26}{20} = \frac{13}{10}$.

### GEN #15 (seed=35829, diff=3)
- **id**: `math.quad-ineq#35829` | **typeId**: `math.quad-ineq` | **format**: `short` | **difficulty**: 3 | **points**: 1 | **topic**: Неравенства
- **stem**: Найдите сумму целых решений неравенства $x^2 + 5x + 4 \le 0$.
- **answer**: `"-10"`
- **explanation**: Корни уравнения $x^2 + 5x + 4 = 0$: $x_1 = -4$, $x_2 = -1$. Методом интервалов получаем $x \in [-4;\ -1]$. Целые решения: $-4, -3, -2, -1$. Их сумма равна $-10$.

### GEN #16 (seed=27167, diff=1)
- **id**: `math.trig-special-val#27167` | **typeId**: `math.trig-special-val` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Тригонометрия
- **stem**: Найдите значение выражения $\sin^2 30^\circ + \cos^2 30^\circ$.
- **options**:
  - [0] A) $\frac{3}{4}$
  - [1] B) $0$
  - [2] C) $\frac{1}{2}$
  - [3] D) $1$  **<-- ANSWER**
  - [4] E) $2$
- **answer**: `3`
- **explanation**: Подставляя табличные значения: $\left(\frac{1}{2}\right)^2 + \left(\frac{\sqrt{3}}{2}\right)^2 = \frac{1}{4} + \frac{3}{4} = 1$.

### GEN #17 (seed=18126, diff=2)
- **id**: `math.midpoint-param#18126` | **typeId**: `math.midpoint-param` | **format**: `short` | **difficulty**: 2 | **points**: 2 | **topic**: Метод координат
- **stem**: Середина отрезка, соединяющего точки $A(k^2 - 2k;\ k^2 - k)$ и $B(-k - 4;\ -6k + 6)$, лежит на отрицательной полуоси абсцисс. Найдите значение $k$.
- **answer**: `"1"`
- **explanation**: Координаты середины отрезка $AB$: $x_M = \frac{k^2 - 3k - 4}{2}$ и $y_M = \frac{k^2 - 7k + 6}{2}$. Так как $M$ лежит на отрицательной полуоси абсцисс, $y_M = 0$ и $x_M \lt 0$. Из $k^2 - 7k + 6 = 0$ находим $k_1 = 1$ и $k_2 = 6$. Условие $k^2 - 3k - 4 \lt 0$ выполняется на интервале $(-1;\ 4)$, куда попадает только $k = 1$.

### GEN #18 (seed=45017, diff=3)
- **id**: `math.linear-eq-table#45017` | **typeId**: `math.linear-eq-table` | **format**: `short` | **difficulty**: 3 | **points**: 2 | **topic**: Уравнения и системы уравнений
- **stem**: Авиакомпания продаёт билеты в одну сторону за $160$ манат, а туда и обратно — за $220$ манат. В таблице указано количество билетов, купленных Асифом и Нурай (каждый купил хотя бы по одному билету обоих видов). <table><thead><tr><th>Тип билета</th><th>Асиф</th><th>Нурай</th></tr></thead><tbody><tr><td>В одну сторону ($160$ манат)</td><td>$31 - x$</td><td>$x + 6$</td></tr><tr><td>Туда и обратно ($220$ манат)</td><td>$x$</td><td>$22 - x$</td></tr></tbody></table>Если оба заплатили одинаковую сумму, сколько билетов в одну сторону купила Нурай?
- **answer**: `"13"`
- **explanation**: Сумма Асифа: $(31 - x)\cdot 160 + 220x$. Сумма Нурай: $(x + 6)\cdot 160 + (22 - x)\cdot 220$. Приравнивая суммы: $4960 + (60)x = 5800 - (60)x \Rightarrow 120x = 840 \Rightarrow x = 7$. Количество билетов в одну сторону у Нурай: $x + 6 = 7 + 6 = 13$.

### GEN #19 (seed=42736, diff=1)
- **id**: `math.percent-word#42736` | **typeId**: `math.percent-word` | **format**: `short` | **difficulty**: 1 | **points**: 2 | **topic**: Числа, дроби и проценты
- **stem**: Продавец в магазине техники с фиксированным окладом $1000$ манат получает дополнительно $4\%$ от стоимости каждого проданного товара ценой $250$ манат. В январе его доход составил $1390$ манат, а в феврале — $1510$ манат. На сколько больше товаров он продал в феврале, чем в январе?
- **answer**: `"12"`
- **explanation**: Бонус за одну продажу: $250 \cdot \frac{4}{100} = 10$ манат. Разница в доходе равна $1510 - 1390 = 120$ манат. Так как оклад фиксированный, разница обеспечена дополнительными продажами: $\frac{120}{10} = 12$.

### GEN #20 (seed=28651, diff=2)
- **id**: `math.fractions-percent#28651` | **typeId**: `math.fractions-percent` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Числа, дроби и проценты
- **stem**: Найдите число, $15\%$ которого равны значению выражения $3 \cdot 2\frac{1}{2} + 4{,}5$.
- **options**:
  - [0] A) $75$
  - [1] B) $800$
  - [2] C) $80$  **<-- ANSWER**
  - [3] D) $90$
  - [4] E) $1{,}8$
- **answer**: `2`
- **explanation**: Вычислим значение выражения: $3 \cdot 2\frac{1}{2} + 4{,}5 = 7{,}5 + 4{,}5 = 12$. Число, $15\%$ которого равны $12$, равно $\frac{12 \cdot 100}{15} = 80$.

### GEN #21 (seed=22643, diff=3)
- **id**: `math.real-power#22643` | **typeId**: `math.real-power` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Степени и логарифмы
- **stem**: Найдите значение выражения $\left(3^{\sqrt{5}}\right)^{\sqrt{5}}$.
- **options**:
  - [0] A) $243$  **<-- ANSWER**
  - [1] B) $15$
  - [2] C) $59049$
  - [3] D) $3$
  - [4] E) $729$
- **answer**: `0`
- **explanation**: $\left(3^{\sqrt{5}}\right)^{\sqrt{5}} = 3^{\sqrt{5} \cdot \sqrt{5}} = 3^{5} = 243$.

### GEN #22 (seed=3950, diff=1)
- **id**: `math.diff-squares-eval#3950` | **typeId**: `math.diff-squares-eval` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Алгебраические выражения
- **stem**: Вычислите значение выражения $\frac{313^2 - 87^2}{113}$.
- **options**:
  - [0] A) $800$  **<-- ANSWER**
  - [1] B) $1200$
  - [2] C) $452$
  - [3] D) $80$
  - [4] E) $8000$
- **answer**: `0`
- **explanation**: Применим формулу разности квадратов: $\frac{(313 + 87)(313 - 87)}{113} = \frac{400 \cdot 226}{113} = 400 \cdot 2 = 800$.

### GEN #23 (seed=45610, diff=2)
- **id**: `math.prism-lateral#45610` | **typeId**: `math.prism-lateral` | **format**: `short` | **difficulty**: 2 | **points**: 1 | **topic**: Стереометрия
- **stem**: Периметр основания прямой призмы равен $28$, а боковое ребро — $8$. Найдите площадь боковой поверхности призмы.
- **answer**: `"224"`
- **explanation**: По формуле $S_{\text{бок}} = P_{\text{осн}} \cdot H = 28 \cdot 8 = 224$.

### GEN #24 (seed=13445, diff=3)
- **id**: `math.abs-eval#13445` | **typeId**: `math.abs-eval` | **format**: `short` | **difficulty**: 3 | **points**: 1 | **topic**: Алгебраические выражения
- **stem**: Найдите значение выражения $5x^2  + 5|x| + 3$ при $x = -1{,}5$.
- **answer**: `"21,75"` | **accept**: `["21.75"]`
- **explanation**: Подставим $x = -1{,}5$, учитывая $|-1{,}5| = 1{,}5$ и $(-1{,}5)^2 = 2{,}25$: $5 \cdot 2{,}25 + 5 \cdot 1{,}5 + 3 = 11{,}25 + 7{,}5 + 3 = 21{,}75$.

### GEN #25 (seed=9879, diff=1)
- **id**: `math.gcd-lcm#9879` | **typeId**: `math.gcd-lcm` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Числа, дроби и проценты
- **stem**: Найдите $\text{НОК}(18;\ 24)$.
- **options**:
  - [0] A) $42$
  - [1] B) $6$
  - [2] C) $12$
  - [3] D) $72$  **<-- ANSWER**
  - [4] E) $432$
- **answer**: `3`
- **explanation**: $18 = 6 \cdot 3$ и $24 = 6 \cdot 4$, где $3$ и $4$ взаимно просты. Поэтому $\text{НОК}(18;\ 24) = 6 \cdot 3 \cdot 4 = 72$.

## Exam Order & Points Check (seed=203380)

Total tasks: 25, Total raw points: 32

1. `math.rect-perimeter` (single, 1 pt, diff=1) — Найдите периметр прямоугольника с шириной $57$ и длиной $k$.
2. `math.fractions-percent` (single, 1 pt, diff=1) — Найдите число, $20\%$ которого равны значению выражения $1{,}5 \cdot 1\frac{2}{3} - 0{,}5$
3. `math.coords-quadrant` (single, 1 pt, diff=1) — Точка $A$ расположена в III координатной четверти. Расстояние от точки $A$ до оси абсцисс 
4. `math.right-tri-trig` (single, 1 pt, diff=1) — В прямоугольном треугольнике $ABC$ ($\angle C = 90^\circ$) выразите $\sin\beta \cdot \oper
5. `math.trig-special-val` (single, 1 pt, diff=1) — Найдите значение выражения $\cos 30^\circ \cdot \operatorname{tg} 60^\circ$.
6. `math.rational-simplify` (single, 1 pt, diff=1) — Сократите дробь $\frac{4y^2 - 81}{2y - 9}$.
7. `math.trig-half-angle` (single, 1 pt, diff=2) — Если $\cos 50^\circ = a$, выразите $\cos 25^\circ$ через $a$.
8. `math.gcd-lcm` (single, 1 pt, diff=2) — Найдите $\text{НОД}(6;\ 15)$.
9. `math.real-power` (single, 1 pt, diff=2) — Найдите значение выражения $\left(2^{\sqrt{3}}\right)^{\sqrt{3}}$.
10. `math.combinatorics` (single, 1 pt, diff=2) — Вычислите значение выражения $5! - 2!$ (то есть $P_{5} - P_{2}$).
11. `math.prism-base` (single, 1 pt, diff=2) — Объём призмы равен $189$ см$^3$, а её высота — $7$ см. Найдите площадь основания призмы.
12. `math.probability-subsets` (single, 1 pt, diff=2) — Для множеств $A$ и $B$ известно, что $B \subset A$, $n(A) = 10$ и $n(B) = 3$. Найдите веро
13. `math.arith-prog-diff` (single, 1 pt, diff=2) — В арифметической прогрессии $(a_n)$ известно, что $a_{9} = -59$ и $a_{23} = -143$. Найдите
14. `math.log-equation` (short, 1 pt, diff=2) — Найдите произведение корней уравнения $\log_{3}\left(\log_{3}^2 x  - 3\log_{3} x + 11\righ
15. `math.exp-ineq` (short, 1 pt, diff=2) — Найдите наименьшее целое решение неравенства $3^{x+2} - 6 \cdot 3^x \lt 5^{x+1} - 2 \cdot 
16. `math.cylinder-sphere` (short, 1 pt, diff=2) — В основании правильной четырёхугольной пирамиды лежит квадрат со стороной $3$ см, а высота
17. `math.statistics` (short, 1 pt, diff=2) — Дан числовой ряд: $15;\ 6;\ 8;\ 15;\ 27;\ 10;\ 3$. Найдите среднее арифметическое этого ря
18. `math.abs-eval` (short, 1 pt, diff=2) — Найдите значение выражения $5x^2  + 8|x| - 3$ при $x = -2{,}5$.
19. `math.linear-eq-table` (short, 2 pts, diff=3) — Авиакомпания продаёт билеты в одну сторону за $120$ манат, а туда и обратно — за $190$ ман
20. `math.linear-system-word` (short, 2 pts, diff=2) — В коллективе из $22$ сотрудников средний возраст женщин равен $18$ годам, а средний возрас
21. `math.parabola-right-tri` (short, 2 pts, diff=3) — На рисунке изображён график квадратичной функции $f(x) = ax^2 + bx + c$. Известно, что $AC
22. `math.ships-similarity` (short, 2 pts, diff=3) — Два катера в точках $A$ и $B$ движутся по прямым $AE$ и $BD$, пересекающимся в точке $C$ (
23. `math.circle-tangent-secant` (short, 2 pts, diff=3) — Из внешней точки $A$ к окружности проведены касательная $AB$ и секущая $AD$ (пересекает ок
24. `math.cone-rotation` (short, 2 pts, diff=2) — Прямоугольный треугольник с катетами $9$ см и $12$ см вращается вокруг большего катета. На
25. `math.arith-prog-sum` (short, 2 pts, diff=3) — В первый день Агиль положил в пустую копилку $3$ монеты номиналом $50$ гяпиков, $1$ монету

## Originals Sample (12 of 50)

### ORIG #1 (math-1503-73)
- **id**: `math-1503-73` | **typeId**: `math.trig-half-angle` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Тригонометрия
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":73}`
- **stem**: Если $\cos 20^\circ = a$, выразите $\sin 10^\circ$ через $a$.
- **options**:
  - [0] A) $\sqrt{\frac{1 + a}{2}}$
  - [1] B) $\frac{a}{2}$
  - [2] C) $\frac{1 - a}{2}$
  - [3] D) $\sqrt{\frac{1 - a}{2}}$  **<-- ANSWER**
  - [4] E) $\frac{1 + a}{2}$
- **answer**: `3`
- **explanation**: По формуле половинного угла $\sin^2\alpha = \frac{1 - \cos 2\alpha}{2}$: $\sin^2 10^\circ = \frac{1 - \cos 20^\circ}{2} \Rightarrow \sin 10^\circ = \sqrt{\frac{1 - a}{2}}$.

### ORIG #2 (math-1503-74)
- **id**: `math-1503-74` | **typeId**: `math.prism-lateral` | **format**: `short` | **difficulty**: 1 | **points**: 1 | **topic**: Стереометрия
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":74}`
- **stem**: Найдите площадь боковой поверхности прямой призмы, периметр основания которой равен $15$, а боковое ребро равно $9$.
- **answer**: `"135"`
- **explanation**: По формуле боковой поверхности прямой призмы $S_{\text{бок}} = P_{\text{осн}} \cdot H = 15 \cdot 9 = 135$.

### ORIG #3 (math-1503-63)
- **id**: `math-1503-63` | **typeId**: `math.trapezoid-area` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Планиметрия
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":63}`
- **image**: alt="Прямоугольная трапеция с основаниями 2 и 4 и высотой 12" | src=(inline svg, len=1008)
- **stem**: Найдите площадь трапеции, изображённой на рисунке.
- **options**:
  - [0] A) $14$
  - [1] B) $40$
  - [2] C) $18$
  - [3] D) $15$
  - [4] E) $36$  **<-- ANSWER**
- **answer**: `4`
- **explanation**: По формуле площади трапеции $S = \frac{a + b}{2} \cdot h = \frac{2 + 4}{2} \cdot 12 = 36$.

### ORIG #4 (math-1503-85)
- **id**: `math-1503-85` | **typeId**: `math.arith-prog-sum` | **format**: `short` | **difficulty**: 3 | **points**: 2 | **topic**: Прогрессии
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":85}`
- **stem**: В первый день Агиль положил в пустую копилку $1$ монету по $50$ гяпиков, $2$ монеты по $20$ гяпиков и $3$ монеты по $10$ гяпиков. В каждый последующий день он увеличивал количество монет каждого вида на $1$ по сравнению с предыдущим днём. Через сколько дней в копилке накопится всего $48$ манат?
- **answer**: `"10"` | **accept**: `["10 дней"]`
- **explanation**: В 1-й день положено $a_1 = 50 + 2\cdot 20 + 3\cdot 10 = 120$ гяпиков, во 2-й день $200$ гяпиков, в 3-й — $280$ гяпиков ($d = 80$ гяпиков). Используя формулу суммы $S_n = \frac{2a_1 + d(n - 1)}{2}\cdot n = 4800$, получаем $\frac{240 + 80(n - 1)}{2}\cdot n = 4800 \Rightarrow n^2 + 2n - 120 = 0 \Rightarrow n = 10$ дней.

### ORIG #5 (math-0903-64)
- **id**: `math-0903-64` | **typeId**: `math.real-power` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Степени и логарифмы
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":64}`
- **stem**: Найдите значение выражения $\left(2^{\sqrt{2}}\right)^{\sqrt{2}}$.
- **options**:
  - [0] A) $4$  **<-- ANSWER**
  - [1] B) $8$
  - [2] C) $2$
  - [3] D) $64$
  - [4] E) $16$
- **answer**: `0`
- **explanation**: $\left(2^{\sqrt{2}}\right)^{\sqrt{2}} = 2^{\sqrt{2} \cdot \sqrt{2}} = 2^2 = 4$.

### ORIG #6 (math-1503-68)
- **id**: `math-1503-68` | **typeId**: `math.real-power` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Степени и логарифмы
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":68}`
- **stem**: Найдите значение выражения $16^{0{,}36} \cdot 16^{0{,}14}$.
- **options**:
  - [0] A) $8$
  - [1] B) $0{,}5$
  - [2] C) $0{,}25$
  - [3] D) $4$  **<-- ANSWER**
  - [4] E) $2$
- **answer**: `3`
- **explanation**: $16^{0{,}36} \cdot 16^{0{,}14} = 16^{0{,}36 + 0{,}14} = 16^{0{,}5} = \sqrt{16} = 4$.

### ORIG #7 (math-1503-62)
- **id**: `math-1503-62` | **typeId**: `math.func-eval` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Функции и графики
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":62}`
- **stem**: Если $f(x) = \frac{2x + 3}{x^2 + 2}$, вычислите $f(3)$.
- **options**:
  - [0] A) $\frac{6}{11}$
  - [1] B) $\frac{7}{11}$
  - [2] C) $\frac{1}{5}$
  - [3] D) $\frac{2}{5}$
  - [4] E) $\frac{9}{11}$  **<-- ANSWER**
- **answer**: `4`
- **explanation**: При $x = 3$ получаем $f(3) = \frac{2\cdot 3 + 3}{3^2 + 2} = \frac{9}{11}$.

### ORIG #8 (math-0903-71)
- **id**: `math-0903-71` | **typeId**: `math.rect-perimeter` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Планиметрия
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":71}`
- **stem**: Найдите периметр прямоугольника с шириной $40$ и длиной $k$.
- **options**:
  - [0] A) $P = 2(40 + 2k)$
  - [1] B) $P = 2(40 + k)$  **<-- ANSWER**
  - [2] C) $P = 2(20 + k)$
  - [3] D) $P = 2(20 + 2k)$
  - [4] E) $P = 2(80 + 2k)$
- **answer**: `1`
- **explanation**: Периметр прямоугольника со сторонами $a$ и $b$ равен $P = 2(a + b) = 2(40 + k)$.

### ORIG #9 (math-1503-77)
- **id**: `math-1503-77` | **typeId**: `math.quad-ineq` | **format**: `short` | **difficulty**: 2 | **points**: 1 | **topic**: Неравенства
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":77}`
- **stem**: Найдите сумму целых решений неравенства $x^2 - 6x - 7 \lt 0$.
- **answer**: `"21"`
- **explanation**: Корни $x_1 = -1$, $x_2 = 7$, разложение $(x + 1)(x - 7) \lt 0$. Методом интервалов получаем $x \in (-1;\ 7)$. Сумма целых решений: $0 + 1 + 2 + 3 + 4 + 5 + 6 = 21$.

### ORIG #10 (math-0903-69)
- **id**: `math-0903-69` | **typeId**: `math.arith-prog-diff` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Прогрессии
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":69}`
- **stem**: В арифметической прогрессии $(a_n)$ известно, что $a_{13} = 58$ и $a_{28} = 28$. Найдите разность прогрессии.
- **options**:
  - [0] A) $-6$
  - [1] B) $-3$
  - [2] C) $2$
  - [3] D) $5$
  - [4] E) $-2$  **<-- ANSWER**
- **answer**: `4`
- **explanation**: Разность арифметической прогрессии равна $d = \frac{a_{28} - a_{13}}{28 - 13} = \frac{28 - 58}{15} = -2$.

### ORIG #11 (math-0903-81)
- **id**: `math-0903-81` | **typeId**: `math.parabola-right-tri` | **format**: `short` | **difficulty**: 3 | **points**: 2 | **topic**: Функции и графики
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":81}`
- **image**: alt="График параболы f(x)=ax²+bx+c с вершиной в положительной полуплоскости, пересечениями с осью x в точках A, B и с осью y в точке C, AC⊥BC" | src=(inline svg, len=2504)
- **stem**: Дан график функции $f(x) = ax^2 + bx + c$. Если $AC \perp BC$, $CO = 5$ и $BO = 25 \cdot AO$, найдите абсциссу вершины параболы.
- **answer**: `"12"`
- **explanation**: В прямоугольном треугольнике $ACB$ высота к гипотенузе $CO = 5$. Если $AO = k$, то $BO = 25k$, и $25 = k \cdot 25k \Rightarrow k = 1$ ($k > 0$). Нули функции: $-1$ и $25$, поэтому абсцисса вершины равна $m = \frac{-1 + 25}{2} = 12$.

### ORIG #12 (math-1503-65)
- **id**: `math-1503-65` | **typeId**: `math.poly-factor` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Алгебраические выражения
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":65}`
- **stem**: Разложите многочлен $12a^2 - 24a$ на множители.
- **options**:
  - [0] A) $12(a - 12)$
  - [1] B) $24a(a + 1)$
  - [2] C) $12a(a - 2)$  **<-- ANSWER**
  - [3] D) $a(2a - 24)$
  - [4] E) $12a(2a - 1)$
- **answer**: `2`
- **explanation**: Вынесем общий множитель $12a$ за скобки: $12a^2 - 24a = 12a(a - 2)$.
