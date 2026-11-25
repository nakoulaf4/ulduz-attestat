# Self-Test Report: `biology` (Биология)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 11
- **Originals count**: 0 ({})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `biology.cell-organelles` | Цитология и строение клетки | `single` | 200/200 | YES | 195 | 2.5% | 0 |
| `biology.organelles-match` | Цитология и строение клетки | `match` | 200/200 | YES | 197 | 1.5% | 0 |
| `biology.genetics-cross` | Генетика и законы Менделя | `single` | 200/200 | YES | 170 | 15% | 0 |
| `biology.genetics-short` | Генетика и законы Менделя | `short` | 200/200 | YES | 7 | 96.5% | 0 |
| `biology.dna-chargaff` | ДНК, РНК и биосинтез белка | `short` | 200/200 | YES | 102 | 49% | 0 |
| `biology.human-anatomy` | Анатомия и физиология человека | `single` | 200/200 | YES | 177 | 11.5% | 0 |
| `biology.blood-circulation` | Анатомия и физиология человека | `order` | 200/200 | YES | 144 | 28% | 0 |
| `biology.botany-zoology` | Ботаника и зоология | `single` | 200/200 | YES | 170 | 15% | 0 |
| `biology.ecology-chains` | Эволюция и экология | `single` | 200/200 | YES | 188 | 6% | 0 |
| `biology.dna-rna-open` | ДНК, РНК и биосинтез белка | `open` | 200/200 | YES | 20 | 90% | 0 |
| `biology.ecology-open` | Эволюция и экология | `open` | 200/200 | YES | 8 | 96% | 0 |

### Generator Issues
#### `biology.genetics-short` (Число типов гамет и фенотипов (краткий ответ))
- *WARN*: Very low variety: only 7 unique tasks across 200 seeds

#### `biology.ecology-open` (Развёрнутая задача: расчёт биомассы по правилу 10%)
- *WARN*: Very low variety: only 8 unique tasks across 200 seeds

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 33
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/biology.json`)

- **File exists**: NO
- **Valid JSON**: NO
- **Total tasks**: 0
- **By PDF**: `{}`
- **Errors**: None
