import { IAuthenticatedUserDTO, IUser, IUserGetDTO } from './users.types';

/* Login */
export type ILoginRequestDTO = Pick<IUser, 'email' | 'password'>;
export interface ILoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: IAuthenticatedUserDTO;
}

export interface ILoginOpenAuthRequestDTO {
  token: string;
}

/* Register */
export type IRegisterRequestDTO = Omit<IUser, 'id' | 'activated' | 'role'>;
export interface IRegisterResponseDTO {
  user: IUserGetDTO;
}

export interface ITokenPayload {
  token: string;
  expires: string;
}

export interface AccessAndRefreshTokens {
  access: ITokenPayload;
  refresh: ITokenPayload;
}

export type AuthState = {
  user: IAuthenticatedUserDTO | null;
  token: ITokenPayload['token'] | null;
};

export interface ILogoutRequest {
  refreshToken: ITokenPayload['token'];
}

export interface IRefreshTokenRequest {
  refreshToken: ITokenPayload['token'];
}

export type IForgotPasswordRequest = Pick<IUser, 'email'>;

export type IResetPasswordRequestBody = Pick<IUser, 'password'>;

export type IResetPasswordRequestParams = Pick<ITokenPayload, 'token'>;

export interface IResetPasswordRequest {
  body: IResetPasswordRequestBody;
  params: IResetPasswordRequestParams;
}
