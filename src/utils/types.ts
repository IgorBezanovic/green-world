import { PickerValue } from '@mui/x-date-pickers/internals';

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

export interface Product {
  _id: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  group: string;
  subGroup: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  priceOnRequest?: boolean;
  images: string[];
  height: number;
  weight: number;
  width: number;
  milliliters: number;
  status: string;
  onStock: boolean;
}

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

export type ContactUsValues = {
  subject: string;
  email: string;
  message: string;
};

export type SubGroup = {
  label: string;
  sr_RS: string;
};

export type SubGroups = {
  [key in
    | 'flower_assortment'
    | 'succulents'
    | 'potted_flowers'
    | 'seedlings'
    | 'fruits_and_vegetables'
    | 'herbal_pharmacy'
    | 'garden_decoration'
    | 'everything_for_plants']: SubGroup[];
};

export type DecodedToken = {
  exp: number;
  iat: number;
  role: string;
  _id: string;
};

export type ProductFiltersParams = {
  group?: string[];
  subGroup?: string[];
  title?: string;
  description?: string;
  priceMin?: number;
  priceMax?: number;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  widthMin?: number;
  widthMax?: number;
  millilitersMin?: number;
  millilitersMax?: number;
  status?: 'active' | 'inactive' | 'archived';
  currentPage?: number;
};

export type Event = {
  _id?: string;
  title: string;
  description: string;
  place: string;
  address?: string;
  coverImage: string;
  dateAction: PickerValue | string | undefined;
  startTime: string;
  endTime?: string;
  typeAction: 'cleaning' | 'selling' | 'planting';
  contactPerson?: string;
  contactPhone?: string;
  contactMail?: string;
  status: string;
};

export type HomeCategory = {
  id: number;
  image: string;
  route: string;
  text: string;
  slug: string;
};
