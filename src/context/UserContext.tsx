import { useUser } from '@green-world/hooks/useUser';
import { getItem } from '@green-world/utils/cookie';
import { DecodedToken, User } from '@green-world/utils/types';
import { jwtDecode } from 'jwt-decode';
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
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
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

  return (
    <UserContext.Provider
      value={{ defaultUser, user, setUser, setUserDataInCTX, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
