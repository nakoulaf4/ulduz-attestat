# Self-Test Report: `chemistry` (Химия)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 11
- **Originals count**: 0 ({})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `chemistry.atom-structure` | Строение атома и Периодический закон | `single` | 200/200 | YES | 198 | 1% | 0 |
| `chemistry.bond-types` | Химическая связь и степени окисления | `single` | 200/200 | YES | 181 | 9.5% | 0 |
| `chemistry.oxidation-state` | Химическая связь и степени окисления | `short` | 200/200 | YES | 10 | 95% | 0 |
| `chemistry.molar-mass` | Молярная масса и расчёты по формулам | `short` | 200/200 | YES | 57 | 71.5% | 0 |
| `chemistry.mass-fraction` | Молярная масса и расчёты по формулам | `single` | 200/200 | YES | 198 | 1% | 0 |
| `chemistry.solutions-percent` | Растворы и концентрация | `single` | 200/200 | YES | 200 | 0% | 0 |
| `chemistry.reactions-single` | Классы неорганических соединений и реакции | `single` | 200/200 | YES | 173 | 13.5% | 0 |
| `chemistry.inorganic-classes` | Классы неорганических соединений и реакции | `match` | 200/200 | YES | 197 | 1.5% | 0 |
| `chemistry.hydrocarbons` | Органическая химия | `single` | 200/200 | YES | 197 | 1.5% | 0 |
| `chemistry.dilution-open` | Растворы и концентрация | `open` | 200/200 | YES | 12 | 94% | 0 |
| `chemistry.organic-open` | Органическая химия | `open` | 200/200 | YES | 12 | 94% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 33
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/chemistry.json`)

- **File exists**: NO
- **Valid JSON**: NO
- **Total tasks**: 0
- **By PDF**: `{}`
- **Errors**: None
