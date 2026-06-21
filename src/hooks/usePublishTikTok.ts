import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface PublishTikTokResponse {
  success: boolean;
  publishId?: string;
  status?: string;
  message: string;
}

export interface PublishTikTokPayload {
  videoUrl: string;
  productId?: string;
  groupLabelSr?: string;
  subGroupLabelSr?: string;
}

export const usePublishTikTok = () => {
  return useMutation<PublishTikTokResponse, Error, PublishTikTokPayload>({
    mutationFn: async (payload) => {
      return await request({
        url: '/ai/publish-tiktok',
        method: 'post',
        data: payload
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Reel je poslat na TikTok!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Greška pri objavljivanju na TikTok.';
      toast.error(errorMessage);
    }
  });
};
