import {
  AppBreadcrumbs,
  MetaTags,
  ProductCard,
  SocialMedia
} from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useUser } from '@green-world/hooks/useUser';
import {
  formatImageUrl,
  formatUrl,
  goToDestination
} from '@green-world/utils/helpers';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  TextField,
  useTheme,
  Button
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
import { useParams } from 'react-router';

export const ShopPage = () => {
  const { userId } = useParams();
  const { data, isLoading } = useUser(userId || '');
  const { data: sellerProducts, isLoading: sellerProductsLoading } =
    useAllUserProducts(userId);
  const [search, setSearch] = useState<string>('');
  const theme = useTheme();

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

  const metaObj = useMemo(
    () => ({
      title: data
        ? ['Zeleni svet', 'Korisnicki profil', data.shopName, data.name]
            .filter(Boolean)
            .join(' | ')
        : 'Zeleni svet | Korisnicki profil',
      description: data?.shopDescription || 'Korisnicki profil Zeleni Svet',
      image:
        formatImageUrl(data?.profileImage || '') ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [data]
  );

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

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Prodavnice', route: '/shops' },
    {
      label: data?.shopName || data?.name || 'Prodavnica',
      route: `/shop/${userId}`
    }
  ];

  return (
    <Box className="w-full bg-whiteLinen min-h-viewHeight">
      <MetaTags
        title={metaObj.title}
        description={metaObj.description}
        keywords={metaObj.description}
        image={metaObj.image}
      />

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />
      </div>

      <Box className="relative w-full h-60 sm:h-80 bg-gray-200">
        {data?.onlyOnline ? (
          <Box
            className="relative flex items-center justify-center w-full h-full p-6"
            sx={{
              background: 'linear-gradient(135deg, #f0fff4 0%, #e6f7ff 100%)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              Ovaj prodavac posluje samo online
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {data?.website && (
                <IconButton
                  component="a"
                  href={formatUrl(data?.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="website"
                  sx={{ padding: 0 }}
                >
                  <Globe
                    color={theme.palette.primary.main}
                    size={30}
                    strokeWidth={3}
                    className="override-size"
                  />
                </IconButton>
              )}
              <SocialMedia
                color={theme.palette.primary.main}
                socialMediaLinks={data?.socialMedia}
              />
            </Box>
          </Box>
        ) : data?.address?.street ||
          data?.address?.city ||
          data?.address?.country ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${data?.address?.street}, ${data?.address?.city}, ${data?.address?.country}`
            )}&output=embed`}
          />
        ) : sellerProducts?.length ? (
          <Box className="w-full h-full flex flex-col justify-center gap-3 p-4 overflow-hidden">
            <Box className="flex gap-3">
              {sellerProducts
                .flatMap((p) => p.images)
                .slice(0, 8)
                .map((img, i) => (
                  <img
                    key={`row1-${i}`}
                    src={formatImageUrl(img, 55) || PLACEHOLDER_IMG}
                    alt="product"
                    className="h-28 w-44 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ))}
            </Box>

            <Box className="flex gap-3 -translate-x-16">
              {sellerProducts
                .flatMap((p) => p.images)
                .slice(8, 16)
                .map((img, i) => (
                  <img
                    key={`row2-${i}`}
                    src={formatImageUrl(img, 55) || PLACEHOLDER_IMG}
                    alt="product"
                    className="h-28 w-44 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ))}
            </Box>

            <Box className="flex gap-3">
              {sellerProducts
                .flatMap((p) => p.images)
                .slice(16, 24)
                .map((img, i) => (
                  <img
                    key={`row3-${i}`}
                    src={formatImageUrl(img, 55) || PLACEHOLDER_IMG}
                    alt="product"
                    className="h-28 w-44 object-cover rounded-lg shadow-md flex-shrink-0"
                  />
                ))}
            </Box>
          </Box>
        ) : (
          <Box className="w-full h-full bg-gradient-to-r from-green-300 to-green-600" />
        )}

        <Avatar
          src={formatImageUrl(data?.profileImage, 55)}
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
        <Card className="shadow-md rounded-2xl">
          {(data?.shopName || data?.name) && (
            <Typography variant="h5" className="flex items-center font-bold">
              <Store className="mr-1" /> {data?.shopName || data?.name}
            </Typography>
          )}
          {data?.shopDescription && (
            <Typography variant="subtitle2" className="text-gray-600 mb-4">
              {data?.shopDescription}
            </Typography>
          )}
          <Box className="flex flex-col gap-2 text-gray-700 mt-2">
            {data?.name && (
              <Box
                className="flex items-center gap-2"
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '12px'
                  }
                }}
              >
                <User /> {data?.name}
              </Box>
            )}
            {data?.phone && (
              <Box
                className="flex items-center gap-2"
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '12px'
                  }
                }}
              >
                <Phone /> {data?.phone}
              </Box>
            )}
            {data?.email && (
              <Box
                className="flex items-center gap-2"
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '12px'
                  }
                }}
              >
                <Mail /> {data?.email}
              </Box>
            )}
            {data?.website && (
              <Box
                className="flex items-center gap-2"
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '12px'
                  }
                }}
              >
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
            {(data?.address?.street ||
              data?.address?.city ||
              data?.address?.country) && (
              <Box className="flex items-center gap-2">
                <MapPin />
                {[
                  data?.address?.street,
                  data?.address?.city,
                  data?.address?.country
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Box>
            )}
            {(data?.address?.street ||
              data?.address?.city ||
              data?.address?.country) && (
              <Button
                sx={{ flex: 1, maxWidth: 300, marginTop: 4 }}
                variant="outlined"
                href={goToDestination(
                  data?.address?.street,
                  data?.address?.city,
                  data?.address?.country
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Navigacija
              </Button>
            )}
            {(data?.socialMedia?.facebook ||
              data?.socialMedia?.instagram ||
              data?.socialMedia?.linkedin ||
              data?.socialMedia?.tiktok) && (
              <SocialMedia
                color={theme.palette.secondary.main}
                socialMediaLinks={data?.socialMedia}
                size="24px"
              />
            )}
          </Box>
        </Card>

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
              border: (theme) => `1px solid ${theme.palette.secondary.main}`,
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
