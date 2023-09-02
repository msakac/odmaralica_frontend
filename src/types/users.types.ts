import { IImageData } from './IImageData';
import { IRole } from './role.types';

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: IRole;
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
export interface IAuthenticatedUserDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: IRole;
  activated: boolean;
  description?: string;
  phoneNumber?: string;
  image?: IImageData;
}

export type IUserGetDTO = Omit<IUser, 'password' | 'id' | 'activated' | 'role' | 'image'>;

export type IGetSingleUserRequest = Pick<IUser, 'id'>;
