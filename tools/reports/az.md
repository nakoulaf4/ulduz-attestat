# Self-Test Report: `az` (Азербайджанский язык)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 11
- **Originals count**: 60 ({"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `az.phonetics` | Фонетика | `single` | 200/200 | YES | 200 | 0% | 0 |
| `az.ortho-stress` | Орфография и ударение | `single` | 200/200 | YES | 199 | 0.5% | 0 |
| `az.morphemics` | Словообразование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `az.lexics-idioms` | Лексика и фразеология | `single` | 200/200 | YES | 200 | 0% | 0 |
| `az.morphology-noun-adj-num` | Морфология | `single` | 200/200 | YES | 200 | 0% | 0 |
| `az.morphology-verb` | Морфология | `single` | 200/200 | YES | 200 | 0% | 0 |
| `az.syntax-phrases` | Синтаксис | `single` | 200/200 | YES | 185 | 7.5% | 0 |
| `az.syntax-sentence` | Синтаксис | `single` | 200/200 | YES | 193 | 3.5% | 0 |
| `az.stylistics` | Стилистика | `single` | 200/200 | YES | 191 | 4.5% | 0 |
| `az.reading-closed` | Работа с текстом | `single` | 200/200 | YES | 197 | 1.5% | 0 |
| `az.reading-open` | Работа с текстом | `open` | 200/200 | YES | 49 | 75.5% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 40
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/az.json`)

- **File exists**: YES
- **Valid JSON**: YES
- **Total tasks**: 60
- **By PDF**: `{"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30}`
- **Errors**: None
