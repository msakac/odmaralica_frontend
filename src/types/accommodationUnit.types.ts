import { IResidence, IResidenceGetDTO } from './residence.types';

export interface IAccommodationUnit {
  id: string;
  residence: IResidence;
  name: string;
  description: string;
  unitSize: string;
  numOfGuests: string;
  beds: string;
  privateKitchen: boolean;
  privateBathroom: boolean;
  terrace: boolean;
  seaView: boolean;
  tv: boolean;
  pets: boolean;
  smoking: boolean;
}

export interface IAccommodationUnitGetDTO {
  id: string;
  residence: IResidenceGetDTO;
  name: string;
  description: string;
  unitSize: string;
  numOfGuests: string;
  beds: string;
  privateKitchen: boolean;
  privateBathroom: boolean;
  terrace: boolean;
  seaView: boolean;
  tv: boolean;
  pets: boolean;
  smoking: boolean;
}

export interface IAccommodationUnitPostDTO {
  residenceId: string;
  name: string;
  description: string;
  unitSize: string;
  numOfGuests: string;
  beds: string;
  privateKitchen: boolean;
  privateBathroom: boolean;
  terrace: boolean;
  seaView: boolean;
  tv: boolean;
  pets: boolean;
  smoking: boolean;
}

export interface IAccommodationUnitPutDTO {
  id: string;
  residenceId: string;
  name: string;
  description: string;
  unitSize: string;
  numOfGuests: string;
  beds: string;
  privateKitchen: boolean;
  privateBathroom: boolean;
  terrace: boolean;
  seaView: boolean;
  tv: boolean;
  pets: boolean;
  smoking: boolean;
}

export type IAccommodationUnitOmited = Omit<IAccommodationUnitPostDTO, 'residenceId'>;
