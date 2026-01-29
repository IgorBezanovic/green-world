import { ProductCard, MetaTags, AppBreadcrumbs } from '@green-world/components';
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
  CircularProgress,
  Pagination
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Grow from '@mui/material/Grow';
import clsx from 'clsx';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';

export const Products = () => {
  const { category = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const parseNumberParam = (value: string | null) => {
    if (value === null || value === '') return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  };

  const urlState = useMemo(() => {
    const urlSearch = searchParams.get('title') ?? '';
    const urlGroupFromParams = searchParams.get('group') ?? '';
    const urlGroup = category || urlGroupFromParams;
    const urlSubGroup = searchParams.get('subGroup') ?? '';
    const urlPriceOnRequest = searchParams.get('priceOnRequest') === 'true';
    const urlMinPrice = urlPriceOnRequest
      ? undefined
      : parseNumberParam(searchParams.get('minPrice'));
    const urlMaxPrice = urlPriceOnRequest
      ? undefined
      : parseNumberParam(searchParams.get('maxPrice'));
    const urlInStock = searchParams.get('inStock') === 'true';
    const urlPageRaw = Number(searchParams.get('page') || 1);
    const urlPage =
      Number.isFinite(urlPageRaw) && urlPageRaw > 0 ? urlPageRaw : 1;

    return {
      search: urlSearch,
      group: urlGroup,
      subGroup: urlSubGroup,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      inStock: urlInStock,
      priceOnRequest: urlPriceOnRequest,
      page: urlPage
    };
  }, [category, searchParams]);

  const categoryName =
    category && homeCategories.find((item) => item.slug === category)?.text;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [search, setSearch] = useState(urlState.search);
  const [selectedGroup, setSelectedGroup] = useState(urlState.group);
  const [selectedSubgroup, setSelectedSubgroup] = useState(urlState.subGroup);
  const [priceRange, setPriceRange] = useState<
    [number | undefined, number | undefined]
  >([urlState.minPrice, urlState.maxPrice]);
  const [inStockOnly, setInStockOnly] = useState(urlState.inStock);
  const [priceOnRequest, setPriceOnRequest] = useState(urlState.priceOnRequest);
  const [page, setPage] = useState(urlState.page);

  const [oldProducts, setOldProducts] = useState<ProductPreview[]>([]);
  const [filtersToSend, setFiltersToSend] = useState({});
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, isFetching, refetch } = useAllProducts(filtersToSend);

  useEffect(() => {
    if (search !== urlState.search) setSearch(urlState.search);
    if (selectedGroup !== urlState.group) setSelectedGroup(urlState.group);
    if (selectedSubgroup !== urlState.subGroup) {
      setSelectedSubgroup(urlState.subGroup);
    }
    if (
      priceRange[0] !== urlState.minPrice ||
      priceRange[1] !== urlState.maxPrice
    ) {
      setPriceRange([urlState.minPrice, urlState.maxPrice]);
    }
    if (inStockOnly !== urlState.inStock) setInStockOnly(urlState.inStock);
    if (priceOnRequest !== urlState.priceOnRequest) {
      setPriceOnRequest(urlState.priceOnRequest);
    }
    if (page !== urlState.page) setPage(urlState.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  useEffect(() => {
    const next = new URLSearchParams();

    if (search) next.set('title', search);
    if (selectedGroup) next.set('group', selectedGroup);
    if (selectedSubgroup) next.set('subGroup', selectedSubgroup);
    if (priceRange[0] !== undefined) {
      next.set('minPrice', String(priceRange[0]));
    }
    if (priceRange[1] !== undefined) {
      next.set('maxPrice', String(priceRange[1]));
    }
    if (inStockOnly) next.set('inStock', 'true');
    if (priceOnRequest) next.set('priceOnRequest', 'true');
    if (page > 1) next.set('page', String(page));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [
    search,
    selectedGroup,
    selectedSubgroup,
    priceRange,
    inStockOnly,
    priceOnRequest,
    page,
    searchParams,
    setSearchParams
  ]);

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

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Proizvodi', route: '/search' }
  ];

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Pretraga proizvoda | Svi proizvodi'} />
      <Box
        className={clsx(
          'xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-7 flex flex-col gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />
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

          <Box className="w-full flex flex-col gap-4">
            <Box
              component={'section'}
              sx={{
                width: '100%',
                minHeight: 500,
                display: 'grid',
                gap: '20px',
                gridTemplateColumns:
                  oldProducts?.length || data?.products?.length
                    ? 'repeat(1, 1fr)'
                    : 'none',
                [theme.breakpoints.up('xs')]: {
                  gridTemplateColumns:
                    oldProducts?.length || data?.products?.length
                      ? 'repeat(2, 1fr)'
                      : 'none'
                },
                [theme.breakpoints.up('lgm')]: {
                  gridTemplateColumns:
                    oldProducts?.length || data?.products?.length
                      ? 'repeat(4, 1fr)'
                      : 'none'
                }
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
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      [theme.breakpoints.up('xs')]: {
                        gridTemplateColumns: 'repeat(2, 1fr)'
                      },
                      [theme.breakpoints.up('md')]: {
                        gridTemplateColumns: 'repeat(4, 1fr)'
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

            {data?.pages && data.pages > 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4
                }}
              >
                <Pagination
                  count={data.pages}
                  page={page}
                  onChange={(_, value) => {
                    setPage(value);
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('page', String(value));
                      return next;
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  size={isMobile ? 'medium' : 'large'}
                  siblingCount={1}
                  boundaryCount={isMobile ? 1 : 2}
                />
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
