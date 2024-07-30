import { getItem } from '@green-world/utils/cookie';
import { ElementType } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({
  element: Component,
  ...rest
}: {
  element: ElementType;
}) => {
  const token = getItem('token');

  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};
