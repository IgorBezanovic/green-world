import clsx from 'clsx';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export const RedirectSquare = ({ ...props }) => {
  const style = useMemo(
    () => ({
      backgroundImage: props.item.image,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }),
    [props.item.image]
  );

  return (
    <Link
      style={style}
      className={clsx(
        'flex',
        'shadow-md',
        'relative',
        'w-full',
        'h-[200px]',
        'lg:h-[300px]',
        'transition-all',
        'group'
      )}
      to={props.item.route}
      aria-label={props.item.text}
    >
      <p
        className={clsx(
          'absolute',
          'left-0',
          'bottom-0',
          'right-0',
          'h-14',
          'bg-groupTransparent',
          'flex',
          'items-center',
          'pl-4',
          'text-whiteLinen',
          'font-medium',
          'uppercase',
          'tracking-wide',
          'transition-all',
          'md:group-hover:font-bold',
          'md:group-hover:text-forestGreen',
          'md:group-hover:bg-whiteLinen'
        )}
      >
        {props.item.text}
      </p>
    </Link>
  );
};
