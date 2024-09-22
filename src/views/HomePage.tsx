import { Divider, HomeCarousel, RedirectSquare } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { homeCategories } from '@green-world/utils/constants';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { data: products, isLoading } = useAllProducts();

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
        <HomeCarousel products={products} isLoading={isLoading} />
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
        <Link
          className={clsx(
            'text-forestGreen',
            'md:hover:text-seaFoamGreen',
            'leading-normal',
            'text-xl',
            'font-extralight',
            'uppercase',
            'border-2',
            'rounded',
            'min-h-12',
            'p-4',
            'max-h-12',
            'flex',
            'items-center',
            'justify-center',
            'text-center',
            'shadow-md',
            'transition',
            'my-4'
          )}
          to={'/search'}
        >
          Pretrazi sve proizvode
        </Link>
        <Divider text="Cvetni asortiman" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Sukulenti" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Saksijsko cvece" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Sadnice" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Voce i povrce" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Biljna apoteka" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Bastenska dekoracija" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Sve za biljke" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <div className={clsx('w-full', 'flex', 'gap-7')}>
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
        </div>
      </div>
    </div>
  );
};
