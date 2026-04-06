import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { en } from './locales/en';
import { ru } from './locales/ru';
import { sr } from './locales/sr';
import { routing } from './routing';

const messagesByLocale = {
  sr,
  en,
  ru
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale]
  };
});
