/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwtDecode from 'jwt-decode';
import Loader from '../components/Loader';
import { useGetSingleUserQuery } from '../../users/users.api';
import routes from './routes';
import IJWT from '../definitions/IJWT';

type Props = {
  element: JSX.Element;
  restrictedTo: string[];
};

const RequireAuth = ({ element, restrictedTo }: Props) => {
  const location = useLocation();
  const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  let id = '';
  if (token) {
    const decodedToken = jwtDecode<IJWT>(token);
    id = decodedToken.sub;
  }
  if (id) {
    const response = useGetSingleUserQuery({ id });

    if (response.isLoading) return <Loader />;
    const user = response.data && response.data.data;
    if (user && restrictedTo.includes(user.role.role)) {
      return element;
    }
  }
  return <Navigate to={routes.Login.absolutePath} state={{ from: location }} replace={true} />;
};

export default RequireAuth;
