import { useMetaAuth } from '@green-world/hooks/useMetaAuth';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Button } from '@mui/material';
import { useEffect } from 'react';

const APP_ID = import.meta.env.VITE_API_META_APP_ID;

declare global {
  interface Window {
    FB: any;
  }
}

export const MetaLoginAuth = () => {
  const { mutate } = useMetaAuth();

  useEffect(() => {
    if (window.FB) return;
    ((d, s, id) => {
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.onload = () => {
        window.FB.init({
          appId: APP_ID,
          cookie: true,
          xfbml: false,
          version: 'v18.0'
        });
      };
      d.body.appendChild(js);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleFBLogin = () => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          window.FB.api(
            '/me',
            { fields: 'name,email,picture' },
            (userInfo: any) => {
              mutate({
                name: userInfo.name,
                email: userInfo.email,
                image: userInfo.picture?.data?.url
              });
            }
          );
        } else {
          console.error('Facebook login failed');
        }
      },
      { scope: 'email,public_profile' }
    );
  };

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleFBLogin}
      startIcon={<FacebookIcon />}
      sx={{
        padding: '8px 0',
        width: '100%',
        backgroundColor: '#1877F2',
        color: '#fff',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '14px',
        borderRadius: '3px',
        '&:hover': {
          backgroundColor: '#1564c4'
        }
      }}
    >
      Nastavite sa Facebook-om
    </Button>
  );
};
