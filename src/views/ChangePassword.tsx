import { BackButton, ChangePasswordComponent } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const ChangePassword = () => {
  return (
    <div
      className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}
      style={{
        backgroundImage: "url('/background_login.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Helmet>
        <title>Zeleni svet | Promena lozinke</title>
        <link
          rel="canonical"
          href="https://www.zeleni-svet.com/change-password"
        />
      </Helmet>
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
          'gap-7',
          'relative'
        )}
      >
        <div className={clsx('hidden', 'md:flex', 'absolute', 'left-6')}>
          <BackButton />
        </div>
        <ChangePasswordComponent />
      </div>
    </div>
  );
};
