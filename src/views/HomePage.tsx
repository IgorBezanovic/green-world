import { Search } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

export const HomePage = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-[100vh]')}>
      <Helmet>
        <link rel="canonical" href="https://www.green-world-six.vercel.app/" />
      </Helmet>
      <div
        className={clsx('max-w-[1400px]', 'mx-auto', 'p-5', 'flex', 'gap-5')}
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
