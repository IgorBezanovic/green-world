import {
  BackButton,
  ForgotPasswordForm,
  MetaTags
} from '@green-world/components';
import clsx from 'clsx';

export const ForgotPassword = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni Svet | Zaboravljena Lozinka | Green World'} />

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <div
          className={clsx(
            'hidden',
            'md:flex',
            'xl:max-w-[1400px]',
            'w-full',
            'mx-auto'
          )}
        >
          <BackButton />
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
