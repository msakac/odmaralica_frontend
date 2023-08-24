import IQueryFilter from '../common/definitions/IQueryFilter';

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: {
    id: string;
    role: string;
  };
  image?: string;
  activated: boolean;
  description?: string;
  phoneNumber?: string;
}

export type IAuthenticatedUserDTO = Omit<IUser, 'password'>;

export type IUserGetDTO = Omit<IUser, 'password' | 'id' | 'activated' | 'role' | 'image' | 'phoneNumber'>;

export type ICreateUserRequest = Omit<IUser, 'id' | 'activated' | 'role'>;

export type IUserFilterFields = Pick<IUser, 'name' | 'role'>;

export type IGetUsersRequestParams = Partial<IUserFilterFields & IQueryFilter>;

export type IGetSingleUserRequest = Pick<IUser, 'id'>;

export type UserUpdateFields = Omit<IUser, 'id' | 'role' | 'activated'>;

export interface IUpdateUserRequest {
  id: IUser['id'];
  body: Partial<UserUpdateFields>;
}

export type IDeleteUserRequest = Pick<IUser, 'id'>;
