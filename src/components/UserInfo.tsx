import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { CustomButton, Divider } from '@green-world/components';
import { Card } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';

import Ozelenimo from '/ozelenimo-transparent.png';
import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const UserInfo = ({ ...props }) => {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  return (
    <Card className={clsx('flex', 'flex-col', 'w-full')}>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'w-full',
          'mb-8'
        )}
      >
        <div
          className={clsx(
            'w-[150px]',
            'h-[150px]',
            'overflow-hidden',
            'mx-auto',
            'rounded-full',
            'shadow-xl'
          )}
        >
          <img
            src={props?.user?.profileImage || ZSLogo}
            height="100%"
            width="100%"
          />
        </div>
        <p className={clsx('mt-2', 'text-center', 'w-full')}>
          Ovo je prostor za Vaš logo kompanije. Dodajte ga u ažuriranju profila.
        </p>
      </div>
      <p className={clsx('text-black')}>
        {props?.user?.name || 'N/A'} {props?.user?.lastname}
      </p>
      <p className={clsx('text-forestGreen', 'mb-2')}>
        {props?.user?.shopName || 'N/A'}
      </p>
      <p className={clsx('mb-4')}>
        <q className={clsx('text-black', 'font-extralight')}>
          {props?.user?.shopDescription || 'N/A'}
        </q>
      </p>
      {isContactOpen || (
        <CustomButton
          onClick={() => setIsContactOpen(!isContactOpen)}
          text={'Kontakt podatci'}
          type={'text'}
          customStyle={['mt-2', 'w-full']}
        />
      )}
      {isContactOpen && (
        <section
          className={clsx({
            'mb-5': isContactOpen,
            'mt-1': isContactOpen
          })}
        >
          <a
            className={clsx(
              'text-forestGreen',
              'transition-all',
              'font-extralight',
              {
                'mb-4': !isContactOpen,
                'mb-1': isContactOpen
              }
            )}
            href={props?.user?.website || '/'}
          >
            <GlobalOutlined /> {props?.user?.website || 'N/A'}
          </a>
          <p className={clsx('text-forestGreen', 'mb-1', 'font-extralight')}>
            <PhoneOutlined /> {props?.user?.phone || 'N/A'}
          </p>
          <p className={clsx('text-forestGreen', 'font-extralight')}>
            <MailOutlined /> {props?.user?.email || 'N/A'}
          </p>
        </section>
      )}
      {isContactOpen && <Divider />}
      <section className={clsx('flex', 'flex-col', 'w-full', 'mt-6')}>
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
      </section>
    </Card>
  );
};
