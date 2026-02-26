import { useDeleteProduct } from '@green-world/hooks/useDeleteProduct';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { ProductPreview } from '@green-world/hooks/useHomeProducts';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Product } from '@green-world/utils/types';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Switch,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Copy, EditIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { PopDelete } from '../PopDelete';

interface ProductCardProps {
  product: Product | ProductPreview;
  isHero?: boolean;
  isPromotedView?: boolean;
  showQuickStockToggle?: boolean;
  promotedPeriod?: boolean;
}

export const ProductCard = ({
  product,
  isHero = false,
  isPromotedView = false,
  promotedPeriod = false
}: ProductCardProps) => {
  const { mutate } = useDeleteProduct(product?._id);
  const { mutate: editProduct, isPending: isStockUpdating } = useEditProduct(
    product?._id
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  const mainImage = product?.images?.[0]?.includes('cloudinary')
    ? `${product.images[0]}?format=webp&width=400`
    : `${formatImageUrl(product.images?.[0] || '', 55)}`;

  const blurImage = product?.images?.[0]?.includes('cloudinary')
    ? `${product.images[0]}?format=webp&width=20&blur=200`
    : `${formatImageUrl(product.images?.[0] || '', 55)}`;

  const isPromotionExpired =
    product?.promotedUntil && new Date(product.promotedUntil) < new Date();

  const daysLeft = product?.promotedUntil
    ? Math.ceil(
        (new Date(product.promotedUntil).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const handleQuickStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    editProduct({
      ...(product as Product),
      onStock: !product.onStock
    });
  };

  return (
    <Card
      sx={{
        maxHeight: !location.pathname.includes('/profile') ? 430 : 550,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        cursor: !location.pathname.includes('/profile') ? 'pointer' : 'default'
      }}
      onClick={() =>
        !location.pathname.includes('/profile') &&
        navigate(`/product/${product._id}`)
      }
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
        {blurImage && (
          <Box
            component="img"
            src={blurImage}
            alt={product.title}
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
        {mainImage && (
          <Box
            component="img"
            src={mainImage}
            alt={product.title}
            loading={isHero ? 'eager' : 'lazy'}
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
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          <Tooltip title={product.title} arrow>
            <Typography gutterBottom variant="h3" noWrap>
              {product.title}
            </Typography>
          </Tooltip>
          <Divider variant="fullWidth" />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
              {product.shortDescription || product.description}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="h5">
              {product.priceOnRequest ? (
                'Cena Na Upit'
              ) : (
                <>
                  RSD{' '}
                  {product.price
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
          </Box>
        </CardContent>

        <Divider variant="fullWidth" />
        {location.pathname.includes('/profile') && (
          <CardActions
            disableSpacing
            sx={{
              justifyContent: 'space-around',
              minHeight: 56,
              '& .MuiButton-root, & .MuiTypography-root': {
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {isPromotedView && (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    pb: 1,
                    gap: 1,
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    sx={{
                      textTransform: 'uppercase',
                      color: 'grey.900'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/promote-product', {
                        state: { promoteProductId: product._id }
                      });
                    }}
                  >
                    {isPromotionExpired ? 'Obnovi' : 'Promoviši'}
                  </Button>
                  {promotedPeriod && (
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: 'grey.600' }}
                    >
                      Aktivno još {daysLeft} {daysLeft === 1 ? 'dan' : 'dana'}
                    </Typography>
                  )}
                </Box>
              )}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 1,
                  gap: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ width: 'auto' }}
                  color={product?.onStock ? 'success.main' : 'warning.main'}
                >
                  {product?.onStock ? 'Na stanju' : 'Nije na stanju'}
                </Typography>
                <Switch
                  size="small"
                  color={product?.onStock ? 'success' : 'warning'}
                  checked={Boolean(product?.onStock)}
                  onChange={handleQuickStockToggle}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isStockUpdating}
                />
              </Box>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: 1,
                  pt: 1
                }}
              >
                <IconButton
                  aria-label="Edit Product"
                  title="Edit proizvoda"
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                >
                  <EditIcon style={{ strokeWidth: '2px' }} />
                </IconButton>

                <IconButton
                  aria-label="Share Product"
                  title="Kopiraj link proizvoda"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        `https://www.zelenisvet.rs/product/${product._id}`
                      )
                      .then(() => toast.success('Kopiran link'))
                      .catch(() => toast.error('Neuspešno kopiranje linka'));
                  }}
                >
                  <Copy style={{ strokeWidth: '2px' }} />
                </IconButton>

                <PopDelete
                  title="Brisanje proizvoda"
                  description="Da li ste sigurni da želite da obrišete proizvod?"
                  okText="Da"
                  cancelText="Ne"
                  id={product._id}
                  mutate={mutate}
                >
                  <IconButton
                    aria-label="Delete Product"
                    title="Obriši proizvod"
                  >
                    <Trash style={{ strokeWidth: '2px' }} />
                  </IconButton>
                </PopDelete>
              </Box>
            </Box>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};
