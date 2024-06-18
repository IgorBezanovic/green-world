import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section
      className={clsx(
        'bg-teaGreen',
        'shadow-md',
        'rounded-md',
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
      >
        <label
          htmlFor="email"
          className={clsx('mb-2', 'text-forestGreen', 'cursor-pointer')}
        >
          Unesite email:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Unesite email"
          className={clsx(
            'w-full',
            'border-2',
            'border-forestGreen',
            'rounded-md',
            'pl-2',
            'py-2',
            'shadow-md',
            'mb-4',
            'bg-whiteLinen'
          )}
        />
        <label
          htmlFor="password"
          className={clsx('mb-2', 'text-forestGreen', 'cursor-pointer')}
        >
          Unesite password:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Unesite password"
            className={clsx(
              'w-full',
              'border-2',
              'border-forestGreen',
              'rounded-md',
              'pl-2',
              'py-2',
              'shadow-md',
              'mb-2',
              'bg-whiteLinen'
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
          className={clsx(
            'mt-2',
            'w-full',
            'bg-forestGreen',
            'rounded-md',
            'py-2',
            'shadow-md',
            'text-mintCream'
          )}
        >
          Prijavi se
        </button>
      </form>
    </section>
  );
};
