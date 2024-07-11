import {
  EyeInvisibleOutlined,
  EyeOutlined,
  MailOutlined,
  LockOutlined
} from '@ant-design/icons';
import { AuthValues } from '@green-world/utils/types';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const LoginForm = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [auth, setAuth] = useState<AuthValues>({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.mutate(auth);
  };

  return (
    <section
      className={clsx(
        'bg-teaGreen',
        'shadow-md',
        'rounded',
        'p-5',
        'md:py-14',
        'w-full',
        'max-w-2xl',
        'mx-auto',
        'mt-10'
      )}
    >
      <form
        className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="email"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Unesite email:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            required
            type="email"
            name="email"
            id="e-mail"
            placeholder="Unesite email"
            className={clsx(
              'w-full',
              'border-2',
              'border-forestGreen',
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-4',
              'bg-whiteLinen',
              { 'border-red': props.error?.response?.data }
            )}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          />
          <MailOutlined
            className={clsx(
              'text-gray',
              'absolute',
              'left-3',
              'top-[11px]',
              'text-xl'
            )}
          />
        </div>
        <label
          htmlFor="password"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Unesite password:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            name="password"
            id="password"
            placeholder="Unesite password"
            className={clsx(
              'w-full',
              'border-2',
              'border-forestGreen',
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-2',
              'bg-whiteLinen',
              { 'border-red': props.error?.response?.data }
            )}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />
          <LockOutlined
            className={clsx(
              'text-gray',
              'absolute',
              'left-3',
              'top-[11px]',
              'text-xl'
            )}
          />
          {showPassword ? (
            <EyeOutlined
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'absolute',
                'right-3',
                'top-2.5',
                'text-2xl'
              )}
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <EyeInvisibleOutlined
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'absolute',
                'right-3',
                'top-2.5',
                'text-2xl'
              )}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        <Link to="/forgot-password" className={clsx('text-forestGreen')}>
          Zaboravljen password?
        </Link>
        <div className={clsx('w-full', 'flex', 'justify-center', 'mt-10')}>
          <Link to="/user-registration" className={clsx('text-forestGreen')}>
            Nemate nalog? Registrujte se
          </Link>
        </div>
        <button
          type="submit"
          className={clsx(
            'mt-2',
            'w-full',
            'bg-forestGreen',
            'rounded',
            'py-2',
            'shadow-md',
            'text-mintCream'
          )}
          disabled={props.isLoading}
        >
          Prijavi se
        </button>
        {props.error && (
          <p className={clsx('font-medium', 'text-red', 'mt-2')}>
            {props.error?.response?.data}
          </p>
        )}
      </form>
    </section>
  );
};
