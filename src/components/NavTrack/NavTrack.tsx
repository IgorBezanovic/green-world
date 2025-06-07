import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button } from '@mui/material';
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
          px: 4
        },
        [theme.breakpoints.down('sm')]: {
          px: 3
        },
        [theme.breakpoints.down('xs')]: {
          px: 2
        },
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'flex'
        },
        maxWidth: 1400,
        width: '100%',
        mx: 'auto'
      })}
    >
      <Button
        onClick={() => navigate('/contact-us')}
        startIcon={<MailOutlineIcon />}
        sx={{
          fontSize: '0.775rem',
          color: 'black',
          textTransform: 'none',
          py: 0,
          px: 0.5
        }}
      >
        Pišite nam
      </Button>
    </Box>
  );
};
