import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface ReelGenerationResponse {
  message: string;
  reel: {
    reelId?: string;
    url?: string;
    status: 'generating' | 'completed' | 'failed';
    prompt?: string;
    generatedAt?: string;
  };
}

export const useGenerateReels = () => {
  const qc = useQueryClient();

  return useMutation<ReelGenerationResponse, Error, string>({
    mutationFn: async (productId: string) => {
      return await request({
        url: `/ai/generate-reels/${productId}`,
        method: 'post'
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Reels generisanje je započeto!');
      qc.invalidateQueries({ queryKey: ['adminProducts'] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Greška pri generisanju reels-a';
      toast.error(errorMessage);
    }
  });
};
