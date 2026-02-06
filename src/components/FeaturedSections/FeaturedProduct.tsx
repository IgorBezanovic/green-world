import { ProductPreview } from '@green-world/hooks/useHomeProducts';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export const FeaturedProduct = ({ product }: { product: ProductPreview }) => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  const imageUrl = product.images?.[0];
  const mainImage = imageUrl?.includes('cloudinary')
    ? `${imageUrl}?format=webp&width=400`
    : formatImageUrl(imageUrl || '', 55);
  const blurImage = imageUrl?.includes('cloudinary')
    ? `${imageUrl}?format=webp&width=20&blur=200`
    : formatImageUrl(imageUrl || '', 55);

  const title = product.title;
  const description = product.shortDescription || product.description;
  const href = `/product/${product._id}`;

  return (
    <Box
      component={Link}
      to={href}
      sx={{
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 430,
        background: `linear-gradient(
          135deg,
          rgba(46, 125, 50, 0.08) 0%,
          rgba(46, 125, 50, 0.03) 50%,
          ${theme.palette.background.paper} 100%
        )`,
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
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'hidden'
        }}
      >
        <Chip
          icon={<Star style={{ color: '#fff' }} />}
          label="Istaknuto"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            fontWeight: 600,
            background: `linear-gradient(
              135deg,
              ${theme.palette.success.main},
              ${theme.palette.success.dark}
            )`,
            color: '#fff',
            '& .MuiChip-icon': { color: 'inherit' },
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.45)'
          }}
        />
        {blurImage && (
          <Box
            component="img"
            src={blurImage}
            alt={title}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(20px)',
              transform: 'scale(1.05)',
              transition: 'opacity 0.5s ease',
              opacity: loaded ? 0 : 1
            }}
          />
        )}
        <Box
          component="img"
          src={mainImage}
          alt={title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease',
            opacity: loaded ? 1 : 0
          }}
        />
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            lineHeight: 1.4,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            mb: 2
          }}
        >
          {description || 'Pogledajte našu ponudu.'}
        </Typography>

        {/* CTA / PRICE */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.success.dark
          }}
        >
          {product.priceOnRequest ? (
            'Cena Na Upit'
          ) : (
            <>
              RSD{' '}
              {product.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              <Typography
                component="span"
                variant="caption"
                sx={{ fontSize: '0.75em' }}
              >
                ,00
              </Typography>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};
