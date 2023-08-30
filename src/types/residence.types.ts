import { IUser, IUserGetDTO } from './users.types';

export interface IResidence {
  id: string;
  name: string;
  description: string;
  type: string;
  isPublished: boolean;
  owner: IUser;
}

export interface IResidenceGetDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  isPublished: boolean;
  owner: IUserGetDTO;
}

export interface IResidencePostDTO {
  name: string;
  description: string;
  type: string;
  ownerId: string;
}

export interface IResidencePutDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  isPublished: boolean;
  ownerId: string;
}
