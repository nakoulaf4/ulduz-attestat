# Self-Test Report: `informatics` (Информатика)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 12
- **Originals count**: 0 ({})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `informatics.radix-single` | Системы счисления | `single` | 200/200 | YES | 200 | 0% | 0 |
| `informatics.radix-conv` | Системы счисления | `short` | 200/200 | YES | 132 | 34% | 0 |
| `informatics.info-volume` | Кодирование и объём информации | `single` | 200/200 | YES | 188 | 6% | 0 |
| `informatics.image-sound-short` | Кодирование и объём информации | `short` | 200/200 | YES | 27 | 86.5% | 0 |
| `informatics.boolean-logic` | Алгебра логики | `single` | 200/200 | YES | 200 | 0% | 0 |
| `informatics.logic-match` | Алгебра логики | `match` | 200/200 | YES | 200 | 0% | 0 |
| `informatics.python-trace` | Алгоритмы и программирование (Python) | `short` | 200/200 | YES | 105 | 47.5% | 0 |
| `informatics.algo-complexity` | Алгоритмы и программирование (Python) | `single` | 200/200 | YES | 200 | 0% | 0 |
| `informatics.sql-excel` | Базы данных и таблицы | `single` | 200/200 | YES | 194 | 3% | 0 |
| `informatics.networks-ip` | Компьютерные сети и Интернет | `single` | 200/200 | YES | 188 | 6% | 0 |
| `informatics.url-order` | Компьютерные сети и Интернет | `order` | 200/200 | YES | 150 | 25% | 0 |
| `informatics.algo-open` | Алгоритмы и программирование (Python) | `open` | 200/200 | YES | 9 | 95.5% | 0 |

### Generator Issues
#### `informatics.algo-open` (Развёрнутая задача: алгоритм на Python)
- *WARN*: Very low variety: only 9 unique tasks across 200 seeds

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 33
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/informatics.json`)

- **File exists**: NO
- **Valid JSON**: NO
- **Total tasks**: 0
- **By PDF**: `{}`
- **Errors**: None
