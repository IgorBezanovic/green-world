import { request } from '@green-world/utils/api';
import { ProductValues } from '@green-world/utils/types';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useEditProduct = (id: string) => {
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
      height,
      width,
      weight,
      milliliters
    }: ProductValues) =>
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
        navigate('/profile');
      }
    }
  );
};
