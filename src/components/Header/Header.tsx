import { HorizontalLogo } from '@last-minute-ponude/components';
import { navigationItems } from '@last-minute-ponude/utils/constants';
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
        'bg-mint',
        'shadow',
        'p-5',
        'flex',
        'items-center',
        'justify-between'
      )}
    >
      <HorizontalLogo color={'gray'} />
      <div
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
              'text-black',
              'leading-normal',
              'font-medium',
              'hover:text-lightGray',
              { 'text-mint': item.route === location.pathname }
            )}
            to={item.route}
          >
            {typeof item.title !== 'string' ? <item.title /> : item.title}
          </Link>
        ))}
      </div>
    </header>
  );
};
