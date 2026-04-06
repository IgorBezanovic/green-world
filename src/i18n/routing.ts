import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sr', 'en', 'ru'],
  defaultLocale: 'sr',
  localePrefix: 'as-needed'
});
