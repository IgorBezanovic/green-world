import clsx from 'clsx';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link
      style={{
        backgroundImage: "url('/green-world.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      className={clsx('w-14', 'shadow-md', 'rounded-[50%]', 'w-14', 'h-14')}
      to="/"
      aria-label="Home"
    />
  );
};
