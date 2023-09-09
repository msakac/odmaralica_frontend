import { IUser, IUserGetDTO } from './users.types';

export interface IPrivacyRequest {
  id: string;
  createdAt: string;
  user: IUser;
  reason: string;
  accepted: boolean;
  revoked: boolean;
  acceptedBy: IUser;
}

export interface IPrivacyRequestPostDTO {
  userId: string;
  reason: string;
  accepted: boolean;
  revoked: boolean;
}

export interface IPrivacyRequestGetDTO {
  id: string;
  createdAt: string;
  user: IUserGetDTO;
  reason: string;
  accepted: boolean;
  revoked: boolean;
  acceptedBy: IUserGetDTO;
}

export interface IPrivacyRequestPutDTO {
  id: string;
  createdAt: string;
  userId: string;
  reason: string;
  accepted: boolean;
  revoked: boolean;
  acceptedById?: string;
}
