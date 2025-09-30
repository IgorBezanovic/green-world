import {
  ChangePasswordComponent,
  EditUserData,
  EditUserImageSection,
  ProtectedRoute,
  GoogleAnalytics
} from '@green-world/components';
import { Layout } from '@green-world/components/Layout';
import {
  ContactUs,
  Event,
  Home,
  Products,
  CreateEditProduct,
  ForgotPassword,
  Login,
  NotFound,
  ProductPage,
  ProfileSettings,
  PrivacyPolicy,
  Registration,
  UserProfile,
  CreateEditEvent,
  AdminPanel,
  UsersPage,
  Events,
  Shops
} from '@green-world/views';
import { Navigate } from 'react-router';

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
        path: '/profile',
        element: <ProtectedRoute element={UserProfile} />
      },
      {
        path: '/user/:userId',
        element: <ProtectedRoute element={UsersPage} />
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
            element: <ChangePasswordComponent />
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
        path: '/product/:productId',
        element: <ProductPage />
      },
      {
        path: '/event/:eventId',
        element: <Event />
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
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
