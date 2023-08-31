import { IUser, IUserGetDTO } from './users.types';

export interface IResidenceType {
  id: string;
  name: string;
}

export type IResidenceTypePostDTO = Omit<IResidenceType, 'id'>;

export interface IResidence {
  id: string;
  name: string;
  description: string;
  type: IResidenceType;
  isPublished: boolean;
  owner: IUser;
}

export interface IResidenceGetDTO {
  id: string;
  name: string;
  description: string;
  type: IResidenceType;
  isPublished: boolean;
  owner: IUserGetDTO;
}

export interface IResidencePostDTO {
  name: string;
  description: string;
  typeId: string;
  ownerId: string;
}

export interface IResidencePutDTO {
  id: string;
  name: string;
  description: string;
  typeId: string;
  isPublished: boolean;
  ownerId: string;
}
