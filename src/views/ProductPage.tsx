import { HomeCarousel, UserInfo } from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useProduct } from '@green-world/hooks/useProduct';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { useUser } from '@green-world/hooks/useUser';
import { homeCategories } from '@green-world/utils/constants';
import { Card, Skeleton } from 'antd';
import clsx from 'clsx';
import {
  CheckCircle,
  Store,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

export const ProductPage = () => {
  const { productId } = useParams();
  const { data: productData, isLoading: productLoading } = useProduct(
    productId!
  );
  const { data: sellerData, isLoading: userLoading } = useUser(
    productData?.createdBy || ''
  );
  const [idexOfImage, setIndexOfImage] = useState(0);
  const { data: groupProducts, isLoading: groupProductsLoading } =
    useProductsByGroup(productData?.group || '');
  const { data: sellerProducts, isLoading: sellerProductsLoading } =
    useAllUserProducts(productData?.createdBy);

  if (!productId) return <></>;

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | {productData?.title ?? 'Green World'}</title>
        <link
          rel="canonical"
          href={`https://www.zelenisvet.rs/product/${productId}`}
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
          <section className={clsx('flex', 'w-full', 'gap-4')}>
            <UserInfo
              userLoading={userLoading}
              user={sellerData}
              customStyleMeta={['flex-col']}
              customStyle={[
                'w-full',
                'flex-col',
                'hidden',
                'md:flex',
                'max-w-[270px]'
              ]}
            />

            <Card style={{ width: '100%' }}>
              <section
                className={clsx(
                  'flex',
                  'flex-col',
                  'md:flex-row',
                  'gap-4',
                  'w-full',
                  'mb-20'
                )}
              >
                <div
                  className={clsx(
                    'flex',
                    'flex-col',
                    'w-full',
                    'md:w-1/2',
                    'gap-4'
                  )}
                >
                  <div className="relative m-auto">
                    {productData?.images.length !== 1 && (
                      <button
                        className="absolute left-0 top-0 bottom-0 w-[50px] md:opacity-0 bg-groupTransparent md:hover:opacity-100 transition-all flex items-center justify-center rounded-md group"
                        onClick={() =>
                          setIndexOfImage((prevIndex) =>
                            prevIndex === 0 && productData?.images
                              ? productData?.images.length - 1
                              : prevIndex - 1
                          )
                        }
                      >
                        <ArrowLeft className="text-white text-lg flex md:hidden md:group-hover:flex" />
                      </button>
                    )}
                    <img
                      src={productData?.images[idexOfImage]}
                      alt={productData?.title}
                      className={clsx(
                        'rounded-md',
                        'shadow-lg',
                        'max-w-[500px]',
                        'max-h-[500px]',
                        'w-full',
                        'object-cover'
                      )}
                    />
                    {productData?.images.length !== 1 && (
                      <button
                        className="absolute right-0 top-0 bottom-0 w-[50px] md:opacity-0 bg-groupTransparent md:hover:opacity-100 transition-all flex items-center justify-center rounded-md group"
                        onClick={() =>
                          setIndexOfImage((prevIndex) =>
                            prevIndex ===
                            (productData?.images &&
                              productData?.images.length - 1)
                              ? 0
                              : prevIndex + 1
                          )
                        }
                      >
                        <ArrowRight className="text-white text-lg flex md:hidden md:group-hover:flex" />
                      </button>
                    )}
                  </div>
                  <footer
                    className={clsx(
                      'grid',
                      'grid-cols-2',
                      'xs:grid-cols-4',
                      'w-full',
                      'gap-2'
                    )}
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
                          'cursor-pointer',
                          {
                            'shadow-xl': idexOfImage === index,
                            'border-2': idexOfImage === index,
                            'border-forestGreen': idexOfImage === index,
                            'transition-all': idexOfImage === index
                          }
                        )}
                      />
                    ))}
                  </footer>
                </div>
                <div
                  className={clsx(
                    'w-full',
                    'md:w-1/2',
                    'p-6',
                    'rounded',
                    'shadow',
                    'bg-white',
                    'overflow-hidden'
                  )}
                >
                  <h1 className="text-lg font-bold tracking-tight text-gray-900 md:text-2xl">
                    {productData?.title}
                  </h1>

                  <p className="mt-4 font-extralight">
                    {productData?.priceOnRequest
                      ? 'Cena Na Upit'
                      : `${productData?.price},00 RSD`}
                  </p>

                  <p className="mt-4 text-gray-700 text-wrap break-words italic">
                    {productData?.shortDescription}
                  </p>

                  <div className="mt-6 flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-forestGreen" />
                    <span className=" font-medium">
                      Na stanju – spremno za slanje
                    </span>
                  </div>

                  <div className="mt-8 space-y-2 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Store className="w-5 h-5 text-forestGreen" />
                      <span>
                        {sellerData?.shopName}, {sellerData?.name}
                      </span>
                    </div>
                    {sellerData?.phone && (
                      <a
                        href={`tel:00${sellerData.phone}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Phone className="w-5 h-5 text-forestGreen" />
                        <span>{sellerData.phone}</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${sellerData?.email}`}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Mail className="w-5 h-5 text-forestGreen" />
                      <span>{sellerData?.email}</span>
                    </a>
                  </div>
                </div>
              </section>
              <Card
                style={{ width: '100%' }}
                className={clsx('shadow')}
                title={productData?.title}
              >
                <section
                  dangerouslySetInnerHTML={{
                    __html: productData?.description ?? ''
                  }}
                />
              </Card>
            </Card>
          </section>
        </Skeleton>
        <section className={clsx('md:hidden')}>
          <div className="text-center my-8">
            <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
              Kontakt prodavca
            </h2>
          </div>
          <UserInfo
            userLoading={userLoading}
            user={sellerData}
            customStyleMeta={['flex', 'flex-col', 'md:hidden']}
          />
        </section>
        <div className="text-center my-8">
          <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
            {`Proizvodi iz ${homeCategories.find((category) => category.slug === productData?.group)?.text}`}
          </h2>
        </div>
        <HomeCarousel
          products={groupProducts}
          isLoading={groupProductsLoading}
        />
        <div className="text-center my-8">
          <h2 className="text-5xl md:text-6xl font-bold text-forestGreen mb-4 font-ephesis">
            Svi proizvodi ovog prodavca
          </h2>
        </div>
        <HomeCarousel
          products={sellerProducts}
          isLoading={sellerProductsLoading}
        />
      </div>
    </div>
  );
};
