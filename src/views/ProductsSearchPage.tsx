import { Search } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

export const ProductsSearchPage = () => {
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
          'gap-7'
        )}
      >
        <div className={clsx('w-1/4')}>
          <Search />
        </div>
        <div className={clsx('w-3/4', 'bg-primary')}>
          <section>Igorica</section>
        </div>
      </div>
    </div>
  );
};
