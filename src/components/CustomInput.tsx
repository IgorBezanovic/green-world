import { Input } from 'antd';
import clsx from 'clsx';

export const CustomInput = ({
  customStyle,
  isLoading,
  ...props
}: {
  [x: string]: any;
  customStyle?: any;
}) => {
  return (
    <Input
      className={clsx(
        'flex-1',
        'flex-grow-0',
        'rounded-xs',
        'shadow-md',
        'h-full',
        'min-h-[42px]',
        'md:hover:shadow-lg',
        'mb-4',
        {
          'border-red': props.error,
          'border-forestGreen': !isLoading,
          'border-groupTransparent': isLoading
        },
        customStyle
      )}
      {...props}
    />
  );
};
