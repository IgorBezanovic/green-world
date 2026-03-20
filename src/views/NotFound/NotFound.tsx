import {
  Footer,
  Header,
  MetaTags,
  Navbar,
  NavTrack,
  ZSLogoLogoMark
} from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { Box, Button, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export const NotFound = () => {
  const { t } = useTranslation();
  const { isUserLoggedIn } = useContext(UserContext);

  return (
    <React.Fragment>
      <MetaTags title={t('notFoundView.metaTitle')} />
      <NavTrack />
      <Header />
      <Navbar />
      <Box
        component="section"
        sx={{
          minHeight: 'calc(100vh - 320px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(to right, rgba(22, 163, 74, 0.9), rgba(21, 128, 61, 0.9))'
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
            gridAutoRows: '125px',
            placeItems: 'center',
            opacity: 0.14,
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: 120 }).map((_, index) => (
            <Box key={index} sx={{ width: 64, height: 80 }}>
              <ZSLogoLogoMark color="rgba(255,255,255,0.75)" />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 640,
            width: '100%',
            position: 'relative',
            zIndex: 1,
            color: 'common.white'
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: '6rem !important', fontWeight: 700 }}
          >
            404
          </Typography>
          <Typography variant="h4" sx={{ mb: 4, opacity: 0.95 }}>
            {t('notFoundView.subtitle')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              gap: 2,
              width: '100%'
            }}
          >
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="inherit"
              sx={{ color: 'success.dark' }}
            >
              {t('notFoundView.home')}
            </Button>
            {!isUserLoggedIn && (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ borderColor: 'common.white', color: 'common.white' }}
              >
                {t('notFoundView.login')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </React.Fragment>
  );
};
