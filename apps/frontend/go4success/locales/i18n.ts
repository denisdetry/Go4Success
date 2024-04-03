import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import translationEN from "./en.json";
import translationFR from "./fr.json";

const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR,
    },
};

void i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    debug: true,
    lng: getLocales()[0]?.languageCode ?? undefined,
    fallbackLng: "en",
    keySeparator: ".",
    resources: resources,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
