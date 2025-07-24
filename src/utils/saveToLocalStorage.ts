import { User, Product } from '@green-world/utils/types';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_API_DECRYPT_SECRET_KEY;

export const storeEncrypted = (
  type: string,
  response: Product | (User & { _id: string })
) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(response),
    SECRET_KEY
  ).toString();
  localStorage.setItem(`${type}-${response._id}`, encrypted);
};

export const getDecrypted = (
  type: string,
  id: string
): User | Product | null => {
  const encrypted = localStorage.getItem(`${type}-${id}`);
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
