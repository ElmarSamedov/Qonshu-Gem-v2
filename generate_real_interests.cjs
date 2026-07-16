const fs = require('fs');

const interests = [];
let idCounter = 1;

function addNode(en, ru, az, parent_id, level) {
  const id = `int_${idCounter++}`;
  interests.push({
    id,
    parent_id,
    interest_en: en,
    interest_ru: ru,
    interest_az: az,
    level
  });
  return id;
}

// 1. Music (1600 items)
const musicId = addNode('Music', 'Музыка', 'Musiqi', null, 'interest');
const musicGenres = [
  {en: 'Electronic', ru: 'Электронная', az: 'Elektron'}, {en: 'Rock', ru: 'Рок', az: 'Rok'},
  {en: 'Pop', ru: 'Поп', az: 'Pop'}, {en: 'Hip Hop', ru: 'Хип-хоп', az: 'Hip-Hop'},
  {en: 'Jazz', ru: 'Джаз', az: 'Caz'}, {en: 'Classical', ru: 'Классическая', az: 'Klassik'},
  {en: 'Blues', ru: 'Блюз', az: 'Blüz'}, {en: 'Country', ru: 'Кантри', az: 'Kantri'},
  {en: 'Metal', ru: 'Метал', az: 'Metal'}, {en: 'Folk', ru: 'Фолк', az: 'Folk'},
  {en: 'Reggae', ru: 'Регги', az: 'Reqqi'}, {en: 'Soul', ru: 'Соул', az: 'Soul'},
  {en: 'R&B', ru: 'R&B', az: 'R&B'}, {en: 'Funk', ru: 'Фанк', az: 'Fank'},
  {en: 'Disco', ru: 'Диско', az: 'Disko'}, {en: 'House', ru: 'Хаус', az: 'Haus'},
  {en: 'Techno', ru: 'Техно', az: 'Texno'}, {en: 'Trance', ru: 'Транс', az: 'Trans'},
  {en: 'Dubstep', ru: 'Дабстеп', az: 'Dabstep'}, {en: 'Drum & Bass', ru: 'Драм-н-бейс', az: 'Drum & Bass'}
];
const musicSubgenres = [
  {en: 'Classic', ru: 'Классика', az: 'Klassika'}, {en: 'Modern', ru: 'Современный', az: 'Müasir'},
  {en: 'Underground', ru: 'Андеграунд', az: 'Andeqraund'}, {en: 'Experimental', ru: 'Экспериментальный', az: 'Eksperimental'},
  {en: 'Alternative', ru: 'Альтернативный', az: 'Alternativ'}, {en: 'Indie', ru: 'Инди', az: 'İndi'},
  {en: 'Instrumental', ru: 'Инструментальный', az: 'İnstrumental'}, {en: 'Vocal', ru: 'Вокальный', az: 'Vokal'},
  {en: 'Acoustic', ru: 'Акустический', az: 'Akustik'}, {en: 'Electronic fusion', ru: 'Электронный фьюжн', az: 'Elektron fyujn'}
];
const musicRoles = [
  {en: 'Listening', ru: 'Прослушивание', az: 'Dinləmə'}, {en: 'DJing', ru: 'Диджеинг', az: 'DJ-lik'},
  {en: 'Production', ru: 'Создание музыки', az: 'Musiqi yaradıcılığı'}, {en: 'Live Performance', ru: 'Живые выступления', az: 'Canlı ifa'},
  {en: 'History & Theory', ru: 'История и теория', az: 'Tarix və nəzəriyyə'}, {en: 'Collecting (Vinyl/CDs)', ru: 'Коллекционирование', az: 'Kolleksiya'},
  {en: 'Review & Criticism', ru: 'Критика', az: 'Tənqid'}, {en: 'Festivals', ru: 'Фестивали', az: 'Festivallar'}
];
for (let g of musicGenres) {
  let gId = addNode(g.en, g.ru, g.az, musicId, 'subcategory');
  for (let sg of musicSubgenres) {
    let sgId = addNode(`${g.en} - ${sg.en}`, `${g.ru} - ${sg.ru}`, `${g.az} - ${sg.az}`, gId, 'refinement');
    for (let r of musicRoles) { addNode(r.en, r.ru, r.az, sgId, 'specialization'); }
  }
}

// 2. Programming (2400)
const progId = addNode('Programming & IT', 'Программирование и ИТ', 'Proqramlaşdırma və İT', null, 'interest');
const progDomains = [
  {en: 'Backend', ru: 'Бэкенд', az: 'Backend'}, {en: 'Frontend', ru: 'Фронтенд', az: 'Frontend'},
  {en: 'Mobile', ru: 'Мобильная разработка', az: 'Mobil'}, {en: 'Data Science', ru: 'Наука о данных', az: 'Data Science'},
  {en: 'AI / ML', ru: 'ИИ / МО', az: 'Süni İntellekt'}, {en: 'DevOps', ru: 'DevOps', az: 'DevOps'},
  {en: 'Cybersecurity', ru: 'Кибербезопасность', az: 'Kibertəhlükəsizlik'}, {en: 'Game Dev', ru: 'Разработка игр', az: 'Oyun proqramlaşdırması'},
  {en: 'Embedded', ru: 'Встраиваемые', az: 'Quraşdırılmış'}, {en: 'Cloud', ru: 'Облака', az: 'Bulud'},
  {en: 'Blockchain', ru: 'Блокчейн', az: 'Blokçeyn'}, {en: 'QA / Testing', ru: 'QA / Тестирование', az: 'Testləşdirmə'},
  {en: 'UI/UX', ru: 'UI/UX Дизайн', az: 'UI/UX'}, {en: 'DB Admin', ru: 'БД', az: 'Baza idarəetmə'},
  {en: 'Systems', ru: 'Системное', az: 'Sistem'}
];
const progLangs = [
  {en: 'Python', ru: 'Python', az: 'Python'}, {en: 'JavaScript', ru: 'JavaScript', az: 'JavaScript'},
  {en: 'TypeScript', ru: 'TypeScript', az: 'TypeScript'}, {en: 'Java', ru: 'Java', az: 'Java'},
  {en: 'C++', ru: 'C++', az: 'C++'}, {en: 'C#', ru: 'C#', az: 'C#'},
  {en: 'Ruby', ru: 'Ruby', az: 'Ruby'}, {en: 'Go', ru: 'Go', az: 'Go'},
  {en: 'Rust', ru: 'Rust', az: 'Rust'}, {en: 'Swift', ru: 'Swift', az: 'Swift'},
  {en: 'Kotlin', ru: 'Kotlin', az: 'Kotlin'}, {en: 'PHP', ru: 'PHP', az: 'PHP'},
  {en: 'Dart', ru: 'Dart', az: 'Dart'}, {en: 'Scala', ru: 'Scala', az: 'Scala'},
  {en: 'R', ru: 'R', az: 'R'}, {en: 'SQL', ru: 'SQL', az: 'SQL'},
  {en: 'NoSQL', ru: 'NoSQL', az: 'NoSQL'}, {en: 'Bash', ru: 'Bash', az: 'Bash'},
  {en: 'Haskell', ru: 'Haskell', az: 'Haskell'}, {en: 'Elixir', ru: 'Elixir', az: 'Elixir'}
];
const progTools = [
  {en: 'Architecture', ru: 'Архитектура', az: 'Memarlıq'}, {en: 'Frameworks', ru: 'Фреймворки', az: 'Freymvorklar'},
  {en: 'Tooling & CI/CD', ru: 'Инструменты и CI/CD', az: 'Alətlər'}, {en: 'Performance', ru: 'Оптимизация', az: 'Performans'},
  {en: 'Open Source', ru: 'Open Source', az: 'Open Source'}, {en: 'Mentoring', ru: 'Наставничество', az: 'Mentorluq'},
  {en: 'Freelance', ru: 'Фриланс', az: 'Frilans'}, {en: 'Startups', ru: 'Стартапы', az: 'Startaplar'}
];
for (let d of progDomains) {
  let dId = addNode(d.en, d.ru, d.az, progId, 'subcategory');
  for (let l of progLangs) {
    let lId = addNode(l.en, l.ru, l.az, dId, 'refinement');
    for (let t of progTools) { addNode(t.en, t.ru, t.az, lId, 'specialization'); }
  }
}

// 3. Sports (1500)
const sportsId = addNode('Sports', 'Спорт', 'İdman', null, 'interest');
const sportsList = [
  {en: 'Football', ru: 'Футбол', az: 'Futbol'}, {en: 'Basketball', ru: 'Баскетбол', az: 'Basketbol'},
  {en: 'Tennis', ru: 'Теннис', az: 'Tennis'}, {en: 'Volleyball', ru: 'Волейбол', az: 'Voleybol'},
  {en: 'Hockey', ru: 'Хоккей', az: 'Hokkey'}, {en: 'Rugby', ru: 'Регби', az: 'Reqbi'},
  {en: 'Cricket', ru: 'Крикет', az: 'Kriket'}, {en: 'Baseball', ru: 'Бейсбол', az: 'Beysbol'},
  {en: 'Amer. Football', ru: 'Амер. футбол', az: 'Amer. futbolu'}, {en: 'Golf', ru: 'Гольф', az: 'Qolf'},
  {en: 'Boxing', ru: 'Бокс', az: 'Boks'}, {en: 'MMA', ru: 'ММА', az: 'MMA'},
  {en: 'Wrestling', ru: 'Борьба', az: 'Güləş'}, {en: 'Athletics', ru: 'Легкая атлетика', az: 'Yüngül atletika'},
  {en: 'Swimming', ru: 'Плавание', az: 'Üzgüçülük'}, {en: 'Cycling', ru: 'Велоспорт', az: 'Velosport'},
  {en: 'Gymnastics', ru: 'Гимнастика', az: 'Gimnastika'}, {en: 'Weightlifting', ru: 'Тяжелая атлетика', az: 'Ağır atletika'},
  {en: 'Table Tennis', ru: 'Наст. теннис', az: 'Stolüstü tennis'}, {en: 'Badminton', ru: 'Бадминтон', az: 'Badminton'},
  {en: 'Skiing', ru: 'Лыжи', az: 'Xizək'}, {en: 'Snowboarding', ru: 'Сноуборд', az: 'Snoubord'},
  {en: 'Surfing', ru: 'Серфинг', az: 'Sörfinq'}, {en: 'Skateboarding', ru: 'Скейтбординг', az: 'Skeytbordinq'},
  {en: 'Esports', ru: 'Киберспорт', az: 'Kibersport'}
];
const sportsRoles = [
  {en: 'Pro Player', ru: 'Профи', az: 'Peşəkar'}, {en: 'Amateur', ru: 'Любитель', az: 'Həvəskar'},
  {en: 'Coach', ru: 'Тренер', az: 'Məşqçi'}, {en: 'Referee', ru: 'Судья', az: 'Hakim'},
  {en: 'Fan', ru: 'Фанат', az: 'Azarkeş'}, {en: 'Analyst', ru: 'Аналитик', az: 'Analitik'},
  {en: 'Photographer', ru: 'Фотограф', az: 'Fotoqraf'}, {en: 'Manager', ru: 'Менеджер', az: 'Menecer'},
  {en: 'Collector', ru: 'Коллекционер', az: 'Kolleksiyaçı'}, {en: 'Historian', ru: 'Историк', az: 'Tarixçi'}
];
const sportsSpecs = [
  {en: 'Local Tournaments', ru: 'Местные турниры', az: 'Yerli turnirlər'}, {en: 'International', ru: 'Международные', az: 'Beynəlxalq'},
  {en: 'Youth', ru: 'Молодежные', az: 'Gənclər'}, {en: 'Tactics', ru: 'Тактика', az: 'Taktika'},
  {en: 'Fitness', ru: 'Фитнес', az: 'Fitnes'}, {en: 'Nutrition', ru: 'Питание', az: 'Qidalanma'}
];
for (let s of sportsList) {
  let sId = addNode(s.en, s.ru, s.az, sportsId, 'subcategory');
  for (let r of sportsRoles) {
    let rId = addNode(r.en, r.ru, r.az, sId, 'refinement');
    for (let spec of sportsSpecs) { addNode(spec.en, spec.ru, spec.az, rId, 'specialization'); }
  }
}

// 4. Travel (1200)
const travelId = addNode('Travel & Tourism', 'Путешествия и туризм', 'Səyahət və Turizm', null, 'interest');
const travelRegions = [
  {en: 'Europe', ru: 'Европа', az: 'Avropa'}, {en: 'Asia', ru: 'Азия', az: 'Asiya'},
  {en: 'North America', ru: 'Северная Америка', az: 'Şimali Amerika'}, {en: 'South America', ru: 'Южная Америка', az: 'Cənubi Amerika'},
  {en: 'Africa', ru: 'Африка', az: 'Afrika'}, {en: 'Oceania', ru: 'Океания', az: 'Okeaniya'},
  {en: 'Middle East', ru: 'Ближний Восток', az: 'Yaxın Şərq'}, {en: 'Caribbean', ru: 'Карибы', az: 'Karib'},
  {en: 'Central America', ru: 'Центральная Америка', az: 'Mərkəzi Amerika'}, {en: 'Antarctica', ru: 'Антарктида', az: 'Antarktida'}
];
const travelCountries = [
  {en: 'Top Destinations', ru: 'Популярные направления', az: 'Məşhur istiqamətlər'}, {en: 'Off the Beaten Path', ru: 'Неизведанные места', az: 'Kəşf edilməmiş yerlər'},
  {en: 'Historical Cities', ru: 'Исторические города', az: 'Tarixi şəhərlər'}, {en: 'Nature Reserves', ru: 'Заповедники', az: 'Qoruqlar'},
  {en: 'Coastal Areas', ru: 'Прибрежные зоны', az: 'Sahil zonaları'}, {en: 'Mountain Regions', ru: 'Горные районы', az: 'Dağlıq bölgələr'},
  {en: 'Islands', ru: 'Острова', az: 'Adalar'}, {en: 'Deserts', ru: 'Пустыни', az: 'Səhralar'},
  {en: 'Jungles / Rainforests', ru: 'Джунгли', az: 'Cəngəlliklər'}, {en: 'Rural Villages', ru: 'Деревни', az: 'Kəndlər'},
  {en: 'Metropolises', ru: 'Мегаполисы', az: 'Meqapolislər'}, {en: 'Road Trips', ru: 'Автопутешествия', az: 'Avtosəyahət'},
  {en: 'Cruise Routes', ru: 'Круизные маршруты', az: 'Kruiz marşrutları'}, {en: 'Pilgrimage Sites', ru: 'Святые места', az: 'Müqəddəs yerlər'},
  {en: 'Resorts', ru: 'Курорты', az: 'Kurortlar'}
];
const travelTypes = [
  {en: 'Backpacking', ru: 'Бэкпекинг', az: 'Kürək çantası ilə'}, {en: 'Luxury', ru: 'Люкс', az: 'Lüks'},
  {en: 'Family', ru: 'Семейный', az: 'Ailə'}, {en: 'Solo', ru: 'Соло', az: 'Tək'},
  {en: 'Adventure', ru: 'Приключения', az: 'Macəra'}, {en: 'Culinary', ru: 'Кулинарный', az: 'Kulinariya'},
  {en: 'Cultural', ru: 'Культурный', az: 'Mədəni'}, {en: 'Eco-tourism', ru: 'Экотуризм', az: 'Ekoturizm'}
];
for (let reg of travelRegions) {
  let regId = addNode(reg.en, reg.ru, reg.az, travelId, 'subcategory');
  for (let c of travelCountries) {
    let cId = addNode(c.en, c.ru, c.az, regId, 'refinement');
    for (let t of travelTypes) { addNode(t.en, t.ru, t.az, cId, 'specialization'); }
  }
}

// 5. Science (1200)
const sciId = addNode('Science', 'Наука', 'Elm', null, 'interest');
const sciFields = [
  {en: 'Physics', ru: 'Физика', az: 'Fizika'}, {en: 'Chemistry', ru: 'Химия', az: 'Kimya'},
  {en: 'Biology', ru: 'Биология', az: 'Biologiya'}, {en: 'Astronomy', ru: 'Астрономия', az: 'Astronomiya'},
  {en: 'Mathematics', ru: 'Математика', az: 'Riyaziyyat'}, {en: 'Geology', ru: 'Геология', az: 'Geologiya'},
  {en: 'Ecology', ru: 'Экология', az: 'Ekologiya'}, {en: 'Psychology', ru: 'Психология', az: 'Psixologiya'},
  {en: 'Sociology', ru: 'Социология', az: 'Sosiologiya'}, {en: 'Anthropology', ru: 'Антропология', az: 'Antropologiya'},
  {en: 'Linguistics', ru: 'Лингвистика', az: 'Dilçilik'}, {en: 'Neuroscience', ru: 'Нейронаука', az: 'Neyroelm'},
  {en: 'Genetics', ru: 'Генетика', az: 'Genetika'}, {en: 'Medicine', ru: 'Медицина', az: 'Tibb'},
  {en: 'Botany', ru: 'Ботаника', az: 'Botanika'}
];
const sciSub = [
  {en: 'Theoretical', ru: 'Теоретическая', az: 'Nəzəri'}, {en: 'Applied', ru: 'Прикладная', az: 'Tətbiqi'},
  {en: 'Experimental', ru: 'Экспериментальная', az: 'Eksperimental'}, {en: 'Computational', ru: 'Вычислительная', az: 'Hesablama'},
  {en: 'History of Field', ru: 'История дисциплины', az: 'Elmin tarixi'}, {en: 'Education', ru: 'Образование', az: 'Təhsil'},
  {en: 'Popular Science', ru: 'Научпоп', az: 'Populyar elm'}, {en: 'Research', ru: 'Исследования', az: 'Tədqiqat'},
  {en: 'Ethics', ru: 'Этика', az: 'Etika'}, {en: 'Policy', ru: 'Политика', az: 'Siyasət'}
];
const sciMethods = [
  {en: 'Data Analysis', ru: 'Анализ данных', az: 'Məlumat analizi'}, {en: 'Lab Work', ru: 'Лабораторная работа', az: 'Laboratoriya işi'},
  {en: 'Field Studies', ru: 'Полевые исследования', az: 'Sahə tədqiqatları'}, {en: 'Modeling', ru: 'Моделирование', az: 'Modelləşdirmə'},
  {en: 'Literature Review', ru: 'Обзор литературы', az: 'Ədəbiyyat icmalı'}, {en: 'Peer Review', ru: 'Рецензирование', az: 'Rəy vermə'},
  {en: 'Grant Writing', ru: 'Написание грантов', az: 'Qrant yazılması'}, {en: 'Conferences', ru: 'Конференции', az: 'Konfranslar'}
];
for (let f of sciFields) {
  let fId = addNode(f.en, f.ru, f.az, sciId, 'subcategory');
  for (let sub of sciSub) {
    let subId = addNode(sub.en, sub.ru, sub.az, fId, 'refinement');
    for (let m of sciMethods) { addNode(m.en, m.ru, m.az, subId, 'specialization'); }
  }
}

// 6. Business (1000)
const busId = addNode('Business & Finance', 'Бизнес и финансы', 'Biznes və Maliyyə', null, 'interest');
const busInd = [
  {en: 'Tech Startup', ru: 'ИТ Стартапы', az: 'İT Startaplar'}, {en: 'E-commerce', ru: 'E-commerce', az: 'E-ticarət'},
  {en: 'Real Estate', ru: 'Недвижимость', az: 'Daşınmaz əmlak'}, {en: 'Finance & Banking', ru: 'Финансы и банкинг', az: 'Maliyyə və bank'},
  {en: 'Healthcare', ru: 'Здравоохранение', az: 'Səhiyyə'}, {en: 'Education', ru: 'Образование', az: 'Təhsil'},
  {en: 'Manufacturing', ru: 'Производство', az: 'İstehsalat'}, {en: 'Retail', ru: 'Ритейл', az: 'Pərakəndə satış'},
  {en: 'Hospitality', ru: 'Гостеприимство', az: 'Qonaqpərvərlik'}, {en: 'Logistics', ru: 'Логистика', az: 'Logistika'},
  {en: 'Agriculture', ru: 'Сельское хозяйство', az: 'Kənd təsərrüfatı'}, {en: 'Media', ru: 'Медиа', az: 'Media'},
  {en: 'Energy', ru: 'Энергетика', az: 'Energetika'}, {en: 'Consulting', ru: 'Консалтинг', az: 'Konsaltinq'},
  {en: 'Marketing Agency', ru: 'Маркетинговые агентства', az: 'Marketinq agentlikləri'}, {en: 'Legal Services', ru: 'Юридические услуги', az: 'Hüquqi xidmətlər'},
  {en: 'Entertainment', ru: 'Развлечения', az: 'Əyləncə'}, {en: 'Construction', ru: 'Строительство', az: 'Tikinti'},
  {en: 'Automotive', ru: 'Автомобилестроение', az: 'Avtomobil'}, {en: 'Non-Profit', ru: 'НКО', az: 'QHT'}
];
const busRoles = [
  {en: 'Founder / CEO', ru: 'Основатель / CEO', az: 'Qurucu / CEO'}, {en: 'Management', ru: 'Менеджмент', az: 'Menecment'},
  {en: 'Marketing', ru: 'Маркетинг', az: 'Marketinq'}, {en: 'Sales', ru: 'Продажи', az: 'Satış'},
  {en: 'HR', ru: 'HR', az: 'HR'}, {en: 'Operations', ru: 'Операции', az: 'Əməliyyatlar'},
  {en: 'Finance/Accounting', ru: 'Финансы/Бухгалтерия', az: 'Maliyyə/Mühasibat'}, {en: 'Product', ru: 'Продукт', az: 'Məhsul'},
  {en: 'Investor', ru: 'Инвестор', az: 'İnvestor'}, {en: 'Consultant', ru: 'Консультант', az: 'Məsləhətçi'}
];
const busActs = [
  {en: 'Strategy', ru: 'Стратегия', az: 'Strategiya'}, {en: 'Networking', ru: 'Нетворкинг', az: 'Netvorkinq'},
  {en: 'Fundraising', ru: 'Привлечение инвестиций', az: 'İnvestisiya cəlbi'}, {en: 'Analysis', ru: 'Аналитика', az: 'Analitika'},
  {en: 'Scaling', ru: 'Масштабирование', az: 'Genişlənmə'}
];
for (let ind of busInd) {
  let indId = addNode(ind.en, ind.ru, ind.az, busId, 'subcategory');
  for (let r of busRoles) {
    let rId = addNode(r.en, r.ru, r.az, indId, 'refinement');
    for (let a of busActs) { addNode(a.en, a.ru, a.az, rId, 'specialization'); }
  }
}

// 7. History (900)
const histId = addNode('History', 'История', 'Tarix', null, 'interest');
const histEras = [
  {en: 'Prehistory', ru: 'Первобытное общество', az: 'İbtidai cəmiyyət'}, {en: 'Ancient History', ru: 'Древний мир', az: 'Qədim dünya'},
  {en: 'Classical Antiquity', ru: 'Античность', az: 'Antik dövr'}, {en: 'Early Middle Ages', ru: 'Раннее Средневековье', az: 'Erkən Orta əsrlər'},
  {en: 'High Middle Ages', ru: 'Высокое Средневековье', az: 'Yüksək Orta əsrlər'}, {en: 'Late Middle Ages', ru: 'Позднее Средневековье', az: 'Son Orta əsrlər'},
  {en: 'Renaissance', ru: 'Возрождение', az: 'İntibah'}, {en: 'Early Modern', ru: 'Раннее Новое время', az: 'Erkən Yeni dövr'},
  {en: 'Late Modern', ru: 'Позднее Новое время', az: 'Son Yeni dövr'}, {en: 'Contemporary', ru: 'Новейшая история', az: 'Müasir tarix'}
];
const histRegions = [
  {en: 'Global', ru: 'Всемирная', az: 'Dünya'}, {en: 'Europe', ru: 'Европа', az: 'Avropa'},
  {en: 'Middle East', ru: 'Ближний Восток', az: 'Yaxın Şərq'}, {en: 'Caucasus', ru: 'Кавказ', az: 'Qafqaz'},
  {en: 'Central Asia', ru: 'Центральная Азия', az: 'Mərkəzi Asiya'}, {en: 'East Asia', ru: 'Восточная Азия', az: 'Şərqi Asiya'},
  {en: 'South Asia', ru: 'Южная Азия', az: 'Cənubi Asiya'}, {en: 'North America', ru: 'Северная Америка', az: 'Şimali Amerika'},
  {en: 'South America', ru: 'Южная Америка', az: 'Cənubi Amerika'}, {en: 'Africa', ru: 'Африка', az: 'Afrika'},
  {en: 'Oceania', ru: 'Океания', az: 'Okeaniya'}, {en: 'Mediterranean', ru: 'Средиземноморье', az: 'Aralıq dənizi'},
  {en: 'Nordic Countries', ru: 'Скандинавия', az: 'Skandinaviya'}, {en: 'Eastern Europe', ru: 'Восточная Европа', az: 'Şərqi Avropa'},
  {en: 'Balkans', ru: 'Балканы', az: 'Balkanlar'}
];
const histThemes = [
  {en: 'Military', ru: 'Военная история', az: 'Hərbi tarix'}, {en: 'Political', ru: 'Политическая', az: 'Siyasi'},
  {en: 'Economic', ru: 'Экономическая', az: 'İqtisadi'}, {en: 'Cultural', ru: 'Культурная', az: 'Mədəni'},
  {en: 'Social', ru: 'Социальная', az: 'İجتماi'}, {en: 'Biographical', ru: 'Биографии', az: 'Bioqrafik'}
];
for (let e of histEras) {
  let eId = addNode(e.en, e.ru, e.az, histId, 'subcategory');
  for (let r of histRegions) {
    let rId = addNode(r.en, r.ru, r.az, eId, 'refinement');
    for (let t of histThemes) { addNode(t.en, t.ru, t.az, rId, 'specialization'); }
  }
}

// 8. Art (900)
const artId = addNode('Art & Design', 'Искусство и дизайн', 'İncəsənət və Dizayn', null, 'interest');
const artMediums = [
  {en: 'Painting', ru: 'Живопись', az: 'Rəssamlıq'}, {en: 'Sculpture', ru: 'Скульптура', az: 'Heykəltəraşlıq'},
  {en: 'Photography', ru: 'Фотография', az: 'Fotoqrafiya'}, {en: 'Digital Art', ru: 'Цифровое искусство', az: 'Rəqəmsal incəsənət'},
  {en: 'Illustration', ru: 'Иллюстрация', az: 'İllüstrasiya'}, {en: 'Architecture', ru: 'Архитектура', az: 'Memarlıq'},
  {en: 'Graphic Design', ru: 'Графический дизайн', az: 'Qrafik dizayn'}, {en: 'Fashion Design', ru: 'Дизайн одежды', az: 'Geyim dizaynı'},
  {en: 'Interior Design', ru: 'Дизайн интерьера', az: 'İnteryer dizaynı'}, {en: 'Ceramics', ru: 'Керамика', az: 'Keramika'},
  {en: 'Textiles', ru: 'Текстиль', az: 'Tekstil'}, {en: 'Calligraphy', ru: 'Каллиграфия', az: 'Xəttatlıq'},
  {en: 'Printmaking', ru: 'Гравюра/Принт', az: 'Qravüra'}, {en: 'Jewelry', ru: 'Ювелирное дело', az: 'Zərgərlik'},
  {en: 'Video Art', ru: 'Видеоарт', az: 'Videoart'}
];
const artStyles = [
  {en: 'Classical', ru: 'Классика', az: 'Klassika'}, {en: 'Modern', ru: 'Модерн', az: 'Modern'},
  {en: 'Contemporary', ru: 'Современное', az: 'Müasir'}, {en: 'Abstract', ru: 'Абстракционизм', az: 'Abstraksionizm'},
  {en: 'Surrealism', ru: 'Сюрреализм', az: 'Sürrealizm'}, {en: 'Minimalism', ru: 'Минимализм', az: 'Minimalizm'},
  {en: 'Pop Art', ru: 'Поп-арт', az: 'Pop-art'}, {en: 'Realism', ru: 'Реализм', az: 'Realizm'},
  {en: 'Impressionism', ru: 'Импрессионизм', az: 'İmressionizm'}, {en: 'Cyberpunk/Sci-Fi', ru: 'Киберпанк/Сай-фай', az: 'Kiberpank/Sci-Fi'}
];
const artRoles = [
  {en: 'Creating', ru: 'Создание', az: 'Yaratmaq'}, {en: 'Collecting', ru: 'Коллекционирование', az: 'Kolleksiya'},
  {en: 'Critique', ru: 'Критика', az: 'Tənqid'}, {en: 'Curating', ru: 'Кураторство', az: 'Kuratorluq'},
  {en: 'Education', ru: 'Обучение', az: 'Tədris'}, {en: 'Exhibitions', ru: 'Выставки', az: 'Sərgilər'}
];
for (let m of artMediums) {
  let mId = addNode(m.en, m.ru, m.az, artId, 'subcategory');
  for (let s of artStyles) {
    let sId = addNode(s.en, s.ru, s.az, mId, 'refinement');
    for (let r of artRoles) { addNode(r.en, r.ru, r.az, sId, 'specialization'); }
  }
}

// 9. Literature (900)
const litId = addNode('Literature & Books', 'Литература и книги', 'Ədəbiyyat və Kitablar', null, 'interest');
const litGenres = [
  {en: 'Science Fiction', ru: 'Научная фантастика', az: 'Elmi fantastika'}, {en: 'Fantasy', ru: 'Фэнтези', az: 'Fentezi'},
  {en: 'Mystery / Thriller', ru: 'Детектив / Триллер', az: 'Detektiv / Triller'}, {en: 'Romance', ru: 'Романтика', az: 'Romantika'},
  {en: 'Historical Fiction', ru: 'Исторический роман', az: 'Tarixi roman'}, {en: 'Horror', ru: 'Ужасы', az: 'Dəhşət'},
  {en: 'Literary Fiction', ru: 'Современная проза', az: 'Müasir nəsr'}, {en: 'Poetry', ru: 'Поэзия', az: 'Poeziya'},
  {en: 'Biography', ru: 'Биография', az: 'Bioqrafiya'}, {en: 'Self-Help', ru: 'Саморазвитие', az: 'Fərdi inkişaf'},
  {en: 'Business / Finance', ru: 'Бизнес / Финансы', az: 'Biznes / Maliyyə'}, {en: 'Science / Nature', ru: 'Наука / Природа', az: 'Elm / Təbiət'},
  {en: 'Travel / Adventure', ru: 'Путешествия / Приключения', az: 'Səyahət / Macəra'}, {en: 'Comics / Graphic Novels', ru: 'Комиксы / Графические романы', az: 'Komikslər'},
  {en: 'Manga / Light Novels', ru: 'Манга / Ранобэ', az: 'Manqa / Ranobe'}
];
const litFormats = [
  {en: 'Physical Books', ru: 'Бумажные книги', az: 'Kağız kitablar'}, {en: 'E-Books', ru: 'Электронные книги', az: 'Elektron kitablar'},
  {en: 'Audiobooks', ru: 'Аудиокниги', az: 'Audiokitablar'}, {en: 'Short Stories', ru: 'Рассказы', az: 'Hekayələr'},
  {en: 'Novels', ru: 'Романы', az: 'Romanlar'}, {en: 'Anthologies', ru: 'Антологии', az: 'Antologiyalar'},
  {en: 'Essays', ru: 'Эссе', az: 'Esselər'}, {en: 'Articles / Blogs', ru: 'Статьи / Блоги', az: 'Məqalələr / Bloqlar'},
  {en: 'Zines', ru: 'Зины', az: 'Zinlər'}, {en: 'Web Serials', ru: 'Веб-романы', az: 'Veb-romanlar'}
];
const litActs = [
  {en: 'Reading', ru: 'Чтение', az: 'Oxumaq'}, {en: 'Writing', ru: 'Писательство', az: 'Yazıçılıq'},
  {en: 'Reviewing', ru: 'Написание рецензий', az: 'Rəy yazmaq'}, {en: 'Collecting', ru: 'Коллекционирование', az: 'Kolleksiya'},
  {en: 'Book Clubs', ru: 'Книжные клубы', az: 'Kitab klubları'}, {en: 'Editing / Translating', ru: 'Редактура / Перевод', az: 'Redaktə / Tərcümə'}
];
for (let g of litGenres) {
  let gId = addNode(g.en, g.ru, g.az, litId, 'subcategory');
  for (let f of litFormats) {
    let fId = addNode(f.en, f.ru, f.az, gId, 'refinement');
    for (let a of litActs) { addNode(a.en, a.ru, a.az, fId, 'specialization'); }
  }
}

// 10. Gaming (1200)
const gameId = addNode('Gaming', 'Игры', 'Oyunlar', null, 'interest');
const gameGenres = [
  {en: 'Action / Adventure', ru: 'Экшен / Приключения', az: 'Ekşn / Macəra'}, {en: 'RPG', ru: 'РПГ', az: 'RPG'},
  {en: 'Strategy (RTS/TBS)', ru: 'Стратегии', az: 'Strategiya'}, {en: 'Shooters (FPS/TPS)', ru: 'Шутеры', az: 'Atıcı oyunlar'},
  {en: 'Simulation', ru: 'Симуляторы', az: 'Simulyatorlar'}, {en: 'Sports / Racing', ru: 'Спорт / Гонки', az: 'İdman / Yarış'},
  {en: 'Puzzle / Logic', ru: 'Головоломки', tap: 'Tapmacalar', az: 'Tapmacalar'}, {en: 'Fighting', ru: 'Файтинги', az: 'Döyüş oyunları'},
  {en: 'Platformer', ru: 'Платформеры', az: 'Platformerlər'}, {en: 'MMORPG', ru: 'MMORPG', az: 'MMORPG'},
  {en: 'Survival / Horror', ru: 'Выживание / Ужасы', az: 'Sağ qalma / Dəhşət'}, {en: 'Visual Novels', ru: 'Визуальные новеллы', az: 'Vizual romanlar'},
  {en: 'Rhythm', ru: 'Ритм-игры', az: 'Ritm oyunları'}, {en: 'Card Games', ru: 'Карточные игры', az: 'Kart oyunları'},
  {en: 'Board Games (Digital)', ru: 'Цифровые настолки', az: 'Rəqəmsal stolüstü oyunlar'}
];
const gamePlatforms = [
  {en: 'PC', ru: 'ПК', az: 'PC'}, {en: 'PlayStation', ru: 'PlayStation', az: 'PlayStation'},
  {en: 'Xbox', ru: 'Xbox', az: 'Xbox'}, {en: 'Nintendo', ru: 'Nintendo', az: 'Nintendo'},
  {en: 'Mobile (iOS/Android)', ru: 'Мобильные', az: 'Mobil'}, {en: 'VR / AR', ru: 'VR / AR', az: 'VR / AR'},
  {en: 'Retro Consoles', ru: 'Ретро консоли', az: 'Retro konsollar'}, {en: 'Browser', ru: 'Браузерные', az: 'Brauzer'},
  {en: 'Handhelds (Steam Deck etc.)', ru: 'Портативные ПК', az: 'Portativ kompüterlər'}, {en: 'Arcade', ru: 'Аркадные автоматы', az: 'Arkad'}
];
const gameAspects = [
  {en: 'Casual Play', ru: 'Казуальная игра', az: 'Kəjual oyun'}, {en: 'Competitive / Ranked', ru: 'Соревновательная / Ранкед', az: 'Rəqabət / Ranked'},
  {en: 'Speedrunning', ru: 'Спидран', az: 'Spidran'}, {en: 'Modding', ru: 'Моддинг', az: 'Modinq'},
  {en: 'Streaming', ru: 'Стриминг', az: 'Striminq'}, {en: 'Game Lore', ru: 'Лор игр', az: 'Oyun hekayəsi'},
  {en: 'Trophy/Achievement Hunting', ru: 'Сбор достижений', az: 'Nailiyyətlərin toplanması'}, {en: 'Development / Design', ru: 'Разработка / Дизайн', az: 'Proqramlaşdırma / Dizayn'}
];
for (let g of gameGenres) {
  let gId = addNode(g.en, g.ru, g.az, gameId, 'subcategory');
  for (let p of gamePlatforms) {
    let pId = addNode(p.en, p.ru, p.az, gId, 'refinement');
    for (let a of gameAspects) { addNode(a.en, a.ru, a.az, pId, 'specialization'); }
  }
}

// 11. Cooking (900)
const cookId = addNode('Cooking & Food', 'Кулинария и еда', 'Kulinariya və Yemək', null, 'interest');
const cookCuisines = [
  {en: 'Italian', ru: 'Итальянская', az: 'İtalyan'}, {en: 'French', ru: 'Французская', az: 'Fransız'},
  {en: 'Japanese', ru: 'Японская', az: 'Yapon'}, {en: 'Chinese', ru: 'Китайская', az: 'Çin'},
  {en: 'Indian', ru: 'Индийская', az: 'Hind'}, {en: 'Mexican', ru: 'Мексиканская', az: 'Meksika'},
  {en: 'Middle Eastern', ru: 'Ближневосточная', az: 'Yaxın Şərq'}, {en: 'Caucasian / Azerbaijani', ru: 'Кавказская / Азербайджанская', az: 'Qafqaz / Azərbaycan'},
  {en: 'American', ru: 'Американская', az: 'Amerika'}, {en: 'Spanish', ru: 'Испанская', az: 'İspan'},
  {en: 'Thai', ru: 'Тайская', az: 'Tay'}, {en: 'Korean', ru: 'Корейская', az: 'Koreya'},
  {en: 'Mediterranean', ru: 'Средиземноморская', az: 'Aralıq dənizi'}, {en: 'Vegan / Plant-based', ru: 'Веганская', az: 'Veqan'},
  {en: 'Fusion', ru: 'Фьюжн', az: 'Fyujn'}
];
const cookTypes = [
  {en: 'Appetizers & Snacks', ru: 'Закуски', az: 'Qəlyanaltılar'}, {en: 'Soups', ru: 'Супы', az: 'Şorbalar'},
  {en: 'Main Courses (Meat)', ru: 'Горячее (Мясо)', az: 'Əsas yeməklər (Ət)'}, {en: 'Main Courses (Seafood)', ru: 'Горячее (Морепродукты)', az: 'Əsas yeməklər (Dəniz məhsulları)'},
  {en: 'Vegetarian Mains', ru: 'Вегетарианские блюда', az: 'Vegetarian yeməkləri'}, {en: 'Salads', ru: 'Салаты', az: 'Salatlar'},
  {en: 'Baking & Bread', ru: 'Выпечка и хлеб', az: 'Çörək və un məmulatları'}, {en: 'Desserts & Sweets', ru: 'Десерты и сладости', az: 'Desertlər və şirniyyatlar'},
  {en: 'Beverages (Non-Alcoholic)', ru: 'Напитки (Б/а)', az: 'İçkilər (Alkoqolsuz)'}, {en: 'Mixology / Cocktails', ru: 'Коктейли', az: 'Kokteyllər'}
];
const cookTechs = [
  {en: 'Home Cooking', ru: 'Домашняя готовка', az: 'Ev yeməkləri'}, {en: 'Professional / Fine Dining', ru: 'Высокая кухня', az: 'Peşəkar mətbəx'},
  {en: 'BBQ & Grilling', ru: 'Гриль и барбекю', az: 'Qril və manqal'}, {en: 'Fermentation', ru: 'Ферментация', az: 'Qıcqırma'},
  {en: 'Meal Prep', ru: 'Заготовка еды', az: 'Yemək hazırlığı'}, {en: 'Food Photography', ru: 'Фуд-фотография', az: 'Qida fotoqrafiyası'}
];
for (let c of cookCuisines) {
  let cId = addNode(c.en, c.ru, c.az, cookId, 'subcategory');
  for (let t of cookTypes) {
    let tId = addNode(t.en, t.ru, t.az, cId, 'refinement');
    for (let tch of cookTechs) { addNode(tch.en, tch.ru, tch.az, tId, 'specialization'); }
  }
}

// 12. Cinema (1000)
const cineId = addNode('Movies & Cinema', 'Кино и фильмы', 'Kino və filmlər', null, 'interest');
const cineGenres = [
  {en: 'Action', ru: 'Экшен/Боевик', az: 'Ekşn'}, {en: 'Comedy', ru: 'Комедия', az: 'Komediya'},
  {en: 'Drama', ru: 'Драма', az: 'Dram'}, {en: 'Sci-Fi', ru: 'Научная фантастика', az: 'Elmi fantastika'},
  {en: 'Fantasy', ru: 'Фэнтези', az: 'Fentezi'}, {en: 'Horror', ru: 'Ужасы', az: 'Dəhşət'},
  {en: 'Thriller/Mystery', ru: 'Триллер', az: 'Triller'}, {en: 'Romance', ru: 'Романтика', az: 'Romantika'},
  {en: 'Documentary', ru: 'Документалистика', az: 'Sənədli'}, {en: 'Animation', ru: 'Анимация', az: 'Animasiya'}
];
const cineTypes = [
  {en: 'Hollywood Blockbusters', ru: 'Голливудские блокбастеры', az: 'Hollivud blokbasterləри'}, {en: 'Indie Films', ru: 'Инди-кино', az: 'İndi filmlər'},
  {en: 'Classic Cinema', ru: 'Классика кино', az: 'Klassik kino'}, {en: 'Arthouse / Auteur', ru: 'Артхаус', az: 'Artxaus'},
  {en: 'Short Films', ru: 'Короткометражки', az: 'Qısametrajlı filmlər'}, {en: 'European Cinema', ru: 'Европейское кино', az: 'Avropa kinosu'},
  {en: 'Asian Cinema', ru: 'Азиатское кино', az: 'Asiya kinosu'}, {en: 'Anime Movies', ru: 'Аниме-фильмы', az: 'Anime filmləri'},
  {en: 'B-Movies', ru: 'Фильмы категории B', az: 'B kateqoriyalı filmlər'}, {en: 'Festival Films', ru: 'Фестивальное кино', az: 'Festival filmləri'}
];
const cineRoles = [
  {en: 'Watching & Analyzing', ru: 'Просмотр и анализ', az: 'İzləmə və analiz'}, {en: 'Directing', ru: 'Режиссура', az: 'Rejissorluq'},
  {en: 'Screenwriting', ru: 'Сценаристика', az: 'Ssenari yazarlığı'}, {en: 'Cinematography', ru: 'Операторское искусство', az: 'Operator sənəti'},
  {en: 'Acting', ru: 'Актерское мастерство', az: 'Aktyorluq'}, {en: 'Editing/VFX', ru: 'Монтаж/VFX', az: 'Montaj/VFX'},
  {en: 'Film Score / Sound', ru: 'Саундтреки', az: 'Soundtreklər'}, {en: 'Reviewing', ru: 'Кинокритика', az: 'Kino tənqidi'},
  {en: 'Collecting (Blu-ray, props)', ru: 'Коллекционирование', az: 'Kolleksiya'}, {en: 'Festivals & Awards', ru: 'Фестивали и премии', az: 'Festivallar və mükafatlar'}
];
for (let g of cineGenres) {
  let gId = addNode(g.en, g.ru, g.az, cineId, 'subcategory');
  for (let t of cineTypes) {
    let tId = addNode(t.en, t.ru, t.az, gId, 'refinement');
    for (let r of cineRoles) { addNode(r.en, r.ru, r.az, tId, 'specialization'); }
  }
}

fs.writeFileSync('src/data/interests.json', JSON.stringify(interests, null, 2));
console.log('Total interests generated:', interests.length);
