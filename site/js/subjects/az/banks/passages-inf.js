// 5 original informational/publicistic passages (publisistik / elmi-kütləvi mətn)
// for `az.reading-closed` & `az.reading-open`.

export const INFORMATIONAL_PASSAGES = [
  {
    id: 'az-inf-1',
    genre: 'informational',
    title: 'Şəki şəbəkə sənəti',
    html: `<p>Azərbaycanın qədim şəhərlərindən biri olan Şəki təkcə təbiəti ilə deyil, həm də nadir memarlıq ənənələri ilə seçilir. <span class="num">[I]</span> Bu ənənələr arasında şəbəkə sənəti xüsusi yer tutur<sup>1</sup>. Şəbəkə — mismarsız və yapışqansız, kiçik taxta hissələrin bir-birinə keçirilməsi yolu ilə yaradılan bədii pəncərə kompozisiyasıdır. <span class="num">1.</span> Şəhərin mərkəzindəki köhnə çinar ağacları bu binalara kölgə salır.</p>
<p>Şəbəkə ustaları əsasən möhkəm və elastik qoz ağacından istifadə edirlər. <span class="num">[II]</span> Taxta çərçivələrin arasına Venesiyadan və ya yerli emalatxanalardan gətirilən rəngli şüşələr yerləşdirilir. <span class="num">2.</span> Məsələn, bir kvadrat metr şəbəkənin yığılması üçün bəzən beş mindən artıq xırda detal tələb olunur. Günəş şüaları bu rəngli şüşələrdən süzülərək otağın döşəməsinə əlvan naxışlar ▲ <b>səpələyir</b>.</p>
<p>XVIII əsrdə tikilmiş Şəki Xan Sarayı bu sənətin ən parlaq nümunəsidir. <span class="num">[III]</span> Sarayın fasadındakı böyük şəbəkə pəncərələr binaya həm yüngüllük verir, həm də temperaturu tənzimləyir. <span class="num">3.</span> Ustalar hər bir ornamenti riyazi dəqiqliklə hesablayırlar, çünki tək bir detalın səhv kəsilməsi bütün konstruksiyanın möhkəmliyini poza bilər. <span class="num">4.</span> Tədqiqatçılar qeyd edirlər ki, Şəki şəbəkələrindəki ulduz və həndəsi fiqurlar kainatın ■ <b>ahəngini</b> ifadə edir.</p>
<p><span class="mark">Bu gün də Şəkidə şəbəkə sənətinin sirləri nəsildən-nəslə uğurla çatdırılıb qorunur.</span> <span class="num">[IV]</span> Müasir ustalar əcdadlarının üsullarını yaşatmaqla yanaşı, yeni bədii kompozisiyalar da yaradırlar. <span class="num">5.</span> Turistlər ustaların emalatxanalarında kiçik şəbəkə suvenirlərinin hazırlanmasını maraqla izləyirlər. Beləliklə, şəbəkə sənəti həm (1) ................ nümunəsi, həm də (2) ................ göstəricisidir. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Sarayın bərpası zamanı bütün taxta detallar yenə də qədim üsulla — mismarsız birləşdirilmişdir.',
      correctSlot: 'III',
      note: 'Информация о реставрации дворца без гвоздей логически примыкает к абзацу о Дворце шекинских ханов [III].',
    },
    removable: {
      ok: [1, 5],
      bad: [2, 3, 4],
      note: 'Предложения 1 (о деревьях в центре города) и 5 (о туристах) носят второстепенный характер; 2, 3 и 4 содержат ключевые факты о технологии и символике.',
    },
    polysemy: {
      targetWord: 'tutur',
      meaning1: 'müəyyən mövqe qazanmaq, əhəmiyyətli olmaq (занимать особое место)',
      exOk: '1 – Azərbaycan xalçaçılığı dünya incəsənətində layiqli yer <u>tutur</u>.',
      exWrong: [
        '1 – Uşaq əlindəki qələmi bərk <u>tutur</u> və şəkil çəkirdi.',
        '1 – Bu qədim mis qab təxminən beş litr su <u>tutur</u>.',
        '1 – Balıqçı səhər tezdən çayda torla balıq <u>tuturdu</u>.',
        '1 – Qışda dağların başını qalın duman <u>tutur</u>.',
      ],
      note: 'В тексте «xüsusi yer tutur» («занимает особое место») совпадает со значением в «dünya incəsənətində layiqli yer tutur», тогда как в остальных примерах глагол tutmaq означает физическое удержание, вместимость, ловлю или окутывание туманом.',
    },
    truthPool: [
      { text: 'Şəbəkə konstruksiyasında mismar və yapışqandan istifadə olunmur.', status: 'Doğrudur' },
      { text: 'Şəbəkə pəncərələr otaqda temperaturun tənzimlənməsinə kömək edir.', status: 'Doğrudur' },
      { text: 'Şəki şəbəkələrində yalnız tək bir rəngli şüşədən istifadə edilir.', status: 'Yanlışdır' },
      { text: 'Şəbəkənin hazırlanmasında riyazi dəqiqlik əhəmiyyət daşımır.', status: 'Yanlışdır' },
      { text: 'Şəki Xan Sarayının bütün ustaları xarici ölkələrdən dəvət olunmuşdu.', status: 'Ehtimaldır' },
      { text: 'Orta əsrlərdə Şəkidə şəbəkə məktəbləri yüzlərlə şagird yetişdirirdi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansı məsələ haqqında məlumat yoxdur?',
      items: [
        { text: 'Şəbəkə detallarının hansı ağac növündən hazırlanması', cant: false },
        { text: 'Venesiyadan gətirilən şüşələrin dəqiq qiyməti', cant: true },
        { text: 'Bir kvadrat metr şəbəkədə neçə detal ola bilməsi', cant: false },
        { text: 'Şəki Xan Sarayının memarının adı', cant: true },
        { text: 'Şəbəkədəki həndəsi fiqurların simvolik mənası', cant: false },
      ],
      note: 'В тексте нет сведений о цене венецианского стекла (2) и имени архитектора дворца (4).',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin mətndəki funksiyasını (poetik / informativ / terminoloji) müəyyən edin və fərqli funksiyada cümlədə işlədin:<br>▲ <b>səpələyir</b><br>■ <b>ahəng</b>',
        answer: '▲ <b>Poetik</b> (şüalar əlvan naxışlar səpələyir). Fərqli (informativ): Kəndli torpağa buğda toxumu səpələdi.<br>■ <b>Poetik / Fəlsəfi-informativ</b>. Fərqli (terminoloji): Azərbaycan dilində saitlərin ahəngi qanunu mövcuddur.',
        rubric: '2 балла — верно указана функция обоих слов и составлены корректные предложения в другой функции; 1 балл — верно для 1 слова; 0 баллов — неверно.',
        explanation: 'Глагол səpələyir о солнечных лучах выполняет поэтическую функцию; в прямом значении (сеять зерно) — информативную. Ahəng как «гармония вселенной» в ином контексте может быть термином («ahəng qanunu»).',
      },
      {
        kind: 'edit',
        stem: 'Mətndə seçilmiş cümlədəki üslubi-leksik qüsuru düzəldərək cümləni yenidən yazın:<br><i>«Bu gün də Şəkidə şəbəkə sənətinin sirləri nəsildən-nəslə uğurla çatdırılıb qorunur.»</i>',
        answer: 'Bu gün də Şəkidə şəbəkə sənətinin sirləri nəsildən-nəslə uğurla ötürülərək qorunub saxlanılır.',
        rubric: '2 балла — неточное сочетание «çatdırılıb qorunur» заменено нормативным «ötürülərək / yaşadılarak qorunub saxlanılır»; 1 балл — частичная правка; 0 баллов — ошибка не исправлена.',
        explanation: 'Словосочетание «sirləri çatdırılıb» стилистически шероховато; нормативно для традиций — «ötürülür» (передаются) и «qorunub saxlanılır».',
      },
      {
        kind: 'fill',
        stem: 'Son cümlədəki nöqtələrin yerinə mətnə uyğun ifadələr yazın:<br><i>«Beləliklə, şəbəkə sənəti həm (1) ................ nümunəsi, həm də (2) ................ göstəricisidir.»</i>',
        answer: '(1) zərif sənətkarlıq / memarlıq irsi; (2) riyazi dəqiqlik və zövq / xalq yaradıcılığı.',
        rubric: '2 балла — оба пропуска точно обобщают содержание текста; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Итоговая фраза объединяет художественное мастерство (sənətkarlıq) и точность расчётов/эстетику.',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>«Müddəa — Müddəanı təsdiq edən fakt»</b> cədvəlini tamamlayın:<br>1) Müddəa: <i>Şəbəkə ustaları işdə yüksək dəqiqlik göstərirlər.</i> → Fakt: ?<br>2) Müddəa: ? → Fakt: <i>Şəki Xan Sarayının böyük şəbəkə pəncərələri binada temperaturu tənzimləyir.</i>',
        answer: '1) <b>Fakt:</b> Bir kvadrat metr şəbəkə üçün beş mindən artıq detal riyazi dəqiqliklə hesablanır.<br>2) <b>Müddəa:</b> Şəbəkə pəncərələri estetik gözəlliklə yanaşı, praktiki (məişət) funksiyaya da malikdir.',
        rubric: '2 балла — оба элемента таблицы заполнены точно по тексту; 1 балл — 1 элемент; 0 баллов — неверно.',
        explanation: 'Первый тезис подтверждается 5000 деталями; второй факт иллюстрирует практическую пользу шебеке.',
      },
      {
        kind: 'argument',
        stem: '«Şəbəkə sənətində elmlə incəsənət birləşmişdir» fikrini mətnlə əlaqələndirib əsaslandırın.',
        answer: 'Şəbəkə sənətində bir tərəfdən əlvan şüşələr və ulduz ornamentləri ilə yüksək bədii-estetik kompozisiya yaradılır (incəsənət), digər tərəfdən isə minlərlə detalın mismarsız birləşdirilməsi üçün ciddi riyazi hesablamalar və mühəndis dəqiqliyi tələb olunur (elm).',
        rubric: '2 балла — раскрыты обе стороны (художественная и математико-инженерная) с опорой на текст; 1 балл — приведена только одна сторона; 0 баллов — неверно.',
        explanation: 'Соединение эстетики витражей с точным математическим расчётом деталей доказывает синтез науки и искусства.',
      },
    ],
  },

  {
    id: 'az-inf-2',
    genre: 'informational',
    title: 'Lahıc misgərliyi',
    html: `<p>Böyük Qafqaz dağlarının qoynunda yerləşən Lahıc qəsəbəsi əsrlər boyu Azərbaycanda misgərlik sənətinin əsas mərkəzlərindən biri olmuşdur. <span class="num">[I]</span> Qədim mənbələrdə buradakı ustaların hazırladığı qabların hətta Şərq bazarlarında da yüksək qiymətləndirildiyi qeyd olunur. <span class="num">1.</span> Qəsəbənin daş döşənmiş küçələri turistlərin diqqətini çəkir.</p>
<p>Lahıc misgərləri adi mis lövhələri əritmə və döymə üsulu ilə sənət nümunəsinə çevirirlər. <span class="num">[II]</span> Hazırlanan dolça, məcməyi, samovar və sinilərin üzəri zərif nəbati və həndəsi naxışlarla ▲ <b>bəzədilir</b>. <span class="num">2.</span> Bu işdə ustalar çəkicdən başqa, xüsusi polad qələmlərdən də istifadə edirlər. <span class="num">3.</span> Tədqiqatçıların fikrincə, Lahıc qablarının üzərindəki hər bir təsvir təsadüfi deyil, müəyyən bir məna daşıyır<sup>1</sup>.</p>
<p>XIX əsrdə Lahıcda qırxdan artıq misgər emalatxanası fəaliyyət göstərirdi. <span class="num">[III]</span> Ustalar öz sənət sirlərini yalnız övladlarına və ən sadiq şagirdlərinə öyrədirdilər. <span class="num">4.</span> <span class="mark">Müasir dövrdə bəzi köhnə qablar yalnız muzeylərin rəflərində nümayiş olunmaq üçün saxlanılır.</span> Bu sənətin dünya miqyasında əhəmiyyətini nəzərə alaraq, 2015-ci ildə Lahıc misgərlik sənəti YUNESKO-nun Qeyri-maddi Mədəni İrs Siyahısına ■ <b>daxil edilmişdir</b>.</p>
<p>Bu gün də Lahıcın mərkəzi küçəsində çəkic səsləri eşidilməkdədir. <span class="num">[IV]</span> Gənc nəsillər qədim texnologiyanı qoruyub saxlamaqla yanaşı, müasir tələblərə uyğun əşyalar da hazırlayırlar. <span class="num">5.</span> Qəsəbədə misgərliklə yanaşı, dəmirçilik və xalçaçılıq da inkişaf etmişdir. Beləliklə, Lahıc misgərliyi həm (1) ................ yaşadır, həm də (2) ................ tanıdır. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Məhz bu sənət ənənələrinin qorunması nəticəsində Lahıc tarixi-mədəni qoruq elan olunmuşdur.',
      correctSlot: 'III',
      note: 'Предложение о признании Лагича историко-культурным заповедником логично продолжает абзац о династиях и международном признании [III].',
    },
    removable: {
      ok: [1, 5],
      bad: [2, 3, 4],
      note: 'Предложения 1 (мощёные улицы) и 5 (кузнечное и ковровое дело) не касаются непосредственно медного ремесла; 2, 3 и 4 ключевые.',
    },
    polysemy: {
      targetWord: 'daşıyır',
      meaning1: 'ifadə etmək, əks etdirmək (нести смысл, передавать)',
      exOk: '1 – Şairin yazdığı misralar dərin fəlsəfi məna <u>daşıyır</u>.',
      exWrong: [
        '1 – Fəhlələr ağır daşları tikinti meydançasına <u>daşıyırdılar</u>.',
        '1 – Poçtalyon hər səhər qonşulara məktub <u>daşıyır</u>.',
        '1 – Bu avtomobil iki tona qədər yük <u>daşıya</u> bilir.',
        '1 – Güclü külək quru yarpaqları küçəyə <u>daşıdı</u>.',
      ],
      note: 'В тексте «müəyyən bir məna daşıyır» совпадает с переносным значением «dərin məna daşıyır» (а не «носить груз»).',
    },
    truthPool: [
      { text: 'Lahıc misgərlik sənəti 2015-ci ildə YUNESKO siyahısına salınmışdır.', status: 'Doğrudur' },
      { text: 'Lahıc qablarının üzərinə nəbati və həndəsi naxışlar vurulur.', status: 'Doğrudur' },
      { text: 'XIX əsrdə Lahıcda cəmi beş-altı emalatxana fəaliyyət göstərirdi.', status: 'Yanlışdır' },
      { text: 'Bu gün Lahıcda artıq heç bir misgər emalatxanası işləmir.', status: 'Yanlışdır' },
      { text: 'Lahıcda misgərlik sənətinin yaranması orta əsrlərdən də qədim dövrə gedib çıxır.', status: 'Ehtimaldır' },
      { text: 'Qədim Şərq bazarlarında Lahıc samovarlarına daha çox tələbat var idi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansı suala cavab tapmaq mümkün deyil?',
      items: [
        { text: 'Lahıc misgərliyinin YUNESKO siyahısına hansı ildə daxil edildiyinə', cant: false },
        { text: 'Lahıca mis xammalının haradan gətirildiyinə', cant: true },
        { text: 'XIX əsrdə qəsəbədə neçə emalatxana olduğuna', cant: false },
        { text: 'Qabların üzərində hansı növ naxışların çəkildiyinə', cant: false },
        { text: 'Lahıcda ilk misgər emalatxanasının kim tərəfindən açıldığına', cant: true },
      ],
      note: 'Откуда привозили сырую медь (2) и кто открыл первую мастерскую (5), в тексте не указано.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin kontekstə uyğun mənalarını və funksiyasını yazın:<br>▲ <b>bəzədilir</b><br>■ <b>daxil edilmişdir</b>',
        answer: '▲ <b>İnformativ</b> — naxış vurulur, gözəlləşdirilir. (Poetik nümunə: Bahar gəlişi ilə təbiəti yaşıl donla bəzədi.)<br>■ <b>İnformativ / Rəsmi</b> — siyahıya salınmışdır, qəbul edilmişdir.',
        rubric: '2 балла — верно указаны значения и стилистическая функция; 1 балл — только значения без функции; 0 баллов — неверно.',
        explanation: 'Оба выражения в научно-популярном тексте употреблены в информативной функции.',
      },
      {
        kind: 'enrich',
        stem: 'Seçilmiş cümləni məcazi ifadələrlə zənginləşdirin:<br><i>«Müasir dövrdə bəzi köhnə qablar yalnız muzeylərin rəflərində nümayiş olunmaq üçün saxlanılır.»</i>',
        answer: 'Müasir dövrdə keçmişin səssiz şahidi olan bəzi nadir qablar muzeylərin rəflərində tarixin yadigarı kimi göz bəbəyi tək qorunub saxlanılır.',
        rubric: '2 балла — смысл сохранён, добавлены выразительные метафоры; 1 балл — слабое обогащение; 0 баллов — не выполнено.',
        explanation: 'Добавление образов («keçmişin səssiz şahidi», «göz bəbəyi tək») делает фразу художественно выразительной.',
      },
      {
        kind: 'fill',
        stem: 'Son cümləni mətnə uyğun tamamlayın:<br><i>«Beləliklə, Lahıc misgərliyi həm (1) ................ yaşadır, həm də (2) ................ tanıdır.»</i>',
        answer: '(1) qədim sənət ənənələrini; (2) Azərbaycan mədəniyyətini dünyada.',
        rubric: '2 балла — оба пропуска логически завершают текст; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Итоговый вывод связывает сохранение традиций (1) и международную известность культуры (2).',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>«Müddəa — Fakt»</b> cədvəlini doldurun:<br>1) Müddəa: <i>Lahıc misgərliyi yüksək sənətkarlıq tələb edir.</i> → Fakt: ?<br>2) Müddəa: ? → Fakt: <i>2015-ci ildə YUNESKO-nun Qeyri-maddi Mədəni İrs Siyahısına daxil edilmişdir.</i>',
        answer: '1) <b>Fakt:</b> Ustalar əritmə və döymə üsulu ilə işləyir, polad qələmlərlə zərif nəbati və həndəsi naxışlar açırlar.<br>2) <b>Müddəa:</b> Lahıc misgərliyi dünya miqyasında tanınır və qiymətləndirilir.',
        rubric: '2 балла — обе пары заполнены точно; 1 балл — 1 пара; 0 баллов — неверно.',
        explanation: 'Тонкая гравировка стальными резцами доказывает мастерство, а список ЮНЕСКО — мировое признание.',
      },
      {
        kind: 'argument',
        stem: '«Lahıcda sənətkarlıq nəsildən-nəslə ötürülən canlı ənənədir» fikrini mətnlə əsaslandırın.',
        answer: 'XIX əsrdə ustalar sənət sirlərini övladlarına və sadiq şagirdlərinə öyrədir, bu gün də Lahıc küçələrində çəkic səsləri eşidilir və gənc nəsillər qədim texnologiyanı yaşadırlar.',
        rubric: '2 балла — приведены аргументы из прошлого и настоящего по тексту; 1 балл — только один аргумент; 0 баллов — неверно.',
        explanation: 'Связь XIX века и современности подтверждает преемственность ремесла.',
      },
    ],
  },

  {
    id: 'az-inf-3',
    genre: 'informational',
    title: 'Abşeronun qədim ovdanları',
    html: `<p>Quraq iqlimə malik Abşeron yarımadasında əsrlər boyu su təchizatı ən vacib məsələlərdən biri olmuşdur. <span class="num">[I]</span> Çayları olmayan bu ərazidə əhali yeraltı sulardan səmərəli istifadə etmək üçün «ovdan» adlanan qədim su anbarları tikmişdir. <span class="num">1.</span> Yarımadanın küləkli havası yay aylarında ətrafı bir qədər sərinlədir.</p>
<p>Ovdanlar əsasən yerin altı ilə uzanan və su mənbəyini daşıyan kəhriz sistemlərinin sonunda qurulurdu. <span class="num">[II]</span> Suya çatmaq üçün torpağın dərinliyinə doğru daş pilləkənlər ▲ <b>enirdi</b><sup>1</sup>. <span class="num">2.</span> Tikintidə yerli əhəngdaşından istifadə edilməsi suyun təmiz və sərin qalmasını təmin edirdi. Üstü günbəz şəklində örtüldüyü üçün yay istisində su ■ <b>buxarlanmırdı</b>. <span class="num">3.</span> Kənd ağsaqqalları ovdanların ətrafını həmişə təmiz saxlamağı əmr edirdilər.</p>
<p>Abşeronun bir çox kəndlərində — Balaxanı, Ramana, Mərdəkan və Maştağada bu tarixi tikililərin qalıqlarına indi də rast gəlinir. <span class="num">[III]</span> Xüsusilə Balaxanıdakı XIV əsrə aid Şah Səfi ovdanı öz memarlıq üslubu ilə seçilir. <span class="num">4.</span> <span class="mark">Bəzi yerlərdə kəhriz suları əkin sahələrinin suvarılmasında da istifadə olunmağa başlanılırdı.</span> Tədqiqatçılar hesab edirlər ki, bu qurğular qədim Azərbaycan mühəndislərinin hidrologiya sahəsində dərin biliyə malik olduğunu sübut edir.</p>
<p>XX əsrdə mərkəzləşdirilmiş su kəmərlərinin çəkilməsindən sonra ovdanlar əvvəlki əhəmiyyətini itirsə də, tarixi abidə kimi dəyərini qoruyur. <span class="num">[IV]</span> Bu gün bir sıra ovdanlar bərpa edilərək mədəni irs nümunəsi kimi qorunur. <span class="num">5.</span> Beləliklə, Abşeron ovdanları həm (1) ................ həllinə xidmət etmiş, həm də (2) ................ nümunəsinə çevrilmişdir. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Çünki qapalı məkan həm günəş şüalarının qarşısını alır, həm də tozun qarışmasına imkan vermirdi.',
      correctSlot: 'II',
      note: 'Объяснение роли закрытого купола (защита от солнца и пыли) относится ко 2-му абзацу об устройстве овданов [II].',
    },
    removable: {
      ok: [1, 3],
      bad: [2, 4, 5],
      note: 'Предложения 1 (о ветреной погоде) и 3 (наказ старейшин) факультативны; 2, 4 и 5 передают инженерную и историческую суть.',
    },
    polysemy: {
      targetWord: 'enirdi',
      meaning1: 'yuxarıdan aşağıya doğru uzanmaq, düşmək (спускаться вниз)',
      exOk: '1 – Dağ cığırı döngələrlə vadinin dibinə doğru <u>enirdi</u>.',
      exWrong: [
        '1 – Axşam düşdükcə kəndin üstünə sakitlik <u>enirdi</u>.',
        '1 – Təyyarə bir neçə dəqiqədən sonra hava limanına <u>endi</u>.',
        '1 – Qiymətlər payız mövsümündə xeyli aşağı <u>endi</u>.',
        '1 – Çayın suyu yay aylarında xeyli <u>enirdi</u>.',
      ],
      note: 'В тексте «pilləkənlər dərinliyə doğru enirdi» (ступеньки спускались в глубину) соответствует прямому пространственному значению «cığır vadinin dibinə enirdi».',
    },
    truthPool: [
      { text: 'Abşeron yarımadasında təbii çaylar olmadığı üçün ovdanlardan istifadə olunurdu.', status: 'Doğrudur' },
      { text: 'Ovdanların günbəzli olması suyun buxarlanmasının qarşısını alırdı.', status: 'Doğrudur' },
      { text: 'Ovdanlar yalnız XX əsrdə su kəmərlərindən sonra tikilməyə başlanmışdır.', status: 'Yanlışdır' },
      { text: 'Balaxanıdakı Şah Səfi ovdanı XXI əsrdə inşa edilmişdir.', status: 'Yanlışdır' },
      { text: 'Şah Səfi ovdanının tikintisində xarici memarlar da iştirak etmişdir.', status: 'Ehtimaldır' },
      { text: 'Qədim dövrdə Abşeronun hər kəndində azı beş ovdan mövcud idi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansı faktı dəqiqləşdirmək mümkün deyil?',
      items: [
        { text: 'Ovdanların tikintisində hansı daş növündən istifadə olunduğunu', cant: false },
        { text: 'Balaxanıdakı Şah Səfi ovdanının dəqiq dərinliyinin neçə metr olduğunu', cant: true },
        { text: 'Ovdanların su mənbəyinin nə ilə bağlı olduğunu (kəhriz sistemi)', cant: false },
        { text: 'Ovdanların niyə XX əsrdə əvvəlki rolunu itirdiyini', cant: false },
        { text: 'Abşeronda ilk ovdanın hansı kənddə tikildiyini', cant: true },
      ],
      note: 'Точная глубина овдана Шах Сафи (2) и то, в каком селе появился самый первый овдан (5), в тексте не упоминаются.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin mətndəki funksiyasını yazın və cümlədə fərqli mənada (və ya funksiyada) işlədin:<br>▲ <b>enirdi</b><br>■ <b>buxarlanmırdı</b>',
        answer: '▲ <b>İnformativ</b> (pilləkənlər enirdi). Fərqli (poetik): Qaranlıq göylərdən yerə sükut enirdi.<br>■ <b>Terminoloji / İnformativ</b> (fiziki proses). Fərqli (poetik): Xatirələr zaman keçdikcə buxarlanıb yox olurdu.',
        rubric: '2 балла — верно определена функция и даны грамотные контрастные примеры; 1 балл — верно для 1 слова; 0 баллов — неверно.',
        explanation: 'Оба слова в тексте имеют информативную/терминологическую функцию; при переносном употреблении становятся поэтическими.',
      },
      {
        kind: 'edit',
        stem: 'Seçilmiş cümlədəki qrammatik-üslubi qüsuru düzəldib cümləni yenidən yazın:<br><i>«Bəzi yerlərdə kəhriz suları əkin sahələrinin suvarılmasında da istifadə olunmağa başlanılırdı.»</i>',
        answer: 'Bəzi yerlərdə kəhriz sularından əkin sahələrinin suvarılmasında da istifadə olunmağa başlanırdı (və ya: kəhriz suları əkin sahələrinin suvarılmasında da işlədilirdi).',
        rubric: '2 балла — исправлены управление (sulardan istifadə) и избыточный двойной пассив (başlanılırdı → başlanırdı); 1 балл — исправлена одна ошибка; 0 баллов — не исправлено.',
        explanation: 'В азербайджанском языке глагол «istifadə etmək/olunmaq» требует исходного падежа (-dan), а «başlanılırdı» содержит лишний повторный суффикс страдательности.',
      },
      {
        kind: 'fill',
        stem: 'Son cümlədəki boşluqları tamamlayın:<br><i>«...Abşeron ovdanları həm (1) ................ həllinə xidmət etmiş, həm də (2) ................ nümunəsinə çevrilmişdir.»</i>',
        answer: '(1) su çatışmazlığı / su təchizatı probleminin; (2) qədim memarlıq və mühəndisliyin.',
        rubric: '2 балла — оба пропуска точно соответствуют тексту; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Овданы решали проблему водоснабжения и являются памятником инженерного и архитектурного искусства.',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>«Müddəa — Fakt»</b> cədvəlini tamamlayın:<br>1) Müddəa: <i>Ovdanlar suyu uzun müddət keyfiyyətli saxlamaq üçün xüsusi üsulla tikilirdi.</i> → Fakt: ?<br>2) Müddəa: ? → Fakt: <i>Balaxanı, Ramana, Mərdəkan və Maştağada ovdan qalıqlarına rast gəlinir.</i>',
        answer: '1) <b>Fakt:</b> Tikintidə yerli əhəngdaşından istifadə olunur, üstü isə buxarlanmanın qarşısını almaq üçün günbəzlə örtülürdü.<br>2) <b>Müddəa:</b> Ovdanlar Abşeronun bir çox kəndlərində geniş yayılmış tarixi tikililər idi.',
        rubric: '2 балла — обе позиции сформулированы верно; 1 балл — 1 позиция; 0 баллов — неверно.',
        explanation: 'Использование известняка и купола подтверждает технологическую продуманность; перечень сёл доказывает широкое распространение.',
      },
      {
        kind: 'argument',
        stem: '«Təbii şərait insanların mühəndislik düşüncəsini inkişaf etdirir» fikrini mətnlə əlaqələndirib izah edin.',
        answer: 'Abşeronda çayların olmaması və quraq yay istiləri sakinləri kəhrizlər çəkməyə, əhəngdaşından yeraltı ovdanlar tikməyə və buxarlanmanı azaltmaq üçün günbəz konstruksiyasından istifadə etməyə sövq etmişdir.',
        rubric: '2 балла — чётко показана связь между природными условиями (засуха, отсутствие рек) и инженерными решениями (кяризы, известняк, купол); 1 балл — неполный ответ; 0 баллов — неверно.',
        explanation: 'Климатический вызов стал стимулом для создания сложной системы кяризов и овданов.',
      },
    ],
  },

  {
    id: 'az-inf-4',
    genre: 'informational',
    title: 'Azərbaycan miniatür məktəbi',
    html: `<p>XVI əsrdə Təbriz şəhəri Şərq dünyasının ən nüfuzlu kitab sənəti və rəssamlıq mərkəzlərindən birinə çevrilmişdi. <span class="num">[I]</span> Burada formalaşan Təbriz miniatür məktəbi incə xətləri, zəngin rəng çalarları və canlı səhnələri ilə dünya incəsənətində silinməz iz qoymuşdur. <span class="num">1.</span> O dövrdə Təbriz bazarlarında müxtəlif ədviyyatlar da satılırdı.</p>
<p>Miniatür sənəti əsasən əlyazma kitabların — xüsusilə Nizami Gəncəvi və Füzulinin əsərlərinin bəzədilməsi ilə bağlı idi. <span class="num">[II]</span> Rəssamlar təbiətdən əldə edilən mineral və bitki boyalarından istifadə edirdilər ki, rənglər əsrlər boyu ▲ <b>solmasın</b>. <span class="num">2.</span> Qızıl suyu ilə çəkilmiş səma və geyim detalları əsərlərə xüsusi təntənə verirdi<sup>1</sup>. <span class="num">3.</span> Təbriz miniatürlərinin ən görkəmli ustadı Sultan Məhəmməd hesab olunurdu.</p>
<p>Sultan Məhəmməd əsərlərində təkcə saray mərasimlərini deyil, adi insanların məişətini, ov səhnələrini və təbiətin dinamikasını da əks etdirirdi. <span class="num">[III]</span> Onun «Şahnamə» və «Xəmsə» əlyazmalarına çəkdiyi rəsmlər bu gün dünyanın aparıcı muzeylərində saxlanılır. <span class="num">4.</span> <span class="mark">Mütəxəssislər qeyd edirlər ki, miniatürlərdə perspektiv qanunları deyil, bədii şərtilik əsas yer tutur.</span></p>
<p>2020-ci ildə miniatür sənəti Azərbaycanın da daxil olduğu bir sıra ölkələrin təşəbbüsü ilə YUNESKO-nun Bəşəriyyətin Qeyri-maddi Mədəni İrs Siyahısına ■ <b>salınmışdır</b>. <span class="num">[IV]</span> Bu qərar klassik rəssamlıq irsimizin qlobal dəyərini bir daha təsdiqlədi. <span class="num">5.</span> Müasir rəssamlar da qədim miniatür ənənələrindən ilham alaraq yeni əsərlər yaradırlar. Beləliklə, Təbriz miniatür məktəbi həm (1) ................ ilə sıx bağlıdır, həm də (2) ................ təmsil edir. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Bu məktəbin şöhrəti qısa zamanda Osmanlı imperiyası və Orta Asiya saraylarına da yayılmışdı.',
      correctSlot: 'I',
      note: 'Предложение о распространении славы Тебризской школы продолжает введение в 1-м абзаце [I].',
    },
    removable: {
      ok: [1, 5],
      bad: [2, 3, 4],
      note: 'Предложения 1 (о специях на рынке) и 5 (о современных художниках) можно убрать без потери основной исторической линии; 2, 3 и 4 принципиальны.',
    },
    polysemy: {
      targetWord: 'verirdi',
      meaning1: 'bəxş etmək, yaratmaq (придавать — о впечатлении/свойстве)',
      exOk: '1 – Şam işığı otağa qəribə bir sirr və səmimiyyət <u>verirdi</u>.',
      exWrong: [
        '1 – Müəllim hər dərsin sonunda şagirdlərə ev tapşırığı <u>verirdi</u>.',
        '1 – Bağdakı meyvə ağacları bu il bol məhsul <u>verdi</u>.',
        '1 – Qonşu əmi kənddə qalan qohumlarına tez-tez xəbər <u>verirdi</u>.',
        '1 – Uşaq kitabxanadan götürdüyü romanı geri <u>verdi</u>.',
      ],
      note: '«xüsusi təntənə verirdi» («придавало торжественность») совпадает по значению с «sirr və səmimiyyət verirdi».',
    },
    truthPool: [
      { text: 'Təbriz miniatür məktəbi XVI əsrdə yüksək inkişaf mərhələsinə çatmışdı.', status: 'Doğrudur' },
      { text: 'Rəssamlar uzunömürlü rənglər üçün mineral və bitki boyalarından istifadə edirdilər.', status: 'Doğrudur' },
      { text: 'Sultan Məhəmməd əsərlərində yalnız saray mərasimlərini təsvir edirdi.', status: 'Yanlışdır' },
      { text: 'Miniatürlərdə Avropa rəngkarlığındakı xətti perspektiv qanunları əsas götürülürdü.', status: 'Yanlışdır' },
      { text: 'Sultan Məhəmmədin bəzi əlyazma rəsmləri Səfəvi saray kitabxanasından Avropaya hədiyyə göndərilmişdir.', status: 'Ehtimaldır' },
      { text: 'Nizami Gəncəvi əsərlərinin bəzi nüsxələri Təbrizdən Şamaxıya da aparılmışdı.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansı məlumatı müəyyən etmək mümkün deyil?',
      items: [
        { text: 'Miniatür sənətinin hansı ildə YUNESKO siyahısına daxil edildiyini', cant: false },
        { text: 'Sultan Məhəmmədin dəqiq doğum və ölüm illərini', cant: true },
        { text: 'Rəssamların boyaları nədən hazırladığını', cant: false },
        { text: 'Sultan Məhəmmədin əsərlərinin hansı konkret muzey şəhərlərində saxlanıldığını', cant: true },
        { text: 'Miniatürlərin hansı şairlərin əsərlərinə çəkildiyini', cant: false },
      ],
      note: 'В тексте не названы годы жизни Султана Мухаммеда (2) и конкретные города/названия музеев (4).',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin kontekstə uyğun izahını yazın:<br>▲ <b>solmasın</b><br>■ <b>salınmışdır</b>',
        answer: '▲ rəngini itirməsin, solğunlaşmasın, təravətini qorusun;<br>■ daxil edilmişdir, qeydə alınmışdır.',
        rubric: '2 балла — оба слова истолкованы точно; 1 балл — 1 слово; 0 баллов — неверно.',
        explanation: 'Контекст уточняет значения: solmasın — не выцветали (о красках); salınmışdır — включён (в список ЮНЕСКО).',
      },
      {
        kind: 'enrich',
        stem: 'Seçilmiş cümləni məcazi ifadələrlə zənginləşdirmədən və ya cümlədə bir bədii müqayisə artıraraq yenidən yazın:<br><i>«Mütəxəssislər qeyd edirlər ki, miniatürlərdə perspektiv qanunları deyil, bədii şərtilik əsas yer tutur.»</i>',
        answer: 'Mütəxəssislər vurğulayırlar ki, miniatürlər quru perspektiv ölçülərinin çərçivəsinə sığmır, əksinə, nağılvari bədii şərtiliyin qanadlarında canlanır.',
        rubric: '2 балла — добавлены образные средства, смысл термина «bədii şərtilik» сохранён; 1 балл — слабое обогащение; 0 баллов — не выполнено.',
        explanation: 'Образы («çərçivəsinə sığmır», «qanadlarında canlanır») оживляют научное высказывание.',
      },
      {
        kind: 'fill',
        stem: 'Son cümləni tamamlayın:<br><i>«...Təbriz miniatür məktəbi həm (1) ................ ilə sıx bağlıdır, həm də (2) ................ təmsil edir.»</i>',
        answer: '(1) klassik ədəbiyyat (poeziya); (2) Azərbaycan təsviri sənətini dünya miqyasında.',
        rubric: '2 балла — верно отражена связь с литературой и мировым искусством; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'В тексте подчёркивается связь миниатюры с рукописями Низами/Физули и мировое признание (ЮНЕСКО).',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>«Müddəa — Fakt»</b> cədvəlini tamamlayın:<br>1) Müddəa: <i>Təbriz miniatürləri ədəbiyyatla sıx bağlı olmuşdur.</i> → Fakt: ?<br>2) Müddəa: ? → Fakt: <i>Sultan Məhəmməd əsərlərində adi insanların məişətini və ov səhnələrini də çəkirdi.</i>',
        answer: '1) <b>Fakt:</b> Miniatürlər əsasən Nizami Gəncəvi və Füzulinin əlyazma kitablarının bəzədilməsi üçün çəkilirdi.<br>2) <b>Müddəa:</b> Təbriz miniatür sənəti təkcə saray həyatı ilə məhdudlaşmırdı (həyatın müxtəlif sahələrini əhatə edirdi).',
        rubric: '2 балла — оба блока заполнены верно; 1 балл — 1 блок; 0 баллов — неверно.',
        explanation: 'Иллюстрации к классикам доказывают связь с литературой; бытовые сцены — тематическую широту.',
      },
      {
        kind: 'argument',
        stem: '«Təbriz miniatürlərinin bu günə qədər canlı qalmasında rəssamların texniki ustalığı mühüm rol oynamışdır» fikrini mətnlə əsaslandırın.',
        answer: 'Rəssamlar təbiətdən alınan mineral və bitki boyalarından, həmçinin qızıl suyundan istifadə edirdilər ki, bunun sayəsində əsərlərin rəngləri əsrlər boyu solmamış və muzeylərdə qorunub qalmışdır.',
        rubric: '2 балла — приведены конкретные технические факторы (минеральные/растительные краски, сусальное золото) из текста; 1 балл — общий ответ без деталей; 0 баллов — неверно.',
        explanation: 'Сохранность красок объясняется именно выбором природных минеральных и растительных пигментов.',
      },
    ],
  },

  {
    id: 'az-inf-5',
    genre: 'informational',
    title: 'Kəlağayı — ipək yadigar',
    html: `<p>Azərbaycan qadınlarının ənənəvi baş örtüyü olan kəlağayı yüz illərdir ki, milli geyim mədəniyyətimizin rəmzi sayılır. <span class="num">[I]</span> İncə ipək saplardan toxunan bu örtük xüsusilə İsmayıllının Basqal qəsəbəsində və Şəkidə hazırlanır. <span class="num">1.</span> Basqal qəsəbəsi dağların ətəyində yerləşən səfalı bir yaşayış məntəqəsidir.</p>
<p>Kəlağayının hazırlanması olduqca zərif və mərhələli bir prosesdir. <span class="num">[II]</span> Əvvəlcə baramadan alınan təbii ipək saplar toxunur, daha sonra parça təbii bitki boyaları — soğan qabığı, nar qabığı və zirinc kökləri ilə rənglənir. <span class="num">2.</span> Naxışların vurulması üçün ustalar ağacdan oyulmuş xüsusi «qəlib» adlanan möhürlərdən istifadə edirlər. <span class="num">3.</span> Basqal ustaları bu işdə əsasən qaynar mumdan yararlanırlar ki, boya naxış olan hissəyə ▲ <b>hopmasın</b>.</p>
<p>Kəlağayının rəngləri və naxışları da özünəməxsus məna ifadə edir. <span class="num">[III]</span> Məsələn, ağ və açıq rəngli kəlağayılar təntənəli günlərdə, tünd rənglilər isə daha çox yaşlı qadınlar tərəfindən örtülürdü. <span class="num">4.</span> Örtüyün kənarındakı buta və şahbuta ornamentləri bərəkət və həyat sevgisi ■ <b>aşılayır</b><sup>1</sup>. <span class="mark">Qədimdə bəzi ustalar naxışların daha möhkəm qalması üçün parçaya müxtəlif ədviyyat növləri də əlavə edirdilər.</span></p>
<p>2014-cü ildə Azərbaycanın ənənəvi kəlağayı sənəti YUNESKO-nun Qeyri-maddi Mədəni İrs Siyahısına daxil edilmişdir. <span class="num">[IV]</span> Bu gün Basqal kəlağayıları həm ölkə daxilində, həm də xarici sərgilərdə böyük maraqla qarşılanır. <span class="num">5.</span> Gənc modelyerlər də öz kolleksiyalarında kəlağayı motivlərindən tez-tez istifadə edirlər. Beləliklə, kəlağayı təkcə (1) ................ deyil, həm də (2) ................ daşıyıcısıdır. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Parça soyuduqdan sonra mum təmizlənir və altından aydın, ağ naxışlar üzə çıxır.',
      correctSlot: 'II',
      note: 'Описание удаления воска после нанесения узоров штампом «qəlib» завершает технологический абзац [II].',
    },
    removable: {
      ok: [1, 5],
      bad: [2, 3, 4],
      note: 'Предложения 1 (расположение Басгала) и 5 (современные модельеры) не обязательны для раскрытия сути технологии и символики.',
    },
    polysemy: {
      targetWord: 'aşılayır',
      meaning1: 'təlqin etmək, hiss oyatmaq (внушать, вселять чувство)',
      exOk: '1 – Ana öz körpəsinə lap kiçik yaşlarından vətən sevgisi <u>aşılayırdı</u>.',
      exWrong: [
        '1 – Bağban yazda gənc alma ağaclarını <u>aşıladı</u>.',
        '1 – Dəri ustası xammalın yumşaq qalması üçün onu xüsusi məhlulla <u>aşılayır</u>.',
        '1 – Həkim uşaqları mövsümi xəstəliyə qarşı <u>aşıladı</u>.',
        '1 – Qoca sənətkar qabın üzərini lakla <u>aşılayıb</u> qurumağa qoydu.',
      ],
      note: 'В тексте «həyat sevgisi aşılayır» (внушает/пробуждает любовь к жизни) совпадает с «vətən sevgisi aşılayırdı», а не с прививкой деревьев или выделкой кожи.',
    },
    truthPool: [
      { text: 'Kəlağayı təbii ipəkdən hazırlanır və bitki boyaları ilə rənglənir.', status: 'Doğrudur' },
      { text: 'Naxışların vurulmasında ağacdan oyulmuş qəliblərdən istifadə olunur.', status: 'Doğrudur' },
      { text: 'Kəlağayının rəngi yaş və mərasim xüsusiyyətlərinə görə fərqlənmirdi.', status: 'Yanlışdır' },
      { text: 'Basqalda kəlağayıya naxış vurarkən yalnız kimyəvi boyalardan istifadə edilir.', status: 'Yanlışdır' },
      { text: 'Basqal ustalarının qədim qəliblərinin bir qismi xarici ölkələrə satılmışdır.', status: 'Ehtimaldır' },
      { text: 'Şəki kəlağayıları naxışların ölçüsünə görə Basqal kəlağayılarından bir qədər seçilirdi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansı suala cavab vermək mümkün deyil?',
      items: [
        { text: 'Kəlağayının rənglənməsində hansı bitki qabıqlarından istifadə edildiyinə', cant: false },
        { text: 'Kəlağayıda neçə ədəd ağac qəlibin birgə işlədildiyinə', cant: true },
        { text: 'Kəlağayı sənətinin YUNESKO siyahısına nə vaxt daxil edildiyinə', cant: false },
        { text: 'Azərbaycanda bu sənətin əsasən hansı bölgələrdə hazırlandığına', cant: false },
        { text: 'İlk kəlağayı emalatxanasının Basqalda neçənci əsrdə açıldığına', cant: true },
      ],
      note: 'Число используемых штампов на одном платке (2) и век основания первой мастерской (5) в тексте не названы.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin mətndəki mənasını yazın:<br>▲ <b>hopmasın</b><br>■ <b>aşılayır</b>',
        answer: '▲ parçanın içinə keçməsin, yayılmasın (daxil olmasın);<br>■ təlqin edir, oyadır, ifadə edir.',
        rubric: '2 балла — оба значения даны точно; 1 балл — 1 слово; 0 баллов — неверно.',
        explanation: 'Контекст технологии батика и символики уточняет оба глагола.',
      },
      {
        kind: 'edit',
        stem: 'Mətndə məntiqi uyğunsuzluğu olan seçilmiş cümləni mətnin məzmununa görə düzəldib yazın (naxışlar üçün ədviyyat yox, nədən istifadə edilirdi?):<br><i>«Qədimdə bəzi ustalar naxışların daha möhkəm qalması üçün parçaya müxtəlif ədviyyat növləri də əlavə edirdilər.»</i>',
        answer: 'Qədimdə ustalar rənglərin və naxışların daha möhkəm qalması üçün təbii bitki cövhərlərindən və mum üsulundan istifadə edirdilər.',
        rubric: '2 балла — логическая ошибка («ədviyyat» — специи вместо растительных красителей/воска) устранена со ссылкой на текст; 1 балл — частичное исправление; 0 баллов — не исправлено.',
        explanation: 'В предыдущем абзаце указаны растительные красители и горячий воск, а не пищевые специи («ədviyyat»).',
      },
      {
        kind: 'fill',
        stem: 'Son cümləni tamamlayın:<br><i>«...kəlağayı təkcə (1) ................ deyil, həm də (2) ................ daşıyıcısıdır.»</i>',
        answer: '(1) adi baş örtüyü / geyim elementi; (2) zəngin mədəni irsin və rəmzlərin.',
        rubric: '2 балла — оба пропуска раскрывают переход от бытового предмета к культурному символу; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Вывод текста: келагаи — не просто головной убор, а носитель культурных традиций и символов.',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>«Material / Vasitə — Məqsəd»</b> cədvəlini tamamlayın:<br>1) Bitki boyaları (soğan, nar qabığı) → ?<br>2) Qaynar mum → ?',
        answer: '1) <b>Məqsəd:</b> İpək parçanı təbii və zərif rənglərə boyamaq.<br>2) <b>Məqsəd:</b> Qəliblə vurulan naxış hissələrinə boyanın hopmasının qarşısını almaq.',
        rubric: '2 балла — оба элемента заполнены по тексту; 1 балл — 1 элемент; 0 баллов — неверно.',
        explanation: 'Во втором абзаце чётко описано назначение красителей и горячего воска.',
      },
      {
        kind: 'argument',
        stem: '«Kəlağayı sənəti Azərbaycan xalqının həm bədii zövqünü, həm də təbiətlə bağlılığını göstərir» fikrini mətnlə əsaslandırın.',
        answer: 'Təbiətlə bağlılıq baramadan alınan təbii ipək, soğan/nar qabığı və zirinc köklərindən hazırlanan bitki boyalarında özünü göstərir; bədii zövq isə ağac qəliblərlə vurulan buta, şahbuta naxışlarında və rənglərin mənalı seçimində əks olunur.',
        rubric: '2 балла — раскрыты оба аспекта (связь с природой и художественный вкус) на фактах текста; 1 балл — 1 аспект; 0 баллов — неверно.',
        explanation: 'Природные материалы и орнамент «бута» доказывают обе части тезиса.',
      },
    ],
  },
];
