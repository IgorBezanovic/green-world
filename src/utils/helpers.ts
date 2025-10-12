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
