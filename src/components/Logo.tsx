import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const Logo = ({
  width,
  height
}: {
  width?: string;
  height?: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      style={{
        backgroundImage: "url('/green-world.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: width || '3.5rem',
        height: height || '3.5rem'
      }}
      className={clsx('flex', 'shadow-md', 'rounded-[50%]')}
      onClick={() => navigate('/')}
      aria-label="Home"
    />
  );
};
