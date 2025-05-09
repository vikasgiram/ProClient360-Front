import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { English } from './English';
import { Marathi } from './Marathi';



const resources = {
    English: { translation: English },
    Marathi: { translation: Marathi }

};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'Marathi',
        fallbackLng: 'Marathi',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;