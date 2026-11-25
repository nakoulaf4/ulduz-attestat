// Written + SVG Visual Lessons + Verified Russian YouTube Video Lessons — English (8 topics)
export default [
  {
    topic: 'Аудирование',
    subtitle: 'Стратегии восприятия английской речи на слух для экзамена ДИМ',
    diagram: 'en-tenses',
    summary: 'Главный секрет аудирования ДИМ — прочитать вопросы ДО первого прослушивания и подчеркнуть ключевые слова-маячки (даты, имена, причины).',
    sections: [
      {
        heading: 'Алгоритм работы с аудиозаписью',
        body: 'Во время первого прослушивания уловите главную тему и отметьте очевидные ответы; во время второго — проверьте детали, числа и отрицания.',
        bullets: [
          'Слушайте синонимы: в аудио редко звучит точное слово из вопроса (например, «expensive» в вопросе = «costs too much» в записи).',
          'Обращайте внимание на слова-повороты «but», «however», «actually» — правильный ответ часто звучит именно после них.',
        ],
      },
    ],
    formulas: [],
    example: {
      problem: 'В записи звучит: «We planned to meet at 5, actually let’s make it 6:30». Какое время встречи верное?',
      steps: [
        '«5» — это дистрактор (старый план). После маркера «actually» идёт исправленное время — 6:30.',
      ],
      answer: '6:30.',
    },
    traps: [
      'Не выбирайте первый услышанный вариант из списка — экзаменаторы намеренно вставляют дистракторы до слова «but / however».',
    ],
    videos: [
      { id: 'ZFoQZn-tjMY', title: 'Английские диалоги — учим английский на слух (с разбором на русском)', channel: 'PlayEN' },
      { id: 'KPPWd3NLmm0', title: 'Аудирование с носителем — тренировка восприятия на слух', channel: 'Английский язык с носителем' },
    ],
  },
  {
    topic: 'Глагол и времена',
    subtitle: 'Система времён (Simple, Continuous, Perfect), модальные глаголы и согласование',
    diagram: 'en-tenses',
    summary: 'Все 12 времён английского строятся из 3 осей (Past / Present / Future) и 4 аспектов (Simple, Continuous, Perfect, Perfect Continuous).',
    sections: [
      {
        heading: 'Выбор времени по маркеру смысла',
        body: 'Present Simple — регулярные факты; Present Continuous — процесс прямо сейчас; Present Perfect — результат к настоящему моменту без точной даты в прошлом; Past Simple — завершённый факт с указанием времени (yesterday, in 2019).',
        bullets: [
          'После модальных глаголов (can, must, should, may) смысловой глагол всегда без «to» и без «-s».',
          'Согласование времён: если главное предложение в Past (He said that...), придаточное сдвигается на шаг в прошлое.',
        ],
      },
    ],
    formulas: [],
    example: {
      problem: 'Выберите верную форму: «She ___ (live) in Baku since 2018».',
      steps: [
        'Маркер «since 2018» показывает действие, начавшееся в прошлом и продолжающееся до сих пор → Present Perfect (или Perfect Continuous).',
      ],
      answer: 'has lived / has been living.',
    },
    traps: [
      'С точным временем в прошлом («yesterday», «last week», «in 2020») НИКОГДА не используют Present Perfect — только Past Simple!',
    ],
    videos: [
      { id: '0RHucGBZOxM', title: 'Вся грамматика английского за 1 видео — с нуля до B1', channel: 'Vlad_and_English' },
      { id: 'm8pe5CiAVVE', title: 'Полный курс английской грамматики (A2–B2)', channel: 'Vlad_and_English' },
    ],
  },
  {
    topic: 'Существительные, артикли и местоимения',
    subtitle: 'Исчисляемые/неисчисляемые, притяжательный падеж, a/an/the и местоимения',
    diagram: 'lang-syntax',
    summary: 'Артикль a/an ставится только перед исчисляемым существительным в единственном числе («один из многих»), the — перед конкретным или единственным в своём роде.',
    sections: [
      {
        heading: 'Топ неисчисляемых существительных ДИМ',
        body: 'Слова information, advice, news, furniture, luggage, knowledge, money, weather в английском НЕ имеют множественного числа и НЕ употребляются с артиклем «a/an»!',
        bullets: [
          'Притяжательный падеж: boy’s book (ед. ч.), boys’ books (мн. ч. на -s), children’s toys (исключение мн. ч.).',
          'Much / little — с неисчисляемыми; many / few — с исчисляемыми во множественном числе.',
        ],
      },
    ],
    formulas: [],
    example: {
      problem: 'Исправьте ошибку: «He gave me an useful advice».',
      steps: [
        'Во-первых, «advice» — неисчисляемое (артикль a/an невозможен). Во-вторых, «useful» начинается со звука [ju:], поэтому с исчисляемыми было бы «a useful book».',
      ],
      answer: 'He gave me useful advice / a piece of useful advice.',
    },
    traps: [
      'Слово «news» оканчивается на -s, но это ЕДИНСТВЕННОЕ число: «The news IS good»!',
    ],
    videos: [
      { id: 'eJnejBp9edA', title: 'Артикли в английском языке — понятный разбор', channel: 'Инглекс' },
      { id: 'Ex07A22lHXo', title: 'Артикли a, an, the в английском для начинающих', channel: 'T-channel' },
    ],
  },
  {
    topic: 'Прилагательные, наречия и предлоги',
    subtitle: 'Степени сравнения, -ed/-ing прилагательные и предлоги места и времени (in/on/at)',
    diagram: 'en-tenses',
    summary: 'Пирамида предлогов времени: AT — точный час (at 7 pm), ON — день/дата (on Monday), IN — месяц/год/сезон (in May, in 2025).',
    sections: [
      {
        heading: 'Степени сравнения и исключения',
        body: 'Короткие прилагательные образуют степени через -er / the -est (tall → taller → the tallest), длинные — через more / the most (interesting → more interesting).',
        bullets: [
          'Исключения: good–better–the best, bad–worse–the worst, little–less–the least, far–farther/further.',
          'Прилагательные на -ed описывают чувство человека (I am bored), на -ing — свойство предмета (the film is boring).',
        ],
      },
    ],
    formulas: [],
    example: {
      problem: 'Вставьте предлоги: «The exam starts ___ 9 a.m. ___ Monday ___ June».',
      steps: [
        'Точное время → at 9 a.m.; день недели → on Monday; месяц → in June.',
      ],
      answer: 'at 9 a.m. on Monday in June.',
    },
    traps: [
      'Никогда не соединяйте «more» и «-er» вместе («more better» — грубая ошибка!).',
    ],
    videos: [
      { id: 'A1rgussZhuw', title: 'Всё о предлогах в английском за 20 минут', channel: 'Инглекс' },
      { id: '0RHucGBZOxM', title: 'Вся базовая грамматика английского языка', channel: 'Vlad_and_English' },
    ],
  },
  {
    topic: 'Синтаксис и структура',
    subtitle: 'Passive Voice, Conditionals (0–3), косвенная речь и относительные придаточные',
    diagram: 'en-passive',
    summary: 'Формула любого времени в Passive Voice едина: нужная форма глагола «to be» + третья форма смыслового глагола ($V_3$).',
    sections: [
      {
        heading: 'Passive Voice и Conditionals',
        body: 'Чтобы перевести предложение в пассив, дополнение поставьте на место подлежащего и сохраните исходное время в глаголе «to be». В условных предложениях (if-clause) будущее время «will» НЕ ставится!',
        bullets: [
          'First Conditional (реально): If + Present Simple, will + V1.',
          'Second Conditional (воображаемо сейчас): If + Past Simple, would + V1.',
          'Third Conditional (нереальное прошлое): If + had + V3, would have + V3.',
        ],
      },
    ],
    formulas: [],
    example: {
      problem: 'Переведите в Passive Voice: «They built this bridge in 1995».',
      steps: [
        'Время — Past Simple, объект «this bridge» в ед. ч. → was + built.',
      ],
      answer: 'This bridge was built in 1995.',
    },
    traps: [
      'После «if / when / until / as soon as» в придаточном условия/времени ставьте Present Simple вместо «will»!',
    ],
    videos: [
      { id: 'Cmjs1H-oBgw', title: 'Страдательный залог (Passive Voice) в английском', channel: 'Инглекс' },
      { id: 'k62ef0K46IU', title: 'Всё об условных предложениях (Conditionals) за 15 минут', channel: 'Инглекс' },
    ],
  },
  {
    topic: 'Лексика и словообразование',
    subtitle: 'Суффиксы частей речи, отрицательные префиксы и фразовые глаголы',
    diagram: 'lang-morpheme',
    summary: 'По суффиксу слова мгновенно определяется часть речи: -tion/-ment/-ness (существительные), -ful/-ous/-ive (прилагательные), -ly (наречия).',
    sections: [
      {
        heading: 'Отрицательные приставки и коллокации',
        body: 'Выбор приставки зависит от первой буквы корня: im- перед m/p (impossible), il- перед l (illegal), ir- перед r (irregular), а также un-, in-, dis-.',
      },
    ],
    formulas: [],
    example: {
      problem: 'Образуйте существительное от глагола «decide» и прилагательное от «danger».',
      steps: [
        'decide → decision; danger → dangerous.',
      ],
      answer: 'decision; dangerous.',
    },
    traps: [
      'Различайте «make» (создавать: make a mistake, make a decision) и «do» (выполнять действие: do homework, do your best).',
    ],
    videos: [
      { id: 'uOfQ0Q278Fk', title: '300 базовых английских фраз и лексика на слух', channel: 'PlayEN' },
      { id: '0508vscCbX8', title: 'Английская лексика и фразы по темам', channel: 'Kendra\'s Language School' },
    ],
  },
  {
    topic: 'Функциональный язык',
    subtitle: 'Вежливые просьбы, согласие/отказ, диалоги и речевой этикет',
    diagram: 'lang-syntax',
    summary: 'В диалогах ДИМ важно не только понять смысл, но и подобрать реплику нужного регистра (вежливая просьба, извинение, предложение помощи).',
    sections: [
      {
        heading: 'Ключевые формулы речевого этикета',
        body: 'Для вежливой просьбы используют «Could you...? / Would you mind + V-ing?». На «Would you mind opening the window?» согласие звучит как «Not at all / Of course not!» (т.е. «Я совсем не возражаю»).',
      },
    ],
    formulas: [],
    example: {
      problem: 'Собеседник говорит: «Would you mind if I sit here?». Как вежливо разрешить?',
      steps: [
        'Вопрос переводится «Вы не против, если я сяду?», поэтому разрешение = «Not at all! Go ahead».',
      ],
      answer: 'Not at all! / No, of course not.',
    },
    traps: [
      'Ответ «Yes» на вопрос «Would you mind...?» означает «Да, я ПРОТИВ»!',
    ],
    videos: [
      { id: 'pVHWvQSGYeA', title: '400 практических диалогов на английском языке', channel: 'Kendra\'s Language School' },
      { id: '2JG2qCsEPp0', title: '155 важнейших вопросов и ответов в разговорном английском', channel: 'ENGLISH GALAXY' },
    ],
  },
  {
    topic: 'Чтение',
    subtitle: 'Поисковое чтение (scanning), главная идея (skimming) и ответы на открытые вопросы',
    diagram: 'lang-syntax',
    summary: 'В заданиях Reading на ДИМ ответ почти всегда перефразирован в тексте — ищите идею и контекстные синонимы, а не буквальное совпадение.',
    sections: [
      {
        heading: 'Как отвечать на открытые вопросы Reading',
        body: 'Не копируйте целые абзацы без изменения: дайте точный грамматически связный ответ по сути вопроса, заменив местоимения («he/it/they») на конкретные понятия из текста.',
      },
    ],
    formulas: [],
    example: {
      problem: 'В тексте: «Although the museum was renovated in 2012, its collection dates back to 1890». Вопрос: «Is the statement "The collection started in 2012" True or False?»',
      steps: [
        'В 2012 году музей отреставрировали, а коллекция началась в 1890 году → утверждение неверно (False).',
      ],
      answer: 'False.',
    },
    traps: [
      'Остерегайтесь абсолютных слов в вариантах ответа: «always», «never», «only», «all» часто делают утверждение ложным.',
    ],
    videos: [
      { id: 'vX05qGD96v8', title: 'Разбор 100 английских предложений и конструкций с переводом', channel: 'PlayEN' },
      { id: 'kTAfHzA38wM', title: 'Практика понимания английских текстов и фраз', channel: 'Kendra\'s Language School' },
    ],
  },
];
