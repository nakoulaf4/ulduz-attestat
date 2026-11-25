# Self-Test Report: `geography` (География)

- **Status**: **PASS**
- **Seeds per TaskType**: 200
- **Exam runs**: 10
- **TaskTypes count**: 11
- **Originals count**: 0 ({})

## 1. TaskType Generators (200 seeds each)

| TaskType ID | Topic | Format | Valid / N | Determ. | Unique | Dup % | Errors |
|---|---|---|---|---|---|---|---|
| `geography.map-scale` | План, масштаб и координаты | `short` | 200/200 | YES | 76 | 62% | 0 |
| `geography.timezones` | План, масштаб и координаты | `single` | 200/200 | YES | 200 | 0% | 0 |
| `geography.relief-lapse` | Литосфера и рельеф | `single` | 200/200 | YES | 200 | 0% | 0 |
| `geography.pressure-calc` | Литосфера и рельеф | `short` | 200/200 | YES | 8 | 96% | 0 |
| `geography.climate-belts` | Атмосфера и климат | `single` | 200/200 | YES | 170 | 15% | 0 |
| `geography.humidity-calc` | Атмосфера и климат | `single` | 200/200 | YES | 198 | 1% | 0 |
| `geography.hydrosphere` | Гидросфера и Мировой океан | `single` | 200/200 | YES | 189 | 5.5% | 0 |
| `geography.rivers-match` | Гидросфера и Мировой океан | `match` | 200/200 | YES | 197 | 1.5% | 0 |
| `geography.azerbaijan-geo` | География Азербайджана | `single` | 200/200 | YES | 177 | 11.5% | 0 |
| `geography.population-demo` | Экономическая география и население | `single` | 200/200 | YES | 198 | 1% | 0 |
| `geography.az-regions-open` | География Азербайджана | `open` | 200/200 | YES | 5 | 97.5% | 0 |

### Generator Issues
#### `geography.pressure-calc` (Атмосферное давление и высота рельефа (краткий ответ))
- *WARN*: Very low variety: only 8 unique tasks across 200 seeds

#### `geography.az-regions-open` (Развёрнутая задача: природные зоны и экономика Азербайджана)
- *WARN*: Very low variety: only 5 unique tasks across 200 seeds

## 2. Exam Builder (`buildExam`)

- **Runs tested**: 10/10
- **Deterministic**: YES
- **Task count per exam**: 30
- **Total raw points per exam**: 33
- **Score check**: 0 pts → 0, full pts → 100
- **Errors**: None

## 3. Originals (`site/data/original/geography.json`)

- **File exists**: NO
- **Valid JSON**: NO
- **Total tasks**: 0
- **By PDF**: `{}`
- **Errors**: None
