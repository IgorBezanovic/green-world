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
  GroupProducts,
  Home,
  Products,
  CreateEditProduct,
  ForgotPassword,
  Login,
  NotFound,
  ProductPage,
  ProfileSettings,
  // ProductsSearchPage,
  Registration,
  UserProfile,
  CreateEditEvent
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
        element: <Products />
      },
      {
        path: '/search/:category',
        element: <GroupProducts />
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
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
