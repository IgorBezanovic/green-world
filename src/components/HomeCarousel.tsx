import { Carousel, Empty, Skeleton } from 'antd';
import clsx from 'clsx';

import '../styles.css';
import { ProductCard } from './ProductCard';

export const HomeCarousel = ({ ...props }) => {
  const products = Array.isArray(props.products) ? props.products : [];

  return products && products.length > 0 ? (
    <Skeleton loading={props.isLoading} active>
      <Carousel
        draggable={true}
        infinite
        slidesToShow={5}
        responsive={[
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2
            }
          }
        ]}
        slidesToScroll={1}
        className={clsx('w-full')}
      >
        {products.map((product: any) => (
          <div key={product.title} className="px-1">
            <ProductCard product={product} loading={props.isLoading} />
          </div>
        ))}
      </Carousel>
    </Skeleton>
  ) : (
    <Empty />
  );
};
