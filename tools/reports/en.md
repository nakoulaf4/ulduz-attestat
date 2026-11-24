# Self-Test Report: `en` (Английский язык)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 4
- **TaskTypes count**: 37
- **Originals count**: 60 ({"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `en.listening-true` | Аудирование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.listening-main` | Аудирование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.listening-multi` | Аудирование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.listening-qa` | Аудирование | `open` | 200/200 | YES | 30 | 85% | 0 |
| `en.listening-adj` | Аудирование | `short` | 200/200 | YES | 30 | 85% | 0 |
| `en.tenses` | Глагол и времена | `single` | 200/200 | YES | 196 | 2% | 0 |
| `en.passive` | Глагол и времена | `single` | 200/200 | YES | 196 | 2% | 0 |
| `en.modals` | Глагол и времена | `single` | 200/200 | YES | 183 | 8.5% | 0 |
| `en.nonfinite` | Глагол и времена | `single` | 200/200 | YES | 195 | 2.5% | 0 |
| `en.conditionals` | Глагол и времена | `single` | 200/200 | YES | 187 | 6.5% | 0 |
| `en.nouns` | Существительные, артикли и местоимения | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.articles` | Существительные, артикли и местоимения | `single` | 200/200 | YES | 188 | 6% | 0 |
| `en.pronouns` | Существительные, артикли и местоимения | `single` | 200/200 | YES | 185 | 7.5% | 0 |
| `en.quantifiers` | Существительные, артикли и местоимения | `single` | 200/200 | YES | 184 | 8% | 0 |
| `en.adjectives-adverbs` | Прилагательные, наречия и предлоги | `single` | 200/200 | YES | 184 | 8% | 0 |
| `en.prepositions` | Прилагательные, наречия и предлоги | `single` | 200/200 | YES | 184 | 8% | 0 |
| `en.questions` | Синтаксис и структура | `single` | 200/200 | YES | 190 | 5% | 0 |
| `en.subordinate-clauses` | Синтаксис и структура | `single` | 200/200 | YES | 166 | 17% | 0 |
| `en.word-order` | Синтаксис и структура | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.sentence-order` | Синтаксис и структура | `order` | 200/200 | YES | 194 | 3% | 0 |
| `en.conjunctions` | Синтаксис и структура | `single` | 200/200 | YES | 184 | 8% | 0 |
| `en.agreement` | Синтаксис и структура | `single` | 200/200 | YES | 184 | 8% | 0 |
| `en.reported-speech` | Синтаксис и структура | `single` | 200/200 | YES | 176 | 12% | 0 |
| `en.vocab-definitions` | Лексика и словообразование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.vocab-match` | Лексика и словообразование | `match` | 200/200 | YES | 200 | 0% | 0 |
| `en.vocab-antonyms` | Лексика и словообразование | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.vocab-context` | Лексика и словообразование | `single` | 200/200 | YES | 189 | 5.5% | 0 |
| `en.word-formation` | Лексика и словообразование | `single` | 200/200 | YES | 187 | 6.5% | 0 |
| `en.dialogues` | Функциональный язык | `single` | 200/200 | YES | 177 | 11.5% | 0 |
| `en.reading-true` | Чтение | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.reading-complete` | Чтение | `single` | 200/200 | YES | 197 | 1.5% | 0 |
| `en.reading-detail` | Чтение | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.reading-main` | Чтение | `single` | 200/200 | YES | 200 | 0% | 0 |
| `en.reading-definition` | Чтение | `short` | 200/200 | YES | 28 | 86% | 0 |
| `en.reading-synonym` | Чтение | `short` | 200/200 | YES | 28 | 86% | 0 |
| `en.reading-paraphrase` | Чтение | `open` | 200/200 | YES | 14 | 93% | 0 |
| `en.reading-opinion` | Чтение | `open` | 200/200 | YES | 14 | 93% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 4/4
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 37
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/en.json`)

- **File exists**: YES
- **Valid JSON**: YES
- **Total tasks**: 60
- **By PDF**: `{"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30}`
- **Errors**: None
