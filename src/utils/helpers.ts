import i18n from '@green-world/i18n';
import dayjs, { Dayjs } from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import { homeCategories, subGroups } from './constants';

const humanizeKey = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeLanguage = (language: string) => language.split('-')[0];

export const formatUrl = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `https://${url}`;
};

export const translateGroupToSr = (group: string): string => {
  return getLocalizedGroupLabel(group, 'sr');
};

export const getLocalizedGroupLabel = (
  group: string,
  language: string = 'sr'
): string => {
  const normalizedLanguage = normalizeLanguage(language);

  if (normalizedLanguage === 'sr') {
    const category = homeCategories.find((cat) => cat.slug === group);
    return category ? category.text : group;
  }

  const translationKey = `catalog.groups.${group}`;
  if (i18n.exists(translationKey, { lng: language })) {
    return i18n.t(translationKey, { lng: language });
  }

  return humanizeKey(group);
};

export const translateSubGroupToSr = (
  group: keyof typeof subGroups | undefined,
  subGroup: string
): string => {
  return getLocalizedSubGroupLabel(group, subGroup, 'sr');
};

export const getLocalizedSubGroupLabel = (
  group: keyof typeof subGroups | undefined,
  subGroup: string,
  language: string = 'sr'
): string => {
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedGroup = group || undefined;

  if (normalizedLanguage === 'sr') {
    if (!normalizedGroup) {
      const found = Object.values(subGroups)
        .flat()
        .find((item) => item.label === subGroup);

      return found ? found.sr_RS : subGroup;
    }

    const subGroupList = subGroups[normalizedGroup];
    if (!subGroupList) return subGroup;

    const found = subGroupList.find((item) => item.label === subGroup);
    return found ? found.sr_RS : subGroup;
  }

  const translationKey = `catalog.subGroups.${subGroup}`;
  if (i18n.exists(translationKey, { lng: language })) {
    return i18n.t(translationKey, { lng: language });
  }

  return humanizeKey(subGroup);
};

export const goToDestination = (street = '', city = '', country = 'Srbija') => {
  const addressParts = [street, city, country].filter(Boolean);

  const destination = encodeURIComponent(addressParts.join(', '));

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
};

export const formatImageUrl = (url: string, quality?: number) => {
  if (!url) return '';

  return url.includes('cloudinary') || url.includes('google')
    ? url
    : `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_ENV}/${url}_${quality || 85}.webp`;
};

export const formatDate = (
  date: string | Date | Dayjs | null | undefined
): string => {
  if (!date) return '';

  const d = dayjs.isDayjs(date) ? date.toDate() : new Date(date);

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};

export const getHtmlDescriptionProps = (description: string) => ({
  className: 'ql-editor',
  dangerouslySetInnerHTML: { __html: description },
  sx: {
    height: 'auto !important',
    minHeight: 'unset !important',
    maxHeight: 'none',

    padding: 0,
    margin: 0,
    lineHeight: 1.6,

    '& p': { mb: '0.75em' },
    '& blockquote': { mb: '1em' },

    '& > *:last-child': { mb: 0 },

    '& ol, & ul': {
      pl: '1.5em',
      mb: '0.75em'
    },

    '& li[data-list="ordered"]': { listStyleType: 'decimal' },
    '& li[data-list="bullet"]': { listStyleType: 'disc' },

    '& li': { mb: '0.25em' },

    '& .ql-ui': { display: 'none' }
  }
});

export const getPlainTextFromHtml = (html?: string): string => {
  if (!html) return '';

  if (typeof window === 'undefined') {
    return html
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/?p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc
    .querySelectorAll('br')
    .forEach((el) => el.replaceWith(document.createTextNode('\n')));
  doc
    .querySelectorAll('p')
    .forEach((el) => el.prepend(document.createTextNode('\n')));

  return doc.body.textContent?.trim() || '';
};

export const useDebounce = <T>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const getGroupLabel = (group: string): string => {
  return getLocalizedGroupLabel(group);
};

export const isLikelyJwt = (token?: string | null): token is string => {
  if (!token || typeof token !== 'string') return false;
  return token.split('.').length === 3;
};

export const safeDecodeToken = <T>(token?: string | null): T | null => {
  if (!isLikelyJwt(token)) return null;

  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
};
