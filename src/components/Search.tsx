import { homeCategories, subGroups } from '@green-world/utils/constants';
import { ProductFiltersParams, SubGroup } from '@green-world/utils/types';
import { Divider } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { ChangeEvent, useState } from 'react';

type FormState = {
  [key: string]: boolean | string;
};

type Params = {
  onFilterChange: React.Dispatch<
    React.SetStateAction<ProductFiltersParams | undefined>
  >;
};

export const Search = ({ onFilterChange }: Params) => {
  const initialCategory: FormState = homeCategories.reduce(
    (o, key) => ({ ...o, [key.slug]: false }),
    {}
  );

  const [searchCategoryState, setCategoryState] = useState(initialCategory);
  const [subGroupList, setSubGroupList] = useState<SubGroup[]>([]);

  const handleSearchForm = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'group' | 'subGroup'
  ) => {
    const { name, checked } = e.target;

    onFilterChange((prevState = {}) => {
      const updatedList = checked
        ? [...(prevState[type] || []), name]
        : (prevState[type] || []).filter((item: any) => item !== name);

      return { ...prevState, [type]: updatedList };
    });

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
    <FormControl component="fieldset" sx={{ width: '100%', gap: '12px' }}>
      <FormLabel component="legend">Kategorija</FormLabel>
      <FormGroup aria-label="position">
        {homeCategories.map((homeCategory) => (
          <FormControlLabel
            key={homeCategory.slug}
            value={homeCategory.slug}
            control={
              <Checkbox
                onChange={(e) => handleSearchForm(e, 'group')}
                checked={searchCategoryState[homeCategory.slug] as boolean}
                name={homeCategory.slug}
                id={homeCategory.slug}
                sx={{
                  '&.Mui-checked': {
                    color: '#448A7C'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(68, 138, 124, 0.1)'
                  },
                  '&.Mui-focusVisible': {
                    outline: '2px solid #448A7C'
                  }
                }}
              />
            }
            label={homeCategory.text}
            labelPlacement="end"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#245a46',
              cursor: 'pointer'
            }}
          />
        ))}
      </FormGroup>
      <Divider orientation="horizontal" flexItem />
      {subGroupList.length !== 0 && (
        <FormLabel component="p">Podkategorija</FormLabel>
      )}
      <FormGroup className="grid grid-cols-2 max-h-[400px] overflow-y-auto">
        {subGroupList.map((subGroup) => (
          <FormControlLabel
            key={subGroup.label}
            value={subGroup.label}
            control={
              <Checkbox
                onChange={(e) => handleSearchForm(e, 'subGroup')}
                checked={searchCategoryState[subGroup.label] as boolean}
                name={subGroup.label}
                id={subGroup.label}
                sx={{
                  '&.Mui-checked': {
                    color: '#448A7C'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(68, 138, 124, 0.1)'
                  },
                  '&.Mui-focusVisible': {
                    outline: '2px solid #448A7C'
                  }
                }}
              />
            }
            label={subGroup.sr_RS}
            labelPlacement="end"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#245a46',
              cursor: 'pointer'
            }}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
