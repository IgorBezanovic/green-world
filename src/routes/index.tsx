import {
  ChangePasswordComponent,
  EditUserData,
  EditUserImageSection,
  ProtectedRoute
} from '@green-world/components';
import { Layout } from '@green-world/components/Layout';
import {
  ContactUs,
  Event,
  CreateEditProduct,
  ForgotPassword,
  Home,
  Login,
  NotFound,
  ProductPage,
  ProductsSearchPage,
  ProfileSettings,
  // ProductsSearchPage,
  Registration,
  UserProfile
} from '@green-world/views';

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
        element: <ProductsSearchPage />
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
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
