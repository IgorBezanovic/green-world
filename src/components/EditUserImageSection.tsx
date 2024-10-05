import { Card } from 'antd';
import clsx from 'clsx';

import { CustomQRCode } from '.';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const EditUserImageSection = ({ ...props }) => {
  return (
    <Card>
      <section
        className={clsx('flex', 'w-full', 'justify-between', 'md:h-[300px]')}
      >
        <section
          className={clsx('flex', 'flex-col', 'justify-between', 'h-full')}
        >
          <div
            className={clsx(
              'w-[150px]',
              'h-[150px]',
              'overflow-hidden',
              'rounded-full',
              'shadow-md',
              'relative',
              'mx-auto',
              'md:mx-0'
            )}
          >
            <img
              src={props.user?.profileImage || ZSLogo}
              height="100%"
              width="100%"
            />
          </div>
          <label
            htmlFor="profileImage"
            className={clsx(
              'flex-1',
              'flex-grow-0',
              'w-full',
              'uppercase',
              'border',
              'border-forestGreen',
              'text-forestGreen',
              'rounded',
              'py-2',
              'px-4',
              'shadow-md',
              'bg-whiteLinen',
              'text-center',
              'cursor-pointer'
            )}
          >
            Odaberi sliku
          </label>
          <input
            type="file"
            name="profileImage"
            id="profileImage"
            accept="image/*"
            onChange={props.handleImage}
            className={clsx('hidden')}
          ></input>
        </section>
        <CustomQRCode
          link={props.user?.website}
          icon={props.user?.profileImage || ''}
        />
        <CustomQRCode link={props.user?.website} icon={ZSLogo} />
      </section>
    </Card>
  );
};
