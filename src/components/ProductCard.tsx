import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDeleteProduct } from '@green-world/hooks/useDeleteProduct';
import { Card } from 'antd';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';

import { PopDelete } from '.';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const ProductCard = ({ ...props }) => {
  const { mutate } = useDeleteProduct(props?.product?._id);
  const navigate = useNavigate();
  const location = useLocation();

  const actions: React.ReactNode[] = location.pathname.includes('/profile')
    ? [
        <EditOutlined
          key="edit"
          onClick={() => navigate(`/edit-product/${props?.product?._id}`)}
        />,
        <PopDelete
          key="delete"
          title={'Brisanje proizvoda'}
          description={'Da li ste sigurni da zelite da orisete proizvod?'}
          okText={'Da'}
          cancelText={'Ne'}
          id={props?.product?._id}
          mutate={mutate}
        >
          <DeleteOutlined style={{ color: 'red' }} />
        </PopDelete>
      ]
    : [];

  return (
    <Card
      loading={props.loading}
      actions={actions}
      onClick={() =>
        !location.pathname.includes('/profile') &&
        navigate(`/product/${props?.product._id}`)
      }
      className={clsx('flex', 'flex-col', 'justify-between', {
        'max-h-[340px]': !location.pathname.includes('/profile'),
        'cursor-pointer': !location.pathname.includes('/profile')
      })}
    >
      <Card.Meta
        title={
          <>
            <div
              className={clsx(
                'max-h-[100px]',
                'max-w-[100px]',
                'xs:max-h-[150px]',
                'xs:max-w-[150px]',
                'mx-auto',
                'mb-4'
              )}
            >
              <img
                alt={props?.product?.title}
                src={
                  props?.product?.images?.[0]
                    ? props?.product?.images[0].includes('cloudinary')
                      ? props?.product?.images[0]
                      : ZSLogo
                    : ZSLogo
                }
                className={clsx(
                  'max-h-[100px]',
                  'max-w-[100px]',
                  'xs:max-h-[150px]',
                  'xs:max-w-[150px]',
                  'mx-auto'
                )}
              />
            </div>
            <div
              className={clsx(
                'relative',
                'overflow-hidden',
                'w-full',
                'h-[1.5rem]', // Fixed height for single-line text
                'hover:overflow-visible' // Ensure text becomes visible when animation starts
              )}
            >
              <span
                className={clsx(
                  'absolute',
                  'whitespace-nowrap',
                  'translate-x-full', // Start offscreen
                  'hover:animate-marquee' // Trigger animation on hover
                )}
              >
                {props?.product?.title}
              </span>
            </div>
          </>
        }
        description={
          <section
            className={clsx(
              'overflow-hidden',
              'flex',
              'flex-col',
              'justify-between',
              'w-full'
            )}
          >
            <p className="line-clamp-3">
              {props?.product?.shortDescription ||
                `${props?.product?.description.slice(0, 80)}${props?.product?.description.length > 80 ? '...' : ''}`}
            </p>
            <p className={clsx('text-black', 'font-semibold')}>
              RSD{' '}
              {props?.product?.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              <small>,00</small>
            </p>
          </section>
        }
      />
    </Card>
  );
};
