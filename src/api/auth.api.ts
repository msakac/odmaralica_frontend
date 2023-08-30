import api from 'app/api';
import IResponse from 'types/IResponse';
import {
  IForgotPasswordRequest,
  ILoginOpenAuthRequestDTO,
  ILoginRequestDTO,
  ILoginResponseDTO,
  ILogoutRequest,
  IRefreshTokenRequest,
  IRegisterRequestDTO,
  IRegisterResponseDTO,
  IResetPasswordRequest,
} from 'types/auth.types';
import { IAuthenticatedUserDTO } from 'types/users.types';

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
    loginOpenAuth: builder.mutation<IResponse<ILoginResponseDTO>, ILoginOpenAuthRequestDTO>({
      query: (body) => ({
        url: 'auth/login-open-auth',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    activateAccount: builder.mutation<IResponse<null>, { token: string }>({
      query: ({ token }) => ({
        url: `auth/activate?token=${token}`,
        method: 'POST',
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useActivateAccountMutation,
  useLoginOpenAuthMutation,
  useLogoutMutation,
  useRefreshTokensMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendVerificationEmailMutation,
} = authApi;
export default authApi;
