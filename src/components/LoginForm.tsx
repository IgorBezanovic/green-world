import { LoadingOutlined } from '@ant-design/icons';
import { AuthValues } from '@green-world/utils/types';
import { Box, OutlinedInput, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router';

import { Divider, GoogleLoginAuth, MetaLoginAuth } from '../components';
import { CustomButton } from './CustomButton';

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
        'mb-8'
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
          htmlFor="email"
          className={clsx('mb-2', 'text-forestGreen', 'cursor-pointer')}
        >
          Email:
        </label>
        <OutlinedInput
          id="email"
          name="email"
          type="email"
          value={auth.email}
          onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          disabled={props.isLoading}
          error={Boolean(props.error?.response?.data)}
          placeholder="Unesite email"
          required
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-input': {
              padding: '8px !important'
            }
          }}
        />
        <label
          htmlFor="password"
          className={clsx('mb-2', 'mt-4', 'text-forestGreen', 'cursor-pointer')}
        >
          Lozinka:
        </label>
        <OutlinedInput
          id="password"
          name="password"
          type="password"
          value={auth.password}
          onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          disabled={props.isLoading}
          error={Boolean(props.error?.response?.data)}
          placeholder="Unesite lozinku"
          required
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-input': {
              padding: '8px !important'
            }
          }}
        />
        {props.isLoading ? (
          <span className={clsx('text-groupTransparent', 'text-sm', 'mt-1')}>
            Zaboravljen password?
          </span>
        ) : (
          <Link
            to="/forgot-password"
            className={clsx('text-forestGreen', 'text-sm', 'mt-1')}
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
