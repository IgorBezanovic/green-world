import { useAuth } from '@green-world/context/AuthContext';
import { ElementType } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({
  element: Component,
  ...rest
}: {
  element: ElementType;
}) => {
  const { userId } = useAuth();

  return userId ? <Component {...rest} /> : <Navigate to="/login" />;
};
