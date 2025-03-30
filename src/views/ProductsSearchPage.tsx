import { ProductCard, Search } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { ProductFiltersParams } from '@green-world/utils/types';
import { Card } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const ProductsSearchPage = () => {
  const [filters, setFilters] = useState<ProductFiltersParams>();
  const { data: allProducts } = useAllProducts(filters);

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
        <Card className={clsx('w-1/3')}>
          <Search onFilterChange={setFilters} />
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
          {allProducts?.products && allProducts?.products.length ? (
            allProducts?.products.map((product: any) => (
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
