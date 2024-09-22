import { Carousel, Empty } from 'antd';
import clsx from 'clsx';

import '../styles.css';
import { ProductCard } from './ProductCard';

export const HomeCarousel = ({ ...props }) => {
  return props?.products && props.products.length > 0 ? (
    <Carousel
      arrows
      draggable={true}
      infinite
      slidesToShow={4}
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
      {props.products?.map((product: any) => (
        <div key={product.title} className="px-1">
          <ProductCard
            product={product}
            loading={props.isLoading}
            style={'h-100%'}
          />
        </div>
      ))}
    </Carousel>
  ) : (
    <Empty />
  );
};
