import { useSearch } from '@green-world/hooks/useSearch';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Search, Sparkles, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export type SearchOptionType = {
  id: string;
  type: 'product' | 'event' | 'user';
  title: string;
  image?: string;
  phone?: string;
  price?: string;
  date?: string;
};

export const AISearch = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<SearchOptionType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // ⏳ debounce efekat
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const { data = [], isLoading } = useSearch(debouncedValue);
  const memoizedData = useMemo(() => data ?? [], [data]);

  const handleClear = () => {
    setValue(null);
    setInputValue('');
  };

  return (
    <Autocomplete
      options={memoizedData}
      groupBy={(option) =>
        option.type === 'product'
          ? 'Proizvodi'
          : option.type === 'event'
            ? 'Događaji'
            : 'Korisnici'
      }
      getOptionLabel={(option) => option.title}
      value={value}
      filterOptions={(x) => x}
      onChange={(_, newValue) => {
        setValue(newValue);
        if (newValue) navigate(`/${newValue.type}/${newValue.id}`);
      }}
      noOptionsText={isLoading ? 'Učitavanje...' : 'Nema rezultata'}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      loading={isLoading}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...otherProps}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}
          >
            <Avatar
              src={option.image}
              alt={option.title}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {option.title}
              </Typography>
              {option.type === 'user' && (
                <Typography variant="caption" color="text.secondary">
                  📞 {option.phone}
                </Typography>
              )}
              {option.type === 'product' && (
                <Typography variant="caption" color="text.secondary">
                  💰 {option.price}{' '}
                  {option.price === 'Cena Na Upit' ? '' : 'RSD'}
                </Typography>
              )}
              {option.type === 'event' && (
                <Typography variant="caption" color="text.secondary">
                  📅 {option.date}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Pretraga..."
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiOutlinedInput-root': {
              paddingRight: '0 !important'
            },
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: (theme) => `1px solid ${theme.palette.custom.forestGreen}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            height: 40
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 0.5 }}>
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 2 }}>
                  {inputValue && (
                    <IconButton
                      sx={{ cursor: 'pointer' }}
                      onClick={handleClear}
                    >
                      <X />
                    </IconButton>
                  )}
                  {isLoading ? <CircularProgress size={18} /> : <Sparkles />}
                </InputAdornment>
              ),
              sx: {
                flex: 1,
                fontSize: '0.95rem',
                height: 40,
                px: 0
              }
            }
          }}
        />
      )}
    />
  );
};
