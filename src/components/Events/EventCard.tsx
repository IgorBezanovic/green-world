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
  events: Event[];
}

export const EventCard = ({ events }: EventCardProps) => {
  const theme = useTheme();
  const firstEvent = events?.[0] ?? null;
  const dateAction = firstEvent?.dateAction ?? null;
  const timeAction = firstEvent?.timeAction ?? null;
  const typeAction = firstEvent?.typeAction ?? null;
  //console.log(props);
  return (
    <Card sx={{ display: 'flex', width: "388px"}}  >
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
              {firstEvent?.place}
            </Typography>
          </Box>
          <Typography component="div" variant="h6">
            {firstEvent?.title}
          </Typography>
          <Typography
            component="div"
            sx={{
              wordBreak: 'break-word',
              maxWidth: '25ch', // Ograničava širinu teksta na otprilike 40 karaktera
              whiteSpace: 'pre-wrap'
            }}
          >
            {firstEvent?.description +
              ' akcija čišćenja reke Save, ponesite rukavice i kese'}
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
        sx={{ width: 151 }}
        image={firstEvent?.coverImage}
        alt="Live from space album cover"
      />
    </Card>
  );
};
