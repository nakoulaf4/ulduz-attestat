// Curated banks for Vocabulary, Word Formation & Dialogues:
// en.vocab-definitions, en.vocab-match, en.vocab-antonyms, en.vocab-context,
// en.word-formation, en.dialogues

export const VOCAB_DEFINITIONS = [
  // Group 1: Verbs (B1)
  { word: 'to preserve', def: 'to keep something in its original state or protect it from damage', ru: 'сохранять, оберегать', diff: 2 },
  { word: 'to hesitate', def: 'to pause nervously before saying or doing something', ru: 'колебаться, сомневаться', diff: 2 },
  { word: 'to predict', def: 'to say what will happen in the future based on knowledge', ru: 'предсказывать', diff: 1 },
  { word: 'to expand', def: 'to become larger in size, number, or importance', ru: 'расширяться, расти', diff: 2 },
  { word: 'to encourage', def: 'to give someone support, confidence, or hope', ru: 'поддерживать, воодушевлять', diff: 1 },
  { word: 'to abandon', def: 'to leave a place, plan, or person completely behind', ru: 'оставить, отказаться', diff: 3 },
  { word: 'to witness', def: 'to see an event happen with your own eyes', ru: 'быть свидетелем', diff: 2 },
  { word: 'to achieve', def: 'to succeed in reaching a goal through hard work', ru: 'достигать (цели)', diff: 1 },
  { word: 'to reduce', def: 'to make something smaller in amount, degree, or size', ru: 'уменьшать, сокращать', diff: 1 },
  { word: 'to confirm', def: 'to show or state clearly that something is true', ru: 'подтверждать', diff: 2 },
  { word: 'to invent', def: 'to design or create something that never existed before', ru: 'изобретать', diff: 1 },
  { word: 'to contribute', def: 'to give time, money, or effort to help achieve something', ru: 'вносить вклад', diff: 3 },
  { word: 'to rescue', def: 'to save somebody or something from a dangerous situation', ru: 'спасать', diff: 1 },
  { word: 'to measure', def: 'to find the exact size, weight, or amount of something', ru: 'измерять', diff: 1 },
  { word: 'to prevent', def: 'to stop something unwanted from happening', ru: 'предотвращать', diff: 2 },
  { word: 'to explore', def: 'to travel through an unfamiliar area to learn about it', ru: 'исследовать, изучать', diff: 1 },
  { word: 'to admire', def: 'to respect and like someone or something very much', ru: 'восхищаться', diff: 2 },
  { word: 'to compete', def: 'to try to win a prize or do better than others', ru: 'соревноваться', diff: 1 },

  // Group 2: Nouns (B1)
  { word: 'a milestone', def: 'a very important stage or event in the development of something', ru: 'важная веха, этап', diff: 3 },
  { word: 'hospitality', def: 'friendly and generous behaviour toward guests and visitors', ru: 'гостеприимство', diff: 2 },
  { word: 'a shelter', def: 'a safe place that protects people or animals from weather or danger', ru: 'укрытие, приют', diff: 2 },
  { word: 'curiosity', def: 'a strong desire to know or learn about new things', ru: 'любознательность', diff: 2 },
  { word: 'an obstacle', def: 'something that blocks your way or makes progress difficult', ru: 'препятствие', diff: 2 },
  { word: 'patience', def: 'the ability to wait calmly without getting annoyed', ru: 'терпение', diff: 1 },
  { word: 'a citizen', def: 'a person who legally belongs to a particular country or town', ru: 'гражданин, житель', diff: 1 },
  { word: 'a deadline', def: 'a fixed time or date by which a task must be finished', ru: 'крайний срок', diff: 2 },
  { word: 'an exhibition', def: 'a public event where paintings or objects are shown to visitors', ru: 'выставка', diff: 1 },
  { word: 'generosity', def: 'willingness to give money, help, or time freely to others', ru: 'щедрость', diff: 2 },
  { word: 'a destination', def: 'the place to which someone or something is travelling', ru: 'пункт назначения', diff: 2 },
  { word: 'confidence', def: 'a feeling of trust in your own abilities or qualities', ru: 'уверенность', diff: 2 },

  // Group 3: Adjectives (B1)
  { word: 'fragile', def: 'easily broken, damaged, or destroyed', ru: 'хрупкий', diff: 2 },
  { word: 'reliable', def: 'able to be trusted to work well or behave honestly', ru: 'надёжный', diff: 2 },
  { word: 'ancient', def: 'belonging to a very distant period in history', ru: 'древний', diff: 1 },
  { word: 'scarce', def: 'not easy to find or obtain; available only in small amounts', ru: 'дефицитный, редкий', diff: 3 },
  { word: 'vivid', def: 'producing very bright, clear, and detailed images in the mind', ru: 'яркий, живой', diff: 3 },
  { word: 'fluent', def: 'able to speak or write a foreign language easily and accurately', ru: 'беглый (о речи)', diff: 2 },
  { word: 'curious', def: 'eager to learn, ask questions, or discover new facts', ru: 'любознательный', diff: 1 },
  { word: 'affordable', def: 'reasonably priced so that ordinary people can buy it', ru: 'доступный по цене', diff: 2 },
  { word: 'durable', def: 'strong enough to stay in good condition for a long time', ru: 'прочный, долговечный', diff: 3 },
  { word: 'polite', def: 'having good manners and showing respect for other people', ru: 'вежливый', diff: 1 }
];

export const ANTONYM_PAIRS = [
  { pair: 'previous – next', ru: 'предыдущий – следующий', diff: 1 },
  { pair: 'to defend – to attack', ru: 'защищать – нападать', diff: 1 },
  { pair: 'to fail – to succeed', ru: 'потерпеть неудачу – преуспеть', diff: 1 },
  { pair: 'to destroy – to build', ru: 'разрушать – строить', diff: 1 },
  { pair: 'ancient – modern', ru: 'древний – современный', diff: 1 },
  { pair: 'generous – greedy', ru: 'щедрый – жадный', diff: 1 },
  { pair: 'polite – rude', ru: 'вежливый – грубый', diff: 1 },
  { pair: 'shallow – deep', ru: 'мелкий – глубокий', diff: 2 },
  { pair: 'to accept – to refuse', ru: 'принимать – отказывать', diff: 1 },
  { pair: 'to increase – to reduce', ru: 'увеличивать – уменьшать', diff: 2 },
  { pair: 'victory – defeat', ru: 'победа – поражение', diff: 2 },
  { pair: 'temporary – permanent', ru: 'временный – постоянный', diff: 3 },
  { pair: 'scarce – abundant', ru: 'скудный – обильный', diff: 3 },
  { pair: 'courageous – cowardly', ru: 'смелый – трусливый', diff: 2 },
  { pair: 'to forbid – to allow', ru: 'запрещать – разрешать', diff: 2 },
  { pair: 'rural – urban', ru: 'сельский – городской', diff: 2 },
  { pair: 'artificial – natural', ru: 'искусственный – природный', diff: 2 },
  { pair: 'harmful – beneficial', ru: 'вредный – полезный', diff: 2 },
  { pair: 'guilty – innocent', ru: 'виновный – невиновный', diff: 3 },
  { pair: 'arrival – departure', ru: 'прибытие – отправление', diff: 2 },
  { pair: 'to reward – to punish', ru: 'награждать – наказывать', diff: 2 },
  { pair: 'quiet – noisy', ru: 'тихий – шумный', diff: 1 },
  { pair: 'broad – narrow', ru: 'широкий – узкий', diff: 2 },
  { pair: 'to remember – to forget', ru: 'помнить – забывать', diff: 1 }
];

export const SYNONYM_PAIRS = [
  { pair: 'strong – powerful', ru: 'сильный – мощный', diff: 1 },
  { pair: 'mild – gentle', ru: 'мягкий – нежный', diff: 1 },
  { pair: 'massive – huge', ru: 'массивный – огромный', diff: 1 },
  { pair: 'to liberate – to free', ru: 'освобождать', diff: 2 },
  { pair: 'to reject – to turn down', ru: 'отвергать, отказывать', diff: 2 },
  { pair: 'enthusiasm – passion', ru: 'энтузиазм – страсть', diff: 2 },
  { pair: 'to develop – to improve', ru: 'развивать – совершенствовать', diff: 1 },
  { pair: 'to witness – to observe', ru: 'наблюдать, видеть', diff: 2 },
  { pair: 'to inspire – to motivate', ru: 'вдохновлять – мотивировать', diff: 2 },
  { pair: 'defensive – protective', ru: 'оборонительный – защитный', diff: 2 },
  { pair: 'rapid – swift', ru: 'быстрый – стремительный', diff: 3 },
  { pair: 'famous – well-known', ru: 'знаменитый – известный', diff: 1 },
  { pair: 'to assist – to aid', ru: 'помогать – содействовать', diff: 2 },
  { pair: 'hardship – difficulty', ru: 'трудность – лишение', diff: 2 },
  { pair: 'tidy – neat', ru: 'аккуратный – опрятный', diff: 1 },
  { pair: 'valuable – precious', ru: 'ценный – драгоценный', diff: 2 },
  { pair: 'to repair – to mend', ru: 'чинить – ремонтировать', diff: 2 },
  { pair: 'exhausted – worn out', ru: 'измученный – истощённый', diff: 3 },
  { pair: 'calm – peaceful', ru: 'спокойный – мирный', diff: 1 },
  { pair: 'faithful – loyal', ru: 'верный – преданный', diff: 2 },
  { pair: 'to purchase – to buy', ru: 'приобретать – покупать', diff: 1 },
  { pair: 'clever – intelligent', ru: 'умный – сообразительный', diff: 1 },
  { pair: 'ancient – antique', ru: 'древний – старинный', diff: 2 },
  { pair: 'to construct – to build', ru: 'строить – возводить', diff: 1 }
];

export const CONTEXT_PAIR_ITEMS = [
  {
    diff: 1,
    stem: '<span class="gap"></span> people always welcome guests warmly and treat neighbours with respect.',
    cleanGood: ['Polite', 'Hospitable', 'Generous', 'Kind'],
    bad: ['Greedy', 'Rude', 'Cruel', 'Selfish'],
    rule: 'По контексту требуются <b>положительные</b> качества человека (тепло принимать гостей и уважать соседей).'
  },
  {
    diff: 1,
    stem: 'Nobody enjoys working with <span class="gap"></span> partners who never keep their promises.',
    cleanGood: ['unreliable', 'dishonest', 'careless', 'lazy'],
    bad: ['punctual', 'loyal', 'honest', 'diligent'],
    rule: 'Отрицательная характеристика «никогда не сдерживают обещания» требует <b>негативных</b> прилагательных.'
  },
  {
    diff: 2,
    stem: 'The mountain climbers needed <span class="gap"></span> equipment to survive the freezing storm.',
    cleanGood: ['reliable', 'durable', 'sturdy', 'warm'],
    bad: ['fragile', 'useless', 'broken', 'delicate'],
    rule: 'Для выживания в бурю требуется <b>надёжное и прочное</b> снаряжение (хрупкое или бесполезное не подходит).'
  },
  {
    diff: 2,
    stem: 'Her <span class="gap"></span> speech impressed the entire audience and earned loud applause.',
    cleanGood: ['inspiring', 'thoughtful', 'fluent', 'convincing'],
    bad: ['boring', 'dull', 'confusing', 'meaningless'],
    rule: 'Реакция зала («впечатлила и вызвала бурные аплодисменты») соответствует <b>позитивной</b> оценке выступления.'
  }
];

export const CONTEXT_SINGLE_ITEMS = [
  { diff: 1, stem: 'Could you please <span class="gap"></span> me a favour and carry this box upstairs?', correct: 'do', distractors: ['make', 'take', 'have', 'give'], rule: 'Устойчивое сочетание со словом <i>favour</i> («оказать услугу»): <i>to <b>do</b> somebody a favour</i>.' },
  { diff: 1, stem: 'Try not to <span class="gap"></span> the same spelling mistake twice in your essay.', correct: 'make', distractors: ['do', 'take', 'say', 'tell'], rule: 'С существительным <i>mistake</i> («сделать ошибку») всегда употребляется глагол <i>make</i> (<i>make a mistake</i>).' },
  { diff: 1, stem: 'May I <span class="gap"></span> your English dictionary for a couple of days?', correct: 'borrow', distractors: ['lend', 'owe', 'earn', 'spend'], rule: 'Брать на время себе — <i>borrow (from)</i>; давать взаймы другому — <i>lend (to)</i>.' },
  { diff: 2, stem: 'Please <span class="gap"></span> me the truth about what happened in the chemistry lab.', correct: 'tell', distractors: ['say', 'speak', 'talk', 'explain'], rule: 'После глагола сразу стоит косвенное дополнение <i>me</i> без предлога <i>to</i>: устойчиво <i>tell the truth / tell somebody</i> (а <i>say</i> требует предлога <i>to</i> перед адресатом).' },
  { diff: 2, stem: 'Alexander Fleming <span class="gap"></span> penicillin by accident in 1928.', correct: 'discovered', distractors: ['invented', 'built', 'created', 'designed'], rule: '<i>Discover</i> — «открывать» уже существующее в природе вещество/явление (пенициллин, планету); <i>invent</i> — «изобретать» нечто искусственное (телефон, прибор).' },
  { diff: 2, stem: 'My uncle got a challenging new <span class="gap"></span> at a solar engineering firm.', correct: 'job', distractors: ['work', 'labour', 'effort', 'occupation of'], rule: 'После неопределённого артикля <i>a</i> («должность, место работы») используется исчисляемое слово <i>job</i> (слово <i>work</i> в значении «работа» неисчисляемое и не принимает <i>a</i>).' },
  { diff: 2, stem: 'Farmers usually <span class="gap"></span> wheat and barley in this fertile valley.', correct: 'raise', distractors: ['rise', 'arise', 'wake', 'climb'], rule: 'Переходный глагол <i>raise</i> («выращивать, поднимать что-то») имеет прямое дополнение (<i>wheat</i>), тогда как <i>rise</i> непереходный («подниматься самому»).' },
  { diff: 3, stem: 'Because of heavy snow, the sports committee had to <span class="gap"></span> the match until Sunday.', correct: 'put off', distractors: ['put on', 'turn on', 'give away', 'look after'], rule: 'Фразовый глагол <i>put off</i> означает «откладывать, переносить на более поздний срок» (= <i>postpone</i>).' },
  { diff: 3, stem: 'Unfortunately, our camping group <span class="gap"></span> drinking water halfway up the mountain.', correct: 'ran out of', distractors: ['put up with', 'looked forward to', 'caught up with', 'got away with'], rule: 'Устойчивый фразовый глагол <i>run out of</i> означает «израсходовать, остаться без чего-либо».' },
  { diff: 3, stem: 'She politely <span class="gap"></span> the job offer because she wanted to finish university first.', correct: 'turned down', distractors: ['turned up', 'turned on', 'turned into', 'turned over'], rule: 'Фразовый глагол <i>turn down</i> означает «отклонить (предложение), отказать».' }
];

export const WORD_FORMATION_ITEMS = [
  { diff: 1, stem: 'With hard work and <span class="gap"></span> , you can master any foreign language.', correct: 'patience', distractors: ['patient', 'patiently', 'impatient', 'patients'], rule: 'После предлога <i>with</i> в паре с существительным <i>work</i> требуется абстрактное существительное <i>patience</i> («терпение»).' },
  { diff: 1, stem: 'The guide explained the history of the fortress very <span class="gap"></span> .', correct: 'clearly', distractors: ['clear', 'clarity', 'clearness', 'unclear'], rule: 'Для характеристики действия глагола <i>explained</i> («объяснил как?») требуется наречие с суффиксом <i>-ly</i> — <i>clearly</i>.' },
  { diff: 1, stem: 'Everyone admired the <span class="gap"></span> of the local people in the mountain village.', correct: 'kindness', distractors: ['kind', 'kindly', 'unkind', 'kinder'], rule: 'После определённого артикля <i>the</i> и перед предлогом <i>of</i> требуется существительное с суффиксом <i>-ness</i> — <i>kindness</i> («доброта»).' },
  { diff: 2, stem: 'It was <span class="gap"></span> to see the mountain peaks because of the thick morning fog.', correct: 'impossible', distractors: ['possible', 'unpossible', 'impossibly', 'possibility'], rule: 'Перед приставкой <i>p</i> отрицательный префикс — <b>im-</b> (<i>impossible</i>, не *<i>unpossible</i>); после глагола-связки <i>was</i> ставится прилагательное.' },
  { diff: 2, stem: 'The scientist’s latest <span class="gap"></span> helped hospitals purify water much faster.', correct: 'invention', distractors: ['invent', 'inventive', 'inventively', 'inventor'], rule: 'После притяжательного падежа и прилагательного (<i>scientist’s latest</i>) требуется существительное <i>invention</i> («изобретение»), а не лицо (<i>inventor</i>).' },
  { diff: 2, stem: 'Be careful with that antique glass vase—it is extremely <span class="gap"></span> .', correct: 'valuable', distractors: ['value', 'valuably', 'invalue', 'valueless'], rule: 'После связки <i>is</i> и наречия <i>extremely</i> требуется прилагательное <i>valuable</i> («ценная»); <i>valueless</i> означает «бесцельный/не имеющий ценности».' },
  { diff: 2, stem: 'He felt deeply <span class="gap"></span> when the outdoor festival was cancelled due to rain.', correct: 'disappointed', distractors: ['disappoint', 'disappointment', 'disappointing', 'disappointingly'], rule: 'Описывает чувство человека (<i>He felt...</i>) — требуется форма <i>disappointed</i> («разочарованный»); <i>disappointing</i> относится к событию.' },
  { diff: 2, stem: 'Leaving a campfire burning in a dry forest is totally <span class="gap"></span> .', correct: 'irresponsible', distractors: ['responsible', 'unresponsible', 'responsibility', 'irresponsibly'], rule: 'Перед корневой <i>r</i> отрицательная приставка принимает форму <b>ir-</b> (<i>irresponsible</i> — безответственный).' },
  { diff: 3, stem: '<span class="gap"></span> , the flight was delayed by three hours because of snow.', correct: 'Unfortunately', distractors: ['Unfortunate', 'Fortunate', 'Fortunately', 'Fortune'], rule: 'Вводное слово в начале предложения перед запятой должно быть наречием с отрицательным префиксом по смыслу («К сожалению») — <i>Unfortunately</i>.' },
  { diff: 3, stem: 'The museum needs better <span class="gap"></span> before opening the new exhibition to the public.', correct: 'preparation', distractors: ['prepare', 'prepared', 'preparationsly', 'unprepared'], rule: 'После прилагательного <i>better</i> в роли дополнения требуется существительное — <i>preparation</i> («подготовка»).' },
  { diff: 3, stem: 'Speaking <span class="gap"></span> in front of a large crowd takes confidence and practice.', correct: 'fluently', distractors: ['fluent', 'fluency', 'unfluent', 'influent'], rule: 'Глагол <i>Speaking</i> («говоря как?») определяется наречием <i>fluently</i> («бегло»).' },
  { diff: 3, stem: 'His <span class="gap"></span> to help strangers in trouble made him respected by everyone.', correct: 'willingness', distractors: ['willing', 'willingly', 'unwilling', 'willful'], rule: 'После притяжательного местоимения <i>His</i> требуется существительное <i>willingness</i> («готовность помочь»).' }
];

export const DIALOGUE_ITEMS = [
  {
    diff: 1,
    speakerA: 'Excuse me, could you tell me where the History Museum is?',
    speakerBPrompt: 'Choose the best response.',
    correct: 'Sure! Walk straight ahead and turn left at the second traffic light.',
    distractors: [
      'Yes, I visited the museum last Sunday with my class.',
      'No, history is not my favourite school subject.',
      'It is open from nine in the morning until six.',
      'Wait, I forgot to bring my museum ticket today.'
    ],
    rule: 'На вежливый вопрос о маршруте («Не подскажете, где музей?») логично дать точное направление движения.'
  },
  {
    diff: 1,
    speakerA: 'I’m terribly sorry for arriving ten minutes late to the study group.',
    speakerBPrompt: 'Choose the best response.',
    correct: 'That’s all right, we have only just started.',
    distractors: [
      'Thank you, it was a pleasure meeting you too.',
      'Yes, please take a seat near the window.',
      'Congratulations on passing your driving test!',
      'Not at all, I really enjoyed your birthday party.'
    ],
    rule: 'На извинение (<i>I’m terribly sorry...</i>) принято отвечать формулой принятия извинения: <i>That’s all right / Never mind</i>.'
  },
  {
    diff: 1,
    speakerA: 'Would you like a cup of hot green tea with lemon?',
    speakerBPrompt: 'Choose the best response.',
    correct: 'Yes, please. That would be lovely.',
    distractors: [
      'Yes, I drank two cups of tea yesterday.',
      'No, the kettle is on the kitchen table.',
      'You’re welcome, come again soon.',
      'I’m sorry to hear that news.'
    ],
    rule: 'На вежливое предложение (<i>Would you like...?</i>) уместно ответить согласием <i>Yes, please. That would be lovely.</i>'
  },
  {
    diff: 2,
    speakerA: 'Would you mind closing the window? It’s getting rather chilly in here.',
    speakerBPrompt: 'Choose the best response.',
    correct: 'Not at all. I’ll close it right away.',
    distractors: [
      'Yes, of course, I won’t close it.',
      'Yes, I mind closing it very much—here you go.',
      'No, thank you, I am not hungry right now.',
      'That’s a pity, hope you feel warmer yesterday.'
    ],
    rule: 'На вопрос <i>Would you mind...?</i> («Вы не возражаете...?») согласие выполнить просьбу всегда выражается отрицанием возражения: <b>Not at all / No, of course not</b>!'
  },
  {
    diff: 2,
    speakerA: 'Let’s go cycling along the Boulevard this Saturday afternoon!',
    speakerBPrompt: 'Choose a polite refusal.',
    correct: 'I’d love to, but I have to visit my grandparents on Saturday.',
    distractors: [
      'No, bicycles are too slow for city streets.',
      'Yes, I went cycling there three weeks ago.',
      'Why didn’t you invite me last Saturday?',
      'Never mind, you will find your bicycle soon.'
    ],
    rule: 'Вежливый отказ от приглашения строится с благодарностью/сожалением и указанием причины: <i>I’d love to, but...</i>'
  },
  {
    diff: 2,
    speakerA: 'I have a terrible headache and can’t focus on my chemistry homework.',
    speakerBPrompt: 'Choose the best response.',
    correct: 'Why don’t you take a short rest and drink some water?',
    distractors: [
      'Congratulations! Chemistry is a great achievement.',
      'That sounds amazing, can I join you?',
      'Hold the line, please; I will transfer your call.',
      'No, I don’t mind if you study in the kitchen.'
    ],
    rule: 'Когда собеседник жалуется на самочувствие, естественная реакция — выразить заботу и дать дружеский совет (<i>Why don’t you...?</i>).'
  },
  {
    diff: 2,
    speakerA: 'Hello, could I speak to Dr. Hasanov, please?',
    speakerBPrompt: 'Choose the best telephone response.',
    correct: 'I’m afraid he is in a meeting right now. Would you like to leave a message?',
    distractors: [
      'Yes, please put your coat on the chair.',
      'Wait, he speaks three foreign languages fluently.',
      'Thank you, I will open the door immediately.',
      'Not at all, I’m glad you enjoyed the exhibition.'
    ],
    rule: 'Стандартная формула телефонного этикета, если адресат занят: сообщить об этом и предложить оставить сообщение.'
  },
  {
    diff: 3,
    speakerA: 'I’m so nervous about tomorrow’s university interview.',
    speakerBPrompt: 'Choose the best encouraging response.',
    correct: 'Don’t worry, you’ve prepared thoroughly and you’ll do great!',
    distractors: [
      'You shouldn’t have arrived so late to the station.',
      'I’d rather stay at home than watch that film.',
      'No problem, let me check the train timetable.',
      'Excuse me, how much does this scarf cost?'
    ],
    rule: 'Для поддержки волнующегося собеседника используется подбадривающая реплика с указанием на его готовность.'
  },
  {
    diff: 3,
    speakerA: 'Customer: “This blue jacket fits nicely, though I’m not sure about the price.”',
    speakerBPrompt: 'Choose the shop assistant’s natural reply.',
    correct: 'Actually, it’s twenty percent off today because of our seasonal sale.',
    distractors: [
      'Please fasten your seatbelt before the plane takes off.',
      'I’m afraid the library closes in fifteen minutes.',
      'Yes, you can borrow up to three books without a card.',
      'Never mind, I broke my favourite mug yesterday.'
    ],
    rule: 'В диалоге в магазине продавец логично реагирует на сомнение о цене информацией о скидке (<i>twenty percent off</i>).'
  }
];
