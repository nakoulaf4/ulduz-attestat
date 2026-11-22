// Curated banks for `az.morphemics` and `az.lexics-idioms`.

// Schemas:
// 'RL'   = ┌─┐ ^     (корень + 1 лексический)
// 'RLL'  = ┌─┐ ^ ^   (корень + 2 лексических)
// 'RLG'  = ┌─┐ ^ ∩   (корень + 1 лексический + 1 грамматический)
// 'RLLG' = ┌─┐ ^ ^ ∩ (корень + 2 лексических + 1 грамматический)
// 'RGG'  = ┌─┐ ∩ ∩   (корень + 2 грамматических)

export const SCHEMA_LABELS = {
  RL: '┌─┐ ^ (корень + 1 лексический суффикс)',
  RLL: '┌─┐ ^ ^ (корень + 2 лексических суффикса)',
  RLG: '┌─┐ ^ ∩ (корень + 1 лексический + 1 грамматический)',
  RLLG: '┌─┐ ^ ^ ∩ (корень + 2 лексических + 1 грамматический)',
  RGG: '┌─┐ ∩ ∩ (корень + 2 грамматических окончания)',
};

export const MORPHEME_WORDS = [
  // RL (10)
  { word: 'dostluq', schema: 'RL', parts: 'dost (корень) + -luq (лекс.)' },
  { word: 'gözəllik', schema: 'RL', parts: 'gözəl (корень) + -lik (лекс.)' },
  { word: 'sərhədçi', schema: 'RL', parts: 'sərhəd (корень) + -çi (лекс.)' },
  { word: 'dahiyanə', schema: 'RL', parts: 'dahi (корень) + -yanə (лекс.)' },
  { word: 'yaşıllaş', schema: 'RL', parts: 'yaşıl (корень) + -laş (лекс.)' },
  { word: 'yaradıcı', schema: 'RL', parts: 'yarat (корень) + -ıcı (лекс.)' },
  { word: 'vətəndaş', schema: 'RL', parts: 'vətən (корень) + -daş (лекс.)' },
  { word: 'duzlu', schema: 'RL', parts: 'duz (корень) + -lu (лекс.)' },
  { word: 'bağban', schema: 'RL', parts: 'bağ (корень) + -ban (лекс.)' },
  { word: 'savadlı', schema: 'RL', parts: 'savad (корень) + -lı (лекс.)' },

  // RLL (12)
  { word: 'oxşarlıq', schema: 'RLL', parts: 'oxşa (корень) + -r (лекс.) + -lıq (лекс.)' },
  { word: 'tanışlıq', schema: 'RLL', parts: 'tanı (корень) + -ş (лекс.) + -lıq (лекс.)' },
  { word: 'çəkiliş', schema: 'RLL', parts: 'çək (корень) + -il (лекс.) + -iş (лекс.)' },
  { word: 'bağçalıq', schema: 'RLL', parts: 'bağ (корень) + -ça (лекс.) + -lıq (лекс.)' },
  { word: 'duzsuzluq', schema: 'RLL', parts: 'duz (корень) + -suz (лекс.) + -luq (лекс.)' },
  { word: 'quruculuq', schema: 'RLL', parts: 'qur (корень) + -ucu (лекс.) + -luq (лекс.)' },
  { word: 'düşüncəli', schema: 'RLL', parts: 'düşün (корень) + -cə (лекс.) + -li (лекс.)' },
  { word: 'birləşmə', schema: 'RLL', parts: 'bir (корень) + -ləş (лекс.) + -mə (лекс.)' },
  { word: 'yazıçı', schema: 'RLL', parts: 'yaz (корень) + -ı (лекс.) + -çı (лекс.)' },
  { word: 'peşəkarcasına', schema: 'RLL', parts: 'peşə (корень) + -kar (лекс.) + -casına (лекс.)' },
  { word: 'bərkit', schema: 'RLL', parts: 'bərk (корень) + -i (лекс.) + -t (лекс.)' },
  { word: 'səliqəsizlik', schema: 'RLL', parts: 'səliqə (корень) + -siz (лекс.) + -lik (лекс.)' },

  // RLG (10)
  { word: 'küskündür', schema: 'RLG', parts: 'küs (корень) + -kün (лекс.) + -dür (грамм.)' },
  { word: 'məktəblilər', schema: 'RLG', parts: 'məktəb (корень) + -li (лекс.) + -lər (грамм.)' },
  { word: 'təmizlikdən', schema: 'RLG', parts: 'təmiz (корень) + -lik (лекс.) + -dən (грамм.)' },
  { word: 'gülüşdü', schema: 'RLG', parts: 'gül (корень) + -üş (лекс.) + -dü (грамм.)' },
  { word: 'dostluğun', schema: 'RLG', parts: 'dost (корень) + -luğ (лекс.) + -un (грамм.)' },
  { word: 'bilikdə', schema: 'RLG', parts: 'bil (корень) + -ik (лекс.) + -də (грамм.)' },
  { word: 'savadlıdır', schema: 'RLG', parts: 'savad (корень) + -lı (лекс.) + -dır (грамм.)' },
  { word: 'yazıldı', schema: 'RLG', parts: 'yaz (корень) + -ıl (лекс.) + -dı (грамм.)' },
  { word: 'bağçalar', schema: 'RLG', parts: 'bağ (корень) + -ça (лекс.) + -lar (грамм.)' },
  { word: 'əkinçiyə', schema: 'RLLG', parts: 'ək (корень) + -in (лекс.) + -çi (лекс.) + -yə (грамм.)' },

  // RLLG (8)
  { word: 'işlətdikcə', schema: 'RLLG', parts: 'iş (корень) + -lə (лекс.) + -t (лекс.) + -dikcə (грамм.)' },
  { word: 'genəldir', schema: 'RLLG', parts: 'gen (корень) + -əl (лекс.) + -d (лекс.) + -ir (грамм.)' },
  { word: 'yazıçılar', schema: 'RLLG', parts: 'yaz (корень) + -ı (лекс.) + -çı (лекс.) + -lar (грамм.)' },
  { word: 'birləşmələr', schema: 'RLLG', parts: 'bir (корень) + -ləş (лекс.) + -mə (лекс.) + -lər (грамм.)' },
  { word: 'çəkilişdə', schema: 'RLLG', parts: 'çək (корень) + -il (лекс.) + -iş (лекс.) + -də (грамм.)' },
  { word: 'tanışlıqdan', schema: 'RLLG', parts: 'tanı (корень) + -ş (лекс.) + -lıq (лекс.) + -dan (грамм.)' },
  { word: 'düşüncəlisi', schema: 'RLLG', parts: 'düşün (корень) + -cə (лекс.) + -li (лекс.) + -si (грамм.)' },

  // RGG (8)
  { word: 'kitablarımız', schema: 'RGG', parts: 'kitab (корень) + -lar (грамм.) + -ımız (грамм.)' },
  { word: 'evlərdən', schema: 'RGG', parts: 'ev (корень) + -lər (грамм.) + -dən (грамм.)' },
  { word: 'şagirdlərim', schema: 'RGG', parts: 'şagird (корень) + -lər (грамм.) + -im (грамм.)' },
  { word: 'ağaclarda', schema: 'RGG', parts: 'ağac (корень) + -lar (грамм.) + -da (грамм.)' },
  { word: 'qələmimə', schema: 'RGG', parts: 'qələm (корень) + -im (грамм.) + -ə (грамм.)' },
  { word: 'gəlmişlər', schema: 'RGG', parts: 'gəl (корень) + -miş (грамм.) + -lər (грамм.)' },
  { word: 'oxuyacaqsınız', schema: 'RGG', parts: 'oxu (корень) + -yacaq (грамм.) + -sınız (грамм.)' },
  { word: 'şəhərimizdə', schema: 'RGG', parts: 'şəhər (корень) + -imiz (грамм.) + -də (грамм.)' },
].filter((w) => !w.parts.includes('уточнение'));

// Same-root word sets (eyniköklü sözlər) vs homonymous-root impostors
export const SAME_ROOT_SETS = [
  {
    root: 'gül («цветок»)',
    same: ['güllük', 'gülçü', 'güldan'],
    impostors: ['gülüş', 'gülünc', 'güldürmək'],
    note: 'в словах güllük, gülçü, güldan корень gül- (сущ. «цветок»), а в gülüş / gülünc / güldürmək — омонимичный глагольный корень gül- («смеяться»)',
  },
  {
    root: 'yaz («писать»)',
    same: ['yazıçı', 'yazılı', 'yazışmaq'],
    impostors: ['yazlıq', 'yazqabağı', 'yazda'],
    note: 'в yazıçı, yazılı, yazışmaq корень — глагол yaz- («писать»), а в yazlıq, yazda — существительное yaz («весна»)',
  },
  {
    root: 'sıx («тесный / густой»)',
    same: ['sıxlıq', 'sıxlaşmaq', 'sıxlaşdırmaq'],
    impostors: ['sıxıcı', 'sıxıntı', 'sıxılmaq'],
    note: 'в sıxlıq, sıxlaşmaq корень — прилагательное sıx («густой»), а в sıxıcı, sıxıntı — глагол sıx- («сжимать»)',
  },
  {
    root: 'üz («лицо / верх»)',
    same: ['üzlük', 'üzlü', 'üzsüz'],
    impostors: ['üzgüçü', 'üzücü', 'üzülmək'],
    note: 'в üzlük, üzlü корень — сущ. üz («лицо/поверхность»), а в üzgüçü — глагол üz- («плавать»)',
  },
  {
    root: 'bağ («сад»)',
    same: ['bağça', 'bağban', 'bağlıq'],
    impostors: ['bağlamaq', 'bağlı', 'bağlantı'],
    note: 'в bağça, bağban, bağlıq корень bağ («сад»), а в bağlamaq, bağlantı — корень bağ («узел/связь»)',
  },
  {
    root: 'qorx («бояться»)',
    same: ['qorxaq', 'qorxulu', 'qorxusuz'],
    impostors: ['qorxu', 'qorxmaq', 'qorxdu'],
    note: 'формы qorxmaq, qorxdu — это формы того же слова (грамматические, а не производные однокоренные)',
  },
  {
    root: 'duz («соль»)',
    same: ['duzlu', 'duzsuz', 'duzlaq'],
    impostors: ['duzlar', 'duzum', 'duzdan'],
    note: 'duzlar, duzum, duzdan — грамматические формы одного слова duz, а не разные однокоренные слова',
  },
  {
    root: 'yağ («масло / дождь»)',
    same: ['yağlı', 'yağsız', 'yağdan'],
    impostors: ['yağış', 'yağmur', 'yağıntı'],
    note: 'в yağlı, yağsız корень — сущ. yağ («масло»), а в yağış, yağmur, yağıntı — глагол yağ- («идти осадкам»)',
  },
];

// Complex proper names (mürəkkəb ad) vs compound words & free phrases
export const MUREKKEB_AD = [
  'Novruz bayramı', 'Xəzər dənizi', 'Nizami Gəncəvi', 'Azərbaycan Respublikası',
  'Qız qalası', 'Şuşa şəhəri', 'Qara dəniz', 'Kür çayı',
  'Azərbaycan Dövlət Akademik Milli Dram Teatrı', 'Birləşmiş Millətlər Təşkilatı',
  '28 May — Müstəqillik Günü', 'Qarabağ xanlığı',
];
export const COMPOUND_WORDS_DIST = [
  'dəvəquşu', 'günəbaxan', 'Gülyaz', 'Aygün', 'qaratoyuq',
  'ağacdələn', 'kəklikotu', 'suiti', 'beşmərtəbə', 'istiot',
  'ayaqqabı', 'əlyazma', 'Gülbahar', 'Dəmirçi', 'bozbaş',
];
export const FREE_PHRASES_DIST = [
  'ədəbiyyat müəllimi', 'tarix dərsi', 'bədii əsər', 'qədim şəhər',
  'maraqlı kitab', 'şagird dəftəri', 'yaz səhəri', 'uşaq bağçası',
  'məktəb həyəti', 'bulaq suyu', 'dağ havası', 'dəniz sahili',
];

// Idioms (frazeoloji birləşmələr) vs compound verbs & free literal phrases
export const IDIOM_ITEMS = [
  { idiom: 'özündən çıxmaq', meaning: 'выйти из себя, сильно рассердиться', syn: 'cin atına minmək', ant: 'özünü ələ almaq' },
  { idiom: 'başına ağıl qoymaq', meaning: 'образумить, наставить на ум', syn: 'ağıl öyrətmək', ant: 'başını aldatmaq' },
  { idiom: 'dil tapmaq', meaning: 'найти общий язык, договориться', syn: 'yola getmək', ant: 'üz-göz olmaq' },
  { idiom: 'ürəyi getmək', meaning: 'упасть в обморок; очень желать чего-либо', syn: 'huşunu itirmək', ant: 'özünə gəlmək' },
  { idiom: 'göz qoymaq', meaning: 'присматривать, следить', syn: 'nəzarət etmək', ant: 'gözdən qaçırmaq' },
  { idiom: 'əldən düşmək', meaning: 'выбиться из сил, устать', syn: 'haldan düşmək', ant: 'güc toplamaq' },
  { idiom: 'qulaq asmaq', meaning: 'слушать, слушаться', syn: 'diqqət yetirmək', ant: 'qulaqardına vurmaq' },
  { idiom: 'ağzına su almaq', meaning: 'набрать воды в рот, замолчать', syn: 'dilini dişləmək', ant: 'dil-boğaza qoymamaq' },
  { idiom: 'ürəyi açılmaq', meaning: 'повеселеть, отлечь от сердца', syn: 'kefi kökəlmək', ant: 'qanı qaralmaq' },
  { idiom: 'dərdə düşmək', meaning: 'впасть в беду, запечалиться', syn: 'qəmə batmaq', ant: 'üzü gülmək' },
  { idiom: 'ipini çəkmək', meaning: 'обуздать, держать в узде', syn: 'cilovunu yığışdırmaq', ant: 'ixtiyarı əldən vermək' },
  { idiom: 'əl çəkmək', meaning: 'отступиться, оставить в покое', syn: 'vaz keçmək', ant: 'əlini üzməmək' },
  { idiom: 'gözü dolmaq', meaning: 'навернуться слезам на глаза', syn: 'kövrəlmək', ant: 'üzü gülmək' },
  { idiom: 'burnunun ucu göynəmək', meaning: 'очень сильно соскучиться', syn: 'həsrət çəkmək', ant: 'unutmaq' },
  { idiom: 'ağlı kəsmək', meaning: 'понимать, соображать, верить в успех', syn: 'başa düşmək', ant: 'ağlı çaşmaq' },
  { idiom: 'qanı qaralmaq', meaning: 'испортиться настроению, расстроиться', syn: 'kefi pozulmaq', ant: 'ürəyi açılmaq' },
];

export const NON_IDIOM_PHRASES = [
  'yaxşılıq etmək', 'kömək etmək', 'dua etmək', 'təşəkkür etmək',
  'qapıdan çıxmaq', 'beşiyi yırğalamaq', 'kitab oxumaq', 'evdən getmək',
  'məktub yazmaq', 'ağac əkmək', 'çay içmək', 'yoldaşlıq etmək',
  'həll etmək', 'təhsil almaq', 'düşərgə salmaq', 'söz vermək',
];

// Homonyms vs Polysemous words
export const HOMONYMS_BANK = [
  { word: 'yaz', c1: 'Yaz fəslində təbiət oyanır.', c2: 'Dəftərinə səliqəli yaz!', desc: 'омоним: «весна» (сущ.) и «пиши» (глагол)' },
  { word: 'üz', c1: 'Gölün o biri tayına üz!', c2: 'Uşağın gülər üzü hamını sevindirdi.', desc: 'омоним: «плыви» (глагол) и «лицо» (сущ.)' },
  { word: 'ay', c1: 'Gecə səmada bədirlənmiş Ay görünürdü.', c2: 'Bir aydan sonra imtahanlar başlayacaq.', desc: 'омоним: «луна» и «месяц»' },
  { word: 'qol', c1: 'İdmançı qolunu zədələdi.', c2: 'Sənədin altına qol çəkdi.', desc: 'омоним: «рука» и «подпись» (также «гол»)' },
  { word: 'gül', c1: 'Bağçada qırmızı gül açmışdı.', c2: 'Bu lətifəyə hamı kimi sən də gül.', desc: 'омоним: «цветок» (сущ.) и «смейся» (глагол)' },
  { word: 'bal', c1: 'Dağ çiçəklərindən toplanan bal çox faydalıdır.', c2: 'İmtahandan yüksək bal topladı.', desc: 'омоним: «мёд» и «балл»' },
  { word: 'çay', c1: 'Dağdan axan çay kəndi ikiyə bölür.', c2: 'Qonaqlara ətirli çay süzdülər.', desc: 'омоним: «река» и «чай»' },
  { word: 'sağ', c1: 'Yolun sağ tərəfi ilə addımla.', c2: 'İnəyi səhər tezdən sağ.', desc: 'омоним: «правый» (прил.) и «дои» (глагол)' },
];

export const POLYSEMY_BANK = [
  { word: 'baş', c1: 'Xəstənin başı ağrıyırdı.', c2: 'Dağın başında qalın qar var idi.', desc: 'многозначное: перенос по положению («голова» → «вершина горы»)' },
  { word: 'göz', c1: 'Uşağın qara gözləri parlayırdı.', c2: 'Bulağın gözündən sərin su qaynayırdı.', desc: 'многозначное: перенос по сходству («глаз» → «исток родника»)' },
  { word: 'diş', c1: 'Körpənin ilk dişi çıxdı.', c2: 'Mişarın dişləri kütləşmişdi.', desc: 'многозначное: перенос по форме («зуб» → «зубец пилы»)' },
  { word: 'burun', c1: 'Soyuqdan uşağın burnu qızarmışdı.', c2: 'Gəmi Xəzərin qumlu burnuna yaxınlaşdı.', desc: 'многозначное: перенос по форме («нос человека» → «мыс»)' },
  { word: 'ayaq', c1: 'Stolun ayağı sınmışdı.', c2: 'Kəndin ayağında böyük bağ salınmışdı.', desc: 'многозначное: перенос по нижней части («ножка стола» / «окраина»)' },
  { word: 'ətək', c1: 'Qızın uzun ətəyi küləkdə dalğalanırdı.', c2: 'Dağın ətəyində yaşıl çəmənlik uzanırdı.', desc: 'многозначное: перенос «подол одежды» → «подножие горы»' },
  { word: 'boğaz', c1: 'Soyuqdan boğazı ağrıyırdı.', c2: 'Gəmi dar boğazdan keçərək dənizə çıxdı.', desc: 'многозначное: перенос «горло» → «пролив»' },
  { word: 'dil', c1: 'O, üç xarici dil bilir.', c2: 'Alovun dilləri göyə ucalırdı.', desc: 'многозначное: «язык» → «язык пламени»' },
];

// Lexical definitions / archaisms / terms
export const LEXICAL_MEANINGS = [
  { word: 'məxəz', def: 'sənəd, yazılı mənbə', wrongDef: 'naxış növü, bəzək' },
  { word: 'əntiq', def: 'nadir tapılan, qədim və dəyərli', wrongDef: 'müasir üslubda hazırlanmış' },
  { word: 'təlatüm', def: 'çaxnaşma, həyəcan, təlaş', wrongDef: 'sakitlik və sükut' },
  { word: 'məşəqqət', def: 'əzab, əziyyət, ağır çətinlik', wrongDef: 'rahatlıq, səadət' },
  { word: 'təxliyə', def: 'təhlükəli yerdən köçürmə, çıxarma', wrongDef: 'şəhərə yeni əhali yerləşdirmə' },
  { word: 'kələk', def: 'hiylə, fırıldaq, gizli tələ', wrongDef: 'səmimiyyət, açıq söhbət' },
  { word: 'səngimək', def: 'yavaşımaq, azalmaq, sakitləşmək', wrongDef: 'şiddətlənmək, alovlanmaq' },
  { word: 'məmulat', def: 'istehsal olunmuş, hazırlanmış şeylər', wrongDef: 'xammal, işlənməmiş material' },
  { word: 'tablo', def: 'çərçivəyə salınmış rəsm əsəri, şəkil', wrongDef: 'portret və ya xalça ornamenti' },
  { word: 'çapar', def: 'qədimdə təcili xəbər aparan atlı elçi', wrongDef: 'qala divarlarını qoruyan sərkərdə' },
  { word: 'arxaizm (köhnəlmiş söz)', def: 'müasir dildə işlənməyən və ya başqa sözlə əvəzlənmiş qədim söz (məs.: sayru, əsrük)', wrongDef: 'yalnız elm və texnikaya aid xüsusi anlayış' },
  { word: 'termin', def: 'elm, texnika və incəsənətin müxtəlif sahələrinə aid xüsusi söz (məs.: morfem, hipotenuz)', wrongDef: 'bütün insanların gündəlik nitqində işlətdiyi ümumişlək söz' },
];
