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
  isParkingFree?: boolean;
  isWifiFree?: boolean;
  isAirConFree?: boolean;
  distanceSea?: string;
  distanceStore?: string;
  distanceBeach?: string;
  distanceCenter?: string;
}

export interface IResidenceGetDTO {
  id: string;
  name: string;
  description: string;
  type: IResidenceType;
  isPublished: boolean;
  owner: IUserGetDTO;
  isParkingFree?: boolean;
  isWifiFree?: boolean;
  isAirConFree?: boolean;
  distanceSea?: string;
  distanceStore?: string;
  distanceBeach?: string;
  distanceCenter?: string;
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
  isParkingFree?: boolean;
  isWifiFree?: boolean;
  isAirConFree?: boolean;
  distanceSea?: string;
  distanceStore?: string;
  distanceBeach?: string;
  distanceCenter?: string;
}
