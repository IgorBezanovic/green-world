import { AppBreadcrumbs, LoginForm, MetaTags } from '@green-world/components';
import { useLogin } from '@green-world/hooks/useLogin';
import clsx from 'clsx';
import { useLocation } from 'react-router';

export const Login = () => {
  const { mutate, error, isPending } = useLogin();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isUserLogged = queryParams.get('isUserLogged');
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Uloguj se', route: '/login' }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni Svet | Prijavi se | Green World'} />

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'xl:py-0-20',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />
        <LoginForm
          mutate={mutate}
          error={error}
          isLoading={isPending}
          isUserLogged={isUserLogged}
        />
      </div>
    </div>
  );
};
