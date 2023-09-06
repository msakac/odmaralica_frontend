import { IAccommodationUnit, IAccommodationUnitGetDTO } from './accommodationUnit.types';
import { IUser, IUserGetDTO } from './users.types';

export interface IReservation {
  id: string;
  user: IUser;
  accommodationUnit: IAccommodationUnit;
  startAt: string;
  endAt: string;
  note: string;
  createdAt: string;
  cancelled: boolean;
}

export interface IReservationPostDTO {
  userId: string;
  accommodationUnitId: string;
  startAt: string;
  endAt: string;
  isCancelled: boolean;
  note: string;
}

export interface IReservationGetDTO {
  id: string;
  user: IUserGetDTO;
  accommodationUnit: IAccommodationUnitGetDTO;
  startAt: string;
  endAt: string;
  note: string;
  createdAt: string;
  cancelled: boolean;
}

export interface IReservationPutDTO {
  id: string;
  userId: string;
  accommodationUnitId: string;
  startAt: string;
  endAt: string;
  cancelled: boolean;
  createdAt: string;
  note: string;
}
