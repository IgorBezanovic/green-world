import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

type Key = 'token' | 'refreshToken' | 'favourites';

export const getItem = (key: Key) => Cookies.get(key);

export const setItem = (key: Key, value: string) => {
  let expires = new Date('2099-12-31T23:59:59.000Z');

  if (key === 'token' || key === 'refreshToken') {
    try {
      const decoded: any = jwtDecode(value);
      if (decoded.exp) {
        expires = new Date(decoded.exp * 1000);
      }
    } catch {
      console.error('Failed to decode token');
    }
  }

  Cookies.set(key, value, { expires });
};

export const removeItem = (key: Key) => Cookies.remove(key);
