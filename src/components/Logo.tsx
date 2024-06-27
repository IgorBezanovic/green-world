import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const Logo = ({
  width,
  height
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <Link
      style={{
        backgroundImage: "url('/green-world.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: width || '3.5rem',
        height: height || '3.5rem'
      }}
      className={clsx('flex', 'shadow-md', 'rounded-[50%]')}
      to="/"
      aria-label="Home"
    />
  );
};
