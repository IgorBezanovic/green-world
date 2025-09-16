import { Box, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Pocetna', path: '/' },
    { label: 'Proizvodi', path: '/search' },
    { label: 'Dogadjaji', path: '/dogadjaji' },
    { label: 'Prodavnice', path: '/prodavnice' },
    { label: 'Cvecara u blizini', path: '/prodavnice' },
    { label: 'Blog', path: '/blog' },
    { label: 'Menjajmo se', path: '/menjajmo-se' },
    { label: 'AI Savetovanje', path: '/ai-savetovanje' },
    { label: 'Dokumenta', path: '/dokumenta' }
  ];

  return (
    <Box
      sx={{
        height: 40,
        backgroundColor: '#15803d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
          justifyContent: 'flex-start'
        },
        px: 2,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const showBadge =
          item.label !== 'Proizvodi' && item.label !== 'Pocetna';

        return (
          <Box
            key={item.label}
            sx={{
              position: 'relative',
              display: 'inline-block',
              cursor: 'pointer',
              mx: 1
            }}
            onClick={() => !showBadge && navigate(item.path)}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: theme.palette.custom.lightCream,
                textDecoration: isActive ? 'underline' : 'none',
                px: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  opacity: !isActive ? 0.9 : 1
                }
              }}
            >
              {item.label}
            </Typography>

            {showBadge && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -3,
                  right: -15,
                  bgcolor: theme.palette.info.main,
                  color: 'white',
                  px: 0.5,
                  py: '2px',
                  fontSize: '0.5rem',
                  borderRadius: 1
                }}
              >
                uskoro
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
