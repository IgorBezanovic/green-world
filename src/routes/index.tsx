import { Layout } from '@green-world/components/Layout';
import { Home, Login } from '@green-world/views';

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
      }
    ]
  },
  {
    path: '*',
    element: <div> Not Found </div>
  }
];
