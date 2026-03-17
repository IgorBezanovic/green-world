import { SocialMedia } from '@green-world/components';
import { LanguageSwitcher } from '@green-world/components/LanguageSwitcher';
import { useNewsletterSubscribe } from '@green-world/hooks/useNewsletterSubscribe';
import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const Footer = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);
  const navigate = useNavigate();
  const token = getItem('token');
  const decodedToken = safeDecodeToken<DecodedToken>(token);
  const { t } = useTranslation();
  const { mutateAsync: subscribeToNewsletter, isPending: isNewsletterLoading } =
    useNewsletterSubscribe();

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = userEmail.trim().toLowerCase();

    setIsEmailInvalid(false);

    if (!email || !isValidEmail(email)) {
      setIsEmailInvalid(true);
      toast.error(t('orderProductView.invalidEmail'));
      return;
    }

    try {
      const response = await subscribeToNewsletter({ email });

      if (response?.success) {
        toast.success(t('footer.newsletterSuccess'));
        setUserEmail('');
        return;
      }
    } catch {
      toast.error(t('footer.newsletterError'));
    }
  };

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        position: 'relative',
        backgroundColor: theme.palette.secondary.main,
        paddingX: '16px',
        paddingY: '40px',
        shadow: theme.shadows[1],
        [theme.breakpoints.down('xl')]: {
          px: 4
        },
        [theme.breakpoints.down('sm')]: {
          px: 3
        },
        [theme.breakpoints.down('xs')]: {
          px: 2
        }
      })}
    >
      {/* Sekcija sa društvenim mrežama i newsletter */}
      <Box
        component="section"
        sx={(theme) => ({
          maxWidth: 1400,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          [theme.breakpoints.up('sm')]: {
            gridTemplateColumns: 'repeat(2, 1fr)'
          },
          [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: 'repeat(4, 1fr)'
          },
          gap: '40px',
          [theme.breakpoints.up('md')]: {
            gap: '80px'
          }
        })}
      >
        <Box>
          <SocialMedia color="white" isAppData={true} />

          <Box
            component="form"
            onSubmit={handleNewsletterSubmit}
            sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}
          >
            <Typography
              component="label"
              htmlFor="email"
              variant="body1"
              sx={{ color: 'white' }}
            >
              {t('footer.newsletterLabel')}
            </Typography>
            <TextField
              type="email"
              name="email"
              id="email"
              placeholder={t('footer.newsletterPlaceholder')}
              aria-label={t('footer.newsletterAriaLabel')}
              autoComplete="email"
              size="small"
              sx={{ mt: 1 }}
              slotProps={{
                input: {
                  sx: {
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    }
                  }
                },
                inputLabel: {
                  sx: { color: 'white' }
                }
              }}
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
                if (isEmailInvalid) {
                  setIsEmailInvalid(false);
                }
              }}
              error={isEmailInvalid}
              disabled={isNewsletterLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="info"
              sx={{ mt: 2 }}
              disabled={isNewsletterLoading}
            >
              {isNewsletterLoading
                ? t('orderProductView.submitting')
                : t('footer.newsletterButton')}
            </Button>
          </Box>
        </Box>

        {/* Brzi linkovi */}
        <Box
          component="nav"
          aria-label={t('footer.quickLinks')}
          sx={{ color: 'white' }}
        >
          <Typography variant="body1">{t('footer.quickLinks')}</Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5
            }}
          >
            <Box component="li">
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/contact-us')}
              >
                {t('footer.contact')}
              </Typography>
            </Box>
            <Box component="li">
              <Typography
                component="a"
                variant="body2"
                href="https://www.instagram.com/zeleni_svet_rs/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', textDecoration: 'underline' }}
              >
                {t('footer.aboutUs')}
              </Typography>
            </Box>
            <Box component="li">
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/search')}
              >
                {t('footer.products')}
              </Typography>
            </Box>
            <Box component="li">
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  navigate(decodedToken?._id ? '/profile' : '/login')
                }
              >
                {decodedToken?._id ? t('footer.profile') : t('footer.login')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Korisnička podrška */}
        <Box sx={{ color: 'white' }}>
          <Typography variant="body1">{t('footer.supportTitle')}</Typography>
          <Box component="ul" sx={{ mt: 1 }}>
            {[
              t('footer.supportCreateShop'),
              t('footer.supportCreateAd'),
              t('footer.supportCreateActivity')
            ].map((text) => (
              <Box
                component="li"
                key={text}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                <Typography component="span" variant="body2">
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Kontakt info / promocija */}
        <Box sx={{ color: 'white' }}>
          <Typography component="h2" variant="h5">
            {t('footer.promoTitle')}
          </Typography>
          <Typography
            component="a"
            href="mailto:info@zelenisvet.rs"
            sx={{ color: 'inherit', textDecoration: 'underline', mt: 1 }}
          >
            info@zelenisvet.rs
          </Typography>
          <Box sx={{ mt: 2 }}>
            <LanguageSwitcher color="white" />
          </Box>
          <Box
            component="img"
            src="https://res.cloudinary.com/dijofqxeu/image/upload/v1745438146/uqdzbq3113jypz6ercok.png"
            alt={t('footer.gardenerIllustrationAlt')}
            loading="lazy"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 10,
              height: 180
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
