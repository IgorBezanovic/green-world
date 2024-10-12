import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { CustomButton, Logo } from '@green-world/components';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
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
        'py-3'
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
          <CustomButton
            text={'Dodaj oglas'}
            type={'text'}
            onClick={() => navigate('/create-product')}
          />
          <CustomButton type={'text'} onClick={() => navigate('/profile')}>
            <UserOutlined
              className={clsx('text-forestGreen', 'text-[20px]')}
              style={{ font: 'light' }}
            />
          </CustomButton>
        </nav>
      </nav>
    </header>
  );
};
