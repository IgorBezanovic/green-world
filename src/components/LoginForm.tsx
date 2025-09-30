import { MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { AuthValues } from '@green-world/utils/types';
import { Box, Typography } from '@mui/material';
import { Input } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router';

import { Divider, GoogleLoginAuth, MetaLoginAuth } from '../components';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';

export const LoginForm = ({ ...props }) => {
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
        'py-8',
        'md:py-14',
        'w-full',
        'max-w-xl',
        'mx-auto',
        'mb-8',
        'md:my-8'
      )}
    >
      {props.isUserLogged === 'false' && (
        <section
          className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
        >
          <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl')}>
            <strong>
              Treba da se ulogujete ukoliko želite da postavite oglas.
            </strong>
          </h1>
        </section>
      )}
      <form
        className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="e-mail"
          className={clsx('mb-2', 'text-forestGreen', 'cursor-pointer')}
        >
          Unesite email:
        </label>
        <CustomInput
          required
          type="email"
          name="email"
          id="e-mail"
          placeholder="Unesite email"
          error={props.error?.response?.data}
          isLoading={props.isLoading}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAuth({ ...auth, email: e.target.value })
          }
          disabled={props.isLoading}
          prefix={<MailOutlined className={clsx('text-groupTransparent')} />}
        />
        <label
          htmlFor="password"
          className={clsx('mb-2', 'text-forestGreen', 'cursor-pointer')}
        >
          Unesite lozinku:
        </label>
        <Input.Password
          required
          size="large"
          name="password"
          id="password"
          placeholder="Unesite lozinku"
          className={clsx('rounded-xs', 'mb-2', {
            'border-red': props.error?.response?.data,
            'border-forestGreen': !props.isLoading,
            'border-groupTransparent': props.isLoading
          })}
          onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          disabled={props.isLoading}
          prefix={<LockOutlined className={clsx('text-groupTransparent')} />}
        />
        {props.isLoading ? (
          <span className={clsx('text-groupTransparent', 'text-sm')}>
            Zaboravljen password?
          </span>
        ) : (
          <Link
            to="/forgot-password"
            className={clsx('text-forestGreen', 'text-sm')}
          >
            Zaboravljen password?
          </Link>
        )}
        <div className={clsx('w-full', 'flex', 'justify-center', 'mt-12')}>
          {props.isLoading ? (
            <span className={clsx('text-groupTransparent', 'text-sm')}>
              Nemate nalog? Registrujte se
            </span>
          ) : (
            <Link
              to="/registration"
              className={clsx('text-forestGreen', 'text-sm')}
            >
              Nemate nalog? Registrujte se
            </Link>
          )}
        </div>
        <CustomButton
          htmlType="submit"
          type="text"
          text={
            props.isLoading ? (
              <LoadingOutlined
                className={clsx('text-groupTransparent', 'my-2')}
              />
            ) : (
              'Prijavi se'
            )
          }
          customStyle={[
            'mt-2',
            {
              'border-groupTransparent': props.isLoading
            }
          ]}
          disabled={props.isLoading}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginTop: '12px'
          }}
        >
          <Divider />
          <GoogleLoginAuth />
          <MetaLoginAuth />
          <Typography variant="caption" align="center">
            Prijavom prihvatate našu{' '}
            <Link to="/privacy-policy" className={'underline'}>
              Politiku privatnosti
            </Link>
            .
          </Typography>
        </Box>
        {props.error && (
          <p className={clsx('font-medium', 'text-red', 'mt-2')}>
            {props.error?.response?.data}
          </p>
        )}
      </form>
    </section>
  );
};
