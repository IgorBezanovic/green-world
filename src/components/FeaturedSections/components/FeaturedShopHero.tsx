import { formatImageUrl } from '@green-world/utils/helpers';
import type { User } from '@green-world/utils/types';
import { Box, Button, Chip, Typography, useTheme } from '@mui/material';
import { Crown, Package, Star, Store } from 'lucide-react';
import { Link } from 'react-router';

export const FeaturedShopHero = ({ shop }: { shop: User }) => {
  const theme = useTheme();

  const title = shop?.shopName || shop?.name || 'Prodavnica';
  const bckgImage =
    shop?.coverImage || shop?.profileImage
      ? formatImageUrl(shop.coverImage || shop.profileImage)
      : '/ozelenimo-svet-transparent.png';
  const description =
    shop?.shopDescription || 'Pogledajte ponudu ove premium prodavnice.';

  return (
    <Box
      component={Link}
      to={`/shop/${shop?._id}`}
      sx={(theme) => ({
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 2,
        p: 3,
        [theme.breakpoints.up('sm')]: {
          p: 4
        },
        [theme.breakpoints.up('md')]: {
          p: 6,
          flexDirection: 'row',
          alignItems: 'center'
        },
        minHeight: 300,
        display: 'flex',
        alignItems: 'space-between',
        justifyContent: 'space-between',
        gap: 4,
        overflow: 'hidden',
        flexDirection: 'column',

        /* PREMIUM BACKGROUND */
        background: `linear-gradient(
          135deg,
          rgba(46, 125, 50, 0.08) 0%,
          rgba(46, 125, 50, 0.03) 50%,
          ${theme.palette.background.paper} 100%
        )`,

        /* LEFT PREMIUM ACCENT */
        borderLeft: `4px solid ${theme.palette.success.main}`,

        boxShadow: `
          0 10px 30px rgba(0,0,0,0.08),
          0 2px 6px rgba(0,0,0,0.04)
        `,
        transition: 'transform .25s ease, box-shadow .25s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `
            0 18px 50px rgba(0,0,0,0.12),
            0 6px 12px rgba(0,0,0,0.06)
          `
        }
      })}
    >
      {/* BACKGROUND IMAGE OVERLAY */}
      <Box
        sx={{
          position: 'absolute',
          inset: 20,
          opacity: 0.12,
          backgroundImage: `url(${bckgImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none'
        }}
      />

      {/* LEFT CONTENT */}
      <Box
        sx={{
          maxWidth: 560,
          zIndex: 2
        }}
      >
        <Chip
          icon={<Crown style={{ color: 'white' }} />}
          label="Premium prodavnica"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: '0.85rem',
            px: 1.5,
            color: '#fff',
            background: `linear-gradient(
              135deg,
              ${theme.palette.success.main},
              ${theme.palette.success.dark}
            )`,
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.45)'
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Store size={28} />
          {title}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            mb: 4,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>

        {/* META INFO */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          {shop?.numberOfProducts !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Package size={18} />
              <Typography fontWeight={600}>
                {shop?.numberOfProducts} proizvoda
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <Star size={18} fill={theme.palette.success.main} />
            <Typography fontWeight={600}>5.0</Typography>
          </Box>
        </Box>
      </Box>

      {/* CTA */}
      <Button
        variant="contained"
        size="large"
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 700,
          fontSize: '0.95rem',
          [theme.breakpoints.up('sm')]: {
            fontSize: '1.25rem'
          },
          textTransform: 'uppercase',
          borderRadius: 999,
          whiteSpace: 'nowrap',
          zIndex: 2,
          boxShadow: '0 6px 18px rgba(46, 125, 50, 0.45)',
          transition: 'all .2s ease',
          color: '#fff',
          background: `linear-gradient(
              135deg,
              ${theme.palette.success.main},
              ${theme.palette.success.dark}
            )`,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 28px rgba(46, 125, 50, 0.6)'
          }
        }}
      >
        Poseti prodavnicu
      </Button>

      {/* RIGHT WATERMARK */}
      <Typography
        sx={{
          position: 'absolute',
          right: { xs: 16, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: { xs: '6rem', md: '10rem' },
          fontWeight: 800,
          color: 'rgba(0,0,0,0.04)',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {title.split(' ')[0].toUpperCase()}
      </Typography>
    </Box>
  );
};
