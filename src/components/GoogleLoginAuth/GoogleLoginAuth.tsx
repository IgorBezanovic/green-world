import { setItem } from '@green-world/utils/cookie';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const GoogleLoginAuth = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const update = () => {
      const parent = wrapRef.current;
      if (!parent) return;
    };

    update();

    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      {mounted && (
        <GoogleLogin
          containerProps={{
            style: {
              width: '100%'
            }
          }}
          width={'100%'}
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
              setTimeout(() => {
                window.location.reload();
              }, 10);
            } catch (err: any) {
              const msg = err?.response?.data || 'Greška pri loginu.';
              toast.error(msg);
            }
          }}
          onError={() => {
            toast.error('Google login nije uspeo.');
          }}
        />
      )}
    </div>
  );
};
