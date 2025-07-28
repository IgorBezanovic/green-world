import { ProductCard } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { Product } from '@green-world/utils/types';
import ClearIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Grow from '@mui/material/Grow';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const Products = () => {
  const { data: products } = useAllProducts();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [search, setSearch] = useState<string>('');
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const subGroups = useMemo(() => {
    const groups = new Set<string>();
    products?.products.forEach((p) => {
      if (p.subGroup) groups.add(p.subGroup);
    });
    return Array.from(groups);
  }, [products]);

  const priceLimits = useMemo(() => {
    if (!products?.products.length) return [0, 0];

    const prices = products.products.map((p) => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [min, max];
  }, [products]);

  useEffect(() => {
    setPriceRange(priceLimits as [number, number]);
  }, [priceLimits]);

  const filteredProducts = useMemo(() => {
    return products?.products.filter((prod) => {
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
        <title>Zeleni svet | Pretraga proizvoda | Svi proizvodi</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/search" />
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
        <Box>
          {isMobile && (
            <Button
              variant="outlined"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              sx={{
                width: '100%',
                marginBottom: '16px'
              }}
            >
              {!isFiltersOpen ? 'Filteri' : 'Zatvori filtere'}
            </Button>
          )}
          {/* Filters */}
          {(isMobile
            ? Boolean(products?.products.length) && isFiltersOpen && isMobile
            : Boolean(products?.products.length)) && (
            <Grow in={isFiltersOpen || !isMobile}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'sticky',
                  top: '100px'
                }}
              >
                <Box>
                  <InputLabel htmlFor="name">Pretraga po nazivu</InputLabel>
                  <TextField
                    aria-describedby="name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '8px'
                      }
                    }}
                    slotProps={{
                      input: {
                        endAdornment: search ? (
                          <ClearIcon
                            onClick={() => setSearch('')}
                            sx={{ cursor: 'pointer' }}
                          />
                        ) : (
                          <SearchIcon color="action" />
                        )
                      }
                    }}
                    fullWidth
                  />
                </Box>

                <Box>
                  <InputLabel id="subgroup-select-label">
                    Podkategorija
                  </InputLabel>
                  <Select
                    labelId="subgroup-select-label"
                    value={selectedSubgroup}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: '8px'
                      }
                    }}
                    onChange={(e) => setSelectedSubgroup(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Sve</MenuItem>
                    {subGroups.map((sg) => (
                      <MenuItem key={sg} value={sg}>
                        {sg}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography gutterBottom>
                    Cena: {priceRange[0]} - {priceRange[1]} RSD
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(_, value) =>
                      setPriceRange(value as [number, number])
                    }
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
            </Grow>
          )}
        </Box>

        <Box
          component={'section'}
          className={clsx('w-full', 'grid', 'gap-5', {
            'grid-cols-2': filteredProducts?.length,
            'sm:grid-cols-3': filteredProducts?.length,
            'lgm:grid-cols-4': filteredProducts?.length
          })}
        >
          {filteredProducts && filteredProducts.length ? (
            filteredProducts.map((product: Product) => (
              <ProductCard
                key={`${product.createdAt}_${product.createdBy}`}
                product={product}
              />
            ))
          ) : (
            <Box
              sx={{
                width: '100%',
                textAlign: 'center',
                mb: 8,
                px: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <Typography variant="h4">
                  Trenutno nema proizvoda za izabrane filtere
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Izaberite neku drugu kombinaciju filtera
                </Typography>
                <Box
                  component="img"
                  sx={{
                    height: '300px'
                  }}
                  src="https://res.cloudinary.com/dijofqxeu/image/upload/v1747514245/u5ed1xffzv502yrzuvyl.png"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
