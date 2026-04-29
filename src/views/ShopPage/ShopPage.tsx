'use client';

import {
  AIVerificationBadge,
  AppBreadcrumbs,
  PageCenteredState,
  PageContent,
  PageLoader,
  ProductCard,
  SendMessageDialog,
  ServiceListingCard,
  SocialMedia,
  WorkingHoursCard
} from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useAllUserServices } from '@green-world/hooks/useAllUserServices';
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
  IconButton,
  useTheme,
  Button,
  InputBase,
  Chip,
  alpha,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Phone,
  Mail,
  Globe,
  User,
  MapPin,
  X,
  Search,
  MessageCircle,
  Package,
  Wrench
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export const ShopPage = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { data, isLoading } = useUser(userId || '');
  const sellerId = data?._id || '';
  const { data: sellerProducts } = useAllUserProducts(sellerId);
  const { data: sellerServices } = useAllUserServices(sellerId);
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>(
    'products'
  );
  const theme = useTheme();

  const hasProducts = (sellerProducts?.length ?? 0) > 0;
  const hasServices = (sellerServices?.length ?? 0) > 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const showSwitch = mounted && hasProducts && hasServices;

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

  const filteredServices = useMemo(() => {
    return sellerServices?.filter((svc) => {
      const matchesTitle = svc.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesTitle;
    });
  }, [sellerServices, search]);

  // When only services exist, default to services tab
  const resolvedTab: 'products' | 'services' =
    !hasProducts && hasServices ? 'services' : activeTab;

  if (!userId) return <></>;
  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return (
      <PageCenteredState>
        <Typography variant="h6">{t('shopPage.userNotFound')}</Typography>
      </PageCenteredState>
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
    <PageContent>
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
            sx={(theme) => ({
              position: 'absolute',
              top: 16,
              left: 40,
              right: 40,
              paddingX: '4px',
              color: 'common.black',
              [theme.breakpoints.up('sm')]: {
                left: 40,
                right: 'auto',
                maxWidth: 'none'
              }
            })}
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
          src={formatImageUrl(data?.profileImage, 55)}
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

          <Box sx={{ mb: 1.5 }}>
            <AIVerificationBadge
              verifiedDone={data?.verifiedDone}
              verified={data?.verified}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontStyle: 'italic',
              color: 'text.main',
              mt: 1
            }}
          >
            {data?.shopDescription?.trim() || t('common.noDescription')}
          </Typography>
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
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
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
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
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
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
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
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
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
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
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
                  textTransform: 'none'
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
            <WorkingHoursCard workingTime={data.workingTime} />
          )}
        </Box>

        {/* CONTENT */}
        <Box>
          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {showSwitch ? (
                <ToggleButtonGroup
                  value={resolvedTab === activeTab ? activeTab : resolvedTab}
                  exclusive
                  onChange={(_, val) => {
                    if (val) setActiveTab(val);
                  }}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 2.5,
                      py: 1,
                      gap: 1,
                      borderRadius: '24px !important',
                      border: '1px solid',
                      borderColor: 'divider',
                      textTransform: 'none',
                      '&.Mui-selected': {
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        borderColor: 'secondary.main',
                        '&:hover': {
                          backgroundColor: 'secondary.dark'
                        }
                      }
                    },
                    '& .MuiToggleButtonGroup-grouped': {
                      '&:not(:last-of-type)': { mr: 1, borderRight: 'inherit' },
                      '&:not(:first-of-type)': { borderLeft: 'inherit' }
                    }
                  }}
                >
                  <ToggleButton value="products">
                    <Package
                      size={16}
                      color={resolvedTab === 'products' ? 'white' : '#266041'}
                    />
                    {t('navbar.products')}
                  </ToggleButton>
                  <ToggleButton value="services">
                    <Wrench
                      size={16}
                      color={resolvedTab === 'services' ? 'white' : '#266041'}
                    />
                    {t('navbar.services')}
                  </ToggleButton>
                </ToggleButtonGroup>
              ) : (
                <Typography variant="h4">
                  {resolvedTab === 'services'
                    ? t('navbar.services')
                    : t('navbar.products')}
                </Typography>
              )}
            </Box>

            <Typography color="text.secondary">
              {resolvedTab === 'services'
                ? t('shopPage.servicesCount', {
                    count: filteredServices?.length || 0
                  })
                : t('shopPage.productsCount', {
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

          {/* GRID */}
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
            {resolvedTab === 'services'
              ? filteredServices?.map((service) => (
                  <ServiceListingCard service={service} key={service._id} />
                ))
              : filteredProducts?.map((product) => (
                  <ProductCard product={product} key={product._id} />
                ))}
          </Box>
        </Box>
      </Box>
      <SendMessageDialog
        open={openSendMessageDialog}
        onClose={() => setOpenSendMessageDialog(false)}
        userId={sellerId}
      />
    </PageContent>
  );
};
