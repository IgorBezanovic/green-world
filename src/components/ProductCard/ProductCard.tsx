import { useDeleteProduct } from '@green-world/hooks/useDeleteProduct';
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
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Copy, EditIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { PopDelete } from '../PopDelete';

interface ProductCardProps {
  product: Product | ProductPreview;
  isHero?: boolean;
  isPromotedView?: boolean;
  productsRefetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Product[], Error>>;
}

export const ProductCard = ({
  product,
  isHero = false,
  isPromotedView = false,
  productsRefetch
}: ProductCardProps) => {
  const { mutate } = useDeleteProduct(product?._id, {
    onSuccess: () => {
      if (productsRefetch) productsRefetch();
    }
  });

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
            {isPromotedView ? (
              isPromotionExpired ? (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Obnovi', product._id);
                  }}
                >
                  Obnovi
                </Button>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: 'success.main' }}
                >
                  Aktivno još {daysLeft} {daysLeft === 1 ? 'dan' : 'dana'}
                </Typography>
              )
            ) : (
              <>
                <IconButton
                  aria-label="Edit Product"
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  aria-label="Share Product"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        `https://www.zelenisvet.rs/product/${product._id}`
                      )
                      .then(() => toast.success('Kopiran link'))
                      .catch(() => alert('Neuspešno kopiranje linka'));
                  }}
                >
                  <Copy />
                </IconButton>

                <PopDelete
                  title="Brisanje proizvoda"
                  description="Da li ste sigurni da želite da obrišete proizvod?"
                  okText="Da"
                  cancelText="Ne"
                  id={product._id}
                  mutate={mutate}
                >
                  <IconButton aria-label="Delete Product">
                    <Trash />
                  </IconButton>
                </PopDelete>
              </>
            )}
          </CardActions>
        )}
      </Box>
    </Card>
  );
};
