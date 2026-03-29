import {
  ProductCard,
  MetaTags,
  AppBreadcrumbs,
  ItemsHero,
  ListingContentLayout,
  ListingStateSection,
  SharedPagination
} from '@green-world/components';
import {
  ProductFiltersParams,
  useAllProducts
} from '@green-world/hooks/useAllProducts';
import { homeCategories, subGroups } from '@green-world/utils/constants';
import {
  getLocalizedGroupLabel,
  getLocalizedSubGroupLabel,
  useDebounce
} from '@green-world/utils/helpers';
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
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';

export const Products = () => {
  const { t, i18n } = useTranslation();
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lgm'));
  const [search, setSearch] = useState(urlState.search);
  const [heroLocation, setHeroLocation] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(urlState.group);
  const [selectedSubgroup, setSelectedSubgroup] = useState(urlState.subGroup);
  const [priceRange, setPriceRange] = useState<
    [number | undefined, number | undefined]
  >([urlState.minPrice, urlState.maxPrice]);
  const [inStockOnly, setInStockOnly] = useState(urlState.inStock);
  const [priceOnRequest, setPriceOnRequest] = useState(urlState.priceOnRequest);
  const [page, setPage] = useState(urlState.page);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filtersToSend = useMemo<ProductFiltersParams>(
    () => ({
      title: search.length >= 3 ? search : undefined,
      group: selectedGroup || undefined,
      subGroup: selectedSubgroup || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      priceOnRequest: priceOnRequest || undefined,
      inStock: inStockOnly || undefined,
      page
    }),
    [
      search,
      selectedGroup,
      selectedSubgroup,
      priceRange,
      priceOnRequest,
      inStockOnly,
      page
    ]
  );

  const debouncedFilters = useDebounce(filtersToSend, 300);

  const { data, isFetching } = useAllProducts(debouncedFilters);

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

  const availableSubgroups = useMemo(() => {
    if (!selectedGroup) {
      // Flatten svih subgrupa u jednu listu
      return Object.values(subGroups).flat();
    }
    return subGroups[selectedGroup as keyof typeof subGroups] || [];
  }, [selectedGroup]);

  const selectedGroupKey = selectedGroup
    ? (selectedGroup as keyof typeof subGroups)
    : undefined;

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.products'), route: '/search' }
  ];
  const products = data?.data || [];
  const productsMeta = data?.meta;
  const hasProducts = Boolean(products.length);

  const resetFilters = () => {
    setSearch('');
    setSelectedGroup(category || '');
    setSelectedSubgroup('');
    setPriceRange([undefined, undefined]);
    setInStockOnly(false);
    setPriceOnRequest(false);
    setPage(1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={t('productsView.metaTitle')} />

      <ItemsHero
        kicker={t('productsView.hero.kicker')}
        title={t('productsView.hero.title')}
        subtitle={t('productsView.hero.subtitle')}
        searchPlaceholder={t('productsView.hero.searchPlaceholder')}
        locationPlaceholder={t('productsView.hero.locationPlaceholder')}
        searchValue={search}
        locationValue={heroLocation}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onLocationChange={setHeroLocation}
      />

      <ListingContentLayout
        breadcrumbs={<AppBreadcrumbs pages={pages} />}
        isTablet={isTablet}
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
        openFiltersLabel={t('productsView.openFilters')}
        closeFiltersLabel={t('productsView.closeFilters')}
        summary={
          <Typography variant="h6">
            {productsMeta?.totalItems ?? products.length}{' '}
            {t('productsView.resultsFound')}
          </Typography>
        }
        filters={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
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
                {t('productsView.openFilters')}
              </Typography>
              {isFetching && (
                <Typography
                  variant="overline"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CircularProgress size={16} thickness={4} />
                  {t('productsView.loading')}
                </Typography>
              )}
            </Box>

            <Box>
              <InputLabel
                sx={{ color: 'text.primary' }}
                htmlFor="product-title"
              >
                {t('productsView.productName')}
              </InputLabel>
              <TextField
                name="product-title"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t('productsView.productName')}
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
                        onClick={() => {
                          setSearch('');
                          setPage(1);
                        }}
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
                <InputLabel sx={{ color: 'text.primary' }} id="group">
                  {t('productsView.group')}
                </InputLabel>
                <Select
                  labelId="group"
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    setPage(1);
                  }}
                  fullWidth
                  sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) return t('productsView.allGroups');
                    return getLocalizedGroupLabel(selected, i18n.language);
                  }}
                >
                  <MenuItem value="">{t('productsView.allGroups')}</MenuItem>
                  {homeCategories?.map((cat) => (
                    <MenuItem key={cat.slug} value={cat.slug}>
                      {getLocalizedGroupLabel(cat.slug, i18n.language)}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}
            <Box>
              <InputLabel sx={{ color: 'text.primary' }} id="subGroup">
                {t('productsView.subgroup')}
              </InputLabel>
              <Select
                labelId="subGroup"
                value={selectedSubgroup}
                onChange={(e) => {
                  setSelectedSubgroup(e.target.value);
                  setPage(1);
                }}
                fullWidth
                disabled={!availableSubgroups.length}
                sx={{ '& .MuiInputBase-input': { padding: '8px' } }}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return t('productsView.allSubgroups');
                  return getLocalizedSubGroupLabel(
                    selectedGroupKey,
                    selected,
                    i18n.language
                  );
                }}
              >
                <MenuItem value="">{t('productsView.allSubgroups')}</MenuItem>
                {availableSubgroups?.map((sg) => (
                  <MenuItem key={sg.label} value={sg.label}>
                    {getLocalizedSubGroupLabel(
                      selectedGroupKey,
                      sg.label,
                      i18n.language
                    )}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Typography gutterBottom>{t('productsView.price')}</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="number"
                  placeholder={t('productsView.from')}
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
                    setPage(1);
                  }}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0 } }}
                />
                <TextField
                  type="number"
                  placeholder={t('productsView.to')}
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
                    setPage(1);
                  }}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Box>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setPage(1);
                  }}
                />
                <Typography>{t('productsView.inStock')}</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                  checked={priceOnRequest}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setPriceOnRequest(checked);
                    setPage(1);
                    if (checked) {
                      setPriceRange([undefined, undefined]);
                    }
                  }}
                />
                <Typography>{t('productsView.priceOnRequest')}</Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={resetFilters}
              sx={{ textTransform: 'none' }}
            >
              {t('productsView.resetFilters')}
            </Button>
          </Box>
        }
        content={
          <ListingStateSection
            status={
              isFetching && !products.length
                ? 'loading'
                : products.length
                  ? 'ready'
                  : 'empty'
            }
            emptyTitle={t('productsView.noProductsFound')}
            emptyDescription={
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  px: 2,
                  mt: 1
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
                  <Typography variant="body1" gutterBottom>
                    {t('productsView.chooseDifferentFilters')}
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
            }
            readyContent={
              <Box
                component="section"
                sx={{
                  width: '100%',
                  minHeight: 500,
                  display: 'grid',
                  gap: '20px',
                  gridTemplateColumns: hasProducts ? 'repeat(1, 1fr)' : 'none',
                  [theme.breakpoints.up('xs')]: {
                    gridTemplateColumns: hasProducts ? 'repeat(2, 1fr)' : 'none'
                  },
                  [theme.breakpoints.up('md')]: {
                    gridTemplateColumns: hasProducts ? 'repeat(3, 1fr)' : 'none'
                  },
                  [theme.breakpoints.up('lgm')]: {
                    gridTemplateColumns: hasProducts ? 'repeat(4, 1fr)' : 'none'
                  }
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </Box>
            }
          />
        }
        pagination={
          <SharedPagination
            totalPages={productsMeta?.pages}
            currentPage={productsMeta?.currentPage ?? page}
            isMobile={isMobile}
            onPageChange={(value) => {
              setPage(value);
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set('page', String(value));
                return next;
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            marginTop={0}
          />
        }
      />
      {/* <FeaturedProducts /> */}
      {/* <FeaturedShops /> */}
    </Box>
  );
};
