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
                type={'text'}
                onClick={() => navigate('/create-product')}
                customStyle={'!flex-1'}
              />
              <CustomButton
                text={'Podesavanje profila'}
                type={'text'}
                onClick={() => navigate('/edit-profile')}
                customStyle={'!flex-1'}
              />
              <CustomButton
                text={'Kontaktirajte podršku'}
                type={'text'}
                onClick={() => navigate('/contact-us')}
                customStyle={'!flex-1'}
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
        <CustomButton type={'text'} onClick={handleLogout} text={'Log out'} />
      </div>
    </div>
  );
};
