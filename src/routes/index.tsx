import { Layout } from '@green-world/components/Layout';
import {
  ForgotPassword,
  HomePage,
  Login,
  ProductsSearchPage,
  Profile,
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
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/user-registration',
        element: <UserRegistration />
      },
      {
        path: '/profile/:id',
        element: <Profile />
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
