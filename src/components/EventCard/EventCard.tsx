import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Event } from '@green-world/utils/types';
import { Chip } from '@mui/material';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const dateAction = event?.dateAction ?? null;
  const timeAction = event?.timeAction ?? null;
  const typeAction = event?.typeAction ?? null;
  return (
    <Card
      sx={{
        display: 'flex',
        width: 460, // fiksna širina
        height: 200, // fiksna visina
        overflow: 'hidden', // sprečava da sadržaj "curi" van kartice
        padding: "10px",
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label={typeAction} className="!bg-forestGreen  !text-white" />
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
          <Typography component="div" variant="h6">
            {event?.title}
          </Typography>
          <Typography
            component="div"
            sx={{
              wordBreak: 'break-word',
              maxWidth: '25ch', // Ograničava širinu teksta na otprilike 40 karaktera
              whiteSpace: 'pre-wrap'
            }}
          >
            {event?.description.length > 60
              ? event?.description.substring(0, 60) + '...'
              : event?.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 180 }}
        image={event?.coverImage}
        alt="Live from space album cover"
      />
    </Card>
  );
};
