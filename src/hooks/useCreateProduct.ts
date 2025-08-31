import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateProduct = () => {
  const navigate = useNavigate();

  return useMutation(
    ({
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
        url: `/product`,
        method: 'post',
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
    {
      onSuccess: () => {
        navigate('/profile');
      }
    }
  );
};
