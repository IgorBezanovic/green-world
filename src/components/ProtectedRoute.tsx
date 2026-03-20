import UserContext from '@green-world/context/UserContext';
import { ElementType, useContext } from 'react';
import { Navigate } from 'react-router';

export const ProtectedRoute = ({
  element: Component,
  ...rest
}: {
  element: ElementType;
}) => {
  const { isLoading, isUserLoggedIn } = useContext(UserContext);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 360px)',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Loading...
      </div>
    );
  }

  return isUserLoggedIn ? <Component {...rest} /> : <Navigate to="/login" />;
};
