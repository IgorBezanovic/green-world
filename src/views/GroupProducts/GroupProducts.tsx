import { ProductCard } from '@green-world/components';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { categories, homeCategories } from '@green-world/utils/constants';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

export const GroupProducts = () => {
  const navigate = useNavigate();
  const { category = '' } = useParams();
  const categoryName = homeCategories.find(
    (item) => item.slug === category
  )?.text;

  const { data: products = [] } = useProductsByGroup(category);

  const [search, setSearch] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (!category || !categories.includes(category)) {
      navigate('/');
    }
  }, [category, navigate]);

  const subGroups = useMemo(() => {
    const groups = new Set<string>();
    products.forEach((p) => {
      if (p.subGroup) groups.add(p.subGroup);
    });
    return Array.from(groups);
  }, [products]);

  const priceLimits = useMemo(() => {
    if (!products.length) return [0, 0];

    const prices = products.map((p) => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [min, max];
  }, [products]);

  useEffect(() => {
    setPriceRange(priceLimits as [number, number]);
  }, [priceLimits]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesName = prod.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSubgroup = selectedSubgroup
        ? prod.subGroup === selectedSubgroup
        : true;

      const matchesPrice =
        prod.price >= priceRange[0] && prod.price <= priceRange[1];

      const matchesStock = inStockOnly ? prod.onStock : true;

      return matchesName && matchesSubgroup && matchesPrice && matchesStock;
    });
  }, [products, search, selectedSubgroup, priceRange, inStockOnly]);

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Pretraga proizvoda | {categoryName}</title>
        <link
          rel="canonical"
          href={`https://www.zeleni-svet.com/search/${category}`}
        />
      </Helmet>

      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: 0,
          [theme.breakpoints.down('xl')]: {
            px: 4
          },
          [theme.breakpoints.down('xs')]: {
            px: 4
          },
          py: 7,
          display: 'flex',
          flexDirection: 'row',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
          },
          gap: 10
        })}
      >
        {/* Filters */}
        <Box className="mb-6 grid grid-cols-1">
          <TextField
            label="Pretraga po nazivu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: <SearchIcon color="action" />
              }
            }}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="subgroup-select-label">Podkategorija</InputLabel>
            <Select
              labelId="subgroup-select-label"
              value={selectedSubgroup}
              label="Podkategorija"
              onChange={(e) => setSelectedSubgroup(e.target.value)}
            >
              <MenuItem value="">Sve</MenuItem>
              {subGroups.map((sg) => (
                <MenuItem key={sg} value={sg}>
                  {sg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>
              Cena: {priceRange[0]} - {priceRange[1]} RSD
            </Typography>
            <Slider
              value={priceRange}
              onChange={(_, value) => setPriceRange(value as [number, number])}
              valueLabelDisplay="auto"
              min={priceLimits[0]}
              max={priceLimits[1]}
              disabled={priceLimits[0] === priceLimits[1]}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Checkbox
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <Typography>Na stanju</Typography>
          </Box>
        </Box>

        {/* Products Grid */}
        <Box
          className={clsx(
            'w-full',
            'grid',
            'grid-cols-2',
            'sm:grid-cols-3',
            'lgm:grid-cols-4',
            'gap-5'
          )}
        >
          {filteredProducts.length ? (
            filteredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <Box>Nema rezultata</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
