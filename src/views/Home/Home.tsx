'use client';

import {
  GroupButton,
  LazySection,
  ProductSection,
  GridProducts,
  MetaTags,
  ServiceSection
} from '@green-world/components';
import { useHomeProducts } from '@green-world/hooks/useHomeProducts';
import { homeCategories } from '@green-world/utils/constants';
import { ZSBannerRs, ZSBannerRsTablet } from '@green-world/utils/images';
import { Box, Button, Typography, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const Home = () => {
  const { t } = useTranslation();
  const { data, isFetching } = useHomeProducts();
  const navigate = useNavigate();
  const shouldRenderServiceSection =
    isFetching || (data?.services?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
      />
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          gap: 4,
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          display: 'flex',
          flexDirection: 'column'
        })}
      >
        <Box component="picture" sx={{ display: 'block', width: '100%' }}>
          <source media="(max-width: 768px)" srcSet={ZSBannerRsTablet} />
          <Box
            component="img"
            src={ZSBannerRs}
            alt={t('home.bannerAlt')}
            loading="eager"
            decoding="async"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 1,
              mb: 0.5,
              boxShadow: 1
            }}
            style={{
              objectFit: 'cover',
              filter: 'blur(10px)',
              transition: 'filter 0.5s ease'
            }}
            onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.currentTarget as HTMLImageElement).style.filter = 'blur(0)';
            }}
          />
        </Box>
        {/* <FeaturedProducts /> */}
        {/* <FeaturedShops /> */}
        <Box
          sx={(theme) => ({
            textAlign: 'center',
            my: 1.5,
            [theme.breakpoints.up('md')]: {
              my: 2
            }
          })}
        >
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontSize: '3.75rem !important',
              [theme.breakpoints.down('md')]: {
                fontSize: '3rem !important'
              },
              color: 'secondary.main',
              fontFamily: 'Ephesis'
            })}
          >
            {t('home.latestProductsTitle')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: '42rem', marginX: 'auto', color: 'text.primary' }}
          >
            {t('home.latestProductsSubtitle')}
          </Typography>
        </Box>
        {isFetching ? (
          <Box
            sx={(theme) => ({
              display: 'grid',
              gap: 3,
              gridTemplateColumns: 'repeat(1, 1fr)',
              [theme.breakpoints.up('xs')]: {
                gridTemplateColumns: 'repeat(2, 1fr)'
              },
              [theme.breakpoints.up('md')]: {
                gridTemplateColumns: 'repeat(3, 1fr)'
              },
              [theme.breakpoints.up('lg')]: {
                gridTemplateColumns: 'repeat(4, 1fr)'
              }
            })}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <Box key={idx}>
                <Skeleton
                  variant="rectangular"
                  sx={{ height: 200, mb: 1.5, borderRadius: 1 }}
                />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1rem', width: '80%' }}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '0.9rem', width: '60%' }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          data?.recentProducts.length && (
            <GridProducts products={data?.recentProducts} />
          )
        )}
        <LazySection>
          <Button
            variant="contained"
            size="large"
            sx={{
              textTransform: 'uppercase',
              padding: 2,
              marginY: 2
            }}
            onClick={() => navigate('/products')}
          >
            {t('home.searchAllProducts')}
          </Button>
        </LazySection>

        {shouldRenderServiceSection && (
          <ServiceSection
            title={t('home.latestServicesTitle')}
            subTitle={t('home.latestServicesSubtitle')}
            services={data?.services}
            isLoading={isFetching}
            searchAllLabel={t('home.searchAllServices')}
            onSearchAll={() => navigate('/services')}
            onOpenService={(serviceId) => navigate(`/services/${serviceId}`)}
            t={t}
          />
        )}

        <Typography
          variant="h2"
          sx={(theme) => ({
            fontSize: '3.75rem !important',
            textAlign: 'center',
            [theme.breakpoints.down('md')]: {
              fontSize: '3rem !important'
            },
            color: 'secondary.main',
            fontFamily: 'Ephesis'
          })}
        >
          {t('home.categoriesTitle')}
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: '42rem', marginX: 'auto', color: 'text.primary' }}
        >
          {t('home.categoriesSubtitle')}
        </Typography>
        <Box
          component="section"
          sx={(theme) => ({
            display: 'grid',
            gap: theme.spacing(3),
            maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
            gridTemplateColumns: 'repeat(1, 1fr)',
            [theme.breakpoints.up('xs')]: {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: 'repeat(4, 1fr)'
            }
          })}
        >
          {homeCategories?.map((category) => (
            <GroupButton key={category.id} item={category} />
          ))}
        </Box>
        <LazySection>
          <Button
            variant="contained"
            size="large"
            sx={{
              textTransform: 'uppercase',
              padding: 2,
              marginTop: 6,
              marginBottom: 1
            }}
            onClick={() => navigate('/products')}
          >
            {t('home.searchAllProducts')}
          </Button>
        </LazySection>
        {/* <FeaturedShopsBanner /> */}
        <ProductSection
          title={t('catalog.groups.flower_assortment')}
          subTitle={t('home.sectionSubtitles.flower_assortment')}
          products={data?.flower_assortment}
        />
        <ProductSection
          title={t('catalog.groups.succulents')}
          subTitle={t('home.sectionSubtitles.succulents')}
          products={data?.succulents}
        />
        <ProductSection
          title={t('catalog.groups.potted_flowers')}
          subTitle={t('home.sectionSubtitles.potted_flowers')}
          products={data?.potted_flowers}
        />
        <ProductSection
          title={t('catalog.groups.seedlings')}
          subTitle={t('home.sectionSubtitles.seedlings')}
          products={data?.seedlings}
        />
        <ProductSection
          title={t('catalog.groups.fruits_and_vegetables')}
          subTitle={t('home.sectionSubtitles.fruits_and_vegetables')}
          products={data?.fruits_and_vegetables}
        />
        <ProductSection
          title={t('catalog.groups.herbal_pharmacy')}
          subTitle={t('home.sectionSubtitles.herbal_pharmacy')}
          products={data?.herbal_pharmacy}
        />
        <ProductSection
          title={t('catalog.groups.garden_decoration')}
          subTitle={t('home.sectionSubtitles.garden_decoration')}
          products={data?.garden_decoration}
        />
        <ProductSection
          title={t('catalog.groups.everything_for_plants')}
          subTitle={t('home.sectionSubtitles.everything_for_plants')}
          products={data?.everything_for_plants}
        />
      </Box>
    </Box>
  );
};
