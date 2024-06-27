import { BackButton, UserRegistrationForm } from '@green-world/components';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

export const UserRegistration = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <link
          rel="canonical"
          href="https://www.green-world-six.vercel.app/user-registration"
        />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'px-7',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <BackButton />
        <UserRegistrationForm />
      </div>
    </div>
  );
};
