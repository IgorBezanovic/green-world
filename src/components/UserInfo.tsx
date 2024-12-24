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
    <>
      <Skeleton loading={props?.userLoading} active avatar>
        <Card
          className={clsx('w-full', props?.customStyle)}
          title={
            <>
              <ShopOutlined className={clsx('text-forestGreen', 'mr-2')} />
              {props?.user?.shopName}
            </>
          }
        >
          <Meta
            description={
              <section
                className={clsx('w-full', 'flex', props?.customStyleMeta)}
              >
                <Avatar
                  src={props?.user?.profileImage || ZSlogo}
                  className={clsx('h-24', 'w-24', 'mx-auto', 'mb-5')}
                />
                <p className={clsx('text-black')}>
                  {props?.user?.name || 'N/A'} {props?.user?.lastname}
                </p>
                <q className={clsx('text-black', 'font-extralight', 'mt-1')}>
                  {props?.user?.shopDescription || 'N/A'}
                </q>
                <p className={clsx('text-black', 'mt-1')}>
                  Mesto:{' '}
                  {`${props?.user?.address?.zipCode || 'N/A'}, ${props?.user?.address?.city || 'N/A'}, ${props?.user?.address?.country}` ||
                    'N/A'}
                </p>
                <p className={clsx('text-black')}>
                  Ulica: {props?.user?.address?.street || 'N/A'}
                </p>
                <a
                  className={clsx(
                    'text-forestGreen',
                    'transition-all',
                    'font-extralight',
                    'mt-2'
                  )}
                  href={props?.user?.website || '/'}
                >
                  <GlobalOutlined /> {props?.user?.website || 'N/A'}
                </a>
                <p
                  className={clsx(
                    'text-forestGreen',
                    'font-extralight',
                    'mt-2'
                  )}
                >
                  <PhoneOutlined /> {props?.user?.phone || 'N/A'}
                </p>
                <p
                  className={clsx(
                    'text-forestGreen',
                    'font-extralight',
                    'mt-2'
                  )}
                >
                  <MailOutlined /> {props?.user?.email || 'N/A'}
                </p>
              </section>
            }
          />
        </Card>
      </Skeleton>
      {/* <section className={clsx('flex', 'flex-col', 'w-full', 'mt-6')}>
        <p className={clsx('mb-2', 'text-forestGreen')}>
          Klikom na 'directions' ili 'View larger map' dobijate putanju do
          odabranog objekta.
        </p>
        <p className={clsx('mb-2', 'text-forestGreen')}>
          Ugodan i bezbedan put Vam zelimo!
        </p>
        <iframe
          width="100%"
          height="450"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_API_GOOGLE_API_KEY}&q=${props?.user?.address?.street},+${props?.user?.address?.city},+${props?.user?.address?.country}+${props?.user?.address?.zipCode}`}
        ></iframe>
        <img src={Ozelenimo} alt="Ozelenimo" className={clsx('mt-4')} />
      </section> */}
    </>
  );
};
