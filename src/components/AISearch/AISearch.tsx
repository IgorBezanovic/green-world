import { useSearch } from '@green-world/hooks/useSearch';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Chip
} from '@mui/material';
import dayjs from 'dayjs';
import {
  CalendarDays,
  HandCoins,
  NotebookPen,
  Phone,
  Search,
  Sparkles,
  X,
  Megaphone
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

export type SearchOptionType = {
  id: string;
  type: 'product' | 'event' | 'user' | 'shop' | 'blog';
  title: string;
  image?: string;
  phone?: string;
  price?: string;
  date?: string;
  author?: string;
  isPromoted: boolean;
};

export const AISearch = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<SearchOptionType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

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
            : option.type === 'user'
              ? 'Korisnici'
              : 'Blogovi'
      }
      getOptionLabel={(option) => option.title}
      value={value}
      filterOptions={(x) => x}
      onChange={(_, newValue) => {
        setValue(newValue);
        if (newValue)
          navigate(
            `/${newValue.type === 'user' ? 'shop' : newValue.type}/${newValue.id}`
          );
      }}
      noOptionsText={isLoading ? 'Učitavanje...' : 'Nema rezultata'}
      slotProps={{
        paper: {
          sx: {
            '& .MuiAutocomplete-noOptions': {
              color: (theme) => theme.palette.secondary.dark
            }
          }
        },
        listbox: {
          sx: {
            '& .MuiAutocomplete-groupLabel': {
              color: (theme) => theme.palette.secondary.dark
            }
          }
        }
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      loading={isLoading}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={key + Math.random()}
            {...otherProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              ...(option.isPromoted && {
                m: 1,
                border: (theme) => `1px solid ${theme.palette.warning.main}`,
                backgroundColor: (theme) => theme.palette.warning.light,
                borderRadius: 1
              })
            }}
          >
            <Avatar
              src={formatImageUrl(option.image || '', 55)}
              alt={option.title}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {option.title}
                </Typography>
                {option.isPromoted && (
                  <>
                    <Chip
                      label="Promovisano"
                      color="warning"
                      size="small"
                      sx={{ ml: 1, pt: 0 }}
                      icon={
                        <Megaphone
                          style={{
                            width: 14,
                            height: 14,
                            marginLeft: 4
                          }}
                        />
                      }
                    />
                  </>
                )}
              </Box>
              {option.type === 'shop' && (
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Phone className="mr-1" /> {option.phone}
                </Typography>
              )}
              {option.type === 'product' && (
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <HandCoins className="mr-1" />{' '}
                  {option.price
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                  {option.price === 'Cena Na Upit' ? '' : 'RSD'}
                </Typography>
              )}
              {option.type === 'event' && (
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <CalendarDays className="mr-1" />{' '}
                  {dayjs(option.date).format('DD.MM.YYYY. HH:mm')}
                </Typography>
              )}
              {option.type === 'blog' && (
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <NotebookPen className="mr-1" /> {option.author}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Pretražite proizvode, blogove, korisnike, događaje..."
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiOutlinedInput-root': {
              paddingRight: '0 !important'
            },
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: (theme) => `1px solid ${theme.palette.secondary.main}`,
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
