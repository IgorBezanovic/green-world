import Cookies from 'js-cookie';

type Key = 'token' | 'favourites';

export const getItem = (key: Key) => Cookies.get(key);

export const setItem = (key: Key, value: string) =>
  Cookies.set(key, value, { expires: 36500 });

export const removeItem = (key: Key) => Cookies.remove(key);
