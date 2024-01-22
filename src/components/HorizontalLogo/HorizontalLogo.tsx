import clsx from 'clsx';

export const HorizontalLogo = ({
  color
}: {
  color: 'gray' | 'mint' | 'white';
}) => {
  return (
    <div className={clsx('flex', 'items-center', 'justify-ceter')}>
      <img
        src={`/globe-${color}.svg`}
        className={clsx('w-10')}
        width="100%"
        alt="Globe"
        loading="eager"
      />
      <img
        src={`/text-${color}.svg`}
        className={clsx('w-40')}
        width="100%"
        alt="Title"
        loading="eager"
      />
    </div>
  );
};
