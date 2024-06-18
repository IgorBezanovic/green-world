import { BackButton, UserRegistrationForm } from '@green-world/components';
import clsx from 'clsx';

export const UserRegistration = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-[100vh]')}>
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
        <UserRegistrationForm />
      </div>
    </div>
  );
};
