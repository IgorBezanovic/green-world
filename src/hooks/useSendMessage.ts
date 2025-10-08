import { request } from '@green-world/utils/api';
import { useMutation, UseMutationOptions } from 'react-query';

interface MessagePayload {
  receiverId: string;
  content: string;
}

export const useSendMessage = (
  options?: UseMutationOptions<any, unknown, MessagePayload>
) => {
  return useMutation(
    ['sendMessage'],
    (payload: MessagePayload) =>
      request({
        url: `/message`,
        method: 'post',
        data: payload
      }),
    options
  );
};
