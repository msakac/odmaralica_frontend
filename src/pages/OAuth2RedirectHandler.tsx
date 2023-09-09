import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStatusCode } from 'http-status-codes';
import { selectAuthentication } from 'app/store';
import { useLoginOpenAuthMutation } from 'api/auth.api';
import routes from 'routes/routes';
import { loginUser } from 'app/authenticationSlice';
import Loader from 'components/common/Loader';
import { IImageData } from 'types/IImageData';
import { ILoginResponseDTO } from 'types/auth.types';
import IResponse from 'types/IResponse';
import { useLazyFindImagesQuery } from 'api/images.api';
import axios from 'axios';

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
  const [fetchImage] = useLazyFindImagesQuery();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFetchingImages, setIsFetchingImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const setStorageAndNavigate = (payload: IResponse<ILoginResponseDTO>, image?: IImageData) => {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
      localStorage.setItem('accessToken', payload.data.accessToken);
      localStorage.setItem('refreshToken', payload.data.refreshToken);
    } else {
      sessionStorage.setItem('accessToken', payload.data.accessToken);
      sessionStorage.setItem('refreshToken', payload.data.refreshToken);
    }
    dispatch(
      loginUser({
        user: { ...payload.data.user, image },
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
      })
    );
  };
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
          fetchImage({ q: `user.id=${payload.data.user.id}` })
            .unwrap()
            .then((data) => {
              if (data.data.length === 0) {
                setStorageAndNavigate(payload, {} as IImageData);
              } else {
                const imageUrl = `http://192.168.1.11:8080/image/${data.data[0]}`;
                setIsFetchingImage(true);
                axios.get(imageUrl, { responseType: 'arraybuffer' }).then((response) => {
                  const base64Image = btoa(
                    new Uint8Array(response.data).reduce((dta, byte) => dta + String.fromCharCode(byte), '')
                  );
                  const imageData: IImageData = { image: `data:image/png;base64,${base64Image}`, id: data.data[0] };
                  setStorageAndNavigate(payload, imageData);
                });
              }
            });
          if (getStatusCode(payload.status) === 200) setIsSuccess(true);
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
      {isSuccess && !isLoading && !isFetchingImages && (
        <Navigate to={routes.Home.absolutePath} state={{ from: location }} replace />
      )}
      {!isSuccess && !isLoading && <Navigate to={routes.Login.absolutePath} state={{ oauthError: error }} replace />}
    </>
  );
};

export default OAuth2RedirectHandler;
// http://192.168.1.11:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect
