import { UserInfo } from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useUser } from '@green-world/hooks/useUser';
import { removeItem } from '@green-world/utils/cookie';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import './style.css';

export const UserProfile = () => {
  const navigate = useNavigate();
  const { data } = useUser();
  const { data: products } = useAllUserProducts();

  const handleLogout = () => {
    removeItem('token');
    navigate('/');
  };

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Korisnicki profil</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/profile" />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'flex',
          'flex-col',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'gap-7'
        )}
      >
        <div className={clsx('flex', 'gap-7')}>
          <section className={clsx('w-1/4')}>
            <UserInfo user={data} />
          </section>
          <div className={clsx('w-3/4')}>
            <div className={clsx('w-full', 'flex', 'gap-7', 'mb-7')}>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'bg-whiteLinen',
                  'font-extralight',
                  'uppercase'
                )}
                onClick={() => navigate('/create-product')}
              >
                Dodaj proizvod
              </button>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'bg-whiteLinen',
                  'font-extralight',
                  'uppercase'
                )}
                onClick={() => navigate('/edit-profile')}
              >
                Podesavanje profila
              </button>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'bg-whiteLinen',
                  'font-extralight',
                  'uppercase'
                )}
                onClick={() => navigate('/contact-us')}
              >
                Kontaktirajte podršku
              </button>
            </div>
            <section className={clsx('py-5', 'bg-primary')}>
              {products?.map((product: any) => (
                <p key={product.title}>{JSON.stringify(product)}</p>
              ))}
            </section>
          </div>
        </div>
        <button
          className={clsx(
            'flex-1',
            'border-2',
            'border-forestGreen',
            'rounded',
            'py-2',
            'px-4',
            'shadow-md',
            'bg-whiteLinen'
          )}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
};
