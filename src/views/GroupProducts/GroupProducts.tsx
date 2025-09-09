import { GroupButton, ProductCard } from '@green-world/components';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import {
  categories,
  homeCategories,
  subGroups
} from '@green-world/utils/constants';
import { Product } from '@green-world/utils/types';
import ClearIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Checkbox,
  Grid,
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
import { useNavigate, useParams } from 'react-router-dom';

import ProductBanner from '../../assets/Products.png';

export const GroupProducts = () => {
  const navigate = useNavigate();
  const { category = '' } = useParams();
  const categoryName = homeCategories.find(
    (item) => item.slug === category
  )?.text;

  const { data: products = [] } = useProductsByGroup(category);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [search, setSearch] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (!category || !categories.includes(category)) {
      navigate('/');
    }
  }, [category, navigate]);

  const availableSubgroups = useMemo(() => {
    if (!products?.length) return [];

    // Uzmi sve subgrupe koje backend vraća iz svih proizvoda
    const backendSubs = new Set(
      products
        .filter((p) => p.subGroup) // samo proizvodi sa subgrupom
        .map((p) => p.subGroup)
    );

    // Od svih definisanih subgrupa, prikazi samo one koje postoje u backendSubs
    const allSubgroups: (typeof subGroups)[keyof typeof subGroups] = [];
    Object.values(subGroups).forEach((sgList) => {
      sgList.forEach((sg) => {
        if (backendSubs.has(sg.label)) allSubgroups.push(sg);
      });
    });

    return allSubgroups;
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

  useEffect(() => {
    setIsFiltering(true);

    const timer = setTimeout(() => {
      setDisplayedProducts(filteredProducts || []);
      setIsFiltering(false);
    }, 100); // 100ms debounce da izbegne flicker

    return () => clearTimeout(timer);
  }, [filteredProducts]);

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Pretraga proizvoda | {categoryName}</title>
        <link
          rel="canonical"
          href={`https://www.zelenisvet.rs/search/${category}`}
        />
      </Helmet>

      <Box
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <Box
          component="img"
          loading="eager"
          src={ProductBanner}
          alt="Zeleni svet banner"
          className={clsx(
            'max-w-[1400px]',
            'mx-auto',
            'w-full',
            'h-auto',
            'rounded',
            'shadow',
            'h-[320px]'
          )}
        />
        <Box
          sx={{
            display: 'flex',
            gap: isMobile ? 2 : 7,
            flexDirection: isMobile ? 'column' : 'row',
            minHeight: '100vh'
          }}
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
              ? Boolean(products.length) && isFiltersOpen && isMobile
              : Boolean(products.length)) && (
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
                  <Typography
                    variant="h1"
                    color="custom.forestGreen"
                    sx={{ fontFamily: 'Ephesis' }}
                  >
                    {categoryName}
                  </Typography>

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
                          // endAdornment: <SearchIcon color="action" />
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
                    <InputLabel id="subgroup-select-label">Podgrupa</InputLabel>
                    <Select
                      labelId="subgroup-select-label"
                      value={selectedSubgroup}
                      onChange={(e) => setSelectedSubgroup(e.target.value)}
                      sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
                      fullWidth
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) return 'Sve Podgrupe';
                        const sg = availableSubgroups.find(
                          (s) => s.label === selected
                        );
                        return sg ? sg.sr_RS : 'Sve podgrupe';
                      }}
                    >
                      <MenuItem value="">Sve Podgrupe</MenuItem>
                      {availableSubgroups.map((sg) => (
                        <MenuItem key={sg.label} value={sg.label}>
                          {sg.sr_RS}
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
                      sx={(theme) => ({
                        color: theme.palette.custom.forestGreen
                      })}
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

          {/* Products Grid */}
          <Box
            component={'section'}
            className={clsx('w-full', 'grid', 'gap-5', {
              'grid-cols-2': displayedProducts.length,
              'sm:grid-cols-3': displayedProducts.length,
              'lgm:grid-cols-4': displayedProducts.length
            })}
          >
            {isFiltering ? (
              // dok traje filtriranje zadrži stare proizvode
              displayedProducts.map((product: Product) => (
                <ProductCard
                  key={`${product.createdAt}_${product.createdBy}`}
                  product={product}
                />
              ))
            ) : displayedProducts.length ? (
              displayedProducts.map((product: Product) => (
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
                    marginY: '32px'
                  }}
                >
                  <Typography variant="h4">
                    Trenutno nema proizvoda za izabranu kategoriju
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    Izaberite neku drugu od ponuđenih kategorija
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: '300px'
                    }}
                    src="https://res.cloudinary.com/dijofqxeu/image/upload/v1747514245/u5ed1xffzv502yrzuvyl.png"
                  />
                </Box>

                <Grid
                  container
                  component="section"
                  spacing={{ xs: 2, sm: 3 }}
                  sx={{
                    maxWidth: 1200,
                    width: '100%',
                    mx: 'auto'
                  }}
                >
                  {homeCategories.map((category) => (
                    <Grid
                      key={category.id}
                      size={{
                        xs: 6,
                        sm: 4,
                        lg: 3
                      }}
                    >
                      <GroupButton item={category} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
