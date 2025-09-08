import { Box, Button } from '@mui/material';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavTrack = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      sx={(theme) => ({
        py: 0.5,
        px: 0,
        [theme.breakpoints.down('xl')]: {
          px: 2
        },
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'flex'
        },
        maxWidth: theme.breakpoints.values.xl,
        width: '100%',
        mx: 'auto'
      })}
    >
      <Button
        onClick={() => navigate('/contact-us')}
        startIcon={<Mail />}
        sx={{
          fontSize: '0.775rem',
          color: 'black',
          textTransform: 'none',
          py: 0,
          px: 1.5
        }}
      >
        Pišite nam
      </Button>
    </Box>
  );
};
