import { IRegion } from './region.types';

export interface ICity {
  id: string;
  name: string;
  zip: string;
  region: IRegion;
}

export interface ICityPostDTO {
  name: string;
  zip: string;
  regionId: string;
}

export interface ICityPutDTO {
  id: string;
  name: string;
  zip: string;
  regionId: string;
}
