import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectAuthentication } from 'app/store';
import routes from './routes';

type Props = {
  element: JSX.Element;
  restrictedTo: string[];
};

const RequireAuth = ({ element, restrictedTo }: Props) => {
  const { user } = useSelector(selectAuthentication);
  const location = useLocation();

  if (user && restrictedTo.includes(user.role.role)) {
    return element;
  }
  return <Navigate to={routes.Login.absolutePath} state={{ from: location }} replace />;
};

export default RequireAuth;
