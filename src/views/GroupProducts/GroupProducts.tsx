import { ProductCard } from '@green-world/components';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { categories } from '@green-world/utils/constants';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

export const GroupProducts = () => {
  const navigate = useNavigate();
  const { category = '' } = useParams();

  useEffect(() => {
    if (!category || !categories.includes(category)) {
      navigate('/');
    }
  }, [category, navigate]);

  const { data: products } = useProductsByGroup(category);

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Pretraga proizvoda</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/search" />
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
          {products && products?.length ? (
            products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div>No data</div>
          )}
        </section>
      </div>
    </div>
  );
};
