import { BackButton, CustomButton } from '@green-world/components';
import { Card } from 'antd';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';

export const ProfileSettings = () => {
  const navigate = useNavigate();

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Podešavanje profila</title>
        <link
          rel="canonical"
          href="https://www.zeleni-svet.com/profile-settings"
        />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'flex',
          'flex-col',
          'md:flex-row',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'pt-7',
          'md:pt-24',
          'pb-7',
          'gap-7',
          'relative'
        )}
      >
        <div
          className={clsx(
            'hidden',
            'md:flex',
            'absolute',
            'lg:left-7',
            'xl:left-0',
            'left-6',
            'top-7'
          )}
        >
          <BackButton route={'/profile'} />
        </div>
        <Card className={clsx('w-full', 'md:w-1/4')}>
          <section className={clsx('flex', 'flex-col', 'gap-3')}>
            <p className={clsx('text-gray40', 'italic', 'mb-1')}>
              {`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}h`}
            </p>
            <CustomButton
              type="text"
              onClick={() => navigate('/profile-settings/edit-profile')}
            >
              Podatci profila
            </CustomButton>
            <CustomButton
              type="text"
              onClick={() => navigate('/profile-settings/change-image')}
            >
              Slika i QR kod
            </CustomButton>
            <CustomButton
              type="text"
              onClick={() => navigate('/profile-settings/change-password')}
            >
              Promena lozinke
            </CustomButton>
            <CustomButton type="text">Statistika</CustomButton>
          </section>
        </Card>
        <Card className={clsx('w-full', 'md:w-3/4')}>
          <Outlet />
        </Card>
      </div>
    </div>
  );
};
