import clsx from 'clsx';
import { useState } from 'react';

export const UserRegistrationForm = () => {
  const [entityType, setEntityType] = useState('prodavac');

  const handleEntity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntityType(e.target.value);
  };

  return (
    <section
      className={clsx(
        'bg-teaGreen',
        'shadow-md',
        'rounded-md',
        'p-5',
        'md:py-14',
        'w-full',
        'max-w-2xl',
        'mx-auto',
        'mt-10'
      )}
    >
      <form
        className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
      >
        <h2
          className={clsx('mb-4', 'text-forestGreen', 'font-bold', 'uppercase')}
        >
          Registracija
        </h2>
        <fieldset className={clsx('mb-4')}>
          <div className={clsx('mb-2', 'flex', 'align-middle')}>
            <input
              type="radio"
              id="kupac"
              name="entity"
              value="kupac"
              checked={entityType === 'kupac'}
              onChange={handleEntity}
            />
            <label
              htmlFor="kupac"
              className={clsx('ml-1.5', 'text-forestGreen')}
            >
              Kupac
            </label>
          </div>
          <div className={clsx('mb-2', 'flex', 'align-middle')}>
            <input
              type="radio"
              id="prodavac"
              name="entity"
              value="prodavac"
              checked={entityType === 'prodavac'}
              onChange={handleEntity}
            />
            <label
              htmlFor="prodavac"
              className={clsx('ml-1.5', 'text-forestGreen')}
            >
              Prodavac
            </label>
          </div>
        </fieldset>
        {entityType === 'prodavac' && (
          <input
            type="text"
            placeholder="Ime radnje"
            className={clsx(
              'w-full',
              'border-2',
              'border-forestGreen',
              'rounded-md',
              'pl-2',
              'py-2',
              'shadow-md',
              'mb-2',
              'bg-whiteLinen',
              'transition'
            )}
          />
        )}
        <button
          className={clsx(
            'mt-2',
            'w-full',
            'bg-forestGreen',
            'rounded-md',
            'py-2',
            'shadow-md',
            'text-mintCream'
          )}
        >
          Registruj me
        </button>
      </form>
    </section>
  );
};
