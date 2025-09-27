import { HomepageProductsResponse } from '@green-world/hooks/useHomeProducts';
import { User, Product } from '@green-world/utils/types';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_API_DECRYPT_SECRET_KEY;

export const storeEncrypted = (
  type: string,
  response: Product | (User & { _id: string }) | HomepageProductsResponse
) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(response),
    SECRET_KEY
  ).toString();

  if (type === 'homepage-products') {
    localStorage.setItem(`${type}-homepage-products`, encrypted);
  } else if ('_id' in response) {
    localStorage.setItem(`${type}-${response._id}`, encrypted);
  } else {
    console.warn('Cannot store encrypted response: no _id found', response);
  }
};

export const getDecrypted = (
  type: string,
  id?: string
): User | Product | null => {
  const key =
    type === 'homepage-products' ? 'homepage-products' : `${type}-${id}`;
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Decryption failed', err);
    return null;
  }
};
