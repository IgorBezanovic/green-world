import { LoadingOutlined, LockOutlined } from '@ant-design/icons';
import { VisibleEye } from '@green-world/components';
import { useChangePassword } from '@green-world/hooks/useChangePassword';
import { NewPasswordValues } from '@green-world/utils/types';
import clsx from 'clsx';
import { useState } from 'react';

export const ChangePassword = () => {
  const { mutate, isLoading } = useChangePassword();
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false
  });

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

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="oldPassword"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Unesite stari password:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            type={showPassword.oldPassword ? 'text' : 'password'}
            required
            name="oldPassword"
            id="oldPassword"
            placeholder="Unesite stari password"
            className={clsx(
              'w-full',
              'border-2',
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-3',
              'bg-whiteLinen',
              {
                'border-forestGreen': !isLoading,
                'border-groupTransparent': isLoading
              }
            )}
            onChange={handleChange}
            disabled={isLoading}
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
          <VisibleEye
            showPassword={showPassword.oldPassword}
            setShowPassword={() => togglePasswordVisibility('oldPassword')}
          />
        </div>
        <label
          htmlFor="newPassword"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Unesite novi password:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            type={showPassword.newPassword ? 'text' : 'password'}
            required
            name="newPassword"
            id="newPassword"
            placeholder="Unesite novi password"
            className={clsx(
              'w-full',
              'border-2',
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-3',
              'bg-whiteLinen',
              {
                'border-forestGreen': !isLoading,
                'border-groupTransparent': isLoading
              }
            )}
            onChange={handleChange}
            disabled={isLoading}
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
          <VisibleEye
            showPassword={showPassword.newPassword}
            setShowPassword={() => togglePasswordVisibility('newPassword')}
          />
        </div>
        <label
          htmlFor="confirmNewPassword"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Ponovite novi password:
        </label>
        <div className={clsx('w-full', 'relative')}>
          <input
            type={showPassword.confirmNewPassword ? 'text' : 'password'}
            required
            name="confirmNewPassword"
            id="confirmNewPassword"
            placeholder="Ponovite novi password"
            className={clsx(
              'w-full',
              'border-2',
              'rounded',
              'pl-9',
              'py-2',
              'shadow-md',
              'mb-3',
              'bg-whiteLinen',
              {
                'border-red':
                  passwordCollection.newPassword !==
                  passwordCollection.confirmNewPassword,
                'border-forestGreen': !isLoading,
                'border-groupTransparent': isLoading
              }
            )}
            onChange={handleChange}
            disabled={isLoading}
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
          <VisibleEye
            showPassword={showPassword.confirmNewPassword}
            setShowPassword={() =>
              togglePasswordVisibility('confirmNewPassword')
            }
          />
        </div>
        <button
          type="submit"
          className={clsx(
            'mt-4',
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
              'bg-forestGreen': !isLoading,
              'bg-groupTransparent': isLoading
            }
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingOutlined className={clsx('text-whiteLinen', 'my-2')} />
          ) : (
            'Promeni password'
          )}
        </button>
      </form>
    </section>
  );
};
