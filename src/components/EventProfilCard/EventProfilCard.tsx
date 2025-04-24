import { useDeleteEvent } from '@green-world/hooks/useDeleteEvent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShareIcon from '@mui/icons-material/Share';
import StopIcon from '@mui/icons-material/Stop';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useLocation, useNavigate } from 'react-router-dom';

import { PopDelete } from '../PopDelete';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const EventProfilCard = ({ ...props }) => {
  const { mutate } = useDeleteEvent(props.event?._id);
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
          image={props?.event?.coverImage || ZSLogo}
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
                minHeight: '3.0em'
              }}
            >
              {props.event?.description.length > 45
                ? props.event?.description.substring(0, 45) + '...'
                : props.event?.description}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <CalendarMonthIcon />
              {props.event?.dateAction}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <PlayArrowIcon fontSize="small" />
                {props.event?.startTime}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <StopIcon fontSize="small" />
                {props.event?.endTime}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <PlaceIcon />
              {props.event?.place}
            </Typography>
          </Box>
        </CardContent>
        {location.pathname.includes('/profile') && (
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <EditIcon
                onClick={() => navigate(`/edit-event/${props.event?._id}`)}
              />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://www.zeleni-svet.com/event/${props.event?._id}`
                  )
                }
              />
            </IconButton>

            <PopDelete
              key="delete"
              title={'Brisanje događaja'}
              description={'Da li ste sigurni da želite da obrišete događaj?'}
              okText={'Da'}
              cancelText={'Ne'}
              id={props.event?._id}
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
