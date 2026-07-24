const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const additionalEn = `
    'onboarding.step0.title': 'Create Account',
    'onboarding.step0.desc': 'Set up your secure account. We just need your basic details to get started.',
    'onboarding.step1.title': 'Your Location',
    'onboarding.step1.desc': 'Select your country, city, street, and building to join your local neighborhood.',
    'onboarding.step2.title': 'Verification',
    'onboarding.step2.desc': 'Verify your identity to unlock all community features and build trust.',
    'onboarding.step3.title': 'Interests',
    'onboarding.step3.desc': 'Pick topics you care about to personalize your feed and discover local events.',
`;
const additionalAz = `
    'onboarding.step0.title': 'Hesab Yarat',
    'onboarding.step0.desc': 'Təhlükəsiz hesabınızı qurun. Başlamaq üçün yalnız əsas məlumatlarınız lazımdır.',
    'onboarding.step1.title': 'Məkanınız',
    'onboarding.step1.desc': 'Yerli məhəllənizə qoşulmaq üçün ölkə, şəhər, küçə və binanızı seçin.',
    'onboarding.step2.title': 'Təsdiqləmə',
    'onboarding.step2.desc': 'Bütün icma xüsusiyyətlərini açmaq və inam yaratmaq üçün şəxsiyyətinizi təsdiqləyin.',
    'onboarding.step3.title': 'Maraqlar',
    'onboarding.step3.desc': 'Lentini fərdiləşdirmək və yerli tədbirləri kəşf etmək üçün əhəmiyyət verdiyiniz mövzuları seçin.',
`;
const additionalRu = `
    'onboarding.step0.title': 'Создать Аккаунт',
    'onboarding.step0.desc': 'Создайте безопасный аккаунт. Нам нужны только базовые данные для начала.',
    'onboarding.step1.title': 'Ваше Местоположение',
    'onboarding.step1.desc': 'Выберите страну, город, улицу и дом, чтобы присоединиться к своему району.',
    'onboarding.step2.title': 'Верификация',
    'onboarding.step2.desc': 'Подтвердите личность, чтобы получить доступ ко всем функциям и повысить доверие.',
    'onboarding.step3.title': 'Интересы',
    'onboarding.step3.desc': 'Выберите интересные вам темы для персонализации ленты и поиска местных событий.',
`;

content = content.replace(/'en': \{/, "'en': {" + additionalEn);
content = content.replace(/'az': \{/, "'az': {" + additionalAz);
content = content.replace(/'ru': \{/, "'ru': {" + additionalRu);

fs.writeFileSync('src/lib/i18n.ts', content);
console.log("Patched i18n.ts with onboarding strings");
