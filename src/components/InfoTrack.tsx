import { MailOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const InfoTrack = () => {
  const navigate = useNavigate();

  return (
    <section
      className={clsx(
        'bg-whiteLinen',
        'py-1',
        'max-w-[1400px]',
        'w-full',
        'mx-auto',
        'px-4',
        'sm:px-7',
        'xl:px-0',
        'hidden',
        'md:flex'
      )}
    >
      <button
        className={clsx('text-sm')}
        onClick={() => navigate('/contact-us')}
      >
        <MailOutlined /> Pišite nam
      </button>
    </section>
  );
};
