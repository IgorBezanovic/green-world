import { EventCard } from '@green-world/components';
import {
  Box,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';

export const EventCarousel = ({ ...props }) => {
  const events = useMemo(
    () => (Array.isArray(props.events) ? props.events : []),
    [props.events]
  );

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [pageIndex, setPageIndex] = useState(0);
  const cardsPerPage = isDesktop ? 4 : 1;

  const pagedEvents = useMemo(() => {
    const chunks: any[] = [];
    for (let i = 0; i < events.length; i += cardsPerPage) {
      chunks.push(events.slice(i, i + cardsPerPage));
    }
    return chunks;
  }, [events, cardsPerPage]);

  const handlePrev = () => {
    if (!pagedEvents.length) return;
    setPageIndex((prev) => (prev === 0 ? pagedEvents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!pagedEvents.length) return;
    setPageIndex((prev) => (prev === pagedEvents.length - 1 ? 0 : prev + 1));
  };

  if (props.isLoading) {
    return (
      <Box
        sx={(theme) => ({
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(1, 1fr)',
          [theme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(2, 1fr)'
          }
        })}
      >
        {Array.from({ length: isDesktop ? 4 : 2 }).map((_, idx) => (
          <Box key={idx} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" height={260} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!events.length) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No events</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        px: isDesktop ? 6 : 0
      }}
    >
      {pagedEvents.length > 1 && isDesktop && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 0,
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: 3,
              '&:hover': { backgroundColor: '#f0f0f0' }
            }}
          >
            <ArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 0,
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: 3,
              '&:hover': { backgroundColor: '#f0f0f0' }
            }}
          >
            <ArrowRight />
          </IconButton>
        </>
      )}

      <Box
        sx={(theme) => ({
          width: '100%',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(1, 1fr)',
          [theme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(2, 1fr)'
          }
        })}
      >
        {(pagedEvents[pageIndex] || []).map((event: any) => (
          <Box key={event._id || event.title} sx={{ p: 1 }}>
            <EventCard event={event} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
