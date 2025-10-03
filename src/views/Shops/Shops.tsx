import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useAllUsers } from '@green-world/hooks/useAllUsers';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import clsx from 'clsx';
import { Store, MapPin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

// Helper funkcija za sortiranje po prioritetu
const sortUsersByPriority = (users: any[]) => {
  return users.slice().sort((a, b) => {
    const aHasAddress =
      a.address?.street || a.address?.city || a.address?.country;
    const bHasAddress =
      b.address?.street || b.address?.city || b.address?.country;
    if (aHasAddress && !bHasAddress) return -1;
    if (!aHasAddress && bHasAddress) return 1;

    const aHasImage = !!a.profileImage;
    const bHasImage = !!b.profileImage;
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;

    const aHasShopName = !!a.shopName;
    const bHasShopName = !!b.shopName;
    if (aHasShopName && !bHasShopName) return -1;
    if (!aHasShopName && bHasShopName) return 1;

    const aHasName = !!a.name;
    const bHasName = !!b.name;
    if (aHasName && !bHasName) return -1;
    if (!aHasName && bHasName) return 1;

    return 0;
  });
};

export const Shops = () => {
  const { data, isLoading } = useAllUsers();
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      const sorted = sortUsersByPriority(data);
      setFilteredUsers(sorted);
    }
  }, [data]);

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
      <MetaTags title={'Zeleni svet | Prodavnice | Green world'} />
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

        <Typography
          variant="h1"
          color="secondary"
          sx={{
            fontSize: '42px !important',
            textAlign: 'center',
            fontFamily: 'Ephesis, Roboto, sans-serif',
            marginY: 4
          }}
        >
          Prodavnice
        </Typography>

        {isLoading ? (
          <Box className="flex justify-center items-center min-h-[50vh]">
            <CircularProgress />
          </Box>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <Typography variant="h6" className="text-gray-600 text-center">
            Trenutno nema dostupnih prodavnica.
          </Typography>
        ) : (
          <Box
            className={clsx(
              'grid gap-6',
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            )}
          >
            {filteredUsers.map((user) => {
              const hasAddress =
                user?.address?.street ||
                user?.address?.city ||
                user?.address?.country;

              return (
                <Link
                  to={`/user/${user?._id}`}
                  key={user?._id}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    {/* Header cover */}
                    <Box className="relative w-full h-32 bg-gray-200 rounded-t-[16px] overflow-hidden">
                      {hasAddress ? (
                        <>
                          {loadingMap && (
                            <Box className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                              <CircularProgress size={24} />
                            </Box>
                          )}
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                              `${user?.address?.street || ''}, ${user?.address?.city || ''}, ${
                                user?.address?.country || ''
                              }`
                            )}&output=embed`}
                            onLoad={() => setLoadingMap(false)}
                          />
                        </>
                      ) : (
                        <Box className="flex items-center justify-center w-full h-full">
                          <MapPin />{' '}
                          <Typography variant="caption" color="text.disabled">
                            Lokacija jos uvek nije dodata
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexGrow: 1
                      }}
                    >
                      <Avatar
                        src={user?.profileImage}
                        alt={user?.name}
                        sx={{
                          width: 80,
                          height: 80,
                          mb: 2,
                          border: '3px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          mt: -6
                        }}
                      />
                      {(user?.shopName || user?.name) && (
                        <Typography
                          variant="h6"
                          className="flex items-center font-bold text-gray-800"
                          gutterBottom
                        >
                          <Store className="inline-block mr-1 h-5 w-5" />
                          {user?.shopName || user?.name}
                        </Typography>
                      )}
                      {user?.shopDescription && (
                        <Typography
                          variant="body2"
                          className="text-gray-600 line-clamp-3"
                        >
                          {user?.shopDescription}
                        </Typography>
                      )}

                      <Box
                        className="flex flex-col gap-1 mt-3 text-sm text-gray-700"
                        sx={{ flexGrow: 1 }}
                      >
                        {user?.address?.city && (
                          <Box className="flex items-center gap-1 justify-center">
                            <MapPin className="h-4 w-4" />
                            {user?.address?.city}, {user?.address?.country}
                          </Box>
                        )}
                        {user?.email && (
                          <Box className="flex items-center gap-1 justify-center">
                            <Mail className="h-4 w-4" />
                            {user?.email}
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};
