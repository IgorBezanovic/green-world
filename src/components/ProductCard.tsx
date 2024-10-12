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
      cover={
        <div className={clsx('h-[150px]', 'w-[150px]', 'mx-auto', 'mt-2')}>
          <img
            alt={props?.product?.title}
            src={
              props?.product?.images?.[0]
                ? props?.product?.images[0].includes('cloudinary')
                  ? props?.product?.images[0]
                  : ZSLogo
                : ZSLogo
            }
            className={clsx('max-h-[150px]', 'max-w-[150px]', 'mx-auto')}
          />
        </div>
      }
    >
      <Card.Meta
        title={props?.product?.title}
        description={
          <section
            className={clsx(
              'h-[75px]',
              'overflow-hidden',
              'flex',
              'flex-col',
              'justify-between'
            )}
          >
            <p>
              {props?.product?.description.slice(0, 50)}
              {props?.product?.description.length > 50 && '...'}
            </p>
            <p className={clsx('text-black')}>RSD {props?.product?.price}</p>
          </section>
        }
      />
    </Card>
  );
};
