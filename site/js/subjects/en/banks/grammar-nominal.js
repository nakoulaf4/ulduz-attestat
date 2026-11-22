// Curated banks for Nominal & Modifier Grammar:
// en.nouns, en.articles, en.pronouns, en.quantifiers, en.adjectives-adverbs, en.prepositions

export const COMPOUND_NOUNS = [
  'bookshelf', 'shoemaker', 'snowdrop', 'mindset', 'waterfall',
  'playground', 'airmail', 'postman', 'bathroom', 'gentleman',
  'toothbrush', 'notebook', 'sunlight', 'lighthouse', 'raincoat',
  'airport', 'homework', 'football', 'timetable', 'classroom',
  'railway', 'windmill', 'headache', 'newspaper', 'butterfly',
  'keyboard', 'armchair', 'seashell', 'sunflower', 'fingerprint',
  'backpack', 'blackboard', 'daylight', 'earthquake', 'firefighter',
  'greenhouse', 'handwriting', 'landmark', 'moonlight', 'password',
  'postcard', 'rainbow', 'riverbank', 'schoolyard', 'spaceship',
  'strawberry', 'sunglasses', 'teacup', 'weekend', 'wheelchair'
];

export const DERIVATIVE_NOUNS = [
  { word: 'information', suffix: '-tion' },
  { word: 'darkness', suffix: '-ness' },
  { word: 'agreement', suffix: '-ment' },
  { word: 'brotherhood', suffix: '-hood' },
  { word: 'friendship', suffix: '-ship' },
  { word: 'kindness', suffix: '-ness' },
  { word: 'education', suffix: '-tion' },
  { word: 'development', suffix: '-ment' },
  { word: 'childhood', suffix: '-hood' },
  { word: 'leadership', suffix: '-ship' },
  { word: 'happiness', suffix: '-ness' },
  { word: 'movement', suffix: '-ment' },
  { word: 'freedom', suffix: '-dom' },
  { word: 'wisdom', suffix: '-dom' },
  { word: 'attention', suffix: '-tion' },
  { word: 'invitation', suffix: '-tion' },
  { word: 'achievement', suffix: '-ment' },
  { word: 'pollution', suffix: '-tion' },
  { word: 'neighbourhood', suffix: '-hood' },
  { word: 'membership', suffix: '-ship' },
  { word: 'excitement', suffix: '-ment' },
  { word: 'weakness', suffix: '-ness' },
  { word: 'invention', suffix: '-tion' },
  { word: 'collection', suffix: '-tion' },
  { word: 'importance', suffix: '-ance' },
  { word: 'difference', suffix: '-ence' },
  { word: 'possibility', suffix: '-ity' },
  { word: 'responsibility', suffix: '-ity' },
  { word: 'government', suffix: '-ment' },
  { word: 'equipment', suffix: '-ment' },
  { word: 'scholarship', suffix: '-ship' },
  { word: 'loneliness', suffix: '-ness' },
  { word: 'decision', suffix: '-sion' },
  { word: 'discussion', suffix: '-sion' },
  { word: 'celebration', suffix: '-tion' },
  { word: 'generosity', suffix: '-ity' },
  { word: 'hospitality', suffix: '-ity' },
  { word: 'confidence', suffix: '-ence' },
  { word: 'patience', suffix: '-ence' },
  { word: 'kingdom', suffix: '-dom' }
];

export const PARTITIVE_PHRASES = [
  { good: 'a cup of tea', bad: 'a cups of tea', reason: 'после артикля <i>a</i> исчисляемое слово <i>cup</i> должно стоять в единственном числе' },
  { good: 'a bar of chocolate', bad: 'two bar of chocolate', reason: 'после числительного <i>two</i> существительное <i>bar</i> требует множественного числа (<i>two bars</i>)' },
  { good: 'a slice of bread', bad: 'three slice of bread', reason: 'после <i>three</i> слово <i>slice</i> должно иметь окончание <i>-s</i> (<i>three slices</i>)' },
  { good: 'a glass of water', bad: 'a glasses of water', reason: 'артикль <i>a</i> не употребляется с множественным числом <i>glasses</i>' },
  { good: 'two kilos of sugar', bad: 'two kilo of sugar', reason: 'после числительного <i>two</i> слово <i>kilo</i> должно стоять во множественном числе (<i>kilos</i>)' },
  { good: 'a piece of advice', bad: 'an advice', reason: 'существительное <i>advice</i> неисчисляемое и не употребляется с неопределённым артиклем <i>an</i>' },
  { good: 'a bottle of milk', bad: 'four bottle of milk', reason: 'после <i>four</i> слово <i>bottle</i> требует множественного числа (<i>four bottles</i>)' },
  { good: 'three loaves of bread', bad: 'a loaves of bread', reason: 'артикль <i>a</i> несовместим с формой множественного числа <i>loaves</i>' },
  { good: 'a pair of scissors', bad: 'a scissors', reason: 'парное существительное <i>scissors</i> употребляется во множественном числе и не принимает артикль <i>a</i> без слова <i>pair</i>' },
  { good: 'two bowls of soup', bad: 'two bowl of soup', reason: 'после <i>two</i> слово <i>bowl</i> должно стоять во множественном числе (<i>two bowls</i>)' },
  { good: 'a drop of honey', bad: 'a drops of honey', reason: 'артикль <i>a</i> требует единственного числа <i>drop</i>' },
  { good: 'five sheets of paper', bad: 'five sheet of paper', reason: 'после числительного <i>five</i> нужно <i>sheets</i>, а не <i>sheet</i>' },
  { good: 'a jar of jam', bad: 'two jar of jam', reason: 'после <i>two</i> требуется форма <i>jars</i>' },
  { good: 'a lump of sugar', bad: 'three lump of sugar', reason: 'после <i>three</i> требуется форма <i>lumps</i>' }
];

export const POSSESSIVE_NUMERAL_FRAMES = [
  { diff: 2, stem: 'Choose the sentence with the noun in the Possessive Case.', correct: 'The children’s playground was renovated last spring.', distractors: ['The boy’s reading a detective novel now.', 'My friend’s arrived from Lankaran.', 'Today’s very sunny and warm.', 'Her brother’s got a new chess set.'], rule: 'В правильном варианте <i>children’s</i> обозначает принадлежность («детская площадка»). В дистракторах <i>’s</i> — это сокращение от <i>is</i> (<i>boy’s reading, today’s</i>) или <i>has</i> (<i>friend’s arrived, brother’s got</i>).' },
  { diff: 2, stem: 'Choose the sentence with the noun in the Possessive Case.', correct: 'We spent a lovely weekend at the Aliyevs’ cottage.', distractors: ['Sabina’s going to enter the art contest.', 'Our neighbour’s bought an electric bike.', 'It’s getting dark earlier in November.', 'The museum’s located near the old fortress.'], rule: 'Окончание <i>s’</i> после фамилии во множественном числе (<i>the Aliyevs’ cottage</i> — коттедж семьи Алиевых) выражает притяжательный падеж. В остальных вариантах <i>’s</i> означает <i>is</i> или <i>has</i>.' },
  { diff: 3, stem: 'Choose the correct option.<br><i><span class="gap"></span> eyes were tired after reading all evening.</i>', correct: 'Aydan’s and Leyla’s', distractors: ['Aydan and Leyla’s', 'Aydan’s and Leyla', 'Aydans’ and Leylas’', 'Aydan and Leylas’'], rule: 'Глаза принадлежат каждой девушке по отдельности (и существительное <i>eyes</i> во мн. ч.), поэтому показатель <b>’s</b> ставится после <b>обоих</b> имён: <i>Aydan’s and Leyla’s</i>.' },
  { diff: 3, stem: 'Choose the correct option.<br><i>Last summer we visited <span class="gap"></span> grandparents in Quba.</i>', correct: 'Murad and Kamran’s', distractors: ['Murad’s and Kamran', 'Murad’s and Kamran’s', 'Murads’ and Kamran’s', 'Murad and Kamrans’'], rule: 'Когда предмет/родство общее (одни общие бабушка и дедушка у братьев), притяжательное <b>’s</b> присоединяется только к последнему имени: <i>Murad and Kamran’s</i>.' },
  { diff: 2, stem: 'Choose the line of nouns in the plural.', correct: 'mice, geese, deer', distractors: ['news, sheep, teeth', 'physics, feet, women', 'advice, oxen, children', 'money, men, scarves'], rule: 'Слова <i>mice, geese, deer</i> (неправильное мн. ч. и совпадающая форма <i>deer</i>) могут быть множественным числом. Слова <i>news, physics, advice, money</i> в английском всегда в единственном числе.' },
  { diff: 2, stem: 'Choose the correct option.<br><i>More than <span class="gap"></span> tourists visited the historic Silk Road town last year.</i>', correct: 'two million', distractors: ['two millions', 'two millions of', 'million of', 'a millions of'], rule: 'После точного числительного (<i>two</i>) слова <i>hundred, thousand, million</i> не принимают окончания <i>-s</i> и предлога <i>of</i>: <i>two million tourists</i> (но без числительного: <i>millions of tourists</i>).' },
  { diff: 3, stem: 'Choose the correct option.<br><i>The teacher gave us <span class="gap"></span> before the final exam.</i>', correct: 'some useful advice', distractors: ['many useful advices', 'a useful advice', 'several useful advices', 'two useful advice'], rule: 'Существительное <i>advice</i> («совет») неисчисляемое: оно не имеет формы множественного числа (<i>*advices</i>) и не употребляется с артиклем <i>a</i> или словом <i>many</i>.' }
];

export const ARTICLE_FRAMES = [
  // --- Diff 1 ---
  { diff: 1, stem: 'The Caspian Sea is <span class="gap"></span> largest lake in <span class="gap"></span> world.', correct: 'the, the', distractors: ['a, the', '–, the', 'the, a', 'the, –'], rule: 'Перед превосходной степенью прилагательного (<i>the largest</i>) и уникальным объектом (<i>the world</i>) употребляется определённый артикль <i>the</i>.' },
  { diff: 1, stem: 'Baku is <span class="gap"></span> capital of <span class="gap"></span> Azerbaijan.', correct: 'the, –', distractors: ['a, the', 'the, the', '–, –', 'a, –'], rule: 'Уникальная должность/роль города (<i>the capital of...</i>) требует <i>the</i>, а перед названиями большинства стран (<i>Azerbaijan</i>) артикль не ставится.' },
  { diff: 1, stem: 'Look! <span class="gap"></span> sun is shining brightly in <span class="gap"></span> clear blue sky.', correct: 'The, the', distractors: ['A, a', '–, the', 'The, a', '–, –'], rule: 'С уникальными небесными телами и явлениями (<i>the sun, the sky, the moon</i>) всегда используется определённый артикль <i>the</i>.' },
  { diff: 1, stem: 'My elder sister plays <span class="gap"></span> piano well, while I prefer <span class="gap"></span> tennis.', correct: 'the, –', distractors: ['–, the', 'a, –', 'the, the', '–, –'], rule: 'С музыкальными инструментами (<i>play the piano</i>) ставится <i>the</i>, а с названиями спортивных игр (<i>play tennis / football</i>) артикль не употребляется.' },
  { diff: 1, stem: 'Wait just <span class="gap"></span> hour; the train will arrive at <span class="gap"></span> platform 3.', correct: 'an, –', distractors: ['a, –', 'an, the', 'the, a', 'a, the'], rule: 'В слове <i>hour</i> буква <i>h</i> немая (читается с гласного звука [ˈaʊə]), поэтому ставится <i>an</i>; перед существительным с номером (<i>platform 3</i>) артикль опускается.' },
  { diff: 1, stem: 'Mount Bazarduzu is <span class="gap"></span> highest peak in our country.', correct: 'the', distractors: ['a', 'an', '–', 'some'], rule: 'Перед превосходной степенью прилагательного (<i>highest</i>) всегда ставится артикль <i>the</i>.' },

  // --- Diff 2 ---
  { diff: 2, stem: '<span class="gap"></span> letter which arrived this morning brought <span class="gap"></span> best news.', correct: 'The, the', distractors: ['A, the', '–, the', 'The, a', 'A, a'], rule: 'Существительное <i>letter</i> конкретизировано придаточным <i>which arrived this morning</i> (<i>The</i>), а <i>best</i> — превосходная степень (<i>the</i>).' },
  { diff: 2, stem: '<span class="gap"></span> dictionary that you lent me yesterday was <span class="gap"></span> most helpful one.', correct: 'The, the', distractors: ['A, the', '–, a', 'The, a', 'A, a'], rule: 'Определительное придаточное <i>that you lent me</i> делает существительное определённым (<i>The</i>), и превосходная степень <i>most helpful</i> требует <i>the</i>.' },
  { diff: 2, stem: '<span class="gap"></span> Nile flows north into <span class="gap"></span> Mediterranean Sea.', correct: 'The, the', distractors: ['–, the', 'The, –', '–, –', 'A, the'], rule: 'Названия рек (<i>the Nile</i>) и морей (<i>the Mediterranean Sea</i>) употребляются с определённым артиклем <i>the</i>.' },
  { diff: 2, stem: 'My uncle studied at <span class="gap"></span> university in <span class="gap"></span> United Kingdom.', correct: 'a, the', distractors: ['an, the', 'a, –', 'an, –', 'the, a'], rule: 'Слово <i>university</i> начинается с согласного звука [j], поэтому выбираем <i>a</i> (не <i>an</i>!), а перед составными названиями стран с <i>Kingdom/States</i> ставится <i>the</i>.' },
  { diff: 2, stem: 'We saw <span class="gap"></span> eagle flying above <span class="gap"></span> Caucasus Mountains.', correct: 'an, the', distractors: ['a, the', 'an, –', 'the, –', 'a, –'], rule: 'Первое упоминание слова <i>eagle</i> (начинается с гласного звука) — <i>an</i>; горные цепи во множественном числе (<i>the Caucasus Mountains</i>) — <i>the</i>.' },
  { diff: 2, stem: 'Have you ever climbed <span class="gap"></span> Mount Shahdag or swum in <span class="gap"></span> Lake Goygol?', correct: '–, –', distractors: ['the, the', 'the, –', '–, the', 'a, a'], rule: 'Перед названиями отдельных горных вершин с <i>Mount</i> (<i>Mount Shahdag</i>) и отдельных озёр со словом <i>Lake</i> (<i>Lake Goygol</i>) артикль не ставится.' },
  { diff: 2, stem: '<span class="gap"></span> coffee is grown in Brazil, but <span class="gap"></span> coffee in this cup smells wonderful.', correct: '–, the', distractors: ['The, the', 'A, the', '–, a', 'The, –'], rule: 'Вещество в общем смысле (<i>Coffee is grown...</i>) употребляется без артикля, а конкретный напиток в этой чашке (<i>the coffee in this cup</i>) — с артиклем <i>the</i>.' },

  // --- Diff 3 ---
  { diff: 3, stem: 'He is <span class="gap"></span> honest engineer who speaks <span class="gap"></span> fluent German.', correct: 'an, –', distractors: ['a, –', 'an, the', 'a, the', 'the, –'], rule: 'В слове <i>honest</i> начальная <i>h</i> немая → <i>an honest engineer</i>; перед названиями языков без слова <i>language</i> артикль опускается (<i>German</i>).' },
  { diff: 3, stem: '<span class="gap"></span> Smiths invited us to <span class="gap"></span> dinner on Saturday evening.', correct: 'The, –', distractors: ['–, –', 'The, a', '–, the', 'The, the'], rule: 'Фамилия во множественном числе для обозначения всей семьи употребляется с <i>The</i> (<i>The Smiths</i>); названия приёмов пищи (<i>dinner</i>) без определения используются без артикля.' },
  { diff: 3, stem: 'After finishing <span class="gap"></span> school, Farid went to <span class="gap"></span> hospital to visit his recovering friend.', correct: '–, the', distractors: ['the, –', 'a, the', '–, –', 'the, a'], rule: '<i>Finish school</i> (учёба/учреждение по прямому назначению) — без артикля; посещение здания больницы как гость (не в качестве пациента) — <i>to the hospital</i>.' },
  { diff: 3, stem: 'Do you know <span class="gap"></span> European city located on <span class="gap"></span> Danube River?', correct: 'a, the', distractors: ['an, the', 'a, –', 'an, –', 'the, a'], rule: 'Слово <i>European</i> начинается с согласного звука [j], поэтому ставится <i>a</i>; названия рек требуют <i>the</i> (<i>the Danube</i>).' }
];

export const PRONOUN_FRAMES = [
  // --- Reflexive (Diff 1) ---
  { diff: 1, stem: 'The little boy dressed <span class="gap"></span> before breakfast.', correct: 'himself', distractors: ['herself', 'myself', 'themselves', 'ourselves'], rule: 'Подлежащее <i>The little boy</i> (3-е л., ед. ч., муж. род) требует возвратного местоимения <i>himself</i>.' },
  { diff: 1, stem: 'We enjoyed <span class="gap"></span> very much at the spring concert in Baku.', correct: 'ourselves', distractors: ['themselves', 'yourself', 'myself', 'herself'], rule: 'Подлежащее <i>We</i> (1-е л., мн. ч.) требует возвратного местоимения <i>ourselves</i>.' },
  { diff: 1, stem: 'Did the guests prepare the tea <span class="gap"></span>?', correct: 'themselves', distractors: ['ourselves', 'himself', 'herself', 'yourself'], rule: 'Подлежащее <i>the guests</i> (3-е л., мн. ч.) требует формы <i>themselves</i>.' },
  { diff: 1, stem: 'I taught <span class="gap"></span> how to play basic chords on the guitar.', correct: 'myself', distractors: ['yourself', 'himself', 'ourselves', 'themselves'], rule: 'Подлежащему <i>I</i> соответствует возвратное местоимение <i>myself</i>.' },

  // --- Agreement & Object/Possessive (Diff 2) ---
  { diff: 2, stem: 'The artist painted twenty landscapes, and soon <span class="gap"></span> of <span class="gap"></span> were sold.', correct: 'most, them', distractors: ['most, it', 'every, them', 'all, it', 'none, it'], rule: 'Слово <i>landscapes</i> и глагол <i>were</i> стоят во множественном числе, поэтому требуется объектное местоимение <i>them</i> (не <i>it</i>); слово <i>every</i> с предлогом <i>of</i> не употребляется.' },
  { diff: 2, stem: 'The librarian unpacked the new dictionaries and placed <span class="gap"></span> on the shelf.', correct: 'them', distractors: ['it', 'they', 'their', 'theirs'], rule: 'После глагола <i>placed</i> требуется объектный падеж мн. ч. для замены <i>the new dictionaries</i> — <i>them</i>.' },
  { diff: 2, stem: 'Is this leather notebook <span class="gap"></span>, or does it belong to Kamran?', correct: 'yours', distractors: ['your', 'you', 'my', 'her'], rule: 'Без последующего существительного используется абсолютная форма притяжательного местоимения — <i>yours</i> (не <i>your</i>).' },
  { diff: 2, stem: 'Look at the fridge: there isn’t <span class="gap"></span> milk left for breakfast.', correct: 'any', distractors: ['some', 'no', 'many', 'few'], rule: 'В отрицательном предложении (<i>isn’t</i>) вместо <i>no</i> (чтобы избежать двойного отрицания) и вместо <i>some</i> ставится <i>any</i>.' },
  { diff: 2, stem: 'There is <span class="gap"></span> waiting for you at the school entrance.', correct: 'somebody', distractors: ['anybody', 'nobody', 'every', 'anything'], rule: 'В утвердительном предложении для одушевлённого лица требуется <i>somebody</i>; <i>nobody</i> сделало бы смысл «никого нет», а <i>every</i> не бывает подлежащим само по себе.' },
  { diff: 2, stem: 'We knocked twice, but <span class="gap"></span> answered the door.', correct: 'nobody', distractors: ['anybody', 'everybody', 'somebody', 'nothing'], rule: 'Союз <i>but</i> указывает на отрицательный результат при утвердительном глаголе <i>answered</i> — подходит только <i>nobody</i>.' },

  // --- Diff 3: both/neither/either, other/another/the others ---
  { diff: 3, stem: 'I tried on two coats in the shop, but <span class="gap"></span> of them fit me.', correct: 'neither', distractors: ['both', 'none', 'either', 'every'], rule: 'Речь о <b>двух</b> предметах (<i>two coats</i>), а союз <i>but</i> требует отрицания при утвердительном глаголе <i>fit</i>: для двух используется <i>neither</i> (<i>none</i> — для трёх и более).' },
  { diff: 3, stem: 'This pen doesn’t write properly; could you give me <span class="gap"></span> one?', correct: 'another', distractors: ['other', 'others', 'the others', 'each other'], rule: 'С исчисляемым существительным в ед. ч. (<i>one</i>) в значении «ещё один / другой» употребляется <i>another</i>.' },
  { diff: 3, stem: 'Three of the hikers reached the peak early, while <span class="gap"></span> rested near the stream.', correct: 'the others', distractors: ['another', 'the other', 'other', 'others'], rule: 'Для обозначения всех оставшихся участников конкретной группы без существительного используется форма <i>the others</i>.' },
  { diff: 3, stem: 'You may choose <span class="gap"></span> of the two essay topics; only one topic is allowed.', correct: 'either', distractors: ['neither', 'none', 'all', 'every'], rule: 'Выбор «любая одна из двух» передаётся местоимением <i>either of the two</i> (<i>all</i> относится к трём и более, <i>neither</i> означает отрицание «ни одна», а <i>every</i> с предлогом <i>of</i> не употребляется).' },
  { diff: 3, stem: 'Hardly <span class="gap"></span> in the auditorium knew the answer to that bonus question.', correct: 'anyone', distractors: ['no one', 'someone', 'everyone', 'nothing'], rule: 'Наречие с полуотрицательным значением <i>hardly</i> («едва ли») требует местоимений ряда <i>any-</i> (<i>hardly anyone</i>), а не <i>no one</i> или <i>someone</i>.' }
];

export const QUANTIFIER_FRAMES = [
  { diff: 1, stem: '<span class="gap"></span> butter was used to bake the traditional pastry.', correct: 'Much', distractors: ['Many', 'Few', 'A few', 'A lot'], rule: 'Слово <i>butter</i> («масло») — неисчисляемое (глагол <i>was</i>), поэтому подходит <i>Much</i>. Слова <i>many, few, a few</i> требуют мн. ч. исчисляемых, а <i>a lot</i> без <i>of</i> перед существительным не ставится.' },
  { diff: 1, stem: 'How <span class="gap"></span> pages did you read before going to sleep?', correct: 'many', distractors: ['much', 'little', 'a little', 'a lot'], rule: 'С исчисляемым существительным во множественном числе (<i>pages</i>) используется <i>many</i>.' },
  { diff: 1, stem: 'There is only <span class="gap"></span> sugar left in the bowl, so let’s buy some more.', correct: 'a little', distractors: ['a few', 'many', 'few', 'a lot'], rule: 'С неисчисляемым <i>sugar</i> в значении «немного» употребляется <i>a little</i> (не <i>a few</i>).' },
  { diff: 1, stem: 'We saw <span class="gap"></span> colourful birds sitting on the old oak tree.', correct: 'a few', distractors: ['a little', 'much', 'little', 'a lot'], rule: 'С исчисляемым мн. ч. <i>birds</i> употребляется <i>a few</i> («несколько»).' },
  { diff: 2, stem: 'The journalist gathered <span class="gap"></span> information about the ancient fortress.', correct: 'a lot of', distractors: ['many', 'a few', 'few', 'several'], rule: 'Слово <i>information</i> в английском неисчисляемое, поэтому <i>many, a few, few, several</i> невозможны; подходит <i>a lot of</i>.' },
  { diff: 2, stem: 'Unfortunately, there was very <span class="gap"></span> news about the missing expedition.', correct: 'little', distractors: ['few', 'many', 'a few', 'several'], rule: 'Существительное <i>news</i> всегда неисчисляемое (согласуется с <i>was</i>) и с наречием <i>very</i> требует <i>little</i>.' },
  { diff: 2, stem: 'Only <span class="gap"></span> tourists stayed in the mountain village after October.', correct: 'a few', distractors: ['a little', 'much', 'little', 'a lot'], rule: 'Конструкция <i>Only a few</i> сочетается с исчисляемым мн. ч. (<i>tourists</i>); <i>Only a little</i> — только с неисчисляемыми.' },
  { diff: 2, stem: 'Our grandfather gave us <span class="gap"></span> helpful advice before our trip.', correct: 'much', distractors: ['many', 'a few', 'several', 'a'], rule: '<i>Advice</i> — неисчисляемое существительное, поэтому с ним сочетается <i>much</i> (а не <i>many / a few / a</i>).' },
  { diff: 2, stem: 'They didn’t buy <span class="gap"></span> furniture for the small balcony.', correct: 'much', distractors: ['many', 'a few', 'few', 'several'], rule: 'Слово <i>furniture</i> («мебель») неисчисляемое, поэтому используется <i>much</i>.' },
  { diff: 3, stem: 'Hurry up! We have very <span class="gap"></span> time left before the museum closes.', correct: 'little', distractors: ['a little', 'few', 'a few', 'many'], rule: 'Контекст («Торопитесь!») означает «почти нет времени» (недостаточно) — это передаётся без артикля: <i>very little time</i> (<i>a little</i> означает «достаточно, немного»).' },
  { diff: 3, stem: 'Samir felt lonely in the new town because he had very <span class="gap"></span> friends there.', correct: 'few', distractors: ['a few', 'little', 'a little', 'much'], rule: 'Причина одиночества — «почти нет друзей» (недостаточно): с исчисляемым <i>friends</i> используется <i>very few</i> (в отличие от позитивного <i>a few</i>).' },
  { diff: 3, stem: 'Are there <span class="gap"></span> deer living in the forest reserve?', correct: 'many', distractors: ['much', 'little', 'a little', 'a lot'], rule: 'Слово <i>deer</i> имеет одинаковую форму в ед. и мн. числе; глагол <i>Are</i> указывает на множественное число, значит нужно <i>many</i>.' }
];

export const ADJECTIVE_ADVERB_FRAMES = [
  { diff: 1, stem: 'This mountain road is <span class="gap"></span> and <span class="gap"></span> than the coastal highway.', correct: 'narrower, steeper', distractors: ['narrower, more steeper', 'narrow, steep', 'more narrower, steep', 'narrowest, steepest'], rule: 'Союз <i>than</i> требует сравнительной степени обоих прилагательных (<i>narrower, steeper</i>); двойные формы с <i>more</i> (<i>more steeper</i>) грамматически неверны.' },
  { diff: 1, stem: 'My youngest cousin is very <span class="gap"></span> at solving logic puzzles.', correct: 'clever', distractors: ['cleverer', 'the cleverest', 'more clever', 'as clever'], rule: 'После наречия <i>very</i> употребляется только положительная степень прилагательного (<i>very clever</i>).' },
  { diff: 1, stem: 'Today’s weather is much <span class="gap"></span> than it was yesterday.', correct: 'warmer', distractors: ['warm', 'warmest', 'more warmer', 'the warmest'], rule: 'Слово-усилитель <i>much</i> перед <i>than</i> требует сравнительной степени — <i>warmer</i> (без <i>more</i>).' },
  { diff: 1, stem: 'The Caspian Sea is the <span class="gap"></span> enclosed inland water body on Earth.', correct: 'largest', distractors: ['larger', 'more large', 'most largest', 'large'], rule: 'Наличие определённого артикля <i>the</i> и масштаб сравнения (<i>on Earth</i>) требуют превосходной степени односложного прилагательного — <i>largest</i>.' },
  { diff: 2, stem: 'This silk carpet is <span class="gap"></span> and <span class="gap"></span> than the one we saw yesterday.', correct: 'softer, brighter', distractors: ['softer, more brighter', 'soft, bright', 'more softer, bright', 'softest, brightest'], rule: 'Перед <i>than</i> оба прилагательных стоят в сравнительной степени без лишнего слова <i>more</i> (<i>softer, brighter</i>).' },
  { diff: 2, stem: 'Freshly baked bread always smells <span class="gap"></span> in the morning.', correct: 'delicious', distractors: ['deliciously', 'more deliciously', 'most deliciously', 'very deliciously'], rule: 'Глагол-связка восприятия <i>smell</i> («пахнуть каким-то») требует после себя <b>прилагательного</b> (<i>delicious</i>), а не наречия на <i>-ly</i>.' },
  { diff: 2, stem: 'Although Leyla looked <span class="gap"></span> before the speech, she spoke <span class="gap"></span>.', correct: 'calm, confidently', distractors: ['calmly, confident', 'calm, confident', 'calmly, confidently', 'calmer, confident'], rule: 'После глагола-связки <i>looked</i> («выглядела какой») ставится прилагательное (<i>calm</i>), а после глагола действия <i>spoke</i> («говорила как») — наречие (<i>confidently</i>).' },
  { diff: 2, stem: 'The soup tasted so <span class="gap"></span> that everyone asked for a second bowl.', correct: 'good', distractors: ['well', 'best', 'betterly', 'goodly'], rule: 'Глагол-связка <i>taste</i> («быть на вкус») сочетается с прилагательным <i>good</i> (а не наречием <i>well</i>).' },
  { diff: 2, stem: 'This history book is not as <span class="gap"></span> as the biography we read last month.', correct: 'interesting', distractors: ['more interesting', 'most interesting', 'interestinger', 'the most interesting'], rule: 'В конструкции сравнения <i>not as ... as</i> используется только положительная (начальная) степень прилагательного (<i>interesting</i>).' },
  { diff: 3, stem: 'Elvin worked <span class="gap"></span> all semester and could <span class="gap"></span> believe his top score.', correct: 'hard, hardly', distractors: ['hardly, hard', 'hard, hard', 'hardly, hardly', 'harder, hard'], rule: 'Наречие <i>hard</i> означает «усердно» (<i>worked hard</i>), а <i>hardly</i> — «едва ли, с трудом» (<i>could hardly believe</i>).' },
  { diff: 3, stem: 'It was <span class="gap"></span> an exciting documentary that we watched it twice.', correct: 'such', distractors: ['so', 'very', 'too', 'as'], rule: 'Перед группой с существительным и артиклем <i>a/an</i> (<i>an exciting documentary</i>) используется местоимение <i>such</i> (<i>such an exciting documentary that...</i>), тогда как <i>so</i> ставится только перед одиночным прилагательным/наречием.' },
  { diff: 3, stem: 'The <span class="gap"></span> you practise speaking English, the <span class="gap"></span> you become.', correct: 'more, more fluent', distractors: ['much, fluent', 'most, most fluent', 'more, fluent', 'many, more fluent'], rule: 'Двойное параллельное сравнение «чем..., тем...» строится с двумя сравнительными степенями: <i>The more ..., the more fluent ...</i>.' }
];

export const PREPOSITION_FRAMES = [
  { diff: 1, stem: 'The teacher talked <span class="gap"></span> her students <span class="gap"></span> the upcoming excursion.', correct: 'to, about', distractors: ['with, in', 'to, –', '–, of', 'by, at'], rule: 'Устойчивое управление глагола <i>talk</i>: <i>to talk <b>to</b> somebody <b>about</b> something</i> («говорить с кем-то о чём-то»).' },
  { diff: 1, stem: 'We always celebrate Novruz <span class="gap"></span> March, usually <span class="gap"></span> the twentieth.', correct: 'in, on', distractors: ['on, in', 'at, on', 'in, at', 'on, at'], rule: 'С месяцами (<i>in March</i>) употребляется предлог <i>in</i>, а с конкретной датой или днём (<i>on the twentieth</i>) — <i>on</i>.' },
  { diff: 1, stem: 'My younger brother is very fond <span class="gap"></span> astronomy and physics.', correct: 'of', distractors: ['with', 'in', 'at', 'for'], rule: 'Прилагательное <i>fond</i> («любить, увлекаться») всегда требует предлога <i>of</i> (<i>to be fond of</i>).' },
  { diff: 1, stem: 'Are you interested <span class="gap"></span> learning how ancient carpets were woven?', correct: 'in', distractors: ['on', 'at', 'with', 'of'], rule: 'Устойчивое сочетание: <i>to be interested <b>in</b></i> («интересоваться чем-либо»).' },
  { diff: 2, stem: 'The tourists were pleased <span class="gap"></span> the guide who showed them <span class="gap"></span> the fortress.', correct: 'with, around', distractors: ['of, in', 'at, for', 'with, of', 'from, at'], rule: 'Выражение <i>to be pleased <b>with</b></i> («быть довольным кем/чем-либо») и фразовый оборот <i>show around</i> («провести экскурсию по...»).' },
  { diff: 2, stem: 'Our school team is proud <span class="gap"></span> winning the prize, and we owe thanks <span class="gap"></span> our coach.', correct: 'of, to', distractors: ['with, for', 'for, to', 'of, –', 'about, with'], rule: '<i>Proud <b>of</b></i> («гордиться чем-либо») и <i>owe thanks <b>to</b> somebody</i> («быть благодарным кому-либо»).' },
  { diff: 2, stem: 'Success depends <span class="gap"></span> consistent practice rather than waiting <span class="gap"></span> luck.', correct: 'on, for', distractors: ['of, at', 'from, on', 'on, –', 'in, for'], rule: 'Устойчивое управление: <i>depend <b>on</b></i> («зависеть от») и <i>wait <b>for</b></i> («ждать чего-либо»).' },
  { diff: 2, stem: 'I am listening <span class="gap"></span> the radio forecast while looking <span class="gap"></span> my keys.', correct: 'to, for', distractors: ['–, at', 'at, for', 'to, –', 'on, after'], rule: 'Глагол <i>listen</i> требует предлога <i>to</i>, а значение «искать» передаёт фразовый глагол <i>look <b>for</b></i>.' },
  { diff: 2, stem: 'When we arrived <span class="gap"></span> London, our cousins met us <span class="gap"></span> the train station.', correct: 'in, at', distractors: ['at, in', 'to, at', 'in, on', 'to, in'], rule: 'С крупными городами и странами используется <i>arrive <b>in</b></i>, а с конкретными местами/объектами (станция, аэропорт) — <i>arrive <b>at</b></i> (без предлога <i>to</i>!).' },
  { diff: 3, stem: 'When the professor entered <span class="gap"></span> the lecture hall, the students answered <span class="gap"></span> his greeting warmly.', correct: '–, –', distractors: ['to, to', 'into, to', 'in, on', 'to, –'], rule: 'Глаголы <i>enter</i> («войти в помещение») и <i>answer</i> («ответить на») являются прямопереходными и употребляются <b>без предлога (–)</b>.' },
  { diff: 3, stem: 'Let’s discuss <span class="gap"></span> the excursion route before we reach <span class="gap"></span> the mountain pass.', correct: '–, –', distractors: ['about, to', 'on, at', 'about, –', '–, to'], rule: 'Глаголы <i>discuss</i> («обсуждать что-то», без <i>about</i>!) и <i>reach</i> («достигать чего-то», без <i>to/at</i>!) не принимают предлога (<b>–</b>).' },
  { diff: 3, stem: 'My grandmother kindly looked <span class="gap"></span> our cat while we were away, and we didn’t give <span class="gap"></span> calling her daily.', correct: 'after, up', distractors: ['for, out', 'at, in', 'after, off', 'into, up'], rule: 'Фразовые глаголы: <i>look <b>after</b></i> («присматривать за») и <i>give <b>up</b></i> («прекратить/бросить что-то делать»).' }
];
