import {
  AppBreadcrumbs,
  CustomButton,
  MetaTags
} from '@green-world/components';
import { Card } from 'antd';
import clsx from 'clsx';
import { Outlet, useNavigate } from 'react-router';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Korisnički profil', route: '/profile' },
    { label: 'Podešavanje profila', route: '/edit-profile' }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Podešavanje profila'} />

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
        <AppBreadcrumbs pages={pages} />

        <Card className={clsx('w-full', 'md:w-1/4')}>
          <section className={clsx('flex', 'flex-col', 'gap-3')}>
            <p className={clsx('text-gray40', 'italic', 'mb-1')}>
              {`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}h`}
            </p>
            <CustomButton
              type="text"
              onClick={() => navigate('/profile-settings/edit-profile')}
            >
              Podaci profila
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
