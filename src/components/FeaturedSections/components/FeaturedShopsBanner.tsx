import { Box, Button, Typography, useTheme } from '@mui/material';
import { Crown } from 'lucide-react';

export const FeaturedShopsBanner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 320,
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,

        /* MATCHED PREMIUM BACKGROUND */
        background: `linear-gradient(
          135deg,
          rgba(46, 125, 50, 0.12) 0%,
          rgba(46, 125, 50, 0.05) 55%,
          ${theme.palette.background.paper} 100%
        )`,

        /* SAME PREMIUM ACCENT */
        borderLeft: `4px solid ${theme.palette.success.main}`,

        boxShadow: `
          0 10px 30px rgba(0,0,0,0.08),
          0 2px 6px rgba(0,0,0,0.04)
        `
      }}
    >
      {/* ICON */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: '50%',
          background: `linear-gradient(
            135deg,
            ${theme.palette.success.main},
            ${theme.palette.success.dark}
          )`,
          boxShadow: '0 6px 18px rgba(46, 125, 50, 0.45)',
          display: 'inline-flex'
        }}
      >
        <Crown style={{ color: '#fff', width: 28, height: 28 }} />
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 1
        }}
      >
        Istaknite svoju prodavnicu
      </Typography>

      <Typography
        sx={{
          maxWidth: 520,
          color: 'text.secondary',
          mb: 3,
          lineHeight: 1.6
        }}
      >
        Premium pozicija na početnoj strani donosi veću vidljivost, više poseta
        i jači brend.
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 700,
          fontSize: '1.1rem',
          textTransform: 'uppercase',
          borderRadius: 999,
          color: '#fff',
          background: `linear-gradient(
            135deg,
            ${theme.palette.success.main},
            ${theme.palette.success.dark}
          )`,
          boxShadow: '0 6px 18px rgba(46, 125, 50, 0.45)',
          transition: 'all .2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 28px rgba(46, 125, 50, 0.6)'
          }
        }}
      >
        Promoviši prodavnicu
      </Button>

      {/* WATERMARK */}
      <Typography
        sx={{
          position: 'absolute',
          right: 24,
          bottom: 16,
          fontSize: '6rem',
          fontWeight: 800,
          color: 'rgba(0,0,0,0.04)',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        PREMIUM
      </Typography>
    </Box>
  );
};
