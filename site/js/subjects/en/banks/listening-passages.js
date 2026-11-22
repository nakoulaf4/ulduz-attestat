// 12 original DİM-style listening passages (~175–210 words each) with multi-variant question pools.

export const LISTENING_PASSAGES = [
  {
    id: 'en-listen-geothermal',
    title: 'Аудирование (текст I): Geothermal Greenhouses of Iceland',
    paragraphs: [
      'Although Iceland lies close to the Arctic Circle and has long, dark winters, the island grows a large amount of its own fresh vegetables. Instead of relying solely on imported food, local farmers take advantage of volcanic heat deep beneath the ground. Natural hot water and steam rise through underground wells and warm hundreds of glass greenhouses across the countryside.',
      'Inside these warm buildings, tomatoes, cucumbers, and strawberries grow smoothly even when heavy snow covers the roads outside. Bright lamps replace winter sunlight for several hours each day, allowing crops to ripen throughout the year. Many family-run farms also open small cafes right beside the plants so visitors can taste fresh soup and homemade bread.',
      'This clever system reduces transport costs and lowers carbon emissions. Because geothermal energy is clean and renewable, Iceland sets an inspiring example for sustainable farming in cold regions.'
    ],
    trueFacts: [
      { text: 'Iceland produces many fresh vegetables despite its cold climate.', ru: 'В первом абзаце говорится, что Исландия выращивает большое количество свежих овощей, несмотря на долгие зимы.' },
      { text: 'Underground volcanic heat is used to warm Icelandic greenhouses.', ru: 'Фермеры используют подземное вулканическое тепло (горячую воду и пар) для обогрева теплиц.' },
      { text: 'Visitors can eat fresh meals at cafes next to some farms.', ru: 'Многие семейные фермы открывают небольшие кафе прямо рядом с теплицами.' },
      { text: 'Special lamps help plants grow during the dark winter months.', ru: 'Во втором абзаце указано, что яркие лампы заменяют зимний солнечный свет на несколько часов в день.' }
    ],
    falseFacts: [
      { text: 'Iceland imports all of its vegetables from warm countries.', ruReason: 'Исландия не полагается только на импорт, а выращивает много овощей сама.' },
      { text: 'Greenhouses in Iceland operate only during the summer season.', ruReason: 'Теплицы работают круглый год (<i>throughout the year</i>), включая снежную зиму.' },
      { text: 'Geothermal energy pollutes the air and increases carbon emissions.', ruReason: 'Напротив, эта система снижает выбросы углекислого газа и является чистой.' },
      { text: 'Farmers in Iceland heat their glass buildings by burning coal.', ruReason: 'Для обогрева используется подземная горячая вода и пар, а не уголь.' },
      { text: 'Tourists are not allowed to enter the farm cafes.', ruReason: 'Кафе открыты специально для посетителей (<i>so visitors can taste...</i>).' },
      { text: 'Plants inside the greenhouses never need artificial light.', ruReason: 'В тёмные зимние месяцы растениям несколько часов в день светят яркие лампы.' }
    ],
    mainIdeas: [
      { text: 'growing vegetables with geothermal energy in Iceland', ru: 'весь текст посвящён выращиванию овощей в Исландии с помощью геотермальной энергии' },
      { text: 'sustainable greenhouse farming in a cold country', ru: 'текст описывает экологичное тепличное земледелие в холодном климате Исландии' }
    ],
    mainDistractors: [
      'the history of volcanic eruptions in Europe',
      'popular soup recipes in Icelandic cafes',
      'the disadvantages of imported fruits',
      'tourist attractions near the Arctic Circle',
      'how glass buildings are constructed in winter',
      'ways to reduce traffic on snowy roads'
    ],
    multiSets: [
      {
        prompt: 'Icelandic greenhouses … .',
        trueItems: [
          { text: 'are warmed by natural hot water and steam', ru: 'теплицы обогреваются природной горячей водой и паром' },
          { text: 'produce crops such as tomatoes and cucumbers all year round', ru: 'овощи созревают в них круглый год' },
          { text: 'help decrease food transport expenses', ru: 'система снижает расходы на транспортировку продуктов' }
        ],
        falseItems: [
          { text: 'close completely when snow covers the roads', ru: 'в тексте сказано, что урожай растёт даже во время сильного снегопада' },
          { text: 'depend mainly on expensive fossil fuels', ru: 'источник тепла — чистая геотермальная энергия, а не ископаемое топливо' },
          { text: 'are built deep underground without any glass', ru: 'это стеклянные теплицы на поверхности (<i>glass greenhouses</i>), куда поступает подземное тепло' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>Why do farmers use bright lamps inside the greenhouses in winter?</i>',
        answer: 'They use bright lamps to replace winter sunlight (so crops can ripen throughout the year).',
        rubric: '<ul><li><b>2 балла:</b> точно указана цель — заменить зимний солнечный свет / помочь урожаю созревать круглый год.</li><li><b>1 балл:</b> смысл верен, но фраза неполная или есть мелкая грамматическая ошибка.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Во втором абзаце говорится: «Bright lamps replace winter sunlight for several hours each day, allowing crops to ripen throughout the year».',
        hint: 'Ищите во втором абзаце предложение со словами <i>Bright lamps</i>.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Many family-run farms open small cafes beside the plants so visitors can … .</i>',
        answer: 'taste fresh soup and homemade bread',
        rubric: '<ul><li><b>2 балла:</b> точное или синонимически верное завершение (<i>taste fresh soup and homemade bread</i>).</li><li><b>1 балл:</b> указан только один элемент или допущена мелкая неточность.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'В конце второго абзаца: «...so visitors can <b>taste fresh soup and homemade bread</b>».',
        hint: 'Посмотрите последнее предложение второго абзаца.'
      }
    ],
    adjItems: [
      { noun: 'bread', adj: 'homemade', sentence: 'Many family-run farms also open small cafes right beside the plants so visitors can taste fresh soup and <b>homemade</b> bread.', ruExplain: 'Слово <i>bread</i> в тексте описывается прилагательным <b>homemade</b> (домашний).' },
      { noun: 'example', adj: 'inspiring', sentence: 'Because geothermal energy is clean and renewable, Iceland sets an <b>inspiring</b> example for sustainable farming in cold regions.', ruExplain: 'Слово <i>example</i> определяется прилагательным <b>inspiring</b> (вдохновляющий).' }
    ]
  },
  {
    id: 'en-listen-kahriz',
    title: 'Аудирование (текст I): Ancient Underground Water Channels',
    paragraphs: [
      'For centuries, farmers in dry regions of Azerbaijan have depended on clever underground canals called kahriz. A kahriz is a gentle tunnel dug deep below the desert surface to carry mountain water to distant villages and orchards without losing a drop to evaporation.',
      'Building such a channel required remarkable skill and teamwork. Trained craftsmen first dug a deep mother well near the hills to locate clean groundwater. Then they connected vertical shafts along a carefully measured slope so gravity alone pulled the stream forward. Even today, several historic kahriz systems in Nakhchivan and Ordubad still supply cool water to gardens and stone fountains.',
      'Unlike modern electric pumps, a kahriz consumes no fuel and lasts for generations when cleaned regularly. Local engineers now restore these traditional networks to protect rural water supplies during hot summers.'
    ],
    trueFacts: [
      { text: 'Kahriz tunnels bring mountain water to dry villages underground.', ru: 'Подземные каналы кяхриз доставляют горную воду в засушливые сёла и сады.' },
      { text: 'Water moves through a kahriz naturally with the help of gravity.', ru: 'Во втором абзаце указано: «gravity alone pulled the stream forward».' },
      { text: 'Some ancient kahriz canals are still working in Nakhchivan and Ordubad.', ru: 'Несколько исторических систем кяхриз до сих пор снабжают водой сады в Нахчыване и Ордубаде.' },
      { text: 'Moving water underground prevents it from evaporating in the heat.', ru: 'Подземный поток не теряет ни капли из-за испарения (<i>without losing a drop to evaporation</i>).' }
    ],
    falseFacts: [
      { text: 'A kahriz needs powerful electric pumps to push water forward.', ruReason: 'В третьем абзаце сказано, что в отличие от электронасосов, кяхриз не расходует топливо/электричество.' },
      { text: 'Craftsmen dug kahriz tunnels on top of high mountains.', ruReason: 'Туннели прокладывались глубоко под поверхностью земли (<i>deep below the desert surface</i>).' },
      { text: 'All kahriz systems in Azerbaijan stopped working centuries ago.', ruReason: 'Некоторые системы в Нахчыване и Ордубаде действуют и сегодня.' },
      { text: 'A kahriz loses most of its water through fast evaporation.', ruReason: 'Напротив, подземный путь защищает воду от испарения.' },
      { text: 'Modern engineers plan to destroy traditional kahriz channels.', ruReason: 'Инженеры восстанавливают (<i>restore</i>) эти сети.' },
      { text: 'Building a kahriz could easily be done by a single untrained person.', ruReason: 'Строительство требовало высокого мастерства обученных мастеров и командной работы.' }
    ],
    mainIdeas: [
      { text: 'a traditional and eco-friendly water system', ru: 'текст описывает устройство, историю и ценность традиционных каналов кяхриз' },
      { text: 'ancient underground irrigation in dry regions', ru: 'главная тема — древние подземные водные каналы в засушливых регионах' }
    ],
    mainDistractors: [
      'modern electric pumps in big cities',
      'popular tourist monuments in Ordubad',
      'the dangers of working in mountain caves',
      'how to plant fruit orchards in winter',
      'expensive machines used by desert farmers',
      'the history of stone fountains in Europe'
    ],
    multiSets: [
      {
        prompt: 'A kahriz system … .',
        trueItems: [
          { text: 'operates without using any fuel or electricity', ru: 'работает без топлива (благодаря гравитации)' },
          { text: 'can serve communities for many generations if maintained', ru: 'служит поколениям при регулярной очистке' },
          { text: 'starts with a deep well near the hills', ru: 'мастера сначала выкапывали головной колодец у холмов' }
        ],
        falseItems: [
          { text: 'was invented only a few decades ago', ru: 'кяхриз используется уже много веков (<i>For centuries</i>)' },
          { text: 'brings salty ocean water to gardens', ru: 'система несёт чистую горную и грунтовую воду' },
          { text: 'never needs cleaning or restoration', ru: 'нуждается в регулярной очистке и восстановлении' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>Why do modern local engineers restore traditional kahriz networks?</i>',
        answer: 'They restore them to protect rural water supplies during hot summers.',
        rubric: '<ul><li><b>2 балла:</b> точно указана цель — защитить сельские запасы воды в жаркое лето.</li><li><b>1 балл:</b> смысл передан в общих чертах с неточностью или неполнотой.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение текста: «Local engineers now restore these traditional networks to <b>protect rural water supplies during hot summers</b>».',
        hint: 'Посмотрите самое последнее предложение текста.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Craftsmen connected vertical shafts along a measured slope so that … .</i>',
        answer: 'gravity alone pulled (would pull) the stream forward',
        rubric: '<ul><li><b>2 балла:</b> верно передана причина — сила тяжести сама двигала поток воды вперёд.</li><li><b>1 балл:</b> упоминается гравитация/течение воды, но с грамматической или лексической ошибкой.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Во втором абзаце: «...so <b>gravity alone pulled the stream forward</b>».',
        hint: 'Найдите во втором абзаце слова <i>vertical shafts</i>.'
      }
    ],
    adjItems: [
      { noun: 'fountains', adj: 'stone', sentence: 'Even today, several historic kahriz systems in Nakhchivan and Ordubad still supply cool water to gardens and <b>stone</b> fountains.', ruExplain: 'Слово <i>fountains</i> в тексте описывается прилагательным <b>stone</b> (каменные).' },
      { noun: 'skill', adj: 'remarkable', sentence: 'Building such a channel required <b>remarkable</b> skill and teamwork.', ruExplain: 'Существительное <i>skill</i> описывается единственным прилагательным <b>remarkable</b> (выдающееся мастерство).' }
    ]
  },
  {
    id: 'en-listen-bookbike',
    title: 'Аудирование (текст I): The Travelling Book Bike',
    paragraphs: [
      'Every Saturday morning, librarian Maya Lin rides a bright yellow cargo bicycle through quiet city parks. The front wooden box of her bike holds nearly eighty novels, picture books, and science magazines. Maya calls this cheerful project the Neighbourhood Book Bike, and her goal is to bring free reading to people who rarely visit public libraries.',
      'Whenever Maya stops near a playground or a bench, children quickly gather around the bicycle. Families can borrow up to three books without showing any library card or paying a deposit. Two weeks later, readers simply return the volumes to Maya on the same route or drop them off at any local branch.',
      'Since the project launched three years ago, hundreds of residents have borrowed stories outdoors. Maya believes that meeting readers in sunny parks makes reading feel like a friendly community adventure rather than a quiet duty.'
    ],
    trueFacts: [
      { text: 'Maya carries books around city parks on a yellow cargo bicycle.', ru: 'В первом абзаце указано: «rides a bright yellow cargo bicycle through quiet city parks».' },
      { text: 'People do not need a library card to borrow books from the bike.', ru: 'Во втором абзаце сказано: «without showing any library card or paying a deposit».' },
      { text: 'Readers are allowed to keep borrowed books for two weeks.', ru: 'Через две недели читатели возвращают книги Майе или в местное отделение.' },
      { text: 'Maya started her bicycle library project three years ago.', ru: 'В третьем абзаце указано: «Since the project launched three years ago...».' }
    ],
    falseFacts: [
      { text: 'Visitors must pay a small deposit before taking a book home.', ruReason: 'Читатели берут книги бесплатно и без залога (<i>without ... paying a deposit</i>).' },
      { text: 'Maya rides her book bike only on rainy winter evenings.', ruReason: 'Она выезжает каждое субботнее утро в солнечные парки.' },
      { text: 'The bicycle holds more than five hundred heavy textbooks.', ruReason: 'В деревянном ящике помещается около восьмидесяти (<i>nearly eighty</i>) книг и журналов.' },
      { text: 'Borrowers can only return books by mailing them to Maya.', ruReason: 'Книги возвращают лично Майе на том же маршруте или сдают в любой местный филиал.' },
      { text: 'Each family can borrow at least ten books at once.', ruReason: 'Семьи могут взять до трёх книг (<i>up to three books</i>).' },
      { text: 'Only professional librarians are interested in Maya’s bicycle.', ruReason: 'Вокруг велосипеда собираются дети и семьи жителей района.' }
    ],
    mainIdeas: [
      { text: 'a mobile library project on a bicycle', ru: 'текст рассказывает о передвижной библиотеке на грузовом велосипеде в городских парках' },
      { text: 'bringing free books directly to park visitors', ru: 'основная тема — доставка бесплатных книг жителям прямо в парки' }
    ],
    mainDistractors: [
      'how to repair old cargo bicycles',
      'reasons why public libraries are closing',
      'the best science magazines for teenagers',
      'strict rules for getting a library card',
      'Maya’s favourite childhood novels',
      'building wooden boxes for school playgrounds'
    ],
    multiSets: [
      {
        prompt: 'Through the Neighbourhood Book Bike, people can … .',
        trueItems: [
          { text: 'borrow novels and magazines free of charge', ru: 'брать книги бесплатно без карты и залога' },
          { text: 'return finished books at a neighbourhood library branch', ru: 'вернуть книги в любой местный филиал' },
          { text: 'take as many as three books per family', ru: 'взять до трёх книг на семью' }
        ],
        falseItems: [
          { text: 'buy rare science books at half price', ru: 'книги выдаются на время, а не продаются' },
          { text: 'read books only while standing next to the bench', ru: 'книги выдаются на две недели на дом' },
          { text: 'order books online for home delivery', ru: 'Майя развозит книги в парки, онлайн-заказ не упоминается' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What is Maya’s main goal with the Neighbourhood Book Bike?</i>',
        answer: 'Her goal is to bring free reading to people who rarely visit public libraries.',
        rubric: '<ul><li><b>2 балла:</b> точно названа цель — сделать бесплатное чтение доступным людям, редко посещающим библиотеки.</li><li><b>1 балл:</b> смысл понятен, но пропущена часть ответа или есть грамматическая ошибка.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение первого абзаца: «...her goal is to <b>bring free reading to people who rarely visit public libraries</b>».',
        hint: 'Прочитайте конец первого абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Maya believes that meeting readers in sunny parks makes reading feel like … .</i>',
        answer: 'a friendly community adventure rather than a quiet duty',
        rubric: '<ul><li><b>2 балла:</b> фраза завершена точно по смыслу («дружеское приключение сообщества, а не скучная обязанность»).</li><li><b>1 балл:</b> приведена только первая половина («дружеское приключение») без контраста или с ошибкой.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Последнее предложение текста: «...makes reading feel like <b>a friendly community adventure rather than a quiet duty</b>».',
        hint: 'Посмотрите заключительное предложение текста.'
      }
    ],
    adjItems: [
      { noun: 'duty', adj: 'quiet', sentence: 'Maya believes that meeting readers in sunny parks makes reading feel like a friendly community adventure rather than a <b>quiet</b> duty.', ruExplain: 'Слово <i>duty</i> в тексте описывается прилагательным <b>quiet</b> (тихая/скучная обязанность).' },
      { noun: 'branch', adj: 'local', sentence: 'Two weeks later, readers simply return the volumes to Maya on the same route or drop them off at any <b>local</b> branch.', ruExplain: 'Существительное <i>branch</i> (филиал библиотеки) в тексте описывается единственным прилагательным <b>local</b> (местный).' }
    ]
  },
  {
    id: 'en-listen-tern',
    title: 'Аудирование (текст I): The Amazing Flight of the Arctic Tern',
    paragraphs: [
      'Among all migrating birds on Earth, the Arctic tern completes the longest annual journey. Although this graceful seabird weighs less than an apple, it travels from the icy Arctic north all the way to Antarctica and back every single year. Scientists have measured round-trip flights of over seventy thousand kilometres.',
      'The birds take advantage of strong ocean winds to glide smoothly without wasting energy. Because they follow the changing seasons from pole to pole, Arctic terns experience two summers each year and enjoy more daylight than almost any other creature on the planet. During the trip, they dive into cold water to catch small fish and insects for fuel.',
      'Since an Arctic tern can live up to thirty years, a single bird may cover a distance equal to flying to the Moon and back several times during its lifetime.'
    ],
    trueFacts: [
      { text: 'The Arctic tern makes the longest yearly migration of any bird.', ru: 'В первом предложении указано, что полярная крачка совершает самое долгое ежегодное путешествие среди перелётных птиц.' },
      { text: 'Arctic terns enjoy two summers every year during their migration.', ru: 'Следуя за сменой времён года от полюса к полюсу, эти птицы переживают два лета в год.' },
      { text: 'Strong sea winds help the birds save energy while flying.', ru: 'Птицы используют сильные океанские ветры, чтобы планировать без лишней траты энергии.' },
      { text: 'An Arctic tern is a very light bird weighing less than an apple.', ru: 'В тексте сказано: «weighs less than an apple».' }
    ],
    falseFacts: [
      { text: 'Arctic terns spend the whole year in warm tropical forests.', ruReason: 'Птицы мигрируют между ледяной Арктикой и Антарктидой.' },
      { text: 'These seabirds travel less than seven hundred kilometres annually.', ruReason: 'Учёные зафиксировали перелёты более 70 000 км в оба конца.' },
      { text: 'Arctic terns eat only desert seeds during their journey.', ruReason: 'Во время перелёта они ловят мелкую рыбу и насекомых.' },
      { text: 'Most Arctic terns live for only two or three years.', ruReason: 'Полярная крачка может прожить до тридцати лет (<i>up to thirty years</i>).' },
      { text: 'Because of their heavy bodies, Arctic terns cannot glide on wind.', ruReason: 'Они весят меньше яблока и легко парят благодаря океанским ветрам.' },
      { text: 'Arctic terns prefer complete darkness to daylight.', ruReason: 'Они получают больше дневного света, чем почти любое другое существо.' }
    ],
    mainIdeas: [
      { text: 'the record-breaking migration of the Arctic tern', ru: 'весь текст посвящён рекордно длинной ежегодной миграции полярной крачки' },
      { text: 'a tiny seabird with an extraordinary yearly journey', ru: 'главная тема — удивительный перелёт крошечной морской птицы' }
    ],
    mainDistractors: [
      'how scientists weigh apples and seabirds',
      'why fish disappear in Antarctic oceans',
      'a competition between different Arctic animals',
      'the distance from Earth to the Moon',
      'why ocean winds are dangerous for ships',
      'how insects survive in cold northern waters'
    ],
    multiSets: [
      {
        prompt: 'Arctic terns … .',
        trueItems: [
          { text: 'fly between the Arctic and Antarctica each year', ru: 'летают из Арктики в Антарктиду и обратно каждый год' },
          { text: 'catch small fish in cold ocean waters for food', ru: 'ныряют в холодную воду за мелкой рыбой' },
          { text: 'can live for as long as three decades', ru: 'могут прожить до тридцати лет (three decades = 30 years)' }
        ],
        falseItems: [
          { text: 'avoid flying over open oceans', ru: 'они используют океанские ветры и ныряют в океан за рыбой' },
          { text: 'experience only winter weather all year', ru: 'благодаря перелётам между полюсами у них бывает два лета в год' },
          { text: 'travel in large groups only once every ten years', ru: 'перелёт происходит ежегодно (<i>every single year</i>)' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>How do Arctic terns avoid wasting energy during their long flight?</i>',
        answer: 'They take advantage of strong ocean winds to glide smoothly.',
        rubric: '<ul><li><b>2 балла:</b> точно указано использование сильных океанских ветров для плавного парения.</li><li><b>1 балл:</b> смысл верный («используют ветер»), но ответ слишком краткий или с неточностью.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Первое предложение второго абзаца: «The birds <b>take advantage of strong ocean winds to glide smoothly</b> without wasting energy».',
        hint: 'Посмотрите начало второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Over its thirty-year lifetime, an Arctic tern may cover a total distance equal to … .</i>',
        answer: 'flying to the Moon and back several times',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («полёту до Луны и обратно несколько раз»).</li><li><b>1 балл:</b> упомянут полёт до Луны, но упущено «и обратно» / «несколько раз».</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'В третьем абзаце: «...cover a distance equal to <b>flying to the Moon and back several times</b>».',
        hint: 'Прочитайте последний абзац текста.'
      }
    ],
    adjItems: [
      { noun: 'seabird', adj: 'graceful', sentence: 'Although this <b>graceful</b> seabird weighs less than an apple, it travels from the icy Arctic north all the way to Antarctica and back every single year.', ruExplain: 'Существительное <i>seabird</i> характеризуется единственным прилагательным <b>graceful</b> (грациозная).' },
      { noun: 'water', adj: 'cold', sentence: 'During the trip, they dive into <b>cold</b> water to catch small fish and insects for fuel.', ruExplain: 'Слово <i>water</i> в тексте описывается единственным прилагательным <b>cold</b> (холодная вода).' }
    ]
  },
  {
    id: 'en-listen-whale',
    title: 'Аудирование (текст I): Listening to Ocean Giants',
    paragraphs: [
      'Deep beneath the ocean waves, humpback whales communicate through complex series of musical sounds known as whale songs. Each song can last up to twenty minutes, and whales sometimes repeat the same melody for hours. Marine biologists record these underwater voices using sensitive microphones lowered from quiet research boats.',
      'Interestingly, all male whales in the same ocean region sing almost the exact same tune during a given winter. Every few years, however, new notes appear in the chorus, and the whole group gradually learns the updated melody. Scientists still debate the exact purpose of these songs, though many believe they help whales stay connected across vast distances.',
      'Because loud cargo ships can drown out natural ocean sounds, coastal countries are designing quieter propellers. Protecting underwater silence ensures that these gentle giants can continue to hear one another across the sea.'
    ],
    trueFacts: [
      { text: 'Humpback whales can repeat their musical melodies for hours.', ru: 'В первом абзаце указано: «whales sometimes repeat the same melody for hours».' },
      { text: 'Researchers use sensitive microphones to record whale songs underwater.', ru: 'Морские биологи опускают чувствительные микрофоны с исследовательских лодок.' },
      { text: 'Whale songs gradually change as new notes enter the melody.', ru: 'Каждые несколько лет в песне появляются новые ноты, и группа разучивает обновлённую мелодию.' },
      { text: 'Noise from large ships can interfere with whale communication.', ru: 'Громкие грузовые суда заглушают естественные звуки океана.' }
    ],
    falseFacts: [
      { text: 'Every humpback whale sings a completely different tune from its neighbours.', ruReason: 'Все самцы в одном океанском регионе поют почти одинаковую мелодию.' },
      { text: 'Whale melodies never change from one decade to the next.', ruReason: 'Каждые несколько лет мелодия постепенно обновляется новыми нотами.' },
      { text: 'Scientists already know every single reason why whales sing.', ruReason: 'Учёные до сих пор спорят о точном назначении этих песен (<i>still debate</i>).' },
      { text: 'Marine biologists record whale voices from noisy airplanes.', ruReason: 'Запись ведётся с помощью микрофонов, опущенных с тихих исследовательских лодок.' },
      { text: 'A typical whale song lasts only three seconds.', ruReason: 'Одна песня может длиться до двадцати минут.' },
      { text: 'Cargo ships help whales hear one another better.', ruReason: 'Шум грузовых судов, напротив, заглушает звуки океана.' }
    ],
    mainIdeas: [
      { text: 'the musical songs and communication of humpback whales', ru: 'текст посвящён песням горбатых китов, их изучению и защите от шума судов' },
      { text: 'how whales sing and why ocean silence matters', ru: 'главная идея — подводное общение горбатых китов и необходимость тишины в океане' }
    ],
    mainDistractors: [
      'how to build large cargo ships quickly',
      'dangerous storms near coastal countries',
      'what humpback whales eat during winter',
      'the history of microphones in music studios',
      'how sailors navigate without maps',
      'why research boats are faster than cargo ships'
    ],
    multiSets: [
      {
        prompt: 'According to marine biologists, humpback whales … .',
        trueItems: [
          { text: 'share a similar song within the same ocean region', ru: 'самцы в одном регионе исполняют почти одинаковую мелодию' },
          { text: 'update their melodies over the course of several years', ru: 'раз в несколько лет перенимают новые ноты' },
          { text: 'may use songs to keep in touch over long distances', ru: 'многие учёные считают, что песни помогают поддерживать связь на больших расстояниях' }
        ],
        falseItems: [
          { text: 'stop singing whenever research boats are near', ru: 'биологи спокойно записывают их голоса с тихих исследовательских лодок' },
          { text: 'produce songs only when they are out of the water', ru: 'песни звучат глубоко под водой' },
          { text: 'prefer swimming near loud ship propellers', ru: 'шум винтов мешает китам слышать друг друга' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>How do marine biologists record whale songs?</i>',
        answer: 'They use sensitive microphones lowered from quiet research boats.',
        rubric: '<ul><li><b>2 балла:</b> точно указаны чувствительные микрофоны, опущенные с тихих исследовательских судов.</li><li><b>1 балл:</b> упомянуты микрофоны без деталей или с мелкой ошибкой.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение первого абзаца: «Marine biologists record these underwater voices using <b>sensitive microphones lowered from quiet research boats</b>».',
        hint: 'Найдите в первом абзаце глагол <i>record</i>.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Coastal countries are designing quieter propellers because … .</i>',
        answer: 'loud cargo ships can drown out natural ocean sounds',
        rubric: '<ul><li><b>2 балла:</b> точно указана причина — шумные грузовые суда заглушают естественные звуки океана.</li><li><b>1 балл:</b> общий смысл («чтобы киты слышали друг друга / уменьшить шум судов») передан неточно.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'В третьем абзаце прямо указана причина: «Because <b>loud cargo ships can drown out natural ocean sounds</b>, coastal countries are designing quieter propellers».',
        hint: 'Посмотрите первое предложение третьего абзаца.'
      }
    ],
    adjItems: [
      { noun: 'microphones', adj: 'sensitive', sentence: 'Marine biologists record these underwater voices using <b>sensitive</b> microphones lowered from quiet research boats.', ruExplain: 'Слово <i>microphones</i> описывается прилагательным <b>sensitive</b> (чувствительные).' },
      { noun: 'silence', adj: 'underwater', sentence: 'Protecting <b>underwater</b> silence ensures that these gentle giants can continue to hear one another across the sea.', ruExplain: 'Слово <i>silence</i> характеризуется прилагательным <b>underwater</b> (подводная тишина).' }
    ]
  },
  {
    id: 'en-listen-solar',
    title: 'Аудирование (текст I): Clean Water from Sunlight',
    paragraphs: [
      'Many sunny coastal towns face a surprising problem: although they sit beside vast oceans, drinking water is scarce. Turning salty seawater into fresh water usually demands huge factories and large amounts of electricity. Recently, however, a team of young engineers created a compact solar device that purifies seawater using only sunlight.',
      'The invention looks like a floating dark sponge inside a clear dome. When sunlight warms the sponge, fresh water evaporates upward, collects on the cool glass cover, and drips cleanly into a storage bottle. Meanwhile, the leftover salt stays behind and can be washed away easily at dusk. A single panel provides enough safe drinking water for one family every day.',
      'Because the device is affordable and requires no fuel, aid groups plan to deliver hundreds of units to remote island schools this autumn.'
    ],
    trueFacts: [
      { text: 'Traditional seawater treatment plants normally need a lot of electricity.', ru: 'В первом абзаце сказано, что обычное опреснение требует огромных заводов и большого количества электроэнергии.' },
      { text: 'The new solar device runs purely on energy from the sun.', ru: 'Устройство очищает морскую воду, используя только солнечный свет (<i>using only sunlight</i>).' },
      { text: 'One unit can supply a family with daily drinking water.', ru: 'Во втором абзаце: «A single panel provides enough safe drinking water for one family every day».' },
      { text: 'Salt remains behind while fresh vapour rises to the glass cover.', ru: 'Пар поднимается к прохладному стеклу, а соль остаётся позади.' }
    ],
    falseFacts: [
      { text: 'Coastal towns rarely have any trouble finding clean drinking water.', ruReason: 'Многие солнечные прибрежные города испытывают нехватку питьевой воды (<i>drinking water is scarce</i>).' },
      { text: 'The solar sponge mixes salt directly into the storage bottle.', ruReason: 'Соль остаётся внизу и смывается вечером, а в бутыль капает пресная вода.' },
      { text: 'Each device costs too much for small island schools to use.', ruReason: 'Устройство доступно по цене (<i>affordable</i>), и гуманитарные группы доставят сотни штук в островные школы.' },
      { text: 'The invention works only at night when the air is cold.', ruReason: 'Для испарения воды устройство нагревается солнечным светом.' },
      { text: 'A single panel produces enough water for an entire city.', ruReason: 'Одна панель обеспечивает суточную норму для одной семьи (<i>for one family</i>).' },
      { text: 'The compact device must be plugged into a fuel generator.', ruReason: 'Устройство не требует никакого топлива (<i>requires no fuel</i>).' }
    ],
    mainIdeas: [
      { text: 'a simple solar invention for purifying seawater', ru: 'текст описывает компактное солнечное устройство для опреснения морской воды' },
      { text: 'producing fresh drinking water with sunlight', ru: 'главная идея — получение питьевой воды из морской с помощью солнечного света' }
    ],
    mainDistractors: [
      'building giant electric factories near mountains',
      'why salty food is unhealthy for students',
      'the history of glass domes in ancient architecture',
      'how to collect rainwater during autumn storms',
      'dangerous animals living near island schools',
      'problems with plastic storage bottles'
    ],
    multiSets: [
      {
        prompt: 'The new solar purifier … .',
        trueItems: [
          { text: 'was developed by a group of young engineers', ru: 'создано командой молодых инженеров' },
          { text: 'is inexpensive and operates without fuel', ru: 'оно доступно по цене и не требует топлива' },
          { text: 'collects condensed drops on a cool glass dome', ru: 'чистые капли собираются на прохладной стеклянной крышке' }
        ],
        falseItems: [
          { text: 'uses large amounts of coal to boil the ocean', ru: 'работает исключительно от солнечного света' },
          { text: 'is too heavy to transport to remote islands', ru: 'оно компактное, и сотни штук доставят на удалённые острова' },
          { text: 'leaves dangerous chemicals inside the bottle', ru: 'даёт безопасную питьевую воду (<i>safe drinking water</i>)' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What happens to the leftover salt in the solar device?</i>',
        answer: 'It stays behind and can be washed away easily at dusk.',
        rubric: '<ul><li><b>2 балла:</b> точно указано, что соль остаётся внутри и её легко смыть на закате/вечером.</li><li><b>1 балл:</b> указано только «остаётся позади» без пояснения или с ошибкой.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Во втором абзаце сказано: «Meanwhile, the leftover salt <b>stays behind and can be washed away easily at dusk</b>».',
        hint: 'Посмотрите предпоследнее предложение второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Aid groups plan to send hundreds of solar units to remote island schools because the device … .</i>',
        answer: 'is affordable and requires no fuel',
        rubric: '<ul><li><b>2 балла:</b> приведены обе причины — доступная цена и отсутствие необходимости в топливе.</li><li><b>1 балл:</b> названа лишь одна причина или допущена грамматическая неточность.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Последнее предложение текста: «Because the device <b>is affordable and requires no fuel</b>, aid groups plan to deliver hundreds of units...».',
        hint: 'Обратитесь к третьему абзацу.'
      }
    ],
    adjItems: [
      { noun: 'problem', adj: 'surprising', sentence: 'Many sunny coastal towns face a <b>surprising</b> problem: although they sit beside vast oceans, drinking water is scarce.', ruExplain: 'Слово <i>problem</i> в первом предложении описывается единственным прилагательным <b>surprising</b> (удивительная проблема).' },
      { noun: 'oceans', adj: 'vast', sentence: 'Many sunny coastal towns face a surprising problem: although they sit beside <b>vast</b> oceans, drinking water is scarce.', ruExplain: 'Слово <i>oceans</i> характеризуется единственным прилагательным <b>vast</b> (обширные океаны).' }
    ]
  },
  {
    id: 'en-listen-rooftop',
    title: 'Аудирование (текст I): Honeybees Above the City',
    paragraphs: [
      'Walk onto the roof of an office tower in central Vienna, and you may hear a gentle buzzing sound. Hundreds of wooden beehives now sit peacefully above busy city streets. Urban beekeeping has become a popular hobby as well as a practical way to protect honeybee populations.',
      'Surprisingly, city bees often produce more honey than bees in the countryside. Urban parks, balconies, and avenue trees bloom at different months, giving insects a steady variety of flowers from spring until late autumn. Moreover, city gardens rarely use strong chemical sprays, which makes rooftops a safer home for colonies.',
      'Local schools even organize rooftop workshops where teenagers wear protective suits and taste warm honey straight from the frame. Through these visits, students learn that small green spaces in cities can support rich wildlife.'
    ],
    trueFacts: [
      { text: 'Beekeepers in Vienna place wooden hives on the roofs of tall buildings.', ru: 'В первом абзаце говорится о сотнях деревянных ульев на крыше офисной башни в центре Вены.' },
      { text: 'City parks provide bees with flowers across several seasons.', ru: 'Городские парки, балконы и деревья цветут в разные месяцы с весны до поздней осени.' },
      { text: 'Urban gardens generally avoid using strong chemical sprays.', ru: 'Во втором абзаце: «city gardens rarely use strong chemical sprays».' },
      { text: 'Teenagers visit rooftop hives during special school workshops.', ru: 'Местные школы организуют мастер-классы на крышах для подростков.' }
    ],
    falseFacts: [
      { text: 'Countryside bees always produce far more honey than urban bees.', ruReason: 'Наоборот, городские пчёлы часто дают больше мёда (<i>more honey than bees in the countryside</i>).' },
      { text: 'City bees can find flowers only for two weeks in May.', ruReason: 'Разнообразные растения цветут с весны до поздней осени.' },
      { text: 'Students are forbidden from wearing protective suits near the hives.', ruReason: 'Подростки надевают защитные костюмы (<i>wear protective suits</i>) на занятиях.' },
      { text: 'Strong chemical sprays make city rooftops dangerous for bees.', ruReason: 'В городе такие химикаты применяются редко, поэтому крыши безопаснее.' },
      { text: 'Urban beekeeping is illegal in central Vienna.', ruReason: 'Оно стало популярным хобби и практикой в центре Вены.' },
      { text: 'Office workers keep bees inside crowded conference rooms.', ruReason: 'Ульи стоят на крышах зданий (<i>on the roof</i>), а не в кабинетах.' }
    ],
    mainIdeas: [
      { text: 'the growth and benefits of urban beekeeping', ru: 'текст рассказывает о городском пчеловодстве на крышах и его пользе для пчёл и жителей' },
      { text: 'how city rooftops help protect honeybees', ru: 'основная тема — защита пчёл и сбор мёда на городских крышах' }
    ],
    mainDistractors: [
      'why office buildings in Vienna are so tall',
      'how to bake desserts with autumn honey',
      'the dangers of walking through crowded streets',
      'chemical factories near countryside farms',
      'why teenagers dislike science workshops',
      'the history of wooden furniture in Austria'
    ],
    multiSets: [
      {
        prompt: 'City bees often thrive on rooftops because … .',
        trueItems: [
          { text: 'urban plants flower from spring through late autumn', ru: 'городские растения цветут с весны до поздней осени' },
          { text: 'city gardens seldom use harsh chemical sprays', ru: 'в городских садах редко применяются сильные химикаты' },
          { text: 'they enjoy a steady mix of blossoms in parks and balconies', ru: 'парки и балконы дают стабильное разнообразие цветов' }
        ],
        falseItems: [
          { text: 'beekeepers feed them warm sugar every winter afternoon', ru: 'в тексте не упоминается подкормка сахаром зимой' },
          { text: 'office towers keep snow off the hives all year', ru: 'про снег ничего не сказано' },
          { text: 'there are no birds or insects in modern cities', ru: 'небольшие зелёные зоны поддерживают богатую дикую природу' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What do teenagers learn through the rooftop workshops?</i>',
        answer: 'They learn that small green spaces in cities can support rich wildlife.',
        rubric: '<ul><li><b>2 балла:</b> точно передана мысль о том, что даже небольшие зелёные зоны в городах поддерживают богатое разнообразие природы.</li><li><b>1 балл:</b> смысл верен в общих чертах, но с пропуском деталей.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение текста: «Through these visits, students learn that <b>small green spaces in cities can support rich wildlife</b>».',
        hint: 'Прочитайте заключительное предложение текста.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>During school rooftop visits, teenagers put on protective suits and … .</i>',
        answer: 'taste warm honey straight from the frame',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («пробуют тёплый мёд прямо из рамки»).</li><li><b>1 балл:</b> указано «пробуют мёд» с упущением деталей или мелкой ошибкой.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'В третьем абзаце сказано: «...teenagers wear protective suits and <b>taste warm honey straight from the frame</b>».',
        hint: 'Посмотрите первое предложение третьего абзаца.'
      }
    ],
    adjItems: [
      { noun: 'hobby', adj: 'popular', sentence: 'Urban beekeeping has become a <b>popular</b> hobby as well as a practical way to protect honeybee populations.', ruExplain: 'Существительное <i>hobby</i> в тексте описывает единственное прилагательное <b>popular</b> (популярное).' },
      { noun: 'suits', adj: 'protective', sentence: 'Local schools even organize rooftop workshops where teenagers wear <b>protective</b> suits and taste warm honey straight from the frame.', ruExplain: 'Существительное <i>suits</i> описывается единственным прилагательным <b>protective</b> (защитные).' }
    ]
  },
  {
    id: 'en-listen-braille',
    title: 'Аудирование (текст I): Touching Stories at the Tactile Museum',
    paragraphs: [
      'Most art museums ask visitors not to touch the exhibits, yet a special gallery in Madrid welcomes guests with open hands. The Tiflological Museum was founded to let blind and partially sighted visitors experience architecture, sculpture, and painting through touch.',
      'Inside the bright rooms, guests can gently run their fingers over detailed scale models of famous monuments such as the Eiffel Tower, the Taj Mahal, and the Roman Colosseum. Trained guides also provide Braille booklets and audio descriptions so everyone can follow the history behind each model. Even sighted visitors are often invited to put on blindfolds for a few minutes to understand how touch reveals texture, shape, and proportion.',
      'By turning art into an experience for the fingertips, this remarkable museum proves that culture should remain accessible to every member of society.'
    ],
    trueFacts: [
      { text: 'Visitors at the museum in Madrid are encouraged to touch the displays.', ru: 'В отличие от обычных музеев, эта галерея позволяет трогать экспонаты руками.' },
      { text: 'The museum offers scale models of world-famous landmarks.', ru: 'Гости могут ощупать подробные масштабные модели Эйфелевой башни, Тадж-Махала и Колизея.' },
      { text: 'Both Braille booklets and audio guides help explain each exhibit.', ru: 'Во втором абзаце указаны «Braille booklets and audio descriptions».' },
      { text: 'Sighted guests sometimes wear blindfolds while exploring the models.', ru: 'Зрячим посетителям иногда предлагают надеть повязки на глаза на несколько минут.' }
    ],
    falseFacts: [
      { text: 'Guards strictly punish anyone who touches the sculptures in Madrid’s Tiflological Museum.', ruReason: 'Именно этот музей создан, чтобы люди могли познавать искусство через прикосновение.' },
      { text: 'Only huge full-sized buildings are kept inside the exhibition rooms.', ruReason: 'В залах представлены уменьшенные масштабные модели (<i>scale models</i>).' },
      { text: 'The museum provides no written or spoken explanations for guests.', ruReason: 'Опытные гиды предоставляют брошюры со шрифтом Брайля и аудиоописания.' },
      { text: 'Sighted visitors are not allowed to enter the Tiflological Museum.', ruReason: 'Зрячие гости тоже приходят туда и даже пробуют надевать повязки.' },
      { text: 'The gallery displays only modern digital photographs.', ruReason: 'Там выставлены объёмные модели памятников, скульптуры и тактильные картины.' },
      { text: 'Guests must visit the museum in complete darkness without guides.', ruReason: 'В светлых залах работают подготовленные экскурсоводы (<i>trained guides</i>).' }
    ],
    mainIdeas: [
      { text: 'a museum designed to be explored through touch', ru: 'весь текст посвящён музею в Мадриде, где искусство познаётся на ощупь' },
      { text: 'making world culture accessible to blind visitors', ru: 'основная тема — доступность архитектуры и искусства для незрячих людей' }
    ],
    mainDistractors: [
      'how the Eiffel Tower was built in Paris',
      'why tourists should never touch ancient paintings',
      'a training course for Spanish tour guides',
      'the invention of the Braille alphabet in France',
      'how to build small wooden models at home',
      'the history of architecture in Rome and India'
    ],
    multiSets: [
      {
        prompt: 'At the Tiflological Museum in Madrid, … .',
        trueItems: [
          { text: 'blind guests can explore monuments with their hands', ru: 'незрячие гости могут изучать памятники на ощупь' },
          { text: 'visitors can listen to audio descriptions of the exhibits', ru: 'посетителям доступны аудиоописания' },
          { text: 'sighted people may try wearing blindfolds temporarily', ru: 'зрячие гости могут на несколько минут надеть повязки' }
        ],
        falseItems: [
          { text: 'visitors are forbidden from asking guides for help', ru: 'обученные гиды активно помогают гостям и раздают буклеты' },
          { text: 'all models are kept locked behind glass walls', ru: 'модели открыты для прикосновений' },
          { text: 'only paintings from Madrid are represented', ru: 'представлены знаменитые памятники мира (Париж, Индия, Рим)' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>Why are sighted visitors sometimes invited to wear blindfolds at the museum?</i>',
        answer: 'They wear them to understand how touch reveals texture, shape, and proportion.',
        rubric: '<ul><li><b>2 балла:</b> точно указана цель — понять, как осязание раскрывает фактуру, форму и пропорции.</li><li><b>1 балл:</b> смысл верный («почувствовать, каково изучать на ощупь»), но не названы детали.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'В конце второго абзаца: «...to <b>understand how touch reveals texture, shape, and proportion</b>».',
        hint: 'Прочитайте последнее предложение второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>By turning art into an experience for the fingertips, this museum proves that culture … .</i>',
        answer: 'should remain accessible to every member of society',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («культура должна оставаться доступной каждому члену общества»).</li><li><b>1 балл:</b> смысл верен, но фраза неполная или с ошибкой.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Заключение текста: «...proves that culture <b>should remain accessible to every member of society</b>».',
        hint: 'Посмотрите последнее предложение текста.'
      }
    ],
    adjItems: [
      { noun: 'gallery', adj: 'special', sentence: 'Most art museums ask visitors not to touch the exhibits, yet a <b>special</b> gallery in Madrid welcomes guests with open hands.', ruExplain: 'Слово <i>gallery</i> в первом предложении описывается единственным прилагательным <b>special</b> (особая).' },
      { noun: 'rooms', adj: 'bright', sentence: 'Inside the <b>bright</b> rooms, guests can gently run their fingers over detailed scale models of famous monuments...', ruExplain: 'Слово <i>rooms</i> характеризует единственное прилагательное <b>bright</b> (светлые).' }
    ]
  },
  {
    id: 'en-listen-kelaghayi',
    title: 'Аудирование (текст I): The Silk Scarves of Basgal',
    paragraphs: [
      'In the mountain village of Basgal in Azerbaijan, traditional silk scarves called kelaghayi have been crafted for centuries. Unlike ordinary factory textiles, each authentic kelaghayi is printed by hand using carved wooden stamps dipped in natural dyes.',
      'Local master weavers first boil fine silk threads to make the fabric light and smooth. Next, they press floral and geometric patterns onto the cloth with pearwood blocks, covering specific areas with warm wax before each dye bath. Because the wax protects the cloth from colour, delicate white or golden motifs appear against rich shades of blue, red, and pomegranate.',
      'Today, younger artisans learn this patient craft alongside elderly masters, and UNESCO has recognized Azerbaijani kelaghayi artistry as part of humanity’s intangible cultural heritage.'
    ],
    trueFacts: [
      { text: 'Artisans in Basgal make kelaghayi scarves using hand-carved wooden stamps.', ru: 'В первом абзаце указано: каждый подлинный кялагаи печатается вручную резными деревянными штампами.' },
      { text: 'Natural dyes and warm wax help create patterns on the silk cloth.', ru: 'Мастера используют натуральные красители и тёплый воск для создания узоров.' },
      { text: 'UNESCO has honoured traditional kelaghayi craftsmanship.', ru: 'В третьем абзаце отмечено признание ЮНЕСКО нематериальным культурным наследием.' },
      { text: 'Young craftsmen continue to study this traditional art from older masters.', ru: 'Молодые ремесленники обучаются ремеслу рядом со старшими мастерами.' }
    ],
    falseFacts: [
      { text: 'Kelaghayi scarves are produced quickly by modern plastic machines.', ruReason: 'Настоящий кялагаи изготавливается вручную, а не на обычных фабричных станках.' },
      { text: 'Warm wax is painted onto the silk only after all dyeing is finished.', ruReason: 'Воск наносят перед каждым окрашиванием (<i>before each dye bath</i>), чтобы защитить узор.' },
      { text: 'The tradition of making kelaghayi in Basgal started only ten years ago.', ruReason: 'Это ремесло существует в Басгале уже несколько веков (<i>for centuries</i>).' },
      { text: 'Only plain white scarves without patterns are produced in Basgal.', ruReason: 'На ткань наносятся цветочные и геометрические узоры с яркими оттенками синего, красного и гранатового.' },
      { text: 'Elderly masters refuse to teach younger workers how to weave silk.', ruReason: 'Молодые мастера обучаются ремеслу вместе с пожилыми мастерами.' },
      { text: 'The craftsmen boil wool threads to make heavy winter coats.', ruReason: 'Они отваривают тонкие шёлковые нити, чтобы ткань стала лёгкой и гладкой.' }
    ],
    mainIdeas: [
      { text: 'the traditional handmade art of Azerbaijani kelaghayi', ru: 'весь текст посвящён традиционному ручному искусству азербайджанского кялагаи' },
      { text: 'how artisans craft traditional silk scarves in Basgal', ru: 'основная тема — технология и сохранение производства шёлковых платков в Басгале' }
    ],
    mainDistractors: [
      'how to grow pomegranate trees in mountain villages',
      'why wooden furniture from pearwood is expensive',
      'modern fashion factories in European capitals',
      'how UNESCO protects ancient stone castles',
      'different ways to wash silk clothes at home',
      'the history of tea traditions in Azerbaijan'
    ],
    multiSets: [
      {
        prompt: 'During the making of an authentic kelaghayi, weavers … .',
        trueItems: [
          { text: 'boil delicate silk threads to soften the fabric', ru: 'отваривают тонкие шёлковые нити для гладкости и лёгкости' },
          { text: 'apply warm wax to shield patterns from dye', ru: 'наносят тёплый воск, защищая узоры от красителя' },
          { text: 'stamp floral and geometric shapes onto the cloth', ru: 'наносят цветочные и геометрические орнаменты деревянными формами' }
        ],
        falseItems: [
          { text: 'use synthetic chemicals instead of natural dyes', ru: 'в тексте прямо указаны натуральные красители (<i>natural dyes</i>)' },
          { text: 'cut the scarves out of thick cotton sheets', ru: 'материал — тонкий шёлк (<i>fine silk</i>)' },
          { text: 'send every piece abroad before adding any colour', ru: 'все этапы окрашивания проходят у мастеров на месте' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>Why do weavers cover parts of the silk cloth with warm wax before dyeing?</i>',
        answer: 'They do it because the wax protects the cloth from colour (so motifs appear).',
        rubric: '<ul><li><b>2 балла:</b> точно указано: воск защищает участки ткани от краски, позволяя проявиться узорам.</li><li><b>1 балл:</b> смысл верный («чтобы получился узор / не окрасилось»), но неточный или неполный.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Во втором абзаце: «Because <b>the wax protects the cloth from colour</b>, delicate white or golden motifs appear...».',
        hint: 'Посмотрите последнее предложение второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Local master weavers first boil fine silk threads in order to … .</i>',
        answer: 'make the fabric light and smooth',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («сделать ткань лёгкой и гладкой»).</li><li><b>1 балл:</b> названо только одно свойство (<i>light</i> или <i>smooth</i>) или есть грамматическая ошибка.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Первое предложение второго абзаца: «...boil fine silk threads to <b>make the fabric light and smooth</b>».',
        hint: 'Посмотрите начало второго абзаца.'
      }
    ],
    adjItems: [
      { noun: 'craft', adj: 'patient', sentence: 'Today, younger artisans learn this <b>patient</b> craft alongside elderly masters, and UNESCO has recognized Azerbaijani kelaghayi artistry...', ruExplain: 'Слово <i>craft</i> (ремесло) описывается прилагательным <b>patient</b> (терпеливое/кропотливое).' },
      { noun: 'village', adj: 'mountain', sentence: 'In the <b>mountain</b> village of Basgal in Azerbaijan, traditional silk scarves called kelaghayi have been crafted for centuries.', ruExplain: 'Слово <i>village</i> описывается прилагательным <b>mountain</b> (горное).' }
    ]
  },
  {
    id: 'en-listen-darksky',
    title: 'Аудирование (текст I): Protecting the Starry Night Sky',
    paragraphs: [
      'Most city residents today rarely see the Milky Way because bright streetlights and glowing billboards fill the night sky with orange haze. Scientists call this problem light pollution, and it affects not only astronomers but also night-flying birds and sleeping humans.',
      'To preserve natural darkness, several communities have created Dark Sky Reserves. In these protected areas, towns replace harsh lamps with shielded streetlights that point straight downward instead of shining upward into the clouds. Shops also switch off unnecessary decorative lights after midnight. Within months, thousands of faint stars return to view, and local tourism grows as stargazers travel there with telescopes.',
      'Simple steps like choosing softer bulbs show that people can keep streets safe at night without erasing the beauty of the universe above.'
    ],
    trueFacts: [
      { text: 'Bright outdoor lights prevent many urban residents from seeing the Milky Way.', ru: 'В первом абзаце сказано, что уличные фонари и вывески создают оранжевую дымку и скрывают Млечный Путь.' },
      { text: 'Light pollution can disturb migrating birds as well as human sleep.', ru: 'Она влияет не только на астрономов, но и на птиц, летающих ночью, и спящих людей.' },
      { text: 'Shielded streetlights in Dark Sky Reserves direct light toward the ground.', ru: 'Во втором абзаце: «shielded streetlights that point straight downward».' },
      { text: 'Reducing night glare brings more visitors with telescopes to reserve towns.', ru: 'Местный туризм растёт, так как любители звёздного неба приезжают туда с телескопами.' }
    ],
    falseFacts: [
      { text: 'Dark Sky Reserves turn off every streetlamp completely after sunset.', ruReason: 'Улицы остаются освещёнными и безопасными, но используют экранированные лампы, направленные вниз.' },
      { text: 'Light pollution affects only professional astronomers in observatories.', ruReason: 'Оно также вредит ночным птицам и сну людей.' },
      { text: 'Towns in protected zones install brighter upward-facing billboards.', ruReason: 'Наоборот, декоративное освещение выключают после полуночи, а фонари направляют вниз.' },
      { text: 'Creating a Dark Sky Reserve harms local tourism.', ruReason: 'Напротив, местный туризм начинает расти.' },
      { text: 'Even after changing lamps, stars remain invisible in protected towns.', ruReason: 'Уже через несколько месяцев тысячи тусклых звёзд снова становятся видны.' },
      { text: 'Scientists recommend keeping decorative shop lights on all night.', ruReason: 'Магазины отключают лишние декоративные огни после полуночи.' }
    ],
    mainIdeas: [
      { text: 'reducing light pollution to protect starry skies', ru: 'текст описывает проблему светового загрязнения и создание заповедников тёмного неба' },
      { text: 'how Dark Sky Reserves bring back natural night darkness', ru: 'основная идея — простые меры защиты ночного неба в заповедниках тёмного неба' }
    ],
    mainDistractors: [
      'how to buy your first telescope for home use',
      'why bright billboards help city shops earn money',
      'a new kind of solar battery for astronomers',
      'the safest way to repair broken streetlights',
      'why migrating birds avoid flying near cities',
      'the names of planets in the Milky Way'
    ],
    multiSets: [
      {
        prompt: 'In Dark Sky Reserves, communities … .',
        trueItems: [
          { text: 'aim shielded streetlamps downward at the pavement', ru: 'направляют свет экранированных фонарей строго вниз' },
          { text: 'turn off extra decorative shop lighting late at night', ru: 'выключают лишние декоративные огни после полуночи' },
          { text: 'attract stargazers who want to observe faint stars', ru: 'привлекают туристов с телескопами' }
        ],
        falseItems: [
          { text: 'ban all tourists from entering the town after dark', ru: 'туризм, напротив, растёт' },
          { text: 'leave streets completely dark and unsafe', ru: 'улицы остаются безопасными благодаря правильному освещению' },
          { text: 'wait twenty years before seeing any stars return', ru: 'звёзды возвращаются в пределах нескольких месяцев (<i>Within months</i>)' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>Why do most city residents rarely see the Milky Way?</i>',
        answer: 'Because bright streetlights and glowing billboards fill the night sky with orange haze.',
        rubric: '<ul><li><b>2 балла:</b> точно названа причина (яркие уличные фонари и светящиеся щиты создают световую дымку).</li><li><b>1 балл:</b> ответ краток («из-за светового загрязнения / фонарей») без деталей.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Первое предложение текста: «...because <b>bright streetlights and glowing billboards fill the night sky with orange haze</b>».',
        hint: 'Посмотрите первое предложение первого абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Simple actions like using softer bulbs prove that towns can keep streets safe without … .</i>',
        answer: 'erasing the beauty of the universe above',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («не стирая красоту вселенной над нами»).</li><li><b>1 балл:</b> общий смысл передан («не закрывая звёзды»), но формулировка расходится с текстом.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Последнее предложение текста: «...without <b>erasing the beauty of the universe above</b>».',
        hint: 'Прочитайте заключительное предложение текста.'
      }
    ],
    adjItems: [
      { noun: 'haze', adj: 'orange', sentence: '...because bright streetlights and glowing billboards fill the night sky with <b>orange</b> haze.', ruExplain: 'Существительное <i>haze</i> (дымка) описывается единственным прилагательным <b>orange</b> (оранжевая).' },
      { noun: 'darkness', adj: 'natural', sentence: 'To preserve <b>natural</b> darkness, several communities have created Dark Sky Reserves.', ruExplain: 'Слово <i>darkness</i> описывается прилагательным <b>natural</b> (естественная темнота).' }
    ]
  },
  {
    id: 'en-listen-ecobrick',
    title: 'Аудирование (текст I): Turning Plastic Waste into Classrooms',
    paragraphs: [
      'In many rural villages, single-use plastic wrappers often pile up along riverbanks because recycling trucks rarely reach distant areas. To solve this environmental challenge, a group of community builders came up with an unusual building material known as an eco-brick.',
      'Creating an eco-brick requires patience rather than expensive machinery. Volunteers wash and dry discarded plastic bags, wrappers, and straws, then pack them tightly inside clean plastic bottles using a wooden stick. Once a bottle becomes as firm as a solid stone, workers stack hundreds of them together with clay or cement to construct sturdy walls.',
      'Over the past five years, local parents and students have used thousands of these colourful bottles to build village classrooms, library benches, and garden fences. The creative method keeps rivers clean while providing safe learning spaces for children.'
    ],
    trueFacts: [
      { text: 'Rural villages often lack regular visits from recycling trucks.', ru: 'В первом абзаце сказано: «recycling trucks rarely reach distant areas».' },
      { text: 'Workers pack clean dry plastic tightly into bottles to make eco-bricks.', ru: 'Во втором абзаце описано плотное набивание чистого сухого пластика в бутылки.' },
      { text: 'Eco-bricks are joined with clay or cement to form strong walls.', ru: 'Бутылки укладывают с глиной или цементом, создавая прочные стены.' },
      { text: 'Students and parents have already built classrooms out of eco-bricks.', ru: 'В третьем абзаце: «used thousands of these colourful bottles to build village classrooms...».' }
    ],
    falseFacts: [
      { text: 'Making an eco-brick requires large and costly industrial machines.', ruReason: 'Во втором абзаце прямо сказано: «requires patience rather than expensive machinery».' },
      { text: 'Volunteers fill the bottles with wet leaves and muddy river water.', ruReason: 'Пластиковые отходы предварительно моют и высушивают (<i>wash and dry</i>).' },
      { text: 'Eco-bricks are too soft to support any walls or benches.', ruReason: 'Плотно набитая бутылка становится твёрдой, как камень, и образует прочные стены.' },
      { text: 'Only professional architects are allowed to pack plastic into bottles.', ruReason: 'Этим занимаются добровольцы, местные родители и школьники.' },
      { text: 'Eco-brick projects have increased plastic pollution in local rivers.', ruReason: 'Напротив, этот метод помогает очищать реки от пластика.' },
      { text: 'People melt plastic bottles over open fires to shape square bricks.', ruReason: 'Бутылки не плавятся, а плотно набиваются сухим пластиком деревянной палкой.' }
    ],
    mainIdeas: [
      { text: 'reusing plastic waste to construct useful buildings', ru: 'текст описывает превращение пластикового мусора в экокирпичи для строительства школ' },
      { text: 'an eco-friendly building solution made from plastic bottles', ru: 'основная тема — изготовление и применение экокирпичей из пластиковых бутылок' }
    ],
    mainDistractors: [
      'how recycling trucks operate in large capitals',
      'why wooden sticks break easily during construction',
      'a history of clay houses in ancient times',
      'the dangers of swimming in polluted rivers',
      'why rural children prefer outdoor lessons',
      'how to design colourful labels for bottles'
    ],
    multiSets: [
      {
        prompt: 'To create eco-bricks, volunteers … .',
        trueItems: [
          { text: 'clean and dry used plastic bags and wrappers', ru: 'моют и сушат использованные пакеты и обёртки' },
          { text: 'press the waste firmly inside empty plastic bottles', ru: 'плотно утрамбовывают пластик деревянной палкой' },
          { text: 'do not need costly factory equipment', ru: 'обходится без дорогостоящих станков' }
        ],
        falseItems: [
          { text: 'leave food leftovers inside the wrappers', ru: 'пластик предварительно тщательно моют и сушат' },
          { text: 'burn the plastic before sealing the bottle cap', ru: 'пластик не сжигают, а уплотняют внутри бутылки' },
          { text: 'throw the finished bottles back into the river', ru: 'готовые бутылки используют для постройки классов и заборов' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What two materials are used to hold eco-bricks together in walls?</i>',
        answer: 'Clay or cement is used to stack them together into walls.',
        rubric: '<ul><li><b>2 балла:</b> названы оба материала — глина (<i>clay</i>) и цемент (<i>cement</i>).</li><li><b>1 балл:</b> назван только один из двух материалов.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение второго абзаца: «...workers stack hundreds of them together with <b>clay or cement</b> to construct sturdy walls».',
        hint: 'Посмотрите конец второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>This creative building method keeps rivers clean while … .</i>',
        answer: 'providing safe learning spaces for children',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («обеспечивая безопасные учебные помещения для детей»).</li><li><b>1 балл:</b> смысл верен, но упущены детали или есть языковая погрешность.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Заключение текста: «The creative method keeps rivers clean while <b>providing safe learning spaces for children</b>».',
        hint: 'Прочитайте самое последнее предложение текста.'
      }
    ],
    adjItems: [
      { noun: 'machinery', adj: 'expensive', sentence: 'Creating an eco-brick requires patience rather than <b>expensive</b> machinery.', ruExplain: 'Слово <i>machinery</i> описывается единственным прилагательным <b>expensive</b> (дорогостоящее оборудование).' },
      { noun: 'walls', adj: 'sturdy', sentence: '...workers stack hundreds of them together with clay or cement to construct <b>sturdy</b> walls.', ruExplain: 'Слово <i>walls</i> описывается единственным прилагательным <b>sturdy</b> (прочные).' }
    ]
  },
  {
    id: 'en-listen-chess',
    title: 'Аудирование (текст I): The Street Chess Club of Baku',
    paragraphs: [
      'Every mild weekend afternoon, a shaded corner near the Seaside Boulevard in Baku turns into an open-air chess club. Elderly grandfathers, university students, and curious teenagers gather around stone tables carrying wooden chess sets in worn leather bags.',
      'No membership fee or registration is required to join a match. Beginners often sit beside experienced players, watching every thoughtful move and learning patient strategies for free. Whenever a dramatic game reaches its final minutes, a quiet crowd forms around the table, whispering politely until the winner shakes hands with their opponent.',
      'Even in an age of fast smartphone apps, these friendly outdoor matches show that face-to-face games still bring different generations together.'
    ],
    trueFacts: [
      { text: 'Players of different ages meet near Baku’s Seaside Boulevard to play chess.', ru: 'В первом абзаце упомянуты пожилые дедушки, студенты и подростки на Приморском бульваре.' },
      { text: 'Anyone can participate in the outdoor chess matches without paying a fee.', ru: 'Во втором абзаце указано: «No membership fee or registration is required to join a match».' },
      { text: 'Newcomers can pick up chess strategies by watching skilled players.', ru: 'Новички наблюдают за ходами опытных игроков и бесплатно перенимают стратегии.' },
      { text: 'Spectators stay polite and quiet around exciting games.', ru: 'Зрители тихо наблюдают вокруг стола, вежливо перешёптываясь, пока не закончится партия.' }
    ],
    falseFacts: [
      { text: 'Visitors must pay a high monthly fee before touching a chessboard.', ruReason: 'Членские взносы и регистрация не требуются (<i>No membership fee...</i>).' },
      { text: 'Only elderly people are allowed to sit at the stone tables.', ruReason: 'Там собираются дедушки, студенты и подростки разных возрастов.' },
      { text: 'Players meet inside an expensive hotel during snowy winter nights.', ruReason: 'Встречи проходят на открытом воздухе у Приморского бульвара в мягкие выходные дни.' },
      { text: 'Spectators shout loudly during the final minutes of a match.', ruReason: 'Вокруг стола собирается тихая толпа, люди шепчутся вежливо.' },
      { text: 'Participants bring plastic digital screens instead of real chess sets.', ruReason: 'Участники приносят деревянные шахматы (<i>wooden chess sets</i>).' },
      { text: 'Smartphone chess apps have completely ended outdoor chess meetings.', ruReason: 'Даже в эпоху смартфонов живые встречи на бульваре по-прежнему объединяют поколения.' }
    ],
    mainIdeas: [
      { text: 'an open-air chess community bringing generations together', ru: 'текст посвящён живому уличному шахматному сообществу в Баку, объединяющему разные поколения' },
      { text: 'friendly weekend chess matches near Seaside Boulevard', ru: 'основная тема — дружеские уличные шахматные встречи в Баку' }
    ],
    mainDistractors: [
      'how to design fast smartphone chess apps',
      'expensive international chess tournaments in hotels',
      'rules for making wooden chess pieces by hand',
      'why teenagers dislike visiting city parks',
      'the construction history of Baku’s Seaside Boulevard',
      'how to win every chess game in three minutes'
    ],
    multiSets: [
      {
        prompt: 'At the outdoor chess club in Baku, … .',
        trueItems: [
          { text: 'matches take place on weekends in mild weather', ru: 'игроки собираются в мягкие выходные дни' },
          { text: 'beginners learn by observing experienced opponents', ru: 'новички учатся, наблюдая за опытными игроками' },
          { text: 'players end the game with a friendly handshake', ru: 'победитель пожимает руку сопернику' }
        ],
        falseItems: [
          { text: 'official registration cards are checked at the entrance', ru: 'регистрация не требуется' },
          { text: 'teachers charge students for every chess lesson', ru: 'обучение через наблюдение происходит бесплатно' },
          { text: 'younger players are banned from joining matches', ru: 'подростки и студенты активно участвуют' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What do players carry their wooden chess sets in?</i>',
        answer: 'They carry them in worn leather bags.',
        rubric: '<ul><li><b>2 балла:</b> точно указаны поношенные кожаные сумки (<i>worn leather bags</i>).</li><li><b>1 балл:</b> упомянуты кожаные сумки без детали или с мелкой ошибкой.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Второе предложение первого абзаца: «...carrying wooden chess sets in <b>worn leather bags</b>».',
        hint: 'Посмотрите конец первого абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Despite the popularity of smartphone apps, these weekend matches show that … .</i>',
        answer: 'face-to-face games still bring different generations together',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («живые игры лицом к лицу по-прежнему объединяют разные поколения»).</li><li><b>1 балл:</b> смысл верен в общих чертах, но фраза неполная.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Последнее предложение текста: «...show that <b>face-to-face games still bring different generations together</b>».',
        hint: 'Обратитесь к третьему абзацу.'
      }
    ],
    adjItems: [
      { noun: 'move', adj: 'thoughtful', sentence: 'Beginners often sit beside experienced players, watching every <b>thoughtful</b> move and learning patient strategies for free.', ruExplain: 'Слово <i>move</i> описывается единственным прилагательным <b>thoughtful</b> (продуманный ход).' },
      { noun: 'corner', adj: 'shaded', sentence: 'Every mild weekend afternoon, a <b>shaded</b> corner near the Seaside Boulevard in Baku turns into an open-air chess club.', ruExplain: 'Слово <i>corner</i> описывается единственным прилагательным <b>shaded</b> (тенистый уголок).' }
    ]
  },
  {
    id: 'en-listen-seedvault',
    title: 'Аудирование (текст I): The Arctic Seed Vault',
    paragraphs: [
      'Deep inside a frozen mountain on the Norwegian island of Svalbard sits a modern fortress designed to protect the future of human food. Known as the Global Seed Vault, this underground bank safely stores more than one million seed samples sent from almost every nation on Earth.',
      'Extreme heat, floods, or sudden plant diseases can easily wipe out rare crops in local regions. By keeping backup copies of wheat, rice, beans, and fruit seeds at minus eighteen degrees Celsius, the vault ensures that lost plant varieties can be recovered. Even if the electrical power ever fails, the surrounding icy rock keeps the chambers naturally cold for months.',
      'The vault operates like a safe deposit box: each country retains full ownership of its seeds and can withdraw them whenever a local crisis strikes.'
    ],
    trueFacts: [
      { text: 'The Global Seed Vault is built inside an icy mountain in Norway.', ru: 'В первом абзаце указано: хранилище расположено глубоко внутри замёрзшей горы на норвежском острове Шпицберген.' },
      { text: 'More than a million seed samples are preserved inside the bank.', ru: 'Там хранится более миллиона образцов семян почти со всех стран мира.' },
      { text: 'Surrounding frozen rock keeps the vault cool even without electricity.', ru: 'Во втором абзаце: «Even if the electrical power ever fails, the surrounding icy rock keeps the chambers naturally cold».' },
      { text: 'Countries still own the seed samples they send to Svalbard.', ru: 'В третьем абзаце: «each country retains full ownership of its seeds».' }
    ],
    falseFacts: [
      { text: 'Only five European nations are allowed to store seeds in Svalbard.', ruReason: 'Образцы присылает почти каждая страна мира (<i>almost every nation on Earth</i>).' },
      { text: 'Seeds inside the vault are kept at warm room temperatures.', ruReason: 'Семена хранятся при температуре минус 18 градусов Цельсия.' },
      { text: 'If electricity goes out, all seeds inside melt within an hour.', ruReason: 'Ледяная порода горы естественно сохраняет холод на протяжении месяцев.' },
      { text: 'Once a nation sends seeds to Norway, it loses ownership of them.', ruReason: 'Каждая страна сохраняет полное право собственности и может забрать их при кризисе.' },
      { text: 'The underground bank stores live farm animals instead of plants.', ruReason: 'Банк хранит образцы семян пшеницы, риса, бобовых и фруктов.' },
      { text: 'The vault sells rare crops to supermarkets around the world.', ruReason: 'Хранилище работает как резервный банковский сейф на случай бедствий, а не магазин.' }
    ],
    mainIdeas: [
      { text: 'an underground bank protecting the world’s crop seeds', ru: 'текст описывает Всемирное семенохранилище на Шпицбергене как защиту разнообразия культур' },
      { text: 'preserving food diversity inside a frozen mountain', ru: 'главная тема — сохранение резервной коллекции семян планеты' }
    ],
    mainDistractors: [
      'how to grow wheat and rice in Svalbard snow',
      'why electrical power fails on Arctic islands',
      'the history of Norwegian mountain fortresses',
      'modern bank deposit boxes for gold and silver',
      'common plant diseases in tropical bean farms',
      'how tourists visit Norwegian islands in summer'
    ],
    multiSets: [
      {
        prompt: 'The Global Seed Vault … .',
        trueItems: [
          { text: 'protects backup samples against floods and diseases', ru: 'сохраняет дубликаты на случай засухи, наводнений и болезней' },
          { text: 'stores seeds at minus eighteen degrees Celsius', ru: 'поддерживает температуру −18 °C' },
          { text: 'allows nations to take back their own seeds in a crisis', ru: 'страны могут забрать свои семена при местном кризисе' }
        ],
        falseItems: [
          { text: 'was built on top of a warm desert hill', ru: 'расположено внутри замёрзшей арктической горы' },
          { text: 'contains fewer than ten thousand samples', ru: 'в нём хранится свыше миллиона образцов' },
          { text: 'depends solely on coal heaters in winter', ru: 'ему нужен холод, а не обогреватели' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What happens if electrical power at the Seed Vault ever fails?</i>',
        answer: 'The surrounding icy rock keeps the chambers naturally cold for months.',
        rubric: '<ul><li><b>2 балла:</b> точно указано, что окружающая ледяная порода естественно сохраняет холод в камерах месяцами.</li><li><b>1 балл:</b> смысл верен («скала/лёд сохраняет холод»), но фраза неполная.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение второго абзаца: «Even if the electrical power ever fails, <b>the surrounding icy rock keeps the chambers naturally cold for months</b>».',
        hint: 'Прочитайте конец второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Each participating nation retains full ownership of its seeds and can … .</i>',
        answer: 'withdraw them whenever a local crisis strikes',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («забрать их, когда произойдёт местный кризис»).</li><li><b>1 балл:</b> общий смысл передан, но упущено условие или допущена ошибка.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Последнее предложение текста: «...and can <b>withdraw them whenever a local crisis strikes</b>».',
        hint: 'Посмотрите последний абзац текста.'
      }
    ],
    adjItems: [
      { noun: 'fortress', adj: 'modern', sentence: 'Deep inside a frozen mountain on the Norwegian island of Svalbard sits a <b>modern</b> fortress designed to protect the future of human food.', ruExplain: 'Слово <i>fortress</i> описывается единственным прилагательным <b>modern</b> (современная).' },
      { noun: 'crops', adj: 'rare', sentence: 'Extreme heat, floods, or sudden plant diseases can easily wipe out <b>rare</b> crops in local regions.', ruExplain: 'Существительное <i>crops</i> описывается единственным прилагательным <b>rare</b> (редкие культуры).' }
    ]
  },
  {
    id: 'en-listen-glacier',
    title: 'Аудирование (текст I): Wrapping Glaciers in White Blankets',
    paragraphs: [
      'Every spring, crews of Swiss mountain workers climb up to the famous Rhone Glacier carrying huge rolls of white cloth. Before the hot summer sun arrives, they carefully spread these giant reflective sheets across the ice like enormous winter blankets.',
      'Over the past century, rising temperatures have caused Alpine glaciers to melt faster than ever before. Because the bright white cloth reflects sunlight away instead of absorbing heat, it slows down summer melting beneath the cover by more than half. Volunteers anchor the heavy sheets with sandbags so strong mountain winds cannot blow them away.',
      'Although covering an entire mountain range is impossible, protecting key tourist sections and ice caves buys valuable time while nations work on long-term climate solutions.'
    ],
    trueFacts: [
      { text: 'Workers cover parts of the Rhone Glacier with white sheets each spring.', ru: 'В первом абзаце сказано: каждую весну швейцарские рабочие расстилают по леднику белые полотна.' },
      { text: 'The reflective fabric cuts summer ice melting under it by over fifty percent.', ru: 'Во втором абзаце: «slows down summer melting beneath the cover by more than half».' },
      { text: 'Sandbags hold the sheets in place against strong winds.', ru: 'Добровольцы закрепляют полотна мешками с песком (<i>anchor the heavy sheets with sandbags</i>).' },
      { text: 'Covering glaciers is only a temporary aid for specific areas.', ru: 'Покрыть весь горный хребет невозможно; мера выигрывает время для ключевых участков.' }
    ],
    falseFacts: [
      { text: 'Workers spread black blankets on the snow to attract more sunlight.', ruReason: 'Используются белые светоотражающие полотна (<i>bright white cloth</i>), отражающие тепло.' },
      { text: 'The sheets speed up summer melting across the Swiss Alps.', ruReason: 'Напротив, они замедляют летнее таяние более чем наполовину.' },
      { text: 'The entire Alpine mountain range is now wrapped in white fabric.', ruReason: 'В третьем абзаце прямо сказано: «covering an entire mountain range is impossible».' },
      { text: 'Volunteers glue the blankets to ice caves using hot water.', ruReason: 'Полотна удерживаются тяжёлыми мешками с песком.' },
      { text: 'Alpine glaciers have stopped melting over the past hundred years.', ruReason: 'Рост температур за последнее столетие заставил их таять быстрее, чем когда-либо.' },
      { text: 'Mountain winds easily blow all the white sheets away every morning.', ruReason: 'Мешки с песком не дают ветру унести полотна.' }
    ],
    mainIdeas: [
      { text: 'a creative method to slow glacier melting in Switzerland', ru: 'текст описывает укрытие альпийских ледников белыми полотнами для замедления таяния' },
      { text: 'protecting mountain ice with reflective blankets', ru: 'главная тема — защита ледников от летнего солнца отражающими покрытиями' }
    ],
    mainDistractors: [
      'how to sew winter clothes for Swiss climbers',
      'why summer tourists avoid visiting ice caves',
      'building sandbag walls around Alpine towns',
      'the history of Swiss textile factories',
      'how global winds change direction in spring',
      'why climbing mountains in winter is dangerous'
    ],
    multiSets: [
      {
        prompt: 'The white sheets placed on the Rhone Glacier … .',
        trueItems: [
          { text: 'bounce sunlight away from the ice surface', ru: 'отражают солнечный свет вместо поглощения тепла' },
          { text: 'are fastened down with heavy sandbags', ru: 'закрепляются мешками с песком против ветра' },
          { text: 'reduce melting beneath them by over fifty percent', ru: 'сокращают летнее таяние под покрытием более чем вдвое' }
        ],
        falseItems: [
          { text: 'are removed every morning before noon', ru: 'их расстилают весной на всё лето' },
          { text: 'provide a permanent solution for all glaciers globally', ru: 'это временная мера для отдельных важных зон' },
          { text: 'warm up the ice caves for summer visitors', ru: 'их задача — сохранять лёд холодным, отражая тепло' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>How do volunteers stop mountain winds from blowing the sheets away?</i>',
        answer: 'They anchor the heavy sheets with sandbags.',
        rubric: '<ul><li><b>2 балла:</b> точно указано закрепление полотен мешками с песком (<i>sandbags</i>).</li><li><b>1 балл:</b> смысл понятен, но есть языковая неточность.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Последнее предложение второго абзаца: «Volunteers <b>anchor the heavy sheets with sandbags</b> so strong mountain winds cannot blow them away».',
        hint: 'Посмотрите конец второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Protecting key sections and ice caves buys valuable time while nations … .</i>',
        answer: 'work on long-term climate solutions',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («работают над долгосрочными климатическими решениями»).</li><li><b>1 балл:</b> смысл передан не полностью или с грамматической ошибкой.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Конец третьего абзаца: «...while nations <b>work on long-term climate solutions</b>».',
        hint: 'Посмотрите последнее предложение текста.'
      }
    ],
    adjItems: [
      { noun: 'time', adj: 'valuable', sentence: 'Although covering an entire mountain range is impossible, protecting key tourist sections and ice caves buys <b>valuable</b> time...', ruExplain: 'Слово <i>time</i> описывается единственным прилагательным <b>valuable</b> (драгоценное время).' },
      { noun: 'century', adj: 'past', sentence: 'Over the <b>past</b> century, rising temperatures have caused Alpine glaciers to melt faster than ever before.', ruExplain: 'Слово <i>century</i> описывается единственным прилагательным <b>past</b> (прошлое столетие).' }
    ]
  },
  {
    id: 'en-listen-guidebot',
    title: 'Аудирование (текст I): A Robotic Guide at the Airport',
    paragraphs: [
      'Travelling through a crowded international airport can feel stressful, especially when passengers rush to catch a connecting flight. To make journeys smoother, several modern airports have introduced friendly wheeled robots that help travellers find their gates.',
      'Standing about one metre tall, each robot displays clear maps and flight updates on a bright chest screen. Passengers simply scan their boarding pass or ask a question in any of ten languages. If a traveller looks lost, the robot politely says, “Please follow me,” and rolls steadily toward the correct gate, stopping automatically whenever someone steps in its path.',
      'Staff members report that the cheerful machines never replace human workers; instead, they handle routine directions so airport staff can spend more time assisting elderly passengers and families with young children.'
    ],
    trueFacts: [
      { text: 'Wheeled robots help passengers locate boarding gates in some airports.', ru: 'В первом абзаце говорится о дружелюбных колёсных роботах, помогающих найти выходы на посадку.' },
      { text: 'Travellers can scan their boarding pass on the robot’s screen.', ru: 'Во втором абзаце: «Passengers simply scan their boarding pass or ask a question».' },
      { text: 'The guide robots are programmed to speak and understand ten languages.', ru: 'Робот принимает вопросы на любом из десяти языков (<i>in any of ten languages</i>).' },
      { text: 'Robots free human staff to give extra care to elderly guests and families.', ru: 'Сотрудники тратят больше времени на помощь пожилым пассажирам и семьям с маленькими детьми.' }
    ],
    falseFacts: [
      { text: 'Airport guide robots have completely replaced all human workers.', ruReason: 'В третьем абзаце сказано, что они никогда не заменяют работников (<i>never replace human workers</i>).' },
      { text: 'Each guide robot is taller than three metres and flies overhead.', ruReason: 'Робот на колёсах ростом около одного метра (<i>about one metre tall</i>).' },
      { text: 'The machines understand questions in only one local language.', ruReason: 'Они поддерживают десять различных языков.' },
      { text: 'The robots keep rolling forward even if a passenger blocks their path.', ruReason: 'Робот автоматически останавливается, если кто-то встаёт у него на пути.' },
      { text: 'Travellers must pay an extra ticket fee to follow the airport robot.', ruReason: 'Оплата за помощь робота не упоминается — это часть сервиса аэропорта.' },
      { text: 'The robots carry heavy suitcases onto departing airplanes.', ruReason: 'Роботы показывают карты, расписание и провожают пассажиров к нужному выходу.' }
    ],
    mainIdeas: [
      { text: 'helpful guide robots assisting travellers at airports', ru: 'текст посвящён роботам-помощникам, направляющим пассажиров в аэропортах' },
      { text: 'how modern robots improve airport navigation', ru: 'основная тема — облегчение ориентирования в аэропортах с помощью роботов' }
    ],
    mainDistractors: [
      'how to pack light luggage for connecting flights',
      'why elderly people rarely travel by airplane',
      'the history of boarding passes and paper maps',
      'ways to learn ten foreign languages quickly',
      'problems caused by delayed flights in winter',
      'how airport pilots communicate with control towers'
    ],
    multiSets: [
      {
        prompt: 'The airport guide robots … .',
        trueItems: [
          { text: 'show maps and flight information on their screen', ru: 'показывают карты и обновления рейсов на экране' },
          { text: 'pause automatically when someone walks in front of them', ru: 'автоматически останавливаются при препятствии' },
          { text: 'take care of routine directions for hurrying travellers', ru: 'берут на себя рутинные подсказки маршрута' }
        ],
        falseItems: [
          { text: 'refuse to help travellers who lost their way', ru: 'они вежливо предлагают следовать за ними до выхода' },
          { text: 'make human staff lose their jobs at the airport', ru: 'сотрудники отмечают, что роботы не заменяют людей' },
          { text: 'are unable to read scanned boarding passes', ru: 'пассажиры легко сканируют посадочный талон' }
        ]
      }
    ],
    qaItems: [
      {
        kind: 'question',
        stem: 'Write the correct answer to the question according to the passage.<br><i>What does the robot do if a traveller looks lost?</i>',
        answer: 'It politely says “Please follow me” and rolls steadily toward the correct gate.',
        rubric: '<ul><li><b>2 балла:</b> точно указано: робот предлагает следовать за ним и едет к нужному выходу.</li><li><b>1 балл:</b> смысл верен, но упущены детали или допущена ошибка.</li><li><b>0 баллов:</b> неверный ответ.</li></ul>',
        ruExplain: 'Второе предложение (конец 2-го абзаца): «...the robot politely says, “Please follow me,” and <b>rolls steadily toward the correct gate</b>».',
        hint: 'Посмотрите последнее предложение второго абзаца.'
      },
      {
        kind: 'complete',
        stem: 'Complete the sentence according to the passage.<br><i>Because robots handle routine directions, airport staff can spend more time … .</i>',
        answer: 'assisting elderly passengers and families with young children',
        rubric: '<ul><li><b>2 балла:</b> точное завершение («помогая пожилым пассажирам и семьям с маленькими детьми»).</li><li><b>1 балл:</b> указана только одна группа пассажиров или есть мелкая неточность.</li><li><b>0 баллов:</b> неверное завершение.</li></ul>',
        ruExplain: 'Конец третьего абзаца: «...spend more time <b>assisting elderly passengers and families with young children</b>».',
        hint: 'Прочитайте последний абзац текста.'
      }
    ],
    adjItems: [
      { noun: 'flight', adj: 'connecting', sentence: '...especially when passengers rush to catch a <b>connecting</b> flight.', ruExplain: 'Существительное <i>flight</i> в первом предложении описывает прилагательное <b>connecting</b> (стыковочный рейс).' },
      { noun: 'directions', adj: 'routine', sentence: '...instead, they handle <b>routine</b> directions so airport staff can spend more time assisting elderly passengers...', ruExplain: 'Слово <i>directions</i> описывается единственным прилагательным <b>routine</b> (обычные/рутинные).' }
    ]
  }
];
