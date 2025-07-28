import { useDeleteProduct } from '@green-world/hooks/useDeleteProduct';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';

import { PopDelete } from '../PopDelete';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const ProductCard = ({ ...props }) => {
  const { mutate } = useDeleteProduct(props?.product?._id);
  const navigate = useNavigate();
  const location = useLocation();

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
        navigate(`/product/${props?.product._id}`)
      }
    >
      <CardMedia
        component="img"
        height="194"
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: '250px',
          aspectRatio: '1 / 1',
          objectFit: 'cover'
        }}
        image={
          props?.product?.images?.[0]
            ? props?.product?.images[0].includes('cloudinary')
              ? props?.product?.images[0]
              : ZSLogo
            : ZSLogo
        }
        alt="Product Image"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}
        >
          <Tooltip title={props?.product?.title} arrow>
            <Typography gutterBottom variant="h6" noWrap>
              {props?.product?.title}
            </Typography>
          </Tooltip>
          <Divider variant="fullWidth" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
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
              {props?.product?.shortDescription || props?.product?.description}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              RSD{' '}
              {props?.product?.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              <small>,00</small>
            </Typography>
          </Box>
        </CardContent>
        <Divider variant="fullWidth" />
        {location.pathname.includes('/profile') && (
          <CardActions disableSpacing sx={{ justifyContent: 'space-around' }}>
            <IconButton
              aria-label="add to favorites"
              onClick={() => navigate(`/edit-product/${props?.product?._id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="share"
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://www.zeleni-svet.com/product/${props?.product?._id}`
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
              id={props?.product?._id}
              mutate={mutate}
            >
              <IconButton aria-label="share">
                <DeleteIcon />
              </IconButton>
            </PopDelete>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};
