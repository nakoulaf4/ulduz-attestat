# Self-Test Report: `history` (История)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 10
- **Originals count**: 0 ({})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `history.ancient-az` | Древний Азербайджан (Атропатена и Кавказская Албания) | `single` | 200/200 | YES | 173 | 13.5% | 0 |
| `history.medieval-az` | Средневековый Азербайджан (Ширваншахи и Сефевиды) | `single` | 200/200 | YES | 173 | 13.5% | 0 |
| `history.dynasties-match` | Средневековый Азербайджан (Ширваншахи и Сефевиды) | `match` | 200/200 | YES | 197 | 1.5% | 0 |
| `history.khanates-19c` | Ханства и XIX век | `single` | 200/200 | YES | 177 | 11.5% | 0 |
| `history.adr-20c` | АДР (1918–1920) и XX век | `single` | 200/200 | YES | 170 | 15% | 0 |
| `history.chronology-order` | АДР (1918–1920) и XX век | `order` | 200/200 | YES | 198 | 1% | 0 |
| `history.modern-az` | Независимый Азербайджан и современность | `single` | 200/200 | YES | 170 | 15% | 0 |
| `history.dates-short` | Независимый Азербайджан и современность | `short` | 200/200 | YES | 9 | 95.5% | 0 |
| `history.world-history` | Всемирная история | `single` | 200/200 | YES | 170 | 15% | 0 |
| `history.source-open` | Всемирная история | `open` | 200/200 | YES | 3 | 98.5% | 0 |

### Generator Issues
#### `history.dates-short` (Ключевые годы истории Азербайджана (краткий ответ))
- *WARN*: Very low variety: only 9 unique tasks across 200 seeds

#### `history.source-open` (Развёрнутый анализ исторического события)
- *WARN*: Very low variety: only 3 unique tasks across 200 seeds

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 33
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/history.json`)

- **File exists**: NO
- **Valid JSON**: NO
- **Total tasks**: 0
- **By PDF**: `{}`
- **Errors**: None
