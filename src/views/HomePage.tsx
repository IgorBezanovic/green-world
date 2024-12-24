import {
  CustomButton,
  Divider,
  HomeCarousel,
  RedirectSquare
} from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { homeCategories } from '@green-world/utils/constants';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
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
  const navigate = useNavigate();

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Green world</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/" />
      </Helmet>
      <div
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
        <Divider text="Izdvojeni proizvodi" />
        <HomeCarousel products={allProducts} isLoading={allProductsLoading} />
        <Divider text="Kategorije Proizvoda" />
        <section
          className={clsx(
            'w-full',
            'max-w-[1320px]',
            'mx-auto',
            'grid',
            'grid-cols-2',
            'md:grid-cols-4',
            'gap-4',
            'sm:gap-6',
            'lg:gap-10'
          )}
        >
          {homeCategories.map((category) => (
            <RedirectSquare item={category} key={category.id} />
          ))}
        </section>
        <CustomButton
          type="text"
          customStyle={['py-4', 'text-lg']}
          onClick={() => navigate('/search')}
        >
          Pretrazi sve proizvode
        </CustomButton>
        <Divider text="Cvetni asortiman" />
        <HomeCarousel
          products={flowerAssortment}
          isLoading={flowerAssortmentLoading}
        />
        <Divider text="Sukulenti" />
        <HomeCarousel products={succulents} isLoading={succulentsLoading} />
        <Divider text="Saksijsko cvece" />
        <HomeCarousel
          products={pottedFlowers}
          isLoading={pottedFlowersLoading}
        />
        <Divider text="Sadnice" />
        <HomeCarousel products={seedlings} isLoading={seedlingsLoading} />
        <Divider text="Voce i povrce" />
        <HomeCarousel
          products={fruitsAndVegetables}
          isLoading={fruitsAndVegetablesLoading}
        />
        <Divider text="Biljna apoteka" />
        <HomeCarousel
          products={herbalPharmacy}
          isLoading={herbalPharmacyLoading}
        />
        <Divider text="Bastenska dekoracija" />
        <HomeCarousel
          products={gardenDecoration}
          isLoading={gardenDecorationLoading}
        />
        <Divider text="Sve za biljke" />
        <HomeCarousel
          products={everythingForPlants}
          isLoading={everythingForPlantsLoading}
        />
        {/* <div className={clsx('w-full', 'flex', 'gap-7')}>
          <aside className={clsx('w-1/4', 'h-[400px]', 'bg-forestGreen')}>
            Katalog:
          </aside>
          <div
            className={clsx(
              'w-3/4',
              'bg-mainYellow',
              'grid',
              'grid-cols-4',
              'gap-5'
            )}
          >
            <p className={clsx('bg-mainRed')}>Blog post: 1</p>
            <p className={clsx('bg-mainRed')}>Blog post: 2</p>
            <p className={clsx('bg-mainRed')}>Blog post: 3</p>
            <p className={clsx('bg-mainRed')}>Blog post: 4</p>
            <p className={clsx('bg-mainRed')}>Blog post: 5</p>
            <p className={clsx('bg-mainRed')}>Blog post: 6</p>
            <p className={clsx('bg-mainRed')}>Blog post: 7</p>
            <p className={clsx('bg-mainRed')}>Blog post: 8</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};
