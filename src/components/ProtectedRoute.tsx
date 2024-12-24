import { getItem } from '@green-world/utils/cookie';
import clsx from 'clsx';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ElementType, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export const ProtectedRoute = ({
  element: Component,
  ...rest
}: {
  element: ElementType;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const localStorageToken = getItem('token');
    if (localStorageToken) {
      try {
        const token = jwtDecode<CustomJwtPayload>(localStorageToken);
        if (token && token._id) {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div
        className={clsx(
          'min-h-viewHeight',
          'w-full',
          'flex',
          'justify-center',
          'items-center'
        )}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};
