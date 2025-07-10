import { Product } from '@green-world/utils/types';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_API_DECRYPT_SECRET_KEY;

export const storeEncryptedProduct = (product: Product) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(product),
    SECRET_KEY
  ).toString();
  localStorage.setItem(`product-${product._id}`, encrypted);
};

export const getDecryptedProduct = (id: string): Product | null => {
  const encrypted = localStorage.getItem(`product-${id}`);
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
