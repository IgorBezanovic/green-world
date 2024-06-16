import { Layout } from '@green-world/components/Layout';
import { ForgotPassword, Home, Login } from '@green-world/views';

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
        path: '/users',
        element: <div> 2 </div>
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      }
    ]
  },
  {
    path: '*',
    element: <div> Not Found </div>
  }
];
