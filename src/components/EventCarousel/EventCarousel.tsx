import { EventCard } from '@green-world/components';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Carousel, Empty, Skeleton } from 'antd';
import { useRef } from 'react';

export const EventCarousel = ({ ...props }) => {
  const events = Array.isArray(props.events) ? props.events : [];
  const carouselRef = useRef<any>(null);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return events && events.length > 0 ? (
    <Skeleton loading={props.isLoading} active>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          px: isDesktop ? 6 : 0
        }}
      >
        {events.length > 4 && isDesktop && (
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
              <ArrowBackIosNew />
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
              <ArrowForwardIos />
            </IconButton>
          </>
        )}
        <Box sx={{ width: '100%' }}>
          <Carousel
            ref={carouselRef}
            draggable={true}
            infinite
            slidesToShow={2}
            rows={events.length < 3 ? 1 : 2}
            responsive={[
              {
                breakpoint: 900,
                settings: {
                  slidesToShow: 1,
                  rows: 1
                }
              }
            ]}
            slidesToScroll={1}
          >
            {events.map((event) => (
              <Box key={event.title} sx={{ p: 1 }}>
                <EventCard event={event} />
              </Box>
            ))}
          </Carousel>
        </Box>
      </Box>
    </Skeleton>
  ) : (
    <Empty />
  );
};
