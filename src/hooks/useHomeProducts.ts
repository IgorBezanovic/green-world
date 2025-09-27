import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { useQuery, UseQueryResult } from 'react-query';

export interface ProductPreview {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  priceOnRequest: boolean | null;
  price: string;
  images: string[];
}

export interface HomepageProductsResponse {
  recentProducts: ProductPreview[];
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
  return useQuery(
    ['allProducts'],
    () =>
      request({
        url: '/product/homepage-products',
        method: 'get'
      }),
    {
      initialData: () =>
        getDecrypted(
          'homepage-products'
        ) as unknown as HomepageProductsResponse,
      onSuccess: (data) => storeEncrypted('homepage-products', data)
    }
  );
};
