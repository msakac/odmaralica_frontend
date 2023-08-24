import api from '../../app/api';
import IResponse from '../common/definitions/IResponse';
import { IAuthenticatedUserDTO } from '../users/users.types';
import {
  IForgotPasswordRequest,
  ILoginRequestDTO,
  ILogoutRequest,
  IRefreshTokenRequest,
  IResetPasswordRequest,
  IVerifyEmailRequestParams,
  ILoginResponseDTO,
  IRegisterResponseDTO,
  IRegisterRequestDTO,
} from './auth.types';

const apiWithAuthTags = api.enhanceEndpoints({ addTagTypes: ['Auth'] });

const authApi = apiWithAuthTags.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IResponse<ILoginResponseDTO>, ILoginRequestDTO>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<IResponse<IRegisterResponseDTO>, IRegisterRequestDTO>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<IResponse<IAuthenticatedUserDTO>, ILogoutRequest>({
      query: (body) => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshTokens: builder.mutation<IResponse<ILoginResponseDTO>, IRefreshTokenRequest>({
      query: (body) => ({
        url: 'auth/refresh-tokens',
        method: 'POST',
        body,
      }),
      extraOptions: { maxRetries: 0 },
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<void, IResetPasswordRequest>({
      query: ({ body, params }) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
        params,
      }),
      invalidatesTags: ['Auth'],
    }),
    sendVerificationEmail: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/send-verification-email',
        method: 'POST',
      }),
    }),
    verifyEmail: builder.mutation<void, IVerifyEmailRequestParams>({
      query: (params) => ({
        url: 'auth/verify-email',
        method: 'POST',
        params,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokensMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} = authApi;
export default authApi;
