import {
  CustomButton,
  GroupButton,
  LazySection,
  ProductSection,
  GridProducts,
  MetaTags,
  FeaturedShops,
  FeaturedShopsBanner,
  FeaturedProducts
} from '@green-world/components';
import { useHomeProducts } from '@green-world/hooks/useHomeProducts';
import { homeCategories } from '@green-world/utils/constants';
import { ZSBannerRs, ZSBannerRsTablet } from '@green-world/utils/images';
import { Box, Typography } from '@mui/material';
import { Skeleton } from 'antd';
import clsx from 'clsx';
import { useNavigate } from 'react-router';

export const Home = () => {
  const { data, isLoading, isFetching } = useHomeProducts();
  const navigate = useNavigate();

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Green world | Web Shop'} />
      <Box
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <Box
          component="img"
          src={ZSBannerRs}
          alt="Zeleni svet banner"
          loading="eager"
          decoding="async"
          srcSet={`${ZSBannerRsTablet} 768w, ${ZSBannerRs} 1400w`}
          sizes="(max-width: 768px) 100vw, 1400px"
          className={clsx('w-full', 'h-auto', 'rounded', 'mb-2', 'shadow')}
          style={{
            objectFit: 'cover',
            filter: 'blur(10px)',
            transition: 'filter 0.5s ease'
          }}
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.currentTarget as HTMLImageElement).style.filter = 'blur(0)';
          }}
        />
        <FeaturedProducts />
        <FeaturedShops />
        <div className="text-center my-6 md:my-8">
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
            Najnoviji Proizvodi
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: '42rem', marginX: 'auto', color: 'text.primary' }}
          >
            Najnoviji proizvodi naših partnera
          </Typography>
        </div>
        <Skeleton loading={isFetching} active paragraph={{ rows: 4 }}>
          {data?.recentProducts.length && (
            <GridProducts products={data?.recentProducts} />
          )}
        </Skeleton>
        <LazySection>
          <CustomButton
            type="text"
            customStyle={[
              'py-4',
              'text-lg',
              'max-w-[350px]',
              'w-full',
              'mx-auto',
              'rounded-lg',
              'mt-6'
            ]}
            onClick={() => navigate('/search')}
          >
            Pretrazi sve proizvode
          </CustomButton>
        </LazySection>
        <div className="text-center my-6 md:my-8">
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
            Kategorije Proizvoda
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: '42rem', marginX: 'auto', color: 'text.primary' }}
          >
            Pronađite sve što vam je potrebno za savršenu baštu i dom
          </Typography>
        </div>
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
          {homeCategories.map((category) => (
            <GroupButton key={category.id} item={category} />
          ))}
        </Box>
        <LazySection>
          <CustomButton
            type="text"
            customStyle={[
              'py-4',
              'text-lg',
              'max-w-[350px]',
              'w-full',
              'mx-auto',
              'rounded-lg',
              'mt-6'
            ]}
            onClick={() => navigate('/search')}
          >
            Pretrazi sve proizvode
          </CustomButton>
        </LazySection>
        <FeaturedShopsBanner />
        <ProductSection
          title="Cvetni asortiman"
          subTitle="Raznovrsno cveće za sve prilike i idealan poklon."
          products={data?.flower_assortment}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Sukulenti"
          subTitle="Niske potrebe za negom, idealni za kuću i kancelariju."
          products={data?.succulents}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Saksijsko cveće"
          subTitle="Lepo uređenje doma sa dugotrajnim cvećem u saksijama."
          products={data?.potted_flowers}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Sadnice"
          subTitle="Mladi biljni izdanci za sadnju u bašti ili vrtu."
          products={data?.seedlings}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Voće i povrće"
          subTitle="Sveže i kvalitetno voće i povrće za vašu baštu."
          products={data?.fruits_and_vegetables}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Biljna apoteka"
          subTitle="Lekovi, preparati, dohrana i zaštita za sve vrste biljaka."
          products={data?.herbal_pharmacy}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Baštenska dekoracija"
          subTitle="Unesite šarm i stil u baštu sa dekorativnim elementima."
          products={data?.garden_decoration}
          isLoading={isLoading}
          isGridDisplay={true}
        />
        <ProductSection
          title="Sve za Biljke"
          subTitle="Sve što vam treba za negu i održavanje biljaka."
          products={data?.everything_for_plants}
          isLoading={isLoading}
          isGridDisplay={true}
        />
      </Box>
    </Box>
  );
};
