import { setItem } from '@green-world/utils/cookie';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const GoogleLoginAuth = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  return (
    <GoogleLogin
      containerProps={{
        style: {
          paddingTop: '12px',
          paddingLeft: '0px',
          paddingRight: '0px'
        }
      }}
      theme="outline"
      text="continue_with"
      logo_alignment="center"
      onSuccess={async (credentialResponse) => {
        try {
          const res = await axios.post(baseUrl + '/auth/google', {
            credential: credentialResponse.credential
          });
          const token = res.data.token;
          setItem('token', token);
          navigate('/');
        } catch (err: any) {
          const msg = err?.response?.data || 'Greška pri loginu.';
          toast.error(msg);
        }
      }}
      onError={() => {
        toast.error('Google login nije uspeo.');
      }}
    />
  );
};
