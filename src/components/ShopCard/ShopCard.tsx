import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Globe,
  Store,
  Package,
  MapPin,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

interface Address {
  street?: string;
  city?: string;
  country?: string;
}

export interface ShopCardProps {
  id: string;
  name?: string;
  shopName?: string;
  description?: string;
  email?: string;
  profileImage?: string;
  onlyOnline?: boolean;
  numberOfProducts?: number;
  address?: Address;
}

export const ShopCard = ({
  id,
  name,
  shopName,
  description,
  email,
  profileImage,
  onlyOnline,
  numberOfProducts = 0,
  address
}: ShopCardProps) => {
  const [loadingMap, setLoadingMap] = useState(true);

  const hasAddress = address?.street || address?.city || address?.country;
  const title = shopName || name;

  return (
    <Link to={`/shop/${id}`} style={{ textDecoration: 'none' }}>
      <Card
        elevation={2}
        sx={(theme) => ({
          borderRadius: '20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'success.light',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          [theme.breakpoints.up('md')]: {
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }
          }
        })}
      >
        {/* HEADER / MAP */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 150,
            backgroundColor: '#e5e7eb',
            overflow: 'hidden'
          }}
        >
          {onlyOnline ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)'
              }}
            />
          ) : hasAddress ? (
            <>
              {loadingMap && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6',
                    zIndex: 10
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${address?.street || ''}, ${address?.city || ''}, ${
                    address?.country || ''
                  }`
                )}&output=embed`}
                onLoad={() => setLoadingMap(false)}
              />
            </>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <MapPin />
              <Typography variant="caption" color="text.disabled">
                Lokacija nije dodata
              </Typography>
            </Box>
          )}
        </Box>

        {/* CONTENT */}
        <CardContent
          sx={{
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexGrow: 1
            // height: '100%'
          }}
        >
          {/* AVATAR */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: -6,
              position: 'relative'
            }}
          >
            <Avatar
              src={formatImageUrl(profileImage!, 55)}
              alt={name}
              sx={{
                width: 96,
                height: 96,
                mb: 2,
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />

            {onlyOnline && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 'calc(50% - 48px)',
                  backgroundColor: 'success.main',
                  borderRadius: '50%',
                  width: 26,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  border: '2px solid white'
                }}
              >
                <Globe size={14} color="white" />
              </Box>
            )}
          </Box>

          {/* TITLE & CHIPS */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700}>
              {title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 1,
                flexWrap: 'wrap'
              }}
            >
              <Chip
                size="medium"
                icon={onlyOnline ? <Globe size={14} /> : <Store size={14} />}
                label={onlyOnline ? 'Samo online' : 'Fizička prodavnica'}
                color="success"
                variant="outlined"
                sx={{ paddingX: '4px', color: 'common.black' }}
              />

              <Chip
                size="medium"
                icon={<Package size={14} />}
                label={`${numberOfProducts} proizvoda`}
                color="success"
                variant="outlined"
                sx={{ paddingX: '4px', color: 'common.black' }}
              />
            </Box>
          </Box>

          {/* DESCRIPTION */}
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {description}
            </Typography>
          )}

          {/* INFO */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              fontSize: 14,
              color: '#374151'
            }}
          >
            {address?.city && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5
                }}
              >
                <MapPin size={16} />
                {address.city}, {address.country}
              </Box>
            )}
            {email && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  wordBreak: 'break-all'
                }}
              >
                <Mail size={16} />
                {email}
              </Box>
            )}
          </Box>
        </CardContent>

        {/* FOOTER */}
        <Box
          sx={{
            px: 3,
            py: 2,
            mt: 2,
            borderTop: '1px solid',
            borderColor: 'success.light',
            color: 'success.main',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Pogledaj prodavnicu
          <ArrowUpRight size={18} />
        </Box>
      </Card>
    </Link>
  );
};
