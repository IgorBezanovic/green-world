import { useUser } from '@green-world/hooks/useUser';
import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken, User } from '@green-world/utils/types';
import { createContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
  defaultUser: User;
  user: User;
  setUser: (user: User) => void;
  setUserDataInCTX: (user: User) => void;
  isLoading: boolean;
}

const defaultUser: User = {
  email: '',
  name: '',
  lastname: '',
  coverImage: '',
  profileImage: '',
  shopName: '',
  phone: '',
  address: {
    street: '',
    zipCode: 0,
    city: '',
    country: ''
  },
  shopDescription: '',
  website: '',
  onlyOnline: false,
  onlyOnThisSite: false,
  socialMedia: {
    facebook: '',
    instagram: '',
    tiktok: '',
    linkedin: ''
  },
  numberOfProducts: 0,
  maxShopProducts: 25,
  numberOfActions: 0,
  numberOfBlogs: 0,
  statistics: {
    numberOfOrdersByEmail: 0,
    mostVisitedProductGroup: null,
    mostVisitedProduct: null,
    totalViews: {
      products: 0,
      actions: 0,
      blogs: 0
    },
    averageViews: {
      product: 0,
      action: 0,
      blog: 0
    },
    products: [],
    actions: [],
    blogs: [],
    contentDistribution: {
      products: 0,
      actions: 0,
      blogs: 0
    },
    engagementScore: 0
  }
};

const UserContext = createContext<UserContextType>({
  defaultUser,
  user: defaultUser,
  setUser: () => {},
  setUserDataInCTX: () => {},
  isLoading: false
});

interface ProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState(getItem('token'));
  const decodedToken = safeDecodeToken<DecodedToken>(token);
  const { data, isLoading } = useUser(
    decodedToken?._id ? decodedToken._id : '',
    true
  );

  const setUserDataInCTX = (data: User) => {
    setUser(data!);
  };

  useEffect(() => {
    if (data && !isLoading) {
      setUserDataInCTX(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    const handleLogout = () => {
      setUser(defaultUser);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  useEffect(() => {
    const handleLogin = () => {
      setToken(getItem('token'));
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogin);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogin);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ defaultUser, user, setUser, setUserDataInCTX, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
