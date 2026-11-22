// Curated banks for Syntax & Sentence Structure:
// en.questions, en.subordinate-clauses, en.word-order, en.sentence-order, en.conjunctions, en.agreement

export const QUESTION_ORDER_ITEMS = [
  {
    diff: 2,
    correct: 'How many pages did you translate yesterday?',
    distractors: [
      'How many pages you translated yesterday?',
      'How many pages did you translated yesterday?',
      'How many pages did translate you yesterday?',
      'How many pages you did translated yesterday?'
    ],
    rule: 'В специальном вопросе к определению дополнения порядок слов: <i>Wh-слово + существительное + вспомогательный глагол (did) + подлежащее + V1</i>. После <i>did</i> ставится базовая форма <i>translate</i>.'
  },
  {
    diff: 2,
    correct: 'Where did the archaeologists discover the ancient coins?',
    distractors: [
      'Where the archaeologists discovered the ancient coins?',
      'Where did the archaeologists discovered the ancient coins?',
      'Where did discover the archaeologists the ancient coins?',
      'Where were the archaeologists discover the ancient coins?'
    ],
    rule: 'В Past Simple специальный вопрос строится по схеме: <i>Where + did + подлежащее + V1</i> (<i>discover</i>, а не <i>discovered</i>).'
  },
  {
    diff: 2,
    correct: 'What time does the evening train leave Baku?',
    distractors: [
      'What time the evening train leaves Baku?',
      'What time does the evening train leaves Baku?',
      'What time leaves the evening train Baku?',
      'What time is the evening train leave Baku?'
    ],
    rule: 'После вспомогательного глагола <i>does</i> смысловой глагол возвращается в начальную форму без <i>-s</i> (<i>leave</i>, а не <i>leaves</i>).'
  },
  {
    diff: 2,
    correct: 'How long has your cousin lived in Ganja?',
    distractors: [
      'How long your cousin has lived in Ganja?',
      'How long did your cousin lived in Ganja?',
      'How long has lived your cousin in Ganja?',
      'How long does your cousin lived in Ganja?'
    ],
    rule: 'В вопросе Present Perfect вспомогательный глагол <i>has</i> выносится перед подлежащим <i>your cousin</i>, а смысловой глагол стоит в V3 (<i>lived</i>).'
  },
  {
    diff: 3,
    correct: 'Who broke the porcelain teapot in the dining room?',
    distractors: [
      'Who did break the porcelain teapot in the dining room?',
      'Who did broke the porcelain teapot in the dining room?',
      'Who was break the porcelain teapot in the dining room?',
      'Who has broke the porcelain teapot in the dining room?'
    ],
    rule: 'В вопросе к <b>подлежащему</b> (<i>Who?</i> = Кто?) сохраняется прямой порядок слов <b>без</b> вспомогательного глагола <i>do/does/did</i>: <i>Who broke...?</i>'
  },
  {
    diff: 3,
    correct: 'Which museum did the students visit last Friday?',
    distractors: [
      'Which museum visited the students last Friday?',
      'Which museum did the students visited last Friday?',
      'Which museum the students did visit last Friday?',
      'Which museum were the students visit last Friday?'
    ],
    rule: 'Здесь <i>Which museum</i> относится к дополнению («Какой музей посетили ученики?»), поэтому нужен вспомогательный глагол <i>did</i> перед подлежащим и инфинитив <i>visit</i>.'
  },
  {
    diff: 3,
    correct: 'How much luggage are the passengers allowed to take?',
    distractors: [
      'How much luggage the passengers are allowed to take?',
      'How much luggage are allowed the passengers to take?',
      'How many luggage are the passengers allowed to take?',
      'How much luggage do the passengers allowed to take?'
    ],
    rule: 'С неисчисляемым словом <i>luggage</i> используется <i>How much</i>, а глагол-связка <i>are</i> ставится перед подлежащим <i>the passengers</i>.'
  }
];

export const QUESTION_WORD_ITEMS = [
  { diff: 1, stem: '<span class="gap"></span> was the morning bus forty minutes late?', correct: 'Why', distractors: ['Who', 'Whose', 'What', 'Which'], rule: 'В предложении уже есть подлежащее (<i>the morning bus</i>) и сказуемое (<i>was late</i>); спрашивается причина → <i>Why</i> («Почему?»).' },
  { diff: 1, stem: '<span class="gap"></span> backpack was left beside the library desk?', correct: 'Whose', distractors: ['Who', 'Whom', 'Why', 'How'], rule: 'Перед существительным <i>backpack</i> в вопросе о принадлежности («Чей рюкзак?») ставится вопросительное местоимение <i>Whose</i>.' },
  { diff: 1, stem: '<span class="gap"></span> does it take to reach Lankaran by express train?', correct: 'How long', distractors: ['How many', 'Whose', 'Who', 'Which'], rule: 'Вопрос о длительности времени («Сколько времени занимает?») начинается с <i>How long</i>.' },
  { diff: 1, stem: '<span class="gap"></span> invented the first mechanical printing press?', correct: 'Who', distractors: ['Whose', 'Whom', 'Where', 'Why'], rule: 'Вопрос к одушевлённому подлежащему («Кто изобрёл?») вводится словом <i>Who</i>.' },
  { diff: 2, stem: '<span class="gap"></span> of these two dictionaries belongs to the school library?', correct: 'Which', distractors: ['Who', 'Why', 'How', 'When'], rule: 'При выборе из ограниченного круга предметов (<i>of these two dictionaries</i> — «Который из двух») используется <i>Which</i>.' },
  { diff: 2, stem: '<span class="gap"></span> far is the railway station from the central square?', correct: 'How', distractors: ['What', 'Which', 'Where', 'Whose'], rule: 'Вопрос о расстоянии («Как далеко?») задаётся сочетанием <i>How far</i>.' }
];

export const TAG_QUESTION_ITEMS = [
  { diff: 2, stem: 'Your elder sister speaks French fluently, <span class="gap"></span>?', correct: 'doesn’t she', distractors: ['isn’t she', 'does she', 'don’t she', 'hasn’t she'], rule: 'Утвердительное предложение в Present Simple (<i>speaks</i>) требует отрицательного разделительного хвостика со вспомогательным <i>doesn’t</i> и местоимением <i>she</i>.' },
  { diff: 2, stem: 'They didn’t miss the afternoon ferry, <span class="gap"></span>?', correct: 'did they', distractors: ['didn’t they', 'were they', 'do they', 'had they'], rule: 'Если основная часть отрицательная (<i>didn’t miss</i>), то «хвостик» (tag) должен быть утвердительным с тем же вспомогательным глаголом: <i>did they</i>?' },
  { diff: 3, stem: 'I am responsible for the presentation slides today, <span class="gap"></span>?', correct: 'aren’t I', distractors: ['amn’t I', 'am I', 'isn’t I', 'don’t I'], rule: 'Особое исключение английской грамматики: в разделительном вопросе к утвердительному <i>I am...</i> вместо несуществующего *<i>amn’t I</i> всегда используется <b>aren’t I</b>.' },
  { diff: 3, stem: 'Let’s plant some flowers along the school path, <span class="gap"></span>?', correct: 'shall we', distractors: ['will we', 'do we', 'aren’t we', 'let’s we'], rule: 'К побудительным предложениям с <i>Let’s...</i> («Давайте...») стандартный разделительный вопрос всегда строится с помощью <b>shall we?</b>' },
  { diff: 3, stem: 'Kamran has never visited Gobustan before, <span class="gap"></span>?', correct: 'has he', distractors: ['hasn’t he', 'did he', 'does he', 'isn’t he'], rule: 'Наречие <i>never</i> делает главную часть отрицательной по смыслу, поэтому в хвосте ставится утвердительный вспомогательный глагол <i>has he?</i>' },
  { diff: 3, stem: 'She hardly ever makes spelling mistakes in her essays, <span class="gap"></span>?', correct: 'does she', distractors: ['doesn’t she', 'is she', 'did she', 'has she'], rule: 'Слово <i>hardly</i> («едва ли, почти никогда») считается полуотрицанием и требует <b>утвердительного</b> тега: <i>does she?</i>' }
];

export const SUBORDINATE_CLAUSE_ITEMS = [
  {
    diff: 1,
    stem: 'Can you tell me where <span class="gap"></span>?',
    correct: 'the nearest pharmacy is located',
    distractors: ['is the nearest pharmacy located', 'is located the nearest pharmacy', 'was the nearest pharmacy locate', 'does the nearest pharmacy locate'],
    rule: 'В косвенном вопросе после <i>Can you tell me where...</i> должен быть <b>прямой порядок слов</b> (подлежащее <i>the nearest pharmacy</i> + сказуемое <i>is located</i>), без вопросительной инверсии.'
  },
  {
    diff: 2,
    stem: 'Do you know when <span class="gap"></span> his morning swim?',
    correct: 'he usually does',
    distractors: ['does he usually do', 'has he usually done', 'did he usually', 'usually does he'],
    rule: 'В придаточном дополнительном порядке слов прямой (<i>he usually does</i>). Вариант <i>has he done</i> отпадает из-за инверсии и несовместимости Present Perfect с вопросом <i>when</i>.'
  },
  {
    diff: 2,
    stem: 'I’ll explain to you <span class="gap"></span> .',
    correct: 'how this solar device purifies seawater',
    distractors: ['how does this solar device purify seawater', 'why did the engineers chose this design', 'when will the next ferry arrive at the pier', 'what are the visitors looking for right now'],
    rule: 'После <i>I’ll explain to you</i> требуется придаточное с прямым порядком слов (<i>S + V</i>). Все четыре дистрактора содержат прямую вопросительную инверсию (<i>does..., did..., will..., are...</i>).'
  },
  {
    diff: 2,
    stem: 'Nobody remembers <span class="gap"></span> .',
    correct: 'who left that green umbrella near the door',
    distractors: ['where did the tourists go after lunch', 'how long has the museum been open today', 'what time does the concert start tonight', 'why were the windows painted white'],
    rule: 'В придаточном после <i>Nobody remembers</i> необходим прямой порядок слов. Выражение <i>who left...</i> — вопрос к подлежащему в прямом порядке, а в остальных вариантах допущена инверсия.'
  },
  {
    diff: 2,
    stem: 'Could you check <span class="gap"></span>?',
    correct: 'whether the parcel has already arrived',
    distractors: ['has the parcel already arrived', 'when did the parcel arrived', 'that has the parcel arrived', 'how long ago has the parcel arrived'],
    rule: 'Косвенный общий вопрос вводится союзом <i>whether / if</i> с прямым порядком слов (<i>the parcel has already arrived</i>).'
  },
  {
    diff: 3,
    stem: 'The librarian wanted to know <span class="gap"></span> .',
    correct: 'why the student had returned the book so late',
    distractors: ['why had the student returned the book so late', 'why did the student returned the book so late', 'why has the student returned the book so late', 'what did the student borrow yesterday for'],
    rule: 'Придаточное после <i>wanted to know</i> имеет прямой порядок слов (<i>the student had returned</i>) и соблюдает согласование времён в прошедшем времени (Past Perfect).'
  },
  {
    diff: 3,
    stem: 'Please ask the guide <span class="gap"></span> .',
    correct: 'how many ancient towers remain inside the fortress',
    distractors: ['how many ancient towers do remain inside', 'how much ancient towers remain inside', 'how many ancient towers are there remain', 'why did the builders constructed the wall'],
    rule: 'После <i>ask the guide</i> порядок слов прямой: <i>how many ancient towers</i> (подлежащее во мн. ч.) + <i>remain</i> (без лишнего <i>do</i> и без ошибок вроде <i>how much towers</i>).'
  }
];

// Each item has strictly distinct chunks and ONE canonical English word order.
export const WORD_ORDER_SENTENCES = [
  { diff: 1, chunks: ['The students', 'planted', 'twelve trees', 'in the schoolyard', 'yesterday'], sentence: 'The students planted twelve trees in the schoolyard yesterday.', rule: 'Базовый порядок слов: Подлежащее (<i>The students</i>) + Глагол (<i>planted</i>) + Дополнение (<i>twelve trees</i>) + Место (<i>in the schoolyard</i>) + Время (<i>yesterday</i>).' },
  { diff: 1, chunks: ['My elder sister', 'reads', 'English novels', 'in the library', 'every evening'], sentence: 'My elder sister reads English novels in the library every evening.', rule: 'Порядок слов: Подлежащее + Сказуемое + Прямое дополнение + Место + Время.' },
  { diff: 1, chunks: ['Our neighbours', 'bought', 'a wooden table', 'at the market', 'last Sunday'], sentence: 'Our neighbours bought a wooden table at the market last Sunday.', rule: 'Сначала идёт группа подлежащего (<i>Our neighbours</i>), затем глагол, дополнение, место и время (<i>last Sunday</i>).' },
  { diff: 1, chunks: ['Fresh water', 'is', 'essential', 'for every living', 'creature'], sentence: 'Fresh water is essential for every living creature.', rule: 'Именное сказуемое: Подлежащее (<i>Fresh water</i>) + связка (<i>is</i>) + прилагательное (<i>essential</i>) + предложное дополнение (<i>for every living creature</i>).' },
  { diff: 1, chunks: ['The young pianist', 'played', 'a classical melody', 'in the concert hall', 'last night'], sentence: 'The young pianist played a classical melody in the concert hall last night.', rule: 'Порядок: Подлежащее + Глагол + Дополнение + Обстоятельство места (<i>in the concert hall</i>) + Время (<i>last night</i>).' },

  { diff: 2, chunks: ['the girls', 'have been making', 'salad', 'in the kitchen', 'for', 'twenty minutes'], sentence: 'The girls have been making salad in the kitchen for twenty minutes.', rule: 'Схема: Подлежащее (<i>the girls</i>) + Сказуемое (<i>have been making</i>) + Дополнение (<i>salad</i>) + Место (<i>in the kitchen</i>) + Предлог и длительность (<i>for twenty minutes</i>).' },
  { diff: 2, chunks: ['ancient artisans', 'carved', 'thousands of', 'rock drawings', 'on the cliffs', 'of Gobustan'], sentence: 'Ancient artisans carved thousands of rock drawings on the cliffs of Gobustan.', rule: 'Порядок: Подлежащее + Глагол + Числовая группа с <i>of</i> + Существительное + Место.' },
  { diff: 2, chunks: ['the museum', 'attracts', 'curious visitors', 'from different', 'countries', 'every summer'], sentence: 'The museum attracts curious visitors from different countries every summer.', rule: 'Порядок: Подлежащее + Сказуемое + Дополнение + Определение происхождения (<i>from different countries</i>) + Время (<i>every summer</i>).' },
  { diff: 2, chunks: ['solar panels', 'produce', 'clean electricity', 'for remote', 'mountain villages', 'all year'], sentence: 'Solar panels produce clean electricity for remote mountain villages all year.', rule: 'Порядок: Подлежащее + Глагол + Дополнение + Назначение (<i>for remote mountain villages</i>) + Время.' },
  { diff: 2, chunks: ['careful practice', 'helps', 'high school students', 'improve', 'their writing skills', 'steadily'], sentence: 'Careful practice helps high school students improve their writing skills steadily.', rule: 'Конструкция <i>helps + объект + инфинитив без to + дополнение + наречие</i>.' },
  { diff: 2, chunks: ['the coastal wind', 'drove', 'the small sailboat', 'toward the harbour', 'before', 'sunset'], sentence: 'The coastal wind drove the small sailboat toward the harbour before sunset.', rule: 'Порядок: Подлежащее + Глагол + Прямое дополнение + Направление (<i>toward the harbour</i>) + Время (<i>before sunset</i>).' },

  { diff: 3, chunks: ['books', 'are', 'very important', 'in', 'the daily life', 'of', 'modern people'], sentence: 'Books are very important in the daily life of modern people.', rule: 'Сначала подлежащее (<i>Books</i>) + связка (<i>are</i>) + именная часть (<i>very important</i>) + предложная группа места/сферы (<i>in the daily life of modern people</i>).' },
  { diff: 3, chunks: ['we', 'must protect', 'rare birds', 'in', 'the coastal reserves', 'of', 'our country'], sentence: 'We must protect rare birds in the coastal reserves of our country.', rule: 'Модальное сказуемое (<i>must protect</i>) стоит сразу после подлежащего <i>we</i>, затем прямое дополнение и цепочка места с <i>in ... of ...</i>.' },
  { diff: 3, chunks: ['many visitors', 'have admired', 'the ancient', 'rock carvings', 'in', 'the valleys', 'of Gobustan'], sentence: 'Many visitors have admired the ancient rock carvings in the valleys of Gobustan.', rule: 'Порядок: Подлежащее + Сказуемое + Определение с существительным (<i>the ancient rock carvings</i>) + Цепочка места (<i>in the valleys of Gobustan</i>).' },
  { diff: 3, chunks: ['reading', 'good books', 'helps', 'young people', 'understand', 'the world', 'better'], sentence: 'Reading good books helps young people understand the world better.', rule: 'Герундиальный оборот-подлежащее (<i>Reading good books</i>) + сказуемое (<i>helps</i>) + сложное дополнение (<i>young people understand the world</i>) + наречие (<i>better</i>).' }
];

export const CONJUNCTION_FRAMES = [
  { diff: 1, stem: 'Some desert plants look dry, <span class="gap"></span> they store water inside their stems.', correct: 'but', distractors: ['because', 'so', 'unless', 'or'], rule: 'Противопоставление («выглядят сухими, <b>но</b> запасают воду») выражается сочинительным союзом <i>but</i>.' },
  { diff: 1, stem: 'We stayed inside the cabin <span class="gap"></span> a heavy snowstorm had blocked the road.', correct: 'because', distractors: ['so', 'but', 'although', 'however'], rule: 'Вторая часть называет <b>причину</b> («так как/потому что метель перекрыла дорогу») — нужен союз <i>because</i>.' },
  { diff: 1, stem: 'The bus was delayed by fog, <span class="gap"></span> the hikers arrived an hour late.', correct: 'so', distractors: ['because', 'although', 'but', 'unless'], rule: 'Вторая часть описывает <b>следствие</b> («поэтому туристы опоздали») — используется союз <i>so</i>.' },
  { diff: 1, stem: 'Call me as soon as you <span class="gap"></span> the results of the competition.', correct: 'receive', distractors: ['will receive', 'received', 'are receiving', 'had received'], rule: 'После временного союза <i>as soon as</i> для будущего действия ставится Present Simple (<i>receive</i>).' },
  { diff: 2, stem: '<span class="gap"></span> all communities save clean water, future generations will face shortages.', correct: 'Unless', distractors: ['If', 'Because', 'Although', 'When'], rule: 'Смысл «<b>Если</b> общины <b>не</b> будут беречь воду, будущие поколения столкнутся с нехваткой» передаётся отрицательным условием <i>Unless</i> (= <i>If ... not</i>).' },
  { diff: 2, stem: '<span class="gap"></span> the hike up the canyon was exhausting, the view from the top was worth it.', correct: 'Although', distractors: ['Despite', 'Because', 'However', 'In spite of'], rule: 'Перед целым придаточным предложением с подлежащим и сказуемым (<i>the hike was...</i>) в значении уступки ставится союз <i>Although</i>, тогда как <i>Despite / In spite of</i> — предлоги перед существительным.' },
  { diff: 2, stem: '<span class="gap"></span> the sudden rainstorm, the outdoor concert continued under tents.', correct: 'Despite', distractors: ['Although', 'Though', 'Because', 'While'], rule: 'После пропуска стоит именная группа без глагола (<i>the sudden rainstorm</i>), поэтому требуется предлог уступки <i>Despite</i> («Несмотря на...»), а не союз <i>Although/Though</i>.' },
  { diff: 2, stem: 'The scientist <span class="gap"></span> discovered the vaccine won an international award.', correct: 'who', distractors: ['which', 'whose', 'whom', 'where'], rule: 'Определительное придаточное относится к одушевлённому лицу (<i>The scientist</i>) в функции подлежащего — ставится <i>who</i>.' },
  { diff: 2, stem: 'Do you remember the quiet village <span class="gap"></span> silk scarves are printed by hand?', correct: 'where', distractors: ['which', 'who', 'whose', 'whom'], rule: 'Ссылается на место действия («деревня, <b>где</b> печатают платки») — относительное наречие <i>where</i>.' },
  { diff: 3, stem: 'That is the young architect <span class="gap"></span> bridge design won first place.', correct: 'whose', distractors: ['who', 'which', 'whom', 'that'], rule: 'Отношение принадлежности перед существительным («чей проект моста») выражается словом <i>whose</i>.' },
  { diff: 3, stem: 'The flight was cancelled <span class="gap"></span> thick winter fog over the runway.', correct: 'because of', distractors: ['because', 'although', 'since', 'while'], rule: 'Перед именной группой без глагола (<i>thick winter fog</i>) употребляется предлог причины <i>because of</i> («из-за»), а не союз <i>because/since</i>.' },
  { diff: 3, stem: 'Neither the textbook <span class="gap"></span> the dictionary was left on the desk.', correct: 'nor', distractors: ['or', 'and', 'but', 'also'], rule: 'Парный отрицательный союз строится строго по паре <i>Neither ... <b>nor</b> ...</i> («Ни ..., ни ...»).' }
];

export const AGREEMENT_FRAMES = [
  // --- Short rejoinders (0903 #19 style) ---
  { diff: 1, stem: 'Nigar visited the Carpet Museum yesterday, <span class="gap"></span> her brother did <span class="gap"></span> .', correct: 'and, too', distractors: ['and, either', 'but, too', 'so, neither', 'neither, –'], rule: 'Обе части утвердительные («Нигар посетила, и её брат тоже»): при прямом порядке слов во второй части ставится союз <i>and</i> и наречие <i>too</i>.' },
  { diff: 2, stem: 'Our team hasn’t finished the lab report yet, and the other group hasn’t <span class="gap"></span> .', correct: 'either', distractors: ['too', 'neither', 'also', 'so'], rule: 'В отрицательном присоединении с отрицательным глаголом (<i>hasn’t</i>) в конце предложения ставится <i>either</i> (не <i>too</i> и не <i>neither</i>!).' },
  { diff: 2, stem: 'Samir enjoys classical music, and <span class="gap"></span> his twin sister.', correct: 'so does', distractors: ['so is', 'neither does', 'too does', 'so did'], rule: 'Вторая часть без повторения смыслового глагола (<i>enjoys</i> — Present Simple, 3-е л.) строится с инверсией: <i>so + does + подлежащее</i>.' },
  { diff: 2, stem: 'I didn’t see any eagles in the canyon, and <span class="gap"></span> my friends.', correct: 'neither did', distractors: ['so did', 'neither didn’t', 'either did', 'nor didn’t'], rule: 'Отрицательное присоединение с инверсией после Past Simple (<i>didn’t see</i>): <i>neither + did + подлежащее</i> (без второго отрицания <i>didn’t</i>!).' },

  // --- Subject-Verb Agreement (missing DİM curriculum topic) ---
  { diff: 2, stem: 'The latest news about the space telescope <span class="gap"></span> very encouraging.', correct: 'is', distractors: ['are', 'were', 'have been', 'are being'], rule: 'Существительное <i>news</i> («новости») в английском языке всегда <b>неисчисляемое и единственного числа</b> — сказуемое стоит в ед. ч. (<i>is</i>).' },
  { diff: 2, stem: 'Physics <span class="gap"></span> my favourite subject in high school.', correct: 'is', distractors: ['are', 'were', 'have been', 'be'], rule: 'Названия наук на <i>-ics</i> (<i>physics, mathematics, economics</i>) согласуются с глаголом в единственном числе (<i>is</i>).' },
  { diff: 2, stem: 'Look! The police <span class="gap"></span> directing traffic near the stadium.', correct: 'are', distractors: ['is', 'was', 'has been', 'am'], rule: 'Собирательное существительное <i>the police</i> в английском языке всегда употребляется со сказуемым во множественном числе (<i>are</i>).' },
  { diff: 3, stem: 'Neither the teacher nor the students <span class="gap"></span> happy about cancelling the trip.', correct: 'were', distractors: ['was', 'is', 'has been', 'had'], rule: 'В конструкции <i>Neither A nor B</i> глагол согласуется с <b>ближайшим</b> подлежащим (<i>the students</i> — мн. ч.), значит нужно <i>were</i>.' },
  { diff: 3, stem: 'The number of solar houses in the region <span class="gap"></span> grown rapidly since 2022.', correct: 'has', distractors: ['have', 'are', 'were', 'do'], rule: 'Выражение <i><b>The</b> number of + мн. ч.</i> («количество кого/чего-либо») согласуется с глаголом в <b>единственном</b> числе (<i>has</i>), в отличие от <i><b>A</b> number of</i> («ряд/много»), где глагол во мн. ч.' },
  { diff: 3, stem: 'A large number of rare manuscripts <span class="gap"></span> preserved in the Baku institute.', correct: 'are', distractors: ['is', 'was', 'has been', 'be'], rule: 'Выражение <i><b>A</b> number of + существительное во мн. ч.</i> означает «ряд, множество» и требует сказуемого во <b>множественном</b> числе (<i>are</i>).' },
  { diff: 3, stem: 'Every student and every teacher in our school <span class="gap"></span> invited to the science fair.', correct: 'was', distractors: ['were', 'are', 'have been', 'be'], rule: 'Если однородные подлежащие начинаются со слов <i>Each</i> или <i>Every</i>, сказуемое всегда стоит в <b>единственном</b> числе (<i>was</i>).' }
];
