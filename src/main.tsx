import { SuspenseLoader } from '@green-world/components';
import { AuthProvider } from '@green-world/context/AuthContext';
import { store } from '@green-world/context/store';
import { routes } from '@green-world/routes';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@green-world/styles.css';

const queryClient = new QueryClient();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<SuspenseLoader />}>
              <RouterProvider router={router} />
              <ToastContainer />
            </Suspense>
          </QueryClientProvider>
        </HelmetProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
