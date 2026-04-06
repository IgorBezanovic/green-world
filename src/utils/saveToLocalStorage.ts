import { HomepageProductsResponse } from '@green-world/hooks/useHomeProducts';
import { User, Product, BlogPost } from '@green-world/utils/types';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_API_DECRYPT_SECRET_KEY as string;

export const storeEncrypted = (
  type: string,
  response:
    | Product
    | (User & { _id: string })
    | HomepageProductsResponse
    | BlogPost[]
) => {
  if (typeof window === 'undefined') return;

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(response),
    SECRET_KEY
  ).toString();

  if (type === 'homepage-products' || type.includes('user-blogposts')) {
    localStorage.setItem(type, encrypted);
  } else if ('_id' in response) {
    localStorage.setItem(`${type}-${response._id}`, encrypted);
  } else {
    console.warn('Cannot store encrypted response: no _id found', response);
  }
};

export const getDecrypted = (
  type: string,
  id?: string
): User | Product | HomepageProductsResponse | null => {
  if (typeof window === 'undefined') return null;

  const key =
    type === 'homepage-products' || type.includes('user-blogposts')
      ? type
      : `${type}-${id}`;
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
