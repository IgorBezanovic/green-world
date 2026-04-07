import { en } from './locales/en';
import { ru } from './locales/ru';
import { sr } from './locales/sr';
import { LOCALE_COOKIE_NAME, routing } from './routing';

export const SUPPORTED_LANGUAGES = ['sr', 'en', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const DEFAULT_LANGUAGE = routing.defaultLocale as SupportedLanguage;

const resources = { sr, en, ru } as const;

const normalizeLanguage = (language?: string | null): SupportedLanguage => {
  const normalized = language?.toLowerCase().split('-')[0];

  if (
    normalized &&
    SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)
  ) {
    return normalized as SupportedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

const getCookieLanguage = (): SupportedLanguage | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${LOCALE_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  return normalizeLanguage(cookie.split('=').slice(1).join('='));
};

const setCookieLanguage = (language: SupportedLanguage) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${LOCALE_COOKIE_NAME}=${language}; path=/; SameSite=Lax`;
};

const getCurrentLanguage = (): SupportedLanguage => {
  if (typeof document !== 'undefined' && document.documentElement.lang) {
    return normalizeLanguage(document.documentElement.lang);
  }

  const cookieLanguage = getCookieLanguage();

  if (cookieLanguage) {
    return cookieLanguage;
  }

  return DEFAULT_LANGUAGE;
};

const setCurrentLanguage = (language: SupportedLanguage) => {
  setCookieLanguage(language);

  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
};

const getNestedValue = (obj: unknown, path: string): string | undefined => {
  const value = path
    .split('.')
    .reduce<unknown>(
      (acc, key) => (acc as Record<string, unknown>)?.[key],
      obj
    );

  return typeof value === 'string' ? value : undefined;
};

const interpolate = (template: string, params?: Record<string, unknown>) => {
  if (!params) return template;

  return template
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => String(params[key] ?? ''))
    .replace(/\{\s*(\w+)\s*\}/g, (_, key) => String(params[key] ?? ''));
};

const i18n = {
  get language() {
    return getCurrentLanguage();
  },
  t(key: string, params?: Record<string, unknown>) {
    const language = getCurrentLanguage();
    const message = getNestedValue(resources[language], key);

    if (!message) return key;

    return interpolate(message, params);
  },
  exists(key: string, options?: { lng?: string }) {
    const language = normalizeLanguage(options?.lng ?? getCurrentLanguage());
    return Boolean(getNestedValue(resources[language], key));
  },
  changeLanguage(language: SupportedLanguage) {
    setCurrentLanguage(normalizeLanguage(language));
  }
};

export default i18n;
