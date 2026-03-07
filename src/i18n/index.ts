import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { ru } from './locales/ru';
import { sr } from './locales/sr';

export const SUPPORTED_LANGUAGES = ['sr', 'en', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'app_lang';
const DEFAULT_LANGUAGE: SupportedLanguage = 'sr';

const normalizeLanguage = (
  language?: string | null
): SupportedLanguage | null => {
  if (!language) return null;

  const normalized = language.toLowerCase().split('-')[0];

  if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }

  return null;
};

const getInitialLanguage = (): SupportedLanguage => {
  const storedLanguage = normalizeLanguage(localStorage.getItem(STORAGE_KEY));

  if (storedLanguage) return storedLanguage;

  return DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  resources: {
    sr: { translation: sr },
    en: { translation: en },
    ru: { translation: ru }
  },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false
  }
});

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language) || DEFAULT_LANGUAGE;

  localStorage.setItem(STORAGE_KEY, normalizedLanguage);
  document.documentElement.lang = normalizedLanguage;
});

document.documentElement.lang =
  normalizeLanguage(i18n.language) || DEFAULT_LANGUAGE;

export default i18n;
