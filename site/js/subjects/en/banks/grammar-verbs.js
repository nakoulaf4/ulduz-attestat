// Curated banks for Verb & Clause Grammar:
// en.tenses, en.passive, en.modals, en.nonfinite, en.conditionals, en.reported-speech

export const TENSE_FRAMES = [
  // --- Diff 1: Clear markers (Past Simple, Present Simple, Present Continuous, Future Simple) ---
  { diff: 1, stem: 'Yesterday Alex <span class="gap"></span> a rare coin near the old fountain.', correct: 'found', distractors: ['finds', 'has found', 'will find', 'finding'], rule: 'Маркер законченного прошлого <i>Yesterday</i> требует Past Simple (вторая форма неправильного глагола <i>find – found – found</i>).' },
  { diff: 1, stem: 'Two days ago the students <span class="gap"></span> their science project.', correct: 'completed', distractors: ['complete', 'have completed', 'will complete', 'are completing'], rule: 'Указатель <i>Two days ago</i> относится к Past Simple; Present Perfect (<i>have completed</i>) с точным указанием времени в прошлом не употребляется.' },
  { diff: 1, stem: 'Last autumn our school choir <span class="gap"></span> first prize in Ganja.', correct: 'won', distractors: ['wins', 'has won', 'is winning', 'winning'], rule: 'Обстоятельство <i>Last autumn</i> требует Past Simple (неправильный глагол <i>win – won – won</i>).' },
  { diff: 1, stem: 'Listen! Somebody <span class="gap"></span> the violin in the next room.', correct: 'is playing', distractors: ['plays', 'played', 'has played', 'will play'], rule: 'Сигнал <i>Listen!</i> указывает на действие в момент речи — Present Continuous (<i>is playing</i>).' },
  { diff: 1, stem: 'My uncle usually <span class="gap"></span> to work by metro.', correct: 'travels', distractors: ['is travelling', 'travelled', 'travel', 'has travelled'], rule: 'Наречие регулярности <i>usually</i> и подлежащее 3-го л. ед. ч. (<i>My uncle</i>) требуют Present Simple с окончанием <b>-s</b> (<i>travels</i>).' },
  { diff: 1, stem: 'Last night my little sister <span class="gap"></span> a colourful picture of a castle.', correct: 'drew', distractors: ['drawn', 'draws', 'has drawn', 'will draw'], rule: 'Указатель <i>Last night</i> требует V2 от неправильного глагола <i>draw – drew – drawn</i> (не V3 <i>drawn</i>!).' },
  { diff: 1, stem: 'A strong wind <span class="gap"></span> down two old branches yesterday morning.', correct: 'blew', distractors: ['blown', 'blows', 'has blown', 'will blow'], rule: 'С маркером <i>yesterday morning</i> используется Past Simple: <i>blow – blew – blown</i>.' },
  { diff: 1, stem: 'Look at the dark clouds! It <span class="gap"></span> soon.', correct: 'is going to rain', distractors: ['rained', 'rains', 'has rained', 'was raining'], rule: 'Очевидный прогноз по признакам в настоящем (тёмные тучи) выражается конструкцией <i>is going to + V1</i>.' },
  { diff: 1, stem: 'In 2021 the museum <span class="gap"></span> a new wing for ancient manuscripts.', correct: 'opened', distractors: ['has opened', 'opens', 'will open', 'is opening'], rule: 'Точная дата в прошлом (<i>In 2021</i>) требует Past Simple, а не Present Perfect.' },
  { diff: 1, stem: 'She <span class="gap"></span> her favourite mug when she washed the dishes yesterday.', correct: 'broke', distractors: ['broken', 'breaks', 'has broken', 'will break'], rule: 'Указатель <i>yesterday</i> требует V2 (<i>broke</i>), а не причастие II (<i>broken</i>) и не Present Perfect.' },

  // --- Diff 2: Time clauses (when/as soon as/until/before), Present Perfect vs Past Simple, Past Continuous ---
  { diff: 2, stem: 'Wait at the entrance until the guide <span class="gap"></span> back.', correct: 'comes', distractors: ['will come', 'came', 'has come', 'coming'], rule: 'В придаточном времени после <i>until</i> для выражения будущего действия вместо <i>will</i> употребляется Present Simple (<i>comes</i>).' },
  { diff: 2, stem: 'The tourists will send us photos as soon as they <span class="gap"></span> at the hotel.', correct: 'arrive', distractors: ['will arrive', 'arrived', 'are arriving', 'had arrived'], rule: 'После союза времени <i>as soon as</i> при будущем времени в главном предложении ставится Present Simple (<i>arrive</i>).' },
  { diff: 2, stem: 'You will feel much healthier when you <span class="gap"></span> drinking enough water.', correct: 'start', distractors: ['will start', 'started', 'have started', 'were starting'], rule: 'В придаточном времени с <i>when</i> будущее время не используется — требуется Present Simple (<i>start</i>).' },
  { diff: 2, stem: 'I won’t buy that jacket before I <span class="gap"></span> it on.', correct: 'try', distractors: ['will try', 'tried', 'am trying', 'had tried'], rule: 'В придаточном времени после <i>before</i> при будущем в главном предложении используется Present Simple (<i>try</i>).' },
  { diff: 2, stem: 'We <span class="gap"></span> in Baku since my father changed his job in 2019.', correct: 'have lived', distractors: ['lived', 'are living', 'will live', 'had lived'], rule: 'Предлог <i>since</i> с точкой отсчёта в прошлом указывает на действие, начавшееся в прошлом и длящееся до сих пор — Present Perfect (<i>have lived</i>).' },
  { diff: 2, stem: 'Have you ever <span class="gap"></span> a horse across the green hills of Sheki?', correct: 'ridden', distractors: ['rode', 'ride', 'riding', 'rides'], rule: 'В вопросе Present Perfect (<i>Have you ever ...?</i>) используется третья форма глагола: <i>ride – rode – ridden</i>.' },
  { diff: 2, stem: 'While Nargiz <span class="gap"></span> dinner, the lights suddenly went out.', correct: 'was cooking', distractors: ['cooked', 'cooks', 'has cooked', 'is cooking'], rule: 'Длительное действие в прошлом на фоне внезапного события (<i>went out</i>) после <i>while</i> выражается Past Continuous (<i>was cooking</i>).' },
  { diff: 2, stem: 'The children were playing chess when their grandfather <span class="gap"></span> into the garden.', correct: 'walked', distractors: ['was walking', 'walks', 'has walked', 'had walked'], rule: 'Краткое действие, прервавшее длительный процесс в прошлом (<i>were playing</i>), выражается формой Past Simple (<i>walked</i>).' },
  { diff: 2, stem: 'Our class <span class="gap"></span> the National History Museum three times this year.', correct: 'has visited', distractors: ['visited', 'visits', 'will visit', 'was visiting'], rule: 'Незаконченный период времени (<i>this year</i>) и указание на опыт/количество раз требуют Present Perfect (<i>has visited</i>).' },
  { diff: 2, stem: 'Don’t disturb Murad right now; he <span class="gap"></span> for his chemistry test.', correct: 'is preparing', distractors: ['prepares', 'prepared', 'has prepared', 'was preparing'], rule: 'Маркер <i>right now</i> указывает на процесс в момент речи — Present Continuous (<i>is preparing</i>).' },
  { diff: 2, stem: 'My cousin <span class="gap"></span> his driving test yet, so he takes the bus.', correct: 'hasn’t passed', distractors: ['didn’t pass', 'doesn’t pass', 'won’t pass', 'hadn’t passed'], rule: 'Наречие <i>yet</i> в отрицательном предложении со связью с настоящим требует Present Perfect (<i>hasn’t passed</i>).' },
  { diff: 2, stem: 'If the bus <span class="gap"></span> late, we will take a taxi to the station.', correct: 'arrives', distractors: ['will arrive', 'arrived', 'has arrived', 'was arriving'], rule: 'В условном придаточном I типа после <i>If</i> используется Present Simple (<i>arrives</i>), а не <i>will</i>.' },

  // --- Diff 3: Past Perfect, Sequence of Tenses, Perfect Continuous ---
  { diff: 3, stem: 'By the time the rescue boat reached the shore, the storm <span class="gap"></span> .', correct: 'had stopped', distractors: ['has stopped', 'stopped', 'was stopping', 'would stop'], rule: 'Маркер <i>By the time + Past Simple</i> обозначает действие, завершившееся до другого момента в прошлом, — требуется Past Perfect (<i>had stopped</i>).' },
  { diff: 3, stem: 'She realised she <span class="gap"></span> her umbrella on the train after she got home.', correct: 'had left', distractors: ['has left', 'leaves', 'was leaving', 'will leave'], rule: 'Действие «забыла зонт» произошло раньше, чем «поняла» (<i>realised</i>), поэтому по правилу предшествования в прошлом требуется Past Perfect (<i>had left</i>).' },
  { diff: 3, stem: 'The scientist told the journalists that he <span class="gap"></span> the experiment the next morning.', correct: 'would repeat', distractors: ['will repeat', 'repeats', 'has repeated', 'is repeating'], rule: 'По правилу согласования времён после глагола в прошедшем времени (<i>told</i>) будущее относительно прошлого передаётся формой Future-in-the-Past (<i>would repeat</i>).' },
  { diff: 3, stem: 'How long <span class="gap"></span> English before you moved to London?', correct: 'had you studied', distractors: ['have you studied', 'did you study', 'do you study', 'will you study'], rule: 'Длительность/опыт до определённого момента в прошлом (<i>before you moved</i>) требует Past Perfect (<i>had you studied</i>).' },
  { diff: 3, stem: 'The streets were completely wet because it <span class="gap"></span> heavily all night.', correct: 'had been raining', distractors: ['has been raining', 'rains', 'is raining', 'will rain'], rule: 'Причина результата в прошлом (<i>were wet</i>), длившаяся всю ночь до утра, выражается Past Perfect Continuous (<i>had been raining</i>).' },
  { diff: 3, stem: 'Hardly had the concert begun when the electricity <span class="gap"></span> out.', correct: 'went', distractors: ['had gone', 'has gone', 'goes', 'will go'], rule: 'В конструкции <i>Hardly had + S + V3 when + S + Past Simple</i> второе событие стоит в Past Simple (<i>went</i>).' },
  { diff: 3, stem: 'By next June, my elder brother <span class="gap"></span> from university.', correct: 'will have graduated', distractors: ['graduated', 'has graduated', 'is graduating', 'had graduated'], rule: 'Предлог <i>By + будущее время</i> (<i>By next June</i>) указывает на завершение действия к будущему моменту — Future Perfect (<i>will have graduated</i>).' },
  { diff: 3, stem: 'They <span class="gap"></span> for the train for forty minutes when the announcement finally came.', correct: 'had been waiting', distractors: ['have been waiting', 'are waiting', 'wait', 'will wait'], rule: 'Длительное ожидание до наступления события в прошлом (<i>when ... came</i>) требует Past Perfect Continuous (<i>had been waiting</i>).' }
];

export const PASSIVE_CONVERSIONS = [
  {
    diff: 1,
    active: 'The baker makes fresh bread every morning.',
    correct: 'Fresh bread is made by the baker every morning.',
    distractors: [
      'Fresh bread was made by the baker every morning.',
      'Fresh bread are made by the baker every morning.',
      'The baker is made fresh bread every morning.',
      'Fresh bread has been made by the baker every morning.'
    ],
    rule: 'Present Simple Active (<i>makes</i>) переходит в Present Simple Passive: <i>is/are + V3</i>. Неисчисляемое подлежащее <i>Fresh bread</i> требует <i>is made</i>.'
  },
  {
    diff: 1,
    active: 'A famous architect designed this library in 1998.',
    correct: 'This library was designed by a famous architect in 1998.',
    distractors: [
      'This library is designed by a famous architect in 1998.',
      'This library were designed by a famous architect in 1998.',
      'A famous architect was designed this library in 1998.',
      'This library designed by a famous architect in 1998.'
    ],
    rule: 'Past Simple Active (<i>designed</i>) переходит в Past Simple Passive (<i>was/were + V3</i>). С единственным числом <i>This library</i> употребляется <i>was designed</i>.'
  },
  {
    diff: 1,
    active: 'Our teacher checked all the essays yesterday.',
    correct: 'All the essays were checked by our teacher yesterday.',
    distractors: [
      'All the essays was checked by our teacher yesterday.',
      'All the essays are checked by our teacher yesterday.',
      'Our teacher was checked all the essays yesterday.',
      'All the essays have been checked by our teacher yesterday.'
    ],
    rule: 'Past Simple Active переходит в Past Simple Passive. Множественное число <i>All the essays</i> требует <i>were checked</i> (не <i>was</i>).'
  },
  {
    diff: 1,
    active: 'Volunteers clean the city park every Sunday.',
    correct: 'The city park is cleaned by volunteers every Sunday.',
    distractors: [
      'The city park are cleaned by volunteers every Sunday.',
      'The city park was cleaned by volunteers every Sunday.',
      'Volunteers are cleaned the city park every Sunday.',
      'The city park is cleaning by volunteers every Sunday.'
    ],
    rule: 'Present Simple Active (<i>clean</i>) → <i>is cleaned</i> для подлежащего в ед. ч. <i>The city park</i>.'
  },
  {
    diff: 1,
    active: 'The gardener planted twenty rose bushes near the gate.',
    correct: 'Twenty rose bushes were planted by the gardener near the gate.',
    distractors: [
      'Twenty rose bushes was planted by the gardener near the gate.',
      'Twenty rose bushes are planted by the gardener near the gate.',
      'The gardener was planted twenty rose bushes near the gate.',
      'Twenty rose bushes had planted by the gardener near the gate.'
    ],
    rule: 'Past Simple Active (<i>planted</i>) с новым подлежащим во мн. ч. (<i>Twenty rose bushes</i>) даёт <i>were planted</i>.'
  },
  {
    diff: 2,
    active: 'The committee has approved the new rules.',
    correct: 'The new rules have been approved by the committee.',
    distractors: [
      'The new rules has been approved by the committee.',
      'The new rules are approved by the committee.',
      'The committee has been approved the new rules.',
      'The new rules were approved by the committee.'
    ],
    rule: 'Present Perfect Active (<i>has approved</i>) переходит в Present Perfect Passive. Множественное число <i>The new rules</i> требует <i>have been approved</i> (не <i>has</i>).'
  },
  {
    diff: 2,
    active: 'The engineer will test the solar panels tomorrow.',
    correct: 'The solar panels will be tested by the engineer tomorrow.',
    distractors: [
      'The solar panels will tested by the engineer tomorrow.',
      'The solar panels are tested by the engineer tomorrow.',
      'The engineer will be tested the solar panels tomorrow.',
      'The solar panels were tested by the engineer tomorrow.'
    ],
    rule: 'Future Simple Active (<i>will test</i>) в страдательном залоге образуется по схеме <i>will be + V3</i> (<i>will be tested</i>).'
  },
  {
    diff: 2,
    active: 'Someone has stolen two bicycles from the courtyard.',
    correct: 'Two bicycles have been stolen from the courtyard.',
    distractors: [
      'Two bicycles has been stolen from the courtyard.',
      'Two bicycles were stolen from the courtyard.',
      'Two bicycles are stolen from the courtyard.',
      'Two bicycles have stolen from the courtyard.'
    ],
    rule: 'Present Perfect Active (<i>has stolen</i>) → Present Perfect Passive (<i>have been stolen</i> для мн. ч. <i>Two bicycles</i>); неопределённый субъект <i>Someone</i> опускается.'
  },
  {
    diff: 2,
    active: 'Workers are repairing the old bridge right now.',
    correct: 'The old bridge is being repaired by workers right now.',
    distractors: [
      'The old bridge is repaired by workers right now.',
      'The old bridge was being repaired by workers right now.',
      'The old bridge are being repaired by workers right now.',
      'Workers are being repaired the old bridge right now.'
    ],
    rule: 'Present Continuous Active (<i>are repairing</i>) в пассиве требует вспомогательной связки <i>being</i>: <i>is being repaired</i>.'
  },
  {
    diff: 2,
    active: 'Students must return library books on time.',
    correct: 'Library books must be returned on time.',
    distractors: [
      'Library books must returned on time.',
      'Library books must been returned on time.',
      'Students must be returned library books on time.',
      'Library books are must returned on time.'
    ],
    rule: 'После модального глагола <i>must</i> страдательный залог строится по модели <i>must + be + V3</i> (<i>must be returned</i>).'
  },
  {
    diff: 3,
    active: 'Nobody had noticed the tiny crack before the inspection.',
    correct: 'The tiny crack had not been noticed before the inspection.',
    distractors: [
      'The tiny crack had been noticed before the inspection.',
      'The tiny crack was not noticed before the inspection.',
      'The tiny crack has not been noticed before the inspection.',
      'The tiny crack had not noticed before the inspection.'
    ],
    rule: 'Past Perfect Active с отрицательным местоимением <i>Nobody</i> в пассиве сохраняет отрицание и время: <i>had not been noticed</i>.'
  },
  {
    diff: 3,
    active: 'They were painting the museum walls when we arrived.',
    correct: 'The museum walls were being painted when we arrived.',
    distractors: [
      'The museum walls was being painted when we arrived.',
      'The museum walls were painted when we arrived.',
      'The museum walls are being painted when we arrived.',
      'The museum walls had been painted when we arrived.'
    ],
    rule: 'Past Continuous Active (<i>were painting</i>) переходит в Past Continuous Passive: <i>were being painted</i>.'
  },
  {
    diff: 3,
    active: 'The company will have finished the metro line by December.',
    correct: 'The metro line will have been finished by December.',
    distractors: [
      'The metro line will be finished by December.',
      'The metro line has been finished by December.',
      'The metro line will have finished by December.',
      'The metro line had been finished by December.'
    ],
    rule: 'Future Perfect Active (<i>will have finished</i>) переходит в Future Perfect Passive: <i>will have been finished</i>.'
  }
];

export const PASSIVE_TRANSITIVE = [
  'The chef prepared a delicious dinner for the guests.',
  'My classmates planted twelve young trees in the yard.',
  'A local journalist interviewed the young violinist.',
  'The mechanic repaired the bicycle before noon.',
  'Heavy snow blocked the mountain road last night.',
  'Our librarian ordered fifty new English dictionaries.',
  'The artist painted a bright portrait of her grandmother.',
  'A sudden storm damaged several fishing boats.',
  'The director announced the exam schedule yesterday.',
  'Students clean the laboratory tables after each lesson.',
  'The postman delivered two urgent parcels this morning.',
  'A skilled carpenter built this oak bookcase.'
];

export const PASSIVE_INTRANSITIVE = [
  'The train arrived at the central station on time.',
  'Baku is the largest city on the Caspian coast.',
  'Alice went to the library to borrow a history book.',
  'Our neighbours slept peacefully during the quiet night.',
  'The strange accident happened near the crossroads.',
  'Young birds flew south before the first frost.',
  'The weather became warmer in late April.',
  'My little brother sat quietly beside the window.',
  'The tired hikers walked slowly up the rocky hill.',
  'Those autumn leaves fell onto the wet pavement.',
  'The medicine seemed effective after three days.',
  'Sabina lives in a bright apartment near the park.'
];

export const MODAL_FRAMES = [
  { diff: 1, stem: 'My sister <span class="gap"></span> play the piano well, but my brother <span class="gap"></span> .', correct: 'can, can’t', distractors: ['can, isn’t able', 'can’t, can’t', 'can, can', 'is able, can’t'], rule: 'После <i>be able</i> перед инфинитивом обязательна частица <i>to</i> (здесь её нет), а союз <i>but</i> требует противоположных по смыслу форм: <i>can, can’t</i>.' },
  { diff: 1, stem: 'I <span class="gap"></span> lift the suitcase because it was far too heavy.', correct: 'couldn’t', distractors: ['wasn’t able', 'hadn’t to', 'ought', 'was able'], rule: 'Формы <i>was able, wasn’t able, ought</i> требуют после себя частицы <i>to</i>, а отрицания <i>hadn’t to</i> не существует. Верна форма <i>couldn’t</i>.' },
  { diff: 1, stem: 'You <span class="gap"></span> cross the street when the traffic light is red.', correct: 'mustn’t', distractors: ['needn’t', 'don’t have', 'ought', 'haven’t to'], rule: 'Запрет выражается глаголом <i>mustn’t</i> («нельзя»). <i>Ought</i> и <i>don’t have</i> требуют <i>to</i>, а <i>needn’t</i> означает «не нужно».' },
  { diff: 1, stem: 'Little Samir <span class="gap"></span> swim very fast when he was only six.', correct: 'could', distractors: ['was able', 'can', 'is able', 'ought'], rule: 'Способность в прошлом (<i>when he was only six</i>) без частицы <i>to</i> передаётся формой <i>could</i>.' },
  { diff: 1, stem: 'Students <span class="gap"></span> wear a warm coat today because the sun is shining.', correct: 'don’t have to', distractors: ['mustn’t to', 'haven’t to', 'ought not', 'needn’t to'], rule: 'Отсутствие необходимости («не нужно») передаётся конструкцией <i>don’t have to</i>. Модальные глаголы <i>mustn’t</i> и <i>needn’t</i> не принимают <i>to</i>, а <i>haven’t to</i> неверно.' },
  { diff: 2, stem: 'Yesterday the bus broke down, so we <span class="gap"></span> walk three kilometres home.', correct: 'had to', distractors: ['must', 'have to', 'ought', 'could to'], rule: 'Вынужденная необходимость в прошлом (<i>Yesterday</i>) выражается только формой <i>had to</i> (глагол <i>must</i> не имеет формы прошедшего времени).' },
  { diff: 2, stem: 'Fortunately, it was Sunday, so Lala <span class="gap"></span> wake up early.', correct: 'didn’t have to', distractors: ['hadn’t to', 'mustn’t', 'doesn’t have to', 'needn’t to'], rule: 'Отрицание глагола <i>had to</i> в прошлом строится через вспомогательный глагол <i>didn’t have to</i> (не <i>hadn’t to</i>!).' },
  { diff: 2, stem: 'You <span class="gap"></span> to apologize to your friend for being late.', correct: 'ought', distractors: ['should', 'must', 'can', 'may'], rule: 'После пропуска стоит частица <i>to</i> (<i>to apologize</i>). Из перечисленных глаголов только <i>ought</i> употребляется с <i>to</i> (<i>ought to</i>).' },
  { diff: 2, stem: 'The fog was so thick that the pilot <span class="gap"></span> see the runway clearly.', correct: 'couldn’t', distractors: ['wasn’t able', 'didn’t able', 'can’t', 'hadn’t to'], rule: 'Речь идёт о прошлом (<i>was</i>), а после пропуска нет частицы <i>to</i> — следовательно, единственно верна форма <i>couldn’t</i>.' },
  { diff: 2, stem: 'We have plenty of bread at home, so you <span class="gap"></span> buy any more.', correct: 'needn’t', distractors: ['mustn’t', 'don’t need', 'oughtn’t', 'haven’t to'], rule: 'Отсутствие необходимости без частицы <i>to</i> выражается модальным глаголом <i>needn’t</i> (<i>don’t need</i> и <i>oughtn’t</i> требуют <i>to</i>, а <i>mustn’t</i> означает запрет).' },
  { diff: 2, stem: 'Will the new bridge <span class="gap"></span> withstand strong Caspian winds?', correct: 'be able to', distractors: ['can', 'could', 'able to', 'ought'], rule: 'После вспомогательного глагола будущего времени <i>Will</i> используется эквивалент <i>be able to</i> (глаголы <i>can</i> и <i>could</i> с <i>will</i> не сочетаются).' },
  { diff: 3, stem: 'Tariq speaks fluent Japanese, so he <span class="gap"></span> to translate the manual himself.', correct: 'is able', distractors: ['could', 'can', 'might', 'should'], rule: 'При наличии частицы <i>to</i> перед инфинитивом (<i>to translate</i>) в настоящем времени (<i>speaks</i>) используется эквивалент <i>is able</i>; чистые модальные глаголы <i>could / can / might / should</i> не сочетаются с <i>to</i>.' },
  { diff: 3, stem: 'You <span class="gap"></span> touch electrical wires with wet hands; it is extremely dangerous.', correct: 'mustn’t', distractors: ['don’t have to', 'needn’t', 'couldn’t to', 'haven’t to'], rule: 'Строгий запрет по технике безопасности выражается через <i>mustn’t</i> («ни в коем случае нельзя»), а <i>don’t have to / needn’t</i> означают лишь отсутствие необходимости.' },
  { diff: 3, stem: 'Does your cousin <span class="gap"></span> to work on Saturdays this month?', correct: 'have', distractors: ['must', 'should', 'ought', 'needn’t'], rule: 'В вопросе со вспомогательным <i>Does</i> и частицей <i>to</i> перед инфинитивом употребляется только <i>have</i> (<i>Does ... have to work?</i>).' }
];

export const NONFINITE_COMPLEX_PAIR = [
  { diff: 2, stem: 'The coach <span class="gap"></span> the players to arrive thirty minutes earlier.', toVerbs: ['asked', 'expected', 'told', 'advised', 'allowed'], bareVerbs: ['let', 'made'], rule: 'После глаголов <i>asked / expected / told / advised / allowed</i> в Complex Object инфинитив употребляется с частицей <i>to</i>, а после <i>let</i> и <i>make</i> — без <i>to</i>.' },
  { diff: 2, stem: 'Our teacher <span class="gap"></span> the pupils to check every equation twice.', toVerbs: ['reminded', 'wanted', 'expected', 'told', 'asked'], bareVerbs: ['made', 'let'], rule: 'Глаголы <i>reminded / wanted / expected / told / asked</i> требуют <i>to</i> перед вторым глаголом (<i>to check</i>), в отличие от <i>made</i> и <i>let</i>.' },
  { diff: 2, stem: 'The manager <span class="gap"></span> his assistants to prepare the annual report by Monday.', toVerbs: ['ordered', 'asked', 'expected', 'allowed'], bareVerbs: ['let', 'made'], rule: 'С полным инфинитивом (<i>to prepare</i>) употребляются <i>ordered / asked / expected / allowed</i>; <i>let</i> и <i>make</i> не допускают <i>to</i> в активе.' },
  { diff: 3, stem: 'My parents never <span class="gap"></span> me stay up past midnight on school nights.', toVerbs: ['allow', 'force', 'expect', 'tell'], bareVerbs: ['let', 'make'], rule: 'В предложении после дополнения <i>me</i> стоит инфинитив <b>без <i>to</i></b> (<i>stay</i>), поэтому подходят только <i>let</i> и <i>make</i>.' },
  { diff: 3, stem: 'Did the loud thunder <span class="gap"></span> the little puppy hide under the sofa?', toVerbs: ['force', 'cause', 'allow', 'tell'], bareVerbs: ['make', 'let'], rule: 'Перед инфинитивом без частицы <i>to</i> (<i>hide</i>) в Complex Object возможны только каузативные глаголы <i>make</i> и <i>let</i>.' }
];

export const NONFINITE_SINGLE = [
  { diff: 1, stem: 'We wanted our guests <span class="gap"></span> the traditional tea ceremony.', correct: 'to enjoy', distractors: ['enjoy', 'enjoying', 'enjoyed', 'to enjoying'], rule: 'После глагола <i>want</i> в конструкции сложного дополнения используется инфинитив с частицей <i>to</i> (<i>wanted ... to enjoy</i>).' },
  { diff: 1, stem: 'My mother doesn’t let my little sister <span class="gap"></span> outside after dark.', correct: 'play', distractors: ['to play', 'playing', 'played', 'to playing'], rule: 'После глагола <i>let</i> в сложном дополнении ставится голый инфинитив без частицы <i>to</i> (<i>let sb play</i>).' },
  { diff: 1, stem: 'Rainy weather made the hikers <span class="gap"></span> inside the mountain cabin.', correct: 'stay', distractors: ['to stay', 'staying', 'stayed', 'to staying'], rule: 'После каузативного глагола <i>make</i> в действительном залоге употребляется инфинитив без <i>to</i> (<i>made ... stay</i>).' },
  { diff: 1, stem: 'Do you enjoy <span class="gap"></span> historical novels during long winter evenings?', correct: 'reading', distractors: ['to read', 'read', 'reads', 'to reading'], rule: 'Глагол <i>enjoy</i> всегда требует после себя герундий (форму на <i>-ing</i>): <i>enjoy reading</i>.' },
  { diff: 1, stem: 'They decided <span class="gap"></span> the ancient fortress before sunset.', correct: 'to visit', distractors: ['visiting', 'visit', 'visited', 'to visiting'], rule: 'После глагола <i>decide</i> употребляется инфинитив с частицей <i>to</i> (<i>decided to visit</i>).' },
  { diff: 2, stem: 'I am really looking forward to <span class="gap"></span> my cousins in Sheki.', correct: 'meeting', distractors: ['meet', 'met', 'have met', 'meets'], rule: 'В выражении <i>look forward to</i> слово <i>to</i> является предлогом, поэтому после него обязателен герундий (<i>meeting</i>).' },
  { diff: 2, stem: 'You should avoid <span class="gap"></span> too much salt when preparing soup.', correct: 'adding', distractors: ['to add', 'add', 'added', 'to adding'], rule: 'После глагола <i>avoid</i> употребляется только герундий (<i>avoid adding</i>).' },
  { diff: 2, stem: 'Aydan suggested <span class="gap"></span> a short break beside the waterfall.', correct: 'taking', distractors: ['to take', 'take', 'took', 'to taking'], rule: 'Глагол <i>suggest</i> требует герундия (<i>suggested taking</i>), а не инфинитива с <i>to</i>.' },
  { diff: 2, stem: 'The documentary about deep-sea whales was so <span class="gap"></span> that nobody looked away.', correct: 'fascinating', distractors: ['fascinated', 'fascinate', 'to fascinate', 'fascinates'], rule: 'Для характеристики предмета/фильма, вызывающего эмоцию, используется активное причастие на <i>-ing</i> (<i>fascinating</i>), а не <i>-ed</i>.' },
  { diff: 2, stem: 'All the passengers felt <span class="gap"></span> after waiting three hours at the terminal.', correct: 'exhausted', distractors: ['exhausting', 'exhaust', 'to exhaust', 'exhausts'], rule: 'Эмоциональное/физическое состояние человека передаётся причастием II на <i>-ed</i> (<i>felt exhausted</i>).' },
  { diff: 3, stem: 'The witnesses were made <span class="gap"></span> outside the courtroom for an hour.', correct: 'to wait', distractors: ['wait', 'waiting', 'waited', 'to waiting'], rule: 'Хотя в активе <i>make</i> употребляется без <i>to</i>, в страдательном залоге (<i>were made</i>) частица <i>to</i> обязательна: <i>were made to wait</i>.' },
  { diff: 3, stem: 'Before leaving the house, please remember <span class="gap"></span> the kitchen window.', correct: 'to lock', distractors: ['locking', 'lock', 'locked', 'to locking'], rule: '<i>Remember + to V</i> означает «не забыть сделать что-то в будущем», тогда как <i>remember + V-ing</i> — помнить уже совершённое в прошлом.' },
  { diff: 3, stem: 'My grandfather gave up <span class="gap"></span> coffee after his doctor’s advice.', correct: 'drinking', distractors: ['to drink', 'drink', 'drank', 'to drinking'], rule: 'Фразовый глагол <i>give up</i> («бросить привычку») всегда требует герундия (<i>drinking</i>).' },
  { diff: 3, stem: 'I saw the eagle <span class="gap"></span> high above the snowy cliffs.', correct: 'soaring', distractors: ['to soar', 'to soaring', 'soared', 'soars'], rule: 'После глаголов восприятия (<i>see, hear, watch</i>) для передачи процесса действия используется причастие I (<i>soaring</i>) или голый инфинитив, но не инфинитив с <i>to</i>.' }
];

export const CONDITIONAL_FRAMES = [
  { diff: 1, stem: 'If you heat ice above zero degrees, it <span class="gap"></span> into water.', correct: 'turns', distractors: ['turned', 'would turn', 'had turned', 'turning'], rule: 'Нулевой тип условия (Zero Conditional, закон природы): <i>If + Present Simple, Present Simple</i> (<i>turns</i>).' },
  { diff: 1, stem: 'If Rustam <span class="gap"></span> early tomorrow, we will catch the morning ferry.', correct: 'wakes up', distractors: ['will wake up', 'woke up', 'would wake up', 'had woken up'], rule: 'First Conditional (реальное будущее): в <i>if</i>-части используется Present Simple (<i>wakes up</i>), а не <i>will</i>.' },
  { diff: 1, stem: 'We will miss the opening speech unless we <span class="gap"></span> immediately.', correct: 'leave', distractors: ['will leave', 'don’t leave', 'left', 'would leave'], rule: 'Союз <i>unless</i> («если не») уже несёт отрицание и требует утвердительной формы Present Simple (<i>leave</i>).' },
  { diff: 2, stem: 'If I <span class="gap"></span> more free time right now, I would learn to play the tar.', correct: 'had', distractors: ['have', 'will have', 'would have', 'had had'], rule: 'Second Conditional (нереальное настоящее, в главной части <i>would learn</i>): в <i>if</i>-части ставится Past Simple (<i>had</i>).' },
  { diff: 2, stem: 'What would you buy if you <span class="gap"></span> the science competition?', correct: 'won', distractors: ['win', 'will win', 'would win', 'had won'], rule: 'Second Conditional (<i>would you buy</i>): в условном придаточном требуется Past Simple (<i>won</i>).' },
  { diff: 2, stem: 'If I <span class="gap"></span> you, I would accept that scholarship offer without hesitation.', correct: 'were', distractors: ['am', 'will be', 'would be', 'had been'], rule: 'Устойчивая форма сослагательного наклонения в Second Conditional: <i>If I were you, I would...</i>.' },
  { diff: 2, stem: 'She <span class="gap"></span> a better grade if she revised her notes every evening.', correct: 'would get', distractors: ['will get', 'got', 'gets', 'had got'], rule: 'Second Conditional (в <i>if</i>-части Past Simple <i>revised</i>): в главной части требуется <i>would + V1</i> (<i>would get</i>).' },
  { diff: 2, stem: 'Unless the weather improves soon, the mountain trail <span class="gap"></span> closed.', correct: 'will stay', distractors: ['stays', 'would stay', 'stayed', 'had stayed'], rule: 'First Conditional с <i>unless</i>: в главном предложении используется Future Simple (<i>will stay</i>).' },
  { diff: 3, stem: 'If the driver had checked the map earlier, we <span class="gap"></span> lost in the fog.', correct: 'wouldn’t have got', distractors: ['won’t get', 'wouldn’t get', 'didn’t get', 'hadn’t got'], rule: 'Third Conditional (нереальное прошлое, <i>had checked</i>): в главной части требуется <i>would(n’t) have + V3</i>.' },
  { diff: 3, stem: 'If they <span class="gap"></span> the train yesterday, they would have arrived in time for dinner.', correct: 'had caught', distractors: ['caught', 'would catch', 'have caught', 'will catch'], rule: 'Third Conditional (в главной части <i>would have arrived</i>): в <i>if</i>-части используется Past Perfect (<i>had caught</i>).' },
  { diff: 3, stem: 'I wish I <span class="gap"></span> speak Spanish fluently during my trip next month.', correct: 'could', distractors: ['can', 'will', 'may', 'have'], rule: 'Конструкция <i>I wish</i> для сожаления о настоящей/будущей способности требует прошедшей формы <i>could</i> (сдвиг на шаг назад).' },
  { diff: 3, stem: 'Murad wishes he <span class="gap"></span> his camera at home before climbing the tower yesterday.', correct: 'hadn’t left', distractors: ['didn’t leave', 'hasn’t left', 'wouldn’t leave', 'doesn’t leave'], rule: 'Сожаление о прошлом событии (<i>yesterday</i>) после <i>wish</i> выражается формой Past Perfect (<i>hadn’t left</i>).' }
];

export const REPORTED_FRAMES = [
  {
    diff: 1,
    direct: 'Leila said: “I am reading a fascinating biography.”',
    correct: 'Leila said that she was reading a fascinating biography.',
    distractors: [
      'Leila said that she is reading a fascinating biography.',
      'Leila said that I was reading a fascinating biography.',
      'Leila said that she had read a fascinating biography.',
      'Leila said that she will read a fascinating biography.'
    ],
    rule: 'При переводе в косвенную речь после <i>said</i> происходит сдвиг: <i>I → she</i>, Present Continuous (<i>am reading</i>) → Past Continuous (<i>was reading</i>).'
  },
  {
    diff: 1,
    direct: 'The librarian told us: “Please keep quiet in the reading room.”',
    correct: 'The librarian asked us to keep quiet in the reading room.',
    distractors: [
      'The librarian asked us keep quiet in the reading room.',
      'The librarian asked us that we kept quiet in the reading room.',
      'The librarian told to us to keep quiet in the reading room.',
      'The librarian asked us keeping quiet in the reading room.'
    ],
    rule: 'Просьбы и команды в косвенной речи передаются инфинитивом с частицей <i>to</i>: <i>asked/told somebody to do</i>.'
  },
  {
    diff: 1,
    direct: 'Doctor Karim advised him: “Don’t drink icy water.”',
    correct: 'Doctor Karim advised him not to drink icy water.',
    distractors: [
      'Doctor Karim advised him to not drink icy water.',
      'Doctor Karim advised him didn’t drink icy water.',
      'Doctor Karim advised him don’t drink icy water.',
      'Doctor Karim advised him not drinking icy water.'
    ],
    rule: 'Отрицательное повеление в косвенной речи строится по схеме: <i>advised/told sb <b>not to</b> + V1</i>.'
  },
  {
    diff: 2,
    direct: 'The visitor asked me: “Do you speak Azerbaijani?”',
    correct: 'The visitor asked me if I spoke Azerbaijani.',
    distractors: [
      'The visitor asked me did I speak Azerbaijani.',
      'The visitor asked me if did I speak Azerbaijani.',
      'The visitor asked me that I speak Azerbaijani.',
      'The visitor asked me if I speak Azerbaijani.'
    ],
    rule: 'Общий вопрос в косвенной речи вводится союзом <i>if/whether</i>, имеет <b>прямой порядок слов</b> (без <i>did</i>) и сдвиг <i>speak → spoke</i>.'
  },
  {
    diff: 2,
    direct: 'Mother asked Fuad: “Where have you put the house keys?”',
    correct: 'Mother asked Fuad where he had put the house keys.',
    distractors: [
      'Mother asked Fuad where had he put the house keys.',
      'Mother asked Fuad where he has put the house keys.',
      'Mother asked Fuad where did he put the house keys.',
      'Mother asked Fuad if where he put the house keys.'
    ],
    rule: 'Специальный вопрос в косвенной речи сохраняет прямой порядок слов (<i>he had put</i>) и сдвигает Present Perfect → Past Perfect.'
  },
  {
    diff: 2,
    direct: 'Orkhan promised: “I will return the dictionary tomorrow.”',
    correct: 'Orkhan promised that he would return the dictionary the next day.',
    distractors: [
      'Orkhan promised that he will return the dictionary tomorrow.',
      'Orkhan promised that he would return the dictionary yesterday.',
      'Orkhan promised that I would return the dictionary the next day.',
      'Orkhan promised that he returned the dictionary the next day.'
    ],
    rule: 'В косвенной речи после <i>promised</i> время <i>will → would</i>, а указатель <i>tomorrow → the next day</i>.'
  },
  {
    diff: 3,
    direct: 'Samira explained: “I bought this silk scarf here yesterday.”',
    correct: 'Samira explained that she had bought that silk scarf there the day before.',
    distractors: [
      'Samira explained that she bought this silk scarf here yesterday.',
      'Samira explained that she has bought that silk scarf there the day before.',
      'Samira explained that she had bought that silk scarf here tomorrow.',
      'Samira explained that I had bought that silk scarf there the day before.'
    ],
    rule: 'Комплексный сдвиг после <i>explained</i>: Past Simple (<i>bought</i>) → Past Perfect (<i>had bought</i>), <i>this → that</i>, <i>here → there</i>, <i>yesterday → the day before</i>.'
  },
  {
    diff: 3,
    direct: 'The tourist asked the clerk: “How long will the ferry trip take?”',
    correct: 'The tourist asked the clerk how long the ferry trip would take.',
    distractors: [
      'The tourist asked the clerk how long would the ferry trip take.',
      'The tourist asked the clerk how long will the ferry trip take.',
      'The tourist asked the clerk if how long the ferry trip would take.',
      'The tourist asked the clerk how long the ferry trip took.'
    ],
    rule: 'В косвенном специальном вопросе подлежащее (<i>the ferry trip</i>) стоит перед <i>would take</i>, вопросительная инверсия недопустима.'
  }
];
