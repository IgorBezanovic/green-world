import { ProtectedRoute } from '@green-world/components';
import { Layout } from '@green-world/components/Layout';
import {
  ChangePassword,
  ContactUs,
  CreateEditProduct,
  EditProfile,
  ForgotPassword,
  HomePage,
  Login,
  NotFound,
  ProductsSearchPage,
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
        element: <HomePage />
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
        path: '/edit-profile',
        element: <ProtectedRoute element={EditProfile} />
      },
      {
        path: '/contact-us',
        element: <ContactUs />
      },
      {
        path: '/change-password',
        element: <ChangePassword />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
