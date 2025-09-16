import { ProductCard } from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useUser } from '@green-world/hooks/useUser';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  TextField
} from '@mui/material';
import { Card } from 'antd';
import clsx from 'clsx';
import {
  Phone,
  Mail,
  Store,
  Globe,
  User,
  MapPin,
  X,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

export const UsersPage = () => {
  const { userId } = useParams();
  const { data, isLoading } = useUser(userId || '');
  const { data: sellerProducts, isLoading: sellerProductsLoading } =
    useAllUserProducts(userId);
  const [search, setSearch] = useState<string>('');
  const PLACEHOLDER_IMG =
    'https://placehold.co/176x112/266041/FFFFFF?text=Placeholder%20dok%20ne%20postavite%20proizvode';

  const handleClear = () => {
    setSearch('');
  };

  const filteredProducts = useMemo(() => {
    return sellerProducts?.filter((prod) => {
      const matchesName = prod.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDescription = prod.description
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesName || matchesDescription;
    });
  }, [sellerProducts, search]);

  if (!userId) return <></>;
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography variant="h6">Korisnik nije pronađen.</Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full bg-whiteLinen min-h-viewHeight">
      <Helmet>
        <title>Zeleni svet | {data?.shopName || data?.name}</title>
        <link
          rel="canonical"
          href={`https://www.zelenisvet.rs/user/${userId}`}
        />
      </Helmet>

      {/* HERO */}
      <Box className="relative w-full h-60 sm:h-80 bg-gray-200">
        {data?.address.street || data?.address.city || data?.address.country ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${data?.address.street}, ${data?.address.city}, ${data?.address.country}`
            )}&output=embed`}
          />
        ) : sellerProducts?.length ? (
          <Box className="w-full h-full flex flex-col justify-center gap-3 p-4 overflow-hidden">
            {/* Prvi red - pocinje od pocetka */}
            <Box className="flex gap-3">
              {sellerProducts
                .flatMap((p) => p.images)
                .slice(0, 8)
                .map((img, i) => (
                  <img
                    key={`row1-${i}`}
                    src={img || PLACEHOLDER_IMG}
                    alt="product"
                    className="h-28 w-44 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ))}
            </Box>

            {/* Drugi red - krece od polovine prve slike */}
            <Box className="flex gap-3 -translate-x-16">
              {sellerProducts
                .flatMap((p) => p.images)
                .slice(8, 16)
                .map((img, i) => (
                  <img
                    key={`row2-${i}`}
                    src={img || PLACEHOLDER_IMG}
                    alt="product"
                    className="h-28 w-44 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ))}
            </Box>

            {/* Treci red - opet ispocetka */}
            <Box className="flex gap-3">
              {sellerProducts
                .flatMap((p) => p.images)
                .slice(16, 24)
                .map((img, i) => (
                  <img
                    key={`row3-${i}`}
                    src={img || PLACEHOLDER_IMG}
                    alt="product"
                    className="h-28 w-44 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ))}
            </Box>
          </Box>
        ) : (
          // Fallback gradient
          <Box className="w-full h-full bg-gradient-to-r from-green-300 to-green-600" />
        )}

        <Avatar
          src={data?.profileImage}
          alt={data?.name}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            position: 'absolute',
            bottom: -60,
            left: 30
          }}
        />
      </Box>

      <Box
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4 sm:px-6 xl:px-0',
          'py-20 flex flex-col gap-7'
        )}
      >
        {/* USER INFO */}
        <Card className="shadow-md rounded-2xl p-6">
          <Typography variant="h5" className="flex items-center font-bold">
            <Store className="mr-1" /> {data?.shopName || data?.name}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600 mb-4">
            {data?.shopDescription}
          </Typography>

          <Box className="flex flex-col gap-2 text-gray-700">
            <Box className="flex items-center gap-2">
              <User /> {data?.name}
            </Box>
            <Box className="flex items-center gap-2">
              <Phone /> {data?.phone}
            </Box>
            <Box className="flex items-center gap-2">
              <Mail /> {data?.email}
            </Box>
            {data?.website && (
              <Box className="flex items-center gap-2">
                <Globe />
                <a
                  href={data?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {data?.website}
                </a>
              </Box>
            )}
            {data?.address && (
              <Box className="flex items-center gap-2">
                <MapPin /> {data?.address.street}, {data?.address.city},{' '}
                {data?.address.country}
              </Box>
            )}
          </Box>
        </Card>

        {/* PRODUCTS */}
        <Box>
          <Typography variant="h3" className="!text-gray-700" sx={{ mb: 1 }}>
            Proizvodi korisnika
          </Typography>
          <TextField
            aria-describedby="name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': {
                paddingRight: 0,
                '& input': {
                  padding: '8px'
                }
              },
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: (theme) =>
                `1px solid ${theme.palette.custom.forestGreen}`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              height: 40,
              mb: 4
            }}
            slotProps={{
              input: {
                endAdornment: search ? (
                  <IconButton onClick={handleClear}>
                    <X />
                  </IconButton>
                ) : (
                  <IconButton>
                    <Search />
                  </IconButton>
                )
              }
            }}
          />

          {sellerProductsLoading ? (
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Box className="w-full h-40 bg-gray-200 animate-pulse rounded-lg mb-2" />
                  <Box className="h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-1" />
                  <Box className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                </Card>
              ))}
            </Box>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <Box
              component={'section'}
              className={clsx(
                'w-full',
                'grid',
                'gap-5',
                'grid-cols-2',
                'sm:grid-cols-3',
                'lgm:grid-cols-4'
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" className="text-gray-500">
              Ovaj korisnik trenutno nema proizvoda.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
