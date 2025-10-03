import {
  AppBreadcrumbs,
  ForgotPasswordForm,
  MetaTags
} from '@green-world/components';
import clsx from 'clsx';

export const ForgotPassword = () => {
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Uloguj se', route: '/login' },
    { label: 'Zaboravljena Lozinka', route: '/forgot-password' }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni Svet | Zaboravljena Lozinka | Green World'} />

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
