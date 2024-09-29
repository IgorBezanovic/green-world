import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import clsx from 'clsx';

export const VisibleEye = ({ ...props }) => {
  const changeVisibility = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    props.setShowPassword(!props.showPassword);
  };

  return (
    <button onClick={changeVisibility} disabled={props.isLoading}>
      {props.showPassword ? (
        <EyeOutlined
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'absolute',
            'right-3',
            'top-2.5',
            'text-2xl',
            {
              'text-groupTransparent': props.isLoading
            }
          )}
        />
      ) : (
        <EyeInvisibleOutlined
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'absolute',
            'right-3',
            'top-2.5',
            'text-2xl',
            {
              'text-groupTransparent': props.isLoading
            }
          )}
        />
      )}
    </button>
  );
};
