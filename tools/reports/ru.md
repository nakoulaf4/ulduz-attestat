# Self-Test Report: `ru` (Русский язык)

- **Status**: **PASS**
- **Seeds per TaskType**: 1000
- **Exam runs**: 20
- **TaskTypes count**: 14
- **Originals count**: 60 ({"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30})

## 1. TaskType Generators (1000 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `ru.phonetics` | Фонетика и орфоэпия | `single` | 1000/1000 | YES | 995 | 0.5% | 0 |
| `ru.ortho-signs` | Орфография | `single` | 1000/1000 | YES | 992 | 0.8% | 0 |
| `ru.ortho-roots-affixes` | Орфография | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `ru.morphemics-wordform` | Морфемика и словообразование | `single` | 1000/1000 | YES | 997 | 0.3% | 0 |
| `ru.lexics-norms` | Лексика и культура речи | `single` | 1000/1000 | YES | 976 | 2.4% | 0 |
| `ru.morph-noun-adj-num` | Морфология | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `ru.morph-pronoun-adverb` | Морфология | `single` | 1000/1000 | YES | 977 | 2.3% | 0 |
| `ru.morph-verb` | Морфология | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `ru.morph-service` | Морфология | `single` | 1000/1000 | YES | 937 | 6.3% | 0 |
| `ru.syntax-word-phrase` | Синтаксис и пунктуация | `single` | 1000/1000 | YES | 999 | 0.1% | 0 |
| `ru.syntax-simple` | Синтаксис и пунктуация | `single` | 1000/1000 | YES | 998 | 0.2% | 0 |
| `ru.syntax-complex` | Синтаксис и пунктуация | `single` | 1000/1000 | YES | 979 | 2.1% | 0 |
| `ru.reading-closed` | Работа с текстом | `single` | 1000/1000 | YES | 981 | 1.9% | 0 |
| `ru.reading-open` | Работа с текстом | `open` | 1000/1000 | YES | 60 | 94% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 20/20
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
