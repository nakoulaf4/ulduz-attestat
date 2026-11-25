# Self-Test Report: `en` (Английский язык)

- **Status**: **PASS**
- **Seeds per TaskType**: 1000
- **Exam runs**: 20
- **TaskTypes count**: 37
- **Originals count**: 60 ({"Attestat_all_09.03.2026_1773051095.pdf":30,"Attestat_all_15.03.2026_1773569675.pdf":30})

## 1. TaskType Generators (1000 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `en.listening-true` | Аудирование | `single` | 1000/1000 | YES | 996 | 0.4% | 0 |
| `en.listening-main` | Аудирование | `single` | 1000/1000 | YES | 994 | 0.6% | 0 |
| `en.listening-multi` | Аудирование | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `en.listening-qa` | Аудирование | `open` | 1000/1000 | YES | 30 | 97% | 0 |
| `en.listening-adj` | Аудирование | `short` | 1000/1000 | YES | 30 | 97% | 0 |
| `en.tenses` | Глагол и времена | `single` | 1000/1000 | YES | 892 | 10.8% | 0 |
| `en.passive` | Глагол и времена | `single` | 1000/1000 | YES | 887 | 11.3% | 0 |
| `en.modals` | Глагол и времена | `single` | 1000/1000 | YES | 757 | 24.3% | 0 |
| `en.nonfinite` | Глагол и времена | `single` | 1000/1000 | YES | 848 | 15.2% | 0 |
| `en.conditionals` | Глагол и времена | `single` | 1000/1000 | YES | 738 | 26.2% | 0 |
| `en.nouns` | Существительные, артикли и местоимения | `single` | 1000/1000 | YES | 957 | 4.3% | 0 |
| `en.articles` | Существительные, артикли и местоимения | `single` | 1000/1000 | YES | 798 | 20.2% | 0 |
| `en.pronouns` | Существительные, артикли и местоимения | `single` | 1000/1000 | YES | 787 | 21.3% | 0 |
| `en.quantifiers` | Существительные, артикли и местоимения | `single` | 1000/1000 | YES | 731 | 26.9% | 0 |
| `en.adjectives-adverbs` | Прилагательные, наречия и предлоги | `single` | 1000/1000 | YES | 731 | 26.9% | 0 |
| `en.prepositions` | Прилагательные, наречия и предлоги | `single` | 1000/1000 | YES | 731 | 26.9% | 0 |
| `en.questions` | Синтаксис и структура | `single` | 1000/1000 | YES | 766 | 23.4% | 0 |
| `en.subordinate-clauses` | Синтаксис и структура | `single` | 1000/1000 | YES | 538 | 46.2% | 0 |
| `en.word-order` | Синтаксис и структура | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `en.sentence-order` | Синтаксис и структура | `order` | 1000/1000 | YES | 892 | 10.8% | 0 |
| `en.conjunctions` | Синтаксис и структура | `single` | 1000/1000 | YES | 731 | 26.9% | 0 |
| `en.agreement` | Синтаксис и структура | `single` | 1000/1000 | YES | 717 | 28.3% | 0 |
| `en.reported-speech` | Синтаксис и структура | `single` | 1000/1000 | YES | 610 | 39% | 0 |
| `en.vocab-definitions` | Лексика и словообразование | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `en.vocab-match` | Лексика и словообразование | `match` | 1000/1000 | YES | 1000 | 0% | 0 |
| `en.vocab-antonyms` | Лексика и словообразование | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `en.vocab-context` | Лексика и словообразование | `single` | 1000/1000 | YES | 820 | 18% | 0 |
| `en.word-formation` | Лексика и словообразование | `single` | 1000/1000 | YES | 738 | 26.2% | 0 |
| `en.dialogues` | Функциональный язык | `single` | 1000/1000 | YES | 651 | 34.9% | 0 |
| `en.reading-true` | Чтение | `single` | 1000/1000 | YES | 994 | 0.6% | 0 |
| `en.reading-complete` | Чтение | `single` | 1000/1000 | YES | 942 | 5.8% | 0 |
| `en.reading-detail` | Чтение | `single` | 1000/1000 | YES | 1000 | 0% | 0 |
| `en.reading-main` | Чтение | `single` | 1000/1000 | YES | 992 | 0.8% | 0 |
| `en.reading-definition` | Чтение | `short` | 1000/1000 | YES | 28 | 97.2% | 0 |
| `en.reading-synonym` | Чтение | `short` | 1000/1000 | YES | 28 | 97.2% | 0 |
| `en.reading-paraphrase` | Чтение | `open` | 1000/1000 | YES | 14 | 98.6% | 0 |
| `en.reading-opinion` | Чтение | `open` | 1000/1000 | YES | 14 | 98.6% | 0 |

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 20/20
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
