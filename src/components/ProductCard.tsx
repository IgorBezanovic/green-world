import {
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Card } from 'antd';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const ProductCard = ({ ...props }) => {
  const navigate = useNavigate();

  const actions: React.ReactNode[] = [
    <EditOutlined
      key="edit"
      onClick={() => navigate(`/edit-product/${props?.product?._id}`)}
    />,
    <ShoppingCartOutlined key="shopping" />,
    <DeleteOutlined key="delete" />
  ];

  return (
    <Card
      loading={props.loading}
      actions={actions}
      cover={
        <img
          alt={props?.product?.title}
          src={
            props?.product?.images?.[0]
              ? props?.product?.images[0].includes('cloudinary')
                ? props?.product?.images[0]
                : ZSLogo
              : ZSLogo
          }
          className={clsx('max-h-[150px]', 'max-w-[150px]', 'mx-auto', 'mt-2')}
        />
      }
    >
      <Card.Meta
        title={props?.product?.title}
        description={
          <>
            <p>{props?.product?.description}</p>
            <p className={clsx('text-black')}>RSD {props?.product?.price}</p>
          </>
        }
      />
    </Card>
  );
};
