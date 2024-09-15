import { getItem } from '@green-world/utils/cookie';
import { jwtDecode } from 'jwt-decode';
import { ElementType } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({
  element: Component,
  ...rest
}: {
  element: ElementType;
}) => {
  const token: any = jwtDecode(getItem('token') || '');

  return token._id ? <Component {...rest} /> : <Navigate to="/login" />;
};
