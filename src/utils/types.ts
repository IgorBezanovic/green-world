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
  group: keyof typeof subGroups;
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
  _id?: string;
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
  createdAt?: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
  numberOfProducts: number;
  maxShopProducts: number;
  numberOfActions: number;
  numberOfBlogs: number;
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

export interface BlogBlock {
  _id: string;
  type: 'text' | 'image' | 'mixed';
  text?: string;
  image?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  _id: string;
  title: string;
  coverImage: string;
  author: string;
  blocks: BlogBlock[];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  likes?: string[];
  dislikes?: string[];
  status: 'active' | 'deleted';
  comments?: Comment[];
  keywords?: string[];
  timeOfReading?: number;
}

export interface Comment {
  _id?: string;
  targetId: string;
  targetType: 'BlogPost' | 'Product' | 'Action';
  author: string;
  text: string;
  parentComment?: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}
