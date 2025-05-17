import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useMutation } from 'react-query';

export const useEditProduct = (id: string) => {
  return useMutation(
    ({
      group,
      subGroup,
      title,
      description,
      shortDescription,
      images,
      price,
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
          height,
          width,
          weight,
          milliliters
        }
      }),
    {
      onSuccess: () => {
        // navigate('/profile');
      }
    }
  );
};
