import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      index: {
        title: "classified.ink",
        description: "Truly secure and private note-taking for everyone.",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
