import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import clsx from 'clsx';

export const Loader = () => {
  return (
    <section
      className={clsx(
        'fixed',
        'top-0',
        'left-0',
        'h-full',
        'w-full',
        'bg-groupTransparent',
        'z-50',
        'flex',
        'justify-center',
        'items-center',
        'overflow-scroll'
      )}
    >
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 48, color: '#FDFFFB' }} spin />
        }
      />
    </section>
  );
};
