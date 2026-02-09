import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// TODO: Move translations to separate JSON files
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      matha_title: "Sode Matha",
      search_placeholder: "Search for Seva, Event, or Priest...",
      events: "Events",
      rooms: "Rooms",
      monthly_sevas: "Monthly Sevas",
      quick_access: "Quick Access",
      nav: {
        home: "Home",
        history: "History",
        seva: "Seva",
        profile: "Profile",
        more: "More"
      },
      upcoming_events: {
        paryaya: { title: "Paryaya Mahotsava", desc: "The biennial change of temple administration." },
        aradhana: { title: "Vadiraja Aradhana", desc: "Grand religious celebration at Sode." },
        ratha: { title: "Ratha Saptami", desc: "Special chariot festival at the Matha." }
      }
    },
  },
  kn: {
    translation: {
      welcome: "ಸ್ವಾಗತ",
      matha_title: "ಸೋದೆ ಮಠ",
      search_placeholder: "ಸೇವೆ, ಕಾರ್ಯಕ್ರಮ ಅಥವಾ ಅರ್ಚಕರನ್ನು ಹುಡುಕಿ...",
      events: "ಕಾರ್ಯಕ್ರಮಗಳು",
      rooms: "ಕೋಣೆಗಳು",
      monthly_sevas: "ಮಾಸಿಕ ಸೇವೆಗಳು",
      quick_access: "ತ್ವರಿತ ಪ್ರವೇಶ",
      nav: {
        home: "ಮುಖಪುಟ",
        history: "ಇತಿಹಾಸ",
        seva: "ಸೇವೆ",
        profile: "ಪ್ರೊಫೈಲ್",
        more: "ಇನ್ನಷ್ಟು"
      },
      upcoming_events: {
        paryaya: { title: "ಪರ್ಯಾಯ ಮಹೋತ್ಸವ", desc: "ಕ್ಷೇತ್ರದ ಆಡಳಿತ ಬದಲಾವಣೆಯ ದ್ವೈವಾರ್ಷಿಕ ಪರ್ಯಾಯ." },
        aradhana: { title: "ವಾದಿರಾಜ ಆರಾಧನೆ", desc: "ಸೋದೆಯಲ್ಲಿ ಅದ್ದೂರಿ ಧಾರ್ಮಿಕ ಆಚರಣೆ." },
        ratha: { title: "ರಥ ಸಪ್ತಮಿ", desc: "ಮಠದಲ್ಲಿ ವಿಶೇಷ ರಥೋತ್ಸವ." }
      }
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
