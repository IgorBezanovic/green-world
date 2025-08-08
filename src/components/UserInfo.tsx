import {
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { Avatar, Card, Skeleton } from 'antd';
import Meta from 'antd/es/card/Meta';
import clsx from 'clsx';

import ZSlogo from '/zeleni-svet-yellow-transparent.png';

export const UserInfo = ({ ...props }) => {
  return (
    <Skeleton loading={props?.userLoading} active avatar>
      <Card
        className={clsx('w-full', props?.customStyle)}
        title={
          props?.user?.shopName && (
            <>
              <ShopOutlined className={clsx('text-forestGreen', 'mr-2')} />
              {props?.user?.shopName}
            </>
          )
        }
      >
        <Meta
          description={
            <section className={clsx('w-full', 'flex', props?.customStyleMeta)}>
              <Avatar
                src={props?.user?.profileImage || ZSlogo}
                className={clsx('h-24', 'w-24', 'mx-auto', 'mb-5')}
              />
              {props?.user?.name && (
                <p className={clsx('text-black')}>
                  {props?.user?.name} {props?.user?.lastname}
                </p>
              )}
              {props?.user?.shopDescription && (
                <q className={clsx('text-black', 'font-extralight', 'mt-1')}>
                  {props?.user?.shopDescription}
                </q>
              )}
              {props?.user?.address?.city && props?.user?.address?.country && (
                <p className={clsx('text-black', 'mt-1')}>
                  {`${props?.user?.address?.city}, ${props?.user?.address?.country}`}
                </p>
              )}
              {props?.user?.address?.street && (
                <p className={clsx('text-black')}>
                  {props?.user?.address?.street}
                </p>
              )}
              {props?.user?.website && (
                <a
                  className={clsx(
                    'text-forestGreen',
                    'transition-all',
                    'font-extralight',
                    'mt-2'
                  )}
                  href={props?.user?.website || '/'}
                >
                  <GlobalOutlined /> {props?.user?.website}
                </a>
              )}
              {props?.user?.phone && (
                <p
                  className={clsx(
                    'text-forestGreen',
                    'font-extralight',
                    'mt-2'
                  )}
                >
                  <PhoneOutlined /> +{props?.user?.phone}
                </p>
              )}
              {props?.user?.email && (
                <p
                  className={clsx(
                    'text-forestGreen',
                    'font-extralight',
                    'mt-2'
                  )}
                >
                  <MailOutlined /> {props?.user?.email}
                </p>
              )}
            </section>
          }
        />
      </Card>
    </Skeleton>
  );
};
