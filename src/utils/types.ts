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

type Address = {
  street: string;
  zipCode: number;
  city: string;
  country: string;
};

export type User = {
  email: string;
  name: string;
  lastname: string;
  coverImage: string;
  profileImage: string;
  shopName: string;
  phone: string;
  address: Address;
  shopDescription: string;
  website: string;
  onlyOnline: boolean;
  onlyOnThisSite: boolean;
};
