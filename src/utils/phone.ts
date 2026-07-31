const PHONE_ALLOWED_CHARACTERS = /^\+?[0-9\s()./-]+$/;

export const isValidPhoneNumber = (value: string): boolean => {
  const normalized = value.trim();
  if (!PHONE_ALLOWED_CHARACTERS.test(normalized)) return false;

  const digits = normalized.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};
