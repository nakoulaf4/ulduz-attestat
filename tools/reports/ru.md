# Self-Test Report: `ru` (Русский язык)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 14
- **Originals count**: 60 ({"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `ru.phonetics` | Фонетика и орфоэпия | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.ortho-signs` | Орфография | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.ortho-roots-affixes` | Орфография | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.morphemics-wordform` | Морфемика и словообразование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.lexics-norms` | Лексика и культура речи | `single` | 200/200 | YES | 199 | 0.5% | 0 |
| `ru.morph-noun-adj-num` | Морфология | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.morph-pronoun-adverb` | Морфология | `single` | 200/200 | YES | 199 | 0.5% | 0 |
| `ru.morph-verb` | Морфология | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.morph-service` | Морфология | `single` | 200/200 | YES | 196 | 2% | 0 |
| `ru.syntax-word-phrase` | Синтаксис и пунктуация | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.syntax-simple` | Синтаксис и пунктуация | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.syntax-complex` | Синтаксис и пунктуация | `single` | 200/200 | YES | 199 | 0.5% | 0 |
| `ru.reading-closed` | Работа с текстом | `single` | 200/200 | YES | 200 | 0% | 0 |
| `ru.reading-open` | Работа с текстом | `open` | 200/200 | YES | 59 | 70.5% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 40
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/ru.json`)

- **File exists**: YES
- **Valid JSON**: YES
- **Total tasks**: 60
- **By PDF**: `{"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30}`
- **Errors**: None
