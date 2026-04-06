'use client';

import { ChatContextProvider } from '@green-world/context/ChatContext';
import { UserContextProvider } from '@green-world/context/UserContext';
import { ThemeProvider } from '@green-world/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/sr';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

dayjs.locale('sr');

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const locale = useLocale();

  return (
    <AppRouterCacheProvider>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
      >
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              <ChatContextProvider>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={locale}
                >
                  {children}
                  <ToastContainer />
                </LocalizationProvider>
              </ChatContextProvider>
            </UserContextProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </AppRouterCacheProvider>
  );
};
