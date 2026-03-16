import {
  ProductCard,
  UserInfo,
  EventProfileCard,
  MetaTags,
  PromotionSection
} from '@green-world/components';
import { ShopStatsCard, BlogCard } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { useAllUserEvents } from '@green-world/hooks/useAllUserEvents';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import useBlogPostsByUser from '@green-world/hooks/useBlogPostsByUser';
import { useGetServices } from '@green-world/hooks/useServices';
import { formatImageUrl } from '@green-world/utils/helpers';
import { BlogPost, Product, ServiceListing } from '@green-world/utils/types';
import {
  Tabs,
  Tab,
  Box,
  InputBase,
  Button,
  useTheme,
  Alert,
  Typography,
  Card,
  IconButton
} from '@mui/material';
import { Edit2Icon, Search } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isLoading } = useContext(UserContext);
  const { data: products = [], isLoading: productsLoading } =
    useAllUserProducts();
  const { data: events = [], isLoading: eventsLoading } = useAllUserEvents();
  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError
  } = useGetServices();

  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);
  const [servicesToDisplay, setServicesToDisplay] = useState<ServiceListing[]>(
    []
  );
  const [blogsToDisplay, setBlogsToDisplay] = useState<BlogPost[]>([]);
  // const [promotedProductsToDisplay, setPromotedProductsToDisplay] = useState<
  //   Product[]
  // >([]);
  const [activeTab, setActiveTab] = useState('products');

  // const promotedProducts = useMemo(
  //   () =>
  //     products.filter(
  //       (p: Product) => p.promotedAt != null && p.promotedUntil != null
  //     ),
  //   [products]
  // );

  useEffect(() => {
    if (!productsLoading) {
      setProductsToDisplay(products);
    }
  }, [products, productsLoading]);

  useEffect(() => {
    if (!eventsLoading) {
      setEventsToDisplay(events);
    }
  }, [events, eventsLoading]);

  const userServices = useMemo(
    () =>
      services.filter((service: ServiceListing) => {
        const providerId =
          typeof service.providerId === 'string'
            ? service.providerId
            : service.providerId?._id;

        return providerId === user?._id;
      }),
    [services, user?._id]
  );

  useEffect(() => {
    if (!servicesLoading) {
      setServicesToDisplay(userServices);
    }
  }, [userServices, servicesLoading]);

  const { data: blogs = [], isLoading: blogsLoading } = useBlogPostsByUser(
    user?._id
  );

  useEffect(() => {
    if (!blogsLoading) {
      setBlogsToDisplay(blogs);
    }
  }, [blogs, blogsLoading]);

  // useEffect(() => {
  //   if (!productsLoading) {
  //     setPromotedProductsToDisplay(promotedProducts);
  //   }
  // }, [promotedProducts, productsLoading]);

  const filterContent = (searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();

    if (activeTab === 'products') {
      const filtered = products.filter((product: any) =>
        product.title.toLowerCase().includes(term)
      );
      setProductsToDisplay(filtered);
    } else if (activeTab === 'promoted') {
      // const filtered = promotedProducts.filter((p: Product) =>
      //   (p.title || '').toLowerCase().includes(term)
      // );
      // setPromotedProductsToDisplay(filtered);
    } else if (activeTab === 'events') {
      const filtered = events.filter((event: any) =>
        event.title.toLowerCase().includes(term)
      );
      setEventsToDisplay(filtered);
    } else if (activeTab === 'services') {
      const filtered = userServices.filter((service: ServiceListing) =>
        (service.title || '').toLowerCase().includes(term)
      );
      setServicesToDisplay(filtered);
    } else {
      const filtered = blogs.filter((post: any) =>
        post.title.toLowerCase().includes(term)
      );
      setBlogsToDisplay(filtered);
    }
  };

  const metaObj = useMemo(
    () => ({
      title: user
        ? [
            'Zeleni svet',
            t('breadcrumbs.userProfile'),
            user.shopName,
            user.name
          ]
            .filter(Boolean)
            .join(' | ')
        : t('seo.userProfile.fallbackTitle'),
      description:
        user?.shopDescription || t('seo.userProfile.fallbackDescription'),
      image:
        formatImageUrl(user?.profileImage) ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [user, t]
  );

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
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          py: 3.5,
          gap: 3,
          px: 2,
          [theme.breakpoints.up('sm')]: {
            px: 3
          },
          [theme.breakpoints.up('md')]: {
            flexDirection: 'row'
          },
          [theme.breakpoints.up('xl')]: {
            maxWidth: 1400,
            px: 0
          }
        }}
      >
        <Box
          component="section"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,

            [theme.breakpoints.up('md')]: {
              width: '25%'
            }
          }}
        >
          <UserInfo user={user} isUserProfile={true} userLoading={isLoading} />
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate('/profile-settings/edit-profile')}
          >
            {t('userProfileView.buttons.profileSettings')}
          </Button>
          <ShopStatsCard
            numberOfProducts={user.numberOfProducts}
            maxShopProducts={user.maxShopProducts}
            numberOfActions={user.numberOfActions}
            numberOfBlogs={user.numberOfBlogs}
          />
          <Button
            variant="contained"
            onClick={() => navigate('/create-product')}
            disabled={user?.numberOfProducts >= user?.maxShopProducts}
          >
            {t('userProfileView.buttons.addProduct')}
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/services/create')}
          >
            {t('userProfileView.buttons.addService')}
          </Button>
          <Button variant="contained" onClick={() => navigate('/create-event')}>
            {t('userProfileView.buttons.createActivity')}
          </Button>
          <Button variant="contained" onClick={() => navigate('/write-post')}>
            {t('userProfileView.buttons.writeBlogPost')}
          </Button>
          {/* WORKING TIME */}
          {user?.workingTime && (
            <Card sx={{ p: 2 }}>
              <Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography fontWeight={600} mb={2}>
                    {t('shopPage.workingHours')}
                  </Typography>
                  <IconButton
                    onClick={() =>
                      navigate('/profile-settings/edit-profile#working-hours')
                    }
                  >
                    <Edit2Icon />
                  </IconButton>
                </Box>

                {Object.entries(user.workingTime).map(([day, value]) => (
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

        <Box
          component="section"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            [theme.breakpoints.up('md')]: {
              width: '75%'
            }
          }}
        >
          <PromotionSection />
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
                placeholder={`${t('userProfileView.searchByName')} ${
                  activeTab === 'products'
                    ? t('userProfileView.contentType.products')
                    : activeTab === 'services'
                      ? t('userProfileView.contentType.services')
                      : activeTab === 'events'
                        ? t('userProfileView.contentType.activities')
                        : t('userProfileView.contentType.blogs')
                }`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  filterContent(e.target.value)
                }
                sx={{ width: '100%' }}
              />
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => setActiveTab(newValue)}
            aria-label="product-event-tabs"
          >
            <Tab label={t('userProfileView.tabs.products')} value="products" />
            <Tab label={t('userProfileView.tabs.services')} value="services" />
            {/* <Tab label="Promovisano" value="promoted" /> */}
            <Tab label={t('userProfileView.tabs.activities')} value="events" />
            <Tab label={t('userProfileView.tabs.myBlogs')} value="blogs" />
          </Tabs>

          {activeTab === 'products' && (
            <Box
              component="section"
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  productsToDisplay?.length > 0
                    ? 'repeat(2, 1fr)'
                    : 'repeat(1, 1fr)',
                gap: 3,

                [theme.breakpoints.up('sm')]: {
                  gridTemplateColumns:
                    productsToDisplay?.length > 0
                      ? 'repeat(3, 1fr)'
                      : 'repeat(1, 1fr)'
                },

                [theme.breakpoints.up('lg')]: {
                  gridTemplateColumns:
                    productsToDisplay?.length > 0
                      ? 'repeat(4, 1fr)'
                      : 'repeat(1, 1fr)'
                }
              }}
            >
              {productsToDisplay?.length > 0 ? (
                productsToDisplay.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isPromotedView={false} // Promeni kada bude islo live placanje
                  />
                ))
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {t('userProfileView.empty.products')}
                </Alert>
              )}
            </Box>
          )}

          {activeTab === 'services' && (
            <Box
              component="section"
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  servicesToDisplay?.length > 0
                    ? 'repeat(2, 1fr)'
                    : 'repeat(1, 1fr)',
                gap: 3,

                [theme.breakpoints.up('sm')]: {
                  gridTemplateColumns:
                    servicesToDisplay?.length > 0
                      ? 'repeat(3, 1fr)'
                      : 'repeat(1, 1fr)'
                },

                [theme.breakpoints.up('lg')]: {
                  gridTemplateColumns:
                    servicesToDisplay?.length > 0
                      ? 'repeat(4, 1fr)'
                      : 'repeat(1, 1fr)'
                }
              }}
            >
              {servicesLoading ? (
                <Typography>{t('aisearch.loading')}</Typography>
              ) : servicesError ? (
                <Typography color="error">
                  {t('service.errorLoading')}
                </Typography>
              ) : servicesToDisplay?.length > 0 ? (
                servicesToDisplay.map((service: ServiceListing) => (
                  <Card
                    key={service._id}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        {service.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.location ||
                          t('userProfileView.serviceLocationNotSpecified')}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="primary.main"
                        sx={{ mt: 1 }}
                      >
                        {service.priceFrom
                          ? `${service.priceFrom} RSD`
                          : t('userProfileView.servicePriceOnRequest')}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/services/${service._id}`)}
                    >
                      {t('userProfileView.viewService')}
                    </Button>
                  </Card>
                ))
              ) : (
                <Typography>{t('userProfileView.empty.services')}</Typography>
              )}
            </Box>
          )}

          {/* {activeTab === 'promoted' && (
            <Box
              component="section"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,

                [theme.breakpoints.up('sm')]: {
                  gridTemplateColumns: 'repeat(3, 1fr)'
                },

                [theme.breakpoints.up('lg')]: {
                  gridTemplateColumns: 'repeat(4, 1fr)'
                }
              }}
            >
              {promotedProductsToDisplay?.length > 0 ? (
                promotedProductsToDisplay.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isPromotedView={false} // Promeni kada bude islo live placanje
                    promotedPeriod={false} // Promeni kada bude islo live placanje
                  />
                ))
              ) : (
                <p className="col-span-full">Nemate promovisanih proizvoda</p>
              )}
            </Box>
          )} */}

          {activeTab === 'events' && (
            <Box
              component="section"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,

                [theme.breakpoints.up('sm')]: {
                  gridTemplateColumns: 'repeat(3, 1fr)'
                },

                [theme.breakpoints.up('lg')]: {
                  gridTemplateColumns: 'repeat(4, 1fr)'
                }
              }}
            >
              {eventsToDisplay?.length > 0 ? (
                eventsToDisplay.map((event: any) => (
                  <EventProfileCard key={event._id} event={event} />
                ))
              ) : (
                <Typography>{t('userProfileView.empty.activities')}</Typography>
              )}
            </Box>
          )}

          {activeTab === 'blogs' && (
            <Box
              component="section"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,

                [theme.breakpoints.up('sm')]: {
                  gridTemplateColumns: 'repeat(3, 1fr)'
                },

                [theme.breakpoints.up('lg')]: {
                  gridTemplateColumns: 'repeat(4, 1fr)'
                }
              }}
            >
              {blogsToDisplay?.length > 0 ? (
                blogsToDisplay.map((post: BlogPost) => (
                  <BlogCard key={post._id} post={post} />
                ))
              ) : (
                <Typography>{t('userProfileView.empty.blogs')}</Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
