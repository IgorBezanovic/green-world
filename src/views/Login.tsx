import { LoginForm } from '@green-world/components';
import { useLogin } from '@green-world/hooks/useLogin';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

export const Login = () => {
  const { mutate, error, isLoading } = useLogin();

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
        <title>Zeleni svet | Prijavi se</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/login" />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'pt-20',
          'pb-40',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <LoginForm mutate={mutate} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
};
