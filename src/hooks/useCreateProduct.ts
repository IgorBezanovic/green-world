import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
      },
      onError: (error: AxiosError) => {
        let errorMessages: string | string[] =
          error.response &&
          error.response.data &&
          (error.response.data as any).errors
            ? (error.response.data as any).errors
            : 'Unknown error';
        if (!Array.isArray(errorMessages)) errorMessages = [errorMessages];

        errorMessages.forEach((msg: string) => toast.error(msg));
      }
    }
  );
};
