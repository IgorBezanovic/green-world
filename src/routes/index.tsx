import { Layout } from '@green-world/components/Layout';
import { Home } from '@green-world/views/Home';
import { Login } from '@green-world/views/Login';

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
