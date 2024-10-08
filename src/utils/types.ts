import { subGroups } from './constants';

export type SubGroupKeys = keyof typeof subGroups;

export type AuthValues = {
  email: string;
  password: string;
};

export type RegistrationValues = {
  email: string;
  password: string;
};

export type ProductValues = {
  group: string;
  subGroup: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: string;
  height: number;
  width: number;
  weight: number;
  milliliters: number;
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
