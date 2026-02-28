import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
import { ElementType, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

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
      const token = safeDecodeToken<DecodedToken>(localStorageToken);
      if (token && token._id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-viewHeight w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};
