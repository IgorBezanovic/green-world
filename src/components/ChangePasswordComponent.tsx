import { LoadingOutlined } from '@ant-design/icons';
import { CustomButton } from '@green-world/components';
import { useChangePassword } from '@green-world/hooks/useChangePassword';
import { NewPasswordValues } from '@green-world/utils/types';
import { Badge, Card, Input } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';

export const ChangePasswordComponent = () => {
  const { mutate, error, isLoading } = useChangePassword();

  const [passwordCollection, setPasswordCollection] =
    useState<NewPasswordValues>({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordCollection((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(passwordCollection);
  };

  return (
    <Card
      className={clsx(
        'md:mt-20',
        'p-4',
        'w-full',
        'max-w-xl',
        'mx-auto',
        'bg-teaGreen'
      )}
    >
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="oldPassword"
          className={clsx(
            'flex',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg',
            'font-extralight'
          )}
        >
          Unesite stari password:
        </label>
        <Input.Password
          required
          size="large"
          placeholder="Stara lozinka"
          name="oldPassword"
          id="oldPassword"
          onChange={handleChange}
          disabled={isLoading}
        />
        <label
          htmlFor="newPassword"
          className={clsx(
            'flex',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg',
            'font-extralight',
            'mt-4'
          )}
        >
          Unesite novi password:
        </label>
        <Input.Password
          required
          size="large"
          placeholder="Nova lozinka"
          name="newPassword"
          id="newPassword"
          onChange={handleChange}
          disabled={isLoading}
        />
        <label
          htmlFor="confirmNewPassword"
          className={clsx(
            'flex',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg',
            'font-extralight',
            'mt-4'
          )}
        >
          Ponovite novi password:
        </label>
        <Badge.Ribbon
          text="Lozinke se ne poklapaju"
          color="cyan"
          className={clsx('-top-4', 'z-10', {
            hidden:
              passwordCollection.newPassword ===
              passwordCollection.confirmNewPassword
          })}
        >
          <Input.Password
            required
            size="large"
            placeholder="Ponovite novu lozinka"
            name="confirmNewPassword"
            id="confirmNewPassword"
            onChange={handleChange}
            disabled={isLoading}
            status={
              passwordCollection.newPassword !==
              passwordCollection.confirmNewPassword
                ? 'warning'
                : ''
            }
          />
        </Badge.Ribbon>
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
            'mt-10',
            'w-full',
            {
              'border-groupTransparent': isLoading
            }
          ]}
          disabled={
            isLoading ||
            passwordCollection.newPassword !==
              passwordCollection.confirmNewPassword
          }
        />
        {(error as any) && (
          <p className={clsx('font-medium', 'text-red', 'mt-2')}>
            {(error as any)?.response?.data}
          </p>
        )}
      </form>
    </Card>
  );
};