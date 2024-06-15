import { Logo } from '@green-world/components/Logo';
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
        'py-3',
        'flex',
        'items-center',
        'justify-between'
      )}
    >
      <Logo />
      <nav
        className={clsx(
          'flex',
          'items-center',
          'justify-end',
          'flex-1',
          'gap-x-5',
          'gap-y-5',
          'md:gap-y-0',
          'm-auto',
          'md:px-4',
          'max-w-screen-2xl'
        )}
      >
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            className={clsx(
              'text-wintergreenDream',
              'leading-normal',
              'font-medium',
              'hover:text-seaFoamGreen',
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
    </header>
  );
};
