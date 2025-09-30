import { ProductCard, MetaTags } from '@green-world/components';
import { useAllProducts } from '@green-world/hooks/useAllProducts';
import { ProductPreview } from '@green-world/hooks/useHomeProducts';
import { homeCategories, subGroups } from '@green-world/utils/constants';
import ClearIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Grow from '@mui/material/Grow';
import clsx from 'clsx';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router';

export const Products = () => {
  const { category = '' } = useParams();
  const categoryName =
    category && homeCategories.find((item) => item.slug === category)?.text;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(category ?? '');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [priceRange, setPriceRange] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [page, setPage] = useState(1);

  const [oldProducts, setOldProducts] = useState<ProductPreview[]>([]);
  const [filtersToSend, setFiltersToSend] = useState({});
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, isFetching, refetch } = useAllProducts(filtersToSend);

  useEffect(() => {
    if (!isFetching && data?.products) {
      setOldProducts(data.products);
    }
  }, [data, isFetching]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const newFilters: any = {
        title: search.length >= 3 ? search : undefined,
        group: selectedGroup || undefined,
        subGroup: selectedSubgroup || undefined,
        minPrice: priceRange[0] || undefined,
        maxPrice: priceRange[1] || undefined,
        priceOnRequest: priceOnRequest || undefined,
        inStock: inStockOnly || undefined,
        page
      };
      setFiltersToSend(newFilters);
      refetch();
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    search,
    selectedGroup,
    selectedSubgroup,
    priceRange,
    inStockOnly,
    priceOnRequest,
    page,
    refetch
  ]);

  const availableSubgroups = useMemo(() => {
    if (!selectedGroup) {
      // Flatten svih subgrupa u jednu listu
      return Object.values(subGroups).flat();
    }
    return subGroups[selectedGroup as keyof typeof subGroups] || [];
  }, [selectedGroup]);

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Pretraga proizvoda | Svi proizvodi'} />
      <Box
        className={clsx(
          'xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-7 flex flex-col gap-7'
        )}
      >
        <Box
          sx={{
            display: 'flex',
            gap: isMobile ? 2 : 7,
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          {/* Filters */}
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
            {(isMobile ? isFiltersOpen && isMobile : true) && (
              <Grow in={isFiltersOpen || !isMobile}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'sticky',
                    top: '133px'
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography
                      variant="h1"
                      color="secondary.main"
                      sx={{ fontFamily: 'Ephesis' }}
                    >
                      {categoryName || 'Proizvodi'}
                    </Typography>
                    {isFetching && (
                      <Typography
                        variant="overline"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CircularProgress size={16} thickness={4} />
                        Učitavam..
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <InputLabel
                      sx={{ color: (theme) => theme.palette.text.primary }}
                      htmlFor="product-title"
                    >
                      Naziv proizvoda
                    </InputLabel>
                    <TextField
                      name="product-title"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Naziv proizvoda"
                      fullWidth
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
                    />
                  </Box>
                  {!category && (
                    <Box>
                      <InputLabel
                        sx={{ color: (theme) => theme.palette.text.primary }}
                        id="group"
                      >
                        Grupa
                      </InputLabel>
                      <Select
                        labelId="group"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) return 'Sve grupe';
                          const cat = homeCategories.find(
                            (c) => c.slug === selected
                          );
                          return cat ? cat.text : 'Sve grupe';
                        }}
                      >
                        <MenuItem value="">Sve grupe</MenuItem>
                        {homeCategories.map((cat) => (
                          <MenuItem key={cat.slug} value={cat.slug}>
                            {cat.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  )}
                  <Box>
                    <InputLabel
                      sx={{ color: (theme) => theme.palette.text.primary }}
                      id="subGroup"
                    >
                      Podgrupa
                    </InputLabel>
                    <Select
                      labelId="subGroup"
                      value={selectedSubgroup}
                      onChange={(e) => setSelectedSubgroup(e.target.value)}
                      fullWidth
                      disabled={!availableSubgroups.length}
                      sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) return 'Sve Podgrupe';
                        const sg = availableSubgroups.find(
                          (s) => s.label === selected
                        );
                        return sg ? sg.sr_RS : 'Sve podgrupe';
                      }}
                    >
                      <MenuItem value="">Sve podgrupe</MenuItem>
                      {availableSubgroups.map((sg) => (
                        <MenuItem key={sg.label} value={sg.label}>
                          {sg.sr_RS}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box>
                    <Typography gutterBottom>Cena</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        type="number"
                        placeholder="Od"
                        value={priceRange[0] || ''}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '8px'
                          }
                        }}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setPriceRange([value || undefined, priceRange[1]]);
                          setPriceOnRequest(false);
                        }}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        type="number"
                        placeholder="Do"
                        value={priceRange[1] || ''}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '8px'
                          }
                        }}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setPriceRange([priceRange[0], value || undefined]);
                          setPriceOnRequest(false);
                        }}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                      />
                      <Typography>Na stanju</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        checked={priceOnRequest}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPriceOnRequest(checked);
                          if (checked) {
                            setPriceRange([undefined, undefined]);
                          }
                        }}
                      />
                      <Typography>Cena na upit</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grow>
            )}
          </Box>

          {/* Products grid */}
          <Box className="w-full flex flex-col gap-4">
            <Box
              component={'section'}
              className={clsx('w-full', 'grid', 'gap-5', {
                'grid-cols-2': oldProducts?.length || data?.products?.length,
                'lgm:grid-cols-4': oldProducts?.length || data?.products?.length
              })}
              sx={{
                minHeight: 500
              }}
            >
              {isFetching ? (
                oldProducts.length ? (
                  oldProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        lg: 'repeat(4, 1fr)'
                      }
                    }}
                  >
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          height: 200,
                          width: '100%',
                          backgroundColor: theme.palette.grey[100],
                          borderRadius: 2
                        }}
                      />
                    ))}
                  </Box>
                )
              ) : data?.products.length ? (
                data?.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
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
                    <Typography variant="body1" gutterBottom>
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

            {/* Pagination */}
            {data?.pages && data.pages > 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 4,
                  flexWrap: 'wrap'
                }}
              >
                {Array.from({ length: data.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'contained' : 'outlined'}
                      onClick={() => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {p}
                    </Button>
                  )
                )}
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
