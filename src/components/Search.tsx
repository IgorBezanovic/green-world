import { CustomButton } from '@green-world/components';
import { homeCategories, subGroups } from '@green-world/utils/constants';
import { SubGroup } from '@green-world/utils/types';
import { Divider } from 'antd';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

type FormState = {
  [key: string]: boolean | string;
};

export const Search = () => {
  const initialCategory: FormState = homeCategories.reduce(
    (o, key) => ({ ...o, [key.slug]: false }),
    {}
  );

  const [searchCategoryState, setCategoryState] = useState(initialCategory);
  const [subGroupList, setSubGroupList] = useState<SubGroup[]>([]);

  const handleSearchForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCategoryState((prevState) => ({
      ...prevState,
      [name]: checked
    }));
    setSubGroupList((prevList) => {
      const currentSubGroups: SubGroup[] =
        subGroups[
          name as
            | 'flower_assortment'
            | 'succulents'
            | 'potted_flowers'
            | 'seedlings'
            | 'fruits_and_vegetables'
            | 'herbal_pharmacy'
            | 'garden_decoration'
            | 'everything_for_plants'
        ] || [];
      if (checked) {
        // Add subgroups if checked
        return [...prevList, ...currentSubGroups];
      } else {
        // Remove subgroups if unchecked
        return prevList.filter(
          (subGroup) =>
            !currentSubGroups.some((sg) => sg.label === subGroup.label)
        );
      }
    });
  };

  return (
    <section className={clsx('flex', 'flex-col', 'items-start')}>
      <label
        className={clsx(
          'mb-2',
          'text-forestGreen',
          'cursor-pointer',
          'text-lg'
        )}
      >
        Kategorija
      </label>
      {homeCategories.map((homeCategory) => (
        <label
          htmlFor={homeCategory.slug}
          className={clsx(
            'flex',
            'items-center',
            'relative',
            'mb-2',
            'text-forestGreen',
            'cursor-pointer'
          )}
          key={homeCategory.slug}
        >
          <input
            type="checkbox"
            name={homeCategory.slug}
            id={homeCategory.slug}
            className={clsx(
              'appearance-none',
              'w-6',
              'h-6',
              'rounded',
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
            checked={searchCategoryState[homeCategory.slug] as boolean}
          />
          <span
            className={clsx(
              'inline-block',
              'absolute',
              'left-0',
              'w-6',
              'h-6',
              'border-2',
              'rounded',
              'flex-shrink-0',
              'flex justify-center items-center',
              'transition-opacity',
              'border-forestGreen',
              {
                'opacity-100': searchCategoryState[homeCategory.slug],
                'opacity-0': !searchCategoryState[homeCategory.slug]
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
          {homeCategory.text}
        </label>
      ))}
      <Divider />
      {subGroupList.length !== 0 && (
        <label
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Podkategorija
        </label>
      )}
      <section
        className={clsx(
          'grid',
          'grid-cols-2',
          'gap-2',
          'max-h-[400px]',
          'overflow-y-auto',
          'w-full'
        )}
      >
        {subGroupList.map((subGroup) => (
          <label
            htmlFor={subGroup.label}
            className={clsx(
              'flex',
              'items-center',
              'relative',
              'mb-2',
              'text-forestGreen',
              'cursor-pointer'
            )}
            key={subGroup.label}
          >
            <input
              type="checkbox"
              name={subGroup.label}
              id={subGroup.label}
              className={clsx(
                'appearance-none',
                'w-6',
                'h-6',
                'rounded',
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
              // onChange={handleSearchForm}
              checked={searchCategoryState[subGroup.label] as boolean}
            />
            <span
              className={clsx(
                'inline-block',
                'absolute',
                'left-0',
                'w-6',
                'h-6',
                'border-2',
                'rounded',
                'flex-shrink-0',
                'flex justify-center items-center',
                'transition-opacity',
                'border-forestGreen',
                {
                  'opacity-100': searchCategoryState[subGroup.label],
                  'opacity-0': !searchCategoryState[subGroup.label]
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
            {subGroup.sr_RS}
          </label>
        ))}
      </section>
      <Divider />
      <CustomButton type="text" text={'pretrazi'} customStyle={['w-full']} />
    </section>
  );
};
