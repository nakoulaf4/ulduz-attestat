# Спецификация генераторов и оцифровки заданий: Английский язык (`en`)

## 0. Формат экзамена и система оценивания (DİM Buraxılış, 11-й класс)

### 0.1. Структура экзаменационного блока «English»
В обоих экзаменационных разборах ГЭЦ (**DİM**, *Tam orta (11 illik) təhsil səviyyəsi üzrə buraxılış imtahanı*: `09.03.2026` — 1-я зона и `15.03.2026` — 2-я зона) блок **English** занимает **№ 1–30** и состоит из трёх обязательных частей:

1. **Блок I — Аудирование / Текст I (№ 1–6):**
   - Публицистический или научно-популярный текст объёмом ~175–210 слов (2–3 абзаца).
   - **№ 1–3:** 3 закрытых задания с 5 вариантами ответа (`single`, по **1** баллу).
   - **№ 4–6:** 3 открытых письменных задания (*Answer sheets*, вес ×2 в формуле ГЭЦ, т. е. **2** первичных балла каждое: `0 / 1 / 2` в эквиваленте тренажёра, соответствующем шкале маркеров `0 / 0.5 / 1`).
2. **Блок II — Лексика и грамматика (№ 7–22):**
   - **16 закрытых** заданий с 5 вариантами ответа (`single`, по **1** баллу).
   - Порядок заданий № 7–22 перемешивается между вариантами A, B, C, D, но набор из 16 тем внутри одного варианта жёстко фиксирован.
3. **Блок III — Чтение и анализ текста / Текст II (№ 23–30):**
   - Биографический или познавательный текст объёмом ~200–240 слов из **3 пронумерованных абзацев** (`1.`, `2.`, `3.`).
   - **№ 23–26:** 4 закрытых задания с 5 вариантами ответа (`single`, по **1** баллу).
   - **№ 27–30:** 4 открытых письменных задания (*Answer sheets*, вес ×2 в формуле ГЭЦ, т. е. **2** балла каждое).

### 0.2. Официальная формула оценивания и конфигурация `SubjectModule`
- **Число заданий в варианте:** **30**.
- **Закрытые задания (`single`):** `3 + 16 + 4 = 23` × 1 балл = **23 балла**.
- **Открытые/письменные задания (№ 4–6, № 27–30):** `3 + 4 = 7` × 2 балла = **14 баллов**.
- **Максимальный взвешенный первичный балл:** $23 + 14 = \mathbf{37}$.
- **Перевод в 100-балльную шкалу (официальная формула DİM для 30-задачного экзамена):**
  $$\text{Nisbi bal} = \frac{100}{37} \times \bigl(2 \cdot nd_{\text{açıq, yazılı}} + nd_{\text{qapalı}}\bigr) = \text{round}\!\left(\frac{\text{raw\_earned}}{37} \times 100,\; 1\right)$$
  Штрафов за неверные ответы нет. При выставлении `points: 1` для № 1–3, 7–26 и `points: 2` для № 4–6, 27–30 сумма `earned` совпадает с числителем $(2 \cdot nd_{\text{açıq}} + nd_{\text{qapalı}})$, а самооценка `0 / 1 / 2` в интерфейсе `task-view.js` точно моделирует баллы маркера (`0 / 0.5 / 1` × 2).
- **Время на блок в симуляции:** `durationMin: 60` (из общих 180 минут на три предмета).
- **Язык интерфейса и объяснений:** формулировки и тексты заданий — на **английском языке** (строго в стиле DİM), названия тем, заголовки типов, подсказки `hint`, объяснения `explanation` и критерии `rubric` — на **русском языке** с цитированием английских правил и примеров.

---

## 1. Полный анализ всех 60 заданий из двух PDF (`0903` и `1503`)

### 1.1. Блок I: Аудирование (№ 1–6)

| PDF | № (Var. A) | Тема / Навык | Стандарт DİM | Формат | Сл. | Что проверяется и типичные ошибки (дистракторы) |
|---|---|---|---|---|---|---|
| `0903` | 1 | Детальное понимание (`True statement`) | `10-1.1.2` | `single` (5) | 1 | Текст «Mostar and the Stari Most bridge». Верный перефраз (`took its name from the bridge keepers`). Дистракторы: антонимы (`cold and unfriendly`, `quietness`), подмена периода (`every month` вместо `every year`), подмена стиля (`western` вместо `Ottoman`). |
| `0903` | 2 | Основная мысль (`Main idea`) | `7-1.1.2` | `single` (5) | 2 | Выбор обобщающей темы (`a historical site of Mostar`). Дистракторы: 4 узкие детали из отдельных предложений (`diving competition`, `hospitality`, `bridge keepers`, `tourist attractions`). |
| `0903` | 3 | Множественное сопоставление (`Complete the sentence`, 2 из 4) | `10-1.1.2` | `single` (5) | 2 | Завершение фразы `Stari Most … .` (2, 4). Ошибочные пункты: пропуск посредника (`designed by Mimar Sinan` вместо `student of Mimar Sinan`) и подмена давности (`lately` вместо `for over 400 years`). |
| `0903` | 4 | Открытый вопрос по факту (`Wh-question`) | `6-1.1.1` | `open` (2 б.) | 1 | `What does Stari Most, the treasure of Mostar, connect?` → `the two sides of the city`. Ошибки: неполный/лишний фрагмент или грамматическое искажение ответа. |
| `0903` | 5 | Завершение предложения (`Complete the sentence`) | `7-1.1.1` | `open` (2 б.) | 2 | `Young men jump from the bridge into the river to show that they are … .` → `ready for the adult life`. Ошибки: пропуск части фразы или смешение с другим предложением. |
| `0903` | 6 | Поиск прилагательного к слову (`Adjective extraction`) | `7-1.1.1` | `short` (2 б.) | 1 | Одно прилагательное, описывающее `"festival"` → `local`. Ошибки: выписывание существительного, наречия или прилагательного к другому слову (`famous`, `old`, `lively`). |
| `1503` | 1 | Детальное понимание (`True statement`) | `10-1.1.2` | `single` (5) | 1 | Текст «Alzheimer's disease & Emma Yang». Верно: `Emma posted the photos ... with their names on the app`. Дистракторы: антоним (`under 65` вместо `over 65`, `remember better` вместо `harder`), смешение субъекта (`Emma wrote articles`), подмена `different` → `similar`. |
| `1503` | 2 | Множественное сопоставление (`Complete the sentence`, 2 из 4) | `10-1.1.2` | `single` (5) | 2 | `Emma … .` → `2, 4`. Ошибки: перенос действия врача Мелиссы на Эмму (`1. explained...`) и антоним (`grew up far from` вместо `grew up with`). |
| `1503` | 3 | Основная мысль (`Main idea`) | `7-1.1.2` | `single` (5) | 2 | `Emma’s efforts to help Alzheimer patients`. Дистракторы: придуманная оценка (`disadvantages`), искажение (`positively affects the brain`), слишком узкие/общие формулировки. |
| `1503` | 4 | Открытый вопрос по факту (`Wh-question`) | `6-1.1.1` | `open` (2 б.) | 1 | `What happened to Emma while she was working on her application?` → `Emma (she) faced some challenges`. |
| `1503` | 5 | Завершение предложения (`Complete the sentence`) | `7-1.1.1` | `open` (2 б.) | 2 | `This would help her granny to be aware of the people around her and not … .` → `completely lose her memory`. |
| `1503` | 6 | Поиск прилагательного к слову (`Adjective extraction`) | `7-1.1.1` | `short` (2 б.) | 1 | Одно прилагательное, описывающее `"skills"` → `basic`. |

### 1.2. Блок II: Грамматика и лексика (№ 7–22)

| PDF | № | Раздел (`Bölmə`) | Навык | Формат | Сл. | Ключевая ловушка и типичные ошибки |
|---|---|---|---|---|---|---|
| `0903` | 7 | `Məchul növ` (Passive Voice) | Определение предложений, не переводимых в пассив (2 из 4) | `single` (5) | 3 | Непереходные/связочные глаголы (`Alice went to the park...`, `Bazarduzu is the highest peak...`) vs переходные с прямым дополнением (`assessed`, `saw`). |
| `0903` | 8 | `Feil. Modal feillər` | Выбор пары модальных глаголов в контрасте `but` | `single` (5) | 2 | Ловушка `is able / isn't able` без частицы `to`; нарушение логики `but` (`can, can` / `can't, can't`). |
| `0903` | 9 | `Sual cümlələri` | Порядок слов в спец. вопросе к определению дополнения | `single` (5) | 2 | Пропуск вспомогательного `did`, двойное прошедшее `did you signed`, неверная инверсия `did signed you`, `you did signed`. |
| `0903` | 10 | `Feilin şəxssiz formaları` (Complex Object) | Выбор глаголов, требующих `to`-инфинитива (`expected, asked`) | `single` (5) | 2 | Глаголы `let` и `make` употребляются с *bare infinitive* (без `to`), поэтому не сочетаются с `to launch`. |
| `0903` | 11 | `İsim` (Сложные существительные) | Выбор строки, где все 3 слова — сложные существительные | `single` (5) | 2 | Производные существительные с суффиксами `-tion`, `-ness`, `-ment`, `-hood` маскируются под сложные в строке с 2 настоящими сложными. *(Прим.: в тексте `İzah` PDF опечатка `landscape` вместо `mindset` из опции B.)* |
| `0903` | 12 | `Sözönü` (Предлоги) | Глагольное управление `talk to sb about sb/sth` | `single` (5) | 1 | Нулевой предлог `–` или ложные `with ... in`, `to ... –`, `by ... at`. |
| `0903` | 13 | `Əvəzlik` (Местоимения) | Согласование возвратного местоимения (`the girl` → `herself`) | `single` (5) | 1 | Смешение лица/рода/числа (`myself`, `ourselves`, `themselves`, `himself`). |
| `0903` | 14 | `Sözün mənası` (Определения) | Соотнесение 3 глаголов с 3 дефинициями (`1-c, 2-a, 3-b`) | `single` (5) | 2 | Перестановка букв соответствий в 5 вариантах. |
| `0903` | 15 | `Cümlə tamamlama` (Придаточное доп.) | Прямой порядок слов в косвенном вопросе (`Do you know when he does...`) | `single` (5) | 2 | Вопросительная инверсия (`does he do`, `has he done`, `does he`) и нарушение времени (`he has done` с регулярным действием). |
| `0903` | 16 | `Cümlə düzəltmə` (Порядок слов) | Сборка предложения из 6 нумерованных фрагментов | `single` (5) | 2 | Перестановка `Place` и `Time` (`in the kitchen for twenty minutes`), вынесение дополнения/глагола на первое место. |
| `0903` | 17 | `Sözün mənası` (Антонимы) | Выбор 1 пары антонимов среди 4 пар синонимов | `single` (5) | 1 | Незнание лексики; смешение антонима и синонима (`defensive – protective`, `mild – soft`). |
| `0903` | 18 | `Artikl` (Артикли) | Определённый артикль с ограничительным определителем и превосходной степенью | `single` (5) | 2 | Нулевой/неопределённый артикль перед `photo which was taken...` и `best`. |
| `0903` | 19 | `Qarışıq testlər` (Краткие ответы) | Утвердительное согласие (`..., and her sister did too`) | `single` (5) | 2 | Смешение утвердительного `too` и отрицательного `either`/`neither`, неверный союз `but`/`so`. |
| `0903` | 20 | `Bağlayıcı` (Союзы) | Противительный союз `but` (`harmful ... beneficial`) | `single` (5) | 1 | Подстановка причинных/следственных союзов (`so, because, how, as`). |
| `0903` | 21 | `Sifət` (Прилагательные) | Сравнительная степень односложных прилагательных перед `than` | `single` (5) | 1 | Двойная сравнительная степень (`more wider`, `more longer`) и смешение со словарной формой (`wide, long`). |
| `0903` | 22 | `Feilin zaman formaları` | Будущее в главном → Present Simple в придаточном времени с `when` | `single` (5) | 2 | Калька с русского/азербайджанского `when you will walk`, а также прошедшие/перфектные формы. |
| `1503` | 7 | `Feilin şəxssiz formaları` | Complex Object: `want + obj + to V` (`to join`) | `single` (5) | 1 | `to joining` (окончание `-ing` после `to`), голый инфинитив `join`, причастия `joined/joining`. |
| `1503` | 8 | `Cümlə düzəltmə` (Порядок слов) | Сборка предложения из 7 фрагментов (`Books are very important...`) | `single` (5) | 2 | Нарушение порядка `S + V + Predicative + Place/Prepositional phrase`. |
| `1503` | 9 | `Əvəzlik` (Местоимения) | Согласование `all/some of them` с `carpets` и `were` (2 из 4) | `single` (5) | 2 | Замена мн. ч. `carpets` местоимением ед. ч. `it`. |
| `1503` | 10 | `Məchul növ` (Passive Voice) | Преобразование Present Perfect Active → Passive | `single` (5) | 2 | Смена времени (`are announced`, `was announced`), сохранение старого подлежащего, ошибка согласования `rules has been`. |
| `1503` | 11 | `Sözönü` (Предлоги) | `pleased with` + `bought for` | `single` (5) | 2 | Ложное управление `pleased of/at/from`. *(В PDF `İzah` опечатка `pelased`.)* |
| `1503` | 12 | `İsim` (Нумеративы) | Сочетаемость нумеративов с неисчисляемыми (`a cup of tea`, `a bar of chocolate`, 2 из 4) | `single` (5) | 2 | `a glasses of` (артикль `a` со мн. ч.) и `two kilo of` (отсутствие `-s` после числительного >1). |
| `1503` | 13 | `Sifət` (Прилагательные) | Положительная степень после `very` (`very capable`) | `single` (5) | 1 | Использование сравнительной/превосходной степени или `as capable` после `very`. |
| `1503` | 14 | `Artikl` (Артикли) | Превосходная степень + уникальный объект (`the most ancient`, `the world`) | `single` (5) | 1 | Опущение `the` перед `most ancient` или `world`, подстановка `a`. |
| `1503` | 15 | `Sözün mənası` (Лексика) | Подбор 2 положительных прилагательных к `good personal qualities` (`Kind, Gentle`) | `single` (5) | 1 | Смешение отрицательных и положительных черт характера (`Greedy, Rude`). |
| `1503` | 16 | `Sual cümlələri` | Выбор вопросительного слова по смыслу (`Why was the train two hours late?`) | `single` (5) | 1 | Путаница `Who / Whose / What / Which` и `Why`. |
| `1503` | 17 | `Bağlayıcı` (Союзы) | Временной союз `When` в предложении с будущим результатом | `single` (5) | 2 | Смешение с `Although`, `However`, `Why`, `How`. |
| `1503` | 18 | `Cümlə tamamlama` (Придаточное доп.) | Прямой порядок слов после `I'll tell you …` (`what they are doing...`) | `single` (5) | 2 | 4 дистрактора с вопросительной инверсией (`what did...`, `how long will it...`, `what time have they...`, `how many beaches are there...`). |
| `1503` | 19 | `Leksika` (Антонимы, 3 из 5) | Выбор 3 пар антонимов среди 5 нумерованных пар | `single` (5) | 2 | Отсев 2 пар синонимов (`to liberate – to free`, `to reject – to refuse`). |
| `1503` | 20 | `Feil. Modal feillər` | Отрицание возможности в прошлом по причине `too heavy` (`couldn't`) | `single` (5) | 2 | `wasn't able / was able / ought` без `to`, несуществующая форма `hadn't to`. |
| `1503` | 21 | `Feilin zaman formaları` | Past Simple с маркером `Yesterday` и неправильным глаголом `broke` | `single` (5) | 1 | Подстановка V3 `broken`, Present Perfect `has broken`, будущего или настоящего времени. |
| `1503` | 22 | `Kəmiyyət bildirən sözlər` | Выбор квантификатора перед неисчисляемым `butter` (`Much`) | `single` (5) | 1 | `Many / Few / A few` (только для исчисляемых мн. ч.), `A lot` без `of`. |

### 1.3. Блок III: Чтение и анализ текста (№ 23–30)

| PDF | № | Тип вопроса | Стандарт DİM | Формат | Сл. | Проверяемый навык и ошибки |
|---|---|---|---|---|---|---|
| `0903` / `1503` | 23 | `Which statement is true according to the passage?` | `8-3.1.4` | `single` (5) | 2 | Точный перефраз факта (`lasting impact` → `great influence`; `troubles in finding a place to exhibit` → `problems displaying`). Дистракторы искажают даты, имена, порядок событий или полярность. |
| `0903` / `1503` | 24 | `Complete the sentence according to the passage.` | `8-3.1.4` | `single` (5) | 2 | Завершение факта с опорой на конкретный абзац; дистракторы переносят детали из других абзацев или искажают причину/следствие. |
| `0903` / `1503` | 25 | `Choose the correct answer to the question...` (2 из 4) | `5-3.1.4` | `single` (5) | 2 | Вопрос по абзацу с перефразом (`hardships and discrimination` → `difficulties` + `unfair treatment`; `a decade` → `ten years' time`). |
| `0903` / `1503` | 26 | `The passage is mainly about … .` | `7-3.1.4` | `single` (5) | 2 | Обобщающий заголовок текста (жизнь и творчество героя), тогда как 4 дистрактора — частные факты или неверные обобщения. |
| `0903` / `1503` | 27 | `Which word from paragraph N best fits the following definition “…”?` | `7-3.1.1` | `short` (2 б.) | 2 | Извлечение 1 точного слова из указанного абзаца по дефиниции (`to witness`, `to inspire`). |
| `0903` / `1503` | 28 | `Write the synonym of the word “…” from paragraph N.` | `10-3.1.1` | `short` (2 б.) | 2 | Поиск лексического синонима в указанном абзаце (`passion` → `enthusiasm`; `to improve` → `to develop`). |
| `0903` / `1503` | 29 | `Complete the sentence by changing at least 2 words...` | `8-3.1.4; 9-3.1.4` | `open` (2 б.) | 3 | Перифраз завершения предложения из текста с заменой ≥2 слов синонимами и сохранением грамматики. Ошибка: дословное копирование без замен. |
| `0903` / `1503` | 30 | `Answer the question by expressing your opinion. Write at least three sentences.` | `7-4.1.2; 9/10-4.1.3; 11-3.1.4` | `open` (2 б.) | 3 | Связное мини-эссе (≥3 предложения) по проблематике текста с вводными/связующими словами и согласованием времён. |

---

## 2. Каталог типов заданий (`TaskType`) и соответствие экзамену

Всего проектируется **37 `TaskType`** (все уникально проиндексированы с префиксом `en.`):
- **5 типов аудирования** (№ 1–6 экзамена),
- **24 типа по грамматике, лексике, словообразованию и диалогам** (16 слотов № 7–22 экзамена + недостающие темы программы DİM + 2 интерактивных типа `match` / `order` для практики),
- **8 типов чтения и открытых ответов** (№ 23–30 экзамена).

| ID (`typeId`) | Тема (в UI) | Заголовок (`title`) | Формат | Балл | Позиция в экзамене |
|---|---|---|---|---|---|
| `en.listening-true` | Аудирование | Верное утверждение по тексту | `single` | 1 | № 1 |
| `en.listening-main` | Аудирование | Основная идея текста | `single` | 1 | № 2 или № 3 |
| `en.listening-multi` | Аудирование | Завершение фразы (2 из 4) | `single` | 1 | № 3 или № 2 |
| `en.listening-qa` | Аудирование | Вопрос и дополнение по тексту | `open` | 2 | № 4 и № 5 |
| `en.listening-adj` | Аудирование | Поиск прилагательного к слову | `short` | 2 | № 6 |
| `en.tenses` | Глагол и времена | Времена глагола и согласование | `single` | 1 | № 7–22 (1 сл.) |
| `en.passive` | Глагол и времена | Страдательный залог (Passive Voice) | `single` | 1 | № 7–22 (1 сл.) |
| `en.modals` | Глагол и времена | Модальные глаголы | `single` | 1 | № 7–22 (1 сл.) |
| `en.nonfinite` | Глагол и времена | Инфинитив, герундий и причастия | `single` | 1 | № 7–22 (1 сл.) |
| `en.conditionals` | Глагол и времена | Условные предложения и wish *(DİM+)* | `single` | 1 | Ротация / практика |
| `en.nouns` | Существительные, артикли и местоимения | Существительные, нумеративы и ’s | `single` | 1 | № 7–22 (1 сл.) |
| `en.articles` | Существительные, артикли и местоимения | Артикли (a / an / the / –) | `single` | 1 | № 7–22 (1 сл.) |
| `en.pronouns` | Существительные, артикли и местоимения | Местоимения и их согласование | `single` | 1 | № 7–22 (1 сл.) |
| `en.quantifiers` | Существительные, артикли и местоимения | Слова количества (much / many / few / little) | `single` | 1 | № 7–22 (рот. сл.) |
| `en.adjectives-adverbs` | Прилагательные, наречия и предлоги | Степени сравнения и прилагат./наречие | `single` | 1 | № 7–22 (1 сл.) |
| `en.prepositions` | Прилагательные, наречия и предлоги | Предлоги времени, места и управления | `single` | 1 | № 7–22 (1 сл.) |
| `en.questions` | Синтаксис и структура | Вопросительные предложения и теги | `single` | 1 | № 7–22 (1 сл.) |
| `en.subordinate-clauses` | Синтаксис и структура | Косвенные вопросы и дополнения | `single` | 1 | № 7–22 (1 сл.) |
| `en.word-order` | Синтаксис и структура | Составление предложения (тест) | `single` | 1 | № 7–22 (1 сл.) |
| `en.sentence-order` | Синтаксис и структура | Сборка предложения (интерактив) | `order` | 1 | Практика |
| `en.conjunctions` | Синтаксис и структура | Союзы и союзные слова | `single` | 1 | № 7–22 (1 сл.) |
| `en.agreement` | Синтаксис и структура | Краткие реплики и согласование | `single` | 1 | № 7–22 (рот. сл.) |
| `en.reported-speech` | Синтаксис и структура | Косвенная речь *(DİM+)* | `single` | 1 | Ротация / практика |
| `en.vocab-definitions` | Лексика и словообразование | Подбор слов к определениям | `single` | 1 | № 7–22 (рот. сл.) |
| `en.vocab-antonyms` | Лексика и словообразование | Антонимы и синонимы | `single` | 1 | № 7–22 (1 сл.) |
| `en.vocab-context` | Лексика и словообразование | Лексика и сочетаемость в контексте | `single` | 1 | № 7–22 (рот. сл.) |
| `en.vocab-match` | Лексика и словообразование | Соотнесение слов и значений | `match` | 1 | Практика |
| `en.word-formation` | Лексика и словообразование | Словообразование (аффиксы) *(DİM+)* | `single` | 1 | Практика |
| `en.dialogues` | Функциональный язык | Диалоги и речевой этикет *(DİM+)* | `single` | 1 | Практика |
| `en.reading-true` | Чтение | Верное утверждение по тексту | `single` | 1 | № 23 |
| `en.reading-complete` | Чтение | Завершение предложения по тексту | `single` | 1 | № 24 |
| `en.reading-detail` | Чтение | Детальный вопрос по тексту (2 из 4) | `single` | 1 | № 25 |
| `en.reading-main` | Чтение | Основная тема текста | `single` | 1 | № 26 |
| `en.reading-definition` | Чтение | Поиск слова по определению | `short` | 2 | № 27 |
| `en.reading-synonym` | Чтение | Поиск синонима в абзаце | `short` | 2 | № 28 |
| `en.reading-paraphrase` | Чтение | Перифраз концовки (≥ 2 замен) | `open` | 2 | № 29 |
| `en.reading-opinion` | Чтение | Развёрнутое мнение (≥ 3 предложений) | `open` | 2 | № 30 |

---

## 3. Алгоритмы генерации по каждому типу заданий

Общие инварианты всех генераторов (`site/js/subjects/en/`):
1. **Детерминированность:** используется исключительно переданный `rng` (`createRng`), никаких `Math.random()` или `Date`.
2. **Ровно один правильный ответ:** для `single` каждый дистрактор конструируется как грамматически/фактически несовместимый с фреймом (конфликт согласования, времени, частицы `to`, порядка слов, полярности, логики союза); множество нормализованных опций проверяется на попарную уникальность, затем `options` перемешиваются через `rng.shuffle` с пересчётом `answer`.
3. **Разметка пропусков и акцентов:** для пропусков используется `<span class="gap"></span>` (или `…` внутри текстовых цитат DİM), для выделения — `<b>` / `<span class="mark">`.
4. **Объяснения на русском:** каждое объяснение явно называет проверяемое грамматическое/лексическое правило, переводит ключевой контекст и разбирает, почему отсеиваются типичные ошибки-дистракторы.
5. **Уровни сложности (`difficulty: 1 | 2 | 3`):** регулируют сложность лексики, число пропусков/переменных, длину синтаксической конструкции и «коварство» дистракторов.

---

### 3.1. Аудирование (`en.listening-true`, `en.listening-main`, `en.listening-multi`, `en.listening-qa`, `en.listening-adj`)

- **Фиксировано:** англоязычные формулировки DİM (`Which statement is true according to the passage?`, `The passage is mainly about … .`, `Complete the sentence according to the passage.`, `Write the correct answer to the question according to the passage.`, `Write one adjective from the passage that describes the word "…".`), формат опций, баллы (`1` для № 1–3, `2` для № 4–6).
- **Варьируется:** выбор текста из банка оригинальных текстов аудирования, выбор вопроса/основной ветви внутри текста, выбор подмножества дистракторов и порядок вариантов ответа.
- **Банк (`listening-passages.js`):** **12 оригинальных текстов** (~175–210 слов каждый, 2–3 абзаца; тематики: наука, изобретения, архитектура, экология, космос, медицина, культура, биографии — полностью авторский текст, без пересечения с PDF). Для каждого текста хранятся:
  - `trueStatements` (4–5) и `falseStatements` (8–10, с указанием причины ложности для объяснения);
  - `mainIdea` (1–2 формулировки) и `mainDistractors` (6–7);
  - `multiPrompts` (2–3 основы предложения `Subject … .`, каждая с 3 верными и 5 ложными продолжениями);
  - `qaQuestions` (2 вопроса `Wh-` + эталонные ответы и 2 задания `Complete the sentence` с точным окончанием и синонимичным перифразом);
  - `adjTargets` (2–3 пары `{ noun, adjective, sentence }`, где во всём тексте данное существительное определяется **единственным** прилагательным — гарантия однозначности для `short`).
- **Сложность:** `1` — прямые факты и явные антонимы; `2` — перефраз и подмена субъекта/периода; `3` — синтез нескольких предложений.
- **Пример (`en.listening-adj`):** Текст про геотермальные теплицы Исландии → *Write one adjective from the passage that describes the word “energy”.* → Ответ: `renewable` (единственное определение к `energy` в тексте). Объяснение на русском цитирует предложение текста и указывает на функцию прилагательного.

---

### 3.2. `en.tenses` — Времена глагола и согласование

- **Фиксировано:** формулировка `Choose the correct tense form.` / `Choose the correct option.` и синтаксическая схема предложения.
- **Варьируется:** подлежащее (из пула с контролем числа `sg/pl`), глагол из таблицы неправильных и правильных глаголов, временной маркер или придаточное времени, 4 ошибочные видо-временные формы.
- **Банки (`grammar-verbs.js`):**
  - Таблица **45 неправильных глаголов** (`base, past, pp, thirdSg, ing, ru`) и **25 правильных глаголов**;
  - Банк фреймов со слотами по 5 подтипам (**80+ шаблонов**):
    1. *Past Simple vs Present Perfect / Past Continuous* (`yesterday, last week, in 2018, two days ago` vs `since, for, already, just, yet`);
    2. *Придаточные времени и условия с будущим в главном* (`will + V ... when / as soon as / before / after / until + S + Present Simple`);
    3. *Прерванное длительное действие* (`Past Continuous` + `when` + `Past Simple`, `while` + `Past Continuous`);
    4. *Предпрошедшее время* (`by the time / before / after` → `Past Perfect`);
    5. *Вневременные / текущие действия* (`usually / every morning` → Present Simple; `at the moment / Look!` → Present Continuous).
- **Гарантия единственности:** каждый шаблон маркирует **один** допустимый грамматический слот (`past`, `pres3sg`, `presSimple`, `presPerf`, `pastPerf`, `pastCont`, `futSimple`), а дистракторы берутся строго из других временных категорий или ошибочных форм (`V3` без вспомогательного как `broken`, согласование `has/have` не с тем числом, `will + V` внутри `when`-придаточного).
- **Сложность:** `1` — явный маркер простого времени; `2` — придаточные с `when/as soon as` и `Present Perfect vs Past Simple`; `3` — `Past Perfect` и согласование времён в сложноподчинённом предложении.
- **Пример:** *Wait here until the manager <span class="gap"></span> back.* Опции: `will come`, `comes` (✓), `came`, `has come`, `was coming`. Объяснение: в придаточном времени после `until / when / as soon as` для выражения будущего используется Present Simple вместо `will`.

---

### 3.3. `en.passive` — Страдательный залог (`Passive Voice`)

- **Фиксировано:** два аутентичных подформата DİM (`Change the sentence into the Passive Voice.` и `Which sentences can’t be changed into the Passive Voice?` / `can be changed`) + подформат выбора пассивной формы в контексте (`Choose the correct passive form.`).
- **Варьируется:**
  - *Подформат A (Преобразование, 35+ фреймов `*` 4 времени)*: активная основа `{ subj, verb, obj, timePhrase, tense }` в Present Simple, Past Simple, Future Simple или Present Perfect; согласование числа нового подлежащего (`is/are`, `was/were`, `has been/have been`).
  - *Подформат B (Переходность, пул из 30 переходных и 30 непереходных/связочных предложений)*: выбираются ровно 2 переходных предложения с прямым дополнением и 2 непереходных/связочных (`go, arrive, happen, sleep, become, seem, is + noun`), формируются 5 парных опций (`1, 2`, `2, 4` и т. д.).
- **Дистракторы (для A):** (1) неверное время (`are` вместо `have been`), (2) сохранено активное подлежащее в пассиве (`The director has been announced the rules`), (3) ошибка согласования числа (`The new rules has been announced`), (4) активная форма или пропуск `be/been`.
- **Сложность:** `1` — Simple Active→Passive; `2` — Present Perfect / Future / модальный пассив; `3` — отбор непереводимых предложений (`can't be changed`) и двухобъектные конструкции.
- **Пример:** *The architect has designed two new bridges.* → ✓ *Two new bridges have been designed by the architect.* (дистракторы: *...has been designed...*, *The architect has been designed...*, *...are designed...*, *...were designed...*).

---

### 3.4. `en.modals` — Модальные глаголы

- **Фиксировано:** предложение с 1 или 2 пропусками (`Choose the correct option.`).
- **Варьируется:** банк из **50+ контекстных фреймов** (физическая способность в прошлом/настоящем, обязанность, запрет, совет, логический контраст `but / as`).
- **Банки:** модальные пары `{ form, takesTo, negative, meaning }`: `can/couldn't`, `be able to / wasn't able to`, `must / mustn't`, `have to / don't have to / didn't have to`, `should / shouldn't`, `ought to`, `may / might`, `needn't`.
- **Гарантия единственности и ловушки DİM:** при пропуске без `to` после него все формы с обязательным `to` (`is able`, `ought`, `has`) грамматически невозможны; неверные формы отрицания (`hadn't to`, `mustn't` в значении «не нужно»); контраст `but` отсекает одинаковую полярность (`can, can`).
- **Сложность:** `1` — базовая форма и `to`-ловушка; `2` — двойной пропуск с `but` и прошедшее время (`couldn't / didn't have to`); `3` — `mustn't vs needn't` и `have to` в вопросах/отрицаниях.

---

### 3.5. `en.nonfinite` — Неличные формы глагола (Complex Object, инфинитив, герундий, причастия)

- **Фиксировано:** конструкция дополнения или сказуемого с 1 пропуском или выбором 2 подходящих глаголов из 4 (как в `0903 #10`).
- **Варьируется:**
  - *Complex Object (2 типа)*: глаголы с `to` (`want, expect, ask, tell, advise, allow, remind, force`, **16 глаголов**) vs глаголы с *bare infinitive* (`let, make` + глаголы восприятия `see, hear, watch, notice` с инфинитивом/причастием, **10 глаголов**); **30+ объектных рамок**.
  - *Gerund vs Infinitive* (**20+ глаголов с `V-ing`** `enjoy, avoid, suggest, finish, mind, keep, give up, look forward to` vs **20+ с `to V`** `decide, hope, refuse, promise, afford, manage`, плюс глаголы со сменой значения `stop / remember / forget / try + V-ing / to V`).
  - *Participle I vs II* (**18 пар** `boring/bored, exciting/excited, tiring/tired, disappointing/disappointed` в одушевлённом vs неодушевлённом контексте).
- **Сложность:** `1` — одиночный пропуск (`We wanted the guests to join us`); `2` — выбор пары глаголов из 4 (`1, 4`) или герундий после предлога (`look forward to meeting`); `3` — каузативы `make/let` в пассиве (`was made to wait`) и тонкие различия причастий.

---

### 3.6. `en.conditionals` — Условные предложения и `wish` *(недостающая тема DİM)*

- **Фиксировано:** условное сложноподчинённое предложение с 1 или 2 пропусками.
- **Варьируется:** **45+ фреймов** по типам Zero/First (реальное будущее, `if / unless`), Second (нереальное настоящее, `were / Past Simple` + `would`), Third (нереальное прошлое, `had V3` + `would have V3`), а также `I wish / If only + Past Simple / Past Perfect`.
- **Дистракторы:** типичная ошибка `will/would` в `if`-придаточном (`If it will rain...`), смешение типов (`If he studied, he will pass`), несоответствие полярности после `unless`.
- **Сложность:** `1` — First Conditional; `2` — Second Conditional + `unless`; `3` — Third Conditional и `wish`.

---

### 3.7. `en.nouns` — Существительные (сложные слова, нумеративы, множественное число, `'s / s'`)

- **Фиксировано:** 4 подрежима DİM:
  1. *Сложные vs производные существительные (`Choose the line of compound nouns.`)*: банк из **55 сложных** (`shoemaker, mindset, snowdrop, waterfall, classmate, railway, toothbrush, notebook...`) и **55 производных** (`information, darkness, agreement, brotherhood, kindness, leadership, freedom...`). В 1 строке — 3 сложных, в 4 строках-дистракторах — 2 сложных + 1 производное/простое.
  2. *Нумеративы и неисчисляемые (`1–4` словосочетания, выбрать 2)*: банк из **28 пар** `{ partitive, uncountable }` (`cup of tea, bar of chocolate, slice of bread, kilo of sugar, piece of advice, bottle of milk, pair of scissors`), автоматическая генерация ошибок вида `a + plural` (`a glasses of`), `numeral > 1 + singular` (`two kilo of`), `a/an + uncountable` (`an advice`, `two informations`).
  3. *Притяжательный падеж (`'s / s'`) и сокращение `'s = is/has`*: **30+ пар предложений** (`Tom's reading` vs `Tom's book`, `children's`, `the Browns' house`, совместное vs раздельное владение `Ann and Sam's room`).
  4. *Особые формы мн. ч. (`deer, sheep, mice, teeth, feet, women, crises, phenomena`)*.
- **Сложность:** `1` — базовые сложные слова и `a/two` нумеративы; `2` — смешанные строки и нерегулярное мн. ч.; `3` — разграничение `'s` (притяжательность vs `is/has`) и `s'`.

---

### 3.8. `en.articles` — Артикли (`a / an / the / –`)

- **Фиксировано:** предложение с 1 или 2 пропусками; 5 опций из наборов `{ a, an, the, – }`.
- **Варьируется:** банк из **60+ фреймов** по 6 правилам программы DİM:
  1. Определяющее придаточное или предложная конкретизация (`The photo which was taken...`) + превосходная степень (`the best`, `the most ancient`);
  2. Уникальные объекты (`the sun, the moon, the sky, the world, the Earth`) и порядковые числительные (`the first`);
  3. Фонетический контраст `a` vs `an` (`an hour, an honest man` vs `a university, a European country, a uniform`);
  4. Географические названия (`Azerbaijan, London, Mount Everest, Lake Baikal` с `–` vs `the USA, the UK, the Nile, the Caspian Sea, the Alps, the Atlantic Ocean` с `the`);
  5. Неисчисляемые/мн. ч. в общем смысле (`–`) vs конкретные (`the`);
  6. Устойчивые выражения (`play the piano` vs `play football`, `at – school`, `go to – bed`, `in the morning`).
- **Сложность:** `1` — уникальные объекты и превосходная степень; `2` — география и придаточные определительные; `3` — фонетические исключения `a/an` и абстрактные существительные с конкретизацией.

---

### 3.9. `en.pronouns` — Местоимения и их согласование

- **Фиксировано:** 1 пропуск или 2 пропуска (`all/some/most of them` + согласование со сказуемым, либо выбор 2 из 4).
- **Варьируется:**
  - *Возвратные (`myself … themselves`)* — 25 фреймов с подлежащим разных лиц/чисел/родов;
  - *Личные / объектные / притяжательные* (`me/my/mine`, `all/most/some/none of them/it`, как в `1503 #9`) — 25 фреймов;
  - *Неопределённые и отрицательные* (`some/any/no/every` + `-body/-thing`, `both/neither/either`, `other/another/the other/others`) — 35 фреймов.
- **Гарантия единственности:** возвратное строго определяется подлежащим; `some/any/no` жёстко разделены полярностью и наличием отрицательного сказуемого (`didn't see anything` vs `*didn't see nothing`); `other/another` — числом и определённостью.
- **Сложность:** `1` — возвратные и базовые притяжательные; `2` — `some/any/no` и `of them / of it`; `3` — `other / another / the others` и `neither / either / both`.

---

### 3.10. `en.quantifiers` — Слова количества (`much / many / few / a few / little / a little / a lot of`)

- **Фиксировано:** 1 или 2 пропуска перед существительным.
- **Варьируется:** банк из **40 исчисляемых/неисчисляемых именных групп** (`butter, advice, furniture, luggage, news, patience, snow, time, information, water` vs `chairs, mistakes, tourists, deer, children, pages`) + **35 контекстных предложений** (включая позитивный `a few / a little` vs «почти нет» `few / little` и ловушку `a lot` без `of`).
- **Сложность:** `1` — `much vs many / few` (как в `1503 #22`); `2` — неисчисляемые-исключения (`news, advice, information`) и `a lot` vs `a lot of`; `3` — смысловой выбор `few` vs `a few`, `little` vs `a little`.

---

### 3.11. `en.adjectives-adverbs` — Степени сравнения и Прилагательное / Наречие

- **Фиксировано:** 1 или 2 пропуска в предложении.
- **Варьируется:**
  - *Степени сравнения* (**40 прилагательных/наречий**: односложные `wide, long, hot, easy`, многосложные `capable, interesting, dangerous`, исключения `good/better/best, bad/worse/worst, far, little, many`) в рамках с `very + positive`, `than + comparative`, `one of the + superlative`, `as ... as`, `the ..., the ...`;
  - *Прилагательное vs Наречие* (**25 фреймов**): глаголы-связки (`look, feel, smell, taste, sound, seem, become` + **Adj**) vs глаголы действия (+ **Adv**), а также пары `good/well`, `hard/hardly`, `late/lately`, `high/highly` и конструкции `so + Adj / such + (a/an) Adj + Noun`.
- **Дистракторы:** двойные степени (`more wider`, `the most easiest`), несоответствие модификатора (`very taller`, `much tall`), наречие после глагола восприятия (`smells sweetly` вместо `smells sweet`).
- **Сложность:** `1` — `very` и `than`; `2` — двойные пропуски и связки `feel/look + adj`; `3` — `hard/hardly`, `so/such` и исключения степеней.

---

### 3.12. `en.prepositions` — Предлоги времени, места и глагольно-адъективного управления

- **Фиксировано:** 1 или 2 пропуска (`with, for`, `to, about`, `–`), 5 опций (включая нулевой предлог `–`).
- **Варьируется:**
  - **45 устойчивых сочетаний управления** (`talk to sb about sth`, `pleased with`, `interested in`, `afraid of`, `proud of`, `good at`, `depend on`, `listen to`, `wait for`, `belong to`, `apologize for`, `suffer from`, `look forward to`, `famous for`, `responsible for` + **глаголы без предлога**: `enter –, discuss –, answer –, marry –, reach –, approach –` + **частые фразовые глаголы**: `give up, look after, put off, turn down, run out of, get on with`);
  - **30 фреймов времени/места/транспорта** (`at noon/5 p.m.`, `on Monday/12th May`, `in April/2026/morning`, `arrive in city / at station`, `by train / on foot`).
- **Сложность:** `1` — базовые предлоги времени/места и частые глаголы; `2` — двойные пропуски; `3` — ловушки нулевого предлога (`enter –`, `answer –`) и `arrive in vs at`.

---

### 3.13. `en.questions` — Вопросительные предложения, вопросительные слова и разделительные вопросы

- **Фиксировано:** 3 подформата:
  1. `Choose the correct interrogative sentence.` (по типу `0903 #9`): 1 верный вопрос (порядок `Wh (+ N) + aux + S + V1` или вопрос к подлежащему `Who + V_past/V_s`) + 4 синтаксически ошибочных дистрактора (`did + V2`, отсутствие `did/do/does`, инверсия до подлежащего `did signed you`, лишний `did` в вопросе к подлежащему);
  2. `Choose the correct option.` (выбор вопросительного слова `Who, Whom, Whose, What, Which, Why, Where, When, How long/many/much` по типу `1503 #16`, **30+ контекстов**);
  3. *Разделительные вопросы (Tag Questions, недостающая тема DİM)* (**30+ фреймов**, включая ловушки `I am → aren't I?`, `Let's → shall we?`, `nobody/never/hardly → утвердительный хвостик`, `used to → didn't`).
- **Сложность:** `1` — выбор вопросительного слова; `2` — порядок слов в спецвопросе; `3` — вопросы к подлежащему и сложные `tag questions`.

---

### 3.14. `en.subordinate-clauses` — Косвенные вопросы и придаточные дополнения (`Complete the sentence.`)

- **Фиксировано:** вводная матричная часть (`Do you know ...?`, `I’ll tell you ...`, `Can you explain ...?`, `Nobody remembers ...`, `She asked me ...`) + 5 продолжений.
- **Варьируется:** **45+ фреймов** с разными союзными словами (`when, where, why, how, how long, how many, what, who, if/whether`).
- **Гарантия единственности:** 1 вариант имеет прямой порядок слов (`S + V`) и верное время; 4 дистрактора содержат вопросительную инверсию (`did the student leave`, `will it take`, `have they gone`, `are there`), ошибку согласования времён или пропуск глагола.
- **Сложность:** `1` — простое настоящее/прошедшее; `2` — длинные группы подлежащего (`what the other participant...`) и `how long/how many`; `3` — согласование времён в главном прошедшем (`He asked where she lived`).

---

### 3.15. `en.word-order` и `en.sentence-order` — Построение предложения

- **Фиксировано:**
  - `en.word-order` (`single`, для экзамена): `Make up a sentence.` + список из 5–7 пронумерованных фрагментов + 5 вариантов числовых перестановок `A–E`.
  - `en.sentence-order` (`order`, для интерактивной практики): те же наборы, где пользователь расставляет карточки фрагментов кнопками `↑ / ↓`.
- **Варьируется:** банк из **45+ предложений** строгой канонической структуры (без переставимых обстоятельств, способных породить две верные последовательности):
  `[Subject] + [Aux/Modal + Verb] + [Direct Object / Predicative] + [Manner/Place] + [Preposition + Time/Phrase]`, где все фрагменты попарно различны.
- **Дистракторы (для `single`):** 4 перестановки с типичными ошибками порядка слов (объект перед субъектом, обстоятельство между глаголом и прямым дополнением, время перед местом, предлог после управляемого слова).
- **Сложность:** `1` — 5 фрагментов; `2` — 6 фрагментов (как в `0903 #16`); `3` — 7 фрагментов (как в `1503 #8`) или инфинитивные/страдательные обороты.

---

### 3.16. `en.conjunctions` — Союзы и союзные слова

- **Фиксировано:** предложение из 2 частей с 1 или 2 пропусками.
- **Варьируется:** банк из **50+ семантических пар** по 5 отношениям:
  - противопоставление (`but, although/though, whereas` vs предлоги `despite, in spite of`);
  - причина/следствие (`because, since, as` vs `so, therefore` vs `because of`);
  - время и условие (`when, while, until, as soon as, if, unless`);
  - парные союзы (`both ... and, neither ... nor, either ... or, not only ... but also`);
  - относительные союзные слова (`who, whom, whose, which, that, where`).
- **Сложность:** `1` — `and / but / because / so / when`; `2` — `although / unless / until / relative pronouns`; `3` — `despite vs although`, `because vs because of`, парные союзы.

---

### 3.17. `en.agreement` — Краткие реплики (`So/Neither/Too/Either`) и согласование подлежащего со сказуемым

- **Фиксировано:** 2 подрежима:
  1. *Краткие реплики присоединения (по типу `0903 #19`)*: вторая часть реплики согласия/возражения (`Jane travelled a lot, and her sister did too` / `..., so did her sister` / `..., neither did...` / `..., and ... didn't either`), **30+ рамок** в Present/Past/Future Simple, Present Perfect и с модалами/`to be`.
  2. *Согласование подлежащего и сказуемого (недостающая тема DİM)*: `Neither A nor B`, `Either A or B`, `Both A and B`, `A number of ...` vs `The number of ...`, `Each/Every ...`, собирательные/парные (`police, people, trousers` vs `news, physics, mathematics`), **30+ фреймов**.
- **Сложность:** `1` — базовое `and ... too / neither` и `Both ... and`; `2` — смена вспомогательного глагола (`did` к Past Simple) и `The number of vs A number of`; `3` — правило ближайшего элемента в `Neither ... nor ...` и сбивающие предложные группы (`The box of apples is...`).

---

### 3.18. `en.reported-speech` — Косвенная речь *(недостающая тема DİM)*

- **Фиксировано:** прямая речь (`Tom said: "..."` / `She asked: "..."`) и формулировка `Choose the correct reported sentence.`
- **Варьируется:** **45+ фреймов** (утверждения, общие вопросы с `if/whether`, спецвопросы, просьбы/приказы `asked/told sb (not) to V`) с таблицей сдвига времён (`Present Simple → Past Simple`, `Past Simple / Present Perfect → Past Perfect`, `will → would`, `can → could`) и указателей времени/места (`today → that day`, `yesterday → the day before`, `tomorrow → the next day`, `here → there`, `this → that`).
- **Дистракторы:** забытый сдвиг времени, сохранение вопросительной инверсии, отсутствие `if/whether` в общем вопросе, путаница местоимений `I/you → he/she`.
- **Сложность:** `1` — утверждения с Present→Past и команды; `2` — вопросы (прямой порядок + `if/whether`); `3` — пересчёт `Past Simple → Past Perfect` + маркеры времени.

---

### 3.19. `en.vocab-definitions`, `en.vocab-antonyms`, `en.vocab-context`, `en.vocab-match` — Лексика

- **Банки (`vocab.js`):**
  - **65 словарных дефиниций** (`word, pos, def, ru`), сгруппированных по тематическим/частеречным наборам (глаголы, прилагательные, существительные) для исключения пересечения смыслов внутри одной тройки:
    - `en.vocab-definitions` (`single`, 3 слова ↔ 3 дефиниции, 5 вариантов `A–E` по типу `0903 #14`);
    - `en.vocab-match` (`match`, 3–4 слова ↔ 4–5 дефиниций, с 1 лишней дефиницией-дистрактором!).
  - **50 проверенных антонимических пар** и **50 синонимических пар** (только однозначные пары школьного уровня B1–B2 без омонимических пересечений):
    - `en.vocab-antonyms` (`single`): подрежим `0903 #17` (1 пара антонимов среди 4 синонимичных) + подрежим `1503 #19` (3 пары антонимов из 5 нумерованных пар) + выбор пары синонимов.
  - **45 контекстных фреймов** (`en.vocab-context`): как выбор 2 из 4 прилагательных по полярности контекста (`1503 #15`), так и точный выбор глагола/существительного в коллокации (`make/do`, `say/tell`, `borrow/lend`, `raise/rise`, `invent/discover`).
- **Сложность:** `1` — частотная лексика A2–B1; `2` — стандартная лексика DİM B1; `3` — пары B1+–B2 и множественный отбор 3 из 5.

---

### 3.20. `en.word-formation` — Словообразование *(недостающая тема DİM)*

- **Фиксировано:** предложение с пропуском или выбор строки однокоренных/производных слов.
- **Варьируется:** банк из **45+ словообразовательных семей** (`{ base, noun, adj, adv, oppAdj, ru }`, например `success / successful / successfully / unsuccessful`, `care / careful / careless`, `possible / possibility / impossible`, `honest / honesty / dishonest`).
- **Гарантия единственности:** синтаксическая позиция жёстко требует единственную часть речи (существительное после артикля/предлога, наречие к глаголу, прилагательное с отрицательной приставкой по смыслу `but / unfortunately`) — плюс проверка корректности аффикса (дистракторы типа `*unpossible`, `*successly`, неверная часть речи).
- **Сложность:** `1` — суффиксы существительных/наречий `-ly`, `-ness`; `2` — отрицательные приставки `un-/in-/im-/dis-`; `3` — ложные друзья аффиксов и полный выбор из 4 форм одной семьи.

---

### 3.21. `en.dialogues` — Диалоги и функциональный язык *(недостающая тема DİM)*

- **Фиксировано:** короткий диалог из 2–3 реплик с пропущенной ответной репликой (`Choose the best response to complete the dialogue.`).
- **Варьируется:** банк из **40+ ситуативных диалогов** по 8 коммуникативным функциям: извинение и реакция (`Never mind / That's all right`), приглашение и вежливый отказ, просьба об одолжении (`Would you mind...`), указание дороги, заказ в кафе/магазине, поздравление/сочувствие, совет (`Why don't you...`), разговор по телефону.
- **Дистракторы:** (1) буквализм без учёта идиомы (`Would you mind opening the window?` → дистрактор `*Yes, sure` вместо `Not at all`), (2) нарушение регистра/грубость, (3) ответ на другое речевое намерение, (4) ошибка времени/логики.
- **Сложность:** `1` — прямые этикетные формулы; `2` — приглашения, вежливые отказы, советы; `3` — идиоматичные формулы типа `Would you mind...`, `I'd rather...`, сочувствие/удивление.

---

### 3.22. Чтение и анализ текста (`en.reading-true`, `en.reading-complete`, `en.reading-detail`, `en.reading-main`, `en.reading-definition`, `en.reading-synonym`, `en.reading-paraphrase`, `en.reading-opinion`)

Подробная спецификация генерации текстов и наборов вопросов приведена в разделе 4. Краткая сводка гарантий:
- Все 8 типов используют единый банк оригинальных текстов (`reading-passages.js`), где для каждого текста прописаны выверенные пулы вопросов, дистракторов, точных слов из указанного абзаца и эталонных перефразов/эссе.
- Для `en.reading-definition` (`short`, 2 балла) и `en.reading-synonym` (`short`, 2 балла) массив `accept` включает как форму с частицей `to`, так и голую форму глагола (например, `answer: "to preserve"`, `accept: ["preserve"]`) — это защищает ученика от ложного «неверно» при вводе слова без `to`.
- Для `en.reading-paraphrase` (`open`, 2 балла) и `en.reading-opinion` (`open`, 2 балла) генерируются подробный `answer` (эталон с лексическими вариантами замены для № 29; готовый текст из 3–4 связанных предложений для № 30) и `rubric` с критериями DİM (`0 / 1 / 2` балла).

---

## 4. Производство оригинальных текстов для чтения и аудирования в стиле PDF

Все тексты в тренажёре пишутся **полностью с нуля (original wording only)** по стилевому стандарту DİM 11-го класса (уровень CEFR B1–B1+), без копирования сюжетов или фраз из PDF `0903` и `1503`.

### 4.1. Архитектура банка текстов для чтения (`reading-passages.js`) — **12 текстов**
Каждый текст имеет строгую структуру DİM:
- **Объём:** 200–240 слов, ровно **3 пронумерованных абзаца** (`<p><b>1.</b> ...</p>`, `<p><b>2.</b> ...</p>`, `<p><b>3.</b> ...</p>`), чтобы задания № 27 и № 28 могли точно ссылаться на `paragraph 1`, `paragraph 2` или `paragraph 3`.
- **Тематический баланс (12 текстов):**
  - Биографии деятелей науки, искусства, образования и литературы (4 текста: напр., женщина-океанограф, изобретатель шрифтовой печати, пионер авиации, ботаник-исследователь);
  - Природные и культурные феномены / география и архитектура (4 текста: напр., древний акведук, шёлковое ремесло, миграция бабочек, подземные города);
  - Технологии, экология и социальные проекты (4 текста: напр., солнечные школы, городские библиотеки-обменники, восстановление коралловых рифов, роботы-помощники для незрячих).
- **Структура набора вопросов к каждому тексту (комбинаторное расширение):**
  - `truePool` (4–5 перефразированных истинных фактов) + `falsePool` (8–9 ложных фактов с классическими искажениями: подмена имени/абзаца, инверсия полярности, искажение причины/числа, *not given*) → даёт $\ge 100$ комбинаций 5 вариантов для `en.reading-true`;
  - `completeItems` (2–3 основы предложения, каждая с 1 верным перефразированным завершением и 5–6 дистракторами) → для `en.reading-complete`;
  - `detailQuestions` (2 вопроса `Wh-` к тексту, для каждого ≥ 3 верных и ≥ 4 неверных пунктов `1–4` → выбор пары `2 из 4`) → для `en.reading-detail`;
  - `mainIdeas` (1–2 формулировки главной темы) + `mainDistractors` (6–7 частных/искажённых формулировок) → для `en.reading-main`;
  - `definitions` (2–3 пары `{ paragraph, def, word, accept, ruDef }` — слово **обязательно и в единственном экземпляре** соответствует дефиниции в указанном абзаце) → для `en.reading-definition` (№ 27);
  - `synonyms` (2–3 пары `{ paragraph, promptWord, answer, accept, ruPair }` — точный синоним из указанного абзаца) → для `en.reading-synonym` (№ 28);
  - `paraphrases` (2–3 задания `{ starter, originalEnding, models[], minChanges: 2, ruExplain }`) → для `en.reading-paraphrase` (№ 29);
  - `opinions` (2–3 тематических вопроса + 3–4-предложные эталоны ответа с вводными конструкциями + критерии `rubric`) → для `en.reading-opinion` (№ 30).

### 4.2. Архитектура банка текстов для аудирования (`listening-passages.js`) — **12 текстов**
- Объём: 175–210 слов, 2–3 ненумерованных абзаца (как в `0903` и `1503`), заголовок в UI: `Аудирование (текст I): <Название>`.
- Комбинаторные пулы аналогичны чтению + гарантия уникального модификатора в `adjTargets` для № 6 (`Write one adjective from the passage that describes the word "…"`).

---

## 5. Сборка полного экзаменационного варианта (`buildExam(rng)`)

Функция `buildExam(rng)` возвращает массив из ровно **30 заданий** (`Task[]`) общей суммой **37 первичных баллов** в реальном порядке DİM:

1. **Слоты `0..5` (№ 1–6 — Аудирование, 1 общий `passage`):**
   - `rng.fork('listening')` выбирает 1 текст из `LISTENING_PASSAGES`.
   - Формируются № 1 (`en.listening-true`, 1 б.), № 2 и № 3 (в случайном порядке `en.listening-main` и `en.listening-multi`, по 1 б.), № 4 и № 5 (`en.listening-qa`, первый — Wh-вопрос, второй — дополнение предложения, по 2 б.), № 6 (`en.listening-adj`, 2 б.). Все 6 заданий несут один и тот же `passage: { id, title, html }`.
2. **Слоты `6..21` (№ 7–22 — Грамматика и лексика, 16 заданий по 1 баллу):**
   - Выбирается по 1 заданию из **14 обязательных слотов** (`tenses`, `passive`, `modals`, `nonfinite`, `nouns`, `articles`, `pronouns`, `adjectives-adverbs`, `prepositions`, `questions`, `subordinate-clauses`, `word-order`, `conjunctions`, `vocab-antonyms`).
   - **Слот 15** выбирается из `['en.vocab-definitions', 'en.vocab-context']`.
   - **Слот 16** выбирается из `['en.quantifiers', 'en.agreement', 'en.conditionals', 'en.reported-speech', 'en.word-formation', 'en.dialogues']` (с приоритетом базовых `quantifiers` / `agreement` и включением тем программы DİM для полной подготовки).
   - Последовательность этих 16 заданий перемешивается с помощью `rng.shuffle` — точно так же, как DİM перемешивает задания № 7–22 между вариантами A, B, C, D!
3. **Слоты `22..29` (№ 23–30 — Чтение, 1 общий `passage`):**
   - `rng.fork('reading')` выбирает 1 текст из `READING_PASSAGES`.
   - Формируются № 23 (`en.reading-true`, 1 б.), № 24 (`en.reading-complete`, 1 б.), № 25 (`en.reading-detail`, 1 б.), № 26 (`en.reading-main`, 1 б.), № 27 (`en.reading-definition`, 2 б.), № 28 (`en.reading-synonym`, 2 б.), № 29 (`en.reading-paraphrase`, 2 б.), № 30 (`en.reading-opinion`, 2 б.). Все 8 заданий несут общий `passage: { id, title, html }`.

Контроль суммы:
- `tasks.length === 30`
- `sum(points) === 23 * 1 + 7 * 2 === 37`
- `score(tasks, earned)` возвращает `{ score: Math.round((sum / 37) * 1000) / 10, max: 100, label: '${sum}/37 перв. (${scaled}/100 ДИМ)' }`.

---

## 6. Темы программы DİM (V–XI классы), отсутствующие в мартовских PDF 2026 года

Анализ учебной программы ГЭЦ (*İngilis dili üzrə qəbul və buraxılış imtahanı proqramı*) показал следующие разделы, которых не было в двух буклетах `09.03.2026` и `15.03.2026`, но которые регулярно встречаются на экзаменах DİM и покрыты нашими генераторами:

1. **Притяжательный падеж существительных (`'s / s'`) и особые формы множественного числа** (`children's, the Browns', Tom and Ann's`, ловушка сокращения `Tom's reading` = `is`, существительные `deer, sheep, means, news, police`) — покрыто в `en.nouns`.
2. **Условные предложения (Conditionals 0/I/II/III) и конструкции с `wish`** (`if + Past Simple → would`, `had V3 → would have V3`, `unless`, `I wish I knew / had known`) — выделенный тип `en.conditionals`.
3. **Косвенная речь (Reported Speech)** и сдвиг времён/местоимений/наречий времени в утверждениях, общих вопросах (`if/whether`) и просьбах (`told sb not to V`) — выделенный тип `en.reported-speech`.
4. **Согласование подлежащего и сказуемого (Subject-Verb Agreement)** (`Neither ... nor ...`, `Either ... or ...`, `A number of` vs `The number of`, собирательные и парные существительные) — покрыто в `en.agreement`.
5. **Разделительные вопросы (Tag Questions)** (`..., aren't I?`, `Let's ..., shall we?`, полуотрицания `hardly/seldom/never → положительный тег`) — покрыто в `en.questions`.
6. **Герундий, инфинитив после глаголов и причастия `-ing / -ed`** (`enjoy/avoid/look forward to + V-ing`, `bored vs boring`) — покрыто в `en.nonfinite`.
7. **Прилагательное vs Наречие с глаголами-связками и исключения** (`smells good`, `hard vs hardly`, `late vs lately`, `so ... that` vs `such ... that`) — покрыто в `en.adjectives-adverbs`.
8. **Словообразование (Prefixes & Suffixes)** — выделенный тип `en.word-formation`.
9. **Функциональный язык и ситуативные диалоги (Dialogues & Everyday English)** — выделенный тип `en.dialogues`.
10. **Относительные придаточные (`who, whom, whose, which, that, where`) и `despite / in spite of` vs `although`** — покрыто в `en.conjunctions`.
11. **Фразовые глаголы и числительные (`two million` vs `millions of`, даты/дроби)** — фразовые глаголы покрыты в `en.prepositions` и `en.vocab-context`; числительные и согласование разрядов (`two hundred / hundreds of`, порядковые даты) интегрированы в `en.nouns` / `en.quantifiers`.
12. *(Примечание по фонетике)*: раздел «Фонетика» (гласные/согласные звуки, ударение) формально присутствует в программе V–XI классов, однако в современном формате 11-го класса *Buraxılış* (2024–2026) отдельные тесты по фонетике фактически не используются (заменены лексико-грамматическим блоком № 7–22 и открытыми заданиями № 4–6, № 27–30).

---

## 7. План реализации Фазы B

1. **`site/data/original/en.json`:** оцифровать все **60 оригинальных заданий** (№ 1–30 из `Attestat_all_09.03.2026_1773051095.pdf` и № 1–30 из `Attestat_all_15.03.2026_1773569675.pdf`) в формате `Task[]` с `source: 'original'`, точными `passage` (по 2 текста на каждый вариант), правильными ответами (для № 6, 27, 28 — `short` с `accept`; для № 4, 5, 29, 30 — `open` с эталоном и критериями; для остальных — `single` на 5 опций, без префиксов `A)` в строках опций) и подробными **объяснениями на русском языке**.
2. **`site/js/subjects/en/`:** модульная архитектура:
   - `banks/listening-passages.js` (12 оригинальных текстов + наборы для № 1–6)
   - `banks/reading-passages.js` (12 оригинальных текстов из 3 нумерованных абзацев + наборы для № 23–30)
   - `banks/grammar-verbs.js` (таблицы глаголов и фреймы для `tenses`, `passive`, `modals`, `nonfinite`, `conditionals`, `reported-speech`)
   - `banks/grammar-nominal.js` (банки для `nouns`, `articles`, `pronouns`, `quantifiers`, `adjectives-adverbs`, `prepositions`)
   - `banks/grammar-syntax.js` (банки для `questions`, `subordinate-clauses`, `word-order`, `conjunctions`, `agreement`)
   - `banks/vocab-functional.js` (банки для `vocab-definitions`, `vocab-antonyms`, `vocab-context`, `word-formation`, `dialogues`)
   - `generators/listening.js`, `generators/grammar.js`, `generators/vocab.js`, `generators/reading.js`
   - `index.js` — экспорт `SubjectModule` (`id: 'en'`, `taskTypes`, `buildExam`, `exam`, `originals`, `score`).
3. **Самопроверка:** `node tools/selftest.mjs --subjects en --count 1000` (и ручная проверка выборки на английскую грамматику, однозначность ответа и качество русских пояснений) перед передачей `@qa-content`.
