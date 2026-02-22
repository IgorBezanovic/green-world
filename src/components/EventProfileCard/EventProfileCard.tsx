import { useDeleteEvent } from '@green-world/hooks/useDeleteEvent';
import {
  formatDate,
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Copy, EditIcon, Trash } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { PopDelete } from '../PopDelete';

export const EventProfileCard = ({ ...props }) => {
  const { mutate } = useDeleteEvent(props.event?._id);
  const navigate = useNavigate();
  const location = useLocation();
  const plainText = getPlainTextFromHtml(props.event?.description);

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
        navigate(`/event/${props.event?._id}`)
      }
    >
      <Box
        sx={{ position: 'relative', display: 'inline-block', width: '100%' }}
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
          image={formatImageUrl(props?.event?.coverImage, 55)}
          alt="Event Image"
        />
        <Chip
          label={
            props.event?.typeAction === 'cleaning'
              ? 'Čišćenje'
              : props.event?.typeAction === 'selling'
                ? 'Prodaja'
                : 'Sadnja'
          }
          color={
            props.event?.typeAction === 'cleaning'
              ? 'error'
              : props.event?.typeAction === 'selling'
                ? 'info'
                : 'success'
          }
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2
          }}
        />
      </Box>
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
            flexGrow: 1,
            paddingBottom: '8px'
          }}
        >
          <Tooltip title={props.event?.title} arrow>
            <Typography gutterBottom variant="h6" noWrap>
              {props.event?.title}
            </Typography>
          </Tooltip>
          <Divider variant="fullWidth" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              paddingTop: '8px'
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
                minHeight: '3.0em'
              }}
            >
              {plainText.length > 50
                ? plainText.substring(0, 50) + '...'
                : plainText}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography
                variant="body2"
                component="span"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CalendarMonthIcon sx={{ fontSize: 18 }} />
                {formatDate(props.event?.dateAction)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <PlaceIcon sx={{ fontSize: 18 }} />
                {props.event?.place.length > 20
                  ? props.event?.place.substring(0, 20) + '...'
                  : props.event?.place}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Divider variant="fullWidth" />
        {location.pathname.includes('/profile') && (
          <CardActions disableSpacing sx={{ justifyContent: 'space-around' }}>
            <IconButton
              aria-label="add to favorites"
              onClick={() => navigate(`/edit-event/${props.event?._id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="share"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `https://www.zelenisvet.rs/event/${props.event?._id}`
                  )
                  .then(() => {
                    toast.success('Kopiran link');
                  })
                  .catch(() => {
                    alert('Neuspešno kopiranje linka');
                  });
              }}
            >
              <Copy />
            </IconButton>

            <PopDelete
              key="delete"
              title={'Brisanje aktivnosti'}
              description={'Da li ste sigurni da želite da obrišete aktivnost?'}
              okText={'Da'}
              cancelText={'Ne'}
              id={props.event?._id}
              mutate={mutate}
            >
              <IconButton aria-label="share">
                <Trash />
              </IconButton>
            </PopDelete>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};
