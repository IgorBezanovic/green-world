import { useFeatured } from '@green-world/hooks/useFeatured';
import { Box, Typography } from '@mui/material';
import { Carousel, Skeleton } from 'antd';
import { useMemo, useRef } from 'react';

import { LazySection } from '../LazySection';
import type { FeaturedItem } from './FeaturedCard';
import { FeaturedCard } from './FeaturedCard';
import { FeaturedShopCard } from './FeaturedShopCard';

export const FeaturedSection = () => {
  const shopsCarouselRef = useRef<any>(null);
  const productsCarouselRef = useRef<any>(null);

  const {
    promotedProducts,
    promotedShops,
    isLoadingProducts,
    isLoadingShops,
    isFetchingProducts,
    isFetchingShops
  } = useFeatured();

  const shopItems = useMemo(() => {
    return promotedShops;
  }, [promotedShops]);

  const productItems: FeaturedItem[] = useMemo(() => {
    return promotedProducts.map((p) => ({
      type: 'product',
      data: p
    }));
  }, [promotedProducts]);

  const hasShops = shopItems.length > 0;
  const hasProducts = productItems.length > 0;
  const hasAny = hasShops || hasProducts;
  const loading = isLoadingProducts || isLoadingShops;

  if (!hasAny && !loading) return null;

  return (
    <LazySection>
      {(hasShops || isLoadingShops) && (
        <Box sx={{ mb: 6 }}>
          <Box
            sx={(t) => ({
              textAlign: 'center',
              mb: 4,
              [t.breakpoints.down('md')]: { mb: 2 }
            })}
          >
            <Typography
              variant="h2"
              sx={(t) => ({
                fontSize: '3.75rem !important',
                [t.breakpoints.down('md')]: { fontSize: '3rem !important' },
                color: 'secondary.main',
                fontFamily: 'Ephesis'
              })}
            >
              Istaknute Prodavnice
            </Typography>
          </Box>

          <Skeleton
            loading={isFetchingShops && !hasShops}
            active
            paragraph={{ rows: 2 }}
          >
            {hasShops ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  mx: 'auto'
                }}
              >
                <Carousel
                  ref={shopsCarouselRef}
                  draggable
                  infinite={shopItems.length > 1}
                  autoplay={shopItems.length > 1}
                  autoplaySpeed={3000}
                  slidesToShow={Math.min(4, shopItems.length)}
                  slidesToScroll={1}
                  className="w-full"
                  adaptiveHeight
                  responsive={[
                    {
                      breakpoint: 1536,
                      settings: {
                        slidesToShow: Math.min(4, shopItems.length),
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 1200,
                      settings: {
                        slidesToShow: Math.min(3, shopItems.length),
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 900,
                      settings: {
                        slidesToShow: Math.min(2, shopItems.length),
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]}
                >
                  {shopItems.map((shop) => (
                    <Box key={shop._id} sx={{ p: 2 }}>
                      <FeaturedShopCard shop={shop} />
                    </Box>
                  ))}
                </Carousel>
              </Box>
            ) : (
              isLoadingShops && (
                <Box
                  sx={{
                    minHeight: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Skeleton active paragraph={{ rows: 1.5 }} />
                </Box>
              )
            )}
          </Skeleton>
        </Box>
      )}

      {(hasProducts || isLoadingProducts) && (
        <Box>
          <Box
            sx={(t) => ({
              textAlign: 'center',
              mb: 4,
              [t.breakpoints.down('md')]: { mb: 2 }
            })}
          >
            <Typography
              variant="h2"
              sx={(t) => ({
                fontSize: '3.75rem !important',
                [t.breakpoints.down('md')]: { fontSize: '3rem !important' },
                color: 'secondary.main',
                fontFamily: 'Ephesis'
              })}
            >
              Istaknuti Proizvodi
            </Typography>
          </Box>

          <Skeleton
            loading={isFetchingProducts && !hasProducts}
            active
            paragraph={{ rows: 2 }}
          >
            {hasProducts ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Carousel
                    ref={productsCarouselRef}
                    draggable
                    infinite={productItems.length > 4}
                    autoplay={productItems.length > 4}
                    autoplaySpeed={3000}
                    slidesToShow={Math.min(4, productItems.length)}
                    slidesToScroll={1}
                    className="w-full"
                    adaptiveHeight
                    responsive={[
                      {
                        breakpoint: 1536,
                        settings: {
                          slidesToShow: Math.min(4, productItems.length),
                          slidesToScroll: 1
                        }
                      },
                      {
                        breakpoint: 1200,
                        settings: {
                          slidesToShow: Math.min(3, productItems.length),
                          slidesToScroll: 1
                        }
                      },
                      {
                        breakpoint: 900,
                        settings: {
                          slidesToShow: Math.min(2, productItems.length),
                          slidesToScroll: 1
                        }
                      },
                      {
                        breakpoint: 600,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1
                        }
                      }
                    ]}
                  >
                    {productItems.map((item) => (
                      <Box key={item.data._id} sx={{ p: 2 }}>
                        <FeaturedCard item={item} />
                      </Box>
                    ))}
                  </Carousel>
                </Box>
              </Box>
            ) : (
              isLoadingProducts && (
                <Box
                  sx={{
                    minHeight: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Skeleton active paragraph={{ rows: 1.5 }} />
                </Box>
              )
            )}
          </Skeleton>
        </Box>
      )}
    </LazySection>
  );
};
