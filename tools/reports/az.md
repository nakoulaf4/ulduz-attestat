# Self-Test Report: `az` (Азербайджанский язык)

- **Status**: **PASS**
- **Seeds per TaskType**: 1000
- **Exam runs**: 20
- **TaskTypes count**: 11
- **Originals count**: 60 ({"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30})

## 1. TaskType Generators (1000 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `az.phonetics` | Фонетика | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `az.ortho-stress` | Орфография и ударение | `single` | 1000/1000 | YES | 997 | 0.3% | 0 |
| `az.morphemics` | Словообразование | `single` | 1000/1000 | YES | 937 | 6.3% | 0 |
| `az.lexics-idioms` | Лексика и фразеология | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `az.morphology-noun-adj-num` | Морфология | `single` | 1000/1000 | YES | 987 | 1.3% | 0 |
| `az.morphology-verb` | Морфология | `single` | 1000/1000 | YES | 995 | 0.5% | 0 |
| `az.syntax-phrases` | Синтаксис | `single` | 1000/1000 | YES | 783 | 21.7% | 0 |
| `az.syntax-sentence` | Синтаксис | `single` | 1000/1000 | YES | 897 | 10.3% | 0 |
| `az.stylistics` | Стилистика | `single` | 1000/1000 | YES | 803 | 19.7% | 0 |
| `az.reading-closed` | Работа с текстом | `single` | 1000/1000 | YES | 955 | 4.5% | 0 |
| `az.reading-open` | Работа с текстом | `open` | 1000/1000 | YES | 50 | 95% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 20/20
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
