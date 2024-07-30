import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { Logo } from '@green-world/components';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        'sticky',
        'inset-x-0',
        'top-0',
        'z-20',
        'bg-teaGreen',
        'shadow',
        'px-4',
        'sm:px-7',
        'xl:px-0',
        'py-4'
      )}
    >
      <nav
        className={clsx(
          'max-w-[1400px]',
          'mx-auto',
          'flex',
          'items-center',
          'justify-between'
        )}
      >
        <Logo />
        <nav className={clsx('flex', 'items-center', 'gap-x-5')}>
          <button
            onClick={() => navigate('/create-ad')}
            className={clsx(
              'text-forestGreen',
              'md:hover:text-seaFoamGreen',
              'leading-normal',
              'font-medium',
              'border-2',
              'rounded-md',
              'min-h-12',
              'p-4',
              'max-h-12',
              'flex',
              'items-center',
              'justify-center',
              'text-center',
              'shadow-md',
              'transition',
              { 'text-deepTeal': '/create-ad' === location.pathname }
            )}
          >
            Dodaj oglas
          </button>
          <button
            className={clsx(
              'text-forestGreen',
              'md:hover:text-seaFoamGreen',
              'leading-normal',
              'font-medium',
              'border-2',
              'rounded-md',
              'min-h-12',
              'p-4',
              'max-h-12',
              'flex',
              'items-center',
              'justify-center',
              'text-center',
              'shadow-md',
              'transition',
              'group',
              { 'text-deepTeal': '/login' === location.pathname }
            )}
            onClick={() => navigate('/profile')}
          >
            <UserOutlined
              className={clsx(
                'text-forestGreen',
                'md:group-hover:text-seaFoamGreen',
                'text-xl'
              )}
            />
          </button>
        </nav>
      </nav>
    </header>
  );
};
