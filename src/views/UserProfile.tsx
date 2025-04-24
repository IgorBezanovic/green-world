import {
  ProductCard,
  CustomButton,
  CustomInput,
  UserInfo,
  EventProfilCard
} from '@green-world/components';
import { useAllUserEvents } from '@green-world/hooks/useAllUserEvents';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useUser } from '@green-world/hooks/useUser';
import { getItem, removeItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import { Card, Tabs, Tab } from '@mui/material';
import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import './style.css';

export const UserProfile = () => {
  const navigate = useNavigate();
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;

  const { data: userData, isLoading: userLoading } = useUser(
    decodedToken?._id || ''
  );
  const { data: products = [], isLoading: productsLoading } =
    useAllUserProducts();
  const { data: events = [], isLoading: eventsLoading } = useAllUserEvents(); // Fetch eventi

  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      setProductsToDisplay(products);
    }
  }, [products, productsLoading]);

  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      setEventsToDisplay(events);
    }
  }, [events, eventsLoading]);

  const handleLogout = () => {
    removeItem('token');
    navigate('/');
  };

  const filterContent = (searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();

    if (activeTab === 'products') {
      const filtered = products.filter((product: any) =>
        product.title.toLowerCase().includes(term)
      );
      setProductsToDisplay(filtered);
    } else {
      const filtered = events.filter((event: any) =>
        event.title.toLowerCase().includes(term)
      );
      setEventsToDisplay(filtered);
    }
  };

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Korisnicki profil</title>
        <meta property="og:image" content={`${userData?.profileImage}`} />
        <link rel="canonical" href="https://www.zeleni-svet.com/profile" />
      </Helmet>

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
            user={userData}
            userLoading={userLoading}
            customStyleMeta={['flex', 'flex-col']}
          />
          <CustomButton
            text={'Dodaj proizvod'}
            type={'text'}
            onClick={() => navigate('/create-product')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton
            text={'Podesavanje profila'}
            type={'text'}
            onClick={() => navigate('/profile-settings/edit-profile')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton
            text={'Kontaktirajte podršku'}
            type={'text'}
            onClick={() => navigate('/contact-us')}
            customStyle={['!flex-1', 'max-h-[45px]']}
          />
          <CustomButton type={'text'} onClick={handleLogout} text={'Log out'} />
        </section>

        {/* DESNA STRANA */}
        <section
          className={clsx('w-full', 'md:w-3/4', 'flex', 'flex-col', 'gap-5')}
        >
          <Card>
            <CustomInput
              type="text"
              placeholder={`Pretrazi po nazivu ${activeTab === 'products' ? 'proizvoda' : 'dogadjaja'}`}
              customStyle={['!mb-0']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                filterContent(e.target.value)
              }
            />
          </Card>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            aria-label="product-event-tabs"
          >
            <Tab label="Proizvodi" value="products" />
            <Tab label="Događaji" value="events" />
          </Tabs>

          {activeTab === 'products' && (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {productsToDisplay.length > 0 ? (
                productsToDisplay.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full">Još uvek niste dodali proizvode</p>
              )}
            </section>
          )}

          {activeTab === 'events' && (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {eventsToDisplay.length > 0 ? (
                eventsToDisplay.map((event: any) => (
                  <EventProfilCard key={event._id} event={event} />
                ))
              ) : (
                <p className="col-span-full">Još uvek niste dodali događaje</p>
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  );
};
