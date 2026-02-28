import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useEditProduct = (id: string) => {
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
      onStock,
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
          onStock,
          height,
          width,
          weight,
          milliliters
        }
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['allProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['productsByGroup'] }),
        queryClient.invalidateQueries({ queryKey: ['productDetails', id] }),
        queryClient.invalidateQueries({ queryKey: ['featured'] })
      ]);
      toast.success('Podaci su uspešno ažurirani.');
    }
  });
};
