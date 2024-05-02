import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./en.json";
import translationFR from "./fr.json";
import { Platform } from "react-native";

const resources = {
    en: {
        translation: translationEN,
    },
    fr: {
        translation: translationFR,
    },
};

let languageDetector = undefined;
let languageCode = undefined;

if (Platform.OS === "web") {
    languageDetector = LanguageDetector;
} else {
    languageCode = getLocales()[0]?.languageCode ?? undefined;
}

i18n.use(initReactI18next);

if (languageDetector) {
    i18n.use(languageDetector);
}

void i18n.init({
    compatibilityJSON: "v3",
    debug: false,
    lng: languageDetector ? undefined : languageCode,
    fallbackLng: languageDetector ? undefined : "en",
    keySeparator: ".",
    resources: resources,
    interpolation: {
        escapeValue: false,
    },
});
