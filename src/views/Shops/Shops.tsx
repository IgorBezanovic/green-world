'use client';

import {
  AppBreadcrumbs,
  ItemsHero,
  MetaTags,
  SharedPagination,
  ShopCard,
  StatCard
} from '@green-world/components';
import { useAllUsers } from '@green-world/hooks/useAllUsers';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  InputBase,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Store,
  MapPin,
  Package,
  Globe,
  SlidersHorizontal,
  Search,
  ArrowUpAZ
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

export const Shops = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  type ShopFilter = 'all' | 'offline' | 'online';
  type SortType = 'none' | 'name-asc' | 'products-desc';

  const parsePage = (value: string | null) => {
    const parsed = Number(value || 1);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  };

  const urlState = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      filter: (searchParams.get('filter') as ShopFilter | null) ?? 'all',
      sort: (searchParams.get('sort') as SortType | null) ?? 'none',
      page: parsePage(searchParams.get('page'))
    }),
    [searchParams]
  );

  const [filter, setFilter] = useState<ShopFilter>(urlState.filter);
  const [sort, setSort] = useState<SortType>(urlState.sort);
  const [search, setSearch] = useState(urlState.search);
  const [page, setPage] = useState(urlState.page);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data: usersResponse,
    isLoading,
    isError
  } = useAllUsers({
    search: debouncedSearch || undefined,
    filter,
    sort,
    page
  });

  const data = usersResponse?.data || [];
  const usersMeta = usersResponse?.meta;

  useEffect(() => {
    if (search !== urlState.search) setSearch(urlState.search);
    if (filter !== urlState.filter) setFilter(urlState.filter);
    if (sort !== urlState.sort) setSort(urlState.sort);
    if (page !== urlState.page) setPage(urlState.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  useEffect(() => {
    const next = new URLSearchParams();

    if (search) next.set('search', search);
    if (filter !== 'all') next.set('filter', filter);
    if (sort !== 'none') next.set('sort', sort);
    if (page > 1) next.set('page', String(page));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [filter, page, search, searchParams, setSearchParams, sort]);

  const totalProducts =
    Number(usersMeta?.totalProducts ?? usersResponse?.extras?.totalProducts) ||
    data.reduce((sum, u) => sum + (u?.numberOfProducts || 0), 0) ||
    0;

  const totalOnlineShops =
    Number(
      usersMeta?.totalOnlineShops ?? usersResponse?.extras?.totalOnlineShops
    ) ||
    data.reduce((sum, u) => sum + (u?.onlyOnline ? 1 : 0), 0) ||
    0;

  const totalOfflineShops =
    Number(
      usersMeta?.totalOfflineShops ?? usersResponse?.extras?.totalOfflineShops
    ) ||
    data.reduce((sum, u) => sum + (u?.onlyOnline ? 0 : 1), 0) ||
    0;

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.shops'), route: '/shops' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title={t('seo.shops.title')}
        description={t('seo.shops.description')}
        keywords={t('seo.shops.keywords')}
      />

      <ItemsHero
        kicker={t('shopsView.hero.kicker')}
        title={t('shopsView.hero.title')}
        subtitle={t('shopsView.hero.subtitle')}
        searchPlaceholder={t('shopsView.hero.searchPlaceholder')}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          gap: 4,
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          display: 'flex',
          flexDirection: 'column'
        })}
      >
        <AppBreadcrumbs pages={pages} />

        {/* Stats */}
        <Box
          component="section"
          sx={(theme) => ({
            display: 'grid',
            gap: 3,
            maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
            gridTemplateColumns: 'repeat(1, 1fr)',
            '@media (min-width: 600px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            '@media (min-width: 900px)': {
              gridTemplateColumns: 'repeat(4, 1fr)'
            },
            [theme.breakpoints.down('md')]: {
              display: 'none'
            }
          })}
        >
          <StatCard
            icon={Store}
            value={usersMeta?.totalItems || 0}
            title="Prodavnica"
            subtitle="Aktivnih prodavaca"
          />
          <StatCard
            icon={Package}
            value={totalProducts}
            title="Proizvoda"
            subtitle="Dostupno na sajtu"
          />
          <StatCard
            icon={MapPin}
            value={totalOfflineShops}
            title="Fizičkih lokacija"
            subtitle="Možete posetiti"
          />
          <StatCard
            icon={Globe}
            value={totalOnlineShops}
            title="Online prodavnica"
            subtitle="Dostava širom Srbije i regiona"
          />
        </Box>

        {/* Filters */}
        <Box
          sx={(theme) => ({
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              alignItems: 'stretch'
            },
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
            backgroundColor: '#F9FCF7'
          })}
        >
          {/* Search */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              backgroundColor: 'white'
            }}
          >
            <Search size={18} />
            <InputBase
              placeholder={t('shopsView.hero.searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              sx={{ width: '100%' }}
            />
          </Box>

          {/* Type filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<SlidersHorizontal size={16} />}
              label="Sve"
              clickable
              color={filter === 'all' ? 'success' : 'default'}
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
              sx={{ padding: '0 6px' }}
            />
            <Chip
              icon={<Store size={16} />}
              label="Fizičke"
              clickable
              color={filter === 'offline' ? 'success' : 'default'}
              onClick={() => {
                setFilter('offline');
                setPage(1);
              }}
              sx={{ padding: '0 6px' }}
            />
            <Chip
              icon={<Globe size={16} />}
              label="Online"
              clickable
              color={filter === 'online' ? 'success' : 'default'}
              onClick={() => {
                setFilter('online');
                setPage(1);
              }}
              sx={{ padding: '0 6px' }}
            />

            <Chip
              icon={<ArrowUpAZ size={16} />}
              label="A–Z"
              clickable
              color={sort === 'name-asc' ? 'success' : 'default'}
              onClick={() => {
                setSort((prev) => (prev === 'name-asc' ? 'none' : 'name-asc'));
                setPage(1);
              }}
              sx={{ padding: '0 6px' }}
            />
            <Chip
              icon={<Package size={16} />}
              label="Najviše proizvoda"
              clickable
              color={sort === 'products-desc' ? 'success' : 'default'}
              onClick={() => {
                setSort((prev) =>
                  prev === 'products-desc' ? 'none' : 'products-desc'
                );
                setPage(1);
              }}
              sx={{ padding: '0 6px' }}
            />
          </Box>
        </Box>
        {/* <FeaturedShops /> */}
        <Typography variant="body1" color="common.black">
          {t('shopsView.showing', {
            shown: data.length,
            total: usersMeta?.totalItems || 0
          })}
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh'
            }}
          >
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ color: 'grey.600', textAlign: 'center' }}
          >
            Trenutno nema dostupnih prodavnica.
          </Typography>
        ) : (
          <Box
            component="section"
            sx={{
              display: 'grid',
              gap: 3,
              maxWidth: '1400px',
              width: '100%',
              mx: 'auto',
              gridTemplateColumns: 'repeat(1, 1fr)',
              '@media (min-width: 600px)': {
                gridTemplateColumns: 'repeat(2, 1fr)'
              },
              '@media (min-width: 1000px)': {
                gridTemplateColumns: 'repeat(3, 1fr)'
              },
              '@media (min-width: 1200px)': {
                gridTemplateColumns: 'repeat(4, 1fr)'
              }
            }}
          >
            {data.map((user) => (
              <ShopCard
                key={user._id}
                id={user._id!}
                name={user.name}
                shopName={user.shopName}
                description={user.shopDescription}
                email={user.email}
                profileImage={user.profileImage}
                onlyOnline={user.onlyOnline}
                numberOfProducts={user.numberOfProducts}
                address={user.address}
              />
            ))}
          </Box>
        )}

        <SharedPagination
          totalPages={usersMeta?.pages}
          currentPage={usersMeta?.currentPage ?? page}
          isLoading={isLoading}
          isError={isError}
          isMobile={isMobile}
          onPageChange={(value) => {
            setPage(value);
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (value > 1) {
                next.set('page', String(value));
              } else {
                next.delete('page');
              }
              return next;
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        {/* <FeaturedShopsBanner /> */}
      </Box>
    </Box>
  );
};
