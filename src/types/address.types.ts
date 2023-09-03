import { ICity } from './city.types';
import { IResidence, IResidenceGetDTO } from './residence.types';

export interface IAddress {
  id: string;
  residence: IResidence;
  street: string;
  city: ICity;
  additional: string;
}

export interface IAddressGetDTO {
  id: string;
  residence: IResidenceGetDTO;
  street: string;
  city: ICity; // ne trebam DTO jer je identičan
  additional: string;
}

export interface IAddressPutDTO {
  id: string;
  residenceId: string;
  street: string;
  cityId: string;
  additional: string;
}

export interface IAddressPostDTO {
  residenceId: string;
  street: string;
  cityId: string;
  additional: string;
}

export interface ICustomAddressDTO {
  id: string;
  street: string;
  city: ICity;
  additional: string;
}
