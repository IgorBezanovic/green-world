export type AuthValues = {
  email: string;
  password: string;
};

export type RegistrationValues = {
  email: string;
  password: string;
};

export type AdValues = {
  group: string;
  subGroup: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  price: string;
};

export type NewPasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
