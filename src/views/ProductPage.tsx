import { Divider, HomeCarousel, UserInfo } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { useProduct } from '@green-world/hooks/useProduct';
import { useUser } from '@green-world/hooks/useUser';
import { Card, Skeleton } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

export const ProductPage = () => {
  const { productId } = useParams();
  const { data: products, isLoading } = useAllProducts();
  const { data: productData, isLoading: productLoading } = useProduct(
    productId!
  );
  const { data: sellerData, isLoading: userLoading } = useUser(
    productData?.createdBy
  );
  const [idexOfImage, setIndexOfImage] = useState(0);

  console.log(productData);
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | {productData?.title ?? 'Green World'}</title>
        <link
          rel="canonical"
          href={`https://www.zeleni-svet.com/product/${productId}`}
        />
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
          'flex-col',
          'gap-7'
        )}
      >
        <Skeleton loading={productLoading} active avatar>
          <Card style={{ width: '100%' }}>
            <section className={clsx('flex', 'gap-4', 'w-full', 'mb-20')}>
              <div className={clsx('flex', 'flex-col', 'w-1/2', 'gap-4')}>
                <img
                  src={productData?.images[idexOfImage]}
                  alt={productData?.title}
                  className={clsx('rounded-md', 'shadow-lg')}
                />
                <footer
                  className={clsx('grid', 'grid-cols-4', 'w-full', 'gap-2')}
                >
                  {productData?.images.map((image: string, index: number) => (
                    <img
                      src={image}
                      alt={image}
                      key={image}
                      onClick={() => setIndexOfImage(index)}
                      className={clsx(
                        'rounded-md',
                        'shadow',
                        'aspect-square',
                        'w-full',
                        'cursor-pointer'
                      )}
                    />
                  ))}
                </footer>
              </div>
              <div className={clsx('w-1/2')}>aaa</div>
            </section>
            <Card style={{ width: '100%' }} title={productData?.title}>
              <section
                dangerouslySetInnerHTML={{ __html: productData?.description }}
              />
            </Card>
          </Card>
        </Skeleton>
        <UserInfo userLoading={userLoading} user={sellerData} />
        <Divider text="Proizvodi iz {{grupe}}" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Svi proizvodi ovog prodavca" />
        <HomeCarousel products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};
