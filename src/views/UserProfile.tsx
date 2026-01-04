import {
  ProductCard,
  CustomButton,
  CustomInput,
  UserInfo,
  EventProfileCard,
  MetaTags,
  AppBreadcrumbs
} from '@green-world/components';
import { BlogCard } from '@green-world/components/BlogCard';
import UserContext from '@green-world/context/UserContext';
import { useAllUserEvents } from '@green-world/hooks/useAllUserEvents';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import useBlogPostsByUser from '@green-world/hooks/useBlogPostsByUser';
import { formatImageUrl } from '@green-world/utils/helpers';
import { BlogPost, Product } from '@green-world/utils/types';
import { Card, Tabs, Tab } from '@mui/material';
import clsx from 'clsx';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import './style.css';

export const UserProfile = () => {
  const navigate = useNavigate();

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

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Korisnički profil', route: '/profile' }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
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

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'flex',
          'flex-col',
          'md:flex-row',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'gap-7'
        )}
      >
        {/* LEVA STRANA */}
        <section
          className={clsx('w-full', 'md:w-1/4', 'flex', 'flex-col', 'gap-5')}
        >
          <UserInfo
            user={user}
            isUserProfile={true}
            userLoading={isLoading}
            customStyleMeta={['flex', 'flex-col']}
          />
          <CustomButton
            text={'Dodaj proizvod'}
            type={'text'}
            onClick={() => navigate('/create-product')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton
            text={'Dodaj aktivnost'}
            type={'text'}
            onClick={() => navigate('/create-event')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton
            text={'Napiši blog post'}
            type={'text'}
            onClick={() => navigate('/write-post')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
        </section>

        {/* DESNA STRANA */}
        <section
          className={clsx('w-full', 'md:w-3/4', 'flex', 'flex-col', 'gap-5')}
        >
          <Card>
            <CustomInput
              type="text"
              placeholder={`Pretrazi po nazivu ${
                activeTab === 'products'
                  ? 'proizvoda'
                  : activeTab === 'events'
                    ? 'aktivnosti'
                    : 'blogova'
              }`}
              customStyle={['!mb-0']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                filterContent(e.target.value)
              }
            />
          </Card>

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
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
            </section>
          )}

          {activeTab === 'events' && (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
            </section>
          )}

          {activeTab === 'blogs' && (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
            </section>
          )}
        </section>
      </div>
    </div>
  );
};
