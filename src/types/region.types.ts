import { ICountry } from './country.types';

export interface IRegion {
  id: string;
  name: string;
  country: ICountry;
}

export interface IRegionPutDTO {
  id: string;
  name: string;
  countryId: string;
}

export interface IRegionPostDTO {
  name: string;
  countryId: string;
}
