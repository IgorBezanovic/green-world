import { legalType } from '@green-world/utils/constants';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

type FormState = {
  [key: string]: boolean | string;
};

export const Search = () => {
  const initialFormState: FormState = legalType.reduce(
    (o, key) => ({ ...o, [key.slug]: false }),
    {}
  );

  const [searchFormState, setSearchFormState] = useState(initialFormState);

  const handleSearchForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    setSearchFormState((prevState) => ({
      ...prevState,
      [name]: type === 'text' ? value : checked
    }));
  };

  return (
    <section
      className={clsx(
        'flex',
        'flex-col',
        'items-start',
        'bg-teaGreen',
        'shadow-md',
        'rounded-md',
        'p-5'
      )}
    >
      {legalType.map((legalEntity) => (
        <label
          htmlFor={legalEntity.slug}
          className={clsx(
            'flex',
            'items-center',
            'relative',
            'mb-2',
            'text-forestGreen',
            'cursor-pointer'
          )}
          key={legalEntity.id}
        >
          <input
            type="checkbox"
            name={legalEntity.slug}
            id={legalEntity.slug}
            className={clsx(
              'appearance-none',
              'w-6',
              'h-6',
              'rounded-md',
              'shadow-md',
              'transition',
              'cursor-pointer',
              'border-2',
              'bg-whiteLinen',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-forestGreen',
              'mr-2',
              'border-forestGreen'
            )}
            onChange={handleSearchForm}
            checked={searchFormState[legalEntity.slug] as boolean}
          />
          <span
            className={clsx(
              'inline-block',
              'absolute',
              'left-0',
              'w-6',
              'h-6',
              'border-2',
              'rounded-md',
              'flex-shrink-0',
              'flex justify-center items-center',
              'transition-opacity',
              'border-forestGreen',
              {
                'opacity-100': searchFormState[legalEntity.slug],
                'opacity-0': !searchFormState[legalEntity.slug]
              }
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-teal-500"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fill="#448A7C"
                stroke="#448A7C"
                d="M3.707 8.293a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 0 1.414 0l7-7a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1-.082-1.497z"
              />
            </svg>
          </span>
          {legalEntity.name}
        </label>
      ))}

      <input
        type="text"
        name="searchItem"
        placeholder="Pretrazi po nazivu"
        className={clsx(
          'w-full',
          'border-2',
          'border-forestGreen',
          'rounded-md',
          'pl-2',
          'py-2',
          'shadow-md',
          'mt-4',
          'mb-8',
          'bg-whiteLinen'
        )}
        onChange={handleSearchForm}
      />
      <button
        className={clsx(
          'w-full',
          'bg-forestGreen',
          'rounded-md',
          'py-2',
          'shadow-md',
          'text-mintCream'
        )}
        onClick={() => console.log(searchFormState)}
      >
        Pretrazi
      </button>
    </section>
  );
};
