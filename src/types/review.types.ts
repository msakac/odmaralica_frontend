/* eslint-disable import/no-cycle */
import { IResidence, IResidenceGetDTO } from './residence.types';
import { IUser, IUserGetDTO } from './users.types';

export interface IReview {
  id: string;
  user: IUser;
  residence: IResidence;
  grade: number;
  message: string;
}

export interface IReviewPutDTO {
  id: string;
  userId: string;
  residenceId: string;
  grade: number;
  message: string;
}

export interface IReviewPostDTO {
  userId: string;
  residenceId: string;
  grade: string;
  message: string;
}

export interface IReviewGetDTO {
  id: string;
  user: IUserGetDTO;
  residence: IResidenceGetDTO;
  grade: number;
  message: string;
}

export interface ICustomReviewGetDTO {
  id: string;
  user: IUserGetDTO;
  grade: number;
  message: string;
}
