import { ProtectedRoute } from '@green-world/components';
import { Layout } from '@green-world/components/Layout';
import {
  CreateAd,
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
        path: '/create-ad',
        element: <ProtectedRoute element={CreateAd} />
      },
      {
        path: '/search',
        element: <ProductsSearchPage />
      },
      {
        path: '/edit-profile',
        element: <EditProfile />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
