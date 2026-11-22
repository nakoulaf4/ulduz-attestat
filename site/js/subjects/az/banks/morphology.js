// Curated banks for `az.morphology-noun-adj-num` and `az.morphology-verb`.

export const VOWEL_DROP_NOUNS = [
  // Native Azerbaijani nouns: drop narrow vowel ONLY in possessive (mənsubiyyət), NOT in case (hal)!
  { word: 'burun', dropStem: 'burn', dropType: 'possOnly', ru: 'нос' },
  { word: 'ağız', dropStem: 'ağz', dropType: 'possOnly', ru: 'рот' },
  { word: 'alın', dropStem: 'aln', dropType: 'possOnly', ru: 'лоб' },
  { word: 'boyun', dropStem: 'boyn', dropType: 'possOnly', ru: 'шея' },
  { word: 'qarın', dropStem: 'qarn', dropType: 'possOnly', ru: 'живот' },
  { word: 'çiyin', dropStem: 'çiyn', dropType: 'possOnly', ru: 'плечо' },
  { word: 'beyin', dropStem: 'beyn', dropType: 'possOnly', ru: 'мозг' },
  { word: 'oğul', dropStem: 'oğl', dropType: 'possOnly', ru: 'сын' },
  // Loanwords: drop narrow vowel in BOTH possessive AND case!
  { word: 'isim', dropStem: 'ism', dropType: 'both', ru: 'имя' },
  { word: 'fəsil', dropStem: 'fəsl', dropType: 'both', ru: 'время года / глава' },
  { word: 'şəkil', dropStem: 'şəkl', dropType: 'both', ru: 'картина / форма' },
  { word: 'ömür', dropStem: 'ömr', dropType: 'both', ru: 'жизнь' },
  { word: 'nəsil', dropStem: 'nəsl', dropType: 'both', ru: 'поколение' },
  { word: 'sətir', dropStem: 'sətr', dropType: 'both', ru: 'строка' },
  { word: 'sinif', dropStem: 'sinf', dropType: 'both', ru: 'класс' },
  { word: 'qəbir', dropStem: 'qəbr', dropType: 'both', ru: 'могила' },
  { word: 'səbir', dropStem: 'səbr', dropType: 'both', ru: 'терпение' },
  { word: 'ətir', dropStem: 'ətr', dropType: 'both', ru: 'аромат' },
];

// Accusative (-ı/-i/-u/-ü = təsirlik hal) vs 3rd person possessive (-ı/-i/-u/-ü = mənsubiyyət)
export const CASE_VS_POSS_ITEMS = [
  {
    word: 'kitabı',
    acc: 'Şagird yeni <u>kitabı</u> səhər masadan götürdü.',
    poss: 'Müəllimin <u>kitabı</u> kitabxanada saxlanılır.',
    accNote: '«новый учебник (кого? что?)» — прямой объект при переходном глаголе, винительный падеж (təsirlik hal)',
    possNote: '«книга учителя (чья?)» — притяжательность 3 л. (mənsubiyyət şəkilçisi), выступает подлежащим',
  },
  {
    word: 'qapını',
    acc: 'Qonaq taxta <u>qapını</u> ehmalca açdı.',
    poss: 'Evin <u>qapısı</u> qonaqların üzünə həmişə açıqdır.',
    accNote: '«дверь (что?)» — винительный падеж (təsirlik hal)',
    possNote: '«дверь дома» — 3-е лицо притяжательности (суффикс -sı)',
  },
  {
    word: 'səsi',
    acc: 'Uşaqlar uzaqdan gələn <u>səsi</u> aydın eşitdilər.',
    poss: 'Bülbülün <u>səsi</u> bağçanı bürümüşdü.',
    accNote: '«звук (что?)» — винительный падеж (təsirlik hal)',
    possNote: '«голос соловья» — 3-е лицо притяжательности (mənsubiyyət)',
  },
  {
    word: 'məktubu',
    acc: 'Anam köhnə <u>məktubu</u> diqqətlə oxudu.',
    poss: 'Qardaşımın <u>məktubu</u> bu gün gəldi.',
    accNote: '«письмо (что?)» — винительный падеж (təsirlik hal)',
    possNote: '«письмо брата» — 3-е лицо притяжательности (mənsubiyyət)',
  },
  {
    word: 'evini',
    acc: 'Usta köhnə <u>evini</u> yayda təmir etdi.',
    poss: 'Onun <u>evi</u> şəhərin mərkəzində yerləşir.',
    accNote: '«свой дом (что?)» — притяж. -i + винит. падеж -ni',
    possNote: '«его дом» — притяжательный аффикс -i (именительный падеж)',
  },
  {
    word: 'şəhəri',
    acc: 'Turistlər qədim <u>şəhəri</u> böyük maraqla gəzdilər.',
    poss: 'Azərbaycanın <u>şəhəri</u> Şəki sənətkarlığı ilə məşhurdur.',
    accNote: '«город (что?)» — винительный падеж (təsirlik hal)',
    possNote: '«город Азербайджана» — притяжательный аффикс 3 л.',
  },
];

// Numeral + noun agreement & classification items
export const NUMERAL_AGREEMENT = [
  { ok: 'bir çox kitablar', bad: 'bir çox kitab', rule: 'после неопределённых числительных bir çox, bir sıra существительное обычно стоит во множественном числе (-lar/-lər)' },
  { ok: 'bir sıra məsələlər', bad: 'bir sıra məsələ', rule: 'после bir sıra существительное употребляется с аффиксом множественного числа (-lər)' },
  { ok: 'beş kitab', bad: 'beş kitablar', rule: 'после количественных числительных (beş, on, yüz) существительное в азербайджанском языке остаётся в единственном числе' },
  { ok: 'bir neçə şagird', bad: 'bir neçə şagirdlər', rule: 'после bir neçə, xeyli существительное ставится в единственном числе' },
  { ok: 'onlarla insan', bad: 'onlarla insanlar', rule: 'после числительного onlarla существительное остаётся в единственном числе' },
  { ok: 'üç nəfər tələbə', bad: 'üç ədəd tələbə', rule: 'с людьми употребляется нумератив nəfər, а не ədəd' },
  { ok: 'beş baş mal-qara', bad: 'beş nəfər mal-qara', rule: 'с животными употребляется нумератив baş, а не nəfər' },
  { ok: 'iki cüt ayaqqabı', bad: 'iki dənə ayaqqabı', rule: 'для парных предметов (обувь, носки) используется нумератив cüt' },
];

// Comparative sentence pairs for numerals (style of 1503#31)
export const NUMERAL_PAIR_TASKS = [
  {
    s1: 'I. <u>Onlarla</u> həll olunmamış məsələyə birgə baxış keçirilsə də, yenə də bir neçə işi yekunlaşdırmaq mümkün olmadı.',
    s2: 'II. <u>Onlarca</u> insanın gözü qabağında baş verən bu hadisə bir çox qəzetlərdə dəfələrlə işıqlandırılmışdı.',
    statements: [
      { id: 1, col: 'only1', text: 'Использовано слово, образованное от числительного с омонимичным корнем (birgə ← bir).', ok: true },
      { id: 2, col: 'only1', text: 'Во втором предложении в роли определения выступает неопределённо-количественное числительное (bir çox).', ok: false },
      { id: 3, col: 'only1', text: 'В предложении есть числительное, которое невозможно записать цифрами.', ok: false },
      { id: 4, col: 'both', text: 'В обоих предложениях числительное входит в зависимую часть глагольного словосочетания.', ok: true },
      { id: 5, col: 'both', text: 'Ни в одном предложении между числительным и существительным не использован нумератив.', ok: true },
      { id: 6, col: 'both', text: 'В обоих предложениях количество числительных можно определить однозначно.', ok: false },
    ],
    note: 'Утв. 1 верно для I (birgə ← bir, омоним частицы/числительного); утв. 4 верно для обоих (bir neçə işi yekunlaşdırmaq; onlarca insanın gözü qabağında baş verən); утв. 5 верно для обоих. Утв. 2 относится к II, утв. 3 верно для обоих, утв. 6 неверно (onlarla может быть и местоимением «с ними», и числительным «десятки»).',
  },
  {
    s1: 'I. Məktəbin bağçasında <u>beş</u> nəfər şagird onlarla ağac tingi əkib suvardı.',
    s2: 'II. <u>Bir çox</u> şəhərlərdə keçirilən sərgilərdə yüzlərlə rəssamın əsəri nümayiş etdirildi.',
    statements: [
      { id: 1, col: 'only1', text: 'Между числительным и существительным употреблено нумеративное слово (nəfər).', ok: true },
      { id: 2, col: 'only1', text: 'Одно из слов допускает двоякое понимание как числительное или местоимение с послелогом (onlarla).', ok: true },
      { id: 3, col: 'only1', text: 'В предложении употреблено существительное во множественном числе после bir çox.', ok: false },
      { id: 4, col: 'both', text: 'В обоих предложениях числительные выступают в роли определения.', ok: true },
      { id: 5, col: 'both', text: 'В обоих предложениях есть числительные, которые не пишутся цифрами.', ok: true },
      { id: 6, col: 'both', text: 'В обоих предложениях употреблены порядковые числительные (sıra sayı).', ok: false },
    ],
    note: 'Утв. 1 и 2 верны только для I (nəfər; onlarla); утв. 4 и 5 верны для обоих; утв. 3 относится только ко II (bir çox şəhərlərdə); порядковых числительных нет ни в одном предложении.',
  },
  {
    s1: 'I. Yarışın <u>birinci</u> mərhələsində xeyli idmançı iştirak etdi.',
    s2: 'II. <u>Bir sıra</u> tədqiqatçılar beşdə iki hissəni ayıraraq hesablama apardılar.',
    statements: [
      { id: 1, col: 'only1', text: 'Употреблено порядковое числительное (sıra sayı).', ok: true },
      { id: 2, col: 'only1', text: 'Употреблено дробное числительное (kəsr sayı).', ok: false },
      { id: 3, col: 'only1', text: 'После неопределённого числительного существительное стоит в единственном числе (xeyli idmançı).', ok: true },
      { id: 4, col: 'both', text: 'В обоих предложениях есть неопределённо-количественное числительное (xeyli / bir sıra).', ok: true },
      { id: 5, col: 'both', text: 'В обоих предложениях после числительного существительное стоит во множественном числе.', ok: false },
      { id: 6, col: 'both', text: 'В обоих предложениях использованы нумеративы.', ok: false },
    ],
    note: 'Утв. 1 и 3 верны только для I (birinci; xeyli idmançı); утв. 4 верно для обоих (xeyli, bir sıra); дробное (beşdə iki) только во II; нумеративов нет.',
  },
];

// Adjective degrees
export const ADJ_DEGREES = [
  { word: 'qapqara', deg: 'çoxaltma', rule: 'усиление согласной p (редупликация qap+qara) образует превосходную степень (çoxaltma dərəcəsi)' },
  { word: 'yamyaşıl', deg: 'çoxaltma', rule: 'редупликация yam+yaşıl — превосходная степень (çoxaltma dərəcəsi)' },
  { word: 'bomboz', deg: 'çoxaltma', rule: 'редупликация bom+boz — превосходная степень (çoxaltma dərəcəsi)' },
  { word: 'ən uca', deg: 'çoxaltma', rule: 'частица ən образует аналитическую превосходную степень (çoxaltma)' },
  { word: 'dümqırmızı', deg: 'çoxaltma', rule: 'частица düm- образует превосходную степень (çoxaltma)' },
  { word: 'sarımtıl', deg: 'azaltma', rule: 'суффикс -ımtıl образует уменьшительную степень (azaltma dərəcəsi)' },
  { word: 'uzunsov', deg: 'azaltma', rule: 'суффикс -sov образует уменьшительную степень (azaltma dərəcəsi)' },
  { word: 'açıq-yaşıl', deg: 'azaltma', rule: 'компонент açıq- образует уменьшительную степень (azaltma dərəcəsi)' },
  { word: 'qırmızıtəhər', deg: 'azaltma', rule: 'элемент -təhər образует уменьшительную степень (azaltma dərəcəsi)' },
  { word: 'böyükrək', deg: 'azaltma', rule: 'суффикс -rək образует уменьшительную степень (azaltma dərəcəsi)' },
  { word: 'yaşıl', deg: 'adi', rule: 'исходная форма без морфологических или лексических показателей — положительная степень (adi dərəcə)' },
  { word: 'səliqəli', deg: 'adi', rule: 'суффикс -li является словообразовательным, степень прилагательного — положительная (adi dərəcə)' },
];

// Pronoun o/bu comma rule (o/bu + comma when subject before noun/adj/num/participle/adverb, NO comma before verb or when modifier)
export const OBU_COMMA_ITEMS = [
  { s: '<u>O</u>, məktəbin ən fəal şagirdidir.', comma: true, reason: 'o выступает подлежащим, далее идёт существительное (məktəbin) — запятая ставится' },
  { s: '<u>Bu</u>, çox maraqlı və dəyərli təklifdir.', comma: true, reason: 'bu — подлежащее, далее следует наречие/прилагательное (çox maraqlı) — запятая ставится' },
  { s: '<u>O</u>, gələnləri mehribanlıqla qarşılayan qoca idi.', comma: true, reason: 'o — подлежащее, далее следует причастие (gələnləri) — запятая ставится' },
  { s: '<u>O</u>, beşinci sinifdə əla qiymətlərlə oxuyurdu.', comma: true, reason: 'o — подлежащее, далее следует числительное (beşinci) — запятая ставится' },
  { s: '<u>O</u> gəlib bütün tapşırıqları vaxtında yerinə yetirdi.', comma: false, reason: 'после подлежащего o сразу стоит глагол (gəlib) — запятая НЕ ставится' },
  { s: '<u>O</u> yazdı ki, tezliklə geri dönəcək.', comma: false, reason: 'после подлежащего o стоит глагол (yazdı) — запятая НЕ ставится' },
  { s: '<u>Bu</u> kitab mənə babamdan yadigar qalıb.', comma: false, reason: 'bu отвечает на вопрос «какой?» (təyin — определение к kitab) — запятая НЕ ставится' },
  { s: '<u>O</u> hadisədən sonra hamı daha ehtiyatlı oldu.', comma: false, reason: 'o отвечает на вопрос «какой?» (определение к hadisədən) — запятая НЕ ставится' },
  { s: '<u>Bu</u> isə bütün komandanın ümumi uğuru idi.', comma: false, reason: 'после bu стоит союз/частица isə (вспомогательное слово) — запятая НЕ ставится' },
].filter((x) => !x.reason.includes('Заменим'));

// Verb voices (feilin qrammatik məna növləri)
export const VERB_VOICE_ITEMS = [
  { s: 'Həmişə həvəslə yazdırırlar.', voice: 'icbar', hasSubjObj: false, note: 'icbar növ (-dır), субъект (кто заставляет) и объект (что именно пишут) в предложении отсутствуют' },
  { s: 'Səhərə kimi kəndə daşıtmalıdırlar.', voice: 'icbar', hasSubjObj: false, note: 'icbar növ (-t), в предложении нет ни субъекта (подлежащего), ни прямого объекта' },
  { s: 'Yeni layihələri mütəxəssislərə hazırladın.', voice: 'icbar', hasSubjObj: true, note: 'icbar növ (-d), но прямой объект (layihələri) и адресат присутствуют' },
  { s: 'Məktublar səhər tezdən poçta göndərildi.', voice: 'məchul', hasSubjObj: false, note: 'məchul növ (-il): действие совершается неизвестным исполнителем над объектом (məktublar)' },
  { s: 'Bütün ərizələrə iki gün ərzində baxıldı.', voice: 'şəxssiz', hasSubjObj: false, note: 'şəxssiz növ (-ıl): глагол непереходный (baxmaq), подлежащего нет и не может быть' },
  { s: 'İdmana qarşı xüsusi diqqət göstərildiyinə dəlalət edir.', voice: 'şəxssiz', hasSubjObj: false, note: 'göstərilmək в составе «diqqət göstərildiyinə» — безличный залог (şəxssiz növ)' },
  { s: 'Qız güzgünün qarşısında bəzəndi.', voice: 'qayıdış', hasSubjObj: true, note: 'qayıdış növ (-n): субъект (qız) сам совершает действие над собой' },
  { s: 'İki dost uzun ayrılıqdan sonra qucaqlaşdı.', voice: 'qarşılıq', hasSubjObj: true, note: 'qarşılıq-birgəlik növ (-laş): взаимное действие двух субъектов' },
  { s: 'Quşlar yaz gələndə bağçada ötüşürdülər.', voice: 'qarşılıq', hasSubjObj: true, note: 'qarşılıq-birgəlik növ (-üş): совместное действие' },
  { s: 'Uşaq gəzintidən qayıdandan sonra yaxşıca yuyundu.', voice: 'qayıdış', hasSubjObj: true, note: 'qayıdış növ (-n от переходного глагола yumaq, непереходная форма): субъект сам совершает действие над собой' },
  { s: 'Məruzəçi mövzunu aydın şəkildə izah etdi.', voice: 'məlum', hasSubjObj: true, note: 'məlum növ: активный залог с явным субъектом (məruzəçi)' },
].filter((x) => !x.note.includes('удалим'));

// Verb moods (feilin şəkilləri)
export const VERB_MOODS = [
  { form: 'öyrədəydin', mood: 'arzu', note: 'корень öyrəd + суффикс желательного наклонения -ə + связка -(y)dı + личное -n = arzu şəkli' },
  { form: 'gələsən', mood: 'arzu', note: 'суффикс -ə + личное окончание -sən = arzu şəkli' },
  { form: 'yazmalıyam', mood: 'vacib', note: 'суффикс -malı + -yam = долженствовательное наклонение (vacib şəkli)' },
  { form: 'oxumalıdır', mood: 'vacib', note: 'суффикс -malı + -dır = vacib şəkli' },
  { form: 'gedəsidir', mood: 'lazım', note: 'суффикс -əsi + -dir = наклонение необходимости (lazım şəkli)' },
  { form: 'görəsiyik', mood: 'lazım', note: 'суффикс -əsi + -yik = lazım şəkli' },
  { form: 'çalışsan', mood: 'şərt', note: 'суффикс -sa + -n = условное наклонение (şərt şəkli)' },
  { form: 'bilsələr', mood: 'şərt', note: 'суффикс -sə + -lər = şərt şəkli' },
  { form: 'söyləsin', mood: 'əmr', note: 'без показателя времени/другого наклонения, личное окончание -sin = повелительное наклонение (əmr şəkli)' },
  { form: 'dinləyin', mood: 'əmr', note: '2-е лицо мн.ч. повелительного наклонения (əmr şəkli)' },
  { form: 'dolaşdım', mood: 'xəbər', note: 'показатель прошедшего времени -dı = изъявительное наклонение (xəbər şəkli)' },
  { form: 'gələcəklər', mood: 'xəbər', note: 'показатель будущего времени -əcək = xəbər şəkli' },
];

export const MOOD_LABELS_RU = {
  xəbər: 'изъявительное (xəbər şəkli)',
  əmr: 'повелительное (əmr şəkli)',
  arzu: 'желательное (arzu şəkli)',
  vacib: 'долженствовательное (vacib şəkli)',
  lazım: 'необходимости (lazım şəkli)',
  şərt: 'условное (şərt şəkli)',
};

// Sentences for 0903#34 style: adverb of manner (tərzi-hərəkət zərfi) modifying non-finite verb vs traps
export const ADVERB_NONFINITE_POOL = [
  { s: 'Şuşada <u>çiyin-çiyinə</u> döyüşdüyü dostlarını heç vaxt unutmurdu.', ok: true, note: 'çiyin-çiyinə (наречие образа действия) относится к причастию döyüşdüyü (feili sifət)' },
  { s: 'Öz uğurlarından <u>iftixarla</u> danışan sədr indi susmuşdu.', ok: true, note: 'iftixarla (наречие образа действия) относится к причастию danışan (feili sifət)' },
  { s: '<u>Dilucu</u> təşəkkür edib çölə çıxdı.', ok: true, note: 'dilucu (наречие образа действия) относится к деепричастию təşəkkür edib (feili bağlama)' },
  { s: 'Qonaqları <u>səmimiyyətlə</u> qarşılayaraq içəri dəvət etdi.', ok: true, note: 'səmimiyyətlə (наречие образа действия) относится к деепричастию qarşılayaraq (feili bağlama)' },
  { s: 'Məsələni <u>dərindən</u> araşdırmaq üçün arxivə müraciət etdik.', ok: true, note: 'dərindən (наречие образа действия) относится к инфинитиву araşdırmaq (məsdər)' },
  { s: 'Tapşırığı <u>səliqəylə</u> yerinə yetirən şagird tərifləndi.', ok: true, note: 'səliqəylə (наречие образа действия) относится к причастию yerinə yetirən (feili sifət)' },
  { s: '<u>Cəsarətlə</u> irəli atılaraq rəqibini məğlub etdi.', ok: true, note: 'cəsarətlə (наречие образа действия) относится к деепричастию atılaraq (feili bağlama)' },
  { s: '<u>Tamamilə</u> xəbərsiz idi ki, qonaqlar nə vaxt gəliblər.', ok: false, note: 'наречие tamamilə относится к прилагательному xəbərsiz, а не к глаголу' },
  { s: '<u>Belə</u> danışmağın heç bir əsası yoxdur.', ok: false, note: 'слово belə здесь указательное местоимение/прилагательное, а не наречие' },
  { s: 'Onlar ev yiyəsi ilə <u>gülə-gülə</u> salamlaşdılar.', ok: false, note: 'gülə-gülə — деепричастие (feili bağlama), а не наречие' },
  { s: 'Uşaqlar səhər tezdən dərsə <u>tələsə-tələsə</u> getdilər.', ok: false, note: 'tələsə-tələsə — деепричастие (feili bağlama), а не наречие' },
  { s: 'Məktubda yazılanları <u>dünən</u> oxudum.', ok: false, note: 'dünən — наречие времени (zaman zərfi) при спрягаемом глаголе oxudum' },
  { s: 'Müəllim şagirdlərin cavabını <u>diqqətlə</u> dinlədi.', ok: false, note: 'diqqətlə относится к спрягаемому глаголу dinlədi (təsriflənən feil), а не к неспрягаемой форме' },
  { s: 'Qışda dağların zirvəsi <u>olduqca</u> soyuq görünürdü.', ok: false, note: 'olduqca — наречие меры (kəmiyyət zərfi), относящееся к прилагательному soyuq' },
];

// Auxiliary parts of speech (köməkçi nitq hissələri) homonymy
export const AUX_POS_ITEMS = [
  {
    s: 'Qardaşım <u>ilə</u> mən səhər tezdən yola çıxdıq.',
    pos: 'bağlayıcı (союз)',
    note: 'ilə можно заменить на союз və («брат и я») → bağlayıcı',
  },
  {
    s: 'Usta taxtanı kəskin bıçaq <u>ilə</u> yonurdu.',
    pos: 'qoşma (послелог)',
    note: 'ilə указывает на орудие действия и не заменяется на və → qoşma',
  },
  {
    s: 'Biz çox çalışdıq, <u>ancaq</u> vaxtımız çatmadı.',
    pos: 'bağlayıcı (союз)',
    note: 'ancaq противопоставляет две части (можно заменить на amma, lakin) → bağlayıcı',
  },
  {
    s: 'Bu sirri <u>ancaq</u> sənə etibar edə bilərəm.',
    pos: 'ədat (частица)',
    note: 'ancaq ограничивает значение (можно заменить на yalnız, təkcə) → ədat',
  },
  {
    s: '<u>Doğrusu</u>, bu xəbəri eşidəndə çox sevindim.',
    pos: 'modal söz (модальное слово)',
    note: 'выражает отношение говорящего, обособляется запятой и не является членом предложения → modal söz',
  },
  {
    s: 'Sözün <u>doğrusu</u> budur ki, planı yeniləməliyik.',
    pos: 'isim (существительное)',
    note: 'приняло падежно-притяжательный аффикс -u и является подлежащим → isim',
  },
  {
    s: 'Sənin <u>kimi</u> sədaqətli dost tapmaq çətindir.',
    pos: 'qoşma (послелог)',
    note: 'kimi образует сравнительную конструкцию с местоимением → qoşma',
  },
  {
    s: 'Elə bilirdim <u>ki</u>, iclas sabah keçiriləcək.',
    pos: 'bağlayıcı (союз)',
    note: 'ki связывает главное и придаточное предложения → tabelilik bağlayıcısı',
  },
];
