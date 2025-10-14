import { Box, Button, useTheme } from '@mui/material';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

import { SocialMedia } from '../SocialMedia';

export const NavTrack = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      component="nav"
      sx={{
        py: 0.5,
        px: 3,
        [theme.breakpoints.up('xl')]: {
          px: 0.5
        },
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'flex',
          justifyContent: 'space-between'
        },
        maxWidth: theme.breakpoints.values.xl,
        width: '100%',
        mx: 'auto'
      }}
    >
      <Button
        onClick={() => navigate('/contact-us')}
        startIcon={<Mail />}
        sx={{
          fontSize: '0.775rem',
          color: 'black',
          textTransform: 'none',
          padding: 0
        }}
      >
        Pišite nam
      </Button>
      <SocialMedia
        color={theme.palette.secondary.main}
        isAppData={true}
        size={'18px'}
      />
    </Box>
  );
};
