import { LoadingOutlined, MailOutlined } from '@ant-design/icons';
import { useForgotPassword } from '@green-world/hooks/useForgotPassword';
import clsx from 'clsx';
import { useState } from 'react';

import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';

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
        'md:py-16',
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
          Ukoliko ste zaboravili svoj password, nije problem.
        </h1>
        <label htmlFor="e-mail" className={clsx('mb-4', 'text-forestGreen')}>
          Kontaktiracemo Vas da promenu svoje lozinke:
        </label>
        <CustomInput
          required
          type="email"
          name="email"
          id="e-mail"
          placeholder="Unesite email"
          error={(error as any)?.response?.data}
          isLoading={isLoading}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          disabled={isLoading}
          prefix={<MailOutlined className={clsx('text-groupTransparent')} />}
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
