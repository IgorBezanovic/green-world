import { ProtectedRoute } from '@green-world/components';
import { Layout } from '@green-world/components/Layout';
import {
  ForgotPassword,
  HomePage,
  Login,
  ProductsSearchPage,
  Registration,
  UserProfile,
  UserRegistration
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
        path: '/user-registration',
        element: <UserRegistration />
      },
      {
        path: '/profile',
        element: <ProtectedRoute element={UserProfile} />
      },
      {
        path: '/search',
        element: <ProductsSearchPage />
      }
    ]
  },
  {
    path: '*',
    element: <div> Not Found </div>
  }
];
