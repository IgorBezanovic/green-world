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
  title: string;
  description: string;
  place: string;
  coverImage: string;
  dateAction: string;
  timeAction: string;
  typeAction: 'cleaning' | 'selling' | 'planting';
  status: string;
};
