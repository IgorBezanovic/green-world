import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const useCreateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] })
      ]);
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
  });
};
