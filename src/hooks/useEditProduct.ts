import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useMutation } from '@tanstack/react-query';

export const useEditProduct = (id: string) => {
  return useMutation({
    mutationFn: ({
      group,
      subGroup,
      title,
      description,
      shortDescription,
      images,
      price,
      priceOnRequest,
      height,
      width,
      weight,
      milliliters
    }: Product) =>
      request({
        url: `/product/${id}`,
        method: 'put',
        data: {
          group,
          subGroup,
          title,
          description,
          shortDescription,
          images,
          price,
          priceOnRequest,
          height,
          width,
          weight,
          milliliters
        }
      }),
    onSuccess: () => {
      // navigate('/profile');
    }
  });
};
