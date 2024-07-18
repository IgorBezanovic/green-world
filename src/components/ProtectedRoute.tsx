import { Loader } from '@green-world/components';
import { useAuth } from '@green-world/context/AuthContext';
import { useEffect, useState } from 'react';
import { ElementType } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({
  element: Component,
  ...rest
}: {
  element: ElementType;
}) => {
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId !== null) {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return <Loader />;
  }

  return userId ? <Component {...rest} /> : <Navigate to="/login" />;
};
