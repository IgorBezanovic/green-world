import {
  CustomButton,
  HomeCarousel,
  GroupButton,
  EventCarousel,
  LazySection
} from '@green-world/components';
import { useAllEvents } from '@green-world/hooks/useAllEvents';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { homeCategories } from '@green-world/utils/constants';
import { ZSBannerRs, ZSBannerRsTablet } from '@green-world/utils/images';
import { Box, Grid } from '@mui/material';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { data: allProducts, isLoading: allProductsLoading } = useAllProducts();
  const { data: flowerAssortment, isLoading: flowerAssortmentLoading } =
    useProductsByGroup('flower_assortment');
  const { data: succulents, isLoading: succulentsLoading } =
    useProductsByGroup('succulents');
  const { data: pottedFlowers, isLoading: pottedFlowersLoading } =
    useProductsByGroup('potted_flowers');
  const { data: seedlings, isLoading: seedlingsLoading } =
    useProductsByGroup('seedlings');
  const { data: fruitsAndVegetables, isLoading: fruitsAndVegetablesLoading } =
    useProductsByGroup('fruits_and_vegetables');
  const { data: herbalPharmacy, isLoading: herbalPharmacyLoading } =
    useProductsByGroup('herbal_pharmacy');
  const { data: gardenDecoration, isLoading: gardenDecorationLoading } =
    useProductsByGroup('garden_decoration');
  const { data: everythingForPlants, isLoading: everythingForPlantsLoading } =
    useProductsByGroup('everything_for_plants');
  const { data: allEvents, isLoading: allEventsLoading } = useAllEvents();
  const navigate = useNavigate();

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Green world</title>
        <link rel="canonical" href="https://www.zelenisvet.rs/" />
      </Helmet>

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
          className={clsx(
            'w-full',
            'h-auto',
            'rounded',
            'mt-4',
            'mb-2',
            'shadow'
          )}
          style={{
            objectFit: 'cover',
            filter: 'blur(10px)',
            transition: 'filter 0.5s ease'
          }}
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.currentTarget as HTMLImageElement).style.filter = 'blur(0)';
          }}
        />
        <div className="text-center my-8">
          <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
            Izdvojeni Proizvodi
          </h2>
          <p className="text-muted-forestGreen text-lg max-w-2xl mx-auto">
            Najnoviji proizvodi naših partnera
          </p>
        </div>
        <HomeCarousel
          products={allProducts?.products}
          isLoading={allProductsLoading}
        />
        <div className="text-center my-8">
          <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
            Kategorije Proizvoda
          </h2>
          <p className="text-muted-forestGreen text-lg max-w-2xl mx-auto">
            Pronađite sve što vam je potrebno za savršenu baštu i dom
          </p>
        </div>
        <Grid
          container
          component="section"
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            maxWidth: 1200,
            width: '100%',
            mx: 'auto'
          }}
        >
          {homeCategories.map((category) => (
            <Grid
              key={category.id}
              size={{
                xs: 6,
                sm: 4,
                lg: 3
              }}
            >
              <GroupButton item={category} />
            </Grid>
          ))}
        </Grid>
        <LazySection>
          <CustomButton
            type="text"
            customStyle={['py-4', 'text-lg']}
            onClick={() => navigate('/search')}
          >
            Pretrazi sve proizvode
          </CustomButton>
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Cvetni asortiman
            </h2>
          </div>
          <HomeCarousel
            products={flowerAssortment}
            isLoading={flowerAssortmentLoading}
          />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Sukulenti
            </h2>
          </div>
          <HomeCarousel products={succulents} isLoading={succulentsLoading} />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Saksijsko cvece
            </h2>
          </div>
          <HomeCarousel
            products={pottedFlowers}
            isLoading={pottedFlowersLoading}
          />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Sadnice
            </h2>
          </div>
          <HomeCarousel products={seedlings} isLoading={seedlingsLoading} />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Voce i povrce
            </h2>
          </div>
          <HomeCarousel
            products={fruitsAndVegetables}
            isLoading={fruitsAndVegetablesLoading}
          />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Biljna apoteka
            </h2>
          </div>
          <HomeCarousel
            products={herbalPharmacy}
            isLoading={herbalPharmacyLoading}
          />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Bastenska dekoracija
            </h2>
          </div>
          <HomeCarousel
            products={gardenDecoration}
            isLoading={gardenDecorationLoading}
          />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Sve za Biljke
            </h2>
          </div>
          <HomeCarousel
            products={everythingForPlants}
            isLoading={everythingForPlantsLoading}
          />
        </LazySection>
        <LazySection>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Aktivnosti
            </h2>
          </div>
          <EventCarousel events={allEvents} isLoading={allEventsLoading} />
        </LazySection>
      </Box>
    </Box>
  );
};
