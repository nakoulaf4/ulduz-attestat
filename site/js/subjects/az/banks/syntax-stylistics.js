// Curated banks for `az.syntax-phrases`, `az.syntax-sentence`, and `az.stylistics`.

// 1. Feili sifət tərkibi (participial phrase) vs single participle (0903#32 style)
export const PARTICIPLE_PHRASE_SETS = [
  {
    correct: 'Ahəstə süzən qartal anidən şikarına tərəf şığıdı.',
    phrase: 'ahəstə süzən',
    distractors: [
      'Ev sahibləri gələn qonaqları mehribanlıqla qarşıladılar.',
      'Asif yazılmış məktubu qatlayıb zərfə qoydu.',
      'Dostum, oxuyan məqsədinə çatar.',
      'Yaşıllaşan ağaclar göz oxşayırdı.',
    ],
    note: '«ahəstə süzən» — причастный оборот (feili sifət tərkibi: наречие ahəstə + причастие süzən). В остальных вариантах причастия одиночные (gələn, yazılmış, oxuyan, yaşıllaşan) и оборота не образуют.',
  },
  {
    correct: 'Səhər tezdən açılan güllər bağçaya xüsusi gözəllik verirdi.',
    phrase: 'səhər tezdən açılan',
    distractors: [
      'Ağaran üfüqlər yeni günün başladığını xəbər verirdi.',
      'Çağırılmış qonaqlar məclisdə iştirak edirdilər.',
      'Çalışan insan həmişə uğur qazanar.',
      'Saralmış yarpaqlar yerə tökülmüşdü.',
    ],
    note: '«səhər tezdən açılan» — причастный оборот с зависимыми словами, в остальных предложениях причастия одиночные (ağaran, çağırılmış, çalışan, saralmış).',
  },
  {
    correct: 'Bütün gecəni yağan yağış səhərə yaxın dayandı.',
    phrase: 'bütün gecəni yağan',
    distractors: [
      'Sınmış budaqları bağban həyətdən yığışdırdı.',
      'Yatmış uşaq səs-küydən oyandı.',
      'Gələcək günlər bizə yeni imkanlar gətirəcək.',
      'Dinləyən şagirdlər müəllimin sözlərini qeyd edirdilər.',
    ],
    note: '«bütün gecəni yağan» — причастный оборот (зависимые слова + yağan). В остальных предложениях — одиночные причастия.',
  },
  {
    correct: 'Dağların zirvəsindən görünən mənzərə hamını heyran etdi.',
    phrase: 'dağların zirvəsindən görünən',
    distractors: [
      'Sevilən əsərlər illər keçsə də unudulmur.',
      'Qaçan idmançılar finiş xəttinə yaxınlaşdılar.',
      'Yorulmuş yolçular bulağın başında dincəldilər.',
      'Düşünən beyinlər yeni ideyalar yaradır.',
    ],
    note: '«dağların zirvəsindən görünən» — причастный оборот; в дистракторах причастия не имеют зависимых слов.',
  },
  {
    correct: 'İmtahana ciddi hazırlaşan tələbələr yüksək nəticə göstərdilər.',
    phrase: 'imtahana ciddi hazırlaşan',
    distractors: [
      'Deyilmiş sözlər geri qaytarılmaz.',
      'Yanan ocaq ətrafında söhbət uzun çəkdi.',
      'Böyüyən ağaclar həyətə kölgə salırdı.',
      'Seçilmiş şeirlər kitabda dərc olundu.',
    ],
    note: '«imtahana ciddi hazırlaşan» — причастный оборот с зависимыми словами imtahana и ciddi.',
  },
];

// 2. Predicate expressed by məsdər tərkibi (1503#33 style)
export const INFINITIVE_PRED_SETS = [
  {
    correct: 'Aləmşahbəyimin yeganə çıxış yolu uşaqlarını buradan uzaqlaşdırmaq idi.',
    phrase: 'uşaqlarını buradan uzaqlaşdırmaq idi',
    distractors: [
      'Gəlişimizin məqsədi başına ağıl qoymaqdır.', // фразеологизм
      'Məbədə gəlməkdə niyyətləri dua etmək idi.', // составной глагол
      'Yayın qızmar günlərində şəhərdə qalmaq heç kəsin ürəyincə deyildi.', // оборот — подлежащее!
      'İndi Mədinənin bacısının həyatdakı ən böyük arzusu oxumaq idi.', // одиночный məsdər
    ],
    note: '«uşaqlarını buradan uzaqlaşdırmaq idi» — сказуемое, выраженное инфинитивным оборотом (məsdər tərkibi). В остальных: фразеологизм (başına ağıl qoymaqdır), составной глагол (dua etmək), оборот в роли подлежащего (şəhərdə qalmaq) и одиночный инфинитив (oxumaq).',
  },
  {
    correct: 'Sərkərdənin əsas məqsədi qalanı düşməndən qorumaq idi.',
    phrase: 'qalanı düşməndən qorumaq idi',
    distractors: [
      'Rəqiblə dil tapmaq əvvəlcədən mümkün deyildi.', // оборот-подлежащее
      'Məclisə toplaşmaqda məramları qonaqlara hörmət etmək idi.', // составной глагол
      'Kənd cavanlarının istəyi vəziyyətdən baş çıxarmaqdır.', // фразеологизм
      'Onun uşaqlıqdan bəri tək arzusu yazmaq idi.', // одиночный məsdər
    ],
    note: '«qalanı düşməndən qorumaq idi» — инфинитивный оборот в функции сказуемого.',
  },
  {
    correct: 'Bu layihənin başlıca vəzifəsi gəncləri elmə yönəltməkdir.',
    phrase: 'gəncləri elmə yönəltməkdir',
    distractors: [
      'Gecə yarısı yola çıxmaq təcrübəli bələdçilər üçün belə çətin idi.', // оборот-подлежащее
      'Səfərimizin məqsədi dostlara kömək etmək idi.', // составной глагол
      'Qocanın məsləhəti cavanları səbirli olmağa sövq etmək deyil, qulaq asmaq idi.', // фразеологизм
      'Şagirdin gündəlik vərdişi çalışmaqdır.', // одиночный məsdər
    ],
    note: '«gəncləri elmə yönəltməkdir» — инфинитивный оборот (məsdər tərkibi) в позиции сказуемого.',
  },
  {
    correct: 'Müəllimin istəyi şagirdlərə mətnin əsas fikrini anlatmaq idi.',
    phrase: 'şagirdlərə mətnin əsas fikrini anlatmaq idi',
    distractors: [
      'Açıq havada gəzmək səhhət üçün olduqca faydalıdır.', // оборот-подлежащее
      'Onların niyyəti məktəbə rəhbərlik etmək idi.', // составной глагол
      'Qonşunun niyyəti sözü üzə vurmaq idi.',
      'Qonağın yeganə istəyi dincəlmək idi.', // одиночный məsdər
    ],
    note: '«şagirdlərə mətnin əsas fikrini anlatmaq idi» — инфинитивный оборот в роли сказуемого.',
  },
];

// 3. Xitab vs Mübtəda ambiguity (1503#40 style)
export const XITAB_AMBIGUOUS_SETS = [
  {
    correct: '<u>Aqil</u>, Səfər və Kərim səni axtarırdılar.',
    distractors: [
      'Dostum, <u>Qabil</u>, səhərdən evdən çıxıb, amma geri qayıtmayıb.',
      '<u>Qədir</u>! Xahiş edirəm ki, mənim fikirlərimə hörmətlə yanaşasan.',
      'Bilirmi ki, <u>kamil</u>, ağıllı oğlandır?',
      'Əvvəlcədən deyim ki, <u>Sabir</u> hələ də tapşırıqları yerinə yetirməmişdir.',
    ],
    note: 'В «Aqil, Səfər və Kərim səni axtarırdılar» слово Aqil можно прочитать и как однородное подлежащее («Агиль, Сафар и Керим искали тебя»), и как обращение («Агиль, Сафар и Керим искали тебя»). В остальных вариантах выделенные слова — однозначное обращение, определение или подлежащее.',
  },
  {
    correct: '<u>Leyla</u>, Nərgiz və Aynur sabah sərgiyə gedəcəklər.',
    distractors: [
      '<u>Kamran</u>! Dərslərini vaxtında hazırlamağı unutma.',
      'Əziz dostum, <u>Orxan</u>, bu xəbəri eşidəndə çox sevindi.',
      'Görəsən, <u>igid</u>, cəsur əsgərlərimiz nə vaxt qayıdacaqlar?',
      'Hamı bilir ki, <u>Elçin</u> müsabiqənin qalibi olmuşdur.',
    ],
    note: '«Leyla» в начале перечисления может быть и одним из однородных подлежащих, и обращением к Лейле.',
  },
  {
    correct: '<u>Tural</u>, Rəşad və Murad yarışa birlikdə hazırlaşırlar.',
    distractors: [
      '<u>Səlim</u>! Qapını bağlamağı yaddan çıxarma.',
      'Qardaşım, <u>Fuad</u>, dünən Bakıdan Gəncəyə yola düşüb.',
      'Məlumdur ki, <u>çalışqan</u>, bacarıqlı şagirdlər həmişə seçilirlər.',
      'İnanıram ki, <u>Nigar</u> bu tapşırığı uğurla yerinə yetirəcək.',
    ],
    note: '«Tural» допускает двоякую интонационную трактовку: однородное подлежащее или обращение.',
  },
  {
    correct: '<u>Fərid</u>, Samir və Anar layihəni vaxtında təhvil verdilər.',
    distractors: [
      '<u>Aysel</u>! Məktubları masanın üstünə qoy.',
      'Həmkarım, <u>Rauf</u>, konfransda maraqlı məruzə etdi.',
      'Söyləyin, <u>səbirli</u>, təmkinli insanlar necə davranırlar?',
      'Müəllim dedi ki, <u>Vüsal</u> olimpiadada birinci yeri tutub.',
    ],
    note: '«Fərid» можно трактовать и как одно из трёх однородных подлежащих, и как обращение перед «Samir və Anar».',
  },
];

// 4. Syntactic relations & homogeneous members (1503#38 and 0903#37 style)
export const SYNTACTIC_ANALYSIS_SETS = [
  {
    sentence: 'Dünənki yarışın qalibi <b>Səlim</b> nə isə söyləyərək otaqdan çıxdı.',
    statements: [
      { text: 'Выделенное слово (Səlim) в синтаксической связи выступает только главным словом (əsas tərəf).', ok: true },
      { text: 'Слово в исходном падеже (otaqdan) является зависимым словом (asılı tərəf) в подчинительной связи.', ok: true },
      { text: 'Если убрать выделенное слово, именное словосочетание (yarışın qalibi) станет главным словом связи согласования.', ok: true },
      { text: 'В предложении отсутствует глагольный оборот (feili birləşmə).', ok: false },
      { text: 'Сказуемое связано с дополнением (tamamlıq) и обстоятельством (zərflik).', ok: false },
    ],
    note: 'Səlim — подлежащее (только əsas tərəf в uzlaşma); otaqdan — обстоятельство места (asılı tərəf); без Səlim подлежащим станет yarışın qalibi. Глагольный оборот «nə isə söyləyərək» есть; дополнения в предложении нет.',
  },
  {
    sentence: 'Şəhərin tanınmış memarı <b>Cəfər</b> layihəni diqqətlə yoxlayaraq masaya qoydu.',
    statements: [
      { text: 'Выделенное слово (Cəfər) в связи согласования является только главным словом (əsas tərəf).', ok: true },
      { text: 'Слово в винительном падеже (layihəni) связано со словом в составе деепричастного оборота связью управления (idarə).', ok: true },
      { text: 'Если убрать выделенное слово, именное словосочетание (şəhərin tanınmış memarı) станет подлежащим.', ok: true },
      { text: 'В предложении имеется обращение (xitab).', ok: false },
      { text: 'Наречие diqqətlə связано со спрягаемым глаголом qoydu.', ok: false },
    ],
    note: 'Cəfər — подлежащее (əsas tərəf); layihəni управляется примыкающим к обороту деепричастием yoxlayaraq; diqqətlə относится к yoxlayaraq, а не к qoydu.',
  },
  {
    sentence: 'Məşhur bəstəkar <b>Üzeyir</b> yeni əsərini böyük həvəslə dinləyicilərə təqdim etdi.',
    statements: [
      { text: 'Выделенное слово (Üzeyir) является подлежащим и выступает главным словом в связи согласования.', ok: true },
      { text: 'Слова в винительном (əsərini) и дательном (dinləyicilərə) падежах являются зависимыми (asılı tərəf) в связи управления.', ok: true },
      { text: 'Сказуемое выражено составным глаголом (təqdim etdi).', ok: true },
      { text: 'В предложении употреблено деепричастие (feili bağlama).', ok: false },
      { text: 'Все определения в предложении выражены наречиями.', ok: false },
    ],
    note: 'Üzeyir — подлежащее; əsərini и dinləyicilərə управляются сказуемым təqdim etdi (составной глагол). Деепричастия в предложении нет.',
  },
];

// 5. Syntactic parsing schemas (0903#31 style)
// Notation:
// M = ─── (mübtəda)
// X = ═══ (xəbər)
// T = - - - (tamamlıq)
// D = 〰〰 (təyin)
// Z = <u>〰〰</u> (zərflik)
export const SCHEMA_LEGEND = 'Обозначения: ─── подлежащее (mübtəda), ═══ сказуемое (xəbər), - - - дополнение (tamamlıq), 〰〰 определение (təyin), <u>〰〰</u> обстоятельство (zərflik).';

const SYM = {
  M: '───',
  X: '═══',
  T: '- - -',
  D: '〰〰',
  Z: '<u>〰〰</u>',
};

export function renderSchema(tokens) {
  return tokens.map((k) => SYM[k]).join(' &nbsp; ');
}

export const SYNTAX_SCHEMA_ITEMS = [
  {
    sentence: 'Nəhayət, hərbi xidməti başa vurduqdan sonra gimnaziyadan şəhadətnaməmi aldım.',
    schema: ['Z', 'Z', 'T', 'X'],
    wrongSchemas: [
      ['T', 'Z', 'T', 'X'],
      ['D', 'Z', 'Z', 'X'],
      ['D', 'M', 'T', 'X'],
      ['T', 'Z', 'Z', 'T', 'X'],
    ],
    note: 'Nəhayət — модальное слово (в схему не входит). «hərbi xidməti başa vurduqdan sonra» — обстоятельство времени; «gimnaziyadan» — обстоятельство места; «şəhadətnaməmi» — дополнение; «aldım» — сказуемое.',
  },
  {
    sentence: 'Görünür, təcrübəli müəllim dərsdən sonra şagirdlərə maraqlı tapşırıq verdi.',
    schema: ['D', 'M', 'Z', 'T', 'D', 'T', 'X'],
    wrongSchemas: [
      ['Z', 'D', 'M', 'Z', 'T', 'D', 'T', 'X'],
      ['D', 'M', 'T', 'D', 'T', 'X'],
      ['M', 'Z', 'T', 'D', 'T', 'X'],
      ['D', 'M', 'Z', 'Z', 'T', 'X'],
    ],
    note: 'Görünür — модальное слово (не член предложения). təcrübəli (опред.) müəllim (подл.) dərsdən sonra (обст.) şagirdlərə (доп.) maraqlı (опред.) tapşırıq (доп.) verdi (сказ.).',
  },
  {
    sentence: 'Əlbəttə, gənc rəssam sərgidə öz əsərlərini fəxrlə nümayiş etdirdi.',
    schema: ['D', 'M', 'Z', 'T', 'Z', 'X'],
    wrongSchemas: [
      ['Z', 'D', 'M', 'Z', 'T', 'Z', 'X'],
      ['D', 'M', 'T', 'T', 'Z', 'X'],
      ['D', 'M', 'Z', 'D', 'T', 'X'],
      ['M', 'Z', 'T', 'Z', 'X'],
    ],
    note: 'Əlbəttə — модальное слово (в схему не входит). gənc (опред.) rəssam (подл.) sərgidə (обст. места) öz əsərlərini (доп., неразрывное словосочетание) fəxrlə (обст. обр. действия) nümayiş etdirdi (сказ.).',
  },
  {
    sentence: 'Səhər tezdən kəndin kənarındakı bulaqdan sərin su gətirdik.',
    schema: ['Z', 'D', 'Z', 'D', 'T', 'X'],
    wrongSchemas: [
      ['Z', 'Z', 'D', 'T', 'X'],
      ['D', 'M', 'Z', 'D', 'T', 'X'],
      ['Z', 'T', 'D', 'T', 'X'],
      ['Z', 'D', 'T', 'D', 'T', 'X'],
    ],
    note: 'səhər tezdən (обст.) kəndin kənarındakı (опред.) bulaqdan (обст. места) sərin (опред.) su (доп.) gətirdik (сказ.).',
  },
  {
    sentence: 'Şübhəsiz, dünənki görüşdə dostlar gələcək planları ətraflı müzakirə etdilər.',
    schema: ['D', 'Z', 'M', 'D', 'T', 'Z', 'X'],
    wrongSchemas: [
      ['Z', 'D', 'Z', 'M', 'D', 'T', 'Z', 'X'],
      ['D', 'T', 'M', 'D', 'T', 'Z', 'X'],
      ['D', 'Z', 'M', 'T', 'Z', 'X'],
      ['M', 'Z', 'D', 'T', 'Z', 'X'],
    ],
    note: 'Şübhəsiz — модальное слово (не член предложения). dünənki (опред.) görüşdə (обст.) dostlar (подл.) gələcək (опред.) planları (доп.) ətraflı (обст.) müzakirə etdilər (сказ.).',
  },
  {
    sentence: 'Axşamçağı qonaqlar böyük salonda sərgiyə maraqla baxdılar.',
    schema: ['Z', 'M', 'D', 'Z', 'T', 'Z', 'X'],
    wrongSchemas: [
      ['Z', 'M', 'D', 'T', 'T', 'Z', 'X'],
      ['M', 'D', 'Z', 'T', 'Z', 'X'],
      ['Z', 'M', 'Z', 'T', 'Z', 'X'],
      ['Z', 'D', 'M', 'Z', 'T', 'X'],
    ],
    note: 'axşamçağı (обст.) qonaqlar (подл.) böyük (опред.) salonda (обст.) sərgiyə (доп.) maraqla (обст.) baxdılar (сказ.).',
  },
];

// 6. Complex sentence builder (1503#34 style): 2 continuations create mürəkkəb cümlə, 3 keep it sadə
export const COMPLEX_SENTENCE_BUILDERS = [
  {
    prefix: 'Gedib xaricdə təhsilini artırar, ...',
    complexOpts: [
      'atası arzusuna çatar.',
      'biliyi xalqına gərəkli olar.',
      'müəllimləri onunla fəxr edər.',
    ],
    simpleOpts: [
      'qayıdıb vətənində işləyər.',
      'elə orada bir iş tapıb işləyər.',
      'savadı ilə hamını təəccübləndirər.',
      'yeni layihələr üzərində çalışar.',
    ],
    note: 'Сложное предложение (mürəkkəb cümlə) образуется только тогда, когда во второй части появляется новая грамматическая основа с собственным подлежащим (atası... çatar; biliyi... olar). Если субъект остаётся тем же (однородные сказуемые), предложение остаётся простым (sadə cümlə).',
  },
  {
    prefix: 'Səhər tezdən bağçaya çıxıb gülləri suvarar, ...',
    complexOpts: [
      'hər tərəfi xoş ətir bürüyər.',
      'quşların səsi həyəti doldurar.',
      'qonşular bu səliqəyə heyran olar.',
    ],
    simpleOpts: [
      'sonra sərin eyvanda çay içər.',
      'quru yarpaqları da toplayıb kənara yığar.',
      'ağacların dibini yumşaldar.',
      'günortaya qədər bağda çalışar.',
    ],
    note: 'При добавлении частей с новым подлежащим (xoş ətir bürüyər; quşların səsi doldurar) возникает сложное предложение; продолжения с теми же действиями одного субъекта дают простое предложение с однородными сказуемыми.',
  },
  {
    prefix: 'Müəllim mövzunu aydın şəkildə izah edər, ...',
    complexOpts: [
      'şagirdlər məsələni dərhal anlayarlar.',
      'dərs çox maraqlı keçər.',
      'sinifdə bütün suallar cavabını tapar.',
    ],
    simpleOpts: [
      'lövhədə bir neçə nümunə də yazar.',
      'vacib qaydaları yenidən təkrarlayar.',
      'ev tapşırıqlarını yoxlayar.',
      'qeydləri dəftərə köçürməyi tapşırar.',
    ],
    note: 'Появление нового подлежащего (şagirdlər, dərs, suallar) создаёт вторую грамматическую основу — сложное предложение.',
  },
  {
    prefix: 'Bahar gələr-gəlməz qarlar əriyər, ...',
    complexOpts: [
      'çaylar daşıb vadiləri suvarar.',
      'çəmənliklər yaşıl don geyinər.',
      'kəndlilər tarla işlərinə başlayarlar.',
    ],
    simpleOpts: [
      'bütün dərələrdən səs-küylə axar.',
      'torpağa rütubət verər.',
      'soyuq qış günlərini geridə qoyar.',
      'yavaş-yavaş buza dönən yolları açar.',
    ],
    note: 'Когда к «qarlar əriyər» добавляются действия другого субъекта (çaylar daşar, çəmənliklər geyinər), образуется сложное предложение.',
  },
];

// 7. Direct speech punctuation & schemas (0903#35 style)
export const DIRECT_SPEECH_PAIRS = [
  { raw: 'Qarı bir az düşünüb Yaxşı qərar sənindir dedi', schema: 'M: “V”, – m.', ok: true, fixed: 'Qarı bir az düşünüb: “Yaxşı, qərar sənindir”, – dedi.' },
  { raw: 'Biz demək olar ki çatmışıq deyə Səlim gülümsədi', schema: '“V”, – m.', ok: true, fixed: '“Biz, demək olar ki, çatmışıq”, – deyə Səlim gülümsədi.' },
  { raw: 'Mən buradayam komandir cəld dilləndim bura gələ bilərsinizmi', schema: '“V, – m, – v?”', ok: true, fixed: '“Mən buradayam, komandir, – cəld dilləndim, – bura gələ bilərsinizmi?”' },
  { raw: 'Kapitan səmimiyyətlə dedi Sizi təbrik edirəm leytenant', schema: 'M: “V”.', ok: true, fixed: 'Kapitan səmimiyyətlə dedi: “Sizi təbrik edirəm, leytenant”.' },
  { raw: 'Usta gülümsəyərək soruşdu Bu naxışı kim çəkib', schema: 'M: “V?”', ok: true, fixed: 'Usta gülümsəyərək soruşdu: “Bu naxışı kim çəkib?”' },
  { raw: 'Sabah səhər yola çıxırıq deyə bələdçi xəbərdarlıq etdi', schema: '“V”, – m.', ok: true, fixed: '“Sabah səhər yola çıxırıq”, – deyə bələdçi xəbərdarlıq etdi.' },
  { raw: 'Bəli dedi bir dəfə yerli bələdçilərlə qoruğa getmişdik', schema: 'M: “V”.', ok: false, rightSchema: '“V, – m, – v”.', fixed: '“Bəli, – dedi, – bir dəfə yerli bələdçilərlə qoruğa getmişdik”.' },
  { raw: 'Qoca başını qaldırıb Soruşdu Sən kimin oğlusan', schema: '“V”, – m.', ok: false, rightSchema: 'M: “V?”', fixed: 'Qoca başını qaldırıb soruşdu: “Sən kimin oğlusan?”' },
  { raw: 'Əlbəttə cavab verdi sərkərdə qala müdafiəyə hazırdır', schema: 'M: “V”.', ok: false, rightSchema: '“V, – m, – v”.', fixed: '“Əlbəttə, – cavab verdi sərkərdə, – qala müdafiəyə hazırdır”.' },
  { raw: 'Vaxtımız azdır dedi rəis tələsməliyik', schema: '“V”, – m.', ok: false, rightSchema: '“V, – m, – v”.', fixed: '“Vaxtımız azdır, – dedi rəis, – tələsməliyik”.' },
];

// 8. Punctuation sequences (1503#35 style)
export const PUNCTUATION_SEQ_ITEMS = [
  {
    raw: 'Ordu qaçqınlar əsirlər bir sözlə hər kəs bir-birinə dəyib.',
    seq: 'vergül, vergül, tire, vergül',
    fixed: 'Ordu, qaçqınlar, əsirlər – bir sözlə, hər kəs bir-birinə dəyib.',
    distractors: [
      'vergül, vergül, vergül, tire',
      'qoşa nöqtə, vergül, vergül, vergül',
      'vergül, vergül, vergül, vergül',
      'tire, vergül, tire, vergül',
    ],
    note: 'После однородных членов перед обобщающим словом (hər kəs) ставится тире, а вводное сочетание «bir sözlə» обособляется запятой.',
  },
  {
    raw: 'Dağlar meşələr çəmənlər bir sözlə bütün təbiət baharı qarşılayırdı.',
    seq: 'vergül, vergül, tire, vergül',
    fixed: 'Dağlar, meşələr, çəmənlər – bir sözlə, bütün təbiət baharı qarşılayırdı.',
    distractors: [
      'vergül, tire, vergül, vergül',
      'qoşa nöqtə, vergül, tire, vergül',
      'vergül, vergül, qoşa nöqtə, vergül',
      'vergül, vergül, vergül, vergül',
    ],
    note: 'Однородные подлежащие разделяются запятыми, перед обобщающим словом «bütün təbiət» ставится тире, после вводного «bir sözlə» — запятая.',
  },
  {
    raw: 'Masada hər şey var idi kitablar dəftərlər qələmlər.',
    seq: 'qoşa nöqtə, vergül, vergül',
    fixed: 'Masada hər şey var idi: kitablar, dəftərlər, qələmlər.',
    distractors: [
      'tire, vergül, vergül',
      'vergül, qoşa nöqtə, vergül',
      'vergül, vergül, vergül',
      'tire, qoşa nöqtə, vergül',
    ],
    note: 'Когда обобщающее слово (hər şey) стоит перед однородными членами, после него ставится двоеточие (qoşa nöqtə).',
  },
  {
    raw: 'Əlbəttə siz haqlısınız lakin biz də öz fikrimizi deməliyik.',
    seq: 'vergül, vergül',
    fixed: 'Əlbəttə, siz haqlısınız, lakin biz də öz fikrimizi deməliyik.',
    distractors: [
      'tire, vergül',
      'qoşa nöqtə, vergül',
      'vergül, tire',
      'vergül, qoşa nöqtə',
    ],
    note: 'Модальное слово «Əlbəttə» выделяется запятой, а перед противительным союзом «lakin» ставится запятая.',
  },
  {
    raw: 'Müəllim dedi ki Sabah sınaq imtahanı keçiriləcək.',
    seq: 'vergül',
    fixed: 'Müəllim dedi ki, sabah sınaq imtahanı keçiriləcək.',
    distractors: [
      'qoşa nöqtə',
      'tire',
      'vergül, tire',
      'qoşa nöqtə, dırnaqlar',
    ],
    note: 'При передаче косвенной речи с союзом «ki» после «ki» ставится запятая (без двоеточия и кавычек).',
  },
];

// 9. Functional styles (az.stylistics)
export const STYLE_PASSAGES = [
  {
    text: 'Azərbaycan əlifbasında sait səslər əmələgəlmə yerinə görə qalın və incə, dilin vəziyyətinə görə açıq və qapalı növlərə bölünür.',
    style: 'elmi üslub (научный стиль)',
    note: 'использованы лингвистические термины (sait səslər, qalın, incə), точность и логичность изложения',
  },
  {
    text: 'Azərbaycan Respublikasının Konstitusiyasına əsasən dövlət hakimiyyəti hakimiyyətlərin bölünməsi prinsipi əsasında təşkil edilir.',
    style: 'rəsmi-işgüzar üslub (официально-деловой стиль)',
    note: 'характерны юридическая точность, стандартные обороты (əsasən, prinsipi əsasında) и отсутствие эмоциональности',
  },
  {
    text: 'Qızıl şəfəqlər dağların qarlı zirvəsini bürüdükcə, dərədən əsən sərin meh ağacların yarpaqları ilə pıçıldaşırdı.',
    style: 'bədii üslub (художественный стиль)',
    note: 'использованы образные средства — эпитет (qızıl şəfəqlər), олицетворение (yarpaqları ilə pıçıldaşırdı)',
  },
  {
    text: 'Son illər regionda mədəni irsin qorunması və qədim sənət sahələrinin təbliği istiqamətində mühüm layihələr həyata keçirilir.',
    style: 'publisistik üslub (публицистический стиль)',
    note: 'общественно-политическая лексика, актуальность и информативность для широкой аудитории',
  },
  {
    text: '– Ay qardaş, bu gün hava yaman sərindir, bir az tez gəl, çayımız soyuyar!',
    style: 'məişət üslubu (разговорный стиль)',
    note: 'непринуждённый диалог, разговорные обращения и частицы (Ay qardaş, yaman)',
  },
];

export const ALL_STYLES = [
  'bədii üslub (художественный стиль)',
  'publisistik üslub (публицистический стиль)',
  'elmi üslub (научный стиль)',
  'rəsmi-işgüzar üslub (официально-деловой стиль)',
  'məişət üslubu (разговорный стиль)',
];

// Word stylistic functions (mirrors 0903#57: poetik / informativ / terminoloji)
export const WORD_FUNCTION_ITEMS = [
  { s: 'Göy üzündə qızıl günəş <u>gülümsəyərək</u> torpağa istilik paylayırdı.', fn: 'poetik (поэтическая)', note: 'глагол «gülümsəyərək» употреблён в переносном, образном значении (олицетворение)' },
  { s: 'Qışın sərt nəfəsi kəndin küçələrini <u>bürümüşdü</u>.', fn: 'poetik (поэтическая)', note: 'слово употреблено метафорически для создания художественного образа' },
  { s: 'Xalçadakı naxışlar qədim insanların dünyagörüşünü <u>əks etdirir</u>.', fn: 'informativ (информативная)', note: 'слово употреблено в прямом, сообщении-фактографическом значении' },
  { s: 'Dünən şəhər kitabxanasında yeni sərgi <u>açıldı</u>.', fn: 'informativ (информативная)', note: 'прямое номинативное значение, передача факта' },
  { s: 'Sözün kökü ilə şəkilçisi arasındakı səs dəyişməsinə <u>assimilyasiya</u> deyilir.', fn: 'terminoloji (терминологическая)', note: 'слово употреблено как строгий научный термин языкознания' },
  { s: 'Üçbucağın daxili bucaqlarının cəmi 180 dərəcəyə bərabər olan <u>teorem</u> sübut edildi.', fn: 'terminoloji (терминологическая)', note: 'слово выступает как математический термин' },
];

// Speech norm errors (mirrors 0903#58 & 1503#56)
export const SPEECH_NORM_ITEMS = [
  {
    bad: 'Səfəvilər <u>tarixində</u> Azərbaycanda olmuş səyyah bunu gündəliyində <u>istinad etmişdir</u>.',
    fix: 'Səfəvilər <u>dövründə</u> Azərbaycanda olmuş səyyah bunu gündəliyində <u>qeyd etmişdir</u>.',
    rule: 'неверное словоупотребление: «tarixində» → «dövründə», «gündəliyində istinad etmişdir» → «gündəliyində qeyd etmişdir»',
  },
  {
    bad: 'Qədim dövrlərdən tarixi inkişaf yolu <u>aşaraq</u> gələn sənət öz <u>ifasını</u> qoruyur.',
    fix: 'Qədim dövrlərdən tarixi inkişaf yolu <u>keçərək</u> gələn sənət öz <u>mövqeyini</u> qoruyur.',
    rule: 'нарушена лексическая сочетаемость: «yol aşmaq» → «yol keçmək/qət etmək», «öz ifasını qoruyur» → «öz yerini/mövqeyini qoruyur»',
  },
  {
    bad: 'Məruzəçi çıxışında mühüm faktlara <u>toxundu</u> və onları <u>göz önünə</u> gətirdi — нет, сделаем явный плеоназм: öz şəxsi fikrini söylədi.',
    fix: 'Məruzəçi çıxışında şəxsi fikrini söylədi.',
    rule: 'убрали лишний плеоназм',
  },
  {
    bad: 'Şagird müəllimin verdiyi tapşırığı <u>öz şəxsi</u> dəftərinə səliqə ilə yazdı.',
    fix: 'Şagird müəllimin verdiyi tapşırığı <u>öz</u> dəftərinə səliqə ilə yazdı.',
    rule: 'плеоназм (речевая избыточность): «öz» и «şəxsi» дублируют друг друга',
  },
  {
    bad: 'İclasda bütün qonaqlar qarşısında <u>təşəkkür minnətdarlığı</u> bildirildi.',
    fix: 'İclasda bütün qonaqlar qarşısında <u>təşəkkür</u> bildirildi.',
    rule: 'тавтология/плеоназм: «təşəkkür» и «minnətdarlıq» в одном сочетании избыточны',
  },
  {
    bad: 'Yazıçı əsərində kənd əhalisinin ağır <u>vəziyyət halını</u> ustalıqla təsvir etmişdir.',
    fix: 'Yazıçı əsərində kənd əhalisinin ağır <u>vəziyyətini</u> ustalıqla təsvir etmişdir.',
    rule: 'речевая избыточность: «vəziyyət» и «hal» дублируют значение друг друга',
  },
  {
    bad: 'Gənc idmançı yarışda <u>ən yüksək rekord</u> nəticə əldə etdi.',
    fix: 'Gənc idmançı yarışda <u>rekord</u> nəticə əldə etdi.',
    rule: 'плеоназм: слово «rekord» уже означает наивысшее достижение, добавление «ən yüksək» избыточно',
  },
].filter((x) => !x.rule.includes('убрали'));

export const CORRECT_NORM_SENTENCES = [
  'Səfəvilər dövründə Azərbaycanda olmuş səyyah bu faktı gündəliyində qeyd etmişdir.',
  'Qədim dövrlərdən tarixi inkişaf yolu keçərək gələn xalçaçılıq sənəti bu gün də yaşayır.',
  'Müəllim şagirdlərin dərsə marağını artırmaq üçün maraqlı nümunələr gətirdi.',
  'Tarixi mənbələr Şamaxı və Təbriz ustalarının böyük şöhrət qazandığını təsdiqləyir.',
  'Tədqiqatçılar qədim əlyazmaları diqqətlə araşdıraraq yeni faktlar üzə çıxardılar.',
];
