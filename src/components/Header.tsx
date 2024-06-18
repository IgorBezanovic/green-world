import { Logo } from '@green-world/components';
import { navigationItems } from '@green-world/utils/constants';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  return (
    <header
      className={clsx(
        'sticky',
        'inset-x-0',
        'top-0',
        'z-20',
        'bg-teaGreen',
        'shadow',
        'px-5',
        'py-4'
      )}
    >
      <nav
        className={clsx(
          'max-w-[1360px]',
          'mx-auto',
          'flex',
          'items-center',
          'justify-between'
        )}
      >
        <Logo />
        <nav className={clsx('flex', 'items-center', 'gap-x-5')}>
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              className={clsx(
                'text-forestGreen',
                'hover:text-seaFoamGreen',
                'leading-normal',
                'font-medium',
                'border-2',
                'rounded-xl',
                'min-h-12',
                'p-4',
                'max-h-12',
                'flex',
                'items-center',
                'justify-center',
                'text-center',
                'shadow-md',
                'transition',
                { 'text-deepTeal': item.route === location.pathname }
              )}
              to={item.route}
            >
              {typeof item.title === 'string' ? (
                item.title
              ) : (
                <item.title className={clsx('text-2xl')} />
              )}
            </Link>
          ))}
        </nav>
      </nav>
    </header>
  );
};
