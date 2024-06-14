import { Layout } from '@green-world/components';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <div> 1 </div>
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
