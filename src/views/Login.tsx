import { LoginForm } from '@green-world/components/LoginForm';
import clsx from 'clsx';

export const Login = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-[100vh]')}>
      <div
        className={clsx('max-w-[1400px]', 'mx-auto', 'p-5', 'flex', 'gap-5')}
      >
        <LoginForm />
      </div>
    </div>
  );
};
