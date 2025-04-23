import { Loader } from '@green-world/components';
import { SuccessProvider } from '@green-world/context/PopupContext';
import { UserContextProvider } from '@green-world/context/UserContext';
import { routes } from '@green-world/routes';
import { ThemeProvider } from '@green-world/theme';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
    <ThemeProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <SuccessProvider>
              <Suspense fallback={<Loader />}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <RouterProvider router={router} />
                  <ToastContainer />
                </LocalizationProvider>
              </Suspense>
            </SuccessProvider>
          </UserContextProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
);
