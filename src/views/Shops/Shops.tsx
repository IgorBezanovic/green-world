import {
  AppBreadcrumbs,
  MetaTags,
  ShopCard,
  StatCard
} from '@green-world/components';
import { useAllUsers } from '@green-world/hooks/useAllUsers';
import { useDebounce } from '@green-world/utils/helpers';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  InputBase
} from '@mui/material';
import clsx from 'clsx';
import {
  Store,
  MapPin,
  Package,
  Globe,
  SlidersHorizontal,
  Search,
  ArrowUpAZ
} from 'lucide-react';
import { useState } from 'react';

export const Shops = () => {
  const { data, isLoading } = useAllUsers();

  const totalProducts =
    data?.reduce((sum, u) => sum + (u?.numberOfProducts || 0), 0) ?? 0;

  const totalOnlineShops =
    data?.reduce((sum, u) => sum + (u?.onlyOnline ? 1 : 0), 0) ?? 0;

  const totalOfflineShops =
    data?.reduce((sum, u) => sum + (u?.onlyOnline ? 0 : 1), 0) ?? 0;

  type ShopFilter = 'all' | 'offline' | 'online';
  type SortType = 'none' | 'name-asc' | 'products-desc';

  const [filter, setFilter] = useState<ShopFilter>('all');
  const [sort, setSort] = useState<SortType>('none');
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const filteredShops = (data || [])
    .filter((user) => {
      const shopTitle = (user?.shopName || user?.name || '').toLowerCase();

      const matchesSearch = shopTitle.includes(debouncedSearch.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'online' && user?.onlyOnline) ||
        (filter === 'offline' && !user?.onlyOnline);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === 'name-asc') {
        const nameA = (a?.shopName || a?.name || '').trim();
        const nameB = (b?.shopName || b?.name || '').trim();

        if (!nameA && nameB) return 1;
        if (nameA && !nameB) return -1;
        if (!nameA && !nameB) return 0;

        return nameA.localeCompare(nameB, 'sr');
      }

      if (sort === 'products-desc') {
        return (b?.numberOfProducts || 0) - (a?.numberOfProducts || 0);
      }

      return 0;
    });

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Prodavnice', route: '/shops' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FDFFFB',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title="Zeleni svet | Prodavnice | Green world" />

      <Box
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4 sm:px-6 xl:px-0',
          'py-7 flex flex-col gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />

        <Box>
          <Typography
            variant="h1"
            color="secondary"
            sx={{
              fontSize: '42px !important',
              textAlign: 'left',
              fontFamily: 'Ephesis, Roboto, sans-serif'
            }}
          >
            Prodavnice
          </Typography>
          <Typography variant="body1">
            Pronađite pouzdane prodavce biljaka, sadnica i baštovanskog
            asortimana u vašoj blizini ili online.
          </Typography>
        </Box>

        {/* Stats */}
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
            '@media (min-width: 900px)': {
              gridTemplateColumns: 'repeat(4, 1fr)'
            }
          }}
        >
          <StatCard
            icon={Store}
            value={data?.length || 0}
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
            borderRadius: 3,
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
              placeholder="Pretraži prodavnice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              onClick={() => setFilter('all')}
              sx={{ padding: '0 6px' }}
            />
            <Chip
              icon={<Store size={16} />}
              label="Fizičke"
              clickable
              color={filter === 'offline' ? 'success' : 'default'}
              onClick={() => setFilter('offline')}
              sx={{ padding: '0 6px' }}
            />
            <Chip
              icon={<Globe size={16} />}
              label="Online"
              clickable
              color={filter === 'online' ? 'success' : 'default'}
              onClick={() => setFilter('online')}
              sx={{ padding: '0 6px' }}
            />

            <Chip
              icon={<ArrowUpAZ size={16} />}
              label="A–Z"
              clickable
              color={sort === 'name-asc' ? 'success' : 'default'}
              onClick={() =>
                setSort((prev) => (prev === 'name-asc' ? 'none' : 'name-asc'))
              }
              sx={{ padding: '0 6px' }}
            />
            <Chip
              icon={<Package size={16} />}
              label="Najviše proizvoda"
              clickable
              color={sort === 'products-desc' ? 'success' : 'default'}
              onClick={() =>
                setSort((prev) =>
                  prev === 'products-desc' ? 'none' : 'products-desc'
                )
              }
              sx={{ padding: '0 6px' }}
            />
          </Box>
        </Box>

        <Typography variant="body1" color="common.black">
          Prikazano {filteredShops.length} od {data?.length || 0} prodavnica
        </Typography>

        {isLoading ? (
          <Box className="flex justify-center items-center min-h-[50vh]">
            <CircularProgress />
          </Box>
        ) : !data || data.length === 0 ? (
          <Typography variant="h6" className="text-gray-600 text-center">
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
            {filteredShops.map((user) => (
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
      </Box>
    </Box>
  );
};
