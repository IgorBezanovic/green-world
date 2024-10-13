import { Divider, HomeCarousel } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { useProduct } from '@green-world/hooks/useProduct';
import { useUser } from '@green-world/hooks/useUser';
import { Avatar, Card, Skeleton } from 'antd';
import Meta from 'antd/es/card/Meta';
import clsx from 'clsx';
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

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | `naziv proizovda`</title>
        <link
          rel="canonical"
          href="https://www.zeleni-svet.com/product/aaaaaaa"
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
          <Card
            style={{ width: '100%' }}
            // actions={[
            //   <SettingOutlined key="setting" />,
            //   <EditOutlined key="edit" />,
            //   <EllipsisOutlined key="ellipsis" />
            // ]}
          >
            <Meta
              avatar={<Avatar src={productData?.images[0]} />}
              title={productData?.title}
              description={productData?.description}
            />
          </Card>
        </Skeleton>
        <Skeleton loading={userLoading} active avatar>
          <Card
            style={{ width: '100%' }}
            // actions={[
            //   <SettingOutlined key="setting" />,
            //   <EditOutlined key="edit" />,
            //   <EllipsisOutlined key="ellipsis" />
            // ]}
          >
            <Meta
              avatar={<Avatar src={sellerData?.profileImage} />}
              title={sellerData?.shopName}
              description={sellerData?.shopDescription}
            />
          </Card>
        </Skeleton>
        <Divider text="Proizvodi iz {{grupe}}" />
        <HomeCarousel products={products} isLoading={isLoading} />
        <Divider text="Svi proizvodi ovog prodavca" />
        <HomeCarousel products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};
