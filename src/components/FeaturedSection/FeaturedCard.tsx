import { ProductPreview } from '@green-world/hooks/useHomeProducts';
import { formatImageUrl } from '@green-world/utils/helpers';
import type { User } from '@green-world/utils/types';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography
} from '@mui/material';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export type FeaturedItem =
  | { type: 'product'; data: ProductPreview }
  | { type: 'shop'; data: User };

export const FeaturedCard = ({ item }: { item: FeaturedItem }) => {
  const [loaded, setLoaded] = useState(false);

  const isProduct = item.type === 'product';
  const data = item.data;

  const imageUrl = isProduct
    ? (data as ProductPreview).images?.[0]
    : (data as User).profileImage || (data as User).coverImage;

  const mainImage = imageUrl?.includes('cloudinary')
    ? `${imageUrl}?format=webp&width=400`
    : formatImageUrl(imageUrl || '', 55);
  const blurImage = imageUrl?.includes('cloudinary')
    ? `${imageUrl}?format=webp&width=20&blur=200`
    : formatImageUrl(imageUrl || '', 55);

  const title = isProduct
    ? (data as ProductPreview).title
    : (data as User).shopName || (data as User).name || 'Prodavnica';
  const description = isProduct
    ? (data as ProductPreview).shortDescription ||
      (data as ProductPreview).description
    : (data as User).shopDescription || '';
  const href = isProduct
    ? `/product/${(data as ProductPreview)._id}`
    : `/shop/${(data as User)._id}`;

  return (
    <Card
      component={Link}
      to={href}
      sx={{
        height: 430,
        maxHeight: 430,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#FFF5EC',
        border: '1px solid',
        borderColor: 'warning.main',
        boxShadow: '0 2px 8px rgba(237, 108, 2, 0.12)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(237, 108, 2, 0.2)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box
        component="div"
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          overflow: 'hidden'
        }}
      >
        <Chip
          icon={<Star size={14} />}
          label="Istaknuto"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            fontWeight: 600,
            backgroundColor: 'warning.main',
            color: 'warning.contrastText',
            '& .MuiChip-icon': { color: 'inherit' }
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
        {mainImage ? (
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
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.300',
              color: 'grey.600'
            }}
          >
            <Typography variant="body2">
              {isProduct ? 'Nema slike' : 'Prodavnica'}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0
          }}
        >
          <Typography gutterBottom variant="h3" noWrap>
            {title}
          </Typography>
          <Divider variant="fullWidth" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              minHeight: 0
            }}
          >
            <Typography
              gutterBottom
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minHeight: '5em',
                paddingTop: '8px'
              }}
            >
              {description || (isProduct ? '—' : 'Pogledajte našu ponudu.')}
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 12 }} />
            {isProduct ? (
              <Typography variant="h5">
                {(data as ProductPreview).priceOnRequest ? (
                  'Cena Na Upit'
                ) : (
                  <>
                    RSD{' '}
                    {(data as ProductPreview).price
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
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
            ) : (
              <Typography variant="body2" fontWeight={600} color="warning.dark">
                Pogledaj prodavnicu →
              </Typography>
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};
