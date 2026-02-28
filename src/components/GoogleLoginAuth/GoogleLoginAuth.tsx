import { useGoogleLogin } from '@green-world/hooks/useGoogleLogin';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export const GoogleLoginAuth = () => {
  const googleLoginMutation = useGoogleLogin();

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
          onSuccess={(credentialResponse) => {
            const googleCredential = credentialResponse?.credential;
            if (!googleCredential) {
              toast.error('Google token nije prosleđen. Pokušajte ponovo.');
              return;
            }

            googleLoginMutation.mutate(googleCredential);
          }}
          onError={() => {
            toast.error('Google login nije uspeo.');
          }}
        />
      )}
    </div>
  );
};
