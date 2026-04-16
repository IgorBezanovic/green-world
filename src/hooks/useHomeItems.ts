import { EventCardType } from '@green-world/components';
import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface ProductPreview {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  priceOnRequest: boolean | null;
  price: string;
  images: string[];
  onStock: boolean;
  promotedAt?: string | Date | null;
  promotedUntil?: string | Date | null;
}

export interface ServicePreview {
  _id: string;
  providerId?:
    | string
    | {
        _id?: string;
        name?: string;
        lastname?: string;
      };
  title: string;
  description: string;
  services: string[];
  priceType: 'hourly' | 'fixed' | 'negotiable' | 'per_m2' | 'per_tree';
  priceFrom?: number;
  priceTo?: number;
  location?: string;
  images?: string[] | string;
}

export interface UserPreview {
  _id: string;
  name?: string;
  lastname?: string;
  shopName?: string;
  profileImage?: string;
  description?: string;
  email?: string;
  onlyOnline?: boolean;
  numberOfProducts?: number;
  numberOfServices?: number;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
}

export interface BlogPreview {
  _id: string;
  title: string;
  coverImage?: string;
  author?: string;
  createdAt: Date;
  blocks?: Array<{ type: string; text?: string; image?: string }>;
}

export interface EventPreview {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  dateAction: string;
  startTime: string;
  endTime: string;
  place: string;
  typeAction: EventCardType;
  contactPerson: string;
  status: string;
}

export interface HomepageItemsResponse {
  recentProducts: ProductPreview[];
  services: ServicePreview[];
  flower_assortment: ProductPreview[];
  succulents: ProductPreview[];
  potted_flowers: ProductPreview[];
  seedlings: ProductPreview[];
  fruits_and_vegetables: ProductPreview[];
  herbal_pharmacy: ProductPreview[];
  garden_decoration: ProductPreview[];
  everything_for_plants: ProductPreview[];
  equipment_and_tools: ProductPreview[];
  urban_gardening: ProductPreview[];
  seeds_and_bulbs: ProductPreview[];
  eco_and_organic: ProductPreview[];
  blogs: BlogPreview[];
  events: EventPreview[];
  users: UserPreview[];
}

/** @deprecated Use HomepageItemsResponse */
export type HomepageProductsResponse = HomepageItemsResponse;

export const useHomeItems = (): UseQueryResult<HomepageItemsResponse> => {
  return useQuery({
    queryKey: ['homeItems'],
    queryFn: async () => {
      const data = await request({
        url: '/home/items',
        method: 'get'
      });
      storeEncrypted('homepage-products', data);
      return data;
    },
    initialData: getDecrypted('homepage-products')
  });
};
