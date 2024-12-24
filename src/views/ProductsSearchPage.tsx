import { ProductCard, Search } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { Card } from 'antd';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const ProductsSearchPage = () => {
  const { data: allProducts } = useAllProducts();

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
          <Search />
        </Card>
        <Card className={clsx('w-2/3')}>
          {allProducts && allProducts.length ? (
            allProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div>No data</div>
          )}
        </Card>
      </div>
    </div>
  );
};
