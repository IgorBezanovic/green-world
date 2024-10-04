import { BackButton, ForgotPasswordForm } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const ForgotPassword = () => {
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
        <title>Zeleni svet | Zaboravljen password</title>
        <link
          rel="canonical"
          href="https://www.zeleni-svet.com/forgot-password"
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
          'gap-7'
        )}
      >
        <div
          className={clsx(
            'hidden',
            'md:flex',
            'xl:max-w-[1400px]',
            'w-full',
            'mx-auto'
          )}
        >
          <BackButton />
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
