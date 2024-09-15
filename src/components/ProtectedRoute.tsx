import { getItem } from '@green-world/utils/cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ElementType } from 'react';
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
  const localStorageToken = getItem('token');
  const token: false | CustomJwtPayload = localStorageToken
    ? jwtDecode(localStorageToken)
    : false;

  return token && token._id ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};
