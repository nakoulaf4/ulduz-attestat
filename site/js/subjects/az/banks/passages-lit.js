// 5 original literary/historical passages (bədii mətn) for `az.reading-closed` & `az.reading-open`.

export const LITERARY_PASSAGES = [
  {
    id: 'az-lit-1',
    genre: 'literary',
    title: 'Usta Səmədin sirri',
    html: `<p>Qədim sənətkarlar məhəlləsində yaşayan Usta Səməd ömrünün altmış ilini mis qablar üzərində naxış açmağa həsr etmişdi. <span class="num">[I]</span> Onun emalatxanasında iki gənc şagird — Rəsul və Kamran çalışırdı. Rəsul iti əlli, tələskən idi; bir işi tez bitirib o birinə keçmək<sup>1</sup> istəyirdi. Kamran isə səbirli, azdanışan bir gənc idi. <span class="num">1.</span> Emalatxananın divarlarından qədim çəkiclər və naxış qələmləri asılmışdı.</p>
<p>Bir gün şəhərin baş memarı emalatxanaya gəlib bayram məclisi üçün qoşa güldan sifariş verdi. <span class="num">[II]</span> Usta Səməd sifarişi qəbul edib şagirdlərinə dedi: «Bu dəfə hərəniz bir güldan hazırlayacaqsınız. Lakin bilin ki, tələsən əl ▲ <b>çiy</b> iş görər». <span class="num">2.</span> Hər iki şagird həmin axşamdan işə başladı.</p>
<p>Rəsul cəmi üç günə güldanı tamamlayıb ustasının qarşısına qoydu. Naxışlar uzaqdan parlaq görünsə də, yaxından baxanda xətlərin əyri-üyrü olduğu seçilirdi. <span class="num">[III]</span> Kamran isə bir həftə gecə-gündüz çalışdı, hər xətti ölçüb-biçdi, bəzən bir yarpaq təsvirini bəyənməyib yenidən düzəltdi. <span class="num">3.</span> O, günlərlə emalatxanadan bayıra çıxmadı. Səkkizinci gün Kamran öz işini gətirdi: güldanın üzərindəki nar çiçəkləri sanki canlı idi, gün işığında ■ <b>bərq</b> vururdu.</p>
<p><span class="mark">Usta Səməd hər iki güldanı əlinə alıb səssizcə baxdı.</span> <span class="num">[IV]</span> O, Rəsulun üzünə baxıb mülayim səslə dedi: «Sən vaxtı qazandın, amma sənəti itirdin. <span class="num">4.</span> İnsan yaşlandıqca əllərinin gücü azalır, lakin gözlərinin nuru əsərdə qalır. Sənin işində sürət var, Kamranın işində isə ● <b>nəfəs</b> var». <span class="num">5.</span> Rəsul başını aşağı salıb səhvini anladı, çünki memar da məhz Kamranın hazırladığı güldanı bəyənib məclisin mərkəzinə qoydu. Beləliklə, gənclər ömürlük bir dərs aldılar: sənətkarlıq həm (1) ................, həm də (2) ................ tələb edir. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Onun əlindən çıxan hər bir qab sanki tarixdən xəbər verən sənət əsəri idi.',
      correctSlot: 'I',
      note: 'Вводное предложение логично продолжает представление мастера Сямяда сразу после первого предложения в рамке [I].',
    },
    removable: {
      ok: [1, 3],
      bad: [2, 4, 5],
      note: 'Предложения 1 (описание стен мастерской) и 3 (деталь о том, что Кямран не выходил из мастерской) носят описательный характер и не нарушают логику сюжета. Удаление 2, 4 или 5 разрушает связность повествования.',
    },
    polysemy: {
      targetWord: 'keçmək',
      meaning1: 'bir işdən başqasına başlamaq (переходить к другому делу)',
      exOk: '1 – Müəllim növbəti mövzuya <u>keçməzdən</u> əvvəl sualları cavablandırdı.',
      exWrong: [
        '1 – Qoşunlar gecə yarısı dağ aşırımından <u>keçdilər</u>.',
        '1 – Vaxt çox tez <u>keçir</u>, artıq axşam düşür.',
        '1 – İşıqfor yaşıl yananda piyadalar yolu <u>keçdilər</u>.',
        '1 – Xəstəliyi yüngül <u>keçdiyi</u> üçün tez sağaldı.',
      ],
      note: 'В тексте «bir işi tez bitirib o birinə keçmək» означает «перейти к следующему делу/этапу», как и в «növbəti mövzuya keçməzdən əvvəl».',
    },
    truthPool: [
      { text: 'Rəsul işini Kamrandan daha tez başa çatdırmışdı.', status: 'Doğrudur' },
      { text: 'Baş memar məclis üçün iki güldan sifariş etmişdi.', status: 'Doğrudur' },
      { text: 'Kamran güldanın üzərində heyvan motivləri çəkmişdi.', status: 'Yanlışdır' },
      { text: 'Usta Səməd Rəsulun işini daha yüksək qiymətləndirdi.', status: 'Yanlışdır' },
      { text: 'Kamran əvvəllər başqa bir şəhərdə memarlıq öyrənmişdi.', status: 'Ehtimaldır' },
      { text: 'Memar əvvəllər də Usta Səmədən sifarişlər almışdı.', status: 'Ehtimaldır' },
      { text: 'Rəsul sonradan səbirli olmağa çalışaraq yaxşı sənətkar oldu.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansıların səbəbini müəyyən etmək mümkün deyil?',
      items: [
        { text: 'Baş memarın güldanları məhz bayram məclisi üçün sifariş etməsinin', cant: true },
        { text: 'Rəsulun hazırladığı güldanda xətlərin əyri-üyrü alınmasının', cant: false },
        { text: 'Kamranın güldanı səkkiz günə tamamlamasının', cant: false },
        { text: 'Rəsulun gənclikdə tələskən xasiyyətə malik olmasının', cant: true },
        { text: 'Memarın Kamranın güldanını seçməsinin', cant: false },
      ],
      note: 'Почему мемар заказал кувшины именно для праздничного собрания (1) и почему у Расула сформировался торопливый характер (4), из текста не выясняется.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'Mətndə əvvəlində işarə qoyulmuş sözlərin kontekstə görə qarşılığını (mənasını) yazın:<br>▲ <b>çiy</b><br>■ <b>bərq (vurmaq)</b><br>● <b>nəfəs</b>',
        answer: '▲ yarımçıq, keyfiyyətsiz, tələsik işlənmiş;<br>■ parıltı, işıq saçmaq, parıldamaq;<br>● ruh, canlılıq, sənətkarlıq duyğusu.',
        rubric: '2 балла — верно определено контекстное значение всех 3 слов; 1 балл — верно для 2 слов; 0 баллов — 0–1 слово.',
        explanation: 'В данном художественном контексте «çiy iş» означает «сырая, недоработанная, небрежная работа»; «bərq vurmaq» — «сиять, блестеть»; «nəfəs» — «жизнь, душа, вдохновение мастера».',
      },
      {
        kind: 'enrich',
        stem: 'Mətndə seçilmiş cümləni mətnin üslubi xüsusiyyətlərinə uyğun məcazi ifadələrlə zənginləşdirərək yenidən yazın:<br><i>«Usta Səməd hər iki güldanı əlinə alıb səssizcə baxdı.»</i>',
        answer: 'Usta Səməd hər iki güldanı əlinə alıb müdrik nəzərlərlə süzdü, sanki misin qəlbindəki sirri oxuyurmuş kimi dərin sükuta daldı.',
        rubric: '2 балла — смысл сохранён, добавлены уместные метафоры/эпитеты/сравнения, грамматика и орфография верны; 1 балл — слабое обогащение или 1–2 речевые погрешности; 0 баллов — смысл искажён или образных средств нет.',
        explanation: 'Для обогащения предложения используются образные глаголы и метафоры (например, «nəzərlərlə süzdü», «sükuta daldı», «əsərin ruhunu duydu»).',
      },
      {
        kind: 'fill',
        stem: 'Mətndə nöqtələrin yerinə məzmuna uyğun ifadələr yazmaqla son cümləni tamamlayın:<br><i>«...sənətkarlıq həm (1) ................, həm də (2) ................ tələb edir.»</i>',
        answer: '(1) böyük səbir / zəhmət və diqqət; (2) ustalıq / işinə sevgi və dəqiqlik.',
        rubric: '2 балла — оба пропуска заполнены логически и стилистически точно по идее рассказа; 1 балл — верно заполнен только 1 пропуск; 0 баллов — неверно.',
        explanation: 'Главная идея противопоставления Расула и Кямрана — необходимость терпения (səbir) и точности/любви к делу (dəqiqlik, zəhmət).',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>Kamran</b> obrazının 2 xarakterik xüsusiyyətini və onların əsaslandırılmasını yazın.',
        answer: '1. <b>Səbirli və təmkinlidir:</b> Güldanı tələsmədən səkkiz günə, hər xətti ölçüb-biçərək hazırlayır.<br>2. <b>İşinə məsuliyyətli və tələbkardır:</b> Bəyənmədiyi yarpaq təsvirini yenidən düzəldir, mükəmməl nəticə əldə edənə qədər çalışır.',
        rubric: '2 балла — указаны 2 верные черты характера с опорой на конкретные факты текста; 1 балл — 1 черта с обоснованием или 2 черты без опоры на текст; 0 баллов — неверно.',
        explanation: 'Образ Кямрана раскрывается через его терпение и требовательность к качеству своей работы.',
      },
      {
        kind: 'proverb',
        stem: '«Tələsən təndirə düşər» atalar sözünü mətndəki iki fərqli məqamla əlaqələndirib fikrinizi yazın.',
        answer: '1. Rəsulun tələskənliyi üzündən güldandakı naxışlar əyri-üyrü alınır və ustası işi «çiy» adlandırır.<br>2. Tələsən Rəsulun deyil, səbirlə çalışan Kamranın güldanı memar tərəfindən seçilib məclisin mərkəzinə qoyulur.',
        rubric: '2 балла — приведены 2 конкретных эпизода текста, логично связанные с пословицей; 1 балл — только 1 эпизод; 0 баллов — связь не раскрыта.',
        explanation: 'Пословица о вреде поспешности подтверждается браком в работе Расула и победой терпеливого Кямрана.',
      },
    ],
  },

  {
    id: 'az-lit-2',
    genre: 'literary',
    title: 'Gülüstan qalasının keşikçisi',
    html: `<p>Payızın sərin axşamında Şirvan dağlarının qoynundakı Gülüstan qalasında sakitlik hökm sürürdü. <span class="num">[I]</span> Qoca keşikçi Murad dayı bürcün üstündən dərəyə boylanırdı. <span class="num">1.</span> Dərənin dibində axan çayın səsi gecənin sükutuna qarışırdı. Onun yanında gənc döyüşçü Teymur dayanmışdı.</p>
<p>Səhərə yaxın cəsuslardan xəbər gəldi ki, yadelli dəstə gizli dağ cığırı ilə qalaya yaxınlaşır. <span class="num">[II]</span> Qalada əsgərlərin sayı az idi, lakin Murad dayı heç ▲ <b>təşvişə</b> düşmədi. O, Teymura tapşırdı: «Bürcün ətrafında onlarla məşəl yandırın, qoy düşmən qalada böyük qoşun olduğunu ■ <b>zənn</b> etsin». <span class="num">2.</span> Gənc döyüşçülər dərhal əmri yerinə yetirdilər.</p>
<p>Düşmən dəstəsi dərəyə enəndə qala divarlarının işıq içində olduğunu gördü. <span class="num">[III]</span> Murad dayı əsgərlərə əmr etdi ki, qala darvazasını açmasınlar, əksinə, ucadan dəmir qalxanları bir-birinə vursunlar. <span class="num">3.</span> Teymur qocanın bu hərəkətinin səbəbini əvvəlcə anlamadı. Səs-küy dərələrdə əks-səda verdikcə sanki qalada yüzlərlə döyüşçü ● <b>səfərbər</b> olmuşdu.</p>
<p><span class="mark">Qarşı tərəfin başçısı qorxuya düşüb hücum əmrini dayandırdı.</span> <span class="num">[IV]</span> O düşündü ki, qala müdafiəçiləri pusqu qurub onları gözləyirlər. <span class="num">4.</span> Düşmən atlıları qaranlıqda iz itirməyə çalışaraq geri çəkildilər. Ertəsi gün bütün qala əhli qocanın ağlını alqışladı. <span class="num">5.</span> Səhər günəşi dağların arxasından boylananda dərədə artıq bir nəfər də yadelli qalmamışdı. Beləliklə, Murad dayının fəndi göstərdi ki, döyüşdə təkcə (1) ................ deyil, həm də (2) ................ qələbə gətirir. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Buna baxmayaraq, döyüşçülər həmişə sayıqlığı əldən vermirdilər.',
      correctSlot: 'I',
      note: 'Фраза «Несмотря на это, воины не теряли бдительности» служит логичным переходом после описания тишины в рамке [I].',
    },
    removable: {
      ok: [1, 5],
      bad: [2, 3, 4],
      note: 'Предложения 1 (звук реки) и 5 (утреннее солнце) — пейзажные детали; удаление 2, 3 или 4 нарушает логику событий.',
    },
    polysemy: {
      targetWord: 'ağlını',
      meaning1: 'zəka, düşüncə, müdriklik (ум, смекалка)',
      exOk: '1 – Çətin məqamda babamın <u>ağlı</u> və tədbiri bizi xilas etdi.',
      exWrong: [
        '1 – Uşaq əvvəllər heç kəsin sözünə baxmırdı, indi bir az <u>ağıllanıb</u>.',
        '1 – İsti havada bütün gün <u>ağlım</u> başımda deyildi.',
        '1 – Bu sözlər heç <u>ağlıma</u> da gəlməzdi.',
        '1 – Qonşumuz <u>ağıllı</u> bir it saxlayırdı.',
      ],
      note: 'В тексте «qocanın ağlı» — «мудрость/смекалка старика», что точно совпадает со значением в «babamın ağlı və tədbiri».',
    },
    truthPool: [
      { text: 'Qalada əsgərlərin sayı düşməndən çox deyildi.', status: 'Doğrudur' },
      { text: 'Murad dayı düşməni aldatmaq üçün məşəllərdən və səsdən istifadə etdi.', status: 'Doğrudur' },
      { text: 'Düşmən qala darvazasını sındırıb içəri daxil ola bildi.', status: 'Yanlışdır' },
      { text: 'Teymur əvvəldən Murad dayının planını bütün incəlikləri ilə bilirdi.', status: 'Yanlışdır' },
      { text: 'Düşmən başçısı əvvəllər də bu qalaya hücum etmişdi.', status: 'Ehtimaldır' },
      { text: 'Murad dayı gəncliyində bir çox döyüşlərdə iştirak etmişdi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansıların səbəbini müəyyən etmək mümkün deyil?',
      items: [
        { text: 'Yadelli dəstənin məhz Gülüstan qalasına hücum etmək istəməsinin', cant: true },
        { text: 'Düşmən başçısının hücumu dayandırmasının', cant: false },
        { text: 'Qalada çoxlu məşəl yandırılmasının', cant: false },
        { text: 'Murad dayının qalada az əsgər qalmasının', cant: true },
        { text: 'Dərədə güclü əks-səda yaranmasının', cant: false },
      ],
      note: 'Причина похода неприятеля именно на Гюлистан (1) и причина малочисленности гарнизона (4) в тексте не указаны.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'Mətndə işarələnmiş sözlərin kontekstə görə mənasını yazın:<br>▲ <b>təşviş</b><br>■ <b>zənn etmək</b><br>● <b>səfərbər olmaq</b>',
        answer: '▲ həyəcan, qorxu, təlaş;<br>■ güman etmək, düşünmək, sanmaq;<br>● döyüşə hazır vəziyyətə gətirilmək, toplanmaq.',
        rubric: '2 балла — верно определены все 3 слова; 1 балл — 2 слова; 0 баллов — 0–1 слово.',
        explanation: 'Контекстные синонимы: təşviş — тревога/паника; zənn etmək — полагать; səfərbər olmaq — быть приведённым в боевую готовность.',
      },
      {
        kind: 'enrich',
        stem: 'Verilmiş cümləni məcazi mənalı ifadələrlə zənginləşdirərək yenidən yazın:<br><i>«Qarşı tərəfin başçısı qorxuya düşüb hücum əmrini dayandırdı.»</i>',
        answer: 'Qarşı tərəfin başçısının ürəyinə vəlvələ düşdü, gözlərini qorxu bürüdüyü üçün hücum əmrini dayandırmağa məcbur oldu.',
        rubric: '2 балла — смысл сохранён, добавлены уместные образные выражения, текст грамотен; 1 балл — слабое обогащение; 0 баллов — без образных средств.',
        explanation: 'Используем фразеологизмы/метафоры («ürəyinə vəlvələ düşdü», «gözlərini qorxu bürüdü»).',
      },
      {
        kind: 'fill',
        stem: 'Son cümlədəki nöqtələrin yerinə məzmuna uyğun sözlər yazın:<br><i>«...döyüşdə təkcə (1) ................ deyil, həm də (2) ................ qələbə gətirir.»</i>',
        answer: '(1) say çoxluğu / qüvvə (silah); (2) ağıl və tədbir / müdriklik (hiylə).',
        rubric: '2 балла — оба пропуска точно отражают противопоставление силы и ума; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Защитников было мало, но смекалка Мурада принесла победу: значит, побеждает не только сила/численность, но и ум.',
      },
      {
        kind: 'table',
        stem: 'Mətnə əsasən <b>Murad dayı</b> obrazının 2 xüsusiyyətini və əsaslandırmasını yazın.',
        answer: '1. <b>Soyuqqanlı və cəsurdur:</b> Düşmən yaxınlaşanda əsgərlərin az olmasına baxmayaraq təşvişə düşmür.<br>2. <b>Tədbirli və ağıllıdır:</b> Məşəllər və qalxan səsi ilə düşməndə böyük qoşun təəssüratı yaradır.',
        rubric: '2 балла — 2 черты с точным обоснованием из текста; 1 балл — 1 черта с обоснованием; 0 баллов — неверно.',
        explanation: 'Хладнокровие и расчётливость Мурада подтверждаются его действиями во время осады.',
      },
      {
        kind: 'proverb',
        stem: '«Güc birlikdə deyil, tədbirdədir» fikrini mətndəki iki məqamla əlaqələndirib yazın.',
        answer: '1. Azsaylı qala müdafiəçiləri açıq döyüşə girmədən məşəllərlə düşməni çaşdırırlar.<br>2. Qalxanların səs-küyü sayəsində düşmən tələyə düşəcəyindən qorxub döyüşsüz geri çəkilir.',
        rubric: '2 балла — 2 чётких эпизода из текста; 1 балл — 1 эпизод; 0 баллов — без опоры на текст.',
        explanation: 'Два тактических приёма (факелы и звон щитов) позволили победить без численного перевеса.',
      },
    ],
  },

  {
    id: 'az-lit-3',
    genre: 'literary',
    title: 'Şuşada bir səhər',
    html: `<p>İyirmi yaşlı xanəndə Əli Şuşanın məşhur musiqi məclisində ilk dəfə çıxış etməyə hazırlaşırdı. <span class="num">[I]</span> Onun səsi gur və zil idi, buna görə də hamı gəncdən böyük uğur gözləyirdi. <span class="num">1.</span> Şəhərin bağçalarında bənövşələr yeni-yeni çiçək açmışdı. Əli isə ustadı Cabbar əminin məsləhətini unutmurdu: «Səs qızıl kimidir, amma ▲ <b>məna</b> olmasa, parıltısı tez sönər».</p>
<p>Məclis başlananda birinci olaraq qocaman bir tarzən səhnəyə çıxdı. <span class="num">[II]</span> Ardınca Əli oxumağa başladı. O, bütün gücünü toplayıb ən uca pərdələri səsləndirdi, dinləyicilər onu alqışladılar. <span class="num">2.</span> Lakin Əli ustadının üzünə baxanda onun gözündə sevinclə yanaşı, bir az da ■ <b>narazılıq</b> gördü.</p>
<p>Fasilədə Əli ustadına yaxınlaşıb səbəbini soruşdu. <span class="num">[III]</span> Cabbar əmi gülümsəyib dedi: «Oğlum, səsin dağ şəlaləsi kimi gur axır, amma sözlərin ● <b>dərdini</b> hiss etdirmirsən. <span class="num">3.</span> Salondakı pəncərələr açıq idi, sərin meh pərdələri tərpədirdi. Şeiri sadəcə zil səslə oxumaq kifayət deyil, gərək hər misranı ürəyindən keçirəsən». <span class="num">4.</span> Əli ustadının sözlərini dinlədikdən sonra bir kənara çəkilib gözlərini yumdu və oxuyacağı qəzəlin hər kəlməsini dərindən düşündü.</p>
<p><span class="mark">İkinci hissədə Əli səhnəyə çıxanda səsi əvvəlki kimi gur deyildi, lakin dinləyicilər nəfəslərini tutub onu dinlədilər.</span> <span class="num">[IV]</span> Bu dəfə onun avazında həm sevinc, həm də həsrət var idi. <span class="num">5.</span> Məclisin sonunda Cabbar əmi gəncin çiyninə əlini qoyub dedi: «Bax, indi sən əsl xanəndə oldun!» Həmin gün Əli anladı ki, sənətdə dinləyicinin qəlbinə yol tapmaq üçün təkcə (1) ................ deyil, həm də (2) ................ lazımdır. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Çünki Şuşa dinləyicisi təkcə səs gücünü deyil, muğamın ruhunu da yaxşı bilirdi.',
      correctSlot: 'II',
      note: 'Пояснение о требовательности шушинских слушателей уместно перед началом выступления во втором абзаце [II].',
    },
    removable: {
      ok: [1, 3],
      bad: [2, 4, 5],
      note: 'Предложения 1 (фиалки в садах) и 3 (открытые окна) — фоновые детали; 2, 4 и 5 двигают сюжет к развязке.',
    },
    polysemy: {
      targetWord: 'gur',
      meaning1: 'ucadan, güclü və aydın eşidilən (громкий, звонкий)',
      exOk: '1 – İclas zalında natiqin <u>gur</u> səsi hər tərəfdən aydın eşidilirdi.',
      exWrong: [
        '1 – Yazda dağ çayları <u>gur</u> axaraq vadini suvarır.',
        '1 – Bayram axşamı küçələrdə <u>gur</u> işıqlar yanırdı.',
        '1 – Sobadakı od <u>gur</u> alovla otağı isidirdi.',
        '1 – Bazar günü şəhər meydanında <u>gur</u> ticarət gedirdi.',
      ],
      note: 'В тексте «səsi gur idi» (звонкий, мощный голос) соответствует «natiqin gur səsi».',
    },
    truthPool: [
      { text: 'Əli məclisin birinci hissəsində dinləyicilər tərəfindən alqışlanmışdı.', status: 'Doğrudur' },
      { text: 'Cabbar əmi gənc xanəndəyə yalnız səs gücünün yetərli olmadığını başa saldı.', status: 'Doğrudur' },
      { text: 'Əli məclisin ikinci hissəsində səhnəyə çıxmaqdan imtina etdi.', status: 'Yanlışdır' },
      { text: 'Cabbar əmi birinci çıxışdan tamamilə razı qalmışdı.', status: 'Yanlışdır' },
      { text: 'Əli əvvəllər də başqa şəhərlərdə konsertlər vermişdi.', status: 'Ehtimaldır' },
      { text: 'Dinləyicilər arasında şəhərin tanınmış şairləri də var idi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansıların səbəbini müəyyən etmək mümkün deyil?',
      items: [
        { text: 'Şuşada məhz həmin gün musiqi məclisinin təşkil olunmasının', cant: true },
        { text: 'Cabbar əminin birinci çıxışdan narazı qalmasının', cant: false },
        { text: 'İkinci çıxış zamanı dinləyicilərin diqqətlə qulaq asmasının', cant: false },
        { text: 'Əlinin məhz Cabbar əminin yanında dərs almasının', cant: true },
        { text: 'Əlinin fasilədə kənara çəkilib düşünməsinin', cant: false },
      ],
      note: 'Повод организации собрания (1) и причина обучения именно у Джаббар-ами (4) в тексте не раскрыты.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'Mətndə işarələnmiş sözlərin kontekstdə ifadə etdiyi mənanı yazın:<br>▲ <b>məna</b><br>■ <b>narazılıq</b><br>● <b>dərd</b>',
        answer: '▲ dərin məzmun, hiss və düşüncə;<br>■ bəyənməmə, qane olmama hissi;<br>● kədər, hiss-həyəcan, əsərin əsas duyğusu.',
        rubric: '2 балла — все 3 слова растолкованы точно по контексту; 1 балл — 2 слова; 0 баллов — 0–1.',
        explanation: 'Слова раскрываются через контекст исполнения мугама: məna (содержательность), narazılıq (неудовлетворённость), dərd (глубокое чувство/переживание).',
      },
      {
        kind: 'enrich',
        stem: 'Verilmiş cümləni məcazi ifadələrlə zənginləşdirin:<br><i>«İkinci hissədə Əli səhnəyə çıxanda səsi əvvəlki kimi gur deyildi, lakin dinləyicilər nəfəslərini tutub onu dinlədilər.»</i>',
        answer: 'İkinci hissədə Əli səhnəyə çıxanda səsi əvvəlki kimi gur səslənməsə də, avazı ürəklərin tellərinə toxundu və dinləyicilər sanki sehrlənmiş kimi nəfəslərini tutub onu dinlədilər.',
        rubric: '2 балла — добавлены образные выражения без искажения смысла; 1 балл — 1 слабое выражение или неточность; 0 баллов — не выполнено.',
        explanation: 'Образное обогащение строится на метафорах музыки («ürəklərin tellərinə toxundu», «sehrlənmiş kimi»).',
      },
      {
        kind: 'fill',
        stem: 'Son cümlədəki boşluqları mətnə uyğun tamamlayın:<br><i>«...təkcə (1) ................ deyil, həm də (2) ................ lazımdır.»</i>',
        answer: '(1) güclü / gur səs (texnika); (2) hiss və məna / ürəkdən oxumaq.',
        rubric: '2 балла — точно передана дилемма «техника голоса vs чувство/смысл»; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Певец понял, что одного сильного голоса недостаточно без глубокого переживания смысла газели.',
      },
      {
        kind: 'table',
        stem: '<b>Cabbar əmi</b> obrazının 2 xüsusiyyətini və əsaslandırılmasını yazın.',
        answer: '1. <b>Tələbkar və prinsipialdır:</b> Şagirdi alqışlansa da, sənətdəki çatışmazlığı (sözün duyulmamasını) gizlətmir.<br>2. <b>Qayğıkeş və müdrik ustaddır:</b> Əlini ruhdan salmır, düzgün yol göstərir və sonda uğurunu təbrik edir.',
        rubric: '2 балла — 2 верные черты с фактами из текста; 1 балл — 1 черта; 0 баллов — неверно.',
        explanation: 'Мудрость и требовательность учителя проявляются в его мягкой критике и поддержке.',
      },
      {
        kind: 'proverb',
        stem: '«Ürəkdən gələn söz ürəyə yol tapar» fikrini mətndəki iki məqamla əlaqələndirin.',
        answer: '1. Əli birinci dəfə yalnız zil səslə oxuduğu üçün ustadının bəyənisini qazana bilmir.<br>2. İkinci dəfə qəzəlin mənasını ürəyindən keçirib oxuyanda bütün salon nəfəsini tutub onu dinləyir.',
        rubric: '2 балла — 2 контрастных эпизода из текста; 1 балл — 1 эпизод; 0 баллов — неверно.',
        explanation: 'Сравнение первого (формального) и второго (душевного) выступлений напрямую доказывает тезис.',
      },
    ],
  },

  {
    id: 'az-lit-4',
    genre: 'literary',
    title: 'Kərpicçi Əhməd',
    html: `<p>Şirvan kəndlərindən birində yaşayan bənna Əhməd kişi dağ çayının üstündə daş körpü tikirdi. <span class="num">[I]</span> Yay istisinə baxmayaraq, o, hər daşı əl ilə yonur, əhənglə möhkəm bərkidirdi. <span class="num">1.</span> Çayın kənarında uca çinar ağacları bitmişdi. Kəndin bəzi cavanları onun bu qədər diqqətli olmasına təəccüblənirdilər.</p>
<p>Bir gün qonşu kənddən gələn tacir işə baxıb ▲ <b>istehza</b> ilə dedi: «Ay usta, sən ki bu körpüdən ömrün boyu cəmi bir neçə dəfə keçəcəksən, niyə özünü bu qədər yorursan? Sadə bir taxta körpü də bəs edərdi». <span class="num">[II]</span> Əhməd kişi alnının tərini silib gülümsədi, amma işini saxlamadı. <span class="num">2.</span> O, əlindəki kərpici yerinə qoyduqdan sonra tacirə tərəf döndü.</p>
<p>«Mən bu körpünü təkcə özüm üçün tikmirəm, — dedi qoca, — məndən sonra buradan nəvələrim, yolçular, karvanlar keçəcək. <span class="num">[III]</span> Taxta körpü ilk seldə ■ <b>dağılar</b>, amma möhkəm daş körpü yüz illər boyu insanlara xidmət edər». <span class="num">3.</span> Tacirin atı yaxınlıqdakı otluqda otlayırdı. Tacir bu sözlərin qarşısında susdu, çünki qocanın niyyəti öz ● <b>mənfəətindən</b> çox, gələcək nəsilləri düşünmək idi. <span class="num">4.</span></p>
<p><span class="mark">Payızda güclü yağışlar yağdı və dağ çayı kükrəyib daşdı.</span> <span class="num">[IV]</span> Ətrafdakı köhnə taxta keçidlərin hamısını su apardı. <span class="num">5.</span> Kəndlilər yalnız Əhməd kişinin tikdiyi daş körpüdən keçərək şəhərlə əlaqəni qoruya bildilər. Həmin tacir də növbəti səfərində bu möhkəm körpünün üstündən keçəndə anladı ki, əsl zəhmət (1) ................ deyil, (2) ................ üçündür. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Onun fikrincə, işin keyfiyyəti təkcə bu gün üçün yox, sabah üçün də ölçülürdü.',
      correctSlot: 'I',
      note: 'Фраза о качестве работы для будущего органично дополняет первый абзац перед вопросами односельчан [I].',
    },
    removable: {
      ok: [1, 3],
      bad: [2, 4, 5],
      note: 'Предложения 1 (чинары у реки) и 3 (пасущийся конь купца) не влияют на сюжет; 2, 4 и 5 необходимы для связности.',
    },
    polysemy: {
      targetWord: 'tikirdi',
      meaning1: 'inşa etmək, ucaltmaq (строить, возводить)',
      exOk: '1 – Şəhərin mərkəzində uşaqlar üçün yeni məktəb binası <u>tikirlər</u>.',
      exWrong: [
        '1 – Dərzi bayram üçün təzə paltar <u>tikirdi</u>.',
        '1 – Qız gözünü uzaqlara <u>tikib</u> yol gözləyirdi.',
        '1 – Ana uşağın cırılmış köynəyini <u>tikdi</u>.',
        '1 – Qəssab əti xırda-xırda <u>tikələdi</u>.',
      ],
      note: '«Körpü tikmək» означает «строить сооружение», как и «məktəb binası tikirlər» (а не «шить одежду» или «пристально смотреть»).',
    },
    truthPool: [
      { text: 'Əhməd kişi körpünü yay mövsümündə tikirdi.', status: 'Doğrudur' },
      { text: 'Payız seli ətrafdakı taxta keçidləri dağıtdı.', status: 'Doğrudur' },
      { text: 'Tacir əvvəldən daş körpü tikilməsinin tərəfdarı idi.', status: 'Yanlışdır' },
      { text: 'Daş körpü güclü payız daşqınına tab gətirmədi.', status: 'Yanlışdır' },
      { text: 'Əhməd kişi gəncliyində başqa kəndlərdə də körpülər tikmişdi.', status: 'Ehtimaldır' },
      { text: 'Tacir sonradan Əhməd kişiyə təşəkkür etmək üçün ona hədiyyə gətirdi.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansıların səbəbini müəyyən etmək mümkün deyil?',
      items: [
        { text: 'Tacirin qonşu kənddən məhz həmin gün gəlməsinin', cant: true },
        { text: 'Əhməd kişinin taxta yox, daş körpü tikməsinin', cant: false },
        { text: 'Taxta keçidlərin payızda məhv olmasının', cant: false },
        { text: 'Kənd cavanlarının təmir işlərində iştirak etməməsinin', cant: true },
        { text: 'Tacirin qocanın sözləri qarşısında susmasının', cant: false },
      ],
      note: 'Почему купец приехал именно в тот день (1) и почему молодые не помогали (4), в тексте не объясняется.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin kontekstə görə qarşılığını yazın:<br>▲ <b>istehza</b><br>■ <b>dağılmaq</b><br>● <b>mənfəət</b>',
        answer: '▲ rişxənd, lağ, kinayə;<br>■ məhv olmaq, uçub-sökülmək;<br>● şəxsi qazanc, xeyir, fayda.',
        rubric: '2 балла — все 3 значения верны; 1 балл — 2 слова; 0 баллов — 0–1.',
        explanation: 'Контекстные значения: istehza — насмешка/ирония; dağılmaq — разрушиться; mənfəət — личная выгода.',
      },
      {
        kind: 'enrich',
        stem: 'Seçilmiş cümləni bədii təsvir vasitələri ilə zənginləşdirin:<br><i>«Payızda güclü yağışlar yağdı və dağ çayı kükrəyib daşdı.»</i>',
        answer: 'Payızın qara buludları göy üzünü bürüdükcə leysan yağışlar torpağı döyəclədi və dağ çayı azğın aslan kimi kükrəyib sahillərindən aşdı.',
        rubric: '2 балла — добавлены яркие метафоры/сравнения, сохранена идея; 1 балл — слабое расширение; 0 баллов — нет образности.',
        explanation: 'Метафорическое усиление образа стихии подчёркивает прочность каменного моста.',
      },
      {
        kind: 'fill',
        stem: 'Son cümlədəki nöqtələrin yerinə uyğun fikirlər yazın:<br><i>«...əsl zəhmət (1) ................ deyil, (2) ................ üçündür.»</i>',
        answer: '(1) bir gün / yalnız öz şəxsi mənfəətin; (2) əbədilik / gələcək nəsillərin faydası.',
        rubric: '2 балла — противопоставлены личная/временная выгода и польза для будущих поколений; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Урок рассказа: настоящий труд создаётся на века ради людей, а не ради минутной выгоды.',
      },
      {
        kind: 'table',
        stem: '<b>Əhməd kişi</b> obrazı ilə bağlı 2 xüsusiyyət və əsaslandırma yazın.',
        answer: '1. <b>Uzaqgörən və xeyirxahdır:</b> Özündən sonra gələn nəsillərin və yolçuların rahatlığını düşünərək daş körpü tikir.<br>2. <b>Zəhmətkeş və məsuliyyətlidir:</b> İstiyə baxmayaraq hər daşı əl ilə yonub möhkəm bərkidir.',
        rubric: '2 балла — 2 черты с конкретной аргументацией; 1 балл — 1 черта; 0 баллов — неверно.',
        explanation: 'Трудолюбие и забота о будущем — ключевые черты мастера Ахмеда.',
      },
      {
        kind: 'proverb',
        stem: '«Yaxşılıq elə, at dəryaya, balıq bilməsə də, xaliq bilər» və ya «Əməyin bəhrəsi qalar» fikrini mətnin 2 məqamı ilə əlaqələndirin.',
        answer: '1. Əhməd kişi təmənnasız olaraq bütün kənd və gələcək karvanlar üçün möhkəm daş körpü ucaldır.<br>2. Payız seli zamanı bütün taxta körpülər uçsa da, onun zəhmətinin bəhrəsi olan daş körpü insanları çətin vəziyyətdən xilas edir.',
        rubric: '2 балла — раскрыты оба момента (бескорыстный труд и спасение людей во время паводка); 1 балл — 1 момент; 0 баллов — неверно.',
        explanation: 'Два эпизода связывают замысел мастера и практический результат во время наводнения.',
      },
    ],
  },

  {
    id: 'az-lit-5',
    genre: 'literary',
    title: 'İpək karvanı',
    html: `<p>Dekabrın şaxtalı günlərindən birində Şəkidən çıxan ipək karvanı uca dağ aşırımına yaxınlaşırdı. <span class="num">[I]</span> Karvanbaşı Qasım kişi əlli ilin təcrübəli yolçusu idi. <span class="num">1.</span> Dəvələrin boynundakı zınqırovların səsi dərələrə yayılırdı. O, göyün üzünü tutan boz buludlara baxıb gənc köməkçisi Aslana xəbərdarlıq etdi ki, ▲ <b>tufan</b> qopmamış sürəti artırsınlar.</p>
<p>Yolun yarısında güclü qar başladı və görünüş məsafəsi kəskin azaldı. <span class="num">[II]</span> Birdən arxadan gələn gənc tacirlərdən birinin arabası qar topasına ■ <b>batdı</b>. <span class="num">2.</span> Tacir öz yükünü xilas etmək üçün qışqırıb kömək istədi. Karvandakıların bir neçəsi «Öz başımızın çarəsinə baxaq, yol bağlanır» deyərək dayanmaq istəmədi.</p>
<p>Qasım kişi isə dərhal karvanı saxladı: «Dağ yolunda tək qalanı qoyub gedən adam axırda özü də yolda qalar». <span class="num">[III]</span> O, bütün dəvəçiləri səslədi və hamı birlikdə əl-ələ verib arabanı qardan çıxardı. <span class="num">3.</span> Köməkçisi Aslan dəmir bellə təkərlərin altını təmizləyirdi. Bu ləngiməyə görə onlar yarım saat itirdilər, lakin dərhal sonra yolun dar hissəsində qar uçqunu baş verdi. <span class="num">4.</span> Əgər karvan dayanmasaydı, həmin uçqun məhz onların üstünə düşəcəkdi.</p>
<p><span class="mark">Hamı heyrət içində bir-birinə baxdı və Qasım kişinin gözündəki sakit təbəssümü gördü.</span> <span class="num">[IV]</span> Onlar təhlükə ● <b>sovuşandan</b> sonra başqa cığırla sağ-salamat düşərgəyə çatdılar. <span class="num">5.</span> Düşərgədə isti çay süfrəsi arxasında tacir Qasım kişiyə təşəkkür etdi. Həmin gecə yolçular anladılar ki, (1) ................ göstərdiyin kömək bəzən elə (2) ................ səbəb olur. <span class="num">[V]</span></p>`,
    insertSentence: {
      quote: 'Buna görə də qarşıdakı qayalığa çatanda dayanmağa məcbur oldular.',
      correctSlot: 'IV',
      note: 'Перед тем как опасность миновала и они пошли по другой тропе, предложение объясняет их остановку у скал после лавины [IV].',
    },
    removable: {
      ok: [1, 5],
      bad: [2, 3, 4],
      note: 'Предложения 1 (звон колокольчиков) и 5 (горячий чай) — художественные штрихи; 2, 3 и 4 несут сюжетную нагрузку.',
    },
    polysemy: {
      targetWord: 'tutdu',
      meaning1: 'örtmək, qapamaq (затянуть, покрыть — о тучах)',
      exOk: '1 – Qış axşamında qalın duman bütün vadini <u>tutdu</u>.',
      exWrong: [
        '1 – Uşaq qaçan topu cəld əli ilə <u>tutdu</u>.',
        '1 – Qardaşım verdiyi sözü axıra qədər <u>tutdu</u>.',
        '1 – Bu qədim qab təxminən on litr su <u>tutur</u>.',
        '1 – Dostumun soyuq sözləri məni yaman <u>tutdu</u>.',
      ],
      note: 'В тексте «göyün üzünü tutan buludlar» («тучи, затянувшие небо») совпадает со значением «duman vadini tutdu».',
    },
    truthPool: [
      { text: 'Qasım kişi təcrübəli karvanbaşı idi.', status: 'Doğrudur' },
      { text: 'Yolçuların yardım etmək üçün dayanması onları qar uçqunundan xilas etdi.', status: 'Doğrudur' },
      { text: 'Karvandakıların hamısı dərhal tacirə kömək etməyə razılaşdı.', status: 'Yanlışdır' },
      { text: 'Karvan uçqun baş verən əsas yolla hərəkətini davam etdirdi.', status: 'Yanlışdır' },
      { text: 'Gənc tacir ilk dəfə idi ki, qış aylarında Şəkidən səfərə çıxırdı.', status: 'Ehtimaldır' },
      { text: 'Karvanın apardığı ipək xarici ölkələrdə satılacaqdı.', status: 'Ehtimaldır' },
    ],
    cantDetermine: {
      stem: 'Mətnə əsasən hansıların səbəbini müəyyən etmək mümkün deyil?',
      items: [
        { text: 'Tacirin məhz arabasının qara batmasının (təkərinin sınmasının deyil)', cant: false },
        { text: 'Karvanın niyə məhz dekabr ayında səfərə çıxmasının', cant: true },
        { text: 'Qasım kişinin təhlükəni əvvəlcədən hiss etməsinin', cant: false },
        { text: 'Tacirin karvana niyə tək qoşulmasının', cant: true },
        { text: 'Yolçuların sağ-salamat qalmasının', cant: false },
      ],
      note: 'Почему караван отправился именно в декабре (2) и почему молодой купец ехал с ними один (4), в тексте не сообщается.',
    },
    openSet: [
      {
        kind: 'words',
        stem: 'İşarələnmiş sözlərin kontekstə uyğun qarşılığını yazın:<br>▲ <b>tufan</b><br>■ <b>batmaq</b><br>● <b>sovuşmaq</b>',
        answer: '▲ çovğun, güclü qarlı külək;<br>■ ilişib qalmaq, çıxa bilməmək;<br>● keçib getmək, arxada qalmaq.',
        rubric: '2 балла — все 3 значения верны; 1 балл — 2 слова; 0 баллов — 0–1.',
        explanation: 'Контекст зимнего перевала уточняет значения: tufan (вьюга/буря), batmaq (увязнуть), sovuşmaq (миновать).',
      },
      {
        kind: 'enrich',
        stem: 'Verilmiş cümləni məcazi ifadələrlə zənginləşdirin:<br><i>«Hamı heyrət içində bir-birinə baxdı və Qasım kişinin gözündəki sakit təbəssümü gördü.»</i>',
        answer: 'Hamının dili-ağzı qurudu, donub qalmış baxışlarla bir-birinə nəzər saldılar və Qasım kişinin gözlərində parlayan sakit təbəssümü gördülər.',
        rubric: '2 балла — смысл сохранён, добавлены выразительные тропы/фразеологизмы; 1 балл — слабое обогащение; 0 баллов — не выполнено.',
        explanation: 'Для усиления эмоциональности используются образные обороты («dili-ağzı qurudu», «parlayan təbəssüm»).',
      },
      {
        kind: 'fill',
        stem: 'Son cümləni tamamlayın:<br><i>«...həmin gecə yolçular anladılar ki, (1) ................ göstərdiyin kömək bəzən elə (2) ................ səbəb olur.»</i>',
        answer: '(1) başqasına / çətin vəziyyətdə olana; (2) öz xilasına / böyük bəladan qurtulmağına.',
        rubric: '2 балла — оба пропуска точно передают мораль о взаимовыручке; 1 балл — 1 пропуск; 0 баллов — неверно.',
        explanation: 'Задержка ради помощи ближнему спасла весь караван от лавины.',
      },
      {
        kind: 'table',
        stem: '<b>Qasım kişi</b> obrazının 2 xüsusiyyətini və əsaslandırmasını yazın.',
        answer: '1. <b>Təcrübəli və diqqətlidir:</b> Buludlara baxıb qarşıdakı tufanı əvvəlcədən hiss edir.<br>2. <b>Mərhəmətli və prinsipiallıdır:</b> Bəzi yolçular etiraz etsə də, darda qalan taciri tək qoymur və hamını köməyə çağırır.',
        rubric: '2 балла — 2 черты с фактами из текста; 1 балл — 1 черта; 0 баллов — неверно.',
        explanation: 'Опыт и человечность Касым-киши проявляются в обеих критических ситуациях.',
      },
      {
        kind: 'proverb',
        stem: '«Yaxşılıq edən yaxşılıq görər» fikrini mətndəki iki əlaqəli məqamla izah edin.',
        answer: '1. Qasım kişi tufan təhlükəsinə baxmayaraq qarda batmış tacirin arabasını çıxarmaq üçün karvanı saxlayır.<br>2. Məhz bu yarım saatlıq gecikmə sayəsində qar uçqunu karvanın qarşısına düşür və bütün yolçular sağ qalırlar.',
        rubric: '2 балла — показана причинно-следственная связь между помощью и спасением; 1 балл — назван только 1 факт; 0 баллов — неверно.',
        explanation: 'Два связанных эпизода (остановка для помощи и обвал впереди) иллюстрируют пословицу.',
      },
    ],
  },
];
