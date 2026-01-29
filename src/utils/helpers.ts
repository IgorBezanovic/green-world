import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { homeCategories, subGroups } from './constants';

export const formatUrl = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `https://${url}`;
};

export const translateGroupToSr = (group: string): string => {
  const category = homeCategories.find((cat) => cat.slug === group);
  return category ? category.text : group;
};

export const translateSubGroupToSr = (
  group: keyof typeof subGroups | undefined,
  subGroup: string
): string => {
  if (!group) return subGroup;
  const subGroupList = subGroups[group];
  if (!subGroupList) return subGroup;

  const found = subGroupList.find((item) => item.label === subGroup);
  return found ? found.sr_RS : subGroup;
};

export const goToDestination = (street = '', city = '', country = 'Srbija') => {
  const addressParts = [street, city, country].filter(Boolean);

  const destination = encodeURIComponent(addressParts.join(', '));

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
};

export const formatImageUrl = (url: string, quality?: number) => {
  if (!url) return '';
  const { VITE_AWS_BUCKET_NAME, VITE_AWS_REGION, VITE_ENV } = import.meta.env;

  return url.includes('cloudinary') || url.includes('google')
    ? url
    : `https://${VITE_AWS_BUCKET_NAME}.s3.${VITE_AWS_REGION}.amazonaws.com/${VITE_ENV}/${url}_${quality || 85}.webp`;
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
  const item = homeCategories.filter((cat) => cat.slug === group)[0];
  return item?.text ?? group;
};
