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

export interface HomepageProductsResponse {
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
}

export const useHomeProducts = (): UseQueryResult<HomepageProductsResponse> => {
  return useQuery({
    queryKey: ['allProducts'],
    queryFn: async () => {
      const data = await request({
        url: '/product/homepage-products',
        method: 'get'
      });
      storeEncrypted('homepage-products', data);
      return data;
    },
    initialData: getDecrypted('homepage-products')
  });
};
