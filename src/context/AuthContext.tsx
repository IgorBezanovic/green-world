import { getItem } from '@green-world/utils/cookie';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setAuthenticated, setUnauthenticated } from './authSlice';
import { RootState } from './store';

interface AuthContextProps {
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated, userId, userRole } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const token = getItem('token');
    if (token) {
      dispatch(setAuthenticated());
    } else {
      dispatch(setUnauthenticated());
    }
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
