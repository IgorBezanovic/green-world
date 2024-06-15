import { Layout } from '@green-world/components/Layout';
import { Home } from '@green-world/views/home';

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
        path: '/form-generator',
        element: <div> 3 </div>
      }
    ]
  },
  {
    path: '*',
    element: <div> Not Found </div>
  }
];
