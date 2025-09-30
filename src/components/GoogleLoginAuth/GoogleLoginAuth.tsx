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
  const [w, setW] = useState(320);

  useEffect(() => {
    setMounted(true);

    const clamp = (x: number) => Math.min(400, Math.max(200, Math.round(x)));

    const update = () => {
      const parent = wrapRef.current;
      if (!parent) return;
      const computed = parent.clientWidth;
      setW(clamp(computed));
    };

    update();

    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full flex justify-center">
      {mounted && (
        <GoogleLogin
          containerProps={{
            style: {
              width: '100%'
            }
          }}
          width={w}
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
      )}
    </div>
  );
};
