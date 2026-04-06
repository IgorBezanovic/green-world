import { hasLocale, IntlErrorCode } from 'next-intl';
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
    messages: messagesByLocale[locale],
    onError(error) {
      // Suppress formatting errors for strings containing HTML tags used by
      // react-i18next's <Trans> component — next-intl doesn't support raw HTML
      if (error.code === IntlErrorCode.FORMATTING_ERROR) return;
    },
    getMessageFallback({ key }) {
      return key;
    }
  };
});
