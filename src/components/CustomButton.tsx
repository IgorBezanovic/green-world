import { Button } from 'antd';
import clsx from 'clsx';

export const CustomButton = ({
  children,
  ...props
}: {
  [x: string]: any;
  children?: any;
}) => {
  return (
    <Button
      type={props.type || 'primary'}
      className={clsx(
        'flex-1',
        'border-1',
        'border-forestGreen',
        'text-forestGreen',
        'rounded',
        'py-2',
        'px-4',
        'shadow-md',
        'font-extralight',
        'uppercase',
        'h-full',
        'min-h-[42px]',
        'transition-all',
        'duration-300',
        'md:hover:shadow-lg',
        'md:hover:translate-y-[-1px]',
        'md:active:translate-y-0',
        'md:active:shadow-md',
        props.customStyle
      )}
      {...props}
    >
      {children}
      {props.text}
    </Button>
  );
};
