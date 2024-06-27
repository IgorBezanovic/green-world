import { Divider } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-[100vh]')}>
      <Helmet>
        <link rel="canonical" href="https://www.green-world-six.vercel.app/" />
      </Helmet>
      <div
        className={clsx(
          'max-w-[1400px]',
          'mx-auto',
          'px-7',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <div className={clsx('w-full', 'h-[200px]', 'bg-primary')}>
          Reklamni prostor
        </div>
        <Link
          className={clsx(
            'text-forestGreen',
            'hover:text-seaFoamGreen',
            'leading-normal',
            'font-medium',
            'border-2',
            'rounded-xl',
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
          to={'/'}
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
        <Divider text="Kategorije Proizvoda" />
        <section
          className={clsx('w-full', 'bg-primary', 'h-[200px]', 'flex', 'gap-5')}
        >
          <div className={clsx('flex-1', 'bg-mainYellow')}>
            Cvetni asortiman
          </div>
          <div className={clsx('flex-1', 'bg-mainYellow')}>Sadnice</div>
          <div className={clsx('flex-1', 'bg-mainYellow')}>Voce i povrce</div>
          <div className={clsx('flex-1', 'bg-mainYellow')}>biljna apoteka</div>
        </section>
      </div>
    </div>
  );
};
