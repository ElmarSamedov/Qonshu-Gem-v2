const fs = require('fs');

const data = [];
let counter = 1;

function add(nameEn, nameRu, nameAz, level, parentId, extra = {}) {
  const id = 'nat_' + counter++;
  data.push({
    id,
    name_en: nameEn,
    name_ru: nameRu,
    name_az: nameAz,
    level,
    parent_id: parentId,
    ...extra
  });
  return id;
}

// EUROPE
const europe = add('Europe', 'Европа', 'Avropa', 1, null);
const slavic = add('Slavic peoples', 'Славянские народы', 'Slavyan xalqları', 2, europe);
  const eastSlavic = add('Eastern Slavs', 'Восточные славяне', 'Şərq slavyanları', 3, slavic);
    add('Russians', 'Русские', 'Ruslar', 4, eastSlavic, {iso_codes: ['RU']});
    add('Ukrainians', 'Украинцы', 'Ukraynalılar', 4, eastSlavic, {iso_codes: ['UA']});
    add('Belarusians', 'Белорусы', 'Belaruslar', 4, eastSlavic, {iso_codes: ['BY']});
  const westSlavic = add('Western Slavs', 'Западные славяне', 'Qərb slavyanları', 3, slavic);
    add('Poles', 'Поляки', 'Polyaklar', 4, westSlavic, {iso_codes: ['PL']});
    add('Czechs', 'Чехи', 'Çexlər', 4, westSlavic, {iso_codes: ['CZ']});
    add('Slovaks', 'Словаки', 'Slovaklar', 4, westSlavic, {iso_codes: ['SK']});
    add('Sorbs', 'Лужичане', 'Sorblar', 4, westSlavic, {iso_codes: ['DE']});
    add('Kashubians', 'Кашубы', 'Kaşublar', 4, westSlavic, {iso_codes: ['PL']});
    add('Silesians', 'Силезцы', 'Sileziyalılar', 4, westSlavic, {iso_codes: ['PL']});
  const southSlavic = add('Southern Slavs', 'Южные славяне', 'Cənub slavyanları', 3, slavic);
    add('Serbs', 'Сербы', 'Serblər', 4, southSlavic, {iso_codes: ['RS', 'BA']});
    add('Croats', 'Хорваты', 'Xorvatlar', 4, southSlavic, {iso_codes: ['HR', 'BA']});
    add('Bosniaks', 'Босняки', 'Bosniyalılar', 4, southSlavic, {iso_codes: ['BA']});
    add('Montenegrins', 'Черногорцы', 'Monteneqrolular', 4, southSlavic, {iso_codes: ['ME']});
    add('Macedonians', 'Македонцы', 'Makedonlar', 4, southSlavic, {iso_codes: ['MK']});
    add('Bulgarians', 'Болгары', 'Bolqarlar', 4, southSlavic, {iso_codes: ['BG']});
    add('Slovenes', 'Словенцы', 'Slovenlər', 4, southSlavic, {iso_codes: ['SI']});
    add('Bunjevci', 'Буневцы', 'Bunyevslər', 4, southSlavic, {iso_codes: ['RS']});
    
const germanic = add('Germanic peoples', 'Германские народы', 'German xalqları', 2, europe);
  const northGermanic = add('North Germanic', 'Северогерманские народы', 'Şimali germanlar', 3, germanic);
    add('Swedes', 'Шведы', 'İsveçlilər', 4, northGermanic, {iso_codes: ['SE']});
    add('Norwegians', 'Норвежцы', 'Norveçlilər', 4, northGermanic, {iso_codes: ['NO']});
    add('Danes', 'Датчане', 'Danimarkalılar', 4, northGermanic, {iso_codes: ['DK']});
    add('Icelanders', 'Исландцы', 'İslandlar', 4, northGermanic, {iso_codes: ['IS']});
    add('Faroese', 'Фарерцы', 'Farerlər', 4, northGermanic, {iso_codes: ['FO']});
  const westGermanic = add('West Germanic', 'Западногерманские народы', 'Qərbi germanlar', 3, germanic);
    add('Germans', 'Немцы', 'Almanlar', 4, westGermanic, {iso_codes: ['DE']});
    add('English', 'Англичане', 'İngilislər', 4, westGermanic, {iso_codes: ['GB']});
    add('Dutch', 'Голландцы', 'Niderlandlılar', 4, westGermanic, {iso_codes: ['NL']});
    add('Flemish', 'Фламандцы', 'Flamandlar', 4, westGermanic, {iso_codes: ['BE']});
    add('Afrikaners', 'Африканеры', 'Afrikanerlər', 4, westGermanic, {iso_codes: ['ZA']});
    add('Frisians', 'Фризы', 'Frizlər', 4, westGermanic, {iso_codes: ['NL', 'DE']});

const romance = add('Romance peoples', 'Романские народы', 'Roman xalqları', 2, europe);
  add('Italians', 'Итальянцы', 'İtalyanlar', 3, romance, {iso_codes: ['IT']});
  add('Spaniards', 'Испанцы', 'İspanlar', 3, romance, {iso_codes: ['ES']});
  add('French', 'Французы', 'Fransızlar', 3, romance, {iso_codes: ['FR']});
  add('Portuguese', 'Португальцы', 'Portuqallar', 3, romance, {iso_codes: ['PT']});
  add('Romanians', 'Румыны', 'Rumınlar', 3, romance, {iso_codes: ['RO']});
  add('Moldovans', 'Молдаване', 'Moldovanlar', 3, romance, {iso_codes: ['MD']});
  add('Catalans', 'Каталонцы', 'Katalonlar', 3, romance, {iso_codes: ['ES']});
  add('Galicians', 'Галисийцы', 'Qalisiya xalqı', 3, romance, {iso_codes: ['ES']});
  add('Occitans', 'Окситанцы', 'Oksitanlar', 3, romance, {iso_codes: ['FR']});
  add('Aromanians', 'Аромуны', 'Aromunlar', 3, romance, {iso_codes: ['GR', 'AL']});
  add('Corsicans', 'Корсиканцы', 'Korsikalılar', 3, romance, {iso_codes: ['FR']});
  add('Sardinians', 'Сардинцы', 'Sardiniyalılar', 3, romance, {iso_codes: ['IT']});
  add('Sicilians', 'Сицилийцы', 'Siciliyalılar', 3, romance, {iso_codes: ['IT']});
  add('Walloons', 'Валлоны', 'Vallonlar', 3, romance, {iso_codes: ['BE']});

const celtic = add('Celtic peoples', 'Кельтские народы', 'Kelt xalqları', 2, europe);
  add('Irish', 'Ирландцы', 'İrlandlar', 3, celtic, {iso_codes: ['IE', 'GB']});
  add('Scots', 'Шотландцы', 'Şotlandlar', 3, celtic, {iso_codes: ['GB']});
  add('Welsh', 'Валлийцы', 'Uelslilər', 3, celtic, {iso_codes: ['GB']});
  add('Bretons', 'Бретонцы', 'Bretonlar', 3, celtic, {iso_codes: ['FR']});
  add('Cornish', 'Корнцы', 'Kornlar', 3, celtic, {iso_codes: ['GB']});
  add('Manx', 'Мэнцы', 'Menkslər', 3, celtic, {iso_codes: ['IM']});

const baltic = add('Baltic peoples', 'Балтийские народы', 'Balt xalqları', 2, europe);
  add('Lithuanians', 'Литовцы', 'Litvalılar', 3, baltic, {iso_codes: ['LT']});
  add('Latvians', 'Латыши', 'Latışlar', 3, baltic, {iso_codes: ['LV']});

const finnougric = add('Finno-Ugric peoples', 'Финно-угорские народы', 'Fin-uqor xalqları', 2, europe);
  const finnic = add('Finnic peoples', 'Финно-пермские народы', 'Fin xalqları', 3, finnougric);
    add('Finns', 'Финны', 'Finlər', 4, finnic, {iso_codes: ['FI']});
    add('Estonians', 'Эстонцы', 'Estonlar', 4, finnic, {iso_codes: ['EE']});
    add('Karelians', 'Карелы', 'Karellər', 4, finnic, {iso_codes: ['RU']});
    add('Sami', 'Саамы', 'Saamlar', 4, finnic, {iso_codes: ['NO', 'SE', 'FI', 'RU']});
    add('Komi', 'Коми', 'Komi', 4, finnic, {iso_codes: ['RU']});
    add('Udmurts', 'Удмурты', 'Udmurtlar', 4, finnic, {iso_codes: ['RU']});
    add('Mari', 'Марийцы', 'Marilər', 4, finnic, {iso_codes: ['RU']});
    add('Mordvins', 'Мордва', 'Mordvalar', 4, finnic, {iso_codes: ['RU']});
  const ugric = add('Ugric peoples', 'Угорские народы', 'Uqor xalqları', 3, finnougric);
    add('Hungarians', 'Венгры', 'Macarlar', 4, ugric, {iso_codes: ['HU']});
    add('Khanty', 'Ханты', 'Xantılar', 4, ugric, {iso_codes: ['RU']});
    add('Mansi', 'Манси', 'Mansilər', 4, ugric, {iso_codes: ['RU']});

const basque = add('Basques', 'Баски', 'Basklar', 2, europe, {iso_codes: ['ES', 'FR']});
const greeks = add('Greeks', 'Греки', 'Yunanlar', 2, europe, {iso_codes: ['GR', 'CY']});
const albanians = add('Albanians', 'Албанцы', 'Albanlar', 2, europe, {iso_codes: ['AL', 'XK', 'MK']});
const armenians = add('Armenians', 'Армяне', 'Ermənilər', 2, europe, {iso_codes: ['AM']});
const georgiansEu = add('Georgians', 'Грузины', 'Gürcülər', 2, europe, {iso_codes: ['GE']});

// CAUCASUS
const caucasus = add('Caucasus', 'Кавказ', 'Qafqaz', 1, null);
  const nakhDag = add('Nakh-Dagestanian', 'Нахско-дагестанские народы', 'Nax-Dağıstan xalqları', 2, caucasus);
    add('Avars', 'Аварцы', 'Avarlar', 3, nakhDag, {iso_codes: ['RU', 'AZ']});
    add('Lezgins', 'Лезгины', 'Ləzgilər', 3, nakhDag, {iso_codes: ['RU', 'AZ']});
    add('Chechens', 'Чеченцы', 'Çeçenlər', 3, nakhDag, {iso_codes: ['RU']});
    add('Ingush', 'Ингуши', 'İnquşlar', 3, nakhDag, {iso_codes: ['RU']});
    add('Dargins', 'Даргинцы', 'Dargilər', 3, nakhDag, {iso_codes: ['RU']});
    add('Laks', 'Лакцы', 'Laklar', 3, nakhDag, {iso_codes: ['RU']});
    add('Tabasarans', 'Табасараны', 'Tabasaranlar', 3, nakhDag, {iso_codes: ['RU']});
    add('Rutuls', 'Рутульцы', 'Rutullar', 3, nakhDag, {iso_codes: ['RU', 'AZ']});
    add('Tsakhurs', 'Цахуры', 'Saxurlar', 3, nakhDag, {iso_codes: ['RU', 'AZ']});
    add('Aghuls', 'Агулы', 'Aqullar', 3, nakhDag, {iso_codes: ['RU']});
    add('Udis', 'Удины', 'Udilər', 3, nakhDag, {iso_codes: ['AZ', 'RU']});
    add('Kryts', 'Крызы', 'Qrızlar', 3, nakhDag, {iso_codes: ['AZ']});
    add('Khinalugs', 'Хиналугцы', 'Xınalıqlar', 3, nakhDag, {iso_codes: ['AZ']});
    add('Budukh', 'Будухи', 'Buduqlular', 3, nakhDag, {iso_codes: ['AZ']});
    add('Archi', 'Арчинцы', 'Arçilər', 3, nakhDag, {iso_codes: ['RU']});

  const abkhazAdyghe = add('Abkhaz-Adyghe', 'Абхазо-адыгские народы', 'Abxaz-Adıq xalqları', 2, caucasus);
    add('Circassians', 'Черкесы (Адыги)', 'Çərkəzlər', 3, abkhazAdyghe, {iso_codes: ['RU', 'TR']});
    add('Kabardians', 'Кабардинцы', 'Kabardinlər', 3, abkhazAdyghe, {iso_codes: ['RU']});
    add('Adyghe', 'Адыгейцы', 'Adıgeylər', 3, abkhazAdyghe, {iso_codes: ['RU']});
    add('Abkhazians', 'Абхазы', 'Abxazlar', 3, abkhazAdyghe, {iso_codes: ['GE', 'RU']});
    add('Abazins', 'Абазины', 'Abazinlər', 3, abkhazAdyghe, {iso_codes: ['RU']});

  const kartvelian = add('Kartvelian', 'Картвельские народы', 'Kartvel xalqları', 2, caucasus);
    add('Georgians', 'Грузины', 'Gürcülər', 3, kartvelian, {iso_codes: ['GE']});
    add('Svans', 'Сваны', 'Svanlar', 3, kartvelian, {iso_codes: ['GE']});
    add('Mingrelians', 'Мегрелы', 'Meqrellər', 3, kartvelian, {iso_codes: ['GE']});
    add('Laz', 'Лазы', 'Lazlar', 3, kartvelian, {iso_codes: ['TR', 'GE']});

// TURKIC PEOPLES
const turkic = add('Turkic peoples', 'Тюркские народы', 'Türk xalqları', 1, null);
  const oghuz = add('Oghuz group', 'Огузская группа', 'Oğuz qrupu', 2, turkic);
    add('Azerbaijanis', 'Азербайджанцы', 'Azərbaycanlılar', 3, oghuz, {iso_codes: ['AZ', 'IR', 'RU', 'GE', 'TR']});
    add('Turks', 'Турки', 'Türklər', 3, oghuz, {iso_codes: ['TR', 'DE']});
    add('Turkmens', 'Туркмены', 'Türkmənlər', 3, oghuz, {iso_codes: ['TM', 'IR', 'AF']});
    add('Gagauz', 'Гагаузы', 'Qaqauzlar', 3, oghuz, {iso_codes: ['MD']});
    add('Qashqai', 'Кашкайцы', 'Qaşqaylar', 3, oghuz, {iso_codes: ['IR']});
    add('Afshars', 'Афшары', 'Əfşarlar', 3, oghuz, {iso_codes: ['IR', 'TR', 'AF']});
    add('Khorasani Turks', 'Хорасанские тюрки', 'Xorasan türkləri', 3, oghuz, {iso_codes: ['IR']});
    add('Shahsevan', 'Шахсевены', 'Şahsevənlər', 3, oghuz, {iso_codes: ['IR', 'AZ']});
    add('Turkomans', 'Туркоманы', 'İraq türkmanları', 3, oghuz, {iso_codes: ['IQ', 'SY']});
    
  const kipchak = add('Kipchak group', 'Кыпчакская группа', 'Qıpçaq qrupu', 2, turkic);
    add('Kazakhs', 'Казахи', 'Qazaxlar', 3, kipchak, {iso_codes: ['KZ', 'CN', 'UZ', 'RU']});
    add('Tatars', 'Татары', 'Tatarlar', 3, kipchak, {iso_codes: ['RU']});
    add('Bashkirs', 'Башкиры', 'Başqırdlar', 3, kipchak, {iso_codes: ['RU']});
    add('Kyrgyz', 'Кыргызы', 'Qırğızlar', 3, kipchak, {iso_codes: ['KG', 'CN']});
    add('Karakalpaks', 'Каракалпаки', 'Qaraqalpaqlar', 3, kipchak, {iso_codes: ['UZ']});
    add('Kumyks', 'Кумыки', 'Qumuqlar', 3, kipchak, {iso_codes: ['RU']});
    add('Karachays', 'Карачаевцы', 'Qaraçaylar', 3, kipchak, {iso_codes: ['RU']});
    add('Balkars', 'Балкарцы', 'Balkarlar', 3, kipchak, {iso_codes: ['RU']});
    add('Nogais', 'Ногайцы', 'Noqaylar', 3, kipchak, {iso_codes: ['RU']});
    add('Crimean Tatars', 'Крымские татары', 'Krım tatarları', 3, kipchak, {iso_codes: ['UA', 'RU']});
    add('Karaims', 'Караимы', 'Qaraimlər', 3, kipchak, {iso_codes: ['LT', 'UA', 'RU']});
    add('Krymchaks', 'Крымчаки', 'Krımçaklar', 3, kipchak, {iso_codes: ['UA', 'RU']});

  const karluk = add('Karluk group', 'Карлукская группа', 'Qarluq qrupu', 2, turkic);
    add('Uzbeks', 'Узбеки', 'Özbəklər', 3, karluk, {iso_codes: ['UZ', 'AF', 'TJ', 'KG']});
    add('Uyghurs', 'Уйгуры', 'Uyğurlar', 3, karluk, {iso_codes: ['CN', 'KZ']});
    add('Ili Turki', 'Илийские тюрки', 'İli türkləri', 3, karluk, {iso_codes: ['CN']});

  const siberian = add('Siberian Turkic', 'Сибирские тюрки', 'Sibir türkləri', 2, turkic);
    add('Yakuts (Sakha)', 'Якуты (Саха)', 'Yakutlar (Saxa)', 3, siberian, {iso_codes: ['RU']});
    add('Tuvans', 'Тувинцы', 'Tuvalar', 3, siberian, {iso_codes: ['RU', 'MN']});
    add('Altai', 'Алтайцы', 'Altaylar', 3, siberian, {iso_codes: ['RU']});
    add('Khakas', 'Хакасы', 'Xakaslar', 3, siberian, {iso_codes: ['RU']});
    add('Shor', 'Шорцы', 'Şorlar', 3, siberian, {iso_codes: ['RU']});
    add('Dolgan', 'Долганы', 'Dolqanlar', 3, siberian, {iso_codes: ['RU']});
    add('Chulyms', 'Чулымцы', 'Çulımlar', 3, siberian, {iso_codes: ['RU']});

// ASIA & MIDDLE EAST
const asia = add('Asia & Middle East', 'Азия и Ближний Восток', 'Asiya və Yaxın Şərq', 1, null);
  const semitic = add('Semitic peoples', 'Семитские народы', 'Semit xalqları', 2, asia);
    add('Arabs', 'Арабы', 'Ərəblər', 3, semitic, {iso_codes: ['SA', 'EG', 'IQ', 'SY', 'AE']});
    add('Jews', 'Евреи', 'Yəhudilər', 3, semitic, {iso_codes: ['IL', 'US']});
    add('Assyrians', 'Ассирийцы', 'Assuriyalılar', 3, semitic, {iso_codes: ['IQ', 'SY', 'IR', 'TR']});
    add('Mandaeans', 'Мандеи', 'Mandeylər', 3, semitic, {iso_codes: ['IQ', 'IR']});
    add('Samaritans', 'Самаритяне', 'Samariyalılar', 3, semitic, {iso_codes: ['IL', 'PS']});

  const iranic = add('Iranic peoples', 'Иранские народы', 'İran xalqları', 2, asia);
    add('Persians', 'Персы', 'Farslar', 3, iranic, {iso_codes: ['IR']});
    add('Kurds', 'Курды', 'Kürdlər', 3, iranic, {iso_codes: ['TR', 'IQ', 'IR', 'SY']});
    add('Pashtuns', 'Пуштуны', 'Puştunlar', 3, iranic, {iso_codes: ['AF', 'PK']});
    add('Baloch', 'Белуджи', 'Bəluclar', 3, iranic, {iso_codes: ['PK', 'IR', 'AF']});
    add('Tajiks', 'Таджики', 'Taciklər', 3, iranic, {iso_codes: ['TJ', 'AF', 'UZ']});
    add('Lurs', 'Луры', 'Lurlar', 3, iranic, {iso_codes: ['IR']});
    add('Gilaks', 'Гилянцы', 'Giləklər', 3, iranic, {iso_codes: ['IR']});
    add('Mazanderanis', 'Мазендеранцы', 'Mazandaranlılar', 3, iranic, {iso_codes: ['IR']});
    add('Talysh', 'Талыши', 'Talışlar', 3, iranic, {iso_codes: ['IR', 'AZ']});
    add('Ossetians', 'Осетины', 'Osetinlər', 3, iranic, {iso_codes: ['RU', 'GE']});
    add('Pamiris', 'Памирцы', 'Pamirlilər', 3, iranic, {iso_codes: ['TJ', 'AF']});
    add('Zazas', 'Заза', 'Zazalar', 3, iranic, {iso_codes: ['TR']});
    add('Tats', 'Таты', 'Tatlar', 3, iranic, {iso_codes: ['AZ', 'RU', 'IR']});

  const indoAryan = add('Indo-Aryan peoples', 'Индоарийские народы', 'Hind-ari xalqları', 2, asia);
    add('Hindustanis', 'Хиндустанцы', 'Hindustanlılar', 3, indoAryan, {iso_codes: ['IN']});
    add('Bengalis', 'Бенгальцы', 'Benqallar', 3, indoAryan, {iso_codes: ['BD', 'IN']});
    add('Punjabis', 'Пенджабцы', 'Pəncablılar', 3, indoAryan, {iso_codes: ['PK', 'IN']});
    add('Marathi', 'Маратхи', 'Marathilər', 3, indoAryan, {iso_codes: ['IN']});
    add('Gujaratis', 'Гуджаратцы', 'Qucaratlılar', 3, indoAryan, {iso_codes: ['IN']});
    add('Odia', 'Ория', 'Oriyalar', 3, indoAryan, {iso_codes: ['IN']});
    add('Sindhis', 'Синдхи', 'Sindhilər', 3, indoAryan, {iso_codes: ['PK', 'IN']});
    add('Sinhalese', 'Сингалы', 'Sinhalar', 3, indoAryan, {iso_codes: ['LK']});
    add('Nepali', 'Непальцы', 'Nepallılar', 3, indoAryan, {iso_codes: ['NP']});
    add('Romani', 'Цыгане', 'Qaraçılar', 3, indoAryan, {iso_codes: ['RO', 'BG', 'ES', 'TR']});

  const dravidian = add('Dravidian peoples', 'Дравидийские народы', 'Dravid xalqları', 2, asia);
    add('Telugu', 'Телугу', 'Teluqu', 3, dravidian, {iso_codes: ['IN']});
    add('Tamils', 'Тамилы', 'Tamillər', 3, dravidian, {iso_codes: ['IN', 'LK']});
    add('Kannadigas', 'Каннара', 'Kannadalar', 3, dravidian, {iso_codes: ['IN']});
    add('Malayalis', 'Малаяли', 'Malayalilər', 3, dravidian, {iso_codes: ['IN']});
    add('Brahui', 'Брагуи', 'Brahui', 3, dravidian, {iso_codes: ['PK']});

  const sinoTibetan = add('Sino-Tibetan peoples', 'Сино-тибетские народы', 'Çin-Tibet xalqları', 2, asia);
    add('Han Chinese', 'Ханьцы (Китайцы)', 'Xan (Çinlilər)', 3, sinoTibetan, {iso_codes: ['CN']});
    add('Tibetans', 'Тибетцы', 'Tibetlilər', 3, sinoTibetan, {iso_codes: ['CN']});
    add('Burmese', 'Бирманцы', 'Birmalılar', 3, sinoTibetan, {iso_codes: ['MM']});
    add('Karen', 'Карены', 'Karenlər', 3, sinoTibetan, {iso_codes: ['MM', 'TH']});
    add('Yi (Lolo)', 'И (Лоло)', 'Yi', 3, sinoTibetan, {iso_codes: ['CN']});

  const austroasiatic = add('Austroasiatic peoples', 'Австроазиатские народы', 'Avstroasiya xalqları', 2, asia);
    add('Vietnamese', 'Вьетнамцы', 'Vyetnamlılar', 3, austroasiatic, {iso_codes: ['VN']});
    add('Khmer', 'Кхмеры', 'Kxmerlər', 3, austroasiatic, {iso_codes: ['KH']});
    add('Mon', 'Моны', 'Monlar', 3, austroasiatic, {iso_codes: ['MM', 'TH']});
    add('Munda', 'Мунда', 'Munda', 3, austroasiatic, {iso_codes: ['IN']});

  const austronesian = add('Austronesian peoples (Asia)', 'Австронезийские народы (Азия)', 'Avstroneziya xalqları', 2, asia);
    add('Javanese', 'Яванцы', 'Yavalılar', 3, austronesian, {iso_codes: ['ID']});
    add('Sundanese', 'Сунданцы', 'Sundanlılar', 3, austronesian, {iso_codes: ['ID']});
    add('Malays', 'Малайцы', 'Malaylar', 3, austronesian, {iso_codes: ['MY', 'ID']});
    add('Tagalog', 'Тагалы', 'Taqaloqlar', 3, austronesian, {iso_codes: ['PH']});
    add('Visayans', 'Висайя', 'Visayalar', 3, austronesian, {iso_codes: ['PH']});
    add('Madurese', 'Мадурцы', 'Maduriyalılar', 3, austronesian, {iso_codes: ['ID']});
    add('Minangkabau', 'Минангкабау', 'Minanqkabaular', 3, austronesian, {iso_codes: ['ID']});
    add('Buginese', 'Бугисы', 'Bugislər', 3, austronesian, {iso_codes: ['ID']});

  const mongolic = add('Mongolic peoples', 'Монгольские народы', 'Monqol xalqları', 2, asia);
    add('Mongols', 'Монголы', 'Monqollar', 3, mongolic, {iso_codes: ['MN', 'CN']});
    add('Buryats', 'Буряты', 'Buryatlar', 3, mongolic, {iso_codes: ['RU', 'MN']});
    add('Kalmyks', 'Калмыки', 'Kalmıklar', 3, mongolic, {iso_codes: ['RU']});
    add('Oirats', 'Ойраты', 'Oyratlar', 3, mongolic, {iso_codes: ['MN', 'CN']});
    add('Daur', 'Дауры', 'Daurlar', 3, mongolic, {iso_codes: ['CN']});

  const tungusic = add('Tungusic peoples', 'Тунгусо-маньчжурские народы', 'Tunqus-mancur xalqları', 2, asia);
    add('Manchu', 'Маньчжуры', 'Mancurlar', 3, tungusic, {iso_codes: ['CN']});
    add('Evenks', 'Эвенки', 'Evenklər', 3, tungusic, {iso_codes: ['RU', 'CN']});
    add('Evens', 'Эвены', 'Evenlər', 3, tungusic, {iso_codes: ['RU']});
    add('Nanai', 'Нанайцы', 'Nanaylar', 3, tungusic, {iso_codes: ['RU', 'CN']});

  const japonic = add('Japonic peoples', 'Японо-рюкюские народы', 'Yapon-Ryukyu xalqları', 2, asia);
    add('Japanese', 'Японцы', 'Yaponlar', 3, japonic, {iso_codes: ['JP']});
    add('Ryukyuans', 'Рюкюсцы', 'Ryukyular', 3, japonic, {iso_codes: ['JP']});

  const koreanic = add('Koreanic peoples', 'Корейцы', 'Koreyalılar', 2, asia);
    add('Koreans', 'Корейцы', 'Koreyalılar', 3, koreanic, {iso_codes: ['KR', 'KP', 'CN']});

  const paleosiberian = add('Paleo-Siberian', 'Палеоазиатские народы', 'Paleo-Sibir xalqları', 2, asia);
    add('Chukchi', 'Чукчи', 'Çukçalar', 3, paleosiberian, {iso_codes: ['RU']});
    add('Koryaks', 'Коряки', 'Koryaklar', 3, paleosiberian, {iso_codes: ['RU']});
    add('Nivkhs', 'Нивхи', 'Nivxlər', 3, paleosiberian, {iso_codes: ['RU']});
    add('Yukaghirs', 'Юкагиры', 'Yukaqirlər', 3, paleosiberian, {iso_codes: ['RU']});
    add('Ainu', 'Айны', 'Aynular', 3, paleosiberian, {iso_codes: ['JP', 'RU']});

// AFRICA
const africa = add('Africa', 'Африка', 'Afrika', 1, null);
  const afroAsiatic = add('Afroasiatic (Africa)', 'Афразийские народы', 'Afro-asiya xalqları', 2, africa);
    add('Berbers (Amazigh)', 'Берберы (Амазиги)', 'Bərbərlər (Amaziqlər)', 3, afroAsiatic, {iso_codes: ['MA', 'DZ', 'LY', 'ML', 'NE']});
    add('Tuareg', 'Туареги', 'Tuareqlər', 3, afroAsiatic, {iso_codes: ['ML', 'NE', 'DZ', 'LY']});
    add('Oromo', 'Оромо', 'Oromolar', 3, afroAsiatic, {iso_codes: ['ET']});
    add('Somalis', 'Сомалийцы', 'Somalilər', 3, afroAsiatic, {iso_codes: ['SO', 'ET', 'KE']});
    add('Amhara', 'Амхара', 'Amharalar', 3, afroAsiatic, {iso_codes: ['ET']});
    add('Tigrayans', 'Тыграй', 'Tiqraylar', 3, afroAsiatic, {iso_codes: ['ET', 'ER']});
    add('Hausa', 'Хауса', 'Hausalar', 3, afroAsiatic, {iso_codes: ['NG', 'NE']});

  const nigerCongo = add('Niger-Congo peoples', 'Нигеро-конголезские народы', 'Niger-Konqo xalqları', 2, africa);
    add('Yoruba', 'Йоруба', 'Yorubalar', 3, nigerCongo, {iso_codes: ['NG', 'BJ']});
    add('Igbo', 'Игбо', 'İqbolar', 3, nigerCongo, {iso_codes: ['NG']});
    add('Fulani', 'Фульбе (Фулани)', 'Fulanilər', 3, nigerCongo, {iso_codes: ['NG', 'GN', 'SN', 'CM']});
    add('Akan', 'Аканы', 'Akanlar', 3, nigerCongo, {iso_codes: ['GH', 'CI']});
    add('Zulu', 'Зулусы', 'Zulular', 3, nigerCongo, {iso_codes: ['ZA']});
    add('Xhosa', 'Коса', 'Kosa', 3, nigerCongo, {iso_codes: ['ZA']});
    add('Shona', 'Шона', 'Şona', 3, nigerCongo, {iso_codes: ['ZW']});
    add('Kikuyu', 'Кикуйю', 'Kikuyular', 3, nigerCongo, {iso_codes: ['KE']});
    add('Kongo', 'Конго', 'Konqo xalqı', 3, nigerCongo, {iso_codes: ['CD', 'CG', 'AO']});
    add('Luba', 'Луба', 'Lubalar', 3, nigerCongo, {iso_codes: ['CD']});
    add('Hutu', 'Хуту', 'Xutular', 3, nigerCongo, {iso_codes: ['RW', 'BI']});
    add('Tutsi', 'Тутси', 'Tutsilər', 3, nigerCongo, {iso_codes: ['RW', 'BI']});

  const niloSaharan = add('Nilo-Saharan peoples', 'Нило-сахарские народы', 'Nil-Saxara xalqları', 2, africa);
    add('Luo', 'Луо', 'Luo', 3, niloSaharan, {iso_codes: ['KE', 'TZ', 'UG']});
    add('Dinka', 'Динка', 'Dinkalar', 3, niloSaharan, {iso_codes: ['SS']});
    add('Nuer', 'Нуэр', 'Nuerlər', 3, niloSaharan, {iso_codes: ['SS']});
    add('Maasai', 'Масаи', 'Masailər', 3, niloSaharan, {iso_codes: ['KE', 'TZ']});
    add('Kanuri', 'Канури', 'Kanurilər', 3, niloSaharan, {iso_codes: ['NG', 'TD', 'NE']});
    add('Songhai', 'Сонгай', 'Sonqaylar', 3, niloSaharan, {iso_codes: ['ML', 'NE']});

  const khoisan = add('Khoisan peoples', 'Койсанские народы', 'Koysan xalqları', 2, africa);
    add('San (Bushmen)', 'Сан (Бушмены)', 'San (Buşmenlər)', 3, khoisan, {iso_codes: ['BW', 'NA', 'ZA']});
    add('Khoekhoe (Hottentots)', 'Кхой-кхой (Готтентоты)', 'Koy-Koy (Hottentotlar)', 3, khoisan, {iso_codes: ['NA', 'ZA']});

// AMERICAS
const americas = add('Americas', 'Америка (Северная и Южная)', 'Amerika', 1, null);
  const northIndigenous = add('North American Indigenous', 'Индейцы Северной Америки', 'Şimali Amerika Yerliləri', 2, americas);
    add('Navajo', 'Навахо', 'Navaxo', 3, northIndigenous, {iso_codes: ['US']});
    add('Cherokee', 'Чероки', 'Çeroki', 3, northIndigenous, {iso_codes: ['US']});
    add('Ojibwe', 'Оджибве', 'Ocibve', 3, northIndigenous, {iso_codes: ['US', 'CA']});
    add('Cree', 'Кри', 'Kri', 3, northIndigenous, {iso_codes: ['CA']});
    add('Inuit', 'Инуиты (Эскимосы)', 'İnuitlər', 3, northIndigenous, {iso_codes: ['CA', 'GL', 'US']});
    add('Apache', 'Апачи', 'Apaçilər', 3, northIndigenous, {iso_codes: ['US']});
    add('Lakota', 'Лакота (Сиу)', 'Lakota (Siu)', 3, northIndigenous, {iso_codes: ['US']});
    add('Iroquois', 'Ирокезы', 'İrokezlər', 3, northIndigenous, {iso_codes: ['US', 'CA']});
    add('Comanche', 'Команчи', 'Komançilər', 3, northIndigenous, {iso_codes: ['US']});
    add('Pueblo', 'Пуэбло', 'Pueblo', 3, northIndigenous, {iso_codes: ['US']});

  const mesoMeso = add('Mesoamerican Indigenous', 'Индейцы Мезоамерики', 'Mezoamerika Yerliləri', 2, americas);
    add('Nahua (Aztecs)', 'Нахуа (Ацтеки)', 'Nahua (Asteklər)', 3, mesoMeso, {iso_codes: ['MX']});
    add('Maya', 'Майя', 'Mayyalılar', 3, mesoMeso, {iso_codes: ['MX', 'GT', 'BZ']});
    add('Zapotecs', 'Сапотеки', 'Zapoteklər', 3, mesoMeso, {iso_codes: ['MX']});
    add('Mixtecs', 'Миштеки', 'Mişteklər', 3, mesoMeso, {iso_codes: ['MX']});

  const southIndigenous = add('South American Indigenous', 'Индейцы Южной Америки', 'Cənubi Amerika Yerliləri', 2, americas);
    add('Quechua (Inca)', 'Кечуа (Инки)', 'Keçua (İnklər)', 3, southIndigenous, {iso_codes: ['PE', 'BO', 'EC']});
    add('Aymara', 'Аймара', 'Aymara', 3, southIndigenous, {iso_codes: ['BO', 'PE']});
    add('Mapuche', 'Мапуче (Арауканы)', 'Mapuçe', 3, southIndigenous, {iso_codes: ['CL', 'AR']});
    add('Guarani', 'Гуарани', 'Quarani', 3, southIndigenous, {iso_codes: ['PY', 'BR', 'AR']});
    add('Yanomami', 'Яномами', 'Yanomami', 3, southIndigenous, {iso_codes: ['BR', 'VE']});
    add('Tupi', 'Тупи', 'Tupi', 3, southIndigenous, {iso_codes: ['BR']});
    add('Wayuu', 'Ваюу', 'Vayuu', 3, southIndigenous, {iso_codes: ['CO', 'VE']});

// OCEANIA
const oceania = add('Oceania', 'Океания', 'Okeaniya', 1, null);
  const polynesian = add('Polynesians', 'Полинезийцы', 'Polineziyalılar', 2, oceania);
    add('Native Hawaiians', 'Гавайцы', 'Havaylılar', 3, polynesian, {iso_codes: ['US']});
    add('Māori', 'Маори', 'Maorilər', 3, polynesian, {iso_codes: ['NZ']});
    add('Samoans', 'Самоанцы', 'Samoalılar', 3, polynesian, {iso_codes: ['WS', 'AS']});
    add('Tongans', 'Тонганцы', 'Tonqalılar', 3, polynesian, {iso_codes: ['TO']});
    add('Tahitians', 'Таитяне', 'Taitililər', 3, polynesian, {iso_codes: ['PF']});

  const micronesian = add('Micronesians', 'Микронезийцы', 'Mikroneziyalılar', 2, oceania);
    add('Chamorro', 'Чаморро', 'Çamorro', 3, micronesian, {iso_codes: ['GU', 'MP']});
    add('Marshallese', 'Маршалльцы', 'Marşallılar', 3, micronesian, {iso_codes: ['MH']});
    add('Palauans', 'Палауанцы', 'Palaulular', 3, micronesian, {iso_codes: ['PW']});

  const melanesian = add('Melanesians', 'Меланезийцы', 'Melaneziyalılar', 2, oceania);
    add('Fijians', 'Фиджийцы', 'Ficililər', 3, melanesian, {iso_codes: ['FJ']});
    add('Kanak', 'Канаки', 'Kanaklar', 3, melanesian, {iso_codes: ['NC']});
    add('Ni-Vanuatu', 'Ни-вануату', 'Ni-Vanuatu', 3, melanesian, {iso_codes: ['VU']});

  const papuan = add('Papuan peoples', 'Папуасы', 'Papuaslar', 2, oceania);
    add('Huli', 'Хули', 'Huli', 3, papuan, {iso_codes: ['PG']});
    add('Asmat', 'Асматы', 'Asmatlar', 3, papuan, {iso_codes: ['ID']});
    add('Dani', 'Дани', 'Dani', 3, papuan, {iso_codes: ['ID']});

  const aboriginal = add('Australian Aboriginals', 'Австралийские аборигены', 'Avstraliya aborigenləri', 2, oceania);
    add('Pitjantjatjara', 'Питянтятяра', 'Pitcantcatyara', 3, aboriginal, {iso_codes: ['AU']});
    add('Arrernte', 'Аранда', 'Arrernte', 3, aboriginal, {iso_codes: ['AU']});
    add('Noongar', 'Нунгар', 'Nunqar', 3, aboriginal, {iso_codes: ['AU']});

fs.writeFileSync('src/data/nationalities.json', JSON.stringify(data, null, 2));
console.log('Generated ' + data.length + ' nationalities.');
