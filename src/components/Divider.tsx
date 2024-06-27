import clsx from 'clsx';

export const Divider = ({ text }: { text: string }) => {
  return (
    <div className={clsx('flex', 'items-center')}>
      <div
        className={clsx(
          'flex-1',
          'h-[2px]',
          'shadow-md',
          'rounded-md',
          'bg-forestGreen'
        )}
      />
      <span
        className={clsx('mx-5', 'text-forestGreen', 'uppercase', 'text-xl')}
      >
        {text}
      </span>
      <div
        className={clsx(
          'flex-1',
          'h-[2px]',
          'shadow-md',
          'rounded-md',
          'bg-forestGreen'
        )}
      />
    </div>
  );
};
