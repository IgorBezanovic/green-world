import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={clsx(
        'text-forestGreen',
        'hover:text-seaFoamGreen',
        'leading-normal',
        'font-medium',
        'border-2',
        'rounded-md',
        'p-2',
        'w-20',
        'text-center',
        'shadow-md',
        'transition'
      )}
    >
      Nazad
    </button>
  );
};
