import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      request({
        url: `/product/${id}`,
        method: 'delete'
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['allProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['productsByGroup'] }),
        queryClient.invalidateQueries({ queryKey: ['productDetails', id] }),
        queryClient.invalidateQueries({ queryKey: ['featured'] })
      ]);
    }
  });
};
