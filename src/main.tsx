import { Loader } from '@green-world/components';
import { SuccessProvider } from '@green-world/context/PopupContext';
import { UserContextProvider } from '@green-world/context/UserContext';
import { routes } from '@green-world/routes';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@green-world/styles.css';

const queryClient = new QueryClient();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <SuccessProvider>
            <Suspense fallback={<Loader />}>
              <RouterProvider router={router} />
              <ToastContainer />
            </Suspense>
          </SuccessProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
