import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useMetaAuth = () => {
  const navigate = useNavigate();

  return useMutation(
    ({ name, email, image }: { name: string; email: string; image: string }) =>
      request({
        url: `/auth/meta`,
        method: 'post',
        data: {
          name,
          email,
          image
        }
      }),
    {
      onSuccess: (data: string) => {
        setItem('token', data);
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 10);
      }
    }
  );
};
