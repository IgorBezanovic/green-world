import { Button } from 'antd';
import clsx from 'clsx';

export const CustomButton = ({
  children,
  customStyle,
  type,
  ...props
}: {
  [x: string]: any;
  type: 'link' | 'text' | 'primary' | 'default' | 'dashed' | undefined;
  customStyle?: any;
  children?: any;
}) => {
  return (
    <Button
      type={type || 'primary'}
      className={clsx(
        'flex-1',
        'flex-grow-0',
        'border-1',
        'border-forestGreen',
        'text-forestGreen',
        'rounded',
        'py-2',
        'px-4',
        'shadow-md',
        'uppercase',
        'h-full',
        'min-h-[42px]',
        'transition-all',
        'duration-300',
        'md:hover:shadow-lg',
        'md:hover:translate-y-[-1px]',
        'md:active:translate-y-0',
        'md:active:shadow-md',
        customStyle
      )}
      {...props}
    >
      {children}
      {props.text}
    </Button>
  );
};
