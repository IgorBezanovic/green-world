import { SuspenseLoader } from '@green-world/components';
import { store } from '@green-world/context/store';
import { routes } from '@green-world/routes';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@green-world/styles.css';
import { AuthProvider } from './context/AuthContext';
const queryClient = new QueryClient();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<SuspenseLoader />}>
            <RouterProvider router={router} />
            <ToastContainer />
          </Suspense>
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
