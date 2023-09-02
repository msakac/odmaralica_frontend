import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStatusCode } from 'http-status-codes';
import { selectAuthentication } from 'app/store';
import { useLoginOpenAuthMutation } from 'api/auth.api';
import routes from 'routes/routes';
import { loginUser } from 'app/authenticationSlice';
import Loader from 'components/common/Loader';

function getUrlParameter(name: string) {
  const idk = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${idk}=([^&#]*)`);

  const results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginOpenAuthUserApi] = useLoginOpenAuthMutation();

  const { accessToken } = useSelector(selectAuthentication);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  useEffect(() => {
    const token = getUrlParameter('token');

    // If user is already logged in or token is not present, redirect to home
    if (!token || accessToken) {
      navigate(routes.Home.relativePath);
    }
    // Fetch data from API
    const fetchData = async () => {
      await loginOpenAuthUserApi({ token })
        .unwrap()
        .then((payload) => {
          if (getStatusCode(payload.status) === 200) setIsSuccess(true);
          sessionStorage.setItem('accessToken', payload.data.accessToken);
          sessionStorage.setItem('refreshToken', payload.data.refreshToken);
          dispatch(
            loginUser({
              user: payload.data.user,
              accessToken: payload.data.accessToken,
              refreshToken: payload.data.refreshToken,
            })
          );
        })
        .catch((err) => {
          setError(err.data.message);
        });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Loader show={isLoading} />
      {isSuccess && !isLoading && <Navigate to={routes.Home.absolutePath} state={{ from: location }} replace />}
      {!isSuccess && !isLoading && <Navigate to={routes.Login.absolutePath} state={{ oauthError: error }} replace />}
    </>
  );
};

export default OAuth2RedirectHandler;
// http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect
