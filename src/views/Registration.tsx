import { BackButton, RegistrationForm } from '@green-world/components';
import { useSignUp } from '@green-world/hooks/useSignUp';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const Registration = () => {
  const { mutate, error, isLoading } = useSignUp();

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
        <title>Zeleni svet | Registruj se</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/registration" />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'pt-10',
          'pb-40',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <div className={clsx('hidden', 'md:flex', 'absolute', 'left-6')}>
          <BackButton />
        </div>
        <RegistrationForm mutate={mutate} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
};
