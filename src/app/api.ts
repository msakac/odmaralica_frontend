/* eslint-disable import/no-cycle */
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import IResponse from 'types/IResponse';
import { ILoginResponseDTO } from 'types/auth.types';
// Assuming you're using React Router v6
const mutex = new Mutex();

const resetAuth = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  window?.location.replace('/session-expired');
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080:8080/', // tu je pisalo localhost:8080:8080 ve sam del privatnu ipv4 adresu
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  // TODO zbog toga kaj u backendu vraca UserGetDTO ako user nije logirani, baca mi exception u frontu jer nema role
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const rememberMe = localStorage.getItem('rememberMe');
        const refreshToken = sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');

        if (refreshToken) {
          // try to get a new token
          const refreshResult = await baseQuery(
            {
              url: 'auth/refresh-token',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          );
          if (refreshResult.data) {
            const userWithTokens = refreshResult.data as IResponse<ILoginResponseDTO>;
            if (rememberMe === 'true') {
              localStorage.setItem('accessToken', userWithTokens.data.accessToken);
              localStorage.setItem('refreshToken', userWithTokens.data.refreshToken);
            } else {
              sessionStorage.setItem('accessToken', userWithTokens.data.accessToken);
              sessionStorage.setItem('refreshToken', userWithTokens.data.refreshToken);
            }
          } else {
            resetAuth();
          }
        }
      } finally {
        release();
      }
    }
    result = await baseQuery(args, api, extraOptions);
  }
  return result;
};

const api = createApi({
  reducerPath: 'rootApi',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default api;
