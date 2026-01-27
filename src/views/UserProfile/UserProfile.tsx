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
import { formatImageUrl } from '@green-world/utils/helpers';
import { BlogPost, Product } from '@green-world/utils/types';
import { Tabs, Tab, Box, InputBase, Button, useTheme } from '@mui/material';
import { Search } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import '../style.css';

export const UserProfile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isLoading } = useContext(UserContext);
  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: productsRefetch
  } = useAllUserProducts();
  const {
    data: events = [],
    isLoading: eventsLoading,
    refetch: eventsRefetch
  } = useAllUserEvents();

  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);
  const [blogsToDisplay, setBlogsToDisplay] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState('products');

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

  const {
    data: blogs = [],
    isLoading: blogsLoading,
    refetch: blogsRefetch
  } = useBlogPostsByUser(user?._id);

  useEffect(() => {
    if (!blogsLoading) {
      setBlogsToDisplay(blogs);
    }
  }, [blogs, blogsLoading]);

  const filterContent = (searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();

    if (activeTab === 'products') {
      const filtered = products.filter((product: any) =>
        product.title.toLowerCase().includes(term)
      );
      setProductsToDisplay(filtered);
    } else if (activeTab === 'events') {
      const filtered = events.filter((event: any) =>
        event.title.toLowerCase().includes(term)
      );
      setEventsToDisplay(filtered);
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
        ? ['Zeleni svet', 'Korisnicki profil', user.shopName, user.name]
            .filter(Boolean)
            .join(' | ')
        : 'Zeleni svet | Korisnicki profil',
      description: user?.shopDescription || 'Korisnicki profil Zeleni Svet',
      image:
        formatImageUrl(user?.profileImage) ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [user]
  );

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FDFFFB',
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
        {/* LEVA STRANA */}
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
          <UserInfo
            user={user}
            isUserProfile={true}
            userLoading={isLoading}
            customStyleMeta={['flex', 'flex-col']}
          />
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
            Dodaj proizvod
          </Button>
          <Button variant="contained" onClick={() => navigate('/create-event')}>
            Kreiraj aktivnost
          </Button>
          <Button variant="contained" onClick={() => navigate('/write-post')}>
            Napiši blog post
          </Button>
        </Box>

        {/* DESNA STRANA */}
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
                placeholder={`Pretrazi po nazivu ${
                  activeTab === 'products'
                    ? 'proizvoda'
                    : activeTab === 'events'
                      ? 'aktivnosti'
                      : 'blogova'
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
            <Tab label="Proizvodi" value="products" />
            <Tab label="Aktivnosti" value="events" />
            <Tab label="Moji Blogovi" value="blogs" />
          </Tabs>

          {activeTab === 'products' && (
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
              {productsToDisplay?.length > 0 ? (
                productsToDisplay.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    productsRefetch={productsRefetch}
                  />
                ))
              ) : (
                <p className="col-span-full">Još uvek niste dodali proizvode</p>
              )}
            </Box>
          )}

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
                  <EventProfileCard
                    key={event._id}
                    event={event}
                    eventsRefetch={eventsRefetch}
                  />
                ))
              ) : (
                <p className="col-span-full">Još uvek niste dodali aktivnost</p>
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
                  <BlogCard
                    key={post._id}
                    post={post}
                    blogsRefetch={blogsRefetch}
                  />
                ))
              ) : (
                <p className="col-span-full">
                  Još uvek niste dodali blog postove
                </p>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
