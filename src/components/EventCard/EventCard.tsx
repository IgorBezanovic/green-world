import { Event } from '@green-world/utils/types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const dateAction = event?.dateAction ?? null;
  const timeAction = event?.startTime ?? null;
  const typeAction = event?.typeAction ?? null;

  return (
    <Card
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: 220,
        overflow: 'hidden',
        cursor: !location.pathname.includes('/profile') ? 'pointer' : 'default'
      }}
      onClick={() => {
        if (event?._id) {
          navigate(`/event/${event?._id}`);
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: 1, gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
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
            />
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                color: '#228B22',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <PlaceIcon />
              {event?.place}
            </Typography>
          </Box>
          <Typography component="div" variant="h6" sx={{ mt: 1 }}>
            {event?.title}
          </Typography>
          <Typography
            component="div"
            sx={{
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {event?.description.length > 60
              ? event?.description.substring(0, 60) + '...'
              : event?.description}
          </Typography>
        </CardContent>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pb: 2
          }}
        >
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: '#228B22',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <CalendarMonthIcon />
            {dateAction}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: '#228B22',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <AccessTimeIcon />
            {timeAction}
          </Typography>
        </Box>
      </Box>

      <CardMedia
        component="img"
        sx={{ width: 180 }}
        image={event?.coverImage}
        alt="Event cover"
      />
    </Card>
  );
};
