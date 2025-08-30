import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Carousel, Empty, Skeleton } from 'antd';
import clsx from 'clsx';
import '../styles.css';
import { useRef } from 'react';

import { ProductCard } from './ProductCard';

export const HomeCarousel = ({ ...props }) => {
  const products = Array.isArray(props.products) ? props.products : [];
  const carouselRef = useRef<any>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return products && products.length > 0 ? (
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
        {products.length > 5 && isDesktop && (
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
            infinite={products.length > 5}
            slidesToShow={5}
            responsive={[{ breakpoint: 768, settings: { slidesToShow: 2 } }]}
            slidesToScroll={1}
            className={clsx('w-full')}
          >
            {products.map((product: any, index: number) => (
              <div key={product.title} className="p-2">
                <ProductCard product={product} isHero={index === 0} />
              </div>
            ))}
          </Carousel>
        </Box>
      </Box>
    </Skeleton>
  ) : (
    <Empty />
  );
};
