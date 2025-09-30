import { Event } from '@green-world/utils/types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { Chip, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const dateAction = event?.dateAction ?? null;
  const timeAction = event?.startTime ?? null;
  const typeAction = event?.typeAction ?? null;

  const parsedDate = dayjs(dateAction, 'DD/MM/YYYY');
  const isFinished =
    parsedDate.isValid() && dayjs().isAfter(parsedDate.endOf('day'));

  const handleNavigate = () => {
    if (event._id) {
      navigate(`/event/${event._id}`);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%',
          maxWidth: isTablet ? 600 : '100%',
          margin: isTablet ? 'auto' : 0,
          overflow: 'hidden',
          cursor: !location.pathname.includes('/profile')
            ? 'pointer'
            : 'default',
          boxShadow: 3,
          height: isMobile ? 'auto' : 240
        }}
        onClick={handleNavigate}
      >
        <CardMedia
          component="img"
          sx={{
            width: isMobile ? '100%' : isTablet ? 200 : 180,
            height: isMobile ? 180 : 240,
            objectFit: 'cover',
            flexShrink: 0
          }}
          image={event?.coverImage}
          alt="Event cover"
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            px: 2,
            py: 2
          }}
        >
          <CardContent sx={{ flex: 1, p: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mb: 1
              }}
            >
              <Chip
                label={
                  typeAction === 'cleaning'
                    ? 'Čišćenje'
                    : typeAction === 'selling'
                      ? 'Prodaja'
                      : 'Sadnja'
                }
                color={
                  typeAction === 'cleaning'
                    ? 'error'
                    : typeAction === 'selling'
                      ? 'info'
                      : 'success'
                }
                size="small"
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#228B22',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <PlaceIcon fontSize="small" />
                {event?.place}
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {event?.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {event?.description}
            </Typography>
          </CardContent>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              px: 0,
              pt: 1,
              mt: 'auto'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#228B22',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <CalendarMonthIcon fontSize="small" />
              {dateAction?.toString() || ''}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#228B22',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <AccessTimeIcon fontSize="small" />
              {timeAction}
            </Typography>
          </Box>
        </Box>
      </Card>

      {isFinished && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 1
          }}
        >
          <img
            src="https://res.cloudinary.com/dijofqxeu/image/upload/v1750070602/qjj5peqvwjdrqonnop7n.png
"
            alt="Završeno"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
              filter: 'drop-shadow(2px 2px 4px black)'
            }}
          />
        </Box>
      )}
    </Box>
  );
};
