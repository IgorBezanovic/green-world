import {
  AppBreadcrumbs,
  MetaTags,
  RegistrationForm
} from '@green-world/components';
import { useSignUp } from '@green-world/hooks/useSignUp';
import clsx from 'clsx';

export const Registration = () => {
  const { mutate, error, isPending } = useSignUp();
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Uloguj se', route: '/login' },
    { label: 'Registracija', route: '/registration' }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Registruj se'} />

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
        <RegistrationForm mutate={mutate} error={error} isLoading={isPending} />
      </div>
    </div>
  );
};
