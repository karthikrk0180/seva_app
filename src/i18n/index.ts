import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// TODO: Move translations to separate JSON files
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
    },
  },
  kn: {
    translation: {
      welcome: "ಸ್ವಾಗತ",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    // React Native (Hermes) may not have Intl.PluralRules; use v3 plural format so no polyfill is needed
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
