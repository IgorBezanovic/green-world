import { ProtectedRoute } from '@green-world/components';
import { lazy } from 'react';
import { Navigate } from 'react-router';

const lazyRoute = (importer: () => Promise<any>, exportName: string) =>
  lazy(async () => {
    const module = await importer();
    return { default: module[exportName] };
  });

const Layout = lazyRoute(
  () => import('@green-world/components/Layout'),
  'Layout'
);
const EditUserChangePassword = lazyRoute(
  () => import('@green-world/components/EditUser'),
  'EditUserChangePassword'
);
const EditUserData = lazyRoute(
  () => import('@green-world/components/EditUser'),
  'EditUserData'
);
const EditUserImageSection = lazyRoute(
  () => import('@green-world/components/EditUser'),
  'EditUserImageSection'
);
const GoogleAnalytics = lazyRoute(
  () => import('@green-world/components/GoogleAnalytics'),
  'GoogleAnalytics'
);
const UserStatistics = lazyRoute(
  () => import('@green-world/components/UserStatistics'),
  'UserStatistics'
);

const AdminPanel = lazyRoute(
  () => import('@green-world/views/AdminPanel'),
  'AdminPanel'
);
const BlogPost = lazyRoute(
  () => import('@green-world/views/BlogPost'),
  'BlogPost'
);
const BlogPostPage = lazyRoute(
  () => import('@green-world/views/BlogPostPage'),
  'BlogPostPage'
);
const ContactUs = lazyRoute(
  () => import('@green-world/views/ContactUs'),
  'ContactUs'
);
const CreateEditEvent = lazyRoute(
  () => import('@green-world/views/CreateEditEvent'),
  'CreateEditEvent'
);
const CreateEditProduct = lazyRoute(
  () => import('@green-world/views/CreateEditProduct'),
  'CreateEditProduct'
);
const CreateEditService = lazyRoute(
  () => import('@green-world/views/CreateEditService'),
  'CreateEditService'
);
const Documents = lazyRoute(
  () => import('@green-world/views/Documents'),
  'Documents'
);
const Event = lazyRoute(() => import('@green-world/views/Event'), 'Event');
const Events = lazyRoute(() => import('@green-world/views/Events'), 'Events');
const ForgotPassword = lazyRoute(
  () => import('@green-world/views/ForgotPassword'),
  'ForgotPassword'
);
const Home = lazyRoute(() => import('@green-world/views/Home'), 'Home');
const IncreaseCapacity = lazyRoute(
  () => import('@green-world/views/IncreaseCapacity'),
  'IncreaseCapacity'
);
const Login = lazyRoute(() => import('@green-world/views/Login'), 'Login');
const Message = lazyRoute(
  () => import('@green-world/views/Message'),
  'Message'
);
const NotFound = lazyRoute(
  () => import('@green-world/views/NotFound'),
  'NotFound'
);
const OrderProduct = lazyRoute(
  () => import('@green-world/views/OrderProduct'),
  'OrderProduct'
);
const PrivacyPolicy = lazyRoute(
  () => import('@green-world/views/PrivacyPolicy'),
  'PrivacyPolicy'
);
const ProductPage = lazyRoute(
  () => import('@green-world/views/ProductPage'),
  'ProductPage'
);
const Products = lazyRoute(
  () => import('@green-world/views/Products'),
  'Products'
);
const ProfileSettings = lazyRoute(
  () => import('@green-world/views/ProfileSettings'),
  'ProfileSettings'
);
const PromoBundle = lazyRoute(
  () => import('@green-world/views/PromoBundle'),
  'PromoBundle'
);
const PromoteProduct = lazyRoute(
  () => import('@green-world/views/PromoteProduct'),
  'PromoteProduct'
);
const PromoteShop = lazyRoute(
  () => import('@green-world/views/PromoteShop'),
  'PromoteShop'
);
const Registration = lazyRoute(
  () => import('@green-world/views/Registration'),
  'Registration'
);
const ServiceDetailsPage = lazyRoute(
  () => import('@green-world/views/ServiceDetails'),
  'ServiceDetailsPage'
);
const ServiceListingPage = lazyRoute(
  () => import('@green-world/views/ServiceListing'),
  'ServiceListingPage'
);
const ShopPage = lazyRoute(
  () => import('@green-world/views/ShopPage'),
  'ShopPage'
);
const Shops = lazyRoute(() => import('@green-world/views/Shops'), 'Shops');
const UserProfile = lazyRoute(
  () => import('@green-world/views/UserProfile'),
  'UserProfile'
);
const WritePost = lazyRoute(
  () => import('@green-world/views/WritePost'),
  'WritePost'
);

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/registration',
        element: <Registration />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/blog',
        element: <BlogPost />
      },
      {
        path: '/blog/:postId',
        element: <BlogPostPage />
      },
      {
        path: '/write-post',
        element: <ProtectedRoute element={WritePost} />
      },
      {
        path: '/write-post/:postId',
        element: <ProtectedRoute element={WritePost} />
      },
      {
        path: '/profile',
        element: <ProtectedRoute element={UserProfile} />
      },
      {
        path: '/profile-settings',
        element: <ProtectedRoute element={ProfileSettings} />,
        children: [
          {
            path: '/profile-settings/edit-profile',
            element: <EditUserData />
          },
          {
            path: '/profile-settings/change-image',
            element: <EditUserImageSection />
          },
          {
            path: '/profile-settings/change-password',
            element: <EditUserChangePassword />
          },
          {
            path: '/profile-settings/statistics',
            element: <UserStatistics />
          }
        ]
      },
      {
        path: '/create-product',
        element: <ProtectedRoute element={CreateEditProduct} />
      },
      {
        path: '/edit-product/:productId',
        element: <ProtectedRoute element={CreateEditProduct} />
      },
      {
        path: '/search',
        element: <Products />
      },
      {
        path: '/search/:category',
        element: <Products />
      },
      {
        path: '/contact-us',
        element: <ContactUs />
      },
      {
        path: '/message',
        element: <Message />
      },
      {
        path: '/product/:productId',
        element: <ProductPage />
      },
      {
        path: '/order-product/:productId',
        element: <ProtectedRoute element={OrderProduct} />
      },
      {
        path: '/event/:eventId',
        element: <Event />
      },
      {
        path: '/documents',
        element: <Documents />
      },
      {
        path: '/create-event',
        element: <ProtectedRoute element={CreateEditEvent} />
      },
      {
        path: '/edit-event/:eventID',
        element: <ProtectedRoute element={CreateEditEvent} />
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: '/promote-product',
        element: <ProtectedRoute element={PromoteProduct} />
      },
      {
        path: '/promote-shop',
        element: <ProtectedRoute element={PromoteShop} />
      },
      {
        path: '/increase-capacity',
        element: <ProtectedRoute element={IncreaseCapacity} />
      },
      {
        path: '/promo-bundle',
        element: <ProtectedRoute element={PromoBundle} />
      },
      {
        path: '/admin',
        element: <ProtectedRoute element={AdminPanel} />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/google-analytics" replace />
          },
          {
            path: '/admin/google-analytics',
            element: <GoogleAnalytics />
          }
        ]
      },
      {
        path: '/events',
        element: <Events />
      },
      {
        path: '/shops',
        element: <Shops />
      },
      {
        path: '/shop/:userId',
        element: <ShopPage />
      },
      {
        path: '/services',
        element: <ServiceListingPage />
      },
      {
        path: '/services/create',
        element: <ProtectedRoute element={CreateEditService} />
      },
      {
        path: '/services/:serviceId',
        element: <ServiceDetailsPage />
      },
      {
        path: '/services/:serviceId/edit',
        element: <ProtectedRoute element={CreateEditService} />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
