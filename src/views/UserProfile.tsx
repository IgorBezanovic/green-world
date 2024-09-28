import { CustomButton, ProductCard, UserInfo } from '@green-world/components';
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
  const { data: products, isLoading } = useAllUserProducts();

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
              <CustomButton
                text={'Dodaj proizvod'}
                type={'outlined'}
                onClick={() => navigate('/create-product')}
              />
              <CustomButton
                text={'Podesavanje profila'}
                type={'outlined'}
                onClick={() => navigate('/edit-profile')}
              />
              <CustomButton
                text={'Kontaktirajte podršku'}
                type={'outlined'}
                onClick={() => navigate('/contact-us')}
              />
            </div>
            <section
              className={clsx(
                'gap-4',
                'grid',
                'grid-cols-2',
                'sm:grid-cols-3',
                'lgm:grid-cols-4'
              )}
            >
              {products?.map((product: any) => (
                <ProductCard
                  key={product.title}
                  product={product}
                  loading={isLoading}
                />
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
