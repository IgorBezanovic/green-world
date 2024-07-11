import clsx from 'clsx';

export const Divider = ({ text }: { text: string }) => {
  return (
    <section className={clsx('flex', 'items-center')}>
      <div
        className={clsx(
          'flex-1',
          'h-[2px]',
          'shadow-md',
          'rounded-md',
          'bg-forestGreen'
        )}
      />
      <h2 className={clsx('mx-5', 'text-forestGreen', 'uppercase', 'text-xl')}>
        {text}
      </h2>
      <div
        className={clsx(
          'flex-1',
          'h-[2px]',
          'shadow-md',
          'rounded-md',
          'bg-forestGreen'
        )}
      />
    </section>
  );
};
