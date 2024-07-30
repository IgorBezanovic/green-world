import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Divider } from '@green-world/components';
import clsx from 'clsx';
import { useState } from 'react';

import Ozelenimo from '/ozelenimo-transparent.png';
import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const UserInfo = ({ ...props }) => {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  return (
    <section className={clsx('flex', 'flex-col', 'w-full')}>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'w-full',
          'mb-10'
        )}
      >
        <img
          src={props?.user?.profileImage || ZSLogo}
          height="100px"
          width="100px"
        />
        {!props?.user?.profileImage && (
          <p
            className={clsx(
              'text-forestGreen',
              'mt-2',
              'text-center',
              'w-full'
            )}
          >
            Ovo je prostor za Vaš logo kompanije. Dodajte ga u ažuriranju
            profila.
          </p>
        )}
      </div>
      <p className={clsx('text-forestGreen', 'mb-1')}>
        Kontakt osoba: {props?.user?.name || 'N/A'} {props?.user?.lastname}
      </p>
      <p className={clsx('text-forestGreen', 'mb-1')}>
        Naziv radnje: {props?.user?.shopName || 'N/A'}
      </p>
      <p className={clsx('text-forestGreen', 'mb-1')}>Kratak opis:</p>
      <p className={clsx('text-forestGreen', 'mb-1', 'italic')}>
        {props?.user?.shopDescription || 'N/A'}
      </p>
      <p
        className={clsx('text-forestGreen', 'transition-all', {
          'mb-4': !isContactOpen,
          'mb-1': isContactOpen
        })}
      >
        <GlobalOutlined />: {props?.user?.website || 'N/A'}
      </p>
      {isContactOpen || (
        <button
          onClick={() => setIsContactOpen(!isContactOpen)}
          className={clsx(
            'text-forestGreen',
            'md:hover:text-seaFoamGreen',
            'leading-normal',
            'font-medium',
            'border-2',
            'rounded-md',
            'min-h-12',
            'p-4',
            'max-h-12',
            'flex',
            'items-center',
            'justify-center',
            'text-center',
            'shadow-md',
            'transition'
          )}
        >
          Kontaktirajte nas
        </button>
      )}
      {isContactOpen && (
        <section
          className={clsx({
            'mb-5': isContactOpen
          })}
        >
          <p className={clsx('text-forestGreen', 'mb-1')}>
            <PhoneOutlined />: {props?.user?.phone || 'N/A'}
          </p>
          <p className={clsx('text-forestGreen')}>
            <MailOutlined />: {props?.user?.email || 'N/A'}
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
          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_API_GOOGLE_API_KEY}&q=23+Kotorska,+Novi+Sad,+Srbija+21000`}
        ></iframe>
        <img src={Ozelenimo} alt="Ozelenimo" className={clsx('mt-4')} />
      </section>
    </section>
  );
};
