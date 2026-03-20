import {
  AppBreadcrumbs,
  MetaTags,
  ProductCard,
  SendMessageDialog,
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
  Card,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  useTheme,
  Button,
  InputBase,
  Chip,
  alpha
} from '@mui/material';
import {
  Phone,
  Mail,
  Globe,
  User,
  MapPin,
  X,
  Search,
  MessageCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export const ShopPage = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { data, isLoading } = useUser(userId || '');
  const { data: sellerProducts } = useAllUserProducts(userId);
  const [search, setSearch] = useState<string>('');
  const theme = useTheme();

  const handleClear = () => {
    setSearch('');
  };
  const [openSendMessageDialog, setOpenSendMessageDialog] = useState(false);

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
        ? [
            'Zeleni svet',
            t('breadcrumbs.userProfile'),
            data.shopName,
            data.name
          ]
            .filter(Boolean)
            .join(' | ')
        : `Zeleni svet | ${t('breadcrumbs.userProfile')}`,
      description:
        data?.shopDescription || t('shopPage.meta.descriptionFallback'),
      image:
        formatImageUrl(data?.profileImage || '') ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [data, t]
  );

  if (!userId) return <></>;
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography variant="h6">{t('shopPage.userNotFound')}</Typography>
      </Box>
    );
  }

  const formatWebsiteDisplay = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      return decoded.replace(/^https?:\/\//, '').replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('navbar.shops'), route: '/shops' },
    {
      label: data?.shopName || data?.name || t('shopPage.shopFallback'),
      route: `/shop/${userId}`
    }
  ];

  const location =
    data?.address?.street && data?.address?.city && data?.address?.country
      ? `${data.address.street}, ${data.address.city}, ${data.address.country}`
      : 'Serbia';

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title={metaObj.title}
        description={metaObj.description}
        keywords={metaObj.description}
        image={metaObj.image}
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
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
      </Box>

      {/* HERO */}
      <Box
        sx={(theme) => ({
          maxWidth: 1400,
          mx: 'auto',
          position: 'relative',
          px: '16px',
          [theme.breakpoints.up('sm')]: {
            px: '24px'
          }
        })}
      >
        {data?.onlyOnline && (
          <Chip
            size="medium"
            icon={<Globe />}
            label={t('shopPage.onlineOnlyChip')}
            color="success"
            variant="outlined"
            sx={{
              position: 'absolute',
              top: 16,
              left: 40,
              paddingX: '4px',
              color: 'common.black'
            }}
          />
        )}
        <Box
          sx={{
            width: '100%',
            height: 280,
            borderRadius: 2,
            overflow: 'hidden',
            background:
              'linear-gradient(135deg, #cfe3d5 0%, #c3d9c9 50%, #b8cfbe 100%)'
          }}
        >
          {data?.onlyOnline ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SocialMedia
                color={theme.palette.primary.main}
                socialMediaLinks={data?.socialMedia}
              />
            </Box>
          ) : (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
            />
          )}
        </Box>

        {/* Avatar */}
        <Avatar
          src={formatImageUrl(data?.profileImage, 120)}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            position: 'absolute',
            bottom: -60,
            left: 40
          }}
        />
      </Box>

      {/* SHOP HEADER */}
      <Box
        sx={(theme) => ({
          maxWidth: 1360,
          p: '16px',
          mx: 'auto',
          mt: 10,
          [theme.breakpoints.up('xl')]: {
            p: '0px'
          }
        })}
      >
        <Box
          sx={{
            p: '24px',
            backgroundColor: alpha(theme.palette.success.light, 0.8),
            borderRadius: 2
          }}
        >
          <Typography variant="h3">{data?.shopName || data?.name}</Typography>

          {data?.shopDescription && (
            <Typography
              variant="h5"
              sx={{
                fontStyle: 'italic',
                color: 'text.main',
                mt: 1
              }}
            >
              {data.shopDescription}
            </Typography>
          )}
        </Box>
      </Box>

      {/* MAIN GRID */}
      <Box
        sx={(theme) => ({
          maxWidth: 1400,
          mx: 'auto',
          px: '16px',
          mt: 4,
          display: 'grid',
          gap: 4,
          pb: 8,
          gridTemplateColumns: '1fr',
          [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: '340px 1fr'
          }
        })}
      >
        {/* LEFT SIDEBAR */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* CONTACT CARD */}
          <Card>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2
              }}
            >
              {data?.name && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    minWidth: 0
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <User style={{ width: '22px', height: '22px' }} />
                  </Box>
                  <Typography>{data.name}</Typography>
                </Box>
              )}

              {data?.email && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    minWidth: 0
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <Mail style={{ width: '22px', height: '22px' }} />
                  </Box>

                  <Typography
                    sx={{
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {data.email}
                  </Typography>
                </Box>
              )}

              {data?.phone && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <Phone style={{ width: '22px', height: '22px' }} />
                  </Box>

                  <Typography>{data.phone}</Typography>
                </Box>
              )}

              {data?.website && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    minWidth: 0
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <Globe style={{ width: '22px', height: '22px' }} />
                  </Box>

                  <Box
                    component="a"
                    href={formatUrl(data.website)}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',

                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',

                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {formatWebsiteDisplay(data.website)}
                  </Box>
                </Box>
              )}

              {(data?.address?.street || data?.address?.city) && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <MapPin style={{ width: '22px', height: '22px' }} />
                  </Box>
                  <Typography>
                    {[
                      data?.address?.street,
                      data?.address?.city,
                      data?.address?.country
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </Typography>
                </Box>
              )}

              {/* CONTACT BUTTON */}
              <Button
                variant="contained"
                startIcon={<MessageCircle style={{ color: 'white' }} />}
                sx={{
                  mt: 2,
                  py: 1.4,
                  textTransform: 'none',
                  fontWeight: 600
                }}
                onClick={() => setOpenSendMessageDialog(true)}
              >
                {t('shopPage.contactSeller')}
              </Button>

              {!data?.onlyOnline && (
                <Button
                  variant="outlined"
                  href={goToDestination(
                    data?.address?.street,
                    data?.address?.city,
                    data?.address?.country
                  )}
                  target="_blank"
                  sx={{
                    py: 1.4,
                    textTransform: 'none'
                  }}
                >
                  {t('userInfo.googleNavigation')}
                </Button>
              )}

              <SocialMedia
                color={theme.palette.secondary.main}
                socialMediaLinks={data?.socialMedia}
              />
            </Box>
          </Card>

          {/* WORKING TIME */}
          {data?.workingTime && (
            <Card>
              <Box>
                <Typography fontWeight={600} mb={2}>
                  {t('shopPage.workingHours')}
                </Typography>

                {Object.entries(data.workingTime).map(([day, value]) => (
                  <Box
                    key={day}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 0.6
                    }}
                  >
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {t(`editUserData.days.${day}`, { defaultValue: day })}
                    </Typography>

                    <Typography color="text.secondary">
                      {value.isClosed
                        ? t('shopPage.closed')
                        : `${value.open} - ${value.close}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          )}
        </Box>

        {/* PRODUCTS */}
        <Box>
          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Typography variant="h4">{t('navbar.products')}</Typography>

            <Typography color="text.secondary">
              {t('shopPage.productsCount', {
                count: filteredProducts?.length || 0
              })}
            </Typography>
          </Box>

          {/* SEARCH */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 3
            }}
          >
            <Search />

            <InputBase
              placeholder={t('shopPage.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />

            {search && (
              <IconButton onClick={handleClear}>
                <X size={16} />
              </IconButton>
            )}
          </Box>

          {/* PRODUCTS GRID */}
          <Box
            sx={(theme) => ({
              display: 'grid',
              gap: 3,
              gridTemplateColumns: 'repeat(1,1fr)',
              [theme.breakpoints.up('sm')]: {
                gridTemplateColumns: 'repeat(2,1fr)'
              },
              [theme.breakpoints.up('lg')]: {
                gridTemplateColumns: 'repeat(3,1fr)'
              },
              [theme.breakpoints.up('xl')]: {
                gridTemplateColumns: 'repeat(4,1fr)'
              }
            })}
          >
            {filteredProducts?.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </Box>
        </Box>
      </Box>
      <SendMessageDialog
        open={openSendMessageDialog}
        onClose={() => setOpenSendMessageDialog(false)}
        userId={userId || ''}
      />
    </Box>
  );
};
