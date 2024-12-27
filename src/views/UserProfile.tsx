import {
  CustomButton,
  CustomInput,
  ProductCard,
  UserInfo
} from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useUser } from '@green-world/hooks/useUser';
import { getItem, removeItem } from '@green-world/utils/cookie';
import { Card } from 'antd';
import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import './style.css';

export const UserProfile = () => {
  const navigate = useNavigate();
  const decodedToken: any = jwtDecode(getItem('token')!);
  const { data: userData, isLoading: userLoading } = useUser(decodedToken._id);
  const { data: products = [], isLoading } = useAllUserProducts();
  const [productsToDisplay, setProductsToDisplay] = useState([]);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      setProductsToDisplay(products);
    }
  }, [products, isLoading]);

  const handleLogout = () => {
    removeItem('token');
    navigate('/');
  };

  const filterProducts = (searchTerm: string) => {
    const filtered = products.filter((product: any) =>
      product.title
        .toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim())
    );
    setProductsToDisplay(filtered);
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
          'md:flex-row',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'gap-7'
        )}
      >
        <section
          className={clsx('w-full', 'md:w-1/4', 'flex', 'flex-col', 'gap-5')}
        >
          <UserInfo
            user={userData}
            userLoading={userLoading}
            customStyleMeta={['flex', 'flex-col']}
          />
          <CustomButton
            text={'Dodaj proizvod'}
            type={'text'}
            onClick={() => navigate('/create-product')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton
            text={'Podesavanje profila'}
            type={'text'}
            onClick={() => navigate('/profile-settings/edit-profile')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton
            text={'Kontaktirajte podršku'}
            type={'text'}
            onClick={() => navigate('/contact-us')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton type={'text'} onClick={handleLogout} text={'Log out'} />
        </section>
        <section
          className={clsx('w-full', 'md:w-3/4', 'gap-7', 'flex', 'flex-col')}
        >
          <Card>
            <CustomInput
              type="text"
              placeholder="Pretrazi po nazivu proizvoda"
              customStyle={['!mb-0']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                filterProducts(e.target.value)
              }
            />
          </Card>
          <section
            className={clsx(
              'w-full',
              'grid',
              'grid-cols-2',
              'sm:grid-cols-3',
              'lgm:grid-cols-4',
              'gap-5'
            )}
          >
            {productsToDisplay.length > 0 ? (
              productsToDisplay?.map((product: any) => (
                <ProductCard
                  key={product.title}
                  product={product}
                  loading={isLoading}
                />
              ))
            ) : (
              <p className={clsx('col-span-full')}>
                Jos uvek niste dodali proizvode
              </p>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};
