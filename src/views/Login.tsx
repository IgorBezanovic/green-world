import { BackButton, LoginForm } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

export const Login = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-[100vh]')}>
      <Helmet>
        <link
          rel="canonical"
          href="https://www.green-world-six.vercel.app/login"
        />
      </Helmet>
      <div
        className={clsx(
          'max-w-[1400px]',
          'mx-auto',
          'p-5',
          'flex',
          'flex-col',
          'gap-5'
        )}
      >
        <BackButton />
        <LoginForm />
      </div>
    </div>
  );
};
