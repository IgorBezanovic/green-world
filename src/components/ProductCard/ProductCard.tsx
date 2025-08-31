import { useDeleteProduct } from '@green-world/hooks/useDeleteProduct';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PopDelete } from '../PopDelete';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

interface ProductCardProps {
  product: any;
  isHero?: boolean;
}

export const ProductCard = ({ product, isHero = false }: ProductCardProps) => {
  const { mutate } = useDeleteProduct(product?._id);
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  const mainImage = product?.images?.[0]?.includes('cloudinary')
    ? `${product.images[0]}?format=webp&width=400`
    : ZSLogo;
  const blurImage = product?.images?.[0]?.includes('cloudinary')
    ? `${product.images[0]}?format=webp&width=20&blur=200`
    : ZSLogo;

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
        {/* Blur placeholder */}
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
        {/* Main image */}
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
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          <Tooltip title={product.title} arrow>
            <Typography gutterBottom variant="h6" noWrap>
              {product.title}
            </Typography>
          </Tooltip>
          <Divider variant="fullWidth" />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography
              gutterBottom
              variant="body2"
              sx={{
                color: 'text.secondary',
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
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
          <CardActions disableSpacing sx={{ justifyContent: 'space-around' }}>
            <IconButton
              aria-label="Edit Product"
              onClick={() => navigate(`/edit-product/${product._id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Share Product"
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://www.zelenisvet.rs/product/${product._id}`
                )
              }
            >
              <ShareIcon />
            </IconButton>

            <PopDelete
              key="delete"
              title={'Brisanje proizvoda'}
              description={'Da li ste sigurni da zelite da orisete proizvod?'}
              okText={'Da'}
              cancelText={'Ne'}
              id={product._id}
              mutate={mutate}
            >
              <IconButton aria-label="Delete Product">
                <DeleteIcon />
              </IconButton>
            </PopDelete>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};
