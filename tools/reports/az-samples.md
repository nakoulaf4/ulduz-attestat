# Manual QA Sample: `az` (seed=202603)

## Generated Sample (25 tasks across 11 taskTypes)

### GEN #1 (seed=25084, diff=1)
- **id**: `az.syntax-sentence#25084` | **typeId**: `az.syntax-sentence` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Синтаксис
- **stem**: <p>Определите правильную последовательность пропущенных знаков препинания в предложении:</p><p><i>Dağlar meşələr çəmənlər bir sözlə bütün təbiət baharı qarşılayırdı.</i></p>
- **options**:
  - [0] A) vergül, vergül, tire, vergül  **<-- ANSWER**
  - [1] B) vergül, tire, vergül, vergül
  - [2] C) qoşa nöqtə, vergül, tire, vergül
  - [3] D) vergül, vergül, vergül, vergül
  - [4] E) vergül, vergül, qoşa nöqtə, vergül
- **answer**: `0`
- **explanation**: Правильно расставленные знаки: «<b>Dağlar, meşələr, çəmənlər – bir sözlə, bütün təbiət baharı qarşılayırdı.</b>». Последовательность: <b>vergül, vergül, tire, vergül</b>. Однородные подлежащие разделяются запятыми, перед обобщающим словом «bütün təbiət» ставится тире, после вводного «bir sözlə» — запятая.

### GEN #2 (seed=46993, diff=2)
- **id**: `az.reading-closed#46993` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Работа с текстом
- **passage** (`az-inf-2`, title: Lahıc misgərliyi): <p>Böyük Qafqaz dağlarının qoynunda yerləşən Lahıc qəsəbəsi əsrlər boyu Azərbaycanda misgərlik sənətinin əsas mərkəzlərindən biri olmuşdur. <span class="num">[I]</span> Qədim mənbələrdə buradakı ustaların hazırladığı qabların hətta Şərq bazarlarında da yüksək qiymətləndirildiyi qeyd olunur. <span class="num">1.</span> Qəsəbənin daş döşənmiş küçələri turistlərin diqqətini çəkir.</p> <p>Lahıc misgərləri adi mis lövhələri əritmə və döymə üsulu ilə sənət nümunəsinə çevirirlər. <span class="num">[II]…
- **stem**: Mətndə əvvəlində rəqəm yazılmış hansı cümlələr mətndən çıxarılsa, məzmuna və məntiqi ardıcıllığa xələl <b>gəlməz</b>?
- **options**:
  - [0] A) 3, 4
  - [1] B) 1, 2
  - [2] C) 3, 5
  - [3] D) 2, 3
  - [4] E) 1, 5  **<-- ANSWER**
- **answer**: `4`
- **explanation**: Без ущерба для логики текста можно удалить предложения <b>1, 5</b>: Предложения 1 (мощёные улицы) и 5 (кузнечное и ковровое дело) не касаются непосредственно медного ремесла; 2, 3 и 4 ключевые.

### GEN #3 (seed=30171, diff=3)
- **id**: `az.phonetics#30171` | **typeId**: `az.phonetics` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Фонетика
- **stem**: <p>Установите соответствие по фонетическим признакам пронумерованных слов в предложении:</p><p><i><u>Dünya</u><sup>1</sup> ədəbiyyatında <u>müəllim</u><sup>2</sup> obrazı <u>qiymətli</u><sup>3</sup> <u>nəticə</u><sup>4</sup> və <u>xoşbəxtlik</u><sup>5</sup> rəmzi kimi verilir.</i></p><p>I. Написание и произношение совпадают.<br>II. Число звуков меньше числа букв.<br>III. В составе нет глухих согласных.</p>
- **options**:
  - [0] A) I – 1, 3, 5; II – 4; III – 1, 2
  - [1] B) I – 1, 2, 4; II – 5; III – 1, 2  **<-- ANSWER**
  - [2] C) I – 1, 2, 3; II – 3; III – 3, 5
  - [3] D) I – 2, 4, 5; II – 5; III – 2, 3
  - [4] E) I – 1, 4, 5; II – 5; III – 2, 5
- **answer**: `1`
- **explanation**: Фонетический разбор слов:<br>1. <b>dünya</b> → [dünya]<br>2. <b>müəllim</b> → [müəllim]<br>3. <b>qiymətli</b> → [qiymətdi]<br>4. <b>nəticə</b> → [nəticə]<br>5. <b>xoşbəxtlik</b> → [xoşbəx'lix']<br>Верное соответствие: <b>I – 1, 2, 4; II – 5; III – 1, 2</b>.

### GEN #4 (seed=40954, diff=1)
- **id**: `az.stylistics#40954` | **typeId**: `az.stylistics` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Стилистика
- **stem**: <p>К какому функциональному стилю речи относится приведённый отрывок?</p><blockquote>– Ay qardaş, bu gün hava yaman sərindir, bir az tez gəl, çayımız soyuyar!</blockquote>
- **options**:
  - [0] A) elmi üslub (научный стиль)
  - [1] B) bədii üslub (художественный стиль)
  - [2] C) rəsmi-işgüzar üslub (официально-деловой стиль)
  - [3] D) publisistik üslub (публицистический стиль)
  - [4] E) məişət üslubu (разговорный стиль)  **<-- ANSWER**
- **answer**: `4`
- **explanation**: Это <b>məişət üslubu (разговорный стиль)</b>: непринуждённый диалог, разговорные обращения и частицы (Ay qardaş, yaman).

### GEN #5 (seed=20919, diff=2)
- **id**: `az.reading-open#20919` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 2 | **points**: 2 | **topic**: Работа с текстом
- **passage** (`az-inf-3`, title: Abşeronun qədim ovdanları): <p>Quraq iqlimə malik Abşeron yarımadasında əsrlər boyu su təchizatı ən vacib məsələlərdən biri olmuşdur. <span class="num">[I]</span> Çayları olmayan bu ərazidə əhali yeraltı sulardan səmərəli istifadə etmək üçün «ovdan» adlanan qədim su anbarları tikmişdir. <span class="num">1.</span> Yarımadanın küləkli havası yay aylarında ətrafı bir qədər sərinlədir.</p> <p>Ovdanlar əsasən yerin altı ilə uzanan və su mənbəyini daşıyan kəhriz sistemlərinin sonunda qurulurdu. <span class="num">[II]</span> Suy…
- **stem**: «Təbii şərait insanların mühəndislik düşüncəsini inkişaf etdirir» fikrini mətnlə əlaqələndirib izah edin.
- **answer**: `"Abşeronda çayların olmaması və quraq yay istiləri sakinləri kəhrizlər çəkməyə, əhəngdaşından yeraltı ovdanlar tikməyə və buxarlanmanı azaltmaq üçün günbəz konstruksiyasından istifadə etməyə sövq etmişdir."`
- **rubric**: 2 балла — чётко показана связь между природными условиями (засуха, отсутствие рек) и инженерными решениями (кяризы, известняк, купол); 1 балл — неполный ответ; 0 баллов — неверно.
- **explanation**: Климатический вызов стал стимулом для создания сложной системы кяризов и овданов.

### GEN #6 (seed=24753, diff=3)
- **id**: `az.lexics-idioms#24753` | **typeId**: `az.lexics-idioms` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Лексика и фразеология
- **stem**: Подберите <b>синонимичное</b> выражение к фразеологизму «<b>qulaq asmaq</b>»:
- **options**:
  - [0] A) diqqət yetirmək  **<-- ANSWER**
  - [1] B) vaz keçmək
  - [2] C) cilovunu yığışdırmaq
  - [3] D) ağıl öyrətmək
  - [4] E) nəzarət etmək
- **answer**: `0`
- **explanation**: Фразеологизм «qulaq asmaq» означает «слушать, слушаться». Его синоним — <b>diqqət yetirmək</b>.

### GEN #7 (seed=23478, diff=1)
- **id**: `az.morphology-noun-adj-num#23478` | **typeId**: `az.morphology-noun-adj-num` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Морфология
- **stem**: Какое сочетание числительного с существительным образовано <b>грамматически верно</b>?
- **options**:
  - [0] A) iki dənə ayaqqabı
  - [1] B) bir sıra məsələ
  - [2] C) onlarla insan  **<-- ANSWER**
  - [3] D) beş nəfər mal-qara
  - [4] E) bir neçə şagirdlər
- **answer**: `2`
- **explanation**: Верно: <b>onlarla insan</b> (после числительного onlarla существительное остаётся в единственном числе).

### GEN #8 (seed=804, diff=2)
- **id**: `az.syntax-phrases#804` | **typeId**: `az.syntax-phrases` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Синтаксис
- **stem**: В каком предложении подчёркнутое слово можно трактовать двояко — и как <b>обращение</b> (xitab), и как <b>подлежащее</b> (mübtəda)?
- **options**:
  - [0] A) Qardaşım, <u>Fuad</u>, dünən Bakıdan Gəncəyə yola düşüb.
  - [1] B) Məlumdur ki, <u>çalışqan</u>, bacarıqlı şagirdlər həmişə seçilirlər.
  - [2] C) <u>Tural</u>, Rəşad və Murad yarışa birlikdə hazırlaşırlar.  **<-- ANSWER**
  - [3] D) <u>Səlim</u>! Qapını bağlamağı yaddan çıxarma.
  - [4] E) İnanıram ki, <u>Nigar</u> bu tapşırığı uğurla yerinə yetirəcək.
- **answer**: `2`
- **explanation**: «Tural» допускает двоякую интонационную трактовку: однородное подлежащее или обращение.

### GEN #9 (seed=37520, diff=3)
- **id**: `az.ortho-stress#37520` | **typeId**: `az.ortho-stress` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Орфография и ударение
- **stem**: В каком слове словесное ударение (vurğu) падает на <b>первый</b> слог?
- **options**:
  - [0] A) avtobus
  - [1] B) kitabxana
  - [2] C) akademiya
  - [3] D) kafedra  **<-- ANSWER**
  - [4] E) məktəb
- **answer**: `3`
- **explanation**: Верный ответ: <b>ka'fedra</b> (заимствование ka'fedra имеет ударение на 1-м слоге). В остальных вариантах: akade'miya, kitabxana', avto'bus, məktə'b.

### GEN #10 (seed=37685, diff=1)
- **id**: `az.morphemics#37685` | **typeId**: `az.morphemics` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Словообразование
- **stem**: Какой из приведённых примеров является <b>сложным наименованием</b> (mürəkkəb ad)?
- **options**:
  - [0] A) istiot
  - [1] B) Dəmirçi
  - [2] C) dəniz sahili
  - [3] D) Azərbaycan Respublikası  **<-- ANSWER**
  - [4] E) məktəb həyəti
- **answer**: `3`
- **explanation**: <b>Azərbaycan Respublikası</b> — сложное собственное наименование в виде словосочетания (mürəkkəb ad). Слова вроде istiot — сложные слова (mürəkkəb söz), а məktəb həyəti — свободные словосочетания.

### GEN #11 (seed=39505, diff=2)
- **id**: `az.morphology-verb#39505` | **typeId**: `az.morphology-verb` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Морфология
- **stem**: В каком предложении подчёркнутое слово выступает в роли части речи: <b>qoşma (послелог)</b>?
- **options**:
  - [0] A) Usta taxtanı kəskin bıçaq <u>ilə</u> yonurdu.  **<-- ANSWER**
  - [1] B) Biz çox çalışdıq, <u>ancaq</u> vaxtımız çatmadı.
  - [2] C) Elə bilirdim <u>ki</u>, iclas sabah keçiriləcək.
  - [3] D) Sözün <u>doğrusu</u> budur ki, planı yeniləməliyik.
  - [4] E) Bu sirri <u>ancaq</u> sənə etibar edə bilərəm.
- **answer**: `0`
- **explanation**: В предложении «Usta taxtanı kəskin bıçaq <u>ilə</u> yonurdu.» слово функционирует как <b>qoşma (послелог)</b>: ilə указывает на орудие действия и не заменяется на və → qoşma.

### GEN #12 (seed=30227, diff=3)
- **id**: `az.syntax-sentence#30227` | **typeId**: `az.syntax-sentence` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Синтаксис
- **stem**: <p>Какие продолжения на месте многоточия превратят конструкцию <i>«Müəllim mövzunu aydın şəkildə izah edər, ...»</i> в <b>сложное предложение</b> (mürəkkəb cümlə)?</p><p>1. ev tapşırıqlarını yoxlayar.<br>2. şagirdlər məsələni dərhal anlayarlar.<br>3. vacib qaydaları yenidən təkrarlayar.<br>4. lövhədə bir neçə nümunə də yazar.<br>5. sinifdə bütün suallar cavabını tapar.</p>
- **options**:
  - [0] A) 2, 5  **<-- ANSWER**
  - [1] B) 2, 3
  - [2] C) 1, 2
  - [3] D) 1, 5
  - [4] E) 2, 4
- **answer**: `0`
- **explanation**: Сложное предложение (mürəkkəb cümlə) образуют продолжения с новой грамматической основой (собственным подлежащим): <b>«sinifdə bütün suallar cavabını tapar.»</b> и <b>«şagirdlər məsələni dərhal anlayarlar.»</b>. Остальные варианты описывают действия того же субъекта (однородные сказуемые → простое предложение). Подходящие номера: <b>2, 5</b>.

### GEN #13 (seed=1196, diff=1)
- **id**: `az.reading-closed#1196` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Работа с текстом
- **passage** (`az-lit-5`, title: İpək karvanı): <p>Dekabrın şaxtalı günlərindən birində Şəkidən çıxan ipək karvanı uca dağ aşırımına yaxınlaşırdı. <span class="num">[I]</span> Karvanbaşı Qasım kişi əlli ilin təcrübəli yolçusu idi. <span class="num">1.</span> Dəvələrin boynundakı zınqırovların səsi dərələrə yayılırdı. O, göyün üzünü tutan boz buludlara baxıb gənc köməkçisi Aslana xəbərdarlıq etdi ki, ▲ <b>tufan</b> qopmamış sürəti artırsınlar.</p> <p>Yolun yarısında güclü qar başladı və görünüş məsafəsi kəskin azaldı. <span class="num">[II]</s…
- **stem**: Mətndə əvvəlində rəqəm yazılmış hansı cümlələr mətndən çıxarılsa, məzmuna və məntiqi ardıcıllığa xələl <b>gəlməz</b>?
- **options**:
  - [0] A) 3, 5
  - [1] B) 1, 2
  - [2] C) 2, 3
  - [3] D) 3, 4
  - [4] E) 1, 5  **<-- ANSWER**
- **answer**: `4`
- **explanation**: Без ущерба для логики текста можно удалить предложения <b>1, 5</b>: Предложения 1 (звон колокольчиков) и 5 (горячий чай) — художественные штрихи; 2, 3 и 4 несут сюжетную нагрузку.

### GEN #14 (seed=5601, diff=2)
- **id**: `az.phonetics#5601` | **typeId**: `az.phonetics` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Фонетика
- **stem**: В каком слове произносится долгий гласный звук?
- **options**:
  - [0] A) bədii  **<-- ANSWER**
  - [1] B) məsuliyyət
  - [2] C) tənbəl
  - [3] D) yarpaq
  - [4] E) bilik
- **answer**: `0`
- **explanation**: Правильный ответ: <b>bədii</b> [bədi:] — ii произносится как один долгий [i:], звуков на 1 меньше, чем букв.

### GEN #15 (seed=46483, diff=3)
- **id**: `az.stylistics#46483` | **typeId**: `az.stylistics` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Стилистика
- **stem**: <p>Определите стилистическую функцию подчёркнутого слова в предложении:</p><p><i>Qışın sərt nəfəsi kəndin küçələrini <u>bürümüşdü</u>.</i></p>
- **options**:
  - [0] A) informativ (информативная)
  - [1] B) rəsmi-dəftərxana (канцелярская)
  - [2] C) poetik (поэтическая)  **<-- ANSWER**
  - [3] D) məişət-danışıq (разговорно-бытовая)
  - [4] E) terminoloji (терминологическая)
- **answer**: `2`
- **explanation**: Подчёркнутое слово выполняет функцию <b>poetik (поэтическая)</b>: слово употреблено метафорически для создания художественного образа.

### GEN #16 (seed=24615, diff=1)
- **id**: `az.reading-open#24615` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 1 | **points**: 2 | **topic**: Работа с текстом
- **passage** (`az-lit-2`, title: Gülüstan qalasının keşikçisi): <p>Payızın sərin axşamında Şirvan dağlarının qoynundakı Gülüstan qalasında sakitlik hökm sürürdü. <span class="num">[I]</span> Qoca keşikçi Murad dayı bürcün üstündən dərəyə boylanırdı. <span class="num">1.</span> Dərənin dibində axan çayın səsi gecənin sükutuna qarışırdı. Onun yanında gənc döyüşçü Teymur dayanmışdı.</p> <p>Səhərə yaxın cəsuslardan xəbər gəldi ki, yadelli dəstə gizli dağ cığırı ilə qalaya yaxınlaşır. <span class="num">[II]</span> Qalada əsgərlərin sayı az idi, lakin Murad dayı h…
- **stem**: Mətnə əsasən <b>Murad dayı</b> obrazının 2 xüsusiyyətini və əsaslandırmasını yazın.
- **answer**: `"1. <b>Soyuqqanlı və cəsurdur:</b> Düşmən yaxınlaşanda əsgərlərin az olmasına baxmayaraq təşvişə düşmür.<br>2. <b>Tədbirli və ağıllıdır:</b> Məşəllər və qalxan səsi ilə düşməndə böyük qoşun təəssüratı yaradır."`
- **rubric**: 2 балла — 2 черты с точным обоснованием из текста; 1 балл — 1 черта с обоснованием; 0 баллов — неверно.
- **explanation**: Хладнокровие и расчётливость Мурада подтверждаются его действиями во время осады.

### GEN #17 (seed=45412, diff=2)
- **id**: `az.lexics-idioms#45412` | **typeId**: `az.lexics-idioms` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Лексика и фразеология
- **stem**: Подберите <b>синонимичное</b> выражение к фразеологизму «<b>ürəyi açılmaq</b>»:
- **options**:
  - [0] A) kefi kökəlmək  **<-- ANSWER**
  - [1] B) kefi pozulmaq
  - [2] C) qəmə batmaq
  - [3] D) huşunu itirmək
  - [4] E) ağıl öyrətmək
- **answer**: `0`
- **explanation**: Фразеологизм «ürəyi açılmaq» означает «повеселеть, отлечь от сердца». Его синоним — <b>kefi kökəlmək</b>.

### GEN #18 (seed=25931, diff=3)
- **id**: `az.morphology-noun-adj-num#25931` | **typeId**: `az.morphology-noun-adj-num` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Морфология
- **stem**: В каком предложении выделенное слово стоит в <b>винительном падеже</b> (təsirlik hal)?
- **options**:
  - [0] A) Şagird yeni <u>kitabı</u> səhər masadan götürdü.  **<-- ANSWER**
  - [1] B) Bülbülün <u>səsi</u> bağçanı bürümüşdü.
  - [2] C) Müəllimin <u>kitabı</u> kitabxanada saxlanılır.
  - [3] D) Qardaşımın <u>məktubu</u> bu gün gəldi.
  - [4] E) Azərbaycanın <u>şəhəri</u> Şəki sənətkarlığı ilə məşhurdur.
- **answer**: `0`
- **explanation**: Верный вариант: «Şagird yeni <u>kitabı</u> səhər masadan götürdü.» — «новый учебник (кого? что?)» — прямой объект при переходном глаголе, винительный падеж (təsirlik hal).

### GEN #19 (seed=19730, diff=1)
- **id**: `az.syntax-phrases#19730` | **typeId**: `az.syntax-phrases` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Синтаксис
- **stem**: В каком предложении сказуемое (xəbər) выражено <b>инфинитивным оборотом</b> (məsdər tərkibi)?
- **options**:
  - [0] A) Məclisə toplaşmaqda məramları qonaqlara hörmət etmək idi.
  - [1] B) Rəqiblə dil tapmaq əvvəlcədən mümkün deyildi.
  - [2] C) Onun uşaqlıqdan bəri tək arzusu yazmaq idi.
  - [3] D) Kənd cavanlarının istəyi vəziyyətdən baş çıxarmaqdır.
  - [4] E) Sərkərdənin əsas məqsədi qalanı düşməndən qorumaq idi.  **<-- ANSWER**
- **answer**: `4`
- **explanation**: «qalanı düşməndən qorumaq idi» — инфинитивный оборот в функции сказуемого.

### GEN #20 (seed=32409, diff=2)
- **id**: `az.ortho-stress#32409` | **typeId**: `az.ortho-stress` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Орфография и ударение
- **stem**: В каком слове словесное ударение (vurğu) падает на <b>первый</b> слог?
- **options**:
  - [0] A) qələm
  - [1] B) dəftər
  - [2] C) qəhrəman
  - [3] D) opera  **<-- ANSWER**
  - [4] E) kitabxana
- **answer**: `3`
- **explanation**: Верный ответ: <b>o'pera</b> (заимствование o'pera имеет ударение на 1-м слоге). В остальных вариантах: qələ'm, qəhrəma'n, dəftə'r, kitabxana'.

### GEN #21 (seed=7697, diff=3)
- **id**: `az.morphemics#7697` | **typeId**: `az.morphemics` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Словообразование
- **stem**: В каком ряду <b>все слова</b> являются однокоренными (eyniköklü sözlər)?
- **options**:
  - [0] A) sıxlıq, sıxlaşmaq, sıxıcı
  - [1] B) sıxıcı, sıxıntı, sıxlaşmaq
  - [2] C) sıxlıq, sıxıntı, sıxlaşdırmaq
  - [3] D) sıxlıq, sıxlaşmaq, sıxlaşdırmaq  **<-- ANSWER**
  - [4] E) sıxıcı, sıxılmaq, sıxlaşdırmaq
- **answer**: `3`
- **explanation**: Все слова ряда <b>sıxlıq, sıxlaşmaq, sıxlaşdırmaq</b> образованы от корня sıx («тесный / густой»). В остальных рядах присутствуют омонимичные корни или грамматические формы того же слова: в sıxlıq, sıxlaşmaq корень — прилагательное sıx («густой»), а в sıxıcı, sıxıntı — глагол sıx- («сжимать»).

### GEN #22 (seed=26869, diff=1)
- **id**: `az.morphology-verb#26869` | **typeId**: `az.morphology-verb` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Морфология
- **stem**: Какой глагол употреблён в наклонении: <b>долженствовательное (vacib şəkli)</b>?
- **options**:
  - [0] A) yazmalıyam  **<-- ANSWER**
  - [1] B) gələsən
  - [2] C) öyrədəydin
  - [3] D) dolaşdım
  - [4] E) bilsələr
- **answer**: `0`
- **explanation**: Глагол <b>yazmalıyam</b> имеет форму наклонения «долженствовательное (vacib şəkli)»: суффикс -malı + -yam = долженствовательное наклонение (vacib şəkli).

### GEN #23 (seed=34274, diff=2)
- **id**: `az.syntax-sentence#34274` | **typeId**: `az.syntax-sentence` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Синтаксис
- **stem**: <p>Какие продолжения на месте многоточия превратят конструкцию <i>«Gedib xaricdə təhsilini artırar, ...»</i> в <b>сложное предложение</b> (mürəkkəb cümlə)?</p><p>1. qayıdıb vətənində işləyər.<br>2. savadı ilə hamını təəccübləndirər.<br>3. biliyi xalqına gərəkli olar.<br>4. yeni layihələr üzərində çalışar.<br>5. müəllimləri onunla fəxr edər.</p>
- **options**:
  - [0] A) 3, 5  **<-- ANSWER**
  - [1] B) 3, 4
  - [2] C) 2, 3
  - [3] D) 2, 4
  - [4] E) 4, 5
- **answer**: `0`
- **explanation**: Сложное предложение (mürəkkəb cümlə) образуют продолжения с новой грамматической основой (собственным подлежащим): <b>«müəllimləri onunla fəxr edər.»</b> и <b>«biliyi xalqına gərəkli olar.»</b>. Остальные варианты описывают действия того же субъекта (однородные сказуемые → простое предложение). Подходящие номера: <b>3, 5</b>.

### GEN #24 (seed=3219, diff=3)
- **id**: `az.reading-closed#3219` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Работа с текстом
- **passage** (`az-inf-3`, title: Abşeronun qədim ovdanları): <p>Quraq iqlimə malik Abşeron yarımadasında əsrlər boyu su təchizatı ən vacib məsələlərdən biri olmuşdur. <span class="num">[I]</span> Çayları olmayan bu ərazidə əhali yeraltı sulardan səmərəli istifadə etmək üçün «ovdan» adlanan qədim su anbarları tikmişdir. <span class="num">1.</span> Yarımadanın küləkli havası yay aylarında ətrafı bir qədər sərinlədir.</p> <p>Ovdanlar əsasən yerin altı ilə uzanan və su mənbəyini daşıyan kəhriz sistemlərinin sonunda qurulurdu. <span class="num">[II]</span> Suy…
- **stem**: <p><i>«Çünki qapalı məkan həm günəş şüalarının qarşısını alır, həm də tozun qarışmasına imkan vermirdi.»</i> cümləsi mətndə nömrələnmiş hansı çərçivənin yerinə artırılsa, məzmun ardıcıllığı pozulmaz?</p>
- **options**:
  - [0] A) V
  - [1] B) III
  - [2] C) IV
  - [3] D) I
  - [4] E) II  **<-- ANSWER**
- **answer**: `4`
- **explanation**: Верная позиция — <b>[II]</b>: Объяснение роли закрытого купола (защита от солнца и пыли) относится ко 2-му абзацу об устройстве овданов [II].

### GEN #25 (seed=6641, diff=1)
- **id**: `az.phonetics#6641` | **typeId**: `az.phonetics` | **format**: `single` | **difficulty**: 1 | **points**: 1 | **topic**: Фонетика
- **stem**: В каком слове количество звуков меньше количества букв?
- **options**:
  - [0] A) fikir
  - [1] B) anbar
  - [2] C) bəyaz
  - [3] D) şəxsiyyət  **<-- ANSWER**
  - [4] E) doqquz
- **answer**: `3`
- **explanation**: Правильный ответ: <b>şəxsiyyət</b> [şəxsiyət] — в суффиксе -iyyət двойное yy произносится как один [y] (звуков на 1 меньше).

## Exam Order & Points Check (seed=203380)

Total tasks: 30, Total raw points: 40

1. `az.stylistics` (single, 1 pt, diff=1) —  К какому функциональному стилю речи относится приведённый отрывок?  Azərbaycan əlifbasınd
2. `az.syntax-sentence` (single, 1 pt, diff=1) — Укажите  несоответствие  между предложением с прямой речью (знаки препинания опущены) и ег
3. `az.phonetics` (single, 1 pt, diff=1) — В каком слове отсутствуют глухие согласные (все согласные звонкие)?
4. `az.morphology-verb` (single, 1 pt, diff=2) — Какой глагол употреблён в наклонении:  необходимости (lazım şəkli) ?
5. `az.lexics-idioms` (single, 1 pt, diff=2) — Укажите устойчивое фразеологическое сочетание (frazeoloji birləşmə):
6. `az.morphemics` (single, 1 pt, diff=2) — В каком ряду  все слова  являются однокоренными (eyniköklü sözlər)?
7. `az.morphology-noun-adj-num` (single, 1 pt, diff=2) — В каком существительном гласный в корне выпадает  только  при присоединении притяжательног
8. `az.ortho-stress` (single, 1 pt, diff=3) — В каком слове словесное ударение (vurğu) падает на  последний  слог?
9. `az.syntax-sentence` (single, 1 pt, diff=3) —  Какие продолжения на месте многоточия превратят конструкцию  «Müəllim mövzunu aydın şəkil
10. `az.syntax-phrases` (single, 1 pt, diff=3) —  Укажите  верные  утверждения о синтаксических связях и членах предложения:   «Dünənki yar
11. `az.reading-closed` (single, 1 pt, diff=2) —  Mətnə əsasən cədvəldəki  uyğun  (düzgün yerləşdirilmiş) fikirləri müəyyən edin:     Doğru
12. `az.reading-closed` (single, 1 pt, diff=2) —  Mətnə əsasən hansıların səbəbini müəyyən etmək mümkün deyil?  1. Rəsulun gənclikdə tələsk
13. `az.reading-closed` (single, 1 pt, diff=3) — Mətndə əvvəlində rəqəm yazılmış hansı cümlələr mətndən çıxarılsa, məzmuna və məntiqi ardıc
14. `az.reading-closed` (single, 1 pt, diff=3) —   «Onun əlindən çıxan hər bir qab sanki tarixdən xəbər verən sənət əsəri idi.»  cümləsi mə
15. `az.reading-closed` (single, 1 pt, diff=3) — Mətndə üzərində  1  rəqəmi yazılmış « keçmək » sözü hansı nümunədə kontekstə görə mətndəki
16. `az.reading-open` (open, 2 pts, diff=2) — Mətndə əvvəlində işarə qoyulmuş sözlərin kontekstə görə qarşılığını (mənasını) yazın: ▲  ç
17. `az.reading-open` (open, 2 pts, diff=2) — Mətndə seçilmiş cümləni mətnin üslubi xüsusiyyətlərinə uyğun məcazi ifadələrlə zənginləşdi
18. `az.reading-open` (open, 2 pts, diff=2) — Mətndə nöqtələrin yerinə məzmuna uyğun ifadələr yazmaqla son cümləni tamamlayın:  «...sənə
19. `az.reading-open` (open, 2 pts, diff=2) — Mətnə əsasən  Kamran  obrazının 2 xarakterik xüsusiyyətini və onların əsaslandırılmasını y
20. `az.reading-open` (open, 2 pts, diff=2) — «Tələsən təndirə düşər» atalar sözünü mətndəki iki fərqli məqamla əlaqələndirib fikrinizi 
21. `az.reading-closed` (single, 1 pt, diff=2) —  Mətnə əsasən cədvəldəki  uyğun  (düzgün yerləşdirilmiş) fikirləri müəyyən edin:     Doğru
22. `az.reading-closed` (single, 1 pt, diff=2) —  Mətnə əsasən hansı faktı dəqiqləşdirmək mümkün deyil?  1. Ovdanların tikintisində hansı d
23. `az.reading-closed` (single, 1 pt, diff=3) — Mətndə əvvəlində rəqəm yazılmış hansı cümlələr mətndən çıxarılsa, məzmuna və məntiqi ardıc
24. `az.reading-closed` (single, 1 pt, diff=3) —   «Çünki qapalı məkan həm günəş şüalarının qarşısını alır, həm də tozun qarışmasına imkan 
25. `az.reading-closed` (single, 1 pt, diff=3) — Mətndə üzərində  1  rəqəmi yazılmış « enirdi » sözü hansı nümunədə kontekstə görə mətndəki
26. `az.reading-open` (open, 2 pts, diff=2) — İşarələnmiş sözlərin mətndəki funksiyasını yazın və cümlədə fərqli mənada (və ya funksiyad
27. `az.reading-open` (open, 2 pts, diff=2) — Seçilmiş cümlədəki qrammatik-üslubi qüsuru düzəldib cümləni yenidən yazın:  «Bəzi yerlərdə
28. `az.reading-open` (open, 2 pts, diff=2) — Son cümlədəki boşluqları tamamlayın:  «...Abşeron ovdanları həm (1) ................ həlli
29. `az.reading-open` (open, 2 pts, diff=2) — Mətnə əsasən  «Müddəa — Fakt»  cədvəlini tamamlayın: 1) Müddəa:  Ovdanlar suyu uzun müddət
30. `az.reading-open` (open, 2 pts, diff=2) — «Təbii şərait insanların mühəndislik düşüncəsini inkişaf etdirir» fikrini mətnlə əlaqələnd

## Originals Sample (12 of 60)

### ORIG #1 (az-0903-49)
- **id**: `az-0903-49` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 2 | **points**: 2 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":49}`
- **passage** (`az-0903-p1`, title: Dərbənd ətrafında): <p>Şirvan üzərinə yerimək<sup>1</sup> üçün Dərbənd yaxınlığında düşərgə salmış Toxtamış xan həmişəkindən fərqli olaraq, bu gün şad-xürrəm görünürdü. <span class="num">1.</span> Hökmdarın çadırına toplaşmış əyanlar, sərkərdələr ondakı bu dəyişikliyin səbəbini öyrənməyə çalışırdılar. Toxtamış xan onların bu intizarına son qoymaq vaxtının çatdığını anlayıbmış kimi dedi:</p><p>– Səhər çaparlarımız xəbər gətirdilər ki, ədavət bəslədiyimiz Əmir Teymur Kür çayının sahilində düşərgə salıb. <u>Görünür, m…
- **stem**: Mətndə nöqtələrin yerinə uyğun ifadələr yazmaqla cümləni tamamlayın:<br><i>«Toxtamış xan şəhərin alınmasının həm (1.).................... hesabına olacağını, həm də (2.)..................... itirəcəyini nəzərə alıb dedi...»</i>
- **answer**: `"1. böyük itkilər / böyük çətinlik;<br>2. xeyli vaxt / xeyli sayda döyüşçü."`
- **rubric**: 2 балла — оба пропуска заполнены логически и грамматически точно в контексте падежа и смысла; 1 балл — 1 пропуск; 0 баллов — неверно.
- **explanation**: Варианты DİM: (1) böyük itkilər / çətinlik; (2) xeyli vaxt / xeyli sayda döyüşçü.

### ORIG #2 (az-0903-59)
- **id**: `az-0903-59` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 2 | **points**: 2 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":59}`
- **passage** (`az-0903-p2`, title: Azərbaycanda parçaçılıq sənəti): <p>Azərbaycanda parçaçılıq sənətinin tarixi çox qədimdir. Bu sənət sahəsi yarandığından bu günə qədər daima yüksək səviyyədə inkişaf etmişdir.</p><p>Fərqli materiallardan hazırlanan parça <u>məmulatlarının</u> Venesiya, Genuya, Hollandiya, Fransa, İngiltərə və Rusiyada böyük alıcı kütləsi olmuşdur. <span class="mark">Səfəvilər tarixində Azərbaycanda olmuş məşhur fransız səyyahı Sarden burada müxtəlif parça növlərinin toxunduğunu gündəliyində istinad etmişdir.</span></p><p>Rusların Azərbaycan par…
- **stem**: Mətnin iki müxtəlif tərkib hissəsində bir-biri ilə ziddiyyət təşkil edən cümlələri müəyyən edərək yazın.
- **answer**: `"1. Bu sənət sahəsi yarandığından bu günə qədər daima yüksək səviyyədə inkişaf etmişdir.<br>2. Azərbaycan parçaçılıq sənətinin tarixində məşəqqətli illər də olmuşdur."`
- **rubric**: 2 балла — выписаны оба противоречащих предложения из вступления и последнего абзаца; 1 балл — указано только 1 предложение или неточный пересказ; 0 баллов — неверно.
- **explanation**: Утверждение о непрерывном высоком развитии противоречит сообщению о тяжёлых годах (1514 г., вывоз мастеров в Стамбул) в конце текста.

### ORIG #3 (az-0903-48)
- **id**: `az-0903-48` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 2 | **points**: 2 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":48}`
- **passage** (`az-0903-p1`, title: Dərbənd ətrafında): <p>Şirvan üzərinə yerimək<sup>1</sup> üçün Dərbənd yaxınlığında düşərgə salmış Toxtamış xan həmişəkindən fərqli olaraq, bu gün şad-xürrəm görünürdü. <span class="num">1.</span> Hökmdarın çadırına toplaşmış əyanlar, sərkərdələr ondakı bu dəyişikliyin səbəbini öyrənməyə çalışırdılar. Toxtamış xan onların bu intizarına son qoymaq vaxtının çatdığını anlayıbmış kimi dedi:</p><p>– Səhər çaparlarımız xəbər gətirdilər ki, ədavət bəslədiyimiz Əmir Teymur Kür çayının sahilində düşərgə salıb. <u>Görünür, m…
- **stem**: Mətnə əsasən <b>Şirvanşah İbrahim</b> obrazı ilə bağlı cədvəli doldurun (2 xüsusiyyət və fikrin əsaslandırılması).
- **answer**: `"1. <b>Tədbirli:</b> Düşmən qoşununun yolu üstündəki kəndlərdən əhalini təxliyə edir, qoşununun sayını artırır, müttəfiqləri ilə danışıqlar apararaq əks-həmləyə hazırlaşır.<br>2. <b>Uzaqgörən:</b> Toxtamış xanın hücum edəcəyini əvvəlcədən bilir; düşmən qoşunu şəhər hasarlarına yaxınlaşanda onların üzərinə oxlar yağdırılır."`
- **rubric**: 2 балла — названы 2 черты характера и приведено точное текстовое обоснование для каждой; 1 балл — 1 черта с обоснованием; 0 баллов — неверно.
- **explanation**: По тексту Ширваншах Ибрагим проявляет предусмотрительность (tədbirli) и дальновидность (uzaqgörən).

### ORIG #4 (az-1503-33)
- **id**: `az-1503-33` | **typeId**: `az.syntax-phrases` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Синтаксис
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":33}`
- **stem**: Cümlələrdən birinin xəbəri məsdər tərkibi ilə ifadə edilmişdir:
- **options**:
  - [0] A) Gəlişimizin məqsədi başına ağıl qoymaqdır.
  - [1] B) Məbədə gəlməkdə niyyətləri dua etmək idi.
  - [2] C) Yayın qızmar günlərində şəhərdə qalmaq heç kəsin ürəyincə deyildi.
  - [3] D) Aləmşahbəyimin yeganə çıxış yolu uşaqlarını buradan uzaqlaşdırmaq idi.  **<-- ANSWER**
  - [4] E) İndi Mədinənin bacısının həyatdakı ən böyük arzusu oxumaq idi.
- **answer**: `3`
- **explanation**: В A сказуемое — фразеологизм (<i>başına ağıl qoymaqdır</i>); в B — составной глагол (<i>dua etmək idi</i>); в C оборот <i>yayın qızmar günlərində şəhərdə qalmaq</i> является подлежащим; в E — одиночный инфинитив (<i>oxumaq idi</i>). Лишь в D сказуемое выражено инфинитивным оборотом <i>uşaqlarını buradan uzaqlaşdırmaq idi</i>.

### ORIG #5 (az-1503-51)
- **id**: `az-1503-51` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":51}`
- **passage** (`az-1503-p2`, title: Azərbaycan xalçalarında simvollar): <p>Xalçaçılıq sənətinin tarixi çox qədim dövrlərə gedib çıxır. <span class="num">[1]</span> Xalça qədim türk evinin ayrılmaz elementi olmuşdur. Köçəri həyat tərzi keçirən türklər xalçaları getdikləri yerlərə özləri ilə daşıyırdılar<sup>1</sup>. <span class="num">[2]</span></p><p>Mütəxəssislər xalça naxışlarının qədim insanların dünyagörüşü haqqında informasiya daşıdığını vurğulayırlar. Onlar belə hesab edirlər ki, hər bir naxış müəyyən bir fikir ifadəçisidir. Azərbaycan xalçalarında yer alan nax…
- **stem**: <p>Mətnə əsasən cədvəldəki uyğun fikirləri müəyyən edin.</p><table><thead><tr><th>Fikir</th><th>Doğrudur</th><th>Yanlışdır</th></tr></thead><tbody><tr><td>1. Xalçalardakı naxışlar qədim insanların dünyagörüşü ilə sıx bağlıdır.</td><td>✓</td><td></td></tr><tr><td>2. Çağdaş dövrdə xalçalardakı naxışlar sırf dekorativ məqsədlə istifadə edilir.</td><td></td><td>✓</td></tr><tr><td>3. Xalçalardakı naxış elementləri daha çox müsbət fikirlərin ifadəçisidir.</td><td>✓</td><td></td></tr><tr><td>4. Naxçıvan incəsənət nümunələrində həndəsi naxışlara üstünlük verilməsi təkcə xalçaçılıq sənəti ilə məhdudlaşmır.</td><td></td><td>✓</td></tr><tr><td>5. Bəzi xalça naxışları əsatirlərlə bağlıdır.</td><td>✓</td><td></td></tr><tr><td>6. Qədim dövrdən fərqli olaraq, günümüzdə xalçalar insanların məişətinin mühüm elementidir.</td><td>✓</td><td></td></tr></tbody></table>
- **options**:
  - [0] A) 1, 3, 5  **<-- ANSWER**
  - [1] B) 1, 2, 5, 6
  - [2] C) 1, 4, 5, 6
  - [3] D) 2, 3, 4
  - [4] E) 1, 2, 3, 4
- **answer**: `0`
- **explanation**: Утверждения 1, 3 и 5 истинны и верно отмечены в столбце «Doğrudur». Утверждения 2 и 4 тоже истинны, но ошибочно помечены как «Yanlışdır». Утверждение 6 ложно (ковры были элементом быта и в древности, и сейчас), но стоит в «Doğrudur». Ответ: <b>1, 3, 5</b>.

### ORIG #6 (az-0903-55)
- **id**: `az-0903-55` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":55}`
- **passage** (`az-0903-p2`, title: Azərbaycanda parçaçılıq sənəti): <p>Azərbaycanda parçaçılıq sənətinin tarixi çox qədimdir. Bu sənət sahəsi yarandığından bu günə qədər daima yüksək səviyyədə inkişaf etmişdir.</p><p>Fərqli materiallardan hazırlanan parça <u>məmulatlarının</u> Venesiya, Genuya, Hollandiya, Fransa, İngiltərə və Rusiyada böyük alıcı kütləsi olmuşdur. <span class="mark">Səfəvilər tarixində Azərbaycanda olmuş məşhur fransız səyyahı Sarden burada müxtəlif parça növlərinin toxunduğunu gündəliyində istinad etmişdir.</span></p><p>Rusların Azərbaycan par…
- **stem**: <p>Mətnə əsasən cədvəldəki uyğun fikirləri müəyyən edin.</p><table><thead><tr><th>Doğrudur</th><th>Yanlışdır</th><th>Ehtimaldır</th></tr></thead><tbody><tr><td>1. Azərbaycan parçaçılıq sənətinin nümunələri qazanc məqsədilə satılmışdır.</td><td>3. Azərbaycan parçaları haqqında müxtəlif mənbələrdən məlumat almaq mümkündür.</td><td>5. Əntiq mallar alverçisi bir neçə hissəyə bölərək müxtəlif şəxslərə satdığı parçanı Təbriz şəhərindən almışdır.</td></tr><tr><td>2. Parçaçılıq sənətkarları sadəcə ipək parça istehsal edirdilər.</td><td>4. Şamaxı və Təbriz ipəyindən rus çarı üçün geyim hazırlanmasına IX-XII əsrlərin mənbələrində rast gəlinir.</td><td>6. Şərq Xalqları Muzeyində saxlanılan parçanın üzərində düşmənin ələ keçirilməsi təsvir edilmişdir.</td></tr></tbody></table>
- **options**:
  - [0] A) 2, 4, 6
  - [1] B) 1, 3, 4
  - [2] C) 2, 3, 6
  - [3] D) 1, 4, 5  **<-- ANSWER**
  - [4] E) 1, 3, 5
- **answer**: `3`
- **explanation**: 1) Верно (торговец в Стамбуле продал ради выгоды) — верно размещено в «Doğrudur»; 4) Неверно (это упоминается в более поздних источниках, а не IX–XII вв.) — верно размещено в «Yanlışdır»; 5) В тексте не указано, где именно торговец купил ткань — верно размещено в «Ehtimaldır». Ответ: <b>1, 4, 5</b>.

### ORIG #7 (az-1503-50)
- **id**: `az-1503-50` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 2 | **points**: 2 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":50}`
- **passage** (`az-1503-p1`, title: İntiqam alovu): <p>İsrafil ağa Mollazal uşağı tayfasını hökumətin əli ilə Kəsəməndən başqa kəndə sürgün etdirəndən sonra qəlbində bir az ▲ <b>səngimiş</b> intiqam alovu günlər keçdikcə yenidən artmaqda idi. Bir tərəfdən də, tayfasının dəliqanlı cavanları atlarını Acıdərəyə çapmaq, Mollazal uşağı tayfasının yaşadığı evlərə hücum etmək üçün İsrafil ağadan icazə istəyirdilər. Lakin o, məğlubiyyətdən qorxur, cavanların güclə <u>ipini çəkirdi</u>.</p><p>İsrafil ağa bu günlərdə həmişəkindən çox fikirləşirdi: «Onları …
- **stem**: Mətndəki <b>İsrafil ağa</b> obrazı əsasında cədvəli doldurun (3 xarakterik xüsusiyyət və əsaslandırma).
- **answer**: `"1. <b>Hiyləgərdir:</b> Düşmənlərini üzbəüz döyüşdə yox, tələyə salıb məhv etmək üçün planlar qurur.<br>2. <b>Namərddir:</b> Düşməni ilə üz-üzə gəlməkdən qorxur, onu alçaqcasına (qəbirləri güllələməklə) təxribata çəkir.<br>3. <b>Qorxaqdır:</b> Açıq döyüşdən və məğlubiyyətdən qorxur."`
- **rubric**: 2 балла — указаны 2–3 верные черты характера с текстовым обоснованием; 1 балл — 1 черта с обоснованием; 0 баллов — неверно.
- **explanation**: Образ Исрафил-аги характеризуется коварством (hiyləgər), подлостью (namərd) и трусостью (qorxaq).

### ORIG #8 (az-0903-35)
- **id**: `az-0903-35` | **typeId**: `az.syntax-sentence` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Синтаксис
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":35}`
- **stem**: <p>Uyğunsuzluğu müəyyən edin.<br>I. Vasitəsiz nitqli cümlə (durğu işarələri buraxılmışdır)<br>II. Vasitəsiz nitqli cümlənin sxemi</p>
- **options**:
  - [0] A) I. Qarı bir az düşünüb Yaxşı qərar sənindir dedi<br>II. M: “V”,–m.
  - [1] B) I. Bəli dedi bir dəfə yerli bələdçilərlə qoruğa getmişdik<br>II. M: “V”.  **<-- ANSWER**
  - [2] C) I. Biz demək olar ki çatmışıq deyə Səlim gülümsədi<br>II. “V”,–m.
  - [3] D) I. Mən buradayam komandir cəld dilləndim bura gələ bilərsinizmi<br>II. “V,–m,–v?”
  - [4] E) I. Kapitan səmimiyyətlə dedi Sizi təbrik edirəm leytenant<br>II. M: “V”.
- **answer**: `1`
- **explanation**: В варианте B после восстановления знаков препинания получаем: «Bəli, – dedi, – bir dəfə yerli bələdçilərlə qoruğa getmişdik.» Авторская ремарка стоит внутри прямой речи, поэтому схема должна быть <b>“V, – m, – v”.</b>, а не M: “V”.

### ORIG #9 (az-1503-43)
- **id**: `az-1503-43` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 3 | **points**: 1 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":43}`
- **passage** (`az-1503-p1`, title: İntiqam alovu): <p>İsrafil ağa Mollazal uşağı tayfasını hökumətin əli ilə Kəsəməndən başqa kəndə sürgün etdirəndən sonra qəlbində bir az ▲ <b>səngimiş</b> intiqam alovu günlər keçdikcə yenidən artmaqda idi. Bir tərəfdən də, tayfasının dəliqanlı cavanları atlarını Acıdərəyə çapmaq, Mollazal uşağı tayfasının yaşadığı evlərə hücum etmək üçün İsrafil ağadan icazə istəyirdilər. Lakin o, məğlubiyyətdən qorxur, cavanların güclə <u>ipini çəkirdi</u>.</p><p>İsrafil ağa bu günlərdə həmişəkindən çox fikirləşirdi: «Onları …
- **stem**: <p>Hansı cümlədə altından xətt çəkilmiş birləşmənin (<i>ipini çəkirdi</i>) kontekstə görə mənasına uyğun ifadə işlənmişdir?</p><p>1. Yaşlı adam atı çətinliklə cilovladı və damın altındakı dirəyə bağladı.<br>2. Uşağın vaxt ikən cilovunu bərk yığışdır, sonra gec olar! <i>(M. İbrahimov)</i><br>3. Məryəm buradakı uşaqları güclə öz nəzarətində saxlaya bilirdi.<br>4. Öz qardaşın da olsa, başında qoz sındıracaq, onu da intizama dəvət etmək lazımdır. <i>(M. İbrahimov)</i><br>5. Cavanlıqda ixtiyarı əldən verdiyi üçün yaş artdıqca lap acizləşmişdi.</p>
- **options**:
  - [0] A) 1, 4, 5
  - [1] B) 1, 2, 3
  - [2] C) 2, 3, 4  **<-- ANSWER**
  - [3] D) 2, 4, 5
  - [4] E) 1, 3, 5
- **answer**: `2`
- **explanation**: Фразеологизм <i>ipini çəkmək</i> означает «удерживать, контролировать, призывать к дисциплине». Этому соответствуют <b>2</b> (<i>cilovunu bərk yığışdır</i>), <b>3</b> (<i>öz nəzarətində saxlaya bilirdi</i>) и <b>4</b> (<i>intizama dəvət etmək</i>). В 1 — прямое значение, в 5 — противоположное.

### ORIG #10 (az-1503-59)
- **id**: `az-1503-59` | **typeId**: `az.reading-open` | **format**: `open` | **difficulty**: 2 | **points**: 2 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":59}`
- **passage** (`az-1503-p2`, title: Azərbaycan xalçalarında simvollar): <p>Xalçaçılıq sənətinin tarixi çox qədim dövrlərə gedib çıxır. <span class="num">[1]</span> Xalça qədim türk evinin ayrılmaz elementi olmuşdur. Köçəri həyat tərzi keçirən türklər xalçaları getdikləri yerlərə özləri ilə daşıyırdılar<sup>1</sup>. <span class="num">[2]</span></p><p>Mütəxəssislər xalça naxışlarının qədim insanların dünyagörüşü haqqında informasiya daşıdığını vurğulayırlar. Onlar belə hesab edirlər ki, hər bir naxış müəyyən bir fikir ifadəçisidir. Azərbaycan xalçalarında yer alan nax…
- **stem**: “Xalçalarda əksini tapmış motivlərə başqa sənət sahələrində də rast gəlmək olur” fikrini mətnlə əlaqələndirib fikrinizi yazın.
- **answer**: `"Xalçalarda əksini tapmış motivlər ədəbiyyatda, memarlıqda (şəhərsalmada) və geyim sənətində də özünü göstərir: həyat ağacı motivinə «Dədə Qorqud» və şumerlərin «Bilqamıs» dastanlarında, həndəsi təsvirlərə Naxçıvandakı Gəmiqaya rəsmlərində, buta elementinə isə şəhərsalmada və geyimlərdə geniş rast gəlinir."`
- **rubric**: 2 балла — приведены конкретные примеры из текста (литература, наскальные рисунки, градостроительство, одежда); 1 балл — только 1 пример; 0 баллов — неверно.
- **explanation**: Текст связывает ковровые мотивы с эпосами, наскальными рисунками Гямигая, градостроительством и одеждой.

### ORIG #11 (az-0903-39)
- **id**: `az-0903-39` | **typeId**: `az.morphemics` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Словообразование
- **origin**: `{"pdf":"Attestat_all_09.03.2026_1773051095.pdf","number":39}`
- **stem**: Cərgələrdən birindəki sözlər <b>┌─┐ ^ ^</b> (kök + 2 leksik şəkilçi) sxeminə uyğundur:
- **options**:
  - [0] A) peşəkarcasına, küskündür
  - [1] B) dahiyanə, çəkiliş
  - [2] C) tanışlıq, işlətdikcə
  - [3] D) genəldir, yüksəklikdəki
  - [4] E) oxşarlıq, bərkit  **<-- ANSWER**
- **answer**: `4`
- **explanation**: <i>oxşarlıq</i> (oxşa + r + lıq) и <i>bərkit</i> (bərk + i + t) состоят из корня и 2 лексических суффиксов. В остальных парах присутствуют грамматические окончания (<i>-dür, -dikcə, -ir</i>) или только 1 лексический суффикс (<i>dahiyanə</i>).

### ORIG #12 (az-1503-53)
- **id**: `az-1503-53` | **typeId**: `az.reading-closed` | **format**: `single` | **difficulty**: 2 | **points**: 1 | **topic**: Работа с текстом
- **origin**: `{"pdf":"Attestat_all_15.03.2026_1773569675.pdf","number":53}`
- **passage** (`az-1503-p2`, title: Azərbaycan xalçalarında simvollar): <p>Xalçaçılıq sənətinin tarixi çox qədim dövrlərə gedib çıxır. <span class="num">[1]</span> Xalça qədim türk evinin ayrılmaz elementi olmuşdur. Köçəri həyat tərzi keçirən türklər xalçaları getdikləri yerlərə özləri ilə daşıyırdılar<sup>1</sup>. <span class="num">[2]</span></p><p>Mütəxəssislər xalça naxışlarının qədim insanların dünyagörüşü haqqında informasiya daşıdığını vurğulayırlar. Onlar belə hesab edirlər ki, hər bir naxış müəyyən bir fikir ifadəçisidir. Azərbaycan xalçalarında yer alan nax…
- **stem**: <p>Mətndə üzərində rəqəm yazılmış sözlər (<b>1. daşıyırdılar<sup>1</sup></b>, <b>2. daşımaqdadır<sup>2</sup></b>) əsasında uyğunluğu müəyyən edin.</p><p>a. <i>Şairin qoşma və gəraylıları dərin mahiyyət daşıyır</i> cümləsində kontekstə görə eyni məna ifadə edən söz işlənmişdir.<br>b. Aparmaq sözünün qarşılığıdır.<br>c. <i>O, dövlət idarələrindən birində orta vəzifə daşıyırdı</i> cümləsində kontekstə görə eyni anlamda olan ifadə işlənmişdir.<br>d. İfadə etmək anlamındadır.<br>e. <i>Ahıl ilə daş daşı, cahil ilə bal yemə (Atalar sözü)</i> nümunəsində kontekstə görə eyni mənalı söz var.</p>
- **options**:
  - [0] A) 1 – b; 2 – a, e
  - [1] B) 1 – a, b; 2 – c, d
  - [2] C) 1 – d, e; 2 – a, c
  - [3] D) 1 – e; 2 – b, c
  - [4] E) 1 – b, e; 2 – a, d  **<-- ANSWER**
- **answer**: `4`
- **explanation**: 1) <i>daşıyırdılar¹</i> (ковры носили с собой) означает «aparmaq» (b) и соответствует пословице «daş daşı» (e). 2) <i>daşımaqdadır²</i> (bəzək xarakteri daşımaqdadır) означает «выражать» (d) и соответствует «mahiyyət daşıyır» (a). Ответ: E.
