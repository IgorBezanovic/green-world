import { LoadingOutlined } from '@ant-design/icons';
import { useForgotPassword } from '@green-world/hooks/useForgotPassword';
import clsx from 'clsx';
import { useState } from 'react';

import { CustomButton } from './CustomButton';

export const ForgotPasswordForm = () => {
  const { mutate, error, isLoading } = useForgotPassword();
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(email);
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
        'md:mt-14'
      )}
    >
      <form
        className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
        onSubmit={handleSubmit}
      >
        <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl')}>
          <strong>Ukoliko ste zaboravili svoj password, nije problem.</strong>
        </h1>
        <label
          htmlFor="email"
          className={clsx('mb-4', 'text-forestGreen', 'text-lg')}
        >
          Kontaktiracemo Vas da promenu svoje lozinke:
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
            'rounded',
            'pl-2',
            'py-2',
            'shadow-md',
            'mb-4',
            'bg-whiteLinen'
          )}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomButton
          htmlType="submit"
          type="text"
          text={
            isLoading ? (
              <LoadingOutlined
                className={clsx('text-groupTransparent', 'my-2')}
              />
            ) : (
              'Promeni password'
            )
          }
          customStyle={[
            'mt-2',
            {
              'border-groupTransparent': isLoading
            }
          ]}
          disabled={isLoading}
        />
        {(error as any) && (
          <p className={clsx('font-medium', 'text-red', 'mt-2')}>
            {(error as any)?.response?.data}
          </p>
        )}
      </form>
    </section>
  );
};
