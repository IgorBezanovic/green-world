import {
  EyeInvisibleOutlined,
  EyeOutlined,
  MailOutlined,
  LockOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { RegistrationValues } from '@green-world/utils/types';
import clsx from 'clsx';
import { useState } from 'react';

export const RegistrationForm = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registrationData, setRegistrationData] = useState<RegistrationValues>({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.mutate(registrationData);
  };

  return (
    <section
      className={clsx(
        'bg-teaGreen',
        'shadow-md',
        'rounded',
        'p-5',
        'py-8',
        'md:py-14',
        'w-full',
        'max-w-xl',
        'mx-auto',
        'mt-10'
      )}
    >
      <section
        className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
      >
        <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl')}>
          <strong>Registrujte se brzo, lako i jednostavno!</strong>
        </h1>
        <p className={clsx('mb-4', 'text-forestGreen', 'text-lg')}>
          Nakon registracije idite na svoj profil i popunite svoje dodatne
          podatke.
        </p>
        <p className={clsx('mb-4', 'text-forestGreen', 'text-lg')}>
          Na taj način će drugi korisnici lakše kotaktirati sa Vama.
        </p>
      </section>
      <div
        className={clsx(
          'flex-1',
          'h-[2px]',
          'shadow-md',
          'rounded-md',
          'bg-white',
          'max-w-96',
          'w-full',
          'mx-auto',
          'mb-4'
        )}
      />
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
          Kontakt e-mail:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            required
            type="email"
            name="email"
            id="mail"
            placeholder="Unesite e-mail"
            className={clsx(
              'w-full',
              'border-2',
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-4',
              'bg-whiteLinen',
              {
                'border-red': props.error?.response?.data,
                'border-forestGreen': !props.isLoading,
                'border-groupTransparent': props.isLoading
              }
            )}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                email: e.target.value
              })
            }
            disabled={props.isLoading}
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
          Željena lozinka:
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
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-2',
              'bg-whiteLinen',
              {
                'border-red': props.error?.response?.data,
                'border-forestGreen': !props.isLoading,
                'border-groupTransparent': props.isLoading
              }
            )}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                password: e.target.value
              })
            }
            disabled={props.isLoading}
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
        <button
          type="submit"
          className={clsx(
            'mt-6',
            'w-full',
            'rounded',
            'py-2',
            'shadow-md',
            'text-mintCream',
            'transition-all',
            'flex',
            'justify-center',
            'items-center',
            {
              'bg-forestGreen': !props.isLoading,
              'bg-groupTransparent': props.isLoading
            }
          )}
          disabled={props.isLoading}
        >
          {props.isLoading ? (
            <LoadingOutlined className={clsx('text-whiteLinen', 'my-2')} />
          ) : (
            'Registruj se'
          )}
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
