import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './translation/en/translation.json';
import frTranslation from './translation/fr/translation.json';
import arTranslation from './translation/ar/translation.json';
import esTranslation from './translation/es/translation.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      ar: { translation: arTranslation },
      es: { translation: esTranslation }
    },
    lng: 'fr', // langue par défaut
    fallbackLng: 'fr', // langue de secours
    interpolation: {
      escapeValue: false // pas besoin d'échapper les valeurs pour React
    }
  });

export default i18n;
