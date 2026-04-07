import { defineRouting } from 'next-intl/routing';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const routing = defineRouting({
  locales: ['sr', 'en', 'ru'],
  defaultLocale: 'sr',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    sameSite: 'lax'
  }
});
