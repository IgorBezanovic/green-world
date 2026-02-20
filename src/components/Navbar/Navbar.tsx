import { ZSLogoLogoMark } from '@green-world/components';
import { Box, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

export const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Početna', path: '/' },
    { label: 'Proizvodi', path: '/search' },
    { label: 'Događaji', path: '/events' },
    { label: 'Prodavnice', path: '/shops' },
    { label: 'Blog', path: '/blog' },
    { label: 'Trampimo se', path: '/menjajmo-se' },
    {
      label: 'AI Savetovanje',
      path: 'https://www.instagram.com/direct/t/3114437125407040/'
    },
    { label: 'Dokumenta', path: '/documents' }
  ];

  const openAISavelovanje = (url: string) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.open(
        'https://aistudio.instagram.com/ai/1793506384688561/?utm_source=website',
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box
      sx={{
        height: 40,
        backgroundColor: (theme) => theme.palette.secondary.main,
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
      {navItems?.map((item) => {
        const isActive = location.pathname === item.path;
        const showBadge =
          item.label !== 'Proizvodi' &&
          item.label !== 'Događaji' &&
          item.label !== 'Početna' &&
          item.label !== 'Prodavnice' &&
          item.label !== 'Dokumenta' &&
          item.label !== 'Blog' &&
          item.label !== 'AI Savetovanje';

        return (
          <Box
            key={item.label}
            sx={{
              position: 'relative',
              display: 'inline-block',
              cursor: 'pointer',
              mx: 1
            }}
            onClick={() =>
              !showBadge && item.label === 'AI Savetovanje'
                ? openAISavelovanje(item.path)
                : navigate(item.path)
            }
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: theme.palette.common.white,
                paddingBottom: isActive ? '3px' : 0,
                borderBottom: (theme) =>
                  isActive ? `2px solid ${theme.palette.primary.main}` : 'none',
                transition: 'all 0.3s ease',
                mx: 1,
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
                  bgcolor: theme.palette.primary.dark,
                  color: 'white',
                  px: 0.5,
                  py: '2px',
                  fontSize: '0.5rem',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3
                }}
              >
                <ZSLogoLogoMark
                  color={theme.palette.primary.contrastText}
                  width="9px"
                />{' '}
                Uskoro
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
