import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export interface PublishInstagramResponse {
  success: boolean;
  instagramPostId: string;
  message: string;
}

export interface PublishInstagramPayload {
  videoUrl: string;
  productId?: string;
  groupLabelSr?: string;
  subGroupLabelSr?: string;
}

export const usePublishInstagram = () => {
  return useMutation<PublishInstagramResponse, Error, PublishInstagramPayload>({
    mutationFn: async (payload) => {
      return await request({
        url: '/ai/publish-instagram',
        method: 'post',
        data: payload
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Reel je objavljen na Instagram!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Greška pri objavljivanju na Instagram.';
      toast.error(errorMessage);
    }
  });
};
