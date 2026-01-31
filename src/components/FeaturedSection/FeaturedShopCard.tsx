import { formatImageUrl } from '@green-world/utils/helpers';
import type { User } from '@green-world/utils/types';
import { Box, Card, Chip, Typography } from '@mui/material';
import { Globe, MapPin, Package, Phone, Star, Store } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export const FeaturedShopCard = ({ shop }: { shop: User }) => {
  const [loaded, setLoaded] = useState(false);

  const imageUrl = shop.coverImage || shop.profileImage;
  const mainImage = imageUrl?.includes('cloudinary')
    ? `${imageUrl}?format=webp&width=800`
    : formatImageUrl(imageUrl || '', 55);
  const blurImage = imageUrl?.includes('cloudinary')
    ? `${imageUrl}?format=webp&width=20&blur=200`
    : formatImageUrl(imageUrl || '', 55);

  const title = shop.shopName || shop.name || 'Prodavnica';
  const description = shop.shopDescription || '';
  const href = `/shop/${shop._id}`;

  const addressParts = [];
  if (shop.address?.city) addressParts.push(shop.address.city);
  if (shop.address?.street) addressParts.push(shop.address.street);
  const fullAddress = addressParts.join(', ');

  return (
    <Card
      component={Link}
      to={href}
      sx={{
        height: 430,
        maxHeight: 430,
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF5EC 100%)',
        border: '1px solid',
        borderColor: 'warning.main',
        boxShadow: '0 4px 20px rgba(237, 108, 2, 0.15)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(237, 108, 2, 0.25)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '55%',
          p: 3.5,
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Chip
            icon={<Star size={24} />}
            label="Istaknuta prodavnica"
            size="medium"
            sx={{
              mb: 4,
              fontWeight: 800,
              fontSize: '1.5rem',
              py: 2,
              backgroundColor: 'warning.main',
              color: 'warning.contrastText',
              '& .MuiChip-icon': { color: 'inherit' }
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              color: 'warning.dark',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '1.75rem'
            }}
          >
            <Store size={28} />
            {title}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1.5,
              fontSize: '0.95rem'
            }}
          >
            {description || 'Pogledajte našu ponudu!'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {fullAddress && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={18} color="#ed6c02" />
              <Typography
                variant="h3"
                color="text.secondary"
                sx={{ fontSize: '0.95rem' }}
              >
                {fullAddress}
              </Typography>
            </Box>
          )}

          {shop.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone size={18} color="#ed6c02" />
              <Typography
                variant="h3"
                color="text.secondary"
                sx={{ fontSize: '0.95rem' }}
              >
                {shop.phone}
              </Typography>
            </Box>
          )}

          {shop.website && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Globe size={18} color="#ed6c02" />
              <Typography
                variant="h3"
                color="text.secondary"
                sx={{
                  fontSize: '0.95rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {shop.website.replace(/^https?:\/\//, '')}
              </Typography>
            </Box>
          )}

          {shop.numberOfProducts > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Package size={18} color="#ed6c02" />
              <Typography
                variant="h3"
                color="text.secondary"
                sx={{ fontSize: '0.95rem' }}
              >
                {shop.numberOfProducts}{' '}
                {shop.numberOfProducts === 1 ? 'proizvod' : 'proizvoda'}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            color: 'warning.dark',
            mt: 2,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          Poseti prodavnicu →
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: '45%',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
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
              objectFit: 'contain',
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
              objectFit: 'contain',
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              color: 'grey.600',
              gap: 1
            }}
          >
            <Store size={64} />
            <Typography variant="body1" fontWeight={500}>
              Prodavnica
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};
