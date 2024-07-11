import { Divider, RedirectSquare } from '@green-world/components';
import { homeCategories } from '@green-world/utils/constants';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
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
        <Link
          style={{
            backgroundImage: "url('/pikaso.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom 48% center',
            width: 'w-full',
            height: '200px'
          }}
          className={clsx('flex', 'shadow-md')}
          to="/search"
          aria-label="Home"
        />
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
            'hover:text-seaFoamGreen',
            'leading-normal',
            'font-medium',
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
            'transition'
          )}
          to={'/search'}
        >
          Pretrazi sve proizvode
        </Link>
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
        <Divider text="Izdvojeni proizvodi" />
        <section className={clsx('w-full', 'bg-primary', 'h-[200px]')}>
          Izdvojeni proizvodi
        </section>
      </div>
    </div>
  );
};
