import { IRole } from './role.types';

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: IRole;
  image?: string;
  activated: boolean;
  description?: string;
  phoneNumber?: string;
}

export interface IUserPostDTO {
  name: string;
  surname: string;
  email: string;
  password: string;
  roleId: string;
  activated: boolean;
}

export type IAuthenticatedUserDTO = Omit<IUser, 'password'>;

export type IUserGetDTO = Omit<IUser, 'password' | 'id' | 'activated' | 'role' | 'image'>;

export type IGetSingleUserRequest = Pick<IUser, 'id'>;
