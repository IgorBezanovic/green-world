import { getItem } from '@green-world/utils/cookie';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setAuthenticated, setUnauthenticated } from './authSlice';
import { RootState } from './store';

interface AuthContextProps {
  isAuthenticated: boolean;
  userId: string | undefined;
  userRole: string | undefined;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, userId, userRole, isInitialized } = useSelector(
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

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userId, userRole, isInitialized }}
    >
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
