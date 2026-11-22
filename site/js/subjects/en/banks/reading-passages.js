// 12 original 3-paragraph DİM-style reading passages (~200–240 words each)
// with combinatorial question pools for Tasks 23–30.

export const READING_PASSAGES = [
  {
    id: 'en-read-lovelace',
    title: 'Ada Lovelace and the Analytical Engine',
    paragraphs: [
      'Born in London in 1815, Augusta Ada Byron—better known as Ada Lovelace—showed an extraordinary curiosity for mathematics and mechanics from early childhood. Unlike many girls of her era who studied only music and literature, Ada was encouraged by her mother to master geometry and logic. As a teenager, she designed sketches for steam-powered flying machines and wrote letters filled with scientific questions.',
      'At seventeen, Ada met Charles Babbage, a respected inventor who was designing a mechanical calculator called the Analytical Engine. Although the machine was never fully constructed during Babbage’s lifetime, Ada immediately understood its huge potential. While translating an Italian article about the engine, she added detailed notes that were three times longer than the original essay.',
      'In those famous notes, Ada wrote a step-by-step sequence of instructions for calculating a series of numbers, which historians now recognize as the first computer algorithm ever published. Remarkably, she also predicted that future machines would go beyond pure arithmetic to compose music and display visual patterns—a vision that shapes modern computing today.'
    ],
    trueFacts: [
      { text: 'Ada Lovelace received strong encouragement from her mother to study mathematics.', ru: 'В 1-м абзаце: «Ada was encouraged by her mother to master geometry and logic».' },
      { text: 'Charles Babbage’s Analytical Engine was left unfinished during his life.', ru: 'Во 2-м абзаце сказано, что машина так и не была полностью построена при жизни Бэббиджа.' },
      { text: 'Ada’s own notes were much longer than the article she translated.', ru: 'Её примечания были в три раза длиннее исходной итальянской статьи.' },
      { text: 'Lovelace foresaw that computers could one day create music.', ru: 'В 3-м абзаце она предсказала, что машины будущего смогут сочинять музыку.' }
    ],
    falseFacts: [
      { text: 'Ada Lovelace studied only literature and music during her childhood.', ruReason: 'Напротив, в отличие от многих девушек того времени, она глубоко изучала геометрию и логику.' },
      { text: 'Charles Babbage built hundreds of working Analytical Engines in London.', ruReason: 'Машина так и не была полностью построена при жизни Бэббиджа.' },
      { text: 'Ada wrote the original Italian article about the Analytical Engine.', ruReason: 'Она перевела итальянскую статью и добавила к ней свои подробные примечания.' },
      { text: 'Lovelace believed computers would only ever be useful for simple arithmetic.', ruReason: 'Она предсказала, что они выйдут за рамки чистой арифметики.' },
      { text: 'Ada met Charles Babbage after she turned thirty.', ruReason: 'Они познакомились, когда Аде было семнадцать лет (<i>At seventeen</i>).' },
      { text: 'Historians consider Ada’s notes to be the least important part of her work.', ruReason: 'Историки признают её алгоритм первой в мире опубликованной компьютерной программой.' }
    ],
    completeItems: [
      {
        prompt: 'In her famous notes on the Analytical Engine, Ada Lovelace … .',
        correct: 'included the earliest published computer algorithm',
        distractors: [
          'explained why mechanical calculators could never work',
          'wrote three short novels about steam-powered ships',
          'refused to translate any scientific texts from Italian',
          'claimed that machines could never compose music',
          'described how Babbage completed his machine in 1815'
        ],
        ruExplain: 'В 3-м абзаце указано, что в своих примечаниях Ада записала пошаговый алгоритм, признанный первой опубликованной компьютерной программой.'
      },
      {
        prompt: 'As a teenager, Ada Lovelace … .',
        correct: 'showed deep interest in inventions and scientific questions',
        distractors: [
          'avoided studying geometry and logic at home',
          'built a real steam-powered airplane in London',
          'moved to Italy to teach mathematics at a university',
          'helped historians publish the first modern laptop',
          'worked as a music composer for royal theatres'
        ],
        ruExplain: 'В 1-м абзаце сказано, что в подростковом возрасте она рисовала эскизы летательных машин и писала письма с научными вопросами.'
      }
    ],
    detailItems: [
      {
        question: 'What is known about Ada Lovelace’s early life and education?',
        trueItems: [
          { text: 'Her mother supported her studies in geometry and logic.', ru: 'мать поощряла её изучение геометрии и логики' },
          { text: 'She drew plans for steam-driven flying machines as a teen.', ru: 'в юности она создавала эскизы паровых летательных аппаратов' },
          { text: 'She was curious about mathematics from a young age.', ru: 'с раннего детства проявляла необычайное любопытство к математике' }
        ],
        falseItems: [
          { text: 'She disliked asking scientific questions in letters.', ru: 'её письма были наполнены научными вопросами' },
          { text: 'She never studied any subject besides literature.', ru: 'она изучала геометрию, логику и механику' },
          { text: 'She became a famous inventor in Italy at age ten.', ru: 'она родилась в Лондоне и познакомилась с Бэббиджем в 17 лет' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'a pioneering mathematician who envisioned modern computing', ru: 'весь текст посвящён жизни, научному вкладу и пророческим идеям Ады Лавлейс' },
      { text: 'Ada Lovelace’s lasting contribution to computer science', ru: 'основная тема — вклад Ады Лавлейс в создание первого алгоритма и концепции вычислений' }
    ],
    mainDistractors: [
      'how Italian articles were translated in Victorian London',
      'a complete guide to building steam-powered airplanes',
      'why Charles Babbage failed to finish his inventions',
      'different styles of nineteenth-century music',
      'the childhood hobbies of European historians',
      'how to calculate number series without machines'
    ],
    definitions: [
      { paragraph: 1, def: 'a strong desire to know or learn something', answer: 'curiosity', accept: ['curiosity'], ruExplain: 'В 1-м абзаце слово <b>curiosity</b> («любознательность») означает сильное желание узнать или изучить что-либо.' },
      { paragraph: 2, def: 'to build or make something such as a machine or building', answer: 'to construct', accept: ['construct', 'constructed'], ruExplain: 'Во 2-м абзаце употреблён глагол <i>constructed</i> («построена»), исходная форма — <b>to construct</b>.' }
    ],
    synonyms: [
      { paragraph: 2, promptWord: 'enormous', answer: 'huge', accept: ['huge'], ruExplain: 'Во 2-м абзаце прилагательное <b>huge</b> («огромный») является синонимом слова <i>enormous</i>.' },
      { paragraph: 3, promptWord: 'well-known', answer: 'famous', accept: ['famous'], ruExplain: 'В 3-м абзаце слово <b>famous</b> («знаменитый») служит синонимом <i>well-known</i>.' }
    ],
    paraphrases: [
      {
        starter: 'She also predicted that future machines would go beyond pure arithmetic to … .',
        originalTail: 'compose music and display visual patterns',
        models: [
          'create (<i>write / produce</i>) melodies (<i>songs / tunes</i>) and show (<i>present / generate</i>) pictures (<i>images / graphic designs</i>)',
          'write musical pieces and form (<i>show</i>) visual shapes (<i>images</i>)'
        ],
        ruExplain: 'Замена не менее 2 слов: <i>compose → create / write</i>, <i>music → melodies / musical pieces</i>, <i>display → show / present</i>, <i>patterns → images / designs</i>.'
      }
    ],
    opinions: [
      {
        question: 'Why do you think imagination is as important as technical skill in science and technology?',
        modelAnswer: 'In my opinion, imagination is just as vital as technical knowledge because it helps scientists see possibilities that do not exist yet. For example, Ada Lovelace used creative thinking to imagine computers writing music long before electronic machines were built. Therefore, combining curiosity with logical skill leads to the greatest discoveries.',
        ruHint: 'Выразите согласие/позицию (1-е предл.), приведите пример или объяснение роли воображения (2-е предл.) и подведите итог (3-е предл.).'
      }
    ]
  },
  {
    id: 'en-read-corals',
    title: 'Rebuilding Underwater Coral Cities',
    paragraphs: [
      'Coral reefs occupy less than one percent of the ocean floor, yet they provide shelter and food for nearly a quarter of all marine species. Unfortunately, warming sea waters and coastal pollution have damaged many vibrant reefs over recent decades, turning colourful coral colonies pale and lifeless.',
      'To help damaged reefs recover, marine scientists in coastal laboratories have started using large underwater nurseries and 3D-printed clay tiles. First, divers collect tiny broken coral fragments that would otherwise die on the sandy seabed. Researchers grow these fragments in protected sea gardens until they become strong enough to survive storms.',
      'Next, divers attach the young corals onto textured clay structures that mimic natural rock crevices. Fish and crabs quickly return to these new homes, helping keep the young corals clean of harmful algae. Early results prove that patient restoration can bring bustling marine life back to barren underwater deserts.'
    ],
    trueFacts: [
      { text: 'Coral reefs support almost twenty-five percent of ocean wildlife.', ru: 'В 1-м абзаце: «provide shelter and food for nearly a quarter of all marine species» (quarter = 25%).' },
      { text: 'Divers rescue small broken coral pieces from the sandy seabed.', ru: 'Во 2-м абзаце водолазы собирают крошечные обломки кораллов со дна.' },
      { text: 'Returning fish help protect newly planted corals from harmful algae.', ru: 'В 3-м абзаце: «Fish and crabs quickly return... helping keep the young corals clean of harmful algae».' },
      { text: 'Rising ocean temperatures have harmed many coral colonies.', ru: 'Потепление морских вод и загрязнение повредили многие коралловые рифы.' }
    ],
    falseFacts: [
      { text: 'Coral reefs cover more than half of the Earth’s ocean floor.', ruReason: 'Рифы занимают менее одного процента (<i>less than one percent</i>) океанского дна.' },
      { text: 'Scientists build underwater nurseries out of melting plastic sheets.', ruReason: 'Используются 3D-печатные глиняные плитки (<i>3D-printed clay tiles</i>).' },
      { text: 'Fish and crabs avoid returning to restored clay reef structures.', ruReason: 'Рыбы и крабы быстро возвращаются в эти новые укрытия.' },
      { text: 'Broken coral fragments are thrown away because they can never grow.', ruReason: 'Их выращивают в защищённых морских питомниках, пока они не окрепнут.' },
      { text: 'Harmful algae help damaged reefs turn colourful again.', ruReason: 'Водоросли вредны для молодых кораллов, поэтому рыбы помогают их очищать.' },
      { text: 'Coral restoration experiments have failed everywhere so far.', ruReason: 'Первые результаты доказывают, что восстановление возвращает морскую жизнь.' }
    ],
    completeItems: [
      {
        prompt: 'Researchers keep broken coral fragments in protected sea gardens until they … .',
        correct: 'grow strong enough to endure ocean storms',
        distractors: [
          'cover over half of the world’s ocean floor',
          'turn completely pale and lifeless in warm water',
          'can be sold as decorations in coastal shops',
          'no longer need any fish or crabs around them',
          'stop growing and sink deep into the sand'
        ],
        ruExplain: 'Во 2-м абзаце: «...until they become strong enough to survive storms» (<i>survive ≈ endure</i>).'
      }
    ],
    detailItems: [
      {
        question: 'How do scientists restore damaged coral reefs?',
        trueItems: [
          { text: 'They gather small fallen coral pieces from the seabed.', ru: 'собирают крошечные отломанные фрагменты со дна' },
          { text: 'They fasten young corals to textured clay surfaces.', ru: 'прикрепляют молодые кораллы к рельефным глиняным конструкциям' },
          { text: 'They raise fragments in sheltered underwater nurseries.', ru: 'выращивают их в защищённых подводных питомниках' }
        ],
        falseItems: [
          { text: 'They raise ocean temperatures around coastal towns.', ru: 'потепление воды, наоборот, вредит кораллам' },
          { text: 'They remove all crabs and fish from the nursery.', ru: 'рыбы и крабы помогают очищать кораллы от водорослей' },
          { text: 'They paint pale coral colonies with bright waterproof dye.', ru: 'окрашивание не используется' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'scientific efforts to restore damaged coral reefs', ru: 'весь текст посвящён научным методам восстановления повреждённых коралловых рифов' },
      { text: 'rebuilding marine habitats with coral nurseries', ru: 'основная тема — возрождение коралловых экосистем с помощью питомников и глиняных основ' }
    ],
    mainDistractors: [
      'why coastal tourism harms sandy beaches',
      'how 3D printers work inside school classrooms',
      'the eating habits of deep-sea crabs',
      'why ocean storms happen during winter',
      'the history of clay pottery in coastal towns',
      'how algae produce food for ocean whales'
    ],
    definitions: [
      { paragraph: 1, def: 'protection from danger or bad weather', answer: 'shelter', accept: ['shelter'], ruExplain: 'В 1-м абзаце слово <b>shelter</b> («убежище, укрытие») означает защиту от опасности.' },
      { paragraph: 3, def: 'empty and unable to support much plant or animal life', answer: 'barren', accept: ['barren'], ruExplain: 'В 3-м абзаце прилагательное <b>barren</b> («бесплодный, пустынный») описывает опустевшее морское дно.' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'colourful', answer: 'vibrant', accept: ['vibrant'], ruExplain: 'В 1-м абзаце слово <b>vibrant</b> («яркий, живой») является синонимом <i>colourful</i>.' },
      { paragraph: 3, promptWord: 'imitate', answer: 'mimic', accept: ['mimic'], ruExplain: 'В 3-м абзаце глагол <b>mimic</b> («имитировать, воспроизводить») совпадает по смыслу с <i>imitate</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Early results prove that patient restoration can … .',
        originalTail: 'bring bustling marine life back to barren underwater deserts',
        models: [
          'return (<i>restore</i>) active (<i>rich / lively</i>) sea (<i>ocean</i>) creatures (<i>wildlife</i>) to empty (<i>lifeless</i>) seabed areas',
          'revive lively ocean ecosystems in damaged (<i>empty</i>) underwater zones'
        ],
        ruExplain: 'Заменяем не менее 2 слов: <i>bring back → return / restore</i>, <i>bustling → lively / active</i>, <i>marine life → sea creatures / wildlife</i>, <i>barren → empty / lifeless</i>.'
      }
    ],
    opinions: [
      {
        question: 'Why is it important for humans to protect ocean ecosystems like coral reefs?',
        modelAnswer: 'I believe protecting ocean ecosystems is essential because healthy seas support both marine wildlife and human communities. First, coral reefs provide food and shelter for thousands of sea species that keep nature balanced. Moreover, healthy oceans protect coastlines from strong waves and ensure clean resources for future generations.',
        ruHint: 'Назовите позицию (1-е предл.), приведите 2 аргумента о значении для природы и людей (2–3-е предл.) со связками <i>First, Moreover</i>.'
      }
    ]
  },
  {
    id: 'en-read-gobustan',
    title: 'The Singing Stones of Gobustan',
    paragraphs: [
      'Roughly sixty kilometres southwest of Baku lies the Gobustan Rock Art Cultural Landscape, an open-air museum surrounded by dry hills and rocky cliffs. For thousands of years, early inhabitants carved over six thousand detailed petroglyphs onto the smooth limestone walls, depicting hunters, wild goats, boats, and celebratory dances.',
      'Alongside these ancient drawings stands a remarkable natural wonder known locally as Gaval Dash, or the “tambourine stone”. Resting delicately on smaller rocks, this flat two-metre limestone slab acts like a giant prehistoric drum. When struck gently with a small pebble, the hollow stone produces a clear, ringing musical tone that echoes across the quiet valley.',
      'Archaeologists suggest that ancient communities gathered around Gaval Dash during festivals and rituals long before written history began. Today, UNESCO protects Gobustan as a World Heritage Site, welcoming curious travellers who wish to hear the timeless music of Azerbaijan’s distant past.'
    ],
    trueFacts: [
      { text: 'Thousands of ancient rock carvings can be seen on limestone cliffs in Gobustan.', ru: 'В 1-м абзаце указано более шести тысяч петроглифов на известняковых стенах.' },
      { text: 'Gaval Dash produces a ringing sound when tapped with a small stone.', ru: 'Во 2-м абзаце: при лёгком ударе камешком полый камень издаёт звонкий музыкальный звук.' },
      { text: 'Scientists think ancient people held gatherings near Gaval Dash.', ru: 'В 3-м абзаце археологи предполагают, что вокруг него собирались на праздники и ритуалы.' },
      { text: 'Gobustan is officially recognized as a UNESCO World Heritage Site.', ru: 'ЮНЕСКО охраняет Гобустан как объект Всемирного наследия.' }
    ],
    falseFacts: [
      { text: 'Gobustan is located inside a busy indoor museum in central Baku.', ruReason: 'Это музей под открытым небом примерно в 60 км к юго-западу от Баку.' },
      { text: 'Early artists carved only portraits of modern kings on the rocks.', ruReason: 'На петроглифах изображены охотники, дикие козы, лодки и танцы.' },
      { text: 'Gaval Dash is a tiny wooden drum brought from Europe recently.', ruReason: 'Это природная плоская известняковая плита длиной около двух метров.' },
      { text: 'Hitting Gaval Dash with a pebble makes no audible sound at all.', ruReason: 'При ударе камень издаёт чистый звонкий тон, разносящийся по долине.' },
      { text: 'Tourists are completely banned from visiting Gobustan today.', ruReason: 'Комплекс принимает любознательных путешественников со всего мира.' },
      { text: 'Fewer than sixty rock carvings have been found in the area.', ruReason: 'На скалах высечено более шести тысяч (<i>over six thousand</i>) изображений.' }
    ],
    completeItems: [
      {
        prompt: 'The flat limestone slab called Gaval Dash works like a giant drum because … .',
        correct: 'it rings clearly when tapped gently with a small pebble',
        distractors: [
          'ancient builders covered it with thin animal leather',
          'tourists play modern electric guitars beside it',
          'it sits deep underwater inside a quiet cave',
          'archaeologists attached metal bells underneath the rock',
          'strong desert winds constantly shake the valley hills'
        ],
        ruExplain: 'Во 2-м абзаце сказано, что камень лежит на меньших камнях и при лёгком ударе камешком звучит чисто и звонко.'
      }
    ],
    detailItems: [
      {
        question: 'What can visitors discover at the Gobustan Cultural Landscape?',
        trueItems: [
          { text: 'Thousands of carvings showing ancient boats, animals, and dances', ru: 'свыше 6000 петроглифов с охотниками, козами, лодками и танцами' },
          { text: 'A resonant stone slab that plays clear notes when tapped', ru: 'звучащий камень Гавал Даш' },
          { text: 'A historic area preserved under UNESCO protection', ru: 'объект Всемирного наследия ЮНЕСКО' }
        ],
        falseItems: [
          { text: 'Written manuscripts describing festivals from 1950', ru: 'рисунки и ритуалы относятся к дописьменной эпохе' },
          { text: 'Green tropical rainforests surrounding rocky cliffs', ru: 'местность окружена сухими холмами (<i>dry hills</i>)' },
          { text: 'Modern marble statues carved by city builders', ru: 'наскальные изображения создавались древними жителями' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'ancient rock art and the musical stone of Gobustan', ru: 'текст посвящён петроглифам и музыкальному камню Гавал Даш в Гобустане' },
      { text: 'Azerbaijan’s prehistoric heritage in Gobustan', ru: 'основная тема — доисторическое культурное наследие Гобустана' }
    ],
    mainDistractors: [
      'how to construct outdoor museums in capital cities',
      'why limestone cliffs disappear near Baku',
      'the types of wild goats living in mountain forests',
      'how modern drums are made in music factories',
      'travel routes across northern Europe',
      'why archaeologists study ancient wooden boats'
    ],
    definitions: [
      { paragraph: 1, def: 'people who live in a particular place', answer: 'inhabitants', accept: ['inhabitants', 'inhabitant'], ruExplain: 'В 1-м абзаце слово <b>inhabitants</b> означает «жители, обитатели».' },
      { paragraph: 2, def: 'having an empty space inside rather than being solid', answer: 'hollow', accept: ['hollow'], ruExplain: 'Во 2-м абзаце прилагательное <b>hollow</b> означает «полый внутри».' }
    ],
    synonyms: [
      { paragraph: 2, promptWord: 'extraordinary', answer: 'remarkable', accept: ['remarkable'], ruExplain: 'Во 2-м абзаце слово <b>remarkable</b> («удивительный, замечательный») синонимично слову <i>extraordinary</i>.' },
      { paragraph: 3, promptWord: 'remote', answer: 'distant', accept: ['distant'], ruExplain: 'В 3-м абзаце слово <b>distant</b> («далёкий») является синонимом <i>remote</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Today, UNESCO protects Gobustan as a World Heritage Site, welcoming … .',
        originalTail: 'curious travellers who wish to hear the timeless music of Azerbaijan’s distant past',
        models: [
          'interested (<i>eager</i>) visitors (<i>tourists / guests</i>) who want (<i>hope / desire</i>) to listen to the ancient sounds of Azerbaijan’s early history',
          'eager guests hoping to experience the eternal melodies from Azerbaijan’s ancient era'
        ],
        ruExplain: 'Заменяем не менее 2 слов: <i>curious → interested / eager</i>, <i>travellers → visitors / tourists</i>, <i>wish → want / hope</i>, <i>distant past → early history / ancient era</i>.'
      }
    ],
    opinions: [
      {
        question: 'Why should countries preserve ancient monuments and archaeological sites?',
        modelAnswer: 'I firmly believe preserving ancient monuments is crucial because they connect modern generations with their roots. First, sites like Gobustan teach us how early humans lived, worked, and celebrated together. Furthermore, protecting cultural heritage strengthens national identity and attracts respectful visitors from around the world.',
        ruHint: 'Обоснуйте важность сохранения памятников (связь с историей, обучение, культурный туризм) в 3–4 связных предложениях.'
      }
    ]
  },
  {
    id: 'en-read-seismograph',
    title: 'Zhang Heng’s Bronze Dragon Seismoscope',
    paragraphs: [
      'Nearly two thousand years ago, earthquakes posed a terrifying danger to distant provinces of ancient China because news travelled slowly on horseback. In 132 CE, an inventive scholar named Zhang Heng created a remarkable device to detect tremors from hundreds of kilometres away, even when people in the capital felt nothing.',
      'His invention looked like an ornate bronze jar decorated with eight dragons facing the eight directions of a compass. Each dragon held a small bronze ball lightly in its jaws, while eight bronze toads waited directly below with open mouths. When an earthquake shook the earth far away, an internal pendulum swayed toward the shock wave and triggered one dragon to drop its ball into the toad’s mouth with a sharp clang.',
      'At first, court officials doubted that a silent jar could sense an invisible event. Days later, however, a messenger arrived on horseback confirming that a strong quake had struck in the exact direction the fallen ball indicated, proving Zhang Heng’s scientific brilliance.'
    ],
    trueFacts: [
      { text: 'Zhang Heng built an early earthquake-detecting instrument in 132 CE.', ru: 'В 1-м абзаце: «In 132 CE, an inventive scholar named Zhang Heng created a remarkable device to detect tremors».' },
      { text: 'Eight bronze dragons on the vessel pointed toward eight compass directions.', ru: 'Во 2-м абзаце указаны восемь драконов, смотрящих в восемь сторон света.' },
      { text: 'A loud clang signalled when a dragon dropped a ball into a toad’s mouth.', ru: 'Шар падал в пасть жабы с резким звоном (<i>with a sharp clang</i>).' },
      { text: 'A horse rider later proved that the device had pointed to a real quake.', ru: 'В 3-м абзаце гонец подтвердил землетрясение именно в том направлении, которое указал шар.' }
    ],
    falseFacts: [
      { text: 'Zhang Heng’s device was made out of painted bamboo and paper.', ruReason: 'Сосуд, драконы, шары и жабы были сделаны из бронзы (<i>bronze</i>).' },
      { text: 'Court officials praised the invention immediately before testing it.', ruReason: 'Сначала придворные сомневались (<i>doubted</i>), пока не прибыл гонец с подтверждением.' },
      { text: 'All eight dragons dropped their balls simultaneously during every tremor.', ruReason: 'Падал шар только у одного дракона, в сторону которого отклонялся маятник.' },
      { text: 'The bronze jar could detect earthquakes only inside the capital city.', ruReason: 'Прибор улавливал подземные толчки за сотни километров от столицы.' },
      { text: 'Fast telegraph lines brought earthquake warnings to China in 132 CE.', ruReason: 'Новости тогда доставлялись медленно верхом на лошадях (<i>on horseback</i>).' },
      { text: 'The messenger reported that no earthquake had occurred anywhere.', ruReason: 'Гонец подтвердил сильное землетрясение в указанном направлении.' }
    ],
    completeItems: [
      {
        prompt: 'When a distant earthquake shook the ground, an internal pendulum inside the jar … .',
        correct: 'caused a single dragon to release its bronze ball',
        distractors: [
          'rang eight loud bells outside the royal palace',
          'stopped the horse messenger from leaving the province',
          'melted the bronze jar using underground heat',
          'forced all eight toads to jump off the vessel',
          'predicted the exact date of the next storm'
        ],
        ruExplain: 'Во 2-м абзаце описано, как внутренний маятник отклонялся к волне и заставлял одного дракона выронить шар в рот жабы.'
      }
    ],
    detailItems: [
      {
        question: 'What features belonged to Zhang Heng’s seismoscope?',
        trueItems: [
          { text: 'Eight dragons facing the main compass directions', ru: 'восемь драконов по восьми направлениям компаса' },
          { text: 'A hidden pendulum inside the bronze vessel', ru: 'внутренний маятник (<i>internal pendulum</i>)' },
          { text: 'Bronze toads positioned below the dragons’ mouths', ru: 'бронзовые жабы с открытыми ртами внизу' }
        ],
        falseItems: [
          { text: 'Electronic sensors powered by solar panels', ru: 'прибор был чисто механическим бронзовым устройством II века' },
          { text: 'Sixteen wooden horses around the base', ru: 'упомянуты только драконы и жабы' },
          { text: 'A printed paper map inside the jar', ru: 'бумажная карта в приборе не упоминается' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'the invention and success of an ancient earthquake detector', ru: 'весь текст рассказывает о создании, устройстве и проверке первого сейсмоскопа Чжан Хэна' },
      { text: 'how Zhang Heng designed the world’s first seismoscope', ru: 'основная тема — древний китайский прибор для определения направления землетрясений' }
    ],
    mainDistractors: [
      'how horses were trained for long journeys in China',
      'why bronze vessels were popular in royal kitchens',
      'famous dragon legends in Asian literature',
      'how modern scientists predict volcanic eruptions',
      'why court officials disliked bronze sculptures',
      'the history of compasses in European sailing'
    ],
    definitions: [
      { paragraph: 1, def: 'slight shaking movements of the earth', answer: 'tremors', accept: ['tremors', 'tremor'], ruExplain: 'В 1-м абзаце существительное <b>tremors</b> означает «подземные толчки, сотрясения».' },
      { paragraph: 3, def: 'to feel uncertain or question whether something is true', answer: 'to doubt', accept: ['doubt', 'doubted'], ruExplain: 'В 3-м абзаце глагол <i>doubted</i> («сомневались»), исходная форма — <b>to doubt</b>.' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'creative', answer: 'inventive', accept: ['inventive'], ruExplain: 'В 1-м абзаце прилагательное <b>inventive</b> («изобретательный») является синонимом <i>creative</i>.' },
      { paragraph: 3, promptWord: 'genius', answer: 'brilliance', accept: ['brilliance'], ruExplain: 'В 3-м абзаце существительное <b>brilliance</b> («гениальность, блестящий ум») соответствует слову <i>genius</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Days later, a messenger arrived on horseback confirming that … .',
        originalTail: 'a strong quake had struck in the exact direction the fallen ball indicated',
        models: [
          'a powerful (<i>major / severe</i>) earthquake (<i>tremor</i>) had happened (<i>occurred</i>) precisely where the dropped sphere (<i>ball</i>) pointed',
          'a severe tremor had hit the precise area (<i>region</i>) shown by the fallen ball'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>strong → powerful / severe</i>, <i>quake → earthquake / tremor</i>, <i>struck → occurred / happened</i>, <i>indicated → showed / pointed to</i>.'
      }
    ],
    opinions: [
      {
        question: 'Why do you think ancient inventions like Zhang Heng’s seismoscope still inspire modern engineers?',
        modelAnswer: 'I think ancient inventions inspire modern engineers because they show how much can be achieved with simple mechanical principles and careful observation. Even without electricity or computers, Zhang Heng solved a serious real-world problem creatively. Studying such clever designs encourages today’s inventors to think boldly and find elegant solutions.',
        ruHint: 'Объясните ценность идей прошлого (наблюдательность, простота механики, вдохновение) в 3–4 предложениях.'
      }
    ]
  },
  {
    id: 'en-read-vertical',
    title: 'Farming Upward Inside City Buildings',
    paragraphs: [
      'As global cities expand rapidly, finding fresh, affordable produce nearby becomes more challenging. Traditional farms require huge stretches of fertile land and consume vast quantities of freshwater. In response, agricultural innovators have begun transforming empty city warehouses into bright indoor vertical farms.',
      'Instead of planting seeds in wide outdoor fields, vertical farms stack dozens of plant trays upward from floor to ceiling. Roots grow in nutrient-rich mist or circulating water rather than soil, using up to ninety percent less water than conventional agriculture. Energy-saving pink and blue LED lights provide exact wavelengths for rapid photosynthesis while temperature sensors keep every shelf comfortable year-round.',
      'Because lettuce, herbs, and berries are harvested just blocks away from local supermarkets, food reaches shoppers within hours instead of travelling thousands of kilometres in refrigerated trucks. Although indoor lighting costs remain high, vertical farming offers a promising way to feed growing urban populations sustainably.'
    ],
    trueFacts: [
      { text: 'Vertical farms can be installed inside unused city warehouses.', ru: 'В 1-м абзаце: «transforming empty city warehouses into bright indoor vertical farms».' },
      { text: 'Growing crops in mist or circulating water saves up to ninety percent of water.', ru: 'Во 2-м абзаце: такой способ расходует до 90% меньше воды.' },
      { text: 'Food grown in vertical farms reaches nearby stores very quickly.', ru: 'В 3-м абзаце урожай попадает к покупателям за считанные часы без дальних перевозок.' },
      { text: 'High electricity costs for lighting are still a challenge for vertical farms.', ru: 'В конце 3-го абзаца отмечено: «indoor lighting costs remain high».' }
    ],
    falseFacts: [
      { text: 'Vertical farms need wide outdoor fields and deep layers of soil.', ruReason: 'Растения выращивают ярусами в помещении без почвы — в тумане или воде.' },
      { text: 'Indoor vertical farms consume far more water than traditional fields.', ruReason: 'Они экономят до 90% воды по сравнению с обычным сельским хозяйством.' },
      { text: 'Plants inside vertical farms rely solely on natural outdoor rain and wind.', ruReason: 'Воду, свет (светодиоды) и температуру контролируют внутри помещения круглый год.' },
      { text: 'Vegetables from vertical farms must travel thousands of kilometres by truck.', ruReason: 'Урожай собирают в нескольких кварталах от супермаркетов.' },
      { text: 'Vertical farms can operate only during warm spring months.', ruReason: 'Датчики поддерживают комфортный климат круглый год (<i>year-round</i>).' },
      { text: 'Indoor LED lighting costs almost nothing for warehouse farmers.', ruReason: 'Расходы на освещение пока остаются высокими.' }
    ],
    completeItems: [
      {
        prompt: 'In vertical farms, plants grow without soil because their roots receive … .',
        correct: 'water or nutrient-rich mist inside stacked trays',
        distractors: [
          'natural rain falling through open warehouse roofs',
          'cold air from refrigerated supermarket trucks',
          'fertile mud carried from distant rural fields',
          'melted ice collected from city streets',
          'thick layers of sand mixed with salt'
        ],
        ruExplain: 'Во 2-м абзаце: корни растут в богатом питательными веществами тумане или циркулирующей воде, а не в почве.'
      }
    ],
    detailItems: [
      {
        question: 'What advantages do vertical farms offer cities?',
        trueItems: [
          { text: 'They use dramatically less water than ordinary farms.', ru: 'экономят до 90% воды' },
          { text: 'They deliver fresh greens to local shops within hours.', ru: 'свежие продукты попадают в магазины за несколько часов' },
          { text: 'They operate throughout all four seasons indoors.', ru: 'работают круглый год благодаря датчикам и светодиодам' }
        ],
        falseItems: [
          { text: 'They require no electrical energy for lighting.', ru: 'затраты на светодиодное освещение всё ещё велики' },
          { text: 'They depend entirely on fertile countryside soil.', ru: 'почва там вообще не используется' },
          { text: 'They produce food only for distant export abroad.', ru: 'продукция поступает в соседние городские супермаркеты' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'an innovative indoor way to grow food inside cities', ru: 'текст описывает устройство, плюсы и ограничения вертикального фермерства в городах' },
      { text: 'the benefits and challenges of vertical farming', ru: 'основная идея — современное городское вертикальное земледелие' }
    ],
    mainDistractors: [
      'why refrigerated trucks break down in summer',
      'how to grow tall fruit trees in home kitchens',
      'the history of empty warehouses in Europe',
      'why supermarkets prefer imported herbs',
      'how pink and blue LED lights were invented',
      'ways to save electricity in office buildings'
    ],
    definitions: [
      { paragraph: 1, def: 'good for growing plants and crops', answer: 'fertile', accept: ['fertile'], ruExplain: 'В 1-м абзаце прилагательное <b>fertile</b> означает «плодородный».' },
      { paragraph: 2, def: 'normal, traditional, or widely used for a long time', answer: 'conventional', accept: ['conventional'], ruExplain: 'Во 2-м абзаце слово <b>conventional</b> («традиционный, обычный») противопоставлено новому подходу.' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'grow', answer: 'expand', accept: ['expand'], ruExplain: 'В 1-м абзаце глагол <b>expand</b> («расширяться, расти») является синонимом <i>grow</i>.' },
      { paragraph: 3, promptWord: 'encouraging', answer: 'promising', accept: ['promising'], ruExplain: 'В 3-м абзаце слово <b>promising</b> («многообещающий») совпадает по значению с <i>encouraging</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Because lettuce, herbs, and berries are harvested close to supermarkets, food … .',
        originalTail: 'reaches shoppers within hours instead of travelling thousands of kilometres',
        models: [
          'arrives at (<i>gets to</i>) customers (<i>buyers / stores</i>) quickly (<i>in a few hours</i>) rather than crossing huge distances',
          'gets to local buyers in just hours without long-distance transport'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>reaches → arrives at / gets to</i>, <i>shoppers → customers / buyers</i>, <i>instead of → rather than / without</i>, <i>travelling thousands of km → long-distance transport</i>.'
      }
    ],
    opinions: [
      {
        question: 'Would you like to buy vegetables grown in a local vertical farm? Why or why not?',
        modelAnswer: 'Yes, I would definitely like to buy vegetables from a local vertical farm. First of all, such produce is picked only hours before reaching the store, so it stays much fresher and healthier. In addition, vertical farming saves huge amounts of water and reduces transport pollution, which benefits our environment.',
        ruHint: 'Дайте чёткий ответ и 2–3 аргумента (свежесть, экономия воды, меньше перевозок) в 3+ предложениях.'
      }
    ]
  },
  {
    id: 'en-read-coleman',
    title: 'Bessie Coleman: Taking to the Skies',
    paragraphs: [
      'Born in Texas in 1892, Bessie Coleman grew up picking cotton alongside her large family and dreaming of a wider future. When her brothers returned from overseas after World War I and teased her about French women who flew airplanes, Bessie made a bold promise: she would become a licensed pilot herself.',
      'At that time, flight schools across the United States refused to admit her because of her background and gender. Unwilling to abandon her ambition, Bessie worked extra shifts in Chicago, studied French at night school, and sailed to France in 1920. Within seven months, she earned an international pilot’s licence from a respected French aviation school—becoming the first African American woman in history to hold one.',
      'Returning home to huge cheering crowds, Bessie performed thrilling aerial loops at air shows to raise funds for her own flying school. Although a tragic accident ended her life in 1926, her courage inspired generations of young aviators who still honour her pioneering spirit.'
    ],
    trueFacts: [
      { text: 'Bessie Coleman worked hard and learned French before travelling to Europe.', ru: 'Во 2-м абзаце: она работала в дополнительные смены в Чикаго и учила французский в вечерней школе.' },
      { text: 'American flight schools rejected Bessie’s applications at that time.', ru: 'Американские лётные школы отказывались принимать её.' },
      { text: 'Bessie earned her international pilot’s licence in France within seven months.', ru: 'Она получила международную лицензию пилота во Франции за семь месяцев.' },
      { text: 'Coleman performed air shows to collect money for opening a flying school.', ru: 'В 3-м абзаце указано: «to raise funds for her own flying school».' }
    ],
    falseFacts: [
      { text: 'Bessie Coleman was born into a wealthy aviation family in Paris.', ruReason: 'Она родилась в Техасе в 1892 г. и в детстве собирала хлопок с семьёй.' },
      { text: 'Several US flight schools warmly welcomed Bessie as their first student.', ruReason: 'Школы США отказались её принять, поэтому она поехала во Францию.' },
      { text: 'It took Bessie ten years in France to earn her pilot’s licence.', ruReason: 'Она получила лицензию за семь месяцев (<i>Within seven months</i>).' },
      { text: 'Bessie flew airplanes secretly and never performed in front of crowds.', ruReason: 'Она выступала на авиашоу перед огромными ликующими толпами.' },
      { text: 'Coleman gave up her dream of flying after moving to Chicago.', ruReason: 'В Чикаго она копила деньги и учила французский именно ради полётов.' },
      { text: 'Her brothers encouraged her not to listen to stories about French pilots.', ruReason: 'Именно рассказы братьев о французских женщинах-пилотах подтолкнули её к решению.' }
    ],
    completeItems: [
      {
        prompt: 'Unable to enter flight schools in the United States, Bessie Coleman … .',
        correct: 'studied French and trained at an aviation school in France',
        distractors: [
          'decided to stay in Texas and give up flying forever',
          'opened a large cotton farm near Chicago in 1920',
          'wrote angry letters until US laws changed immediately',
          'asked her brothers to fly airplanes for her at shows',
          'became a French language teacher in her hometown'
        ],
        ruExplain: 'Во 2-м абзаце она выучила французский, отправилась во Францию и получила там лицензию пилота.'
      }
    ],
    detailItems: [
      {
        question: 'What obstacles did Bessie Coleman overcome to become a pilot?',
        trueItems: [
          { text: 'She faced rejection from American aviation schools.', ru: 'американские школы отказались принимать её' },
          { text: 'She had to learn a foreign language at night school.', ru: 'она учила французский язык на вечерних курсах' },
          { text: 'She worked extra shifts to afford her journey abroad.', ru: 'работала в дополнительные смены, чтобы оплатить поездку' }
        ],
        falseItems: [
          { text: 'She had to design and build her own passenger airplane first.', ru: 'она не строила собственный пассажирский самолёт' },
          { text: 'She waited until World War II ended before learning to fly.', ru: 'она получила лицензию в 1920–1921 гг., сразу после Первой мировой' },
          { text: 'French schools refused to grant licences to foreign women.', ru: 'французская авиационная школа выдала ей международную лицензию' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'the determined life of an aviation pioneer', ru: 'весь текст посвящён упорству и подвигу пионера авиации Бесси Коулман' },
      { text: 'how Bessie Coleman overcame barriers to fly', ru: 'основная тема — путь Бесси Коулман к получению лицензии пилота вопреки преградам' }
    ],
    mainDistractors: [
      'how to perform safe aerial loops at modern air shows',
      'daily life on cotton farms in nineteenth-century Texas',
      'the history of French night schools in 1920',
      'why World War I changed European airports',
      'how pilot licences are renewed today',
      'popular sports events in Chicago'
    ],
    definitions: [
      { paragraph: 2, def: 'to give up or stop doing something before finishing it', answer: 'to abandon', accept: ['abandon'], ruExplain: 'Во 2-м абзаце глагол <b>to abandon</b> («бросить, отказаться от мечты») соответствует определению.' },
      { paragraph: 3, def: 'very exciting and full of strong emotion', answer: 'thrilling', accept: ['thrilling'], ruExplain: 'В 3-м абзаце прилагательное <b>thrilling</b> означает «захватывающий, волнующий».' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'courageous', answer: 'bold', accept: ['bold'], ruExplain: 'В 1-м абзаце слово <b>bold</b> («смелый, отважный») является синонимом <i>courageous</i>.' },
      { paragraph: 3, promptWord: 'money', answer: 'funds', accept: ['funds'], ruExplain: 'В 3-м абзаце существительное <b>funds</b> («средства, деньги») синонимично <i>money</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Although a tragic accident ended her life in 1926, her courage … .',
        originalTail: 'inspired generations of young aviators who still honour her pioneering spirit',
        models: [
          'encouraged (<i>motivated</i>) many young pilots (<i>fliers</i>) who continue to respect (<i>admire / remember</i>) her brave example',
          'motivated future generations of pilots who keep admiring her groundbreaking achievements'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>inspired → encouraged / motivated</i>, <i>aviators → pilots</i>, <i>honour → respect / admire</i>.'
      }
    ],
    opinions: [
      {
        question: 'What quality helps people succeed when they face unfair obstacles, and why?',
        modelAnswer: 'In my view, determination is the most important quality when facing unfair barriers. As Bessie Coleman’s story proves, people who stay focused on their goal find creative ways around obstacles instead of giving up. Furthermore, strong persistence inspires others to believe in their own abilities.',
        ruHint: 'Назовите качество характера (напр., <i>determination / persistence</i>) и объясните почему в 3–4 предложениях.'
      }
    ]
  },
  {
    id: 'en-read-north',
    title: 'Marianne North and Her Painted Botanical World',
    paragraphs: [
      'Before colour photography became practical for travellers, Victorian artist Marianne North set off on an ambitious mission: to paint rare plants across every continent in their natural environments. Born in England in 1830, she developed a keen eye for flowers while tending her father’s conservatory and reading botany books.',
      'After her father passed away, Marianne travelled independently through Brazil, India, Japan, Australia, and South Africa—a rare feat for a solo woman in the nineteenth century. Carrying heavy wooden paintboxes across muddy rainforest trails and mountain passes, she painted vibrant oil studies on the spot rather than sketching dried leaves inside a museum.',
      'Altogether, North completed more than eight hundred bright botanical paintings, recording several species before scientists had even named them; one striking pitcher plant was later named after her. Today, visitors at Kew Gardens in London can still admire her entire collection arranged wall-to-wall inside a dedicated gallery she funded herself.'
    ],
    trueFacts: [
      { text: 'Marianne North painted plants directly outdoors in their natural habitats.', ru: 'Во 2-м абзаце: она писала яркие этюды маслом прямо на месте, а не по засушенным листьям в музее.' },
      { text: 'She travelled alone to continents including Asia, South America, and Africa.', ru: 'Она самостоятельно путешествовала по Бразилии, Индии, Японии, Австралии и Южной Африке.' },
      { text: 'Scientists named a newly recorded pitcher plant in her honour.', ru: 'В 3-м абзаце: один удивительный вид кувшиночника (<i>pitcher plant</i>) позже назвали в её честь.' },
      { text: 'Her paintings are displayed in a special gallery at Kew Gardens.', ru: 'Её коллекция до сих пор выставлена в отдельной галерее в Кью-Гарденс.' }
    ],
    falseFacts: [
      { text: 'Marianne North used early colour cameras instead of oil paints.', ruReason: 'Она работала ещё до того, как цветная фотография стала удобной, и писала масляными красками.' },
      { text: 'She painted only dried flower samples inside London museums.', ruReason: 'Она принципиально писала живые растения на природе.' },
      { text: 'Her father forbade her from studying botany or entering his conservatory.', ruReason: 'Её наблюдательность развилась именно при уходе за оранжереей отца.' },
      { text: 'North completed fewer than eighty paintings during her travels.', ruReason: 'Она создала более восьмисот (<i>more than eight hundred</i>) картин.' },
      { text: 'Kew Gardens refused to accept or exhibit Marianne’s artwork.', ruReason: 'Её коллекция целиком представлена в специальной галерее, которую она сама профинансировала.' },
      { text: 'Marianne travelled only within England and Scotland.', ruReason: 'Она посетила Бразилию, Индию, Японию, Австралию и Южную Африку.' }
    ],
    completeItems: [
      {
        prompt: 'Unlike museum illustrators who copied dried plants, Marianne North … .',
        correct: 'painted living flowers outdoors on oil canvases',
        distractors: [
          'took black-and-white photographs of city parks',
          'wrote long botany textbooks without any drawings',
          'collected only rare stones from mountain passes',
          'stayed inside her father’s conservatory all her life',
          'sold every single painting before returning to London'
        ],
        ruExplain: 'Во 2-м абзаце она писала яркие масляные этюды на месте в джунглях и горах вместо срисовывания засушенных образцов.'
      }
    ],
    detailItems: [
      {
        question: 'What achievements made Marianne North famous?',
        trueItems: [
          { text: 'She created over 800 vivid botanical oil paintings.', ru: 'создала более 800 ярких ботанических картин маслом' },
          { text: 'She paid for a dedicated gallery to house her collection at Kew.', ru: 'сама профинансировала галерею в Кью-Гарденс' },
          { text: 'She documented some unfamiliar plant species before scientists named them.', ru: 'запечатлела несколько видов до того, как учёные дали им названия' }
        ],
        falseItems: [
          { text: 'She invented the first portable colour camera in 1830.', ru: 'она родилась в 1830 г. и писала маслом до эры цветного фото' },
          { text: 'She donated her collection to a museum in Brazil.', ru: 'коллекция находится в Кью-Гарденс в Лондоне' },
          { text: 'She travelled exclusively with a large team of Victorian artists.', ru: 'она путешествовала в одиночку (<i>independently / solo woman</i>)' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'a Victorian artist who travelled the world painting rare plants', ru: 'текст посвящён путешествиям и ботаническому наследию Марианны Норт' },
      { text: 'Marianne North’s global journeys and botanical art', ru: 'основная тема — кругосветные экспедиции и коллекция картин Марианны Норт' }
    ],
    mainDistractors: [
      'how colour photography replaced oil painting in Europe',
      'a guide to growing pitcher plants inside a greenhouse',
      'why Victorian museums stored dried leaves',
      'travel routes along snowy mountain passes in England',
      'the history of wooden paintboxes in Japan',
      'how Kew Gardens trains modern botanists'
    ],
    definitions: [
      { paragraph: 2, def: 'an impressive achievement requiring skill or courage', answer: 'feat', accept: ['feat'], ruExplain: 'Во 2-м абзаце существительное <b>feat</b> означает «подвиг, выдающееся достижение».' },
      { paragraph: 3, def: 'paid for or provided money for a project', answer: 'funded', accept: ['funded', 'to fund'], ruExplain: 'В 3-м абзаце глагол <b>funded</b> означает «профинансировала».' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'sharp', answer: 'keen', accept: ['keen'], ruExplain: 'В 1-м абзаце слово <b>keen</b> («острый, внимательный» в <i>keen eye</i>) синонимично <i>sharp</i>.' },
      { paragraph: 3, promptWord: 'impressive', answer: 'striking', accept: ['striking'], ruExplain: 'В 3-м абзаце прилагательное <b>striking</b> («поразительный, впечатляющий») синонимично <i>impressive</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Visitors at Kew Gardens in London can still admire … .',
        originalTail: 'her entire collection arranged wall-to-wall inside a dedicated gallery she funded herself',
        models: [
          'all of her paintings (<i>complete set of artworks</i>) displayed closely inside a special room (<i>exhibition hall</i>) she paid for on her own',
          'her whole set of artworks hung side by side in a special hall financed by herself'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>entire collection → all of her paintings / whole set</i>, <i>dedicated gallery → special hall</i>, <i>funded herself → paid for on her own</i>.'
      }
    ],
    opinions: [
      {
        question: 'How can art help scientists and nature lovers understand the natural world?',
        modelAnswer: 'In my opinion, art plays a valuable role in science by recording nature with beauty and precision. Detailed botanical paintings, like those by Marianne North, preserve exact colours and shapes of rare species for future generations. Furthermore, vivid artworks inspire ordinary people to care more deeply about protecting plants and wildlife.',
        ruHint: 'Покажите связь искусства и науки (фиксация деталей, эмоциональное вовлечение в защиту природы) в 3+ предложениях.'
      }
    ]
  },
  {
    id: 'en-read-aqueduct',
    title: 'The Stone Giant Across the Gardon River',
    paragraphs: [
      'Rising nearly fifty metres above a rocky gorge in southern France, the Pont du Gard stands as one of the finest engineering masterpieces of the ancient Roman Empire. Built during the first century CE, this towering three-tier stone bridge was not originally designed for carriages; instead, it formed the vital middle link of a fifty-kilometre aqueduct carrying fresh spring water to the city of Nîmes.',
      'To keep water flowing steadily solely by gravity, Roman surveyors calculated a gentle downward slope of less than three centimetres per hundred metres across hills and valleys. Masons shaped massive yellow limestone blocks weighing up to six tonnes each and fitted them tightly together without a single drop of mortar. Even today, iron clamps and careful stone weight keep the arches standing firm after two millennia.',
      'For centuries, the aqueduct delivered millions of litres daily to Roman baths, fountains, and private homes. Long after the water stopped flowing, the Pont du Gard remains an enduring monument to patience, geometry, and durable construction.'
    ],
    trueFacts: [
      { text: 'The Pont du Gard was built to carry spring water toward Nîmes.', ru: 'В 1-м абзаце указано: мост был частью 50-километрового акведука, доставлявшего воду в Ним.' },
      { text: 'Roman engineers relied on a very slight slope and gravity to move water.', ru: 'Во 2-м абзаце геодезисты рассчитали мягкий уклон (менее 3 см на 100 м), чтобы вода шла самотёком.' },
      { text: 'The massive limestone blocks were joined without using mortar.', ru: 'Каменщики укладывали шеститонные блоки плотно без единой капли раствора (<i>without a single drop of mortar</i>).' },
      { text: 'The structure has survived for around two thousand years.', ru: 'В конце 2-го абзаца сказано: «standing firm after two millennia».' }
    ],
    falseFacts: [
      { text: 'The Pont du Gard was constructed mainly for heavy horse carriages.', ruReason: 'В 1-м абзаце прямо сказано: «was not originally designed for carriages».' },
      { text: 'Powerful water wheels pumped the spring water uphill across the bridge.', ruReason: 'Вода текла исключительно за счёт гравитации по точно рассчитанному уклону.' },
      { text: 'Workers glued small bricks together using thick cement mortar.', ruReason: 'Использовались массивные блоки известняка весом до 6 тонн без раствора.' },
      { text: 'The entire aqueduct collapsed completely after a few decades.', ruReason: 'Арки стоят прочно уже два тысячелетия.' },
      { text: 'The Pont du Gard sits underwater in the middle of a deep lake.', ruReason: 'Он возвышается почти на 50 метров над скалистым ущельем.' },
      { text: 'The aqueduct brought salty seawater into Roman baths in France.', ruReason: 'Он доставлял пресную родниковую воду (<i>fresh spring water</i>).' }
    ],
    completeItems: [
      {
        prompt: 'Roman masons fitted the heavy limestone blocks of the Pont du Gard together … .',
        correct: 'without using any mortar between the stones',
        distractors: [
          'after melting iron over massive wood fires',
          'by cutting each block into tiny light pebbles',
          'to create a wide wooden road for royal carriages',
          'in less than two weeks without surveyor measurements',
          'using modern steel cranes and plastic pipes'
        ],
        ruExplain: 'Во 2-м абзаце сказано: блоки весом до шести тонн плотно подгонялись друг к другу без единой капли раствора.'
      }
    ],
    detailItems: [
      {
        question: 'What facts describe the design of the Pont du Gard aqueduct?',
        trueItems: [
          { text: 'It rises almost fifty metres above a gorge.', ru: 'возвышается почти на 50 метров над ущельем' },
          { text: 'It has three tiers of stone arches.', ru: 'трёхъярусный каменный мост (<i>three-tier</i>)' },
          { text: 'Its fifty-kilometre channel sloped gently downward.', ru: '50-километровый канал имел точный плавный уклон' }
        ],
        falseItems: [
          { text: 'It was built in the nineteenth century.', ru: 'построен в I веке н. э.' },
          { text: 'Its stones weigh less than ten kilograms each.', ru: 'блоки весили до шести тонн каждый' },
          { text: 'It still supplies drinking water to Nîmes every day.', ru: 'вода перестала течь по нему много веков назад (<i>Long after the water stopped flowing</i>)' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'the remarkable Roman engineering of the Pont du Gard', ru: 'весь текст посвящён конструкции, назначению и долговечности римского акведука Пон-дю-Гар' },
      { text: 'an ancient stone aqueduct built to last millennia', ru: 'основная тема — инженерное мастерство строителей древнеримского акведука' }
    ],
    mainDistractors: [
      'why Roman baths in Nîmes were closed',
      'how to carve iron clamps in ancient workshops',
      'a modern carriage bridge across French valleys',
      'the geology of yellow rocks in southern Europe',
      'how fountains are decorated in French parks',
      'why steep slopes are bad for river boats'
    ],
    definitions: [
      { paragraph: 1, def: 'a deep, narrow valley with steep rocky sides', answer: 'gorge', accept: ['gorge'], ruExplain: 'В 1-м абзаце существительное <b>gorge</b> означает «ущелье».' },
      { paragraph: 3, def: 'lasting for a very long time without breaking easily', answer: 'durable', accept: ['durable'], ruExplain: 'В 3-м абзаце прилагательное <b>durable</b> означает «прочный, долговечный».' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'essential', answer: 'vital', accept: ['vital'], ruExplain: 'В 1-м абзаце слово <b>vital</b> («жизненно важный») является синонимом <i>essential</i>.' },
      { paragraph: 2, promptWord: 'huge', answer: 'massive', accept: ['massive'], ruExplain: 'Во 2-м абзаце слово <b>massive</b> («огромный, массивный») соответствует <i>huge</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Long after the water stopped flowing, the Pont du Gard remains … .',
        originalTail: 'an enduring monument to patience, geometry, and durable construction',
        models: [
          'a lasting (<i>permanent</i>) symbol (<i>tribute / memorial</i>) of careful planning, mathematics, and strong building',
          'a timeless reminder of skilled calculation and solid stone engineering'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>enduring → lasting / timeless</i>, <i>monument → symbol / reminder</i>, <i>durable → strong / solid</i>.'
      }
    ],
    opinions: [
      {
        question: 'What can modern builders learn from ancient structures like the Pont du Gard?',
        modelAnswer: 'Modern builders can learn the importance of durability and careful planning from ancient monuments like the Pont du Gard. Instead of building structures that need constant repairs, Roman engineers focused on quality materials and exact geometry. As a result, their work still inspires architects two thousand years later.',
        ruHint: 'Опишите уроки древнего зодчества (качество, расчёт, долговечность) в 3–4 предложениях.'
      }
    ]
  },
  {
    id: 'en-read-librarybox',
    title: 'Small Wooden Boxes Full of Stories',
    paragraphs: [
      'While strolling along a quiet residential street in many towns today, you may notice a colourful wooden box perched on a post like a giant birdhouse. Through its clear glass door, neat rows of paperback novels, cookbooks, and children’s stories invite passersby to pause and browse.',
      'This grass-roots movement began in 2009 when Todd Bol, a resident of Wisconsin, built a tiny model of a one-room schoolhouse on his front lawn to honour his mother, a lifelong teacher. He filled the miniature house with books and attached a simple sign: “Take a Book, Share a Book.” Neighbours loved the idea immediately, stopping not only to swap stories but also to chat with one another.',
      'Since then, more than one hundred thousand Little Free Libraries have appeared in over a hundred countries, from busy train stations to remote mountain villages. Operating purely on trust without late fees or barcodes, these neighbourhood boxes remind communities that reading thrives best when stories are shared freely.'
    ],
    trueFacts: [
      { text: 'Todd Bol created the first little book box in memory of his mother.', ru: 'Во 2-м абзаце: Тодд Бол построил модель маленькой школы в честь матери-учительницы.' },
      { text: 'Readers do not have to pay late fees when using a Little Free Library.', ru: 'В 3-м абзаце указано: «Operating purely on trust without late fees or barcodes».' },
      { text: 'The tiny libraries helped neighbours talk and get to know one another.', ru: 'Соседи останавливались не только обменяться книгами, но и пообщаться.' },
      { text: 'Over one hundred countries now host Little Free Library boxes.', ru: 'Более 100 000 коробок появились в свыше чем ста странах мира.' }
    ],
    falseFacts: [
      { text: 'Passersby must scan digital barcodes before opening the glass door.', ruReason: 'Коробки работают на полном доверии, без штрихкодов и штрафов (<i>without late fees or barcodes</i>).' },
      { text: 'Todd Bol built his first wooden book box in 1950 inside a train station.', ruReason: 'Он построил его в 2009 году на лужайке перед своим домом в Висконсине.' },
      { text: 'People are forbidden from taking books unless they bring two new ones first.', ruReason: 'Правило простое и доверительное: «Take a Book, Share a Book».' },
      { text: 'The movement has remained popular only inside one town in Wisconsin.', ruReason: 'Она распространилась более чем на сто стран мира.' },
      { text: 'Todd Bol’s mother worked as a carpenter building large birdhouses.', ruReason: 'Его мать всю жизнь проработала учительницей (<i>a lifelong teacher</i>).' },
      { text: 'Little Free Libraries hold only expensive dictionaries and maps.', ruReason: 'В них стоят романы в мягкой обложке, кулинарные книги и детские рассказы.' }
    ],
    completeItems: [
      {
        prompt: 'In 2009, Todd Bol placed a tiny wooden schoolhouse on his lawn in order to … .',
        correct: 'pay tribute to his mother and share books with neighbours',
        distractors: [
          'sell rare cookbooks to tourists passing by train',
          'protect wild birds during cold Wisconsin winters',
          'replace every large public library in his country',
          'collect late fees from students in his street',
          'store gardening tools behind a locked glass door'
        ],
        ruExplain: 'Во 2-м абзаце сказано, что он сделал это в честь своей матери-учительницы и повесил табличку «Возьми книгу, поделись книгой».'
      }
    ],
    detailItems: [
      {
        question: 'How do Little Free Libraries operate?',
        trueItems: [
          { text: 'They rely completely on community trust.', ru: 'работают исключительно на доверии' },
          { text: 'They can be found everywhere from stations to mountain villages.', ru: 'встречаются от вокзалов до горных деревень' },
          { text: 'They display books behind a transparent glass door.', ru: 'книги видны через прозрачную стеклянную дверцу' }
        ],
        falseItems: [
          { text: 'They charge small fines when books stay out too long.', ru: 'штрафов за просрочку (<i>late fees</i>) нет' },
          { text: 'They require official library membership cards.', ru: 'читательские билеты и штрихкоды не нужны' },
          { text: 'They are always built out of solid brick and stone.', ru: 'это цветные деревянные ящики (<i>wooden box</i>)' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'a worldwide book-sharing project built on community trust', ru: 'текст описывает появление и мировое распространение уличных мини-библиотек' },
      { text: 'the story and success of Little Free Libraries', ru: 'основная тема — история движения Little Free Library' }
    ],
    mainDistractors: [
      'how to build wooden birdhouses in school workshops',
      'why paperback novels are cheaper than hardcovers',
      'the duties of lifelong teachers in Wisconsin',
      'how barcode scanners work in city libraries',
      'train station architecture in over a hundred countries',
      'ways to write popular cookbooks'
    ],
    definitions: [
      { paragraph: 1, def: 'people who happen to be walking past a place', answer: 'passersby', accept: ['passersby', 'passers-by'], ruExplain: 'В 1-м абзаце существительное <b>passersby</b> означает «прохожие».' },
      { paragraph: 3, def: 'grows, develops, or succeeds strongly', answer: 'thrives', accept: ['thrives', 'to thrive', 'thrive'], ruExplain: 'В 3-м абзаце глагол <b>thrives</b> означает «процветает, успешно развивается».' }
    ],
    synonyms: [
      { paragraph: 2, promptWord: 'exchange', answer: 'swap', accept: ['swap', 'to swap'], ruExplain: 'Во 2-м абзаце глагол <b>swap</b> («обмениваться») является точным синонимом <i>exchange</i>.' },
      { paragraph: 2, promptWord: 'tiny', answer: 'miniature', accept: ['miniature'], ruExplain: 'Во 2-м абзаце прилагательное <b>miniature</b> («миниатюрный») синонимично слову <i>tiny</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Operating purely on trust without late fees or barcodes, these neighbourhood boxes … .',
        originalTail: 'remind communities that reading thrives best when stories are shared freely',
        models: [
          'show (<i>teach</i>) local residents (<i>people</i>) that books (<i>reading</i>) flourish (<i>grow best</i>) when tales are exchanged openly',
          'demonstrate to townspeople that a love of books grows strongest through open sharing'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>remind → show / teach</i>, <i>communities → local residents</i>, <i>thrives → flourishes / grows</i>, <i>shared freely → exchanged openly</i>.'
      }
    ],
    opinions: [
      {
        question: 'Would a Little Free Library work well in your neighbourhood? Explain why or why not.',
        modelAnswer: 'I believe a Little Free Library would work wonderfully in my neighbourhood. Many children and adults pass through our local park every day, so they could easily pick up interesting novels on their way home. Moreover, sharing books without strict rules encourages kindness and brings neighbours closer together.',
        ruHint: 'Оцените идею для своего района и приведите 2 аргумента (доступность книг, общение соседей) в 3+ предложениях.'
      }
    ]
  },
  {
    id: 'en-read-monarch',
    title: 'Four Generations on Fragile Orange Wings',
    paragraphs: [
      'Every autumn, millions of bright orange-and-black monarch butterflies depart from gardens across Canada and the northern United States, flying up to four thousand kilometres south to warm mountain forests in central Mexico. Weighing less than a gram, these delicate insects navigate accurately using the position of the sun and Earth’s magnetic field.',
      'Unlike migratory birds that complete a round trip themselves, no single butterfly finishes the entire cycle alone. The autumn travellers spend winter resting tightly together on tall fir trees before flying north in spring to lay eggs on milkweed plants. Their children, grandchildren, and great-grandchildren continue the northward journey in relays; remarkably, the fourth generation lives longer and instinctively flies all the way back to the same Mexican forests it has never seen.',
      'Because habitat loss and vanishing milkweed fields threaten this marvel of nature, volunteers now plant native wildflowers along highways and backyards to keep the ancient migration alive.'
    ],
    trueFacts: [
      { text: 'Monarch butterflies fly south to central Mexico every autumn.', ru: 'В 1-м абзаце указано: каждую осень монархи летят на юг в горные леса центральной Мексики.' },
      { text: 'The butterflies rely on sunlight and Earth’s magnetic field to find their way.', ru: 'Они ориентируются по положению солнца и магнитному полю Земли.' },
      { text: 'The fourth generation completes the long flight back south without having been there before.', ru: 'Во 2-м абзаце четвёртое поколение живёт дольше и инстинктивно возвращается в те же мексиканские леса.' },
      { text: 'Planting native wildflowers helps support migrating monarch butterflies.', ru: 'В 3-м абзаце добровольцы высаживают местные полевые цветы и молочай (<i>milkweed</i>).' }
    ],
    falseFacts: [
      { text: 'A single monarch butterfly completes the entire round-trip migration alone.', ruReason: 'Во 2-м абзаце прямо сказано: «no single butterfly finishes the entire cycle alone».' },
      { text: 'Monarchs navigate across North America only by following highway signs.', ruReason: 'Они ориентируются по положению солнца и магнитному полю Земли.' },
      { text: 'Every generation of monarch butterflies lives for exactly the same length of time.', ruReason: 'Четвёртое поколение живёт дольше (<i>lives longer</i>), чтобы совершить осенний перелёт.' },
      { text: 'Monarch butterflies lay their eggs on tall pine trees in winter.', ruReason: 'Весной они откладывают яйца на растения молочая (<i>milkweed plants</i>).' },
      { text: 'The fourth generation flies to northern Canada for the cold winter.', ruReason: 'Осенью четвёртое поколение летит на юг, в тёплые леса Мексики.' },
      { text: 'Volunteers cut down milkweed fields along highways to help the butterflies.', ruReason: 'Напротив, исчезновение молочая угрожает бабочкам, и люди высаживают полевые цветы.' }
    ],
    completeItems: [
      {
        prompt: 'In spring, the butterflies that wintered in Mexico fly northward in order to … .',
        correct: 'lay eggs on milkweed plants and begin the next generation',
        distractors: [
          'stay resting tightly on tall fir trees all summer',
          'teach their great-grandchildren how to read the sun',
          'avoid flying across the United States and Canada',
          'escape volunteers who plant native wildflowers',
          'spend another four months sleeping in mountain caves'
        ],
        ruExplain: 'Во 2-м абзаце: «before flying north in spring to lay eggs on milkweed plants».'
      }
    ],
    detailItems: [
      {
        question: 'What makes the migration of monarch butterflies unusual?',
        trueItems: [
          { text: 'It takes four separate generations to finish the full yearly cycle.', ru: 'полный цикл проходит за четыре поколения' },
          { text: 'The fourth generation locates winter forests it has never visited.', ru: 'четвёртое поколение инстинктивно находит леса, которых никогда не видело' },
          { text: 'Tiny insects weighing under a gram travel thousands of kilometres.', ru: 'насекомые весом меньше грамма преодолевают до 4000 км' }
        ],
        falseItems: [
          { text: 'Only male monarchs migrate south in autumn.', ru: 'бабочки откладывают яйца весной, в миграции участвуют оба пола' },
          { text: 'Monarchs fly exclusively at night without sunlight.', ru: 'они используют положение солнца для навигации' },
          { text: 'The butterflies spend winter swimming across warm rivers.', ru: 'они зимуют, отдыхая на высоких пихтах в лесах Мексики' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'the extraordinary multi-generation migration of monarch butterflies', ru: 'текст посвящён уникальной четырёхпоколенной миграции бабочек-монархов' },
      { text: 'how monarch butterflies navigate and survive across generations', ru: 'основная тема — навигация, цикл поколений и защита бабочек-монархов' }
    ],
    mainDistractors: [
      'why Canadian gardens lose flowers in winter',
      'how scientists measure Earth’s magnetic field',
      'different types of fir trees in central Mexico',
      'how highways are built across North America',
      'why birds travel faster than insects',
      'how to raise caterpillars indoors'
    ],
    definitions: [
      { paragraph: 1, def: 'to leave a place, especially to start a journey', answer: 'to depart', accept: ['depart'], ruExplain: 'В 1-м абзаце глагол <b>to depart</b> означает «отправляться, улетать».' },
      { paragraph: 3, def: 'disappearing completely or becoming impossible to find', answer: 'vanishing', accept: ['vanishing', 'to vanish', 'vanish'], ruExplain: 'В 3-м абзаце причастие <b>vanishing</b> означает «исчезающий».' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'fragile', answer: 'delicate', accept: ['delicate'], ruExplain: 'В 1-м абзаце прилагательное <b>delicate</b> («хрупкий, нежный») является синонимом <i>fragile</i>.' },
      { paragraph: 3, promptWord: 'wonder', answer: 'marvel', accept: ['marvel'], ruExplain: 'В 3-м абзаце существительное <b>marvel</b> («чудо») синонимично слову <i>wonder</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Because vanishing milkweed fields threaten this marvel of nature, volunteers now … .',
        originalTail: 'plant native wildflowers along highways and backyards to keep the ancient migration alive',
        models: [
          'grow (<i>sow</i>) local flowers beside roads and in gardens to preserve (<i>protect / save</i>) the long-standing journey',
          'add local flowering plants near roads and homes so the historic trip continues'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>plant → grow / sow</i>, <i>native wildflowers → local flowers</i>, <i>highways → roads</i>, <i>keep ... alive → preserve / protect</i>.'
      }
    ],
    opinions: [
      {
        question: 'Can small actions by ordinary citizens make a real difference in protecting wildlife? Why or why not?',
        modelAnswer: 'Yes, I strongly believe small actions by ordinary people can create huge positive changes for wildlife. For instance, planting native flowers in a backyard gives migrating insects like monarch butterflies vital food and shelter along their journey. When thousands of households take simple steps together, entire ecosystems become much healthier.',
        ruHint: 'Поддержите мысль на примере маленьких шагов (посадка цветов, забота о среде) и суммарного эффекта в 3+ предложениях.'
      }
    ]
  },
  {
    id: 'en-read-mammadaliyev',
    title: 'Yusif Mammadaliyev: Pioneer of Azerbaijani Chemistry',
    paragraphs: [
      'Born in Ordubad in 1905, Yusif Mammadaliyev grew up in a family that deeply valued books and education. After studying chemistry in Baku and Moscow, he returned to Azerbaijan determined to apply scientific research to practical industry. Friends remembered him as an energetic teacher who often worked late into the night beside glass flasks and notebooks.',
      'During the early 1940s, military aircraft urgently needed cleaner, high-octane fuel that would allow engines to run smoothly at extreme heights without freezing or losing power. Mammadaliyev led a dedicated team of researchers in Baku and discovered an innovative chemical process to produce high-quality aviation fuel from local oil gases. His breakthrough proved vital for pilots and earned him top scientific honours.',
      'After the war, Mammadaliyev helped establish the Azerbaijan National Academy of Sciences and served as its president, mentoring hundreds of young scholars. Today, research institutes and streets across the country carry his name, celebrating a scientist whose discoveries strengthened both science and industry.'
    ],
    trueFacts: [
      { text: 'Yusif Mammadaliyev studied chemistry in both Baku and Moscow.', ru: 'В 1-м абзаце сказано: «After studying chemistry in Baku and Moscow, he returned to Azerbaijan».' },
      { text: 'His team created high-octane aviation fuel from local oil gases.', ru: 'Во 2-м абзаце описано открытие процесса получения высокооктанового авиационного топлива из местных нефтяных газов.' },
      { text: 'Mammadaliyev served as president of the Azerbaijan National Academy of Sciences.', ru: 'В 3-м абзаце он помог основать Национальную академию наук Азербайджана и был её президентом.' },
      { text: 'Streets and research institutes in Azerbaijan are named after him.', ru: 'Научные институты и улицы по всей стране носят его имя.' }
    ],
    falseFacts: [
      { text: 'Mammadaliyev never returned to Azerbaijan after completing his studies in Moscow.', ruReason: 'После учёбы он вернулся в Азербайджан, чтобы развивать науку и промышленность.' },
      { text: 'His research focused exclusively on literature and ancient history.', ruReason: 'Он был выдающимся химиком и разработчиком авиационного топлива.' },
      { text: 'The fuel developed by his team froze easily at high altitudes.', ruReason: 'Его топливо позволяло двигателям работать ровно на больших высотах без замерзания.' },
      { text: 'Mammadaliyev worked completely alone without any team of researchers.', ruReason: 'Он возглавлял целеустремлённую команду исследователей в Баку (<i>led a dedicated team</i>).' },
      { text: 'He refused to teach or guide younger university students.', ruReason: 'В 3-м абзаце он был наставником сотен молодых учёных (<i>mentoring hundreds of young scholars</i>).' },
      { text: 'His chemical process relied on imported coal from South America.', ruReason: 'Топливо получали из местных нефтяных газов (<i>local oil gases</i>).' }
    ],
    completeItems: [
      {
        prompt: 'In the early 1940s, aircraft needed special high-octane fuel so that engines could … .',
        correct: 'operate reliably at great heights without freezing',
        distractors: [
          'burn solid coal instead of refined oil gases',
          'fly slowly inside low coastal valleys',
          'run without any notebooks or laboratory research',
          'be turned into glass flasks after the war',
          'work only during warm summer afternoons'
        ],
        ruExplain: 'Во 2-м абзаце: топливо было нужно, чтобы двигатели работали ровно на больших высотах без замерзания и потери мощности.'
      }
    ],
    detailItems: [
      {
        question: 'What contributions did Yusif Mammadaliyev make to Azerbaijan?',
        trueItems: [
          { text: 'He developed a key method for making high-octane aviation fuel.', ru: 'разработал способ получения высокооктанового авиатоплива' },
          { text: 'He helped found and lead the National Academy of Sciences.', ru: 'помог основать и возглавил Национальную академию наук' },
          { text: 'He guided and trained hundreds of younger researchers.', ru: 'воспитал сотни молодых учёных' }
        ],
        falseItems: [
          { text: 'He designed the first commercial passenger airplane in Baku.', ru: 'он создал топливо для самолётов, а не сами самолёты' },
          { text: 'He moved permanently to Moscow in 1945.', ru: 'после войны он возглавлял Академию наук в Азербайджане' },
          { text: 'He closed industrial laboratories to focus only on schoolbooks.', ru: 'он стремился применять научные исследования в промышленности' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'the life and scientific achievements of Yusif Mammadaliyev', ru: 'весь текст посвящён жизни, научному прорыву и наследию академика Юсифа Мамедалиева' },
      { text: 'an outstanding Azerbaijani chemist and educator', ru: 'основная тема — выдающийся азербайджанский химик и организатор науки' }
    ],
    mainDistractors: [
      'how glass flasks are made in Moscow factories',
      'the history of education in Ordubad schools',
      'why aircraft engines fail in tropical storms',
      'how local oil gases are transported by ships',
      'famous streets and monuments in Baku',
      'how the Academy of Sciences chooses new buildings'
    ],
    definitions: [
      { paragraph: 2, def: 'an important new discovery or development', answer: 'breakthrough', accept: ['breakthrough'], ruExplain: 'Во 2-м абзаце существительное <b>breakthrough</b> означает «прорыв, важное открытие».' },
      { paragraph: 3, def: 'advising and training younger or less experienced people', answer: 'mentoring', accept: ['mentoring', 'to mentor', 'mentor'], ruExplain: 'В 3-м абзаце слово <b>mentoring</b> означает «наставничество, обучение молодых учёных».' }
    ],
    synonyms: [
      { paragraph: 1, promptWord: 'active', answer: 'energetic', accept: ['energetic'], ruExplain: 'В 1-м абзаце прилагательное <b>energetic</b> («энергичный») синонимично слову <i>active</i>.' },
      { paragraph: 2, promptWord: 'essential', answer: 'vital', accept: ['vital'], ruExplain: 'Во 2-м абзаце слово <b>vital</b> («жизненно важный») является синонимом <i>essential</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Today, research institutes and streets across the country carry his name, … .',
        originalTail: 'celebrating a scientist whose discoveries strengthened both science and industry',
        models: [
          'honouring (<i>remembering</i>) a scholar (<i>researcher</i>) whose inventions (<i>achievements</i>) improved (<i>supported</i>) both learning and production',
          'paying tribute to a chemist whose findings advanced academic research and manufacturing'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>celebrating → honouring / paying tribute to</i>, <i>scientist → scholar / researcher</i>, <i>discoveries → findings / achievements</i>, <i>strengthened → improved / advanced</i>.'
      }
    ],
    opinions: [
      {
        question: 'Why are scientists and teachers important for the progress of a country?',
        modelAnswer: 'In my opinion, scientists and teachers are the true foundation of a nation’s progress. Teachers inspire curiosity in young students and help them develop strong skills for the future. Meanwhile, scientists turn knowledge into practical discoveries that improve healthcare, technology, and everyday life.',
        ruHint: 'Объясните вклад учителей (подготовка кадров) и учёных (новые технологии и развитие) в 3–4 предложениях.'
      }
    ]
  },
  {
    id: 'en-read-tactilemaps',
    title: 'Navigating Cities Through Sound and Touch',
    paragraphs: [
      'Moving quickly through a busy underground metro station is something many commuters do without a second thought. For blind and low-vision travellers, however, unfamiliar corridors, sudden staircases, and crowded platforms can turn a simple morning journey into a stressful puzzle.',
      'To make public transit easier for everyone, urban designers are installing interactive tactile maps beside station entrances. Raised metal lines show exact corridor turns, textured dots mark escalators and ticket gates, and small sensors respond gently to a fingertip. When a user touches a platform icon, a clear recorded voice announces train directions and exit names without blocking background traffic sounds.',
      'Commuters who test these smart maps report greater confidence when visiting new districts independently. By combining simple physical touch with helpful audio cues, modern cities are taking practical steps toward safer, more welcoming streets.'
    ],
    trueFacts: [
      { text: 'Unfamiliar metro stations can be challenging for visually impaired passengers.', ru: 'В 1-м абзаце: незнакомые коридоры, лестницы и толпы делают поездку сложной для незрячих.' },
      { text: 'Interactive tactile maps use raised lines and dots to represent station layouts.', ru: 'Во 2-м абзаце рельефные металлические линии и точки показывают повороты, эскалаторы и турникеты.' },
      { text: 'Touching an icon on the map triggers spoken route information.', ru: 'При прикосновении к значку платформы голос объявляет направление поездов и выходы.' },
      { text: 'Smart tactile maps help blind commuters feel more confident in new areas.', ru: 'В 3-м абзаце пассажиры отмечают большую уверенность при самостоятельных поездках.' }
    ],
    falseFacts: [
      { text: 'Interactive tactile maps play loud music that blocks all traffic noise.', ruReason: 'Голос звучит чётко, не заглушая окружающие звуки движения (<i>without blocking background traffic sounds</i>).' },
      { text: 'Urban designers install tactile maps only inside moving subway trains.', ruReason: 'Карты устанавливаются у входов на станции (<i>beside station entrances</i>).' },
      { text: 'The new station maps rely strictly on flat paper posters with tiny print.', ruReason: 'Это рельефные металлические карты с сенсорами и звуковыми подсказками.' },
      { text: 'Low-vision travellers must ask station guards to read the tactile maps for them.', ruReason: 'Датчики срабатывают от прикосновения пальца и озвучивают маршрут напрямую пользователю.' },
      { text: 'Users have felt less independent since testing the smart station maps.', ruReason: 'Пассажиры отмечают возросшую уверенность при самостоятельном посещении новых районов.' },
      { text: 'Textured dots on the maps warn people about distant weather storms.', ruReason: 'Рельефные точки обозначают эскалаторы и турникеты.' }
    ],
    completeItems: [
      {
        prompt: 'When a passenger presses a platform symbol on the tactile map, … .',
        correct: 'a clear voice gives train directions and exit details',
        distractors: [
          'a bright green light flashes on the distant staircase',
          'the station ticket gate opens automatically for free',
          'background traffic noise becomes completely silent',
          'a printed paper map slides out of the metal frame',
          'a loud alarm warns everyone on the crowded platform'
        ],
        ruExplain: 'Во 2-м абзаце: «When a user touches a platform icon, a clear recorded voice announces train directions and exit names».'
      }
    ],
    detailItems: [
      {
        question: 'How do interactive tactile maps assist subway passengers?',
        trueItems: [
          { text: 'Raised lines trace the paths of station corridors.', ru: 'рельефные линии показывают повороты коридоров' },
          { text: 'Textured dots indicate escalators and ticket gates.', ru: 'текстурные точки обозначают эскалаторы и турникеты' },
          { text: 'Touch sensors trigger spoken announcements of exits.', ru: 'сенсоры запускают голосовое объявление выходов' }
        ],
        falseItems: [
          { text: 'They sell subway tickets directly from the map screen.', ru: 'билеты карты не продают' },
          { text: 'They guide trains automatically through underground tunnels.', ru: 'карты помогают пассажирам ориентироваться на станциях' },
          { text: 'They block all surrounding sounds inside the metro.', ru: 'напротив, не блокируют фоновые звуки' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'smart tactile maps improving accessibility in city transport', ru: 'текст описывает интерактивные тактильные карты для незрячих пассажиров в метро' },
      { text: 'helping visually impaired commuters navigate metro stations', ru: 'основная тема — доступная навигация в метро с помощью осязания и звука' }
    ],
    mainDistractors: [
      'how underground metro tunnels are dug in big cities',
      'why morning commuters always hurry to catch trains',
      'the history of paper transit maps in Europe',
      'how to repair broken escalators in subway stations',
      'why ticket gates cause delays during rush hour',
      'how designers choose colours for street signs'
    ],
    definitions: [
      { paragraph: 1, def: 'people who regularly travel between home and work or school', answer: 'commuters', accept: ['commuters', 'commuter'], ruExplain: 'В 1-м абзаце слово <b>commuters</b> означает «регулярные пассажиры, ездящие на работу/учёбу».' },
      { paragraph: 2, def: 'higher than the surrounding flat surface', answer: 'raised', accept: ['raised'], ruExplain: 'Во 2-м абзаце слово <b>raised</b> означает «выпуклый, рельефный».' }
    ],
    synonyms: [
      { paragraph: 2, promptWord: 'softly', answer: 'gently', accept: ['gently'], ruExplain: 'Во 2-м абзаце наречие <b>gently</b> («мягко, легко») является синонимом <i>softly</i>.' },
      { paragraph: 3, promptWord: 'signals', answer: 'cues', accept: ['cues', 'cue'], ruExplain: 'В 3-м абзаце существительное <b>cues</b> («подсказки, сигналы») синонимично слову <i>signals</i>.' }
    ],
    paraphrases: [
      {
        starter: 'By combining simple physical touch with helpful audio cues, modern cities … .',
        originalTail: 'are taking practical steps toward safer, more welcoming streets',
        models: [
          'are making (<i>taking</i>) real (<i>useful</i>) progress toward friendlier and more secure urban spaces',
          'are moving steadily toward more comfortable and secure public areas'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>taking steps → making progress</i>, <i>practical → real / useful</i>, <i>safer → more secure</i>, <i>welcoming → friendlier</i>, <i>streets → urban spaces</i>.'
      }
    ],
    opinions: [
      {
        question: 'Why is it important to design public spaces that everyone can use easily?',
        modelAnswer: 'I believe designing accessible public spaces is essential because every citizen deserves equal independence and safety. Simple tools like ramps, clear signs, and tactile maps help elderly people, parents with strollers, and visually impaired commuters move around confidently. Ultimately, an inclusive city becomes warmer and fairer for the whole community.',
        ruHint: 'Объясните пользу доступной среды для разных групп людей и для общества в целом (3+ предложения).'
      }
    ]
  },
  {
    id: 'en-read-paperlantern',
    title: 'The Science Inside a Classical Violin',
    paragraphs: [
      'For more than three centuries, musicians and scientists have wondered why violins crafted in Cremona, Italy, during the seventeenth and eighteenth centuries produce such a warm, carrying tone. Makers like Antonio Stradivari spent decades selecting slow-grown alpine spruce trees and maple timber, shaping each thin wooden plate with extraordinary patience.',
      'Modern researchers recently used medical CT scanners and sound sensors to examine surviving Cremona instruments without scratching a single drop of varnish. Their scans revealed that the ancient masters naturally treated their wood with mineral salts—such as borax, zinc, and potassium—likely to protect the timber from hungry woodworms. Unexpectedly, those minerals also stiffened the wood fibres while keeping the instrument light.',
      'In addition, centuries of gentle vibration during concerts gradually reshaped microscopic wood structures, allowing notes to project clearly across huge concert halls. Today’s violin makers combine these mineral recipes with precision acoustics to craft new instruments that rival historic treasures.'
    ],
    trueFacts: [
      { text: 'Antonio Stradivari chose alpine spruce and maple wood for his violins.', ru: 'В 1-м абзаце указано: мастера отбирали альпийскую ель и клён.' },
      { text: 'Scientists studied old violins safely using medical CT scanners.', ru: 'Во 2-м абзаце исследователи применили медицинские КТ-сканеры, не поцарапав лак.' },
      { text: 'Mineral treatments originally protected the wood from woodworms.', ru: 'Минеральные соли (бура, цинк, калий) применялись, вероятно, для защиты от жуков-древоточцев.' },
      { text: 'Centuries of playing subtly changed the wood’s microscopic structure.', ru: 'В 3-м абзаце столетия вибраций на концертах изменили микроструктуру древесины.' }
    ],
    falseFacts: [
      { text: 'Researchers had to scrape off the old varnish to examine Stradivari violins.', ruReason: 'КТ-сканеры позволили изучить инструменты, не поцарапав ни капли лака.' },
      { text: 'Stradivari crafted his famous instruments out of heavy tropical bamboo.', ruReason: 'Использовались альпийская ель (<i>alpine spruce</i>) и клён (<i>maple</i>).' },
      { text: 'Mineral salts made Cremona violins too heavy for musicians to hold.', ruReason: 'Минералы укрепили волокна, сохранив лёгкость инструмента (<i>keeping the instrument light</i>).' },
      { text: 'Today’s violin makers refuse to test any mineral wood treatments.', ruReason: 'Современные мастера сочетают эти минеральные рецепты с точной акустикой.' },
      { text: 'Cremona violins were made in the twentieth century.', ruReason: 'Они создавались в XVII и XVIII веках (<i>more than three centuries</i>).' },
      { text: 'Regular concert playing ruined the tone of seventeenth-century violins.', ruReason: 'Многовековая вибрация помогла звуку лучше разноситься по большим залам.' }
    ],
    completeItems: [
      {
        prompt: 'While protecting timber against insects, mineral salts in old Italian violins also … .',
        correct: 'made the wood fibres firmer without adding heavy weight',
        distractors: [
          'melted the outer varnish during bright summer concerts',
          'stopped sound waves from travelling across large halls',
          'turned maple wood into brittle dark stone',
          'prevented modern CT scanners from seeing inside',
          'forced musicians to replace wooden plates every year'
        ],
        ruExplain: 'Во 2-м абзаце сказано, что минералы сделали волокна жёстче/упругее, сохранив лёгкость дерева.'
      }
    ],
    detailItems: [
      {
        question: 'What factors explain the rich sound of historic Cremona violins?',
        trueItems: [
          { text: 'Careful selection of alpine spruce and maple wood', ru: 'тщательный отбор альпийской ели и клёна' },
          { text: 'Mineral treatments that strengthened wood fibres', ru: 'обработка минеральными солями' },
          { text: 'Long-term musical vibrations reshaping wood fibers', ru: 'многовековая вибрация на концертах' }
        ],
        falseItems: [
          { text: 'Thick layers of plastic paint on the wooden plates', ru: 'использовался натуральный лак, а не пластиковая краска' },
          { text: 'Heavy metal springs hidden inside the violin box', ru: 'внутри нет металлических пружин' },
          { text: 'Fast-growing tropical trees harvested in winter', ru: 'выбирали медленно растущую альпийскую ель (<i>slow-grown</i>)' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'discovering the acoustic secrets behind classic Cremona violins', ru: 'текст раскрывает научные причины удивительного звучания скрипок Кремоны' },
      { text: 'how science explains the tone of historic violins', ru: 'основная тема — сочетание мастерства, минералов и времени в звучании старинных скрипок' }
    ],
    mainDistractors: [
      'how to repair scratched varnish on wooden furniture',
      'why medical CT scanners were invented in Italy',
      'the life story of modern orchestra conductors',
      'how woodworms destroy alpine forests in Europe',
      'why large concert halls use electronic microphones',
      'the history of Italian cities in the seventeenth century'
    ],
    definitions: [
      { paragraph: 1, def: 'wood prepared for use in building or making things', answer: 'timber', accept: ['timber'], ruExplain: 'В 1-м абзаце существительное <b>timber</b> означает «древесина, лесоматериал».' },
      { paragraph: 3, def: 'to equal or match something in quality', answer: 'to rival', accept: ['rival'], ruExplain: 'В 3-м абзаце глагол <b>to rival</b> означает «соперничать, не уступать по качеству».' }
    ],
    synonyms: [
      { paragraph: 2, promptWord: 'check', answer: 'examine', accept: ['examine', 'to examine'], ruExplain: 'Во 2-м абзаце глагол <b>examine</b> («исследовать, изучать») синонимичен <i>check</i>.' },
      { paragraph: 3, promptWord: 'slowly', answer: 'gradually', accept: ['gradually'], ruExplain: 'В 3-м абзаце наречие <b>gradually</b> («постепенно») близко по значению к <i>slowly</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Today’s violin makers combine these mineral recipes with precision acoustics to … .',
        originalTail: 'craft new instruments that rival historic treasures',
        models: [
          'build (<i>create / produce</i>) modern violins (<i>musical tools</i>) that match (<i>equal</i>) famous old masterpieces',
          'produce fresh violins able to compete with classic centuries-old works'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>craft → build / create</i>, <i>instruments → violins</i>, <i>rival → match / compete with</i>, <i>historic treasures → old masterpieces</i>.'
      }
    ],
    opinions: [
      {
        question: 'Do you think traditional craftsmanship is still valuable in an age of modern machines? Why?',
        modelAnswer: 'Yes, I strongly believe traditional craftsmanship remains deeply valuable even today. Handmade items carry human care, patience, and attention to detail that factory machines rarely match. Moreover, combining classic techniques with modern science allows artisans to create products of extraordinary quality.',
        ruHint: 'Выскажите мнение о ценности ручного мастерства (качество, индивидуальность, синтез с наукой) в 3–4 предложениях.'
      }
    ]
  },
  {
    id: 'en-read-nighttrain',
    title: 'The Return of European Night Trains',
    paragraphs: [
      'For decades, cheap short-haul flights pushed classic overnight sleeper trains off many European railway timetables. Recently, however, environmentally conscious travellers have sparked a lively revival of night rail journeys connecting major capitals from Vienna and Zurich to Paris and Amsterdam.',
      'The appeal is simple: passengers board a comfortable sleeper carriage in the evening, read or chat over tea, and wake up refreshed right in the centre of another country—without long airport security lines or extra taxi rides from distant runways. Modern night trains also feature quiet cabins, power sockets, and secure bicycle racks for adventure tourists.',
      'Studies show that an overnight train trip produces far fewer carbon emissions than an equivalent airplane flight. Although ticket prices and cross-border railway rules still pose challenges, rail companies are ordering sleek new sleeper carriages to make sustainable travel easier across the continent.'
    ],
    trueFacts: [
      { text: 'Cheap regional flights once reduced the popularity of overnight trains.', ru: 'В 1-м абзаце: дешёвые короткие авиарейсы на десятилетия вытеснили ночные поезда.' },
      { text: 'Night trains bring passengers directly into the centres of destination cities.', ru: 'Во 2-м абзаце путешественники просыпаются прямо в центре другой страны без поездок из аэропорта.' },
      { text: 'Rail travel at night creates much lower carbon emissions than flying.', ru: 'В 3-м абзаце ночной поезд даёт значительно меньше углеродных выбросов, чем перелёт.' },
      { text: 'Railway operators are buying new sleeper carriages to expand night routes.', ru: 'Железнодорожные компании заказывают новые современные спальные вагоны.' }
    ],
    falseFacts: [
      { text: 'Night trains take passengers only to distant runways outside capital cities.', ruReason: 'Поезда прибывают прямо в центр города, избавляя от такси из аэропортов.' },
      { text: 'Passengers are not allowed to bring bicycles onto modern sleeper trains.', ruReason: 'На новых ночных поездах предусмотрены специальные стойки для велосипедов (<i>secure bicycle racks</i>).' },
      { text: 'An overnight train produces more carbon emissions than a short-haul flight.', ruReason: 'Поезд производит гораздо меньше (<i>far fewer</i>) выбросов, чем самолёт.' },
      { text: 'All European countries already share identical border railway rules without issues.', ruReason: 'В 3-м абзаце указано, что трансграничные правила и цены всё ещё создают трудности.' },
      { text: 'Sleeper carriages have no electricity outlets or quiet cabins.', ruReason: 'Они оснащены тихими купе и розетками (<i>power sockets</i>).' },
      { text: 'Interest in overnight rail travel has completely vanished in recent years.', ruReason: 'Напротив, наблюдается живое возрождение (<i>lively revival</i>) ночных маршрутов.' }
    ],
    completeItems: [
      {
        prompt: 'Travelling on an overnight train helps passengers avoid … .',
        correct: 'lengthy airport security queues and long transfers into town',
        distractors: [
          'reading books or drinking hot tea in the evening',
          'visiting major European capitals like Paris and Zurich',
          'charging electronic phones at power sockets',
          'carrying bicycles on cross-border journeys',
          'sleeping comfortably inside private cabins'
        ],
        ruExplain: 'Во 2-м абзаце ночные поезда избавляют от длинных очередей досмотра в аэропортах и лишних поездок на такси с отдалённых взлётных полос.'
      }
    ],
    detailItems: [
      {
        question: 'Why are overnight trains becoming popular again?',
        trueItems: [
          { text: 'They leave a much smaller carbon footprint than airplanes.', ru: 'выделяют намного меньше углекислого газа' },
          { text: 'They arrive right in city centres early in the morning.', ru: 'прибывают прямо в центр города утром' },
          { text: 'They offer modern comforts like power outlets and bike spaces.', ru: 'имеют розетки и места для велосипедов' }
        ],
        falseItems: [
          { text: 'They cross the continent faster than supersonic jets.', ru: 'поезда едут всю ночь ради удобства и экологии, а не скорости самолёта' },
          { text: 'Their tickets are always completely free for tourists.', ru: 'в тексте отмечено, что цены на билеты всё ещё вызов' },
          { text: 'They operate without any need for railway timetables.', ru: 'расписания упоминаются в 1-м абзаце' }
        ]
      }
    ],
    mainIdeas: [
      { text: 'the comeback of eco-friendly overnight trains in Europe', ru: 'текст описывает возрождение ночных поездов в Европе, их удобства и экологическую пользу' },
      { text: 'why sleeper trains are attracting modern travellers again', ru: 'основная тема — преимущества и вызовы современных ночных железнодорожных маршрутов' }
    ],
    mainDistractors: [
      'how cheap short-haul airlines operate in Vienna',
      'why cycling across Europe is faster than flying',
      'the history of railway timetables in the nineteenth century',
      'how to pack light luggage for airport security checks',
      'reasons why people dislike sleeping in hotel rooms',
      'how engineers design quiet airplane engines'
    ],
    definitions: [
      { paragraph: 1, def: 'a return to strength, popularity, or active life', answer: 'revival', accept: ['revival'], ruExplain: 'В 1-м абзаце существительное <b>revival</b> означает «возрождение, возвращение популярности».' },
      { paragraph: 3, def: 'equal in value, amount, or function', answer: 'equivalent', accept: ['equivalent'], ruExplain: 'В 3-м абзаце прилагательное <b>equivalent</b> означает «эквивалентный, равноценный».' }
    ],
    synonyms: [
      { paragraph: 2, promptWord: 'attraction', answer: 'appeal', accept: ['appeal'], ruExplain: 'Во 2-м абзаце существительное <b>appeal</b> («привлекательность») близко по смыслу к <i>attraction</i>.' },
      { paragraph: 3, promptWord: 'stylish', answer: 'sleek', accept: ['sleek'], ruExplain: 'В 3-м абзаце прилагательное <b>sleek</b> («элегантный, обтекаемый, стильный») синонимично <i>stylish</i>.' }
    ],
    paraphrases: [
      {
        starter: 'Although ticket prices and cross-border rules still pose challenges, rail companies … .',
        originalTail: 'are ordering sleek new sleeper carriages to make sustainable travel easier',
        models: [
          'are buying (<i>purchasing</i>) modern comfortable night coaches (<i>cars</i>) to simplify (<i>encourage</i>) eco-friendly journeys',
          'are investing in fresh sleeping cars so green trips become simpler'
        ],
        ruExplain: 'Заменяем ≥ 2 слов: <i>ordering → buying / purchasing</i>, <i>sleeper carriages → night coaches / sleeping cars</i>, <i>make ... easier → simplify</i>, <i>sustainable travel → eco-friendly journeys</i>.'
      }
    ],
    opinions: [
      {
        question: 'If you had to travel to another city, would you prefer a night train or a plane? Give reasons.',
        modelAnswer: 'If the distance is suitable, I would gladly choose a night train over an airplane. First, trains produce much less pollution, which helps protect our climate. Moreover, sleeping comfortably overnight and arriving straight in the city centre saves both time and energy compared to waiting at busy airports.',
        ruHint: 'Сделайте выбор и приведите 2 аргумента (экология, комфорт/прибытие в центр) в 3–4 связных предложениях.'
      }
    ]
  }
];
